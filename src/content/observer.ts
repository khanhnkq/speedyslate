

export type ProcessImageHandler = (img: HTMLImageElement) => Promise<void>;

export class ImageObserverManager {
  private observer: IntersectionObserver;
  private queue: HTMLImageElement[] = [];
  private activeCount: number = 0;
  private maxConcurrency: number = 2;
  private processHandler: ProcessImageHandler;

  constructor(processHandler: ProcessImageHandler) {
    this.processHandler = processHandler;

    // Prefetch 800px below current viewport
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            this.enqueue(img);
            this.observer.unobserve(img);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px 800px 0px',
        threshold: 0.01
      }
    );
  }

  /**
   * Begins observing a list of chapter images
   */
  public observeImages(images: HTMLImageElement[]): void {
    for (const img of images) {
      if (img.dataset.slateStatus === 'done' || img.dataset.slateStatus === 'processing') {
        continue;
      }
      img.dataset.slateStatus = 'pending';
      this.observer.observe(img);
    }
  }

  private enqueue(img: HTMLImageElement): void {
    if (this.queue.includes(img)) return;
    this.queue.push(img);
    this.processNext();
  }

  private async processNext(): Promise<void> {
    if (this.activeCount >= this.maxConcurrency || this.queue.length === 0) {
      return;
    }

    const img = this.queue.shift();
    if (!img) return;

    this.activeCount++;
    img.dataset.slateStatus = 'processing';

    try {
      await this.processHandler(img);
      img.dataset.slateStatus = 'done';
    } catch (err) {
      console.error('[SpeedySlate] Lỗi xử lý ảnh:', err);
      img.dataset.slateStatus = 'error';
    } finally {
      this.activeCount--;
      this.processNext();
    }
  }
}
