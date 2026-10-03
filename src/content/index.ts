import browser from 'webextension-polyfill';
import { StorageService } from '../shared/storage';
import { BubbleTheme, ExtensionSettings } from '../shared/types';
import { FloatingHud } from './hud/hud';
import { OverlayRenderer } from './overlay/overlay-renderer';
import { OrderedTaskQueue, OcrTask, TranslationTask } from './priority-queue';
import { ToonheyAdapter } from './toonhey-adapter';
import { PageBadgeManager } from './page-badge';

class SpeedySlateContentApp {
  private settings!: ExtensionSettings;
  private hud!: FloatingHud;
  private ocrQueue!: OrderedTaskQueue<OcrTask>;
  private translationQueue!: OrderedTaskQueue<TranslationTask>;
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
          this.ocrQueue?.pause();
          this.translationQueue?.pause();
          this.hud.log('Da tam dung tien trinh dich truyen');
        }
      },
      onToggleVisibility: (visible) => OverlayRenderer.setAllVisibility(visible),
      onClearChapterCache: async () => {
        const resp: any = await browser.runtime.sendMessage({
          action: 'CLEAR_CHAPTER_CACHE',
          chapterUrl: window.location.href
        });
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
        this.hud.updateStatus(0, this.images.length);
        this.hud.setState('idle');
        this.hud.log(`Da xoa ${resp?.deleted || 0} ban dich cache cua chuong nay`);
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
      async (task) => this.processOcrTask(task),
      2,
      (t) => t.img
    );
    this.ocrQueue.pause();

    this.translationQueue = new OrderedTaskQueue<TranslationTask>(
      async (task) => this.processTranslationTask(task),
      1,
      (t) => t.img
    );
    this.translationQueue.pause();

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
    }
  }

  private async handleStartTranslating(): Promise<void> {
    if (!this.isModelReady) {
      await this.checkModelStatusFromBackground(true);
      if (!this.isModelReady) {
        this.hud.setState('idle');
        return;
      }
    }

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
      const resp: any = await browser.runtime.sendMessage({ action: 'CHECK_MODEL_STATUS' });
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
      const resp: any = await browser.runtime.sendMessage({
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
          if (cached) {
            const wrapper = img.parentElement;
            if (Array.isArray(cached.dialogues) && cached.dialogues.length > 0) {
              if (wrapper) {
                OverlayRenderer.renderDialogues(
                  wrapper,
                  cached.dialogues,
                  cached.naturalWidth || img.naturalWidth || 800,
                  cached.naturalHeight || img.naturalHeight || 1200,
                  (this.settings?.bubbleTheme || 'light') as BubbleTheme
                );
                img.dataset.slateStatus = 'translated';
                PageBadgeManager.updateBadge(wrapper, i, 'translated', cached.dialogues.length);
              }
            } else {
              img.dataset.slateStatus = 'no_text';
              if (wrapper) {
                PageBadgeManager.updateBadge(wrapper, i, 'no_text');
              }
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

  /**
   * Stage 1: Fast local WebAssembly OCR Pipeline (runs at 100% CPU speed, 0ms artificial delay)
   */
  private async processOcrTask(task: OcrTask): Promise<void> {
    if (this.completedImages.has(task.img)) return;

    const img = task.img;
    const imageUrl = img.src;
    const wrapper = img.parentElement;
    if (!wrapper) return;

    if (!img.complete || img.naturalWidth === 0) {
      ToonheyAdapter.forceTriggerImage(img);
      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
        setTimeout(resolve, 3000);
      });
    }

    img.dataset.slateStatus = 'ocr_running';
    PageBadgeManager.updateBadge(wrapper, task.index, 'ocr_running');

    let dataUrl: string | undefined;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width || 800;
      canvas.height = img.naturalHeight || img.height || 1200;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      }
    } catch {
      // Background will fetch directly if canvas is tainted
    }

    const resp: any = await browser.runtime.sendMessage({
      action: 'OCR_IMAGE',
      imageUrl,
      chapterUrl: window.location.href,
      dataUrl
    });

    if (resp?.success) {
      if (resp.cached) {
        if (resp.dialogues && resp.dialogues.length > 0) {
          OverlayRenderer.renderDialogues(
            wrapper,
            resp.dialogues,
            resp.naturalWidth || img.naturalWidth || 800,
            resp.naturalHeight || img.naturalHeight || 1200,
            (this.settings?.bubbleTheme || 'light') as BubbleTheme
          );
          img.dataset.slateStatus = 'translated';
          PageBadgeManager.updateBadge(wrapper, task.index, 'translated', resp.dialogues.length);
        } else {
          img.dataset.slateStatus = 'no_text';
          PageBadgeManager.updateBadge(wrapper, task.index, 'no_text');
        }
        this.markImageCompleted(img);
        this.hud.log(`Trang #${task.index + 1}: Nap tu Cache (0ms)`);
      } else if (!resp.dialogues || resp.dialogues.length === 0) {
        img.dataset.slateStatus = 'no_text';
        PageBadgeManager.updateBadge(wrapper, task.index, 'no_text');
        this.markImageCompleted(img);
        this.hud.log(`Trang #${task.index + 1}: Khong co chu`);
      } else {
        // Co chu -> Day vao hang doi dich Consumer (serialized rate limiter)
        img.dataset.slateStatus = 'ocr_done';
        PageBadgeManager.updateBadge(wrapper, task.index, 'ocr_done', resp.dialogues.length);
        this.hud.log(`Trang #${task.index + 1}: Da quet ${resp.dialogues.length} cau thoai, dang cho dich...`);
        this.translationQueue.enqueue({
          index: task.index,
          img: task.img,
          dialogues: resp.dialogues,
          naturalWidth: resp.naturalWidth || img.naturalWidth || 800,
          naturalHeight: resp.naturalHeight || img.naturalHeight || 1200
        });
      }
    } else {
      img.dataset.slateStatus = 'error';
      PageBadgeManager.updateBadge(wrapper, task.index, 'error');
      this.hud.log(`Loi OCR trang #${task.index + 1}: ${resp?.error || 'Loi khong xac dinh'}`, true);
    }
  }

  /**
   * Stage 2: Rate-limited API Translation Consumer (Gemini/Groq spacing & backoff)
   */
  private async processTranslationTask(task: TranslationTask): Promise<void> {
    if (this.completedImages.has(task.img)) return;

    const img = task.img;
    const wrapper = img.parentElement;
    if (!wrapper) return;

    img.dataset.slateStatus = 'translating';
    PageBadgeManager.updateBadge(wrapper, task.index, 'translating', task.dialogues.length);
    this.hud.log(`Trang #${task.index + 1}: Dang dich ${task.dialogues.length} cau thoai...`);

    const resp: any = await browser.runtime.sendMessage({
      action: 'TRANSLATE_DIALOGUES',
      imageUrl: img.src,
      chapterUrl: window.location.href,
      dialogues: task.dialogues,
      naturalWidth: task.naturalWidth,
      naturalHeight: task.naturalHeight
    });

    if (resp?.success && Array.isArray(resp.dialogues)) {
      OverlayRenderer.renderDialogues(
        wrapper,
        resp.dialogues,
        task.naturalWidth,
        task.naturalHeight,
        (this.settings?.bubbleTheme || 'light') as BubbleTheme
      );
      img.dataset.slateStatus = 'translated';
      PageBadgeManager.updateBadge(wrapper, task.index, 'translated', resp.dialogues.length);
      this.markImageCompleted(img);
      this.hud.log(`Trang #${task.index + 1}: Hoan tat ${resp.dialogues.length} cau thoai`);
    } else {
      img.dataset.slateStatus = 'error';
      PageBadgeManager.updateBadge(wrapper, task.index, 'error');
      this.hud.log(`Loi dich trang #${task.index + 1}: ${resp?.error || 'Loi API'}`, true);
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
    if (document.getElementById('speedyslate-missing-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'speedyslate-missing-banner';
    banner.style.cssText = `
      position: fixed; top: 16px; left: 50%; transform: translateX(-50%);
      background: rgba(18, 18, 28, 0.95); backdrop-filter: blur(16px); color: #ffffff; padding: 12px 20px;
      border-radius: 14px; z-index: 2147483647; box-shadow: 0 12px 35px rgba(0,0,0,0.6);
      font-family: system-ui, -apple-system, sans-serif; font-size: 13px; display: flex; align-items: center; gap: 14px;
      border: 1px solid rgba(168, 85, 247, 0.4);
    `;
    banner.innerHTML = `
      <span><b>SpeedySlate</b>: Ban chua tai model OCR (~10MB). Mo popup cai dat tien ich de tai model.</span>
      <button style="background: linear-gradient(135deg, #6366f1, #8b5cf6); border: none; color: #fff; padding: 6px 14px; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 12px;">Dong</button>
    `;
    banner.querySelector('button')?.addEventListener('click', () => banner.remove());
    document.body?.appendChild(banner);
  }
}

// Khoi chay ngay lap tuc
const app = new SpeedySlateContentApp();
app.start().catch((err) => console.error('[SpeedySlate] Loi khoi dong:', err));
