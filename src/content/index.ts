import browser from 'webextension-polyfill';
import { ModelDbService } from '../shared/model-db';
import { StorageService } from '../shared/storage';
import { BubbleTheme, DialogueItem, ExtensionSettings } from '../shared/types';
import { FloatingHud } from './hud/hud';
import { ImageObserverManager } from './observer';
import { OverlayRenderer } from './overlay/overlay-renderer';
import { AutoScroller } from './scroller';
import { ToonheyAdapter } from './toonhey-adapter';

class SpeedySlateContentApp {
  private settings!: ExtensionSettings;
  private worker!: Worker;
  private scroller!: AutoScroller;
  private hud!: FloatingHud;
  private observer!: ImageObserverManager;
  private images: HTMLImageElement[] = [];
  private translatedImagesCount: number = 0;
  private isModelReady: boolean = false;

  public async start(): Promise<void> {
    console.log('[SpeedySlate] Khởi chạy trên trang:', window.location.href);

    this.settings = await StorageService.getSettings();

    // 1. Initialize Web Worker for PaddleOCR
    this.initWorker();

    // 2. Discover chapter images
    this.detectImages();

    // 3. Setup Scroller & HUD
    this.scroller = new AutoScroller(this.settings.autoScrollSpeed, (running) => {
      this.hud.setPlaying(running);
    });

    this.hud = new FloatingHud(this.settings.autoScrollSpeed, {
      onTogglePlay: () => this.scroller.toggle(),
      onSpeedChange: (speed) => this.scroller.setSpeed(speed),
      onToggleVisibility: (visible) => OverlayRenderer.setAllVisibility(visible),
      onOpenSettings: () => {
        // Open extension popup/options if possible
      }
    });

    this.hud.updateStatus(0, this.images.length);

    // 4. Setup Image Observer Queue
    this.observer = new ImageObserverManager(async (img) => {
      await this.processImage(img);
    });

    // 5. Check OCR Model in IndexedDB
    await this.checkAndLoadModel();

    if (this.isModelReady) {
      this.observer.observeImages(this.images);
    }
  }

  private initWorker(): void {
    const workerUrl = browser.runtime.getURL('worker.js');
    this.worker = new Worker(workerUrl, { type: 'module' });
  }

  private async checkAndLoadModel(): Promise<void> {
    const modelId = this.settings.activeOcrModelId || 'paddle-en-slim';
    const status = await ModelDbService.getModelStatus(modelId);

    if (status.status !== 'ready') {
      this.showModelMissingBanner();
      return;
    }

    try {
      const buffers = await ModelDbService.getModelBuffers(modelId);
      this.worker.postMessage(
        {
          type: 'INIT_MODEL',
          modelId,
          detBuffer: buffers.detBuffer,
          recBuffer: buffers.recBuffer,
          keysText: buffers.keysText
        },
        [buffers.detBuffer, buffers.recBuffer] // Transfer buffers
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

      console.log('[SpeedySlate] Model OCR sẵn sàng');
    } catch (err) {
      console.error('[SpeedySlate] Không thể nạp model OCR:', err);
      this.showModelMissingBanner();
    }
  }

  private detectImages(): void {
    const rawImages = ToonheyAdapter.getChapterImages();
    this.images = rawImages.map((img) => {
      ToonheyAdapter.wrapImage(img);
      return img;
    });
  }

  private async processImage(img: HTMLImageElement): Promise<void> {
    if (!this.isModelReady) return;

    // Ensure image is loaded
    if (!img.complete || img.naturalWidth === 0) {
      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    }

    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;
    if (naturalWidth < 100 || naturalHeight < 100) return;

    // 1. Create ImageBitmap
    const bitmap = await createImageBitmap(img);

    // 2. Send to Web Worker for OCR detection & recognition
    const dialogues = await this.runOcrInWorker(bitmap, img.src);

    if (dialogues.length === 0) {
      this.translatedImagesCount++;
      this.hud.updateStatus(this.translatedImagesCount, this.images.length);
      return;
    }

    // 3. Translate via Background script
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

      // 4. Render DOM overlays
      const wrapper = img.parentElement;
      if (wrapper) {
        OverlayRenderer.renderDialogues(
          wrapper,
          dialogues,
          naturalWidth,
          naturalHeight,
          this.settings.bubbleTheme as BubbleTheme
        );
      }
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
      <span>⚠️ <b>SpeedySlate</b>: Bạn chưa tải model OCR (~7MB). Bấm vào icon tiện ích để tải về và bắt đầu dịch.</span>
      <button style="background: #70a1ff; border: none; color: #fff; padding: 4px 10px; border-radius: 6px; cursor: pointer; font-weight: bold;">Đóng</button>
    `;
    banner.querySelector('button')?.addEventListener('click', () => banner.remove());
    document.body.appendChild(banner);
  }
}

// Start content script
const app = new SpeedySlateContentApp();
app.start().catch((err) => console.error('[SpeedySlate] Lỗi khởi động:', err));
