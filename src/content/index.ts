import browser from 'webextension-polyfill';
import { StorageService } from '../shared/storage';
import { BubbleTheme, ExtensionSettings } from '../shared/types';
import { FloatingHud } from './hud/hud';
import { OverlayRenderer } from './overlay/overlay-renderer';
import { OrderedTaskQueue, OcrTask, TranslationTask } from './priority-queue';
import { ComicPanelAdapter } from './panel-adapter';
import { ModelMissingBanner } from './missing-banner';
import { DebugLogger } from '../shared/debug-logger';
import { SafeMessenger } from './safe-messenger';
import { TaskProcessor } from './task-processor';
import { SiteMatcher } from '../shared/site-matcher';
import { CacheRestorer } from './cache-restorer';
import { ChapterScanner } from './chapter-scanner';
import { isScreenCropShortcut, ScreenCropOverlay } from './screen-crop';

class SpeedySlateContentApp {
  private settings!: ExtensionSettings;
  private hud: FloatingHud | null = null;
  private ocrQueue!: OrderedTaskQueue<OcrTask>;
  private translationQueue!: OrderedTaskQueue<TranslationTask>;
  private taskProcessor!: TaskProcessor;
  private scanner!: ChapterScanner;
  private screenCrop!: ScreenCropOverlay;
  private cropKeyListener: ((e: KeyboardEvent) => void) | null = null;
  private images: HTMLImageElement[] = [];
  private completedImages = new Set<HTMLImageElement>();
  private isModelReady: boolean = false;
  private isStarted = false;

  public async init(): Promise<void> {
    try {
      this.settings = await StorageService.getSettings();
    } catch {
      // Dùng cấu hình mặc định
    }

    this.setupMessageListener();

    if (!SiteMatcher.isSiteAllowed(window.location.hostname, this.settings)) {
      return;
    }

    await this.start();
  }

  private setupMessageListener(): void {
    browser.runtime.onMessage.addListener((msg: any, _sender: any, sendResponse?: any) => {
      if (msg?.action === 'CHECK_SITE_STATUS') {
        const isAllowed = SiteMatcher.isSiteAllowed(window.location.hostname, this.settings);
        sendResponse?.({
          active: this.isStarted,
          hostname: window.location.hostname,
          isAllowed
        });
        return true;
      }
      if (msg?.action === 'ACTIVATE_CURRENT_SITE') {
        StorageService.getSettings().then(async (newSettings) => {
          this.settings = newSettings;
          await this.start();
          sendResponse?.({ success: true });
        });
        return true;
      }
      if (msg?.action === 'DEACTIVATE_CURRENT_SITE') {
        this.stop();
        sendResponse?.({ success: true });
        return true;
      }
      if (msg?.action === 'CACHE_CLEARED') {
        this.resetPageTranslations();
        this.hud?.log('Cache đã được làm mới từ tiện ích');
      }
    });
  }

  private initHud(): void {
    if (this.hud) return;
    this.hud = new FloatingHud({
      onToggleTranslate: async () => {
        const currentState = this.hud?.getState();
        if (currentState === 'translating') {
          await this.handleStartTranslating();
        } else {
          try {
            sessionStorage.setItem('speedyslate_translating', 'false');
          } catch {}
          this.ocrQueue?.pause();
          this.translationQueue?.pause();
          this.hud?.log('Đã tạm dừng tiến trình dịch truyện');
        }
      },
      onToggleVisibility: (visible) => OverlayRenderer.setAllVisibility(visible),
      onClearChapterCache: async () => {
        const resp: any = await SafeMessenger.send({
          action: 'CLEAR_CHAPTER_CACHE',
          chapterUrl: window.location.href
        });
        this.resetPageTranslations();
        this.hud?.log(`Đã xóa ${resp?.deleted || 0} bản dịch cache của chương này`);
      },
      onClearAllCache: async () => {
        await SafeMessenger.send({ action: 'CLEAR_ALL_CACHE' });
        this.resetPageTranslations();
        this.hud?.log('Đã dọn sạch toàn bộ cache');
      },
      onStartScreenCrop: () => this.screenCrop?.startSelection()
    });
  }

