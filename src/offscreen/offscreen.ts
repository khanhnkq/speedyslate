import browser from 'webextension-polyfill';
import { ModelDbService } from '../shared/model-db';
import { DialogueItem, OcrBackend } from '../shared/types';
import { BubbleAggregator } from '../worker/bubble-aggregator';
import { DebugLogger } from '../shared/debug-logger';
import type { WorkerMessageIn, WorkerMessageOut } from '../worker/ocr.worker';

import { StorageService } from '../shared/storage';
import { OCR_MODEL_PRESETS } from '../shared/presets';

let worker: Worker | null = null;
let currentModelId: string | null = null;
let activeBackend: OcrBackend | null = null;
let isInitializing = false;
let offscreenQueue: Promise<any> = Promise.resolve();

const pendingCallbacks = new Map<string, {
  resolve: (val: any) => void;
  reject: (err: Error) => void;
}>();
let requestCounter = 0;

function nextReqId(): string {
  return `off_${++requestCounter}_${Date.now()}`;
}

function getWorker(): Worker {
  if (worker) return worker;

  const workerUrl = browser.runtime.getURL('worker.js');
  worker = new Worker(workerUrl, { type: 'module' });

  worker.onmessage = (e: MessageEvent<WorkerMessageOut & { _reqId?: string }>) => {
    const { _reqId, ...msg } = e.data as any;

    if (msg.type === 'INIT_RESULT' && msg.backend) {
      activeBackend = msg.backend as OcrBackend;
      DebugLogger.log('info', 'Offscreen', `Worker initialized with backend: ${activeBackend}`);
    }

    if (_reqId && pendingCallbacks.has(_reqId)) {
      const { resolve, reject } = pendingCallbacks.get(_reqId)!;
      pendingCallbacks.delete(_reqId);
      if (msg.type === 'ERROR') {
        DebugLogger.error('Offscreen:WorkerMsg', msg.error || 'Worker error');
        reject(new Error(msg.error || 'Worker error'));
      } else {
        resolve(msg);
      }
    }
  };

  worker.onerror = (e) => {
    const errorMsg = e.message || 'Unknown worker error';
    DebugLogger.error('Offscreen:WorkerCrash', `Worker crashed: ${errorMsg}`, e);
    for (const [, cb] of pendingCallbacks) {
      cb.reject(new Error(`Worker crashed: ${errorMsg}`));
    }
    pendingCallbacks.clear();
    worker = null;
    currentModelId = null;
    activeBackend = null;
  };

  return worker;
}

function sendToWorker(msg: WorkerMessageIn & { _reqId: string }, transfer?: Transferable[]): Promise<WorkerMessageOut> {
  return new Promise((resolve, reject) => {
    pendingCallbacks.set(msg._reqId, { resolve, reject });
    if (transfer && transfer.length > 0) {
      getWorker().postMessage(msg, transfer);
    } else {
      getWorker().postMessage(msg);
    }
  });
}

async function ensureModel(modelId?: string, useWebGpu = true): Promise<OcrBackend> {
  let targetId = modelId || currentModelId;
  if (!targetId) {
    try {
      const settings = await StorageService.getSettings();
      targetId = settings.activeOcrModelId || OCR_MODEL_PRESETS[0]?.id || 'comic-manga-manhwa';
    } catch {
      targetId = OCR_MODEL_PRESETS[0]?.id || 'comic-manga-manhwa';
    }
  }

  if (currentModelId === targetId && activeBackend) {
    return activeBackend;
  }

  if (isInitializing) {
    while (isInitializing) {
      await new Promise((r) => setTimeout(r, 60));
    }
    if (currentModelId === targetId && activeBackend) return activeBackend;
  }

  isInitializing = true;
  try {
    const status = await ModelDbService.getModelStatus(targetId);
    if (status.status !== 'ready') {
      throw new Error(`Model OCR "${targetId}" chưa tải. Vui lòng mở popup tiện ích để tải model.`);
    }

    const { detBuffer, recBuffer, keysText } = await ModelDbService.getModelBuffers(targetId);
    const res = await sendToWorker({
      _reqId: nextReqId(),
      type: 'INIT_MODEL',
      modelId: targetId,
      detBuffer,
      recBuffer,
      keysText,
      useWebGpu
    });

    if (!res.success) {
      throw new Error(res.error || 'Khởi tạo worker thất bại');
    }

    currentModelId = targetId;
    activeBackend = (res.backend as OcrBackend) || 'wasm';
    return activeBackend;
  } catch (err: any) {
    DebugLogger.log('error', 'Offscreen:ensureModel', err.message, err);
    throw err;
  } finally {
    isInitializing = false;
  }
}

