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
  private worker!: Worker;
  private scroller!: AutoScroller;
  private hud!: FloatingHud;
  private queue!: OrderedTranslationQueue;
  private images: HTMLImageElement[] = [];
  private translatedImagesCount: number = 0;
  private isModelReady: boolean = false;

  public async start(): Promise<void> {
    console.log('[SpeedySlate] Khởi chạy trên trang:', window.location.href);

    this.settings = await StorageService.getSettings();

    // 1. Initialize Web Worker for PaddleOCR
    this.initWorker();

    // 2. Discover chapter images in top-to-bottom order
    this.detectImages();

    // 3. Setup Priority Queue (Top-to-Bottom, Concurrency 2)
    this.queue = new OrderedTranslationQueue(async (task) => {
      await this.processImageTask(task);
    }, 2);

    // 4. Setup Scroller & Floating HUD
    this.scroller = new AutoScroller(this.settings.autoScrollSpeed, (running, isPreloading) => {
      this.hud.setPlaying(running, isPreloading);
    });

    this.hud = new FloatingHud(this.settings.autoScrollSpeed, {
      onTogglePlay: () => this.scroller.toggle(),
      onPreloadAndReturn: () => {
        this.hud.log('🚀 Đang cuộn nạp toàn bộ ảnh của chương...');
        this.scroller.preloadToBottomAndReturn(() => {
          this.hud.log('🎉 Đã nạp xong tất cả ảnh! Đã quay lại đầu trang để đọc.');
        });
      },
      onToggleTranslate: () => {
        if (this.queue.getIsPaused()) {
          this.queue.resume();
          this.hud.log('▶ Tiếp tục tiến trình dịch');
        } else {
          this.queue.pause();
          this.hud.log('⏸ Đã tạm ngưng dịch');
        }
      },
      onSpeedChange: (speed) => this.scroller.setSpeed(speed),
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

    this.hud.updateStatus(0, this.images.length);
    this.hud.log(`🔍 Tìm thấy ${this.images.length} ảnh trong chương truyện.`);

    // 5. Setup IntersectionObserver
    this.setupIntersectionObserver();

    // 6. Check OCR Model in IndexedDB
    await this.checkAndLoadModel();

    // Enqueue initial visible images
    this.enqueueInitialImages();
  }

  private initWorker(): void {
    const workerUrl = browser.runtime.getURL('worker.js');
    this.worker = new Worker(workerUrl, { type: 'module' });
  }

  private detectImages(): void {
    const rawImages = ToonheyAdapter.getChapterImages();
    this.images = rawImages.map((img) => {
      ToonheyAdapter.wrapImage(img);
      return img;
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

    this.images.forEach((img) => observer.observe(img));
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
        this.settings.bubbleTheme as BubbleTheme
      );
      this.translatedImagesCount++;
      this.hud.updateStatus(this.translatedImagesCount, this.images.length);
      this.hud.log(`⚡ Ảnh #${task.index + 1}: Nạp tức thì từ Cache (0ms)`);
      return;
    }

    if (!this.isModelReady) return;

    // Chờ ảnh nạp đủ kích thước
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
      targetLang: this.settings.targetLanguage
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
        this.settings.bubbleTheme as BubbleTheme
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
    return new Promise((resolve, reject) => {
      const handler = (e: MessageEvent) => {
        if (e.data.type === 'PROCESS_RESULT' && e.data.elementId === elementId) {
          this.worker.removeEventListener('message', handler);
          resolve(e.data.dialogues || []);
        } else if (e.data.type === 'ERROR' && e.data.elementId === elementId) {
          this.worker.removeEventListener('message', handler);
          reject(new Error(e.data.error));
        }
      };
      this.worker.addEventListener('message', handler);
      this.worker.postMessage({ type: 'PROCESS_IMAGE', elementId, imageBitmap: bitmap }, [bitmap]);
    });
  }

  private async checkAndLoadModel(): Promise<void> {
    const modelId = this.settings.activeOcrModelId || 'paddle-en-slim';
    const status = await ModelDbService.getModelStatus(modelId);

    if (status.status !== 'ready') {
      this.hud.log('⚠️ Chưa tải model OCR. Mở tiện ích để tải model.', true);
      this.showModelMissingBanner();
      return;
    }

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
            this.worker.removeEventListener('message', handler);
            this.isModelReady = true;
            resolve();
          } else if (e.data.type === 'ERROR') {
            this.worker.removeEventListener('message', handler);
            reject(new Error(e.data.error));
          }
        };
        this.worker.addEventListener('message', handler);
      });

      this.hud.log('✅ Model PaddleOCR đã sẵn sàng!');
    } catch (err: any) {
      console.error('[SpeedySlate] Không thể nạp model OCR:', err);
      this.hud.log(`❌ Lỗi nạp model: ${err.message}`, true);
      this.showModelMissingBanner();
    }
  }

  private showModelMissingBanner(): void {
    const banner = document.createElement('div');
    banner.style.cssText = `
      position: fixed; top: 16px; left: 50%; transform: translateX(-50%);
      background: #2f3542; color: #ffffff; padding: 12px 20px;
      border-radius: 10px; z-index: 999999; box-shadow: 0 4px 20px rgba(0,0,0,0.4);
      font-family: sans-serif; font-size: 13px; display: flex; align-items: center; gap: 12px;
      border: 1px solid #70a1ff;
    `;
    banner.innerHTML = `
      <span>⚠️ <b>SpeedySlate</b>: Bạn chưa tải model OCR (~10MB). Bấm vào icon tiện ích để tải về và bắt đầu dịch.</span>
      <button style="background: #70a1ff; border: none; color: #fff; padding: 4px 10px; border-radius: 6px; cursor: pointer; font-weight: bold;">Đóng</button>
    `;
    banner.querySelector('button')?.addEventListener('click', () => banner.remove());
    document.body.appendChild(banner);
  }
}

// Khởi chạy
const app = new SpeedySlateContentApp();
app.start().catch((err) => console.error('[SpeedySlate] Lỗi khởi động:', err));
