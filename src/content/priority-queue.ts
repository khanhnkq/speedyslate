export interface QueueTask {
  index: number; // Thứ tự xuất hiện từ trên xuống dưới (0, 1, 2...)
  img: HTMLImageElement;
}

export type TaskProcessor = (task: QueueTask) => Promise<void>;

/**
 * Priority Queue with In-Order Delivery
 * Ensures top-to-bottom processing, multi-threading concurrency, and in-order presentation
 * Following Single Responsibility Principle (SRP)
 */
export class OrderedTranslationQueue {
  private queue: QueueTask[] = [];
  private activeCount: number = 0;
  private maxConcurrency: number = 2;
  private processor: TaskProcessor;
  private isPaused: boolean = false;
  private pendingImagesSet = new Set<HTMLImageElement>();

  constructor(processor: TaskProcessor, maxConcurrency: number = 2) {
    this.processor = processor;
    this.maxConcurrency = maxConcurrency;
  }

  public enqueue(task: QueueTask): void {
    if (this.pendingImagesSet.has(task.img)) return;

    this.pendingImagesSet.add(task.img);
    // Chèn theo thứ tự ưu tiên: index nhỏ nhất (ở trên cùng của truyện) lên đầu
    this.queue.push(task);
    this.queue.sort((a, b) => a.index - b.index);

    this.dispatch();
  }

  public pause(): void {
    this.isPaused = true;
  }

  public resume(): void {
    if (!this.isPaused) return;
    this.isPaused = false;
    this.dispatch();
  }

  public getIsPaused(): boolean {
    return this.isPaused;
  }

  public clear(): void {
    this.queue = [];
    this.pendingImagesSet.clear();
  }

  private async dispatch(): Promise<void> {
    if (this.isPaused) return;

    while (this.activeCount < this.maxConcurrency && this.queue.length > 0) {
      // Luôn lấy ảnh có index nhỏ nhất (trên cùng) trước
      const task = this.queue.shift();
      if (!task) break;

      this.activeCount++;
      task.img.dataset.slateStatus = 'processing';

      // Chạy task bất đồng bộ
      this.runTask(task);
    }
  }

  private async runTask(task: QueueTask): Promise<void> {
    try {
      await this.processor(task);
      task.img.dataset.slateStatus = 'done';
    } catch (err) {
      console.error(`[SpeedySlate Queue] Lỗi xử lý ảnh index ${task.index}:`, err);
      task.img.dataset.slateStatus = 'error';
    } finally {
      this.pendingImagesSet.delete(task.img);
      this.activeCount--;
      // Kích hoạt tiếp các task còn lại trong hàng đợi
      this.dispatch();
    }
  }
}
