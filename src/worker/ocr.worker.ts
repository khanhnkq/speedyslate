import * as ort from 'onnxruntime-web';
import { DialogueItem, OcrBackend } from '../shared/types';
import { PaddleDetEngine } from './paddle-det';
import { PaddleRecEngine } from './paddle-rec';

// Configure ONNX Runtime Web for Dedicated Worker environment
// wasmPaths must be local — AMO Compliance: No remote code execution
const basePath = self.location.href.substring(0, self.location.href.lastIndexOf('/') + 1);
ort.env.wasm.wasmPaths = basePath;
ort.env.wasm.numThreads = 2;
ort.env.wasm.simd = true;
ort.env.logLevel = 'error';

let detEngine: PaddleDetEngine | null = null;
let recEngine: PaddleRecEngine | null = null;
let currentModelId: string | null = null;
let activeBackend: OcrBackend = 'wasm';

// FIFO task serialization queue — Prevents concurrent session.run() collisions
// ('Error: Session already started' / 'Error: Session mismatch')
let taskQueue: Promise<void> = Promise.resolve();

export interface WorkerMessageIn {
  type: 'INIT_MODEL' | 'PROCESS_IMAGE' | 'PING';
  modelId?: string;
  detBuffer?: ArrayBuffer;
  recBuffer?: ArrayBuffer;
  keysText?: string;
  elementId?: string;
  imageBitmap?: ImageBitmap;
  useWebGpu?: boolean;
}

export interface WorkerMessageOut {
  type: 'INIT_RESULT' | 'PROCESS_RESULT' | 'PONG' | 'ERROR';
  success?: boolean;
  modelId?: string;
  backend?: OcrBackend;
  elementId?: string;
  dialogues?: DialogueItem[];
  error?: string;
}

type WorkerMessageInWithReqId = WorkerMessageIn & { _reqId?: string };

async function tryCreateWebGpuSession(
  buffer: ArrayBuffer,
  opts: ort.InferenceSession.SessionOptions
): Promise<ort.InferenceSession | null> {
  try {
    return await ort.InferenceSession.create(buffer, {
      ...opts,
      executionProviders: ['webgpu']
    });
  } catch (e: any) {
    console.warn('[OCR Worker] WebGPU session creation failed, will fallback to WASM:', e?.message);
    return null;
  }
}

self.onmessage = (e: MessageEvent<WorkerMessageInWithReqId>) => {
  const msg = e.data;
  const _reqId = msg._reqId;

  const reply = (payload: WorkerMessageOut) =>
    self.postMessage({ ...payload, _reqId });

  // Chain tasks sequentially through taskQueue
  taskQueue = taskQueue.then(async () => {
    try {
      switch (msg.type) {
        case 'PING': {
          reply({ type: 'PONG', success: true });
          break;
        }

        case 'INIT_MODEL': {
          if (!msg.detBuffer || !msg.recBuffer || !msg.keysText) {
            throw new Error('Thiếu dữ liệu buffer hoặc keys để khởi tạo model.');
          }

          const baseOpts: ort.InferenceSession.SessionOptions = {
            graphOptimizationLevel: 'all',
            logSeverityLevel: 3
          };

          let detSession: ort.InferenceSession | null = null;
          let recSession: ort.InferenceSession | null = null;

          // Attempt WebGPU first if requested
          if (msg.useWebGpu !== false) {
            try {
              const [gpuDet, gpuRec] = await Promise.all([
                tryCreateWebGpuSession(msg.detBuffer, baseOpts),
                tryCreateWebGpuSession(msg.recBuffer, baseOpts)
              ]);

              if (gpuDet && gpuRec) {
                detSession = gpuDet;
                recSession = gpuRec;
                activeBackend = 'webgpu';
              } else {
                gpuDet?.release?.();
                gpuRec?.release?.();
                activeBackend = 'wasm';
              }
            } catch {
              activeBackend = 'wasm';
            }
          } else {
            activeBackend = 'wasm';
          }

          // Fallback to WASM
          if (activeBackend === 'wasm' || !detSession || !recSession) {
            const wasmOpts: ort.InferenceSession.SessionOptions = {
              ...baseOpts,
              executionProviders: ['wasm']
            };
            [detSession, recSession] = await Promise.all([
              ort.InferenceSession.create(msg.detBuffer, wasmOpts),
              ort.InferenceSession.create(msg.recBuffer, wasmOpts)
            ]);
            activeBackend = 'wasm';
          }

          detEngine = new PaddleDetEngine(detSession);
          recEngine = new PaddleRecEngine(recSession, msg.keysText);
          currentModelId = msg.modelId || 'loaded';

          reply({
            type: 'INIT_RESULT',
            success: true,
            modelId: currentModelId,
            backend: activeBackend
          });
          break;
        }

        case 'PROCESS_IMAGE': {
          if (!detEngine || !recEngine) {
            throw new Error('Model PaddleOCR chưa được nạp. Hãy khởi tạo trước khi nhận diện.');
          }
          if (!msg.imageBitmap) {
            throw new Error('Thiếu ImageBitmap cần nhận diện.');
          }

          const bitmap = msg.imageBitmap;
          try {
            const width = bitmap.width;
            const height = bitmap.height;

            const canvas = new OffscreenCanvas(width, height);
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Không thể tạo 2D context trong Worker');
            ctx.drawImage(bitmap, 0, 0);

            // 1. Text Detection (runs serialized on detSession)
            const boxes = await detEngine.detectText(canvas, width, height);

            // 2. Text Recognition (runs serialized on recSession)
            const dialogues = await recEngine.recognizeBoxes(canvas, boxes);

            reply({
              type: 'PROCESS_RESULT',
              success: true,
              elementId: msg.elementId,
              dialogues
            });
          } finally {
            bitmap.close();
          }
          break;
        }

        default:
          throw new Error(`Thông điệp worker không hỗ trợ: ${(msg as any).type}`);
      }
    } catch (err: any) {
      console.error('[OCR Worker] Processing error:', err);
      reply({
        type: 'ERROR',
        success: false,
        elementId: msg.elementId,
        error: `${err?.message || 'Lỗi không xác định trong Web Worker'}${err?.stack ? '\n' + err.stack : ''}`
      });
    }
  }).catch((fatalErr) => {
    console.error('[OCR Worker] Fatal queue error:', fatalErr);
    reply({
      type: 'ERROR',
      success: false,
      error: `Fatal queue error: ${fatalErr?.message || fatalErr}`
    });
  });
};

self.addEventListener('error', (e) => {
  console.error('[OCR Worker] Global error:', e);
  self.postMessage({
    type: 'ERROR',
    success: false,
    error: `Worker GlobalError: ${e.message || String(e)}`
  });
});

self.addEventListener('unhandledrejection', (e) => {
  console.error('[OCR Worker] Unhandled rejection:', e);
  self.postMessage({
    type: 'ERROR',
    success: false,
    error: `Worker UnhandledRejection: ${e.reason?.message || String(e.reason)}`
  });
});
