import { BubbleTheme, ExtensionSettings } from '../shared/types';
import { FloatingHud } from './hud/hud';
import { OverlayRenderer } from './overlay/overlay-renderer';
import { OrderedTaskQueue, OcrTask, TranslationTask } from './priority-queue';
import { ComicPanelAdapter } from './panel-adapter';
import { ImageCompressor, resolveOverlayDimensions } from './image-compressor';
import { MediaTargetResolver } from './media-target';
import { DebugLogger } from '../shared/debug-logger';
import { SafeMessenger } from './safe-messenger';

export interface TaskProcessorContext {
  getSettings: () => ExtensionSettings;
  hud: FloatingHud;
  completedImages: Set<HTMLImageElement>;
  ocrQueue: OrderedTaskQueue<OcrTask>;
  translationQueue: OrderedTaskQueue<TranslationTask>;
  markImageCompleted: (img: HTMLImageElement) => void;
  onTaskFinished?: () => void;
  onContextInvalidated: () => void;
}

/**
 * TaskProcessor: Handles OCR task and Translation task processing pipelines.
 * Following Single Responsibility Principle (SRP).
 */
export class TaskProcessor {
  constructor(private ctx: TaskProcessorContext) {}

  public getKeyCount(): number {
    const settings = this.ctx.getSettings();
    const raw = settings?.providers?.[settings?.activeProvider]?.apiKey || '';
    if (!raw) return 0;
    return raw.split(/[\n,;]+/).map((k) => k.trim()).filter((k) => k.length > 0).length;
  }

  public async processOcrTask(task: OcrTask): Promise<void> {
    if (this.ctx.completedImages.has(task.img)) return;

    const img = task.img;
    if (img.dataset.slateStatus && img.dataset.slateStatus !== 'error') {
      return;
    }

    const wrapper = ComicPanelAdapter.wrapImage(img);
    if (!wrapper) return;

    // Trigger lazy loading first
    ComicPanelAdapter.forceTriggerImage(img);

    const settings = this.ctx.getSettings();
    const isVision = settings?.translationMode === 'vision_ai';
    const totalKeys = this.getKeyCount();
    const estimatedKey = totalKeys > 0 ? (task.index % totalKeys) + 1 : undefined;

    try {
      if (!img.complete || img.naturalWidth === 0) {
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
          setTimeout(resolve, 3500);
        });
      }

      // Determine real image URL via universal MediaTargetResolver
      const rawSrc = MediaTargetResolver.extractBestImageUrl(img) || img.src;
      let imageUrl = rawSrc;
      try {
        imageUrl = new URL(rawSrc, window.location.href).href;
      } catch {
        // keep rawSrc
      }

      const naturalWidth = img.naturalWidth || img.width || 800;
      const naturalHeight = img.naturalHeight || img.height || 1200;

      img.dataset.slateStatus = 'ocr_running';

      if (isVision) {
        this.ctx.hud.log(
          `Trang #${task.index + 1}${totalKeys > 1 ? ` (Key #${estimatedKey}/${totalKeys})` : ''}: Vision AI đang nhận diện và dịch...`
        );
      }

      const captured = isVision
        ? ImageCompressor.compressForVision(img, 1280, 0.78)
        : ImageCompressor.captureForOcr(img, 2200);

      const resp: any = await SafeMessenger.send({
        action: 'OCR_IMAGE',
        imageUrl,
        chapterUrl: window.location.href,
        dataUrl: captured.dataUrl,
        naturalWidth,
        naturalHeight
      });

      if ((resp as any)?.isContextInvalidated) {
        this.ctx.onContextInvalidated();
        return;
      }

      if (resp?.success) {
        // 1. Direct result from Cache or Vision AI mode (already fully translated with styling)
        if (resp.cached || resp.isDirectTranslation) {
          if (resp.dialogues && resp.dialogues.length > 0) {
            const { width: renderW, height: renderH } = resolveOverlayDimensions(
              resp.naturalWidth,
              resp.naturalHeight,
              img.naturalWidth || captured.compressedWidth,
              img.naturalHeight || captured.compressedHeight
            );
            OverlayRenderer.renderDialogues(
              wrapper,
              resp.dialogues,
              renderW,
              renderH,
              (settings?.bubbleTheme || 'auto') as BubbleTheme
            );
            img.dataset.slateStatus = 'translated';
            const finalKey = resp.keyIndex || estimatedKey;
            const finalTotal = resp.totalKeys || totalKeys;
            this.ctx.hud.log(
              resp.cached
                ? `Trang #${task.index + 1}: Nạp từ Cache (0ms)`
                : `Trang #${task.index + 1}${finalTotal > 1 ? ` (Key #${finalKey}/${finalTotal})` : ''}: Vision AI đã dịch ${resp.dialogues.length} câu thoại`
            );
          } else {
            img.dataset.slateStatus = 'no_text';
            this.ctx.hud.log(`Trang #${task.index + 1}: Không có chữ thoại`);
          }
          this.ctx.markImageCompleted(img);
        } else if (!resp.dialogues || resp.dialogues.length === 0) {
          img.dataset.slateStatus = 'no_text';
          this.ctx.markImageCompleted(img);
          this.ctx.hud.log(`Trang #${task.index + 1}: Không có chữ`);
        } else {
          // 2. Hybrid OCR Mode: Text extracted locally, forward to translation queue
          img.dataset.slateStatus = 'ocr_done';
          this.ctx.hud.log(`Trang #${task.index + 1}: Đã quét ${resp.dialogues.length} câu thoại, đang chờ dịch...`);
          this.ctx.translationQueue.enqueue({
            index: task.index,
            img: task.img,
            dialogues: resp.dialogues,
            naturalWidth: resp.naturalWidth || captured.compressedWidth,
            naturalHeight: resp.naturalHeight || captured.compressedHeight
          });
        }
      } else {
        img.dataset.slateStatus = 'error';
        const errMsg = resp?.error || 'Lỗi nhận diện OCR';
        this.ctx.hud.log(`Lỗi OCR trang #${task.index + 1}: ${errMsg}`, true);
        DebugLogger.error('Content:OCR', `Trang #${task.index + 1}: ${errMsg}`);
        if (this.ctx.ocrQueue.size() <= 1 && this.ctx.translationQueue.size() === 0) {
          this.ctx.hud.setState('error');
        }
      }
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      if (errMsg.includes('Extension context invalidated')) {
        this.ctx.onContextInvalidated();
        return;
      }
      img.dataset.slateStatus = 'error';
      this.ctx.hud.log(`Lỗi OCR trang #${task.index + 1}: ${errMsg}`, true);
      DebugLogger.error('Content:OCR', `Trang #${task.index + 1}: ${errMsg}`, err);
      if (this.ctx.ocrQueue.size() <= 1 && this.ctx.translationQueue.size() === 0) {
        this.ctx.hud.setState('error');
      }
    } finally {
      this.ctx.onTaskFinished?.();
    }
  }

