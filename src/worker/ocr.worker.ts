import * as ort from 'onnxruntime-web';
import { BoundingBox, DialogueItem, OcrBackend } from '../shared/types';
import { ITextDetector } from './detector-interface';
import { ComicDetEngine } from './comic-det';
import { PaddleDetEngine } from './paddle-det';
import { PaddleRecEngine } from './paddle-rec';
import { StripSlicer } from './strip-slicer';
import { LineSegmenter } from './line-segmenter';
import { EraseMasker } from './erase-masker';
import { BubbleFiller } from './bubble-filler';
import { BubbleAggregator } from './bubble-aggregator';
import { BubbleChamberExtractor } from './bubble-chamber';

// Configure ONNX Runtime Web for Dedicated Worker environment
// wasmPaths must be local — AMO Compliance: No remote code execution
const basePath = self.location.href.substring(0, self.location.href.lastIndexOf('/') + 1);
ort.env.wasm.wasmPaths = basePath;
ort.env.wasm.numThreads = (self as any).crossOriginIsolated
  ? Math.min(4, Math.max(1, ((self as any).navigator?.hardwareConcurrency ?? 2) - 1))
  : 1;
ort.env.wasm.simd = true;
(ort.env as any).webgpu = { ...((ort.env as any).webgpu || {}), powerPreference: 'high-performance' };
ort.env.logLevel = 'error';

let detEngine: ITextDetector | null = null;
let det2Engine: ITextDetector | null = null; // Optional supplementary raw-text detector (gap-fill)
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
  det2Buffer?: ArrayBuffer;
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
  timings?: { detMs: number; recMs: number; boxCount: number; sliceCount?: number };
}

type WorkerMessageInWithReqId = WorkerMessageIn & { _reqId?: string };

