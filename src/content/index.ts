import browser from 'webextension-polyfill';
import { StorageService } from '../shared/storage';
import { BubbleTheme, ExtensionSettings } from '../shared/types';
import { FloatingHud } from './hud/hud';
import { OverlayRenderer } from './overlay/overlay-renderer';
import { OrderedTranslationQueue, QueueTask } from './priority-queue';
import { ToonheyAdapter } from './toonhey-adapter';

class SpeedySlateContentApp {
  private settings!: ExtensionSettings;
  private hud!: FloatingHud;
  private queue!: OrderedTranslationQueue;
  private images: HTMLImageElement[] = [];
  private translatedImagesCount: number = 0;
  private isModelReady: boolean = false;
  private mutationObserver: MutationObserver | null = null;

  constructor() {
    // 1. Khởi tạo Modern Glassmorphism HUD ở trạng thái Chờ (Idle)
    this.hud = new FloatingHud({
      onToggleTranslate: async () => {
        if (!this.queue) return;

        const currentState = this.hud.getState();
        if (currentState === 'translating') {
          // Bắt đầu dịch
          await this.handleStartTranslating();
        } else {
          // Tạm dừng dịch
          this.queue.pause();
          this.hud.log('Đã tạm dừng tiến trình dịch truyện');
        }
      },
      onToggleVisibility: (visible) => OverlayRenderer.setAllVisibility(visible),
      onClearChapterCache: async () => {
        const resp: any = await browser.runtime.sendMessage({
          action: 'CLEAR_CHAPTER_CACHE',
          chapterUrl: window.location.href
        });
        document.querySelectorAll('.speedyslate-bubble').forEach((el) => el.remove());
        this.images.forEach((img) => delete img.dataset.slateStatus);
        this.translatedImagesCount = 0;
        this.hud.updateStatus(0, this.images.length);
        this.hud.setState('idle');
        this.hud.log(`Đã xóa ${resp?.deleted || 0} bản dịch cache của chương này`);
      }
    });

    this.hud.log('SpeedySlate đang khởi tạo...');
  }

  public async start(): Promise<void> {
    console.log('[SpeedySlate] Khởi chạy trên trang:', window.location.href);

    try {
      this.settings = await StorageService.getSettings();
    } catch {
      this.hud.log('Đang dùng cấu hình mặc định');
    }

    // 2. Khởi tạo hàng đợi dịch tuần tự (mặc định PAUSED cho đến khi người dùng bấm dịch)
    this.queue = new OrderedTranslationQueue(async (task) => {
      await this.processImageTask(task);
    }, 2);
    this.queue.pause();

    // 3. Quét toàn bộ ảnh trong chương và theo dõi DOM
    this.detectImages();
    this.setupMutationObserver();
    this.setupIntersectionObserver();

    // 4. Kiểm tra trạng thái Model OCR từ Background
    await this.checkModelStatusFromBackground(false);

    this.hud.log(`Sẵn sàng dịch. Tìm thấy ${this.images.length} trang truyện`);
  }

  private async handleStartTranslating(): Promise<void> {
    // Kiểm tra model OCR
    if (!this.isModelReady) {
      await this.checkModelStatusFromBackground(true);
      if (!this.isModelReady) {
        this.hud.setState('idle');
        return;
      }
    }

    this.hud.log(`Bắt đầu dịch chương (${this.images.length} trang)...`);

    // Kích hoạt nạp toàn bộ ảnh ngay tại chỗ
    ToonheyAdapter.forceLoadAll(this.images);

    // Nạp toàn bộ ảnh chưa dịch vào hàng đợi
    this.enqueueAllImages();

    // Kích hoạt chạy hàng đợi
    this.queue.resume();
  }

