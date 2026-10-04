import browser from 'webextension-polyfill';
import { StorageService } from '../shared/storage';
import { TranslationCacheDb } from '../shared/translation-db';
import { ModelDbService } from '../shared/model-db';
import { DialogueItem } from '../shared/types';
import { API_PRESETS, OCR_MODEL_PRESETS } from '../shared/presets';
import { TranslationProviderFactory } from '../services/translation/provider-factory';
import { ApiRateLimiter } from '../services/translation/rate-limiter';
import { ApiKeyRotator } from '../services/translation/api-key-rotator';
import { ocrWorkerClient } from './ocr-worker-client';
import { ImageFetcher } from './image-fetcher';
import { DebugLogger } from '../shared/debug-logger';

// ---------------------------------------------------------------------------
// Global error catching for Background Service Worker / Event Page
// ---------------------------------------------------------------------------
if (typeof self !== 'undefined') {
  self.addEventListener('error', (event: any) => {
    DebugLogger.error('Background:GlobalError', event.message || String(event), event.error);
  });
  self.addEventListener('unhandledrejection', (event: any) => {
    DebugLogger.error('Background:UnhandledRejection', event.reason?.message || String(event.reason), event.reason);
  });
}

// NOTE: ONNX Runtime (onnxruntime-web) MUST NOT be imported here.
// Chrome MV3 Service Workers forbid dynamic import() which ONNX uses internally.
// All ONNX inference runs inside Dedicated Web Worker / Offscreen Document.
// ---------------------------------------------------------------------------

