import browser from 'webextension-polyfill';
import { StorageService } from '../shared/storage';
import { BubbleTheme, ExtensionSettings } from '../shared/types';
import { FloatingHud } from './hud/hud';
import { OverlayRenderer } from './overlay/overlay-renderer';
import { OrderedTaskQueue, OcrTask, TranslationTask } from './priority-queue';
import { ToonheyAdapter } from './toonhey-adapter';
import { PageBadgeManager } from './page-badge';
import { ModelMissingBanner } from './missing-banner';
import { DebugLogger } from '../shared/debug-logger';
import { SafeMessenger } from './safe-messenger';
import { TaskProcessor } from './task-processor';
import { CompanionController } from './companion/companion-controller';
import { SiteMatcher } from '../shared/site-matcher';
import { CacheRestorer } from './cache-restorer';

class SpeedySlateContentApp {
  private settings!: ExtensionSettings;
  private hud: FloatingHud | null = null;
  private ocrQueue!: OrderedTaskQueue<OcrTask>;
  private translationQueue!: OrderedTaskQueue<TranslationTask>;
  private taskProcessor!: TaskProcessor;
  private companionController: CompanionController | null = null;
  private images: HTMLImageElement[] = [];
  private completedImages = new Set<HTMLImageElement>();
  private isModelReady: boolean = false;
  private mutationObserver: MutationObserver | null = null;
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
      }
    });
  }

  public async start(): Promise<void> {
    if (this.isStarted) return;
    this.isStarted = true;
    console.log('[SpeedySlate] Khoi chay tren trang:', window.location.href);

    try {
      this.settings = await StorageService.getSettings();
    } catch {
      // Dung cau hinh mac dinh
    }

    this.initHud();
    this.hud?.log('SpeedySlate dang khoi tao...');

    // 2. Khoi tao 2 hang doi tach biet: OCR Producer (cuc bo) & Translation Consumer (API)
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

    // 3. Quet toan bo anh trong chuong va theo doi DOM
    this.detectImages();
    this.setupMutationObserver();
    this.setupIntersectionObserver();

    // 4. Tu dong khoi phuc ban dich tu Cache IndexedDB ngay lap tuc (0ms)
    await this.restoreCachedTranslations();

    // 5. Kiem tra trang thai Model OCR tu Background
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

    // 6. Khoi tao Story Companion (Gemini 3.8 Live API)
    const geminiKey = this.settings?.providers?.gemini?.apiKey || this.settings?.providers?.antigravity?.apiKey || '';
    const companionCfg = { enabled: true, apiKey: geminiKey, model: 'gemini-3.8-live', voiceName: 'Aoede' as const, visionEnabled: true, autoVisionOnScroll: true };
    this.companionController = new CompanionController(companionCfg);

    browser.storage.onChanged.addListener((changes: any, area: string) => {
      if (area === 'local' && changes['speedyslate_settings']?.newValue) {
        const newSettings = changes['speedyslate_settings'].newValue;
        const key = newSettings?.providers?.gemini?.apiKey || newSettings?.providers?.antigravity?.apiKey || '';
        this.companionController?.updateSettings({ ...companionCfg, apiKey: key });
      }
    });
  }

  private resetPageTranslations(): void {
    document.querySelectorAll('.speedyslate-bubble').forEach((el) => el.remove());
    this.images.forEach((img, idx) => {
      delete img.dataset.slateStatus;
      if (img.parentElement) {
        PageBadgeManager.updateBadge(img.parentElement, idx, 'idle');
      }
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
    } catch {
      // Giu nguyen settings hien tai
    }

    if (!this.isModelReady) {
      await this.checkModelStatusFromBackground(true);
      if (!this.isModelReady) {
        this.hud?.setState('idle');
        return;
      }
    }

    // Reset failed images so retrying works
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

    // Kich hoat nap toan bo anh ngay tai cho
    ToonheyAdapter.forceLoadAll(this.images);

    // Nap toan bo anh chua dich vao hang doi OCR
    this.enqueueAllImages();

    // Kich hoat chay dong thoi ca 2 hang doi
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
          this.showModelMissingBanner();
        }
      }
    } catch (err: any) {
      this.hud?.log(`Loi kiem tra model: ${err.message}`, true);
    }
  }

  private isDetecting = false;

  private detectImages(): void {
    if (this.isDetecting) return;
    this.isDetecting = true;
    try {
      const rawImages = ToonheyAdapter.getChapterImages();
      let newFound = 0;

      for (const img of rawImages) {
        if (!this.images.includes(img)) {
          ToonheyAdapter.wrapImage(img);
          this.images.push(img);
          const index = this.images.length - 1;
          if (img.parentElement) {
            PageBadgeManager.ensureBadge(img.parentElement, index);
          }
          newFound++;
        }
      }

      if (newFound > 0) {
        this.images.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
        this.images.forEach((img, idx) => {
          if (img.parentElement) {
            PageBadgeManager.ensureBadge(img.parentElement, idx);
          }
        });
        this.hud?.updateStatus(this.completedImages.size, this.images.length);
        this.hud?.log(`Da phat hien ${this.images.length} trang truyen`);

        if (this.hud?.getState() === 'translating') {
          this.enqueueAllImages();
        } else {
          this.restoreCachedTranslations();
        }
      }
    } finally {
      this.isDetecting = false;
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
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
    }
    this.companionController?.destroy?.();
    this.companionController = null;
    this.resetPageTranslations();
    this.hud?.destroy();
    this.hud = null;
  }

  private setupMutationObserver(): void {
    let debounceTimer: any = null;
    this.mutationObserver = new MutationObserver(() => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        this.detectImages();
      }, 300);
    });
    this.mutationObserver.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  private setupIntersectionObserver(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const index = this.images.indexOf(img);
            if (
              index !== -1 &&
              !this.completedImages.has(img) &&
              !img.dataset.slateStatus &&
              this.hud?.getState() === 'translating'
            ) {
              this.ocrQueue.enqueue({ index, img });
            }
          }
        });
      },
      { root: null, rootMargin: '0px 0px 800px 0px', threshold: 0.01 }
    );

    setInterval(() => {
      this.images.forEach((img) => observer.observe(img));
    }, 2000);
  }

  private enqueueAllImages(): void {
    for (let i = 0; i < this.images.length; i++) {
      const img = this.images[i];
      if (
        !this.completedImages.has(img) &&
        (!img.dataset.slateStatus || img.dataset.slateStatus === 'error')
      ) {
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

  /**
   * Checks if all detected images have completed or all queues are empty,
   * automatically stops the translation workflow to prevent infinite loops / rate limit errors.
   */
  private checkAndHandleCompletion(): void {
    const currentState = this.hud?.getState();
    if (currentState !== 'translating' && currentState !== 'completed') return;
    const total = this.images.length;
    if (total === 0) return;

    // Condition 1: All images successfully finished
    if (this.completedImages.size >= total) {
      this.finishTranslating();
      return;
    }

    // Condition 2: Both OCR and Translation queues are empty and all images have finished their attempt
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

  /**
   * Gracefully stops translation, pauses queues, clears session flag, and updates HUD state
   */
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

  private showModelMissingBanner(): void {
    ModelMissingBanner.show();
  }
}

// Global error handlers
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

// Khởi chạy ngay lập tức
const app = new SpeedySlateContentApp();
app.init().catch((err) => {
  console.error('[SpeedySlate] Lỗi khởi động:', err);
  DebugLogger.error('Content:Init', err.message, err);
});