async function runOcrOnImage(
  dataUrl?: string,
  imageUrl?: string,
  naturalW?: number,
  naturalH?: number
): Promise<{ dialogues: DialogueItem[]; width: number; height: number }> {
  let blob: Blob;
  if (dataUrl) {
    const res = await fetch(dataUrl);
    blob = await res.blob();
  } else if (imageUrl) {
    const res = await fetch(imageUrl);
    if (!res.ok) {
      throw new Error(`Không thể tải ảnh qua offscreen: HTTP ${res.status}`);
    }
    blob = await res.blob();
  } else {
    throw new Error('Thiếu ảnh để thực hiện OCR');
  }

  if (blob.type && (blob.type.includes('html') || blob.type.includes('text') || blob.type.includes('svg'))) {
    throw new Error(`Dữ liệu nhận về không phải ảnh hợp lệ (${blob.type})`);
  }

  const bitmap = await createImageBitmap(blob);
  const width = naturalW || bitmap.width;
  const height = naturalH || bitmap.height;

  const res = await sendToWorker({
    _reqId: nextReqId(),
    type: 'PROCESS_IMAGE',
    imageBitmap: bitmap
  }, [bitmap]);

  const rawDialogues = res.dialogues || [];
  const dialogues = BubbleAggregator.aggregateDialogues(rawDialogues, width, height);

  return { dialogues, width, height };
}

// Global unhandled error & rejection tracker
self.addEventListener('error', (e) => {
  DebugLogger.error('Offscreen:GlobalError', e.message || String(e), (e as any).error);
});
self.addEventListener('unhandledrejection', (e) => {
  DebugLogger.error('Offscreen:UnhandledRejection', e.reason?.message || String(e.reason), e.reason);
});

async function handleOffscreenMessage(msg: any): Promise<any> {
  return new Promise<any>((resolve) => {
    offscreenQueue = offscreenQueue.then(async () => {
      try {
        switch (msg.action) {
          case 'OFFSCREEN_INIT_MODEL': {
            const backend = await ensureModel(msg.modelId, msg.useWebGpu ?? true);
            resolve({ success: true, backend });
            break;
          }

          case 'OFFSCREEN_PROCESS_IMAGE': {
            const targetModelId = msg.modelId || currentModelId;
            if (!currentModelId || !activeBackend || (targetModelId && currentModelId !== targetModelId)) {
              await ensureModel(targetModelId, msg.useWebGpu ?? true);
            }
            const res = await runOcrOnImage(msg.dataUrl, msg.imageUrl, msg.width, msg.height);
            resolve({ success: true, ...res });
            break;
          }

          case 'OFFSCREEN_GET_STATUS': {
            resolve({ success: true, backend: activeBackend ?? 'idle' });
            break;
          }

          case 'OFFSCREEN_RESET': {
            if (worker) {
              worker.terminate();
              worker = null;
            }
            currentModelId = null;
            activeBackend = null;
            resolve({ success: true });
            break;
          }

          default:
            resolve({ success: false, error: 'Hành động offscreen không hợp lệ' });
        }
      } catch (err: any) {
        DebugLogger.error('Offscreen:Action', err.message, err);
        resolve({ success: false, error: err.message || 'Lỗi xử lý OCR trong offscreen' });
      }
    });
  });
}

/**
 * Timeout helper to resolve message before Chrome terminates port (at ~30s).
 */
function withMessageTimeout<T>(
  promise: Promise<T>,
  ms: number,
  timeoutResult: T
): Promise<T> {
  let timer: any;
  const timeoutPromise = new Promise<T>((resolve) => {
    timer = setTimeout(() => {
      DebugLogger.error('Offscreen:Timeout', `Tác vụ Offscreen OCR quá thời gian chờ (${Math.round(ms / 1000)}s)`);
      resolve(timeoutResult);
    }, ms);
  });
  return Promise.race([
    promise.then((res) => {
      clearTimeout(timer);
      return res;
    }),
    timeoutPromise
  ]);
}

// Listen for messages targeted to this offscreen document
// CRITICAL (chrome-extensions rule): return undefined synchronously if not for this document!
browser.runtime.onMessage.addListener((msg: any) => {
  if (msg?.target !== 'OFFSCREEN_OCR') {
    return undefined;
  }
  return withMessageTimeout(
    handleOffscreenMessage(msg),
    50000,
    { success: false, error: 'Offscreen OCR timeout sau 50s' }
  );
});

DebugLogger.log('info', 'Offscreen', 'Offscreen OCR Document Initialized');
