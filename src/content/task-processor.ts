import { BubbleTheme, DialogueItem, ExtensionSettings } from '../shared/types';
import { FloatingHud } from './hud/hud';
import { OverlayRenderer } from './overlay/overlay-renderer';
import { OrderedTaskQueue, OcrTask, TranslationTask } from './priority-queue';
import { ToonheyAdapter } from './toonhey-adapter';
import { PageBadgeManager } from './page-badge';
import { ImageCompressor } from './image-compressor';
import { DebugLogger } from '../shared/debug-logger';
import { SafeMessenger } from './safe-messenger';

export interface TaskProcessorContext {
  getSettings: () => ExtensionSettings;
  hud: FloatingHud;
  completedImages: Set<HTMLImageElement>;
  ocrQueue: OrderedTaskQueue<OcrTask>;
  translationQueue: OrderedTaskQueue<TranslationTask>;
  markImageCompleted: (img: HTMLImageElement) => void;
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

    const wrapper = ToonheyAdapter.wrapImage(img);
    if (!wrapper) return;

    // Trigger lazy loading first
    ToonheyAdapter.forceTriggerImage(img);

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

      // Determine real image URL (strictly ignore SVG/data-url placeholders)
      const rawSrc = img.dataset.src || img.getAttribute('data-src') || img.src;
      let imageUrl = (rawSrc && !rawSrc.startsWith('data:image/svg')) ? rawSrc : img.src;
      if (imageUrl.startsWith('//')) {
        imageUrl = window.location.protocol + imageUrl;
      } else if (imageUrl.startsWith('/')) {
        imageUrl = window.location.origin + imageUrl;
      }

      const naturalWidth = img.naturalWidth || img.width || 800;
      const naturalHeight = img.naturalHeight || img.height || 1200;

      // In Multimodal Vision AI mode with tall continuous webtoon strips (>2200px):
      // Slice into panels to ensure high text resolution, accurate bounding boxes,
      // and avoid vertical shifting onto adjacent panels.
      if (isVision && naturalHeight > 2200) {
        await this.processVisionStrip(task, wrapper, imageUrl, naturalWidth, naturalHeight);
        return;
      }

      img.dataset.slateStatus = 'ocr_running';
      PageBadgeManager.updateBadge(
        wrapper,
        task.index,
        'ocr_running',
        undefined,
        isVision && totalKeys > 0 ? { keyIndex: estimatedKey, totalKeys } : undefined
      );

      // Downscale and compress image (max 1280px) to reduce latency and token usage
      const compressed = ImageCompressor.compressForVision(img, 1280, 0.85);

      const resp: any = await SafeMessenger.send({
        action: 'OCR_IMAGE',
        imageUrl,
        chapterUrl: window.location.href,
        dataUrl: compressed.dataUrl,
        naturalWidth: compressed.naturalWidth,
        naturalHeight: compressed.naturalHeight
      });

      if ((resp as any)?.isContextInvalidated) {
        this.ctx.onContextInvalidated();
        return;
      }