async function handleBackgroundMessage(msg: any): Promise<any> {
  try {
    switch (msg.action) {
      case 'PING':
        return { success: true, message: 'SpeedySlate Background Ready' };

      // ── Status: which backend is the OCR worker running on ──────────────
      case 'GET_OCR_STATUS': {
        return {
          success: true,
          backend: ocrWorkerClient.activeBackend ?? 'idle'
        };
      }

      // ── Pre-warm OCR backend if model is ready ──────────────────────────
      case 'WARMUP_OCR': {
        const settings = await StorageService.getSettings();
        const modelId = settings.activeOcrModelId || OCR_MODEL_PRESETS[0]?.id || 'pp-ocrv4-english';
        const modelStatus = await ModelDbService.getModelStatus(modelId);
        if (modelStatus.status === 'ready') {
          await ocrWorkerClient.ensureModelLoaded(modelId, settings.useWebGpu ?? true);
        }
        return {
          success: true,
          backend: ocrWorkerClient.activeBackend ?? 'idle'
        };
      }

      // ── Setting changed: reset model so next OCR picks up new backend ───
      case 'SET_WEBGPU': {
        await ocrWorkerClient.resetForBackendChange();
        const settings = await StorageService.getSettings();
        const modelId = settings.activeOcrModelId || OCR_MODEL_PRESETS[0]?.id || 'pp-ocrv4-english';
        const modelStatus = await ModelDbService.getModelStatus(modelId);
        if (modelStatus.status === 'ready') {
          await ocrWorkerClient.ensureModelLoaded(modelId, settings.useWebGpu ?? true);
        }
        return {
          success: true,
          backend: ocrWorkerClient.activeBackend ?? 'idle'
        };
      }

      case 'CHECK_MODEL_STATUS': {
        const settings = await StorageService.getSettings();
        const modelId = msg.modelId || settings.activeOcrModelId || OCR_MODEL_PRESETS[0]?.id || 'pp-ocrv4-english';
        const status = await ModelDbService.getModelStatus(modelId);
        return { success: true, status };
      }

      case 'DELETE_MODEL': {
        const { modelId } = msg;
        if (modelId) {
          await ModelDbService.deleteModel(modelId);
          if (ocrWorkerClient.currentModelId === modelId) {
            await ocrWorkerClient.resetForBackendChange();
          }
        }
        return { success: true };
      }

      case 'CLEAR_CHAPTER_CACHE': {
        const deleted = await TranslationCacheDb.clearChapterCache(msg.chapterUrl);
        return { success: true, deleted };
      }

      case 'CLEAR_ALL_CACHE': {
        await TranslationCacheDb.clearAllCache();
        return { success: true };
      }

      case 'GET_CHAPTER_TRANSLATIONS': {
        const { imageUrls } = msg;
        const results: Record<string, any> = {};
        if (Array.isArray(imageUrls)) {
          for (const url of imageUrls) {
            const cached = await TranslationCacheDb.getTranslation(url);
            if (cached) results[url] = cached;
          }
        }
        return { success: true, translations: results };
      }

      case 'OCR_IMAGE': {
        const { imageUrl, dataUrl } = msg;

        // 1. Check IndexedDB cache first (only return if non-empty valid dialogues exist)
        if (imageUrl) {
          const cached = await TranslationCacheDb.getTranslation(imageUrl);
          if (cached && Array.isArray(cached.dialogues) && cached.dialogues.length > 0) {
            return {
              success: true,
              cached: true,
              dialogues: cached.dialogues,
              naturalWidth: cached.naturalWidth,
              naturalHeight: cached.naturalHeight
            };
          }
        }

        const settings = await StorageService.getSettings();

        // 2. Multimodal Vision AI Mode (Direct End-to-End Image Translation)
        if (settings.translationMode === 'vision_ai') {
          try {
            const provider = TranslationProviderFactory.createProvider(settings);
            if (!provider.translateImage) {
              return {
                success: false,
                error: `Nhà cung cấp ${settings.activeProvider} chưa hỗ trợ Multimodal Vision AI.`
              };
            }

            const { base64Data, mimeType } = await ImageFetcher.getBase64Data(dataUrl, imageUrl);
            const targetLang = settings.targetLanguage || 'Tiếng Việt';
            const width = msg.naturalWidth || msg.width || 800;
            const height = msg.naturalHeight || msg.height || 1200;

            const rawKey = settings.providers[settings.activeProvider]?.apiKey || '';
            const keyCount = ApiKeyRotator.parseKeys(rawKey).length;
            const baseDelay =
              settings.rateLimitDelayMs !== undefined
                ? settings.rateLimitDelayMs
                : (API_PRESETS[settings.activeProvider]?.defaultDelayMs ?? 1500);

            // Multiple keys reduce required delay proportionally (min 200ms)
            const minDelayMs = keyCount > 1
              ? Math.max(200, Math.round(baseDelay / keyCount))
              : baseDelay;

            const dialogues = await ApiRateLimiter.throttle(minDelayMs, () =>
              provider.translateImage!(base64Data, mimeType, targetLang, width, height)
            );

            // Save to Cache DB
            if (imageUrl && dialogues.length > 0) {
              await TranslationCacheDb.saveTranslation(
                imageUrl,
                msg.chapterUrl || '',
                dialogues,
                width,
                height
              );
            }

            return {
              success: true,
              cached: false,
              isDirectTranslation: true,
              dialogues,
              naturalWidth: width,
              naturalHeight: height
            };
          } catch (err: any) {
            DebugLogger.error('Background:VisionAI', err.message, err);
            return { success: false, error: err.message || 'Lỗi nhận diện Vision AI' };
          }
        }

        // 3. Hybrid OCR Mode: Load OCR model via Dedicated Worker / Offscreen
        const modelId = settings.activeOcrModelId || OCR_MODEL_PRESETS[0]?.id || 'pp-ocrv4-english';
        try {
          await ocrWorkerClient.ensureModelLoaded(modelId, settings.useWebGpu ?? true);
        } catch (err: any) {
          return { success: false, error: err.message };
        }

        // 4. Run PaddleOCR / Comic-Det in Web Worker
        try {
          const { dialogues, width, height } = await ocrWorkerClient.runOcr({ dataUrl, imageUrl });
          return { success: true, cached: false, dialogues, naturalWidth: width, naturalHeight: height };
        } catch (err: any) {
          return { success: false, error: err.message || 'Lỗi nhận diện OCR' };
        }
      }

      case 'TRANSLATE_DIALOGUES': {
        const { imageUrl, chapterUrl, dialogues, naturalWidth, naturalHeight } = msg;
        if (!Array.isArray(dialogues) || dialogues.length === 0) {
          return { success: true, dialogues: [] };
        }

        const settings = await StorageService.getSettings();
        const texts = dialogues.map((d: DialogueItem) => d.originalText);
        const provider = TranslationProviderFactory.createProvider(settings);
        const targetLang = settings.targetLanguage || 'Tiếng Việt';

        const rawKey = settings.providers[settings.activeProvider]?.apiKey || '';
        const keyCount = ApiKeyRotator.parseKeys(rawKey).length;
        const baseDelay =
          settings.rateLimitDelayMs !== undefined
            ? settings.rateLimitDelayMs
            : (API_PRESETS[settings.activeProvider]?.defaultDelayMs ?? 1200);

        const minDelayMs = keyCount > 1
          ? Math.max(200, Math.round(baseDelay / keyCount))
          : baseDelay;

        const translations = await ApiRateLimiter.throttle(minDelayMs, () =>
          provider.translateDialogues(texts, targetLang)
        );

        const validDialogues: DialogueItem[] = [];
        dialogues.forEach((d: DialogueItem, i: number) => {
          const trans = translations[i];
          if (typeof trans === 'string') {
            const clean = trans.trim();
            // If AI returned empty string, it's watermark/junk -> omit from comic bubbles!
            if (clean.length > 0) {
              d.translatedText = clean;
              validDialogues.push(d);
            }
          } else if (d.originalText && d.originalText.trim().length > 0) {
            d.translatedText = d.originalText.trim();
            validDialogues.push(d);
          }
        });

        // Save to cache DB
        if (imageUrl) {
          await TranslationCacheDb.saveTranslation(
            imageUrl,
            chapterUrl || '',
            validDialogues,
            naturalWidth || 800,
            naturalHeight || 1200
          );
        }

        return { success: true, dialogues: validDialogues };
      }

      case 'TRANSLATE_IMAGE': {
        const { imageUrl, chapterUrl, dataUrl } = msg;

        // 1. Cache check
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

        // 2. Load model via Worker
        const settings = await StorageService.getSettings();
        const modelId = settings.activeOcrModelId || OCR_MODEL_PRESETS[0]?.id || 'pp-ocrv4-server-heavy';
        try {
          await ocrWorkerClient.ensureModelLoaded(modelId, settings.useWebGpu ?? true);
        } catch (err: any) {
          return { success: false, error: err.message };
        }

        // 3. Run OCR
        let dialogues: DialogueItem[];
        let width: number;
        let height: number;
        try {
          const res = await ocrWorkerClient.runOcr({ dataUrl, imageUrl });
          dialogues = res.dialogues;
          width = res.width;
          height = res.height;
        } catch (err: any) {
          return { success: false, error: err.message || 'Lỗi nhận diện OCR' };
        }

        if (dialogues.length === 0) {
          return { success: true, cached: false, dialogues: [], naturalWidth: width, naturalHeight: height };
        }

        // 4. Translate dialogues
        const texts = dialogues.map((d) => d.originalText);
        const provider = TranslationProviderFactory.createProvider(settings);
        const targetLang = settings.targetLanguage || 'Tiếng Việt';

        const minDelayMs =
          settings.rateLimitDelayMs !== undefined
            ? settings.rateLimitDelayMs
            : (API_PRESETS[settings.activeProvider]?.defaultDelayMs ?? 1200);

        const translations = await ApiRateLimiter.throttle(minDelayMs, () =>
          provider.translateDialogues(texts, targetLang)
        );

        const validDialogues: DialogueItem[] = [];
        dialogues.forEach((d, i) => {
          const trans = translations[i];
          if (typeof trans === 'string') {
            const clean = trans.trim();
            if (clean.length > 0) {
              d.translatedText = clean;
              validDialogues.push(d);
            }
          } else if (d.originalText && d.originalText.trim().length > 0) {
            d.translatedText = d.originalText.trim();
            validDialogues.push(d);
          }
        });

        // 5. Save cache
        if (imageUrl) {
          await TranslationCacheDb.saveTranslation(imageUrl, chapterUrl || '', validDialogues, width, height);
        }

        return { success: true, cached: false, dialogues: validDialogues, naturalWidth: width, naturalHeight: height };
      }

      case 'TEST_CONNECTION': {
        const settings = await StorageService.getSettings();
        const provider = TranslationProviderFactory.createProvider(settings, msg.providerType);
        const ok = await provider.testConnection();
        return { success: ok };
      }

      case 'GET_DEBUG_LOGS': {
        const logs = await DebugLogger.getLogs();
        return { success: true, logs };
      }

      case 'CLEAR_DEBUG_LOGS': {
        await DebugLogger.clearLogs();
        return { success: true };
      }

      default:
        return { success: false, error: 'Action không hợp lệ' };
    }
  } catch (err: any) {
    const errorMsg = err?.message || 'Lỗi xử lý trong background';
    console.error('[SpeedySlate Background] Error:', err);
    await DebugLogger.error('Background', errorMsg, err);
    return { success: false, error: errorMsg };
  }
}

// Listen for messages targeted to Background
// CRITICAL (chrome-extensions rule): return undefined synchronously if targeted to OFFSCREEN_OCR!
browser.runtime.onMessage.addListener((rawMsg: any) => {
  if (rawMsg?.target === 'OFFSCREEN_OCR') {
    return undefined;
  }
  return handleBackgroundMessage(rawMsg);
});

console.log('[SpeedySlate] Background Service Initialized (Hybrid Worker/Offscreen)');