  public async start(): Promise<void> {
    if (this.isStarted) return;
    this.isStarted = true;

    try {
      this.settings = await StorageService.getSettings();
    } catch {}

    this.initHud();
    this.hud?.log('SpeedySlate dang khoi tao...');

    this.ocrQueue = new OrderedTaskQueue<OcrTask>(
      async (task) => this.taskProcessor.processOcrTask(task),
      1,
      (t) => t.img
    );
    this.ocrQueue.pause();

    this.translationQueue = new OrderedTaskQueue<TranslationTask>(
      async (task) => this.taskProcessor.processTranslationTask(task),
      1,
      (t) => t.img
    );
    this.translationQueue.pause();

    this.taskProcessor = new TaskProcessor({
      getSettings: () => this.settings,
      hud: this.hud!,
      completedImages: this.completedImages,
      ocrQueue: this.ocrQueue,
      translationQueue: this.translationQueue,
      markImageCompleted: (img) => this.markImageCompleted(img),
      onTaskFinished: () => this.checkAndHandleCompletion(),
      onContextInvalidated: () => this.handleContextInvalidated()
    });

    this.scanner = new ChapterScanner({
      images: this.images,
      completedImages: this.completedImages,
      isTranslating: () => this.hud?.getState() === 'translating',
      onNewImagesDetected: (totalCount) => {
        this.hud?.updateStatus(this.completedImages.size, totalCount);
        this.hud?.log(`Da phat hien ${totalCount} trang truyen`);
        if (this.hud?.getState() === 'translating') {
          this.enqueueAllImages();
        } else {
          this.restoreCachedTranslations();
        }
      },
      onImageVisible: (index, img) => this.ocrQueue.enqueue({ index, img }),
      onImageRecycled: (index, img) => {
        this.hud?.updateStatus(this.completedImages.size, this.images.length);
        if (this.hud?.getState() === 'translating') {
          this.ocrQueue.enqueue({ index, img });
        } else {
          this.restoreCachedTranslations();
        }
      }
    });
    this.scanner.start();

    this.screenCrop = new ScreenCropOverlay(
      () => (this.settings?.bubbleTheme || 'auto') as BubbleTheme,
      (msg, isErr) => this.hud?.log(msg, isErr)
    );
    this.cropKeyListener = (e: KeyboardEvent) => {
      if (isScreenCropShortcut(e)) {
        e.preventDefault();
        this.screenCrop.startSelection();
      }
    };
    window.addEventListener('keydown', this.cropKeyListener, true);

    await this.restoreCachedTranslations();
    await this.checkModelStatusFromBackground(false);

    if (this.completedImages.size < this.images.length) {
      this.hud?.log(`Sẵn sàng dịch. Tìm thấy ${this.images.length} trang truyện`);
      try {
        if (sessionStorage.getItem('speedyslate_translating') === 'true') {
          this.hud?.setState('translating');
          await this.handleStartTranslating();
        }
      } catch {}
    }
  }

  private resetPageTranslations(): void {
    document
      .querySelectorAll(
        '.speedyslate-bubble, .speedyslate-erase-patch, .speedyslate-clean-canvas, .speedyslate-page-badge'
      )
      .forEach((el) => el.remove());
    this.images.forEach((img) => {
      delete img.dataset.slateStatus;
    });
    this.completedImages.clear();
    this.ocrQueue?.clear();
    this.translationQueue?.clear();
    try {
      sessionStorage.setItem('speedyslate_translating', 'false');
    } catch {}
    this.hud?.updateStatus(0, this.images.length);
    this.hud?.setState('idle');
  }

  private handleContextInvalidated(): void {
    this.ocrQueue?.clear();
    this.translationQueue?.clear();
    this.hud?.setState('idle');
    this.hud?.log('Tiện ích vừa được tải lại. Vui lòng nhấn F5 (Cmd+R) để tiếp tục dịch.', true);
  }

  private async handleStartTranslating(): Promise<void> {
    try {
      this.settings = await StorageService.getSettings();
    } catch {}

    if (!this.isModelReady) {
      await this.checkModelStatusFromBackground(true);
      if (!this.isModelReady) {
        this.hud?.setState('idle');
        return;
      }
    }

    for (const img of this.images) {
      if (img.dataset.slateStatus === 'error') {
        delete img.dataset.slateStatus;
        this.completedImages.delete(img);
      }
    }

    try {
      sessionStorage.setItem('speedyslate_translating', 'true');
    } catch {}

    this.hud?.log(`Bat dau dich chuong (${this.images.length} trang)...`);
    ComicPanelAdapter.forceLoadAll(this.images);
    this.enqueueAllImages();
    this.ocrQueue.resume();
    this.translationQueue.resume();
  }

