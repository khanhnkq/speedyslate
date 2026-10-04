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

class SpeedySlateContentApp {
  private settings!: ExtensionSettings;
  private hud!: FloatingHud;
  private ocrQueue!: OrderedTaskQueue<OcrTask>;
  private translationQueue!: OrderedTaskQueue<TranslationTask>;
  private taskProcessor!: TaskProcessor;
  private images: HTMLImageElement[] = [];
  private completedImages = new Set<HTMLImageElement>();
  private isModelReady: boolean = false;
  private mutationObserver: MutationObserver | null = null;

  constructor() {
    // 1. Khoi tao Modern Glassmorphism HUD o trang thai Cho (Idle)
    this.hud = new FloatingHud({
      onToggleTranslate: async () => {
        const currentState = this.hud.getState();
        if (currentState === 'translating') {
          await this.handleStartTranslating();
        } else {
          try {
            sessionStorage.setItem('speedyslate_translating', 'false');
          } catch {}
          this.ocrQueue?.pause();
          this.translationQueue?.pause();
          this.hud.log('Da tam dung tien trinh dich truyen');
        }
      },
      onToggleVisibility: (visible) => OverlayRenderer.setAllVisibility(visible),
      onClearChapterCache: async () => {
        const resp: any = await SafeMessenger.send({
          action: 'CLEAR_CHAPTER_CACHE',
          chapterUrl: window.location.href
        });
        this.resetPageTranslations();
        this.hud.log(`Da xoa ${resp?.deleted || 0} ban dich cache cua chuong nay`);
      },
      onClearAllCache: async () => {
        await SafeMessenger.send({ action: 'CLEAR_ALL_CACHE' });
        this.resetPageTranslations();
        this.hud.log('Da don sach toan bo cache');
      }
    });

    this.hud.log('SpeedySlate dang khoi tao...');
  }

  public async start(): Promise<void> {
    console.log('[SpeedySlate] Khoi chay tren trang:', window.location.href);

    try {
      this.settings = await StorageService.getSettings();
    } catch {
      this.hud.log('Dang dung cau hinh mac dinh');
    }

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
      hud: this.hud,
      completedImages: this.completedImages,
      ocrQueue: this.ocrQueue,
      translationQueue: this.translationQueue,
      markImageCompleted: (img) => this.markImageCompleted(img),
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
      this.hud.log(`San sang dich. Tim thay ${this.images.length} trang truyen`);

      // Tu dong tiep tuc dich neu dang trong phien doc lien tuc (vi du lat trang nHentai hoac chuyen chuong)
      try {
        if (sessionStorage.getItem('speedyslate_translating') === 'true') {
          this.hud.setState('translating');
          await this.handleStartTranslating();
        }
      } catch {}
    }
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
    this.hud.updateStatus(0, this.images.length);
    this.hud.setState('idle');
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
        this.hud.setState('idle');
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

    this.hud.log(`Bat dau dich chuong (${this.images.length} trang)...`);

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
        this.hud.log('Model OCR da san sang');
      } else {
        this.isModelReady = false;
        this.hud.log('Chua tai model OCR. Mo popup tien ich de tai (~10MB)', true);
        if (showBannerIfMissing) {
          this.showModelMissingBanner();
        }
      }
    } catch (err: any) {
      this.hud.log(`Loi kiem tra model: ${err.message}`, true);
    }
  }

  private detectImages(): void {
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
      this.hud.updateStatus(this.completedImages.size, this.images.length);
      this.hud.log(`Da phat hien ${this.images.length} trang truyen`);

      if (this.hud.getState() === 'translating') {
        this.enqueueAllImages();
      } else {
        this.restoreCachedTranslations();
      }
    }
  }

  private async restoreCachedTranslations(): Promise<void> {
    if (this.images.length === 0) return;

    const urls = this.images
      .map((img) => img.dataset.src || img.getAttribute('data-src') || img.src)
      .filter(Boolean);

    try {
      const resp: any = await SafeMessenger.send({
        action: 'GET_CHAPTER_TRANSLATIONS',
        imageUrls: urls
      });

      if (resp?.success && resp.translations) {
        const cache = resp.translations;
        let newlyRestored = 0;

        for (let i = 0; i < this.images.length; i++) {
          const img = this.images[i];
          if (this.completedImages.has(img)) continue;

          const url = img.dataset.src || img.getAttribute('data-src') || img.src;
          const cached = cache[url];
          if (cached && Array.isArray(cached.dialogues) && cached.dialogues.length > 0) {
            const wrapper = img.parentElement;
            if (wrapper) {
              OverlayRenderer.renderDialogues(
                wrapper,
                cached.dialogues,
                cached.naturalWidth || img.naturalWidth || 800,
                cached.naturalHeight || img.naturalHeight || 1200,
                (this.settings?.bubbleTheme || 'auto') as BubbleTheme
              );
              img.dataset.slateStatus = 'translated';
              PageBadgeManager.updateBadge(wrapper, i, 'translated', cached.dialogues.length);
            }
            this.markImageCompleted(img, false);
            newlyRestored++;
          }
        }

        if (newlyRestored > 0) {
          this.hud.updateStatus(this.completedImages.size, this.images.length);
          this.hud.log(`Da nap tuc thi ${newlyRestored} trang tu Cache (0ms)`);
          if (this.completedImages.size >= this.images.length) {
            this.hud.setState('completed');
          }
        }
      }
    } catch {
      // Quiet fallback if cache check fails
    }
  }

  private setupMutationObserver(): void {
    this.mutationObserver = new MutationObserver(() => {
      this.detectImages();
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
            if (index !== -1 && !this.completedImages.has(img) && this.hud.getState() === 'translating') {
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
      if (!this.completedImages.has(img)) {
        this.ocrQueue.enqueue({ index: i, img });
      }
    }
  }

  private markImageCompleted(img: HTMLImageElement, checkAllDone: boolean = true): void {
    this.completedImages.add(img);
    this.hud.updateStatus(this.completedImages.size, this.images.length);
    if (checkAllDone && this.completedImages.size >= this.images.length && this.hud.getState() === 'translating') {
      this.hud.setState('completed');
      this.hud.log(`Da hoan tat dich toan bo chuong (${this.images.length} trang)`);
    }
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

// Khoi chay ngay lap tuc
const app = new SpeedySlateContentApp();
app.start().catch((err) => {
  console.error('[SpeedySlate] Loi khoi dong:', err);
  DebugLogger.error('Content:Init', err.message, err);
});