      if (resp?.success) {
        // 1. Direct result from Cache or Vision AI mode (already fully translated with styling)
        if (resp.cached || resp.isDirectTranslation) {
          if (resp.dialogues && resp.dialogues.length > 0) {
            const renderW = img.naturalWidth || resp.naturalWidth || compressed.naturalWidth;
            const renderH = img.naturalHeight || resp.naturalHeight || compressed.naturalHeight;
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
            PageBadgeManager.updateBadge(
              wrapper,
              task.index,
              'translated',
              resp.dialogues.length,
              !resp.cached && finalKey ? { keyIndex: finalKey, totalKeys: finalTotal } : undefined
            );
            this.ctx.hud.log(
              resp.cached
                ? `Trang #${task.index + 1}: Nạp từ Cache (0ms)`
                : `Trang #${task.index + 1}${finalTotal > 1 ? ` (Key #${finalKey}/${finalTotal})` : ''}: Vision AI đã dịch ${resp.dialogues.length} câu thoại`
            );
          } else {
            img.dataset.slateStatus = 'no_text';
            PageBadgeManager.updateBadge(wrapper, task.index, 'no_text');
            this.ctx.hud.log(`Trang #${task.index + 1}: Không có chữ thoại`);
          }
          this.ctx.markImageCompleted(img);
        } else if (!resp.dialogues || resp.dialogues.length === 0) {
          img.dataset.slateStatus = 'no_text';
          PageBadgeManager.updateBadge(wrapper, task.index, 'no_text');
          this.ctx.markImageCompleted(img);
          this.ctx.hud.log(`Trang #${task.index + 1}: Không có chữ`);
        } else {
          // 2. Hybrid OCR Mode: Text extracted locally, forward to translation queue
          img.dataset.slateStatus = 'ocr_done';
          PageBadgeManager.updateBadge(wrapper, task.index, 'ocr_done', resp.dialogues.length);
          this.ctx.hud.log(`Trang #${task.index + 1}: Đã quét ${resp.dialogues.length} câu thoại, đang chờ dịch...`);
          this.ctx.translationQueue.enqueue({
            index: task.index,
            img: task.img,
            dialogues: resp.dialogues,
            naturalWidth: resp.naturalWidth || compressed.naturalWidth,
            naturalHeight: resp.naturalHeight || compressed.naturalHeight
          });
        }
      } else {
        img.dataset.slateStatus = 'error';
        const errMsg = resp?.error || 'Lỗi nhận diện OCR';
        PageBadgeManager.updateBadge(
          wrapper,
          task.index,
          'error',
          undefined,
          isVision && totalKeys > 0 ? { keyIndex: estimatedKey, totalKeys, errorMessage: errMsg } : { errorMessage: errMsg }
        );
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
      PageBadgeManager.updateBadge(
        wrapper,
        task.index,
        'error',
        undefined,
        isVision && totalKeys > 0 ? { keyIndex: estimatedKey, totalKeys, errorMessage: errMsg } : { errorMessage: errMsg }
      );
      this.ctx.hud.log(`Lỗi OCR trang #${task.index + 1}: ${errMsg}`, true);
      DebugLogger.error('Content:OCR', `Trang #${task.index + 1}: ${errMsg}`, err);
      if (this.ctx.ocrQueue.size() <= 1 && this.ctx.translationQueue.size() === 0) {
        this.ctx.hud.setState('error');
      }
    }
  }