  private async checkModelStatusFromBackground(showBannerIfMissing: boolean): Promise<void> {
    try {
      const resp: any = await SafeMessenger.send({ action: 'CHECK_MODEL_STATUS' });
      if (resp?.success && resp.status?.status === 'ready') {
        this.isModelReady = true;
        this.hud?.log('Model OCR da san sang');
      } else {
        this.isModelReady = false;
        this.hud?.log('Chua tai model OCR. Mo popup tien ich de tai (~10MB)', true);
        if (showBannerIfMissing) {
          ModelMissingBanner.show();
        }
      }
    } catch (err: any) {
      this.hud?.log(`Loi kiem tra model: ${err.message}`, true);
    }
  }

  private async restoreCachedTranslations(): Promise<void> {
    await CacheRestorer.restore(
      this.images,
      this.completedImages,
      (this.settings?.bubbleTheme || 'auto') as BubbleTheme,
      (count) => {
        this.hud?.updateStatus(this.completedImages.size, this.images.length);
        this.hud?.log(`Đã nạp tức thì ${count} trang từ Cache (0ms)`);
        if (this.completedImages.size >= this.images.length) {
          this.hud?.setState('completed');
        }
      },
      (img) => this.markImageCompleted(img, false)
    );
  }

  public stop(): void {
    if (!this.isStarted) return;
    this.isStarted = false;
    this.ocrQueue?.pause();
    this.ocrQueue?.clear();
    this.translationQueue?.pause();
    this.translationQueue?.clear();
    this.scanner?.stop();
    if (this.cropKeyListener) {
      window.removeEventListener('keydown', this.cropKeyListener, true);
      this.cropKeyListener = null;
    }
    this.resetPageTranslations();
    this.hud?.destroy();
    this.hud = null;
  }

  private enqueueAllImages(): void {
    for (let i = 0; i < this.images.length; i++) {
      const img = this.images[i];
      if (!this.completedImages.has(img) && (!img.dataset.slateStatus || img.dataset.slateStatus === 'error')) {
        this.ocrQueue.enqueue({ index: i, img });
      }
    }
  }

  private markImageCompleted(img: HTMLImageElement, checkAllDone: boolean = true): void {
    this.completedImages.add(img);
    this.hud?.updateStatus(this.completedImages.size, this.images.length);
    if (checkAllDone) {
      this.checkAndHandleCompletion();
    }
  }

  private checkAndHandleCompletion(): void {
    const currentState = this.hud?.getState();
    if (currentState !== 'translating' && currentState !== 'completed') return;
    const total = this.images.length;
    if (total === 0) return;

    if (this.completedImages.size >= total) {
      this.finishTranslating();
      return;
    }

    const queuesEmpty = (this.ocrQueue?.size() ?? 0) === 0 && (this.translationQueue?.size() ?? 0) === 0;
    if (queuesEmpty) {
      const allProcessed = this.images.every(
        (img) =>
          this.completedImages.has(img) ||
          img.dataset.slateStatus === 'error' ||
          img.dataset.slateStatus === 'no_text' ||
          img.dataset.slateStatus === 'translated'
      );
      if (allProcessed) {
        this.finishTranslating();
      }
    }
  }

  private finishTranslating(): void {
    this.ocrQueue?.pause();
    this.translationQueue?.pause();

    try {
      sessionStorage.setItem('speedyslate_translating', 'false');
    } catch {}

    const completedCount = this.completedImages.size;
    const totalCount = this.images.length;
    const isDone = completedCount > 0 && completedCount >= totalCount;
    this.hud?.setState(isDone ? 'completed' : 'idle');
    this.hud?.updateStatus(completedCount, totalCount);
    this.hud?.log(
      isDone
        ? `Đã hoàn tất tiến trình dịch (${completedCount}/${totalCount} trang)`
        : `Tiến trình dịch đã dừng (${completedCount}/${totalCount} trang)`
    );
  }
}

window.addEventListener('error', (e) => {
  if (e.message?.includes('Extension context invalidated')) return;
  if (e.message?.includes('SpeedySlate') || e.message?.includes('OCR') || e.filename?.includes('content')) {
    DebugLogger.error('Content:GlobalError', e.message, e.error);
  }
});
window.addEventListener('unhandledrejection', (e) => {
  const reason = e.reason?.message || String(e.reason);
  if (reason.includes('Extension context invalidated')) return;
  if (reason.includes('SpeedySlate') || reason.includes('OCR')) {
    DebugLogger.error('Content:UnhandledRejection', reason, e.reason);
  }
});

const app = new SpeedySlateContentApp();
app.init().catch((err) => {
  console.error('[SpeedySlate] Lỗi khởi động:', err);
  DebugLogger.error('Content:Init', err.message, err);
});
