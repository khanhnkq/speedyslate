import browser from 'webextension-polyfill';
import { ModelDbService } from '../shared/model-db';
import { DialogueItem, OcrBackend } from '../shared/types';
import { BubbleAggregator } from '../worker/bubble-aggregator';
import { DebugLogger } from '../shared/debug-logger';
import { encodeErasePatches } from '../shared/erase-codec';
import type { WorkerMessageIn, WorkerMessageOut } from '../worker/ocr.worker';

declare const chrome: any;

/**
 * Check if the Offscreen Document is already open in Chrome.
 */
async function isOffscreenOpen(): Promise<boolean> {
  if (typeof chrome === 'undefined' || !chrome.offscreen) return false;
  try {
    if ('hasDocument' in chrome.offscreen) {
      return await chrome.offscreen.hasDocument();
    }
    if (chrome.runtime?.getContexts) {
      const contexts = await chrome.runtime.getContexts({
        contextTypes: ['OFFSCREEN_DOCUMENT']
      });
      return contexts && contexts.length > 0;
    }
  } catch {
    // ignore
  }
  return false;
}

let offscreenCreatingPromise: Promise<void> | null = null;

async function ensureOffscreen(): Promise<void> {
  if (typeof chrome === 'undefined' || !chrome.offscreen) return;
  if (await isOffscreenOpen()) return;

  if (offscreenCreatingPromise) return offscreenCreatingPromise;

  offscreenCreatingPromise = (async () => {
    try {
      await chrome.offscreen.createDocument({
        url: 'src/offscreen/offscreen.html',
        reasons: ['WORKERS'],
        justification: 'Run PaddleOCR in Dedicated Worker with WebGPU/WASM'
      });
    } catch (e: any) {
      if (!e.message?.includes('Only a single offscreen document may be created')) {
        console.error('[OcrWorkerClient] Offscreen creation error:', e);
        DebugLogger.error('OcrWorkerClient:OffscreenCreate', e.message, e);
      }
    } finally {
      offscreenCreatingPromise = null;
    }
  })();

  return offscreenCreatingPromise;
}

/**
 * OcrWorkerClient — Hybrid OCR Orchestrator:
 * - Chrome MV3 (Service Worker): Uses Chrome Offscreen Document to host the Dedicated Worker + WebGPU.
 * - Firefox MV3 (Background Scripts): Directly spawns Dedicated Worker (worker.js).
 */
export class OcrWorkerClient {
  private worker: Worker | null = null;
  public currentModelId: string | null = null;
  private isInitializing = false;
  private pendingCallbacks = new Map<string, {
    resolve: (v: any) => void;
    reject: (e: Error) => void;
  }>();
  private requestCounter = 0;

  /** Which ONNX backend is currently active inside the worker. */
  public activeBackend: OcrBackend | null = null;

  /** True if running inside a Service Worker (Chrome), false if Event/Background Page (Firefox). */
  private get isServiceWorker(): boolean {
    return typeof Worker === 'undefined';
  }

  private nextReqId(): string {
    return `client_${++this.requestCounter}_${Date.now()}`;
  }

  /** Direct Worker mode for Firefox / Window environments. */
  private getWorker(): Worker {
    if (this.worker) return this.worker;

    const workerUrl = browser.runtime.getURL('worker.js');
    this.worker = new Worker(workerUrl, { type: 'module' });

    this.worker.onmessage = (e: MessageEvent<WorkerMessageOut & { _reqId?: string }>) => {
      const { _reqId, ...msg } = e.data as any;

      if (msg.type === 'INIT_RESULT' && msg.backend) {
        this.activeBackend = msg.backend as OcrBackend;
      }

      if (_reqId && this.pendingCallbacks.has(_reqId)) {
        const { resolve, reject } = this.pendingCallbacks.get(_reqId)!;
        this.pendingCallbacks.delete(_reqId);
        if (msg.type === 'ERROR') {
          DebugLogger.error('OcrWorkerClient:DirectWorkerMsg', msg.error || 'Worker error');
          reject(new Error(msg.error || 'Worker error'));
        } else {
          resolve(msg);
        }
      }
    };

    this.worker.onerror = (e) => {
      console.error('[OcrWorkerClient] Direct Worker crashed:', e);
      DebugLogger.error('OcrWorkerClient:DirectWorkerCrash', e.message || 'Worker crash', e);
      for (const [, cb] of this.pendingCallbacks) {
        cb.reject(new Error(`Worker crashed: ${e.message}`));
      }
      this.pendingCallbacks.clear();
      this.worker = null;
      this.currentModelId = null;
      this.activeBackend = null;
    };

    return this.worker;
  }

  private sendMessageDirect(msg: WorkerMessageIn & { _reqId: string }, transfer?: Transferable[]): Promise<WorkerMessageOut> {
    return new Promise((resolve, reject) => {
      this.pendingCallbacks.set(msg._reqId, { resolve, reject });
      if (transfer && transfer.length > 0) {
        this.getWorker().postMessage(msg, transfer);
      } else {
        this.getWorker().postMessage(msg);
      }
    });
  }

