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
    // 1. Tạo và hiển thị Floating HUD 1-Mode đồng bộ ngay lập tức
    this.hud = new FloatingHud({
      onToggleTranslate: () => {
        if (!this.queue) return;
        if (this.queue.getIsPaused()) {
          this.queue.resume();
          this.hud.log('▶ Đang tiếp tục tiến trình dịch...');
        } else {
          this.queue.pause();
          this.hud.log('⏸ Đã tạm dừng dịch');
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
        this.hud.log(`🧹 Đã xóa ${resp?.deleted || 0} bản dịch cache của chương này.`);
      }
    });

    this.hud.log('⚡ SpeedySlate đang khởi tạo...');
  }

  public async start(): Promise<void> {
    console.log('[SpeedySlate] Khởi chạy trên trang:', window.location.href);

    try {
      this.settings = await StorageService.getSettings();
    } catch {
      this.hud.log('⚠️ Đang dùng cấu hình mặc định');
    }

    // 2. Khởi tạo hàng đợi ưu tiên từ trên xuống dưới (2 luồng song song)
    this.queue = new OrderedTranslationQueue(async (task) => {
      await this.processImageTask(task);
    }, 2);

    // 3. Quét ảnh ban đầu và theo dõi DOM
    this.detectImages();
    this.setupMutationObserver();
    this.setupIntersectionObserver();

    // 4. Kiểm tra Model OCR từ Background (Cùng Extension Origin)
    await this.checkModelStatusFromBackground();

    // 5. Đưa các ảnh đầu tiên vào hàng đợi
    this.enqueueInitialImages();
  }

  private async checkModelStatusFromBackground(): Promise<void> {
    try {
      const resp: any = await browser.runtime.sendMessage({ action: 'CHECK_MODEL_STATUS' });
      if (resp?.success && resp.status?.status === 'ready') {
        this.isModelReady = true;
        this.hud.log('✅ Model OCR đã sẵn sàng!');
      } else {
        this.isModelReady = false;
        this.hud.log('⚠️ Chưa tải model OCR. Bấm icon tiện ích để tải (~10MB)', true);
        this.showModelMissingBanner();
      }
    } catch (err: any) {
      this.hud.log(`❌ Lỗi kiểm tra model: ${err.message}`, true);
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
      this.hud.log(`🔍 Tìm thấy ${this.images.length} ảnh trong chương truyện.`);
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
            if (index !== -1 && !img.dataset.slateStatus) {
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

  private enqueueInitialImages(): void {
    for (let i = 0; i < Math.min(3, this.images.length); i++) {
      const img = this.images[i];
      if (!img.dataset.slateStatus) {
        this.queue.enqueue({ index: i, img });
      }
    }
  }

  private async processImageTask(task: QueueTask): Promise<void> {
    if (!this.isModelReady) {
      await this.checkModelStatusFromBackground();
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

    this.hud.log(`⏳ Đang xử lý ảnh #${task.index + 1}...`);

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
        this.hud.log(`⚡ Ảnh #${task.index + 1}: Nạp từ Cache (0ms)`);
      } else if (resp.dialogues.length > 0) {
        this.hud.log(`✅ Ảnh #${task.index + 1}: Dịch xong ${resp.dialogues.length} câu thoại`);
      } else {
        this.hud.log(`ℹ️ Ảnh #${task.index + 1}: Không có chữ`);
      }
    } else {
      this.hud.log(`❌ Lỗi ảnh #${task.index + 1}: ${resp?.error || 'Lỗi không xác định'}`, true);
    }
  }

  private showModelMissingBanner(): void {
    if (document.getElementById('speedyslate-missing-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'speedyslate-missing-banner';
    banner.style.cssText = `
      position: fixed; top: 16px; left: 50%; transform: translateX(-50%);
      background: #1e293b; color: #ffffff; padding: 12px 20px;
      border-radius: 10px; z-index: 2147483647; box-shadow: 0 8px 30px rgba(0,0,0,0.5);
      font-family: sans-serif; font-size: 13px; display: flex; align-items: center; gap: 12px;
      border: 1px solid #3b82f6;
    `;
    banner.innerHTML = `
      <span>⚠️ <b>SpeedySlate</b>: Bạn chưa tải model OCR (~10MB). Bấm vào icon tiện ích trên thanh công cụ để tải.</span>
      <button style="background: #3b82f6; border: none; color: #fff; padding: 5px 12px; border-radius: 6px; cursor: pointer; font-weight: bold;">Đóng</button>
    `;
    banner.querySelector('button')?.addEventListener('click', () => banner.remove());
    document.body?.appendChild(banner);
  }
}

// Khởi chạy ngay lập tức
const app = new SpeedySlateContentApp();
app.start().catch((err) => console.error('[SpeedySlate] Lỗi khởi động:', err));
