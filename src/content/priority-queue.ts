import { DialogueItem } from '../shared/types';

export interface IndexedTask {
  index: number;
}

export interface OcrTask extends IndexedTask {
  img: HTMLImageElement;
}

export interface TranslationTask extends IndexedTask {
  img: HTMLImageElement;
  dialogues: DialogueItem[];
  naturalWidth: number;
  naturalHeight: number;
}

// Backward-compatible alias
export type QueueTask = OcrTask;
export type TaskProcessor<T> = (task: T) => Promise<void>;

/**
 * Generic Priority Queue with In-Order Delivery
 * Ensures top-to-bottom processing, controllable concurrency, and in-order dispatching
 * Following Single Responsibility Principle (SRP)
 */
export class OrderedTaskQueue<T extends IndexedTask> {
  private queue: T[] = [];
  private activeCount: number = 0;
  private maxConcurrency: number = 1;
  private processor: TaskProcessor<T>;
  private isPaused: boolean = false;
  private pendingKeys = new Set<any>();
  private keySelector?: (task: T) => any;

  constructor(processor: TaskProcessor<T>, maxConcurrency: number = 1, keySelector?: (task: T) => any) {
    this.processor = processor;
    this.maxConcurrency = maxConcurrency;
    this.keySelector = keySelector;
  }

  public enqueue(task: T): void {
    const key = this.keySelector ? this.keySelector(task) : task.index;
    if (this.pendingKeys.has(key)) return;

    this.pendingKeys.add(key);
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
    this.pendingKeys.clear();
  }

  public size(): number {
    return this.queue.length + this.activeCount;
  }

  private async dispatch(): Promise<void> {
    if (this.isPaused) return;

    while (this.activeCount < this.maxConcurrency && this.queue.length > 0) {
      const task = this.queue.shift();
      if (!task) break;

      this.activeCount++;
      this.runTask(task);
    }
  }

  private async runTask(task: T): Promise<void> {
    const key = this.keySelector ? this.keySelector(task) : task.index;
    try {
      await this.processor(task);
    } catch (err) {
      console.error(`[SpeedySlate Queue] Loi xu ly task index ${task.index}:`, err);
    } finally {
      this.pendingKeys.delete(key);
      this.activeCount--;
      this.dispatch();
    }
  }
}

// Backward-compatible alias for existing imports
export type OrderedTranslationQueue = OrderedTaskQueue<OcrTask>;
