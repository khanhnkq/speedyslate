import browser from 'webextension-polyfill';
import { StorageService } from '../shared/storage';
import { TranslationCacheDb } from '../shared/translation-db';
import { ModelDbService } from '../shared/model-db';
import { OCR_MODEL_PRESETS } from '../shared/presets';
import { TranslationProviderFactory } from '../services/translation/provider-factory';
import { ocrWorkerClient } from './ocr-worker-client';
import { ImageFetcher } from './image-fetcher';
import { DnrManager } from './dnr-rules';
import { DebugLogger } from '../shared/debug-logger';
import { encodeErasePatches } from '../shared/erase-codec';
import { ServiceWorkerKeepAlive } from './keep-alive';
import { handleOcrImage, handleTranslateDialogues, handleTranslateImage } from './ocr-handlers';

// Initialize DeclarativeNetRequest rules for anti-hotlinking & CORS
DnrManager.init().catch(() => {});

if (typeof self !== 'undefined') {
  self.addEventListener('error', (event: any) => {
    DebugLogger.error('Background:GlobalError', event.message || String(event), event.error);
  });
  self.addEventListener('unhandledrejection', (event: any) => {
    DebugLogger.error('Background:UnhandledRejection', event.reason?.message || String(event.reason), event.reason);
  });
}