async function tryCreateWebGpuSession(
  buffer: ArrayBuffer,
  opts: ort.InferenceSession.SessionOptions,
  testDims?: number[]
): Promise<ort.InferenceSession | null> {
  try {
    const session = await ort.InferenceSession.create(buffer, {
      ...opts,
      executionProviders: ['webgpu']
    });

    // Test kernel execution to detect any other unimplemented operators early
    if (testDims && session.inputNames.length > 0) {
      const inputName = session.inputNames[0];
      const totalElements = testDims.reduce((acc, d) => acc * d, 1);
      const testTensor = new ort.Tensor('float32', new Float32Array(totalElements), testDims);
      let probeResults: Record<string, ort.Tensor> | null = null;
      try {
        probeResults = await session.run({ [inputName]: testTensor });
      } catch (probeErr) {
        await session.release?.().catch(() => {});
        throw probeErr;
      } finally {
        testTensor.dispose?.();
        if (probeResults) {
          for (const t of Object.values(probeResults)) t.dispose?.();
        }
      }
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

          await detEngine?.release?.().catch(() => {});
          await det2Engine?.release?.().catch(() => {});
          await recEngine?.release?.().catch(() => {});
          detEngine = null;
          det2Engine = null;
          recEngine = null;

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

          det2Engine = null;
          if (msg.det2Buffer) {
            try {
              const det2Session =
                (msg.useWebGpu !== false
                  ? await tryCreateWebGpuSession(msg.det2Buffer, baseOpts, [1, 3, 64, 64])
                  : null) ?? (await ort.InferenceSession.create(msg.det2Buffer, wasmOpts));
              // Supplementary engine: stricter prob-map cutoff + tighter unclip so
              // narration lines on screentone stay separated instead of merging into blobs
              det2Engine = new PaddleDetEngine(det2Session, { thresh: 0.3, boxThresh: 0.35, unclipRatio: 1.3 });
            } catch (e) {
              console.warn('[OCR Worker] Supplementary det session failed:', e);
            }
          }

          recEngine = new PaddleRecEngine(recSession, msg.keysText, {
            isCjkModel: /japan|korean|chinese|cjk|multilingual|v6/i.test(msg.modelId ?? '')
          });
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
            const tDet = performance.now();
            const isComicDet = detEngine instanceof ComicDetEngine;
            // Page-level text-probability map: DB detectors blit their raw
            // segmentation output here so erase masking knows exactly where
            // text pixels live (RT-DETR contributes nothing — box-only).
            const textMap = new Float32Array(width * height);
            const boxes = await StripSlicer.detectWithSlicing(canvas, width, height, detEngine, {
              // Page-sized images: cap ~0.85 tiles the page into 2 near-square
              // windows ≈1.7x effective text resolution. Tall strips keep 1.8
              // to bound the number of RT-DETR runs.
              aspectCap: isComicDet ? (height <= 2200 ? 0.85 : 1.8) : undefined,
              invertedPass: isComicDet,
              textMapOut: textMap
            });

            // Supplementary pass: DB-style detector finds raw text lines the
            // bubble-aware engine misses (free-floating narration, open bubbles)
            if (det2Engine) {
              const supBoxes = await StripSlicer.detectWithSlicing(canvas, width, height, det2Engine, { textMapOut: textMap });
              for (const sb of supBoxes) {
                const dup = boxes.some((b) => StripSlicer.calculateIoU(b, sb) > 0.5);
                if (dup) continue;
                // Raw narration blocks often cover several lines — split them so
                // the recognizer reads each line instead of squashing the block
                if (sb.height >= 34 && sb.width >= 28) {
                  const parts = LineSegmenter.segmentLines(ctx, sb, width, height);
                  for (const p of parts) boxes.push({ ...p, kind: 'free' });
                } else {
                  boxes.push({ ...sb, kind: 'free' });
                }
              }
              boxes.sort((a, b) => a.y - b.y);
            }
            // Split tall multi-line dialogue boxes into per-line crops — a
            // 4-5 line bubble squashed into the 48px rec input loses middle
            // lines entirely. Aggregator rejoins them into one bubble after.
            const lineBoxes: BoundingBox[] = [];
            for (const b of boxes) {
              if (b.kind !== 'free' && b.height >= 42 && b.height <= b.width * 2.2) {
                const parts = LineSegmenter.segmentLines(ctx, b, width, height);
                for (const p of parts) lineBoxes.push({ ...p, kind: b.kind });
              } else {
                lineBoxes.push(b);
              }
            }
            boxes.length = 0;
            boxes.push(...lineBoxes);
            boxes.sort((a, b) => a.y - b.y);
            const detMs = performance.now() - tDet;

            // 2. Text Recognition (runs serialized on recSession)
            const tRec = performance.now();
            const dialogues = await recEngine.recognizeBoxes(canvas, boxes);
            const recMs = performance.now() - tRec;

            // 3. Per-line erase patches: inpaint glyph pixels only, so the
            // original bubble/art is preserved and nothing spills outside.
            attachErasePatches(canvas, dialogues, textMap);

            reply({
              type: 'PROCESS_RESULT',
              success: true,
              elementId: msg.elementId,
              dialogues,
              timings: { detMs: Math.round(detMs), recMs: Math.round(recMs), boxCount: boxes.length }
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

// Builds a pixel-level erase patch per recognized line: Otsu glyph mask +
// diffusion inpaint, so downstream can remove ink without touching the
// original bubble shape or surrounding artwork.
function attachErasePatches(canvas: OffscreenCanvas, items: DialogueItem[], textMap?: Float32Array): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const pad = 4;
  for (const item of items) {
    const srcX = Math.max(0, item.box.x - pad);
    const srcY = Math.max(0, item.box.y - pad);
    const srcW = Math.min(canvas.width - srcX, item.box.width + pad * 2);
    const srcH = Math.min(canvas.height - srcY, item.box.height + pad * 2);
    if (srcW < 4 || srcH < 4) continue;
    try {
      const img = ctx.getImageData(srcX, srcY, srcW, srcH);
      const localQuad = item.box.quad?.map(([qx, qy]) => [qx - srcX, qy - srcY] as [number, number]);
      const patch = EraseMasker.buildPatch(img, srcX, srcY, item.bgColor, textMap, canvas.width, localQuad);
      if (patch) item.erasePatch = patch;
    } catch {
      // patch is best-effort — rendering falls back to box styling
    }
  }

  // Whole-bubble interior repaint: aggregate items into bubbles, then
  // flood-fill each bubble's interior once. Kills specks that line patches
  // can't reach (between-line gaps) and keeps borders pixel-perfect.
  try {
    const bubbles = BubbleAggregator.aggregateDialogues(items, canvas.width, canvas.height);
    const boxToItem = new Map(items.map((it) => [it.box, it]));
    for (const b of bubbles) {
      // Search window generous enough horizontally to capture oval CJK chambers
      const padX = Math.max(24, Math.min(180, Math.round(Math.max(b.box.width * 1.6, b.box.height * 0.85))));
      const padY = Math.max(16, Math.min(120, Math.round(b.box.height * 0.45)));
      const cx = Math.max(0, b.box.x - padX);
      const cy = Math.max(0, b.box.y - padY);
      const cw = Math.min(canvas.width - cx, b.box.width + padX * 2);
      const ch = Math.min(canvas.height - cy, b.box.height + padY * 2);
      if (b.kind === 'dialogue' && cw >= 20 && ch >= 20) {
        const cImg = ctx.getImageData(cx, cy, cw, ch);
        const chamber = BubbleChamberExtractor.extractChamber(cImg, cx, cy, b.box);
        if (chamber) {
          for (const lb of b.lineBoxes || []) {
            const member = boxToItem.get(lb);
            if (member) {
              member.chamberBox = chamber.chamberBox;
              member.isOvalChamber = chamber.isOval;
            }
          }
        }
      }

      const bx = Math.max(0, b.box.x - 24);
      const by = Math.max(0, b.box.y - 24);
      const bw = Math.min(canvas.width - bx, b.box.width + 48);
      const bh = Math.min(canvas.height - by, b.box.height + 48);
      if (bw < 12 || bh < 12) continue;
      const img = ctx.getImageData(bx, by, bw, bh);
      const patch = BubbleFiller.buildBubblePatch(img, bx, by, b.lineBoxes);
      if (!patch) continue;
      for (const lb of b.lineBoxes || []) {
        const member = boxToItem.get(lb);
        if (member) member.bubblePatch = patch;
      }
    }
  } catch {
    // bubble fill is optional — line patches already cover the common case
  }
}

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
