import * as ort from 'onnxruntime-web';
import { DialogueItem, OcrBackend } from '../shared/types';
import { ITextDetector } from './detector-interface';
import { ComicDetEngine } from './comic-det';
import { PaddleDetEngine } from './paddle-det';
import { PaddleRecEngine } from './paddle-rec';
import { StripSlicer } from './strip-slicer';

// Configure ONNX Runtime Web for Dedicated Worker environment
// wasmPaths must be local — AMO Compliance: No remote code execution
const basePath = self.location.href.substring(0, self.location.href.lastIndexOf('/') + 1);
ort.env.wasm.wasmPaths = basePath;
ort.env.wasm.numThreads = 2;
ort.env.wasm.simd = true;
ort.env.logLevel = 'error';

let detEngine: ITextDetector | null = null;
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

function hasCeilMode(buffer: ArrayBuffer): boolean {
  const bytes = new Uint8Array(buffer);
  const target = [99, 101, 105, 108, 95, 109, 111, 100, 101]; // 'ceil_mode'
  let match = 0;
  for (let i = 0; i < bytes.length; i++) {
    if (bytes[i] === target[match]) {
      match++;
      if (match === target.length) return true;
    } else {
      match = bytes[i] === target[0] ? 1 : 0;
    }
  }
  return false;
}

async function tryCreateWebGpuSession(
  buffer: ArrayBuffer,
  opts: ort.InferenceSession.SessionOptions,
  testDims?: number[]
): Promise<ort.InferenceSession | null> {
  try {
    // ONNX Runtime Web WebGPU provider does not implement ceil_mode padding in MaxPool yet.
    // Models with ceil_mode=1 must run on high-performance multi-threaded WASM SIMD.
    if (hasCeilMode(buffer)) {
      console.log('[OCR Worker] Model contains ceil_mode operator unsupported by WebGPU. Using WASM SIMD.');
      return null;
    }

    const session = await ort.InferenceSession.create(buffer, {
      ...opts,
      executionProviders: ['webgpu']
    });

    // Test kernel execution to detect any other unimplemented operators early
    if (testDims && session.inputNames.length > 0) {
      const inputName = session.inputNames[0];
      const totalElements = testDims.reduce((acc, d) => acc * d, 1);
      const testTensor = new ort.Tensor('float32', new Float32Array(totalElements), testDims);
      await session.run({ [inputName]: testTensor });
    }

    return session;
  } catch (e: any) {
    console.warn('[OCR Worker] WebGPU session creation/kernel validation failed, falling back to WASM:', e?.message);
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
          let detIsGpu = false;
          let recIsGpu = false;

          const isComicDetModel =
            Boolean(msg.modelId && msg.modelId.includes('comic'));

          const wasmOpts: ort.InferenceSession.SessionOptions = {
            ...baseOpts,
            executionProviders: ['wasm']
          };

          // 1. Text Detection Session
          if (msg.useWebGpu !== false && !isComicDetModel) {
            detSession = await tryCreateWebGpuSession(msg.detBuffer, baseOpts, [1, 3, 48, 48]);
            if (detSession) detIsGpu = true;
          }
          if (!detSession) {
            detSession = await ort.InferenceSession.create(msg.detBuffer, wasmOpts);
          }

          // 2. Text Recognition Session
          if (msg.useWebGpu !== false) {
            recSession = await tryCreateWebGpuSession(msg.recBuffer, baseOpts, [1, 3, 48, 64]);
            if (recSession) recIsGpu = true;
          }
          if (!recSession) {
            recSession = await ort.InferenceSession.create(msg.recBuffer, wasmOpts);
          }

          activeBackend = (detIsGpu || recIsGpu) ? 'webgpu' : 'wasm';

          const isComicDet =
            detSession.inputNames.includes('orig_target_sizes') ||
            detSession.inputNames.includes('images') ||
            Boolean(msg.modelId && msg.modelId.includes('comic'));

          detEngine = isComicDet
            ? new ComicDetEngine(detSession)
            : new PaddleDetEngine(detSession);

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

            // 1. Text Detection (runs serialized on detSession, auto-slices if tall webtoon strip)
            const boxes = await StripSlicer.detectWithSlicing(canvas, width, height, detEngine);

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
