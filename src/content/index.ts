import browser from 'webextension-polyfill';
import { ModelDbService } from '../shared/model-db';
import { StorageService } from '../shared/storage';
import { TranslationCacheDb } from '../shared/translation-db';
import { BubbleTheme, DialogueItem, ExtensionSettings } from '../shared/types';
import { FloatingHud } from './hud/hud';
import { OverlayRenderer } from './overlay/overlay-renderer';
import { OrderedTranslationQueue, QueueTask } from './priority-queue';
import { AutoScroller } from './scroller';
import { ToonheyAdapter } from './toonhey-adapter';

class SpeedySlateContentApp {
  private settings!: ExtensionSettings;
  private worker: Worker | null = null;
  private scroller!: AutoScroller;
  private hud!: FloatingHud;
  private queue!: OrderedTranslationQueue;
  private images: HTMLImageElement[] = [];
  private translatedImagesCount: number = 0;
  private isModelReady: boolean = false;
  private mutationObserver: MutationObserver | null = null;

  constructor() {
    // 1. Tạo và hiển thị Floating HUD NGAY LẬP TỨC (Synchronous & Top Priority)
    // Đảm bảo người dùng luôn nhìn thấy nút điều khiển trên trang
    this.hud = new FloatingHud(3, {
      onTogglePlay: () => this.scroller?.toggle(),
      onPreloadAllWithoutScroll: () => {
        this.hud.log('🚀 Đang ép nạp toàn bộ ảnh (không cần cuộn)...');
        ToonheyAdapter.forceLoadAll(this.images);
        this.images.forEach((img, idx) => {
          if (!img.dataset.slateStatus) {
            this.queue?.enqueue({ index: idx, img });
          }
        });
        this.hud.log(`📥 Đã đưa ${this.images.length} ảnh vào hàng đợi dịch.`);
      },
      onPreloadAndReturn: () => {
        this.hud.log('🚀 Đang cuộn nạp toàn bộ ảnh của chương...');
        this.scroller?.preloadToBottomAndReturn(() => {
          this.hud.log('🎉 Đã nạp xong tất cả ảnh! Đã quay lại đầu trang để đọc.');
        });
      },
      onToggleTranslate: () => {
        if (!this.queue) return;
        if (this.queue.getIsPaused()) {
          this.queue.resume();
          this.hud.log('▶ Tiếp tục tiến trình dịch');
        } else {
          this.queue.pause();
          this.hud.log('⏸ Đã tạm ngưng dịch');
        }
      },
      onSpeedChange: (speed) => this.scroller?.setSpeed(speed),
      onToggleVisibility: (visible) => OverlayRenderer.setAllVisibility(visible),
      onClearChapterCache: async () => {
        const deleted = await TranslationCacheDb.clearChapterCache(window.location.href);
        document.querySelectorAll('.speedyslate-bubble').forEach((el) => el.remove());
        this.images.forEach((img) => delete img.dataset.slateStatus);
        this.translatedImagesCount = 0;
        this.hud.updateStatus(0, this.images.length);
        this.hud.log(`🧹 Đã xóa ${deleted} bản dịch trong cache chương này.`);
      }
    });

    this.hud.log('⚡ SpeedySlate đang khởi tạo...');
  }

  public async start(): Promise<void> {
    console.log('[SpeedySlate] Khởi chạy trên trang:', window.location.href);

    try {
      this.settings = await StorageService.getSettings();
    } catch {
      this.hud.log('⚠️ Không thể đọc cài đặt, dùng mặc định');
    }

    // 2. Khởi tạo Scroller
    this.scroller = new AutoScroller(this.settings?.autoScrollSpeed || 3, (running, isPreloading) => {
      this.hud.setPlaying(running, isPreloading);
    });

    // 3. Khởi tạo Priority Queue
    this.queue = new OrderedTranslationQueue(async (task) => {
      await this.processImageTask(task);
    }, 2);

    // 4. Khởi tạo Web Worker
    this.initWorker();

    // 5. Quét ảnh ban đầu và lắng nghe DOM thay đổi (MutationObserver cho SPA/Lazy Load)
    this.detectImages();
    this.setupMutationObserver();
    this.setupIntersectionObserver();

    // 6. Kiểm tra và nạp Model OCR từ IndexedDB
    await this.checkAndLoadModel();

    // Đưa các ảnh đầu tiên vào hàng đợi
    this.enqueueInitialImages();
  }