  /**
   * Ensure the requested model is loaded inside the worker (or offscreen document).
   */
  async ensureModelLoaded(modelId: string, useWebGpu = true): Promise<OcrBackend> {
    if (this.currentModelId === modelId && this.activeBackend) {
      return this.activeBackend;
    }

    if (this.isInitializing) {
      while (this.isInitializing) {
        await new Promise((r) => setTimeout(r, 60));
      }
      if (this.currentModelId === modelId && this.activeBackend) {
        return this.activeBackend;
      }
    }

    this.isInitializing = true;
    try {
      if (this.isServiceWorker) {
        // --- Chrome MV3: delegate to Offscreen Document ---
        await ensureOffscreen();
        const resp: any = await browser.runtime.sendMessage({
          target: 'OFFSCREEN_OCR',
          action: 'OFFSCREEN_INIT_MODEL',
          modelId,
          useWebGpu
        });

        if (!resp?.success) {
          throw new Error(resp?.error || 'Khởi tạo OCR trong offscreen thất bại');
        }

        this.currentModelId = modelId;
        this.activeBackend = resp.backend as OcrBackend;
        return this.activeBackend;
      } else {
        // --- Firefox MV3: direct Dedicated Worker ---
        const status = await ModelDbService.getModelStatus(modelId);
        if (status.status !== 'ready') {
          throw new Error(`Model OCR "${modelId}" chưa được tải. Vui lòng mở popup tiện ích để tải model.`);
        }

        const buffers = await ModelDbService.getModelBuffers(modelId);
        const result = await this.sendMessageDirect({
          _reqId: this.nextReqId(),
          type: 'INIT_MODEL',
          modelId,
          detBuffer: buffers.detBuffer,
          det2Buffer: buffers.det2Buffer,
          recBuffer: buffers.recBuffer,
          keysText: buffers.keysText,
          useWebGpu
        } as any);

        if (!result.success) {
          throw new Error(`Worker INIT_MODEL thất bại: ${(result as any).error}`);
        }

        const backend: OcrBackend = (result as any).backend || (useWebGpu ? 'webgpu' : 'wasm');
        this.currentModelId = modelId;
        this.activeBackend = backend;
        return backend;
      }
    } catch (err: any) {
      DebugLogger.error('OcrWorkerClient:ensureModelLoaded', err.message, err);
      throw err;
    } finally {
      this.isInitializing = false;
    }
  }

  /**
   * Run OCR on input image. Handles both Chrome Offscreen and Firefox direct Worker.
   */
  async runOcr(params: {
    dataUrl?: string;
    imageUrl?: string;
    width?: number;
    height?: number;
    sourceLang?: string;
    translateSfx?: boolean;
  }): Promise<{ dialogues: DialogueItem[]; width: number; height: number }> {
    try {
      const translateSfx = params.translateSfx ?? false;
      if (this.isServiceWorker) {
        // Chrome MV3: Offscreen Document takes care of fetching, creating bitmap, and running OCR
        await ensureOffscreen();
        const resp: any = await browser.runtime.sendMessage({
          target: 'OFFSCREEN_OCR',
          action: 'OFFSCREEN_PROCESS_IMAGE',
          modelId: this.currentModelId,
          useWebGpu: this.activeBackend !== 'wasm',
          dataUrl: params.dataUrl,
          imageUrl: params.imageUrl,
          width: params.width,
          height: params.height,
          sourceLang: params.sourceLang,
          translateSfx
        });

        if (!resp?.success) {
          throw new Error(resp?.error || 'Lỗi nhận diện OCR trong offscreen document');
        }

        return {
          dialogues: resp.dialogues || [],
          width: resp.width || 800,
          height: resp.height || 1200
        };
      } else {
        // Firefox MV3: Fetch bitmap and postMessage to direct worker
        let blob: Blob;
        if (params.dataUrl) {
          const res = await fetch(params.dataUrl);
          blob = await res.blob();
        } else if (params.imageUrl) {
          const res = await fetch(params.imageUrl);
          blob = await res.blob();
        } else {
          throw new Error('Thiếu ảnh để nhận diện OCR');
        }

        const bitmap = await createImageBitmap(blob);
        const width = bitmap.width || params.width || 800;
        const height = bitmap.height || params.height || 1200;

        const result = await this.sendMessageDirect({
          _reqId: this.nextReqId(),
          type: 'PROCESS_IMAGE',
          imageBitmap: bitmap,
          translateSfx
        } as any, [bitmap]);

        const rawLines = (result as any).dialogues as DialogueItem[];
        const dialogues = BubbleAggregator.aggregateDialogues(rawLines, width, height, params.sourceLang);
        encodeErasePatches(dialogues);

        return { dialogues, width, height };
      }
    } catch (err: any) {
      DebugLogger.error('OcrWorkerClient:runOcr', err.message, err);
      throw err;
    }
  }

  /** Force reload with a different backend preference (resets currentModelId). */
  async resetForBackendChange(): Promise<void> {
    this.currentModelId = null;
    this.activeBackend = null;
    if (this.isServiceWorker) {
      try {
        await browser.runtime.sendMessage({
          target: 'OFFSCREEN_OCR',
          action: 'OFFSCREEN_RESET'
        });
      } catch {
        // ignore if offscreen not open
      }
    } else {
      this.worker?.terminate();
      this.worker = null;
    }
  }

  /** Terminate worker and reset state. */
  terminate(): void {
    this.resetForBackendChange().catch(() => {});
  }
}

export const ocrWorkerClient = new OcrWorkerClient();