  private async checkModelStatusFromBackground(showBannerIfMissing: boolean): Promise<void> {
    try {
      const resp: any = await browser.runtime.sendMessage({ action: 'CHECK_MODEL_STATUS' });
      if (resp?.success && resp.status?.status === 'ready') {
        this.isModelReady = true;
        this.hud.log('Model OCR đã sẵn sàng');
      } else {
        this.isModelReady = false;
        this.hud.log('Chưa tải model OCR. Mở popup tiện ích để tải (~10MB)', true);
        if (showBannerIfMissing) {
          this.showModelMissingBanner();
        }
      }
    } catch (err: any) {
      this.hud.log(`Lỗi kiểm tra model: ${err.message}`, true);
    }
  }

  private detectImages(): void {
    const rawImages = ToonheyAdapter.getChapterImages();
    let newFound = 0;

    for (const img of rawImages) {
      if (!this.images.includes(img)) {
        ToonheyAdapter.wrapImage(img);
        this.images.push(img);
        newFound++;
      }
    }

    if (newFound > 0) {
      this.hud.updateStatus(this.translatedImagesCount, this.images.length);
      this.hud.log(`Đã phát hiện ${this.images.length} trang truyện`);

      // Nếu đang trong tiến trình dịch thì tự động đưa các ảnh mới vào hàng đợi
      if (this.hud.getState() === 'translating') {
        this.enqueueAllImages();
      }
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
            if (index !== -1 && !img.dataset.slateStatus && this.hud.getState() === 'translating') {
              this.queue.enqueue({ index, img });
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
      if (!img.dataset.slateStatus) {
        this.queue.enqueue({ index: i, img });
      }
    }
  }

  private async processImageTask(task: QueueTask): Promise<void> {
    if (!this.isModelReady) {
      await this.checkModelStatusFromBackground(true);
      if (!this.isModelReady) return;
    }

    const img = task.img;
    const imageUrl = img.src;
    const wrapper = img.parentElement;
    if (!wrapper) return;

    if (!img.complete || img.naturalWidth === 0) {
      ToonheyAdapter.forceTriggerImage(img);
      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    }

    this.hud.log(`Đang xử lý trang #${task.index + 1}...`);

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
      // Background will fetch imageUrl directly if canvas is tainted
    }

    const resp: any = await browser.runtime.sendMessage({
      action: 'TRANSLATE_IMAGE',
      imageUrl,
      chapterUrl: window.location.href,
      dataUrl
    });

    if (resp?.success && Array.isArray(resp.dialogues)) {
      if (resp.dialogues.length > 0) {
        OverlayRenderer.renderDialogues(
          wrapper,
          resp.dialogues,
          resp.naturalWidth || img.naturalWidth || 800,
          resp.naturalHeight || img.naturalHeight || 1200,
          (this.settings?.bubbleTheme || 'light') as BubbleTheme
        );
      }

      this.translatedImagesCount++;
      this.hud.updateStatus(this.translatedImagesCount, this.images.length);

      if (resp.cached) {
        this.hud.log(`Trang #${task.index + 1}: Nạp từ Cache (0ms)`);
      } else if (resp.dialogues.length > 0) {
        this.hud.log(`Trang #${task.index + 1}: Hoàn tất ${resp.dialogues.length} câu thoại`);
      } else {
        this.hud.log(`Trang #${task.index + 1}: Không có chữ`);
      }
    } else {
      this.hud.log(`Lỗi trang #${task.index + 1}: ${resp?.error || 'Lỗi không xác định'}`, true);
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
      <span><b>SpeedySlate</b>: Bạn chưa tải model OCR (~10MB). Mở popup cài đặt tiện ích để tải model.</span>
      <button style="background: linear-gradient(135deg, #6366f1, #8b5cf6); border: none; color: #fff; padding: 6px 14px; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 12px;">Đóng</button>
    `;
    banner.querySelector('button')?.addEventListener('click', () => banner.remove());
    document.body?.appendChild(banner);
  }
}

// Khởi chạy ngay lập tức
const app = new SpeedySlateContentApp();
app.start().catch((err) => console.error('[SpeedySlate] Lỗi khởi động:', err));
