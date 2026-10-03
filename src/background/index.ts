import browser from 'webextension-polyfill';
import * as ort from 'onnxruntime-web';
import { ModelDbService } from '../shared/model-db';
import { StorageService } from '../shared/storage';
import { TranslationCacheDb } from '../shared/translation-db';
import { DialogueItem } from '../shared/types';
import { TranslationProviderFactory } from '../services/translation/provider-factory';
import { PaddleDetEngine } from '../worker/paddle-det';
import { PaddleRecEngine } from '../worker/paddle-rec';

// Configure ONNX Runtime for background environment
ort.env.wasm.wasmPaths = browser.runtime.getURL('');
ort.env.wasm.numThreads = 1; // Single-thread SIMD: 100% compatible with MV3 background
ort.env.wasm.simd = true;

let detEngine: PaddleDetEngine | null = null;
let recEngine: PaddleRecEngine | null = null;
let activeModelId: string | null = null;
let isInitializingModel = false;

async function ensureModelLoaded(modelId: string): Promise<void> {
  if (detEngine && recEngine && activeModelId === modelId) {
    return;
  }
  if (isInitializingModel) {
    while (isInitializingModel) {
      await new Promise((r) => setTimeout(r, 100));
    }
    if (detEngine && recEngine && activeModelId === modelId) return;
  }

  isInitializingModel = true;
  try {
    const status = await ModelDbService.getModelStatus(modelId);
    if (status.status !== 'ready') {
      throw new Error(`Model OCR "${modelId}" chưa được tải. Vui lòng mở popup tiện ích để tải model.`);
    }

    const buffers = await ModelDbService.getModelBuffers(modelId);
    const sessionOpts: ort.InferenceSession.SessionOptions = {
      executionProviders: ['wasm'],
      graphOptimizationLevel: 'all'
    };

    const [detSession, recSession] = await Promise.all([
      ort.InferenceSession.create(buffers.detBuffer, sessionOpts),
      ort.InferenceSession.create(buffers.recBuffer, sessionOpts)
    ]);

    detEngine = new PaddleDetEngine(detSession);
    recEngine = new PaddleRecEngine(recSession, buffers.keysText);
    activeModelId = modelId;
  } catch (err: any) {
    console.error('[SpeedySlate Background] Model init error:', err);
    throw new Error(`Lỗi nạp model OCR: ${err?.message || String(err)}`);
  } finally {
    isInitializingModel = false;
  }
}

async function getImageBitmapFromInput(dataUrl?: string, imageUrl?: string): Promise<ImageBitmap> {
  if (dataUrl) {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return await createImageBitmap(blob);
  }
  if (imageUrl) {
    // Background fetch bypasses CORS
    const res = await fetch(imageUrl);
    const blob = await res.blob();
    return await createImageBitmap(blob);
  }
  throw new Error('Thiếu dữ liệu ảnh (dataUrl hoặc imageUrl)');
}

browser.runtime.onMessage.addListener(async (rawMsg: any) => {
  const msg = rawMsg;

  try {
    switch (msg.action) {
      case 'PING':
        return { success: true, message: 'SpeedySlate Background Ready' };

      case 'CHECK_MODEL_STATUS': {
        const settings = await StorageService.getSettings();
        const modelId = msg.modelId || settings.activeOcrModelId || 'paddle-en-slim';
        const status = await ModelDbService.getModelStatus(modelId);
        return { success: true, status };
      }

      case 'CLEAR_CHAPTER_CACHE': {
        const deleted = await TranslationCacheDb.clearChapterCache(msg.chapterUrl);
        return { success: true, deleted };
      }

      case 'GET_CHAPTER_TRANSLATIONS': {
        const { imageUrls } = msg;
        const results: Record<string, any> = {};
        if (Array.isArray(imageUrls)) {
          for (const url of imageUrls) {
            const cached = await TranslationCacheDb.getTranslation(url);
            if (cached && cached.dialogues?.length > 0) {
              results[url] = cached;
            }
          }
        }
        return { success: true, translations: results };
      }

      case 'TRANSLATE_IMAGE': {
        const { imageUrl, chapterUrl, dataUrl } = msg;

        // 1. Kiểm tra cache IndexedDB trước
        if (imageUrl) {
          const cached = await TranslationCacheDb.getTranslation(imageUrl);
          if (cached && cached.dialogues?.length > 0) {
            return {
              success: true,
              cached: true,
              dialogues: cached.dialogues,
              naturalWidth: cached.naturalWidth,
              naturalHeight: cached.naturalHeight
            };
          }
        }

        // 2. Nạp Model OCR trong Background
        const settings = await StorageService.getSettings();
        const modelId = settings.activeOcrModelId || 'paddle-en-slim';
        try {
          await ensureModelLoaded(modelId);
        } catch (err: any) {
          return { success: false, error: err.message };
        }

        if (!detEngine || !recEngine) {
          return { success: false, error: 'Không thể khởi tạo engine OCR' };
        }

        // 3. Lấy ảnh và vẽ lên OffscreenCanvas
        const bitmap = await getImageBitmapFromInput(dataUrl, imageUrl);
        const width = bitmap.width;
        const height = bitmap.height;

        const canvas = new OffscreenCanvas(width, height);
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Không thể tạo 2D context');
        ctx.drawImage(bitmap, 0, 0);
        bitmap.close();

        // 4. Chạy PaddleOCR
        const boxes = await detEngine.detectText(canvas, width, height);
        const dialogues: DialogueItem[] = await recEngine.recognizeBoxes(canvas, boxes);

        if (dialogues.length === 0) {
          return { success: true, cached: false, dialogues: [], naturalWidth: width, naturalHeight: height };
        }

        // 5. Dịch bằng API Text (Gemini / OpenAI-compatible)
        const texts = dialogues.map((d) => d.originalText);
        const provider = TranslationProviderFactory.createProvider(settings);
        const targetLang = settings.targetLanguage || 'Tiếng Việt';
        const translations = await provider.translateDialogues(texts, targetLang);

        dialogues.forEach((d, i) => {
          d.translatedText = translations[i] || d.originalText;
        });

        // 6. Lưu vào Cache DB
        if (imageUrl) {
          await TranslationCacheDb.saveTranslation(imageUrl, chapterUrl || '', dialogues, width, height);
        }

        return {
          success: true,
          cached: false,
          dialogues,
          naturalWidth: width,
          naturalHeight: height
        };
      }

      case 'TEST_CONNECTION': {
        const settings = await StorageService.getSettings();
        const provider = TranslationProviderFactory.createProvider(settings, msg.providerType);
        const ok = await provider.testConnection();
        return { success: ok };
      }

      default:
        return { success: false, error: 'Action không hợp lệ' };
    }
  } catch (err: any) {
    console.error('[SpeedySlate Background] Error:', err);
    return { success: false, error: err?.message || 'Lỗi xử lý trong background' };
  }
});

console.log('[SpeedySlate] Background AI Service Initialized');