  public async processTranslationTask(task: TranslationTask): Promise<void> {
    if (this.ctx.completedImages.has(task.img)) return;

    const img = task.img;
    if (img.dataset.slateStatus === 'translated' || img.dataset.slateStatus === 'translating') {
      return;
    }

    const wrapper = ComicPanelAdapter.wrapImage(img);
    if (!wrapper) return;

    const settings = this.ctx.getSettings();
    const totalKeys = this.getKeyCount();
    const estimatedKey = totalKeys > 0 ? (task.index % totalKeys) + 1 : undefined;

    try {
      img.dataset.slateStatus = 'translating';
      this.ctx.hud.log(
        `Trang #${task.index + 1}${totalKeys > 1 ? ` (Key #${estimatedKey}/${totalKeys})` : ''}: Đang dịch ${task.dialogues.length} câu thoại...`
      );

      const rawSrc = img.dataset.src || img.getAttribute('data-src') || img.src;
      let imageUrl = (rawSrc && !rawSrc.startsWith('data:image/svg')) ? rawSrc : img.src;
      if (imageUrl.startsWith('//')) {
        imageUrl = window.location.protocol + imageUrl;
      } else if (imageUrl.startsWith('/')) {
        imageUrl = window.location.origin + imageUrl;
      }

      const resp: any = await SafeMessenger.send({
        action: 'TRANSLATE_DIALOGUES',
        imageUrl,
        chapterUrl: window.location.href,
        dialogues: task.dialogues,
        naturalWidth: task.naturalWidth,
        naturalHeight: task.naturalHeight
      });

      if ((resp as any)?.isContextInvalidated) {
        this.ctx.onContextInvalidated();
        return;
      }

      if (resp?.success && Array.isArray(resp.dialogues)) {
        const { width: renderW, height: renderH } = resolveOverlayDimensions(
          task.naturalWidth,
          task.naturalHeight,
          img.naturalWidth,
          img.naturalHeight
        );
        OverlayRenderer.renderDialogues(
          wrapper,
          resp.dialogues,
          renderW,
          renderH,
          (settings?.bubbleTheme || 'auto') as BubbleTheme
        );
        img.dataset.slateStatus = 'translated';
        const finalKey = resp.keyIndex || estimatedKey;
        const finalTotal = resp.totalKeys || totalKeys;
        this.ctx.markImageCompleted(img);
        this.ctx.hud.log(
          `Trang #${task.index + 1}${finalTotal > 1 ? ` (Key #${finalKey}/${finalTotal})` : ''}: Hoàn tất ${resp.dialogues.length} câu thoại`
        );
      } else {
        img.dataset.slateStatus = 'error';
        const errMsg = resp?.error || 'Lỗi API dịch';
        this.ctx.hud.log(`Lỗi dịch trang #${task.index + 1}: ${errMsg}`, true);
        DebugLogger.error('Content:Translate', `Trang #${task.index + 1}: ${errMsg}`);
        if (this.ctx.translationQueue.size() <= 1 && this.ctx.ocrQueue.size() === 0) {
          this.ctx.hud.setState('error');
        }
      }
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      if (errMsg.includes('Extension context invalidated')) {
        this.ctx.onContextInvalidated();
        return;
      }
      img.dataset.slateStatus = 'error';
      this.ctx.hud.log(`Lỗi dịch trang #${task.index + 1}: ${errMsg}`, true);
      DebugLogger.error('Content:Translate', `Trang #${task.index + 1}: ${errMsg}`, err);
      if (this.ctx.translationQueue.size() <= 1 && this.ctx.ocrQueue.size() === 0) {
        this.ctx.hud.setState('error');
      }
    } finally {
      this.ctx.onTaskFinished?.();
    }
  }
}
