import * as ort from 'onnxruntime-web';
import { DialogueItem } from '../shared/types';
import { PaddleDetEngine } from './paddle-det';
import { PaddleRecEngine } from './paddle-rec';

// Configure ONNX Runtime Web for browser worker environment
// Ensure wasm is loaded strictly locally (AMO Compliance: No remote code)
const basePath = self.location.href.substring(0, self.location.href.lastIndexOf('/') + 1);
ort.env.wasm.wasmPaths = basePath;
ort.env.wasm.numThreads = 2;
ort.env.wasm.simd = true;

let detEngine: PaddleDetEngine | null = null;
let recEngine: PaddleRecEngine | null = null;
let currentModelId: string | null = null;

export interface WorkerMessageIn {
  type: 'INIT_MODEL' | 'PROCESS_IMAGE' | 'PING';
  modelId?: string;
  detBuffer?: ArrayBuffer;
  recBuffer?: ArrayBuffer;
  keysText?: string;
  elementId?: string;
  imageBitmap?: ImageBitmap;
}

export interface WorkerMessageOut {
  type: 'INIT_RESULT' | 'PROCESS_RESULT' | 'PONG' | 'ERROR';
  success?: boolean;
  modelId?: string;
  elementId?: string;
  dialogues?: DialogueItem[];
  error?: string;
}

self.onmessage = async (e: MessageEvent<WorkerMessageIn>) => {
  const msg = e.data;

  try {
    switch (msg.type) {
      case 'PING': {
        self.postMessage({ type: 'PONG', success: true } as WorkerMessageOut);
        break;
      }

      case 'INIT_MODEL': {
        if (!msg.detBuffer || !msg.recBuffer || !msg.keysText) {
          throw new Error('Thiếu dữ liệu buffer hoặc keys để khởi tạo model.');
        }

        const sessionOptions: ort.InferenceSession.SessionOptions = {
          executionProviders: ['wasm'],
          graphOptimizationLevel: 'all'
        };

        const [detSession, recSession] = await Promise.all([
          ort.InferenceSession.create(msg.detBuffer, sessionOptions),
          ort.InferenceSession.create(msg.recBuffer, sessionOptions)
        ]);

        detEngine = new PaddleDetEngine(detSession);
        recEngine = new PaddleRecEngine(recSession, msg.keysText);
        currentModelId = msg.modelId || 'loaded';

        self.postMessage({
          type: 'INIT_RESULT',
          success: true,
          modelId: currentModelId
        } as WorkerMessageOut);
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
        const width = bitmap.width;
        const height = bitmap.height;

        // Draw bitmap onto OffscreenCanvas
        const canvas = new OffscreenCanvas(width, height);
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Không thể tạo 2D context trong Worker');
        ctx.drawImage(bitmap, 0, 0);

        // 1. Text Detection
        const boxes = await detEngine.detectText(canvas, width, height);

        // 2. Text Recognition
        const dialogues = await recEngine.recognizeBoxes(canvas, boxes);

        // Close bitmap to release memory immediately
        bitmap.close();

        self.postMessage({
          type: 'PROCESS_RESULT',
          success: true,
          elementId: msg.elementId,
          dialogues
        } as WorkerMessageOut);
        break;
      }

      default:
        throw new Error(`Thông điệp worker không hỗ trợ: ${(msg as any).type}`);
    }
  } catch (err: any) {
    self.postMessage({
      type: 'ERROR',
      success: false,
      elementId: msg.elementId,
      error: err?.message || 'Lỗi không xác định trong Web Worker'
    } as WorkerMessageOut);
  }
};