async function handleBackgroundMessage(msg: any): Promise<any> {
  ServiceWorkerKeepAlive.start();
  try {
    switch (msg.action) {
      case 'PING':
        return { success: true, message: 'SpeedySlate Background Ready' };

      case 'GET_OCR_STATUS':
        return { success: true, backend: ocrWorkerClient.activeBackend ?? 'idle' };

      case 'WARMUP_OCR': {
        const settings = await StorageService.getSettings();
        const modelId = settings.activeOcrModelId || OCR_MODEL_PRESETS[0]?.id || 'comic-manga-manhwa';
        const modelStatus = await ModelDbService.getModelStatus(modelId);
        if (modelStatus.status === 'ready') {
          await ocrWorkerClient.ensureModelLoaded(modelId, settings.useWebGpu ?? true);
        }
        return { success: true, backend: ocrWorkerClient.activeBackend ?? 'idle' };
      }

      case 'SET_WEBGPU': {
        await ocrWorkerClient.resetForBackendChange();
        const settings = await StorageService.getSettings();
        const modelId = settings.activeOcrModelId || OCR_MODEL_PRESETS[0]?.id || 'comic-manga-manhwa';
        const modelStatus = await ModelDbService.getModelStatus(modelId);
        if (modelStatus.status === 'ready') {
          await ocrWorkerClient.ensureModelLoaded(modelId, settings.useWebGpu ?? true);
        }
        return { success: true, backend: ocrWorkerClient.activeBackend ?? 'idle' };
      }

      case 'CHECK_MODEL_STATUS': {
        const settings = await StorageService.getSettings();
        const modelId = msg.modelId || settings.activeOcrModelId || OCR_MODEL_PRESETS[0]?.id || 'comic-manga-manhwa';
        const status = await ModelDbService.getModelStatus(modelId);
        return { success: true, status };
      }

      case 'DELETE_MODEL': {
        if (msg.modelId) {
          await ModelDbService.deleteModel(msg.modelId);
          if (ocrWorkerClient.currentModelId === msg.modelId) {
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
        try {
          const tabs = await browser.tabs.query({});
          for (const tab of tabs) {
            if (tab.id) {
              browser.tabs.sendMessage(tab.id, { action: 'CACHE_CLEARED' }).catch(() => {});
            }
          }
        } catch {}
        return { success: true };
      }

      case 'GET_CHAPTER_TRANSLATIONS': {
        const results: Record<string, any> = {};
        if (Array.isArray(msg.imageUrls)) {
          for (const url of msg.imageUrls) {
            const cached = await TranslationCacheDb.getTranslation(url);
            if (cached) results[url] = cached;
          }
        }
        return { success: true, translations: results };
      }

      case 'SAVE_TRANSLATION': {
        const { imageUrl, chapterUrl, dialogues, width, height } = msg;
        if (imageUrl && Array.isArray(dialogues)) {
          await TranslationCacheDb.saveTranslation(imageUrl, chapterUrl || '', dialogues, width, height);
        }
        return { success: true };
      }

      case 'OCR_IMAGE':
        return await handleOcrImage(msg);

      case 'TRANSLATE_DIALOGUES':
        return await handleTranslateDialogues(msg);

      case 'TRANSLATE_IMAGE':
        return await handleTranslateImage(msg);

      case 'TEST_CONNECTION': {
        const settings = await StorageService.getSettings();
        const provider = TranslationProviderFactory.createProvider(settings, msg.providerType);
        const ok = await provider.testConnection();
        return { success: ok };
      }

      case 'GET_DEBUG_LOGS':
        return { success: true, logs: await DebugLogger.getLogs() };

      case 'CLEAR_DEBUG_LOGS':
        await DebugLogger.clearLogs();
        return { success: true };

      case 'FETCH_IMAGE_BASE64': {
        const { imageUrl, chapterUrl } = msg;
        if (!imageUrl) return { success: false, error: 'No imageUrl provided' };
        try {
          const { base64Data, mimeType } = await ImageFetcher.getBase64Data(undefined, imageUrl, chapterUrl);
          return { success: true, base64Data, mimeType };
        } catch (err: any) {
          return { success: false, error: err?.message || 'Failed to fetch image' };
        }
      }

      case 'ENSURE_IMAGE_CDNS': {
        const { chapterUrl, imageUrls } = msg;
        if (chapterUrl && Array.isArray(imageUrls)) {
          const seenHosts = new Set<string>();
          for (const rawUrl of imageUrls) {
            try {
              const abs = new URL(rawUrl, chapterUrl).href;
              const host = new URL(abs).hostname;
              if (host && !seenHosts.has(host)) {
                seenHosts.add(host);
                await DnrManager.ensureRefererForDomain(chapterUrl, abs);
              }
            } catch {
              // ignore malformed URLs
            }
          }
        }
        return { success: true };
      }

      case 'CAPTURE_VISIBLE_TAB': {
        try {
          const dataUrl = await browser.tabs.captureVisibleTab(undefined, { format: 'png' });
          return { success: true, dataUrl };
        } catch (err: any) {
          return {
            success: false,
            error: err?.message || 'Không thể chụp tab hiện tại (hãy click mở tiện ích trên trang này trước)'
          };
        }
      }

      default:
        return { success: false, error: 'Action không hợp lệ' };
    }
  } catch (err: any) {
    const errorMsg = err?.message || 'Lỗi xử lý trong background';
    console.error('[SpeedySlate Background] Error:', err);
    await DebugLogger.error('Background', errorMsg, err);
    return { success: false, error: errorMsg };
  } finally {
    ServiceWorkerKeepAlive.stop();
  }
}

function withMessageTimeout<T>(promise: Promise<T>, ms: number, timeoutResult: T): Promise<T> {
  let timer: any;
  const timeoutPromise = new Promise<T>((resolve) => {
    timer = setTimeout(() => {
      console.warn(`[SpeedySlate] Background message timed out after ${ms}ms`);
      DebugLogger.error('Background:Timeout', `Tác vụ nền quá thời gian chờ (${Math.round(ms / 1000)}s)`);
      resolve(timeoutResult);
    }, ms);
  });
  return Promise.race([
    promise.then((res) => {
      clearTimeout(timer);
      return res;
    }),
    timeoutPromise
  ]);
}

browser.runtime.onMessage.addListener((rawMsg: any) => {
  if (rawMsg?.target === 'OFFSCREEN_OCR') {
    return undefined;
  }
  return withMessageTimeout(
    handleBackgroundMessage(rawMsg).then((res) => {
      if (Array.isArray(res?.dialogues)) {
        encodeErasePatches(res.dialogues);
      }
      return res;
    }),
    60000,
    { success: false, error: 'Tác vụ nền quá thời gian chờ (timeout 60s). Vui lòng thử lại.' }
  );
});

console.log('[SpeedySlate] Background Service Initialized (Hybrid Worker/Offscreen)');