  public async processTranslationTask(task: TranslationTask): Promise<void> {
    if (this.ctx.completedImages.has(task.img)) return;

    const img = task.img;
    if (img.dataset.slateStatus === 'translated' || img.dataset.slateStatus === 'translating') {
      return;
    }

    const wrapper = ToonheyAdapter.wrapImage(img);
    if (!wrapper) return;

    const settings = this.ctx.getSettings();
    const totalKeys = this.getKeyCount();
    const estimatedKey = totalKeys > 0 ? (task.index % totalKeys) + 1 : undefined;

    try {
      img.dataset.slateStatus = 'translating';
      PageBadgeManager.updateBadge(
        wrapper,
        task.index,
        'translating',
        task.dialogues.length,
        totalKeys > 0 ? { keyIndex: estimatedKey, totalKeys } : undefined
      );
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
        const renderW = img.naturalWidth || task.naturalWidth;
        const renderH = img.naturalHeight || task.naturalHeight;
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
        PageBadgeManager.updateBadge(
          wrapper,
          task.index,
          'translated',
          resp.dialogues.length,
          finalKey ? { keyIndex: finalKey, totalKeys: finalTotal } : undefined
        );
        this.ctx.markImageCompleted(img);
        this.ctx.hud.log(
          `Trang #${task.index + 1}${finalTotal > 1 ? ` (Key #${finalKey}/${finalTotal})` : ''}: Hoàn tất ${resp.dialogues.length} câu thoại`
        );
      } else {
        img.dataset.slateStatus = 'error';
        const errMsg = resp?.error || 'Lỗi API dịch';
        PageBadgeManager.updateBadge(
          wrapper,
          task.index,
          'error',
          undefined,
          totalKeys > 0 ? { keyIndex: estimatedKey, totalKeys, errorMessage: errMsg } : { errorMessage: errMsg }
        );
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
      PageBadgeManager.updateBadge(
        wrapper,
        task.index,
        'error',
        undefined,
        totalKeys > 0 ? { keyIndex: estimatedKey, totalKeys, errorMessage: errMsg } : { errorMessage: errMsg }
      );
      this.ctx.hud.log(`Lỗi dịch trang #${task.index + 1}: ${errMsg}`, true);
      DebugLogger.error('Content:Translate', `Trang #${task.index + 1}: ${errMsg}`, err);
      if (this.ctx.translationQueue.size() <= 1 && this.ctx.ocrQueue.size() === 0) {
        this.ctx.hud.setState('error');
      }
    }
  }

  /**
   * Slices tall continuous webtoon strips into individual page chunks (e.g. 2200px each)
   * for Vision AI to avoid horizontal squashing, box displacement, and hallucinated panels.
   */
  private async processVisionStrip(
    task: OcrTask,
    wrapper: HTMLElement,
    imageUrl: string,
    naturalWidth: number,
    naturalHeight: number
  ): Promise<void> {
    const img = task.img;
    const settings = this.ctx.getSettings();
    const totalKeys = this.getKeyCount();
    const estimatedKey = totalKeys > 0 ? (task.index % totalKeys) + 1 : undefined;

    // 1. Check Cache DB for the full image first
    if (imageUrl) {
      try {
        const cacheCheck: any = await SafeMessenger.send({
          action: 'OCR_IMAGE',
          imageUrl,
          chapterUrl: window.location.href
        });

        if (cacheCheck?.success && cacheCheck.cached) {
          if (cacheCheck.dialogues && cacheCheck.dialogues.length > 0) {
            OverlayRenderer.renderDialogues(
              wrapper,
              cacheCheck.dialogues,
              naturalWidth,
              naturalHeight,
              (settings?.bubbleTheme || 'auto') as BubbleTheme
            );
            img.dataset.slateStatus = 'translated';
            PageBadgeManager.updateBadge(wrapper, task.index, 'translated', cacheCheck.dialogues.length);
            this.ctx.hud.log(`Trang #${task.index + 1}: Nạp từ Cache (0ms)`);
          } else {
            img.dataset.slateStatus = 'no_text';
            PageBadgeManager.updateBadge(wrapper, task.index, 'no_text');
            this.ctx.hud.log(`Trang #${task.index + 1}: Không có chữ thoại`);
          }
          this.ctx.markImageCompleted(img);
          return;
        }
      } catch {
        // Proceed with live slicing
      }
    }

    // 2. Slice tall image strip into standard comic page chunks (2200px each with 150px overlap)
    const slices = ImageCompressor.sliceForProcessing(img, 2200, 150);
    if (slices.length === 0) {
      img.dataset.slateStatus = 'error';
      PageBadgeManager.updateBadge(wrapper, task.index, 'error', undefined, { errorMessage: 'Không thể phân đoạn ảnh' });
      return;
    }

    img.dataset.slateStatus = 'ocr_running';
    PageBadgeManager.updateBadge(
      wrapper,
      task.index,
      'ocr_running',
      undefined,
      totalKeys > 0 ? { keyIndex: estimatedKey, totalKeys } : undefined
    );

    const allDialogues: DialogueItem[] = [];
    let lastKeyIndex = estimatedKey;

    for (let sIdx = 0; sIdx < slices.length; sIdx++) {
      const slice = slices[sIdx];
      this.ctx.hud.log(
        `Trang #${task.index + 1}: Vision AI đang dịch đoạn ${sIdx + 1}/${slices.length}...`
      );

      const resp: any = await SafeMessenger.send({
        action: 'OCR_IMAGE',
        chapterUrl: window.location.href,
        dataUrl: slice.dataUrl,
        naturalWidth: slice.naturalWidth,
        naturalHeight: slice.sliceHeight
      });

      if ((resp as any)?.isContextInvalidated) {
        this.ctx.onContextInvalidated();
        return;
      }

      if (resp?.success && Array.isArray(resp.dialogues)) {
        if (resp.keyIndex) lastKeyIndex = resp.keyIndex;

        for (const d of resp.dialogues) {
          if (!d.normBox) continue;

          const sliceH = slice.sliceHeight;
          const slicePixelYmin = (d.normBox.ymin / 1000) * sliceH;
          const slicePixelYmax = (d.normBox.ymax / 1000) * sliceH;
          const globalPixelYmin = slice.startY + slicePixelYmin;
          const globalPixelYmax = slice.startY + slicePixelYmax;

          // Remap normalized coordinates to global 14000+ px scale
          const globalNormYmin = Math.round((globalPixelYmin / naturalHeight) * 1000);
          const globalNormYmax = Math.round((globalPixelYmax / naturalHeight) * 1000);

          const remappedDialogue: DialogueItem = {
            ...d,
            box: {
              x: Math.round((d.normBox.xmin / 1000) * naturalWidth),
              y: Math.round(globalPixelYmin),
              width: Math.round(((d.normBox.xmax - d.normBox.xmin) / 1000) * naturalWidth),
              height: Math.round(globalPixelYmax - globalPixelYmin),
              confidence: d.box?.confidence ?? 0.95
            },
            normBox: {
              ymin: globalNormYmin,
              xmin: d.normBox.xmin,
              ymax: globalNormYmax,
              xmax: d.normBox.xmax
            }
          };

          // Deduplicate if in overlap region
          if (slice.startY > 0 && slicePixelYmin < 180) {
            const isDup = allDialogues.some((existing) => {
              if (!existing.normBox) return false;
              const yDiff = Math.abs(existing.normBox.ymin - globalNormYmin);
              const xDiff = Math.abs(existing.normBox.xmin - d.normBox.xmin);
              return yDiff < 20 && xDiff < 25;
            });
            if (isDup) continue;
          }

          allDialogues.push(remappedDialogue);
        }
      }
    }

    if (allDialogues.length > 0) {
      OverlayRenderer.renderDialogues(
        wrapper,
        allDialogues,
        naturalWidth,
        naturalHeight,
        (settings?.bubbleTheme || 'auto') as BubbleTheme
      );
      img.dataset.slateStatus = 'translated';
      PageBadgeManager.updateBadge(
        wrapper,
        task.index,
        'translated',
        allDialogues.length,
        lastKeyIndex ? { keyIndex: lastKeyIndex, totalKeys } : undefined
      );
      this.ctx.hud.log(
        `Trang #${task.index + 1}: Vision AI đã hoàn tất ${allDialogues.length} câu thoại`
      );

      // Save complete aggregated translation to Cache DB
      if (imageUrl) {
        SafeMessenger.send({
          action: 'SAVE_TRANSLATION',
          imageUrl,
          chapterUrl: window.location.href,
          dialogues: allDialogues,
          width: naturalWidth,
          height: naturalHeight
        }).catch(() => {});
      }
    } else {
      img.dataset.slateStatus = 'no_text';
      PageBadgeManager.updateBadge(wrapper, task.index, 'no_text');
      this.ctx.hud.log(`Trang #${task.index + 1}: Không tìm thấy chữ thoại`);
    }

    this.ctx.markImageCompleted(img);
  }
}