  private initWorker(): void {
    try {
      const workerUrl = browser.runtime.getURL('worker.js');
      this.worker = new Worker(workerUrl, { type: 'module' });
      this.hud.log('🔧 Web Worker đã kết nối');
    } catch (err: any) {
      console.warn('[SpeedySlate] Lỗi khởi tạo Worker:', err);
      this.hud.log(`⚠️ Worker: ${err.message}`, true);
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
      this.hud.log(`🔍 Tìm thấy ${this.images.length} ảnh truyện`);
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

    // Observe all detected images
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
    const img = task.img;
    const imageUrl = img.src;
    const wrapper = img.parentElement;
    if (!wrapper) return;

    // 1. Kiểm tra cache URL trước (Tránh dịch lại hoàn toàn!)
    const cached = await TranslationCacheDb.getTranslation(imageUrl);
    if (cached && cached.dialogues && cached.dialogues.length > 0) {
      OverlayRenderer.renderDialogues(
        wrapper,
        cached.dialogues,
        cached.naturalWidth || img.naturalWidth,
        cached.naturalHeight || img.naturalHeight,
        (this.settings?.bubbleTheme || 'light') as BubbleTheme
      );
      this.translatedImagesCount++;
      this.hud.updateStatus(this.translatedImagesCount, this.images.length);
      this.hud.log(`⚡ Ảnh #${task.index + 1}: Nạp tức thì từ Cache (0ms)`);
      return;
    }

    if (!this.isModelReady) return;

    // Chờ ảnh nạp xong
    if (!img.complete || img.naturalWidth === 0) {
      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    }

    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;
    if (naturalWidth < 100 || naturalHeight < 100) return;

    this.hud.log(`⏳ Quét OCR ảnh #${task.index + 1}...`);
    const bitmap = await createImageBitmap(img);
    const dialogues = await this.runOcrInWorker(bitmap, imageUrl);

    if (dialogues.length === 0) {
      this.translatedImagesCount++;
      this.hud.updateStatus(this.translatedImagesCount, this.images.length);
      this.hud.log(`ℹ️ Ảnh #${task.index + 1}: Không có thoại`);
      return;
    }

    this.hud.log(`💬 Ảnh #${task.index + 1}: Có ${dialogues.length} câu thoại, đang dịch...`);

    // Gọi API dịch văn bản
    const textsToTranslate = dialogues.map((d) => d.originalText);
    const resp: any = await browser.runtime.sendMessage({
      action: 'TRANSLATE_TEXTS',
      texts: textsToTranslate,
      targetLang: this.settings?.targetLanguage || 'Tiếng Việt'
    });

    if (resp?.success && Array.isArray(resp.translations)) {
      dialogues.forEach((d, idx) => {
        d.translatedText = resp.translations[idx] || d.originalText;
      });

      OverlayRenderer.renderDialogues(
        wrapper,
        dialogues,
        naturalWidth,
        naturalHeight,
        (this.settings?.bubbleTheme || 'light') as BubbleTheme
      );

      await TranslationCacheDb.saveTranslation(
        imageUrl,
        window.location.href,
        dialogues,
        naturalWidth,
        naturalHeight
      );

      this.hud.log(`✅ Ảnh #${task.index + 1}: Dịch thành công`);
    } else {
      this.hud.log(`❌ Lỗi dịch ảnh #${task.index + 1}: ${resp?.error || 'Lỗi API'}`, true);
    }

    this.translatedImagesCount++;
    this.hud.updateStatus(this.translatedImagesCount, this.images.length);
  }

  private runOcrInWorker(bitmap: ImageBitmap, elementId: string): Promise<DialogueItem[]> {
    const worker = this.worker;
    if (!worker) return Promise.resolve([]);

    return new Promise((resolve, reject) => {
      const handler = (e: MessageEvent) => {
        if (e.data.type === 'PROCESS_RESULT' && e.data.elementId === elementId) {
          worker.removeEventListener('message', handler);
          resolve(e.data.dialogues || []);
        } else if (e.data.type === 'ERROR' && e.data.elementId === elementId) {
          worker.removeEventListener('message', handler);
          reject(new Error(e.data.error));
        }
      };
      worker.addEventListener('message', handler);
      worker.postMessage({ type: 'PROCESS_IMAGE', elementId, imageBitmap: bitmap }, [bitmap]);
    });
  }

  private async checkAndLoadModel(): Promise<void> {
    const modelId = this.settings?.activeOcrModelId || 'paddle-en-slim';
    const status = await ModelDbService.getModelStatus(modelId);

    if (status.status !== 'ready') {
      this.hud.log('⚠️ Chưa tải model OCR. Mở icon tiện ích để tải.', true);
      this.showModelMissingBanner();
      return;
    }

    if (!this.worker) return;

    try {
      this.hud.log('🚀 Đang nạp model PaddleOCR vào Worker...');
      const buffers = await ModelDbService.getModelBuffers(modelId);
      this.worker.postMessage(
        {
          type: 'INIT_MODEL',
          modelId,
          detBuffer: buffers.detBuffer,
          recBuffer: buffers.recBuffer,
          keysText: buffers.keysText
        },
        [buffers.detBuffer, buffers.recBuffer]
      );

      await new Promise<void>((resolve, reject) => {
        const handler = (e: MessageEvent) => {
          if (e.data.type === 'INIT_RESULT' && e.data.success) {
            this.worker?.removeEventListener('message', handler);
            this.isModelReady = true;
            resolve();
          } else if (e.data.type === 'ERROR') {
            this.worker?.removeEventListener('message', handler);
            reject(new Error(e.data.error));
          }
        };
        this.worker?.addEventListener('message', handler);
      });

      this.hud.log('✅ Model PaddleOCR đã sẵn sàng!');
    } catch (err: any) {
      console.error('[SpeedySlate] Không thể nạp model OCR:', err);
      this.hud.log(`❌ Lỗi nạp model: ${err.message}`, true);
      this.showModelMissingBanner();
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
      <span>⚠️ <b>SpeedySlate</b>: Bạn chưa tải model OCR (~10MB). Bấm vào icon tiện ích để tải về và bắt đầu dịch.</span>
      <button style="background: #3b82f6; border: none; color: #fff; padding: 5px 12px; border-radius: 6px; cursor: pointer; font-weight: bold;">Đóng</button>
    `;
    banner.querySelector('button')?.addEventListener('click', () => banner.remove());
    document.body?.appendChild(banner);
  }
}

// Khởi chạy ngay lập tức
const app = new SpeedySlateContentApp();
app.start().catch((err) => console.error('[SpeedySlate] Lỗi khởi động:', err));
