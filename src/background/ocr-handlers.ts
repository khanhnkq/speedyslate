import { StorageService } from '../shared/storage';
import { TranslationCacheDb } from '../shared/translation-db';
import { DialogueItem } from '../shared/types';
import { API_PRESETS, OCR_MODEL_PRESETS } from '../shared/presets';
import { TranslationProviderFactory } from '../services/translation/provider-factory';
import { ApiRateLimiter } from '../services/translation/rate-limiter';
import { ocrWorkerClient } from './ocr-worker-client';
import { ImageFetcher } from './image-fetcher';
import { VisionStripSlicer } from '../services/translation/vision-strip-slicer';
import { MultiProviderRotator } from '../services/translation/multi-provider-rotator';
import { DebugLogger } from '../shared/debug-logger';
import { buildTranslateCtx, rememberChapterPairs } from './chapter-memory';

function applyTranslatedStrings(dialogues: DialogueItem[], translations: string[]): DialogueItem[] {
  const validDialogues: DialogueItem[] = [];
  dialogues.forEach((d: DialogueItem, i: number) => {
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
  return validDialogues;
}

export async function handleOcrImage(msg: any): Promise<any> {
  const { imageUrl, dataUrl } = msg;

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

  if (settings.translationMode === 'vision_ai') {
    try {
      const provider = TranslationProviderFactory.createProvider(settings);
      if (!provider.translateImage) {
        return {
          success: false,
          error: `Nhà cung cấp ${settings.activeProvider} chưa hỗ trợ Multimodal Vision AI.`
        };
      }

      const { base64Data, mimeType } = await ImageFetcher.getBase64Data(dataUrl, imageUrl, msg.chapterUrl);
      const targetLang = settings.targetLanguage || 'Tiếng Việt';
      const sourceLang = settings.sourceLanguage || 'auto';
      const width = msg.naturalWidth || msg.width || 800;
      const height = msg.naturalHeight || msg.height || 1200;

      const totalKeys = MultiProviderRotator.countTotalKeys(settings);
      const minDelayMs = MultiProviderRotator.computeEffectiveDelay(settings);

      const dialogues = await VisionStripSlicer.processStrip(
        base64Data,
        mimeType,
        width,
        height,
        provider,
        targetLang,
        minDelayMs,
        sourceLang
      );

      if (imageUrl && dialogues.length > 0) {
        await TranslationCacheDb.saveTranslation(imageUrl, msg.chapterUrl || '', dialogues, width, height);
      }

      return {
        success: true,
        cached: false,
        isDirectTranslation: true,
        dialogues,
        naturalWidth: width,
        naturalHeight: height,
        keyIndex: (provider as any).lastKeyIndex || 1,
        totalKeys
      };
    } catch (err: any) {
      DebugLogger.error('Background:VisionAI', err.message, err);
      return { success: false, error: err.message || 'Lỗi nhận diện Vision AI' };
    }
  }

  const modelId = settings.activeOcrModelId || OCR_MODEL_PRESETS[0]?.id || 'comic-manga-manhwa';
  try {
    await ocrWorkerClient.ensureModelLoaded(modelId, settings.useWebGpu ?? true);
  } catch (err: any) {
    return { success: false, error: err.message };
  }

  let ocrDataUrl = dataUrl;
  if (!ocrDataUrl && imageUrl && !imageUrl.startsWith('data:image/svg')) {
    try {
      const { base64Data, mimeType } = await ImageFetcher.getBase64Data(undefined, imageUrl, msg.chapterUrl);
      ocrDataUrl = `data:${mimeType};base64,${base64Data}`;
    } catch (e: any) {
      DebugLogger.warn('Background:OCR', `Không thể tải trước ảnh: ${e.message}`);
    }
  }

  try {
    const { dialogues, width, height } = await ocrWorkerClient.runOcr({
      dataUrl: ocrDataUrl,
      imageUrl,
      sourceLang: settings.sourceLanguage,
      translateSfx: settings.translateSfx ?? false
    });
    return { success: true, cached: false, dialogues, naturalWidth: width, naturalHeight: height };
  } catch (err: any) {
    return { success: false, error: err.message || 'Lỗi nhận diện OCR' };
  }
}

export async function handleTranslateDialogues(msg: any): Promise<any> {
  const { imageUrl, chapterUrl, dialogues, naturalWidth, naturalHeight } = msg;
  if (!Array.isArray(dialogues) || dialogues.length === 0) {
    return { success: true, dialogues: [] };
  }

  const settings = await StorageService.getSettings();
  const texts = dialogues.map((d: DialogueItem) => d.originalText);
  const provider = TranslationProviderFactory.createProvider(settings);
  const targetLang = settings.targetLanguage || 'Tiếng Việt';
  const sourceLang = settings.sourceLanguage || 'auto';

  const totalKeys = MultiProviderRotator.countTotalKeys(settings);
  const minDelayMs = MultiProviderRotator.computeEffectiveDelay(settings);

  const translations = await ApiRateLimiter.throttle(minDelayMs, () =>
    provider.translateDialogues(
      texts,
      targetLang,
      sourceLang,
      buildTranslateCtx(settings, dialogues, chapterUrl || imageUrl)
    )
  );

  const validDialogues = applyTranslatedStrings(dialogues, translations);
  rememberChapterPairs(chapterUrl || imageUrl, validDialogues);

  if (imageUrl) {
    await TranslationCacheDb.saveTranslation(
      imageUrl,
      chapterUrl || '',
      validDialogues,
      naturalWidth || 800,
      naturalHeight || 1200
    );
  }

  return {
    success: true,
    dialogues: validDialogues,
    keyIndex: (provider as any).lastKeyIndex || 1,
    totalKeys
  };
}

export async function handleTranslateImage(msg: any): Promise<any> {
  const { imageUrl, chapterUrl, dataUrl } = msg;

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

  const settings = await StorageService.getSettings();
  const modelId = settings.activeOcrModelId || OCR_MODEL_PRESETS[0]?.id || 'comic-manga-manhwa';
  try {
    await ocrWorkerClient.ensureModelLoaded(modelId, settings.useWebGpu ?? true);
  } catch (err: any) {
    return { success: false, error: err.message };
  }

  let dialogues: DialogueItem[];
  let width: number;
  let height: number;
  try {
    const res = await ocrWorkerClient.runOcr({
      dataUrl,
      imageUrl,
      sourceLang: settings.sourceLanguage,
      translateSfx: settings.translateSfx ?? false
    });
    dialogues = res.dialogues;
    width = res.width;
    height = res.height;
  } catch (err: any) {
    return { success: false, error: err.message || 'Lỗi nhận diện OCR' };
  }

  if (dialogues.length === 0) {
    return { success: true, cached: false, dialogues: [], naturalWidth: width, naturalHeight: height };
  }

  const texts = dialogues.map((d) => d.originalText);
  const provider = TranslationProviderFactory.createProvider(settings);
  const targetLang = settings.targetLanguage || 'Tiếng Việt';
  const sourceLang = settings.sourceLanguage || 'auto';
  const minDelayMs =
    settings.rateLimitDelayMs !== undefined
      ? settings.rateLimitDelayMs
      : (API_PRESETS[settings.activeProvider]?.defaultDelayMs ?? 1200);

  const translations = await ApiRateLimiter.throttle(minDelayMs, () =>
    provider.translateDialogues(
      texts,
      targetLang,
      sourceLang,
      buildTranslateCtx(settings, dialogues, chapterUrl || imageUrl)
    )
  );

  const validDialogues = applyTranslatedStrings(dialogues, translations);
  rememberChapterPairs(chapterUrl || imageUrl, validDialogues);

  if (imageUrl) {
    await TranslationCacheDb.saveTranslation(imageUrl, chapterUrl || '', validDialogues, width, height);
  }

  return {
    success: true,
    cached: false,
    dialogues: validDialogues,
    naturalWidth: width,
    naturalHeight: height,
    keyIndex: (provider as any).lastKeyIndex || 1,
    totalKeys: (provider as any).keyCount || 1
  };
}
