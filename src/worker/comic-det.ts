import * as ort from 'onnxruntime-web';
import { BoundingBox } from '../shared/types';
import { LineSegmenter } from './line-segmenter';

import { ITextDetector } from './detector-interface';

/**
 * Specialized Manga & Manhwa Comic Detection Engine
 * Uses fine-tuned RT-DETR-v2 on 11,000+ comic pages (ogkalu/comic-text-and-bubble-detector)
 * Directly detects speech bubbles (oval, rectangular, spiky/shout) and interior text lines.
 */
export class ComicDetEngine implements ITextDetector {
  private session: ort.InferenceSession;
  private inputSize = 640;
  private textBubbleThresh = 0.15;
  private textFreeThresh = 0.07;
  private bubbleFallbackThresh = 0.30;

  constructor(session: ort.InferenceSession) {
    this.session = session;
  }

  public async release(): Promise<void> {
    await this.session.release?.();
  }

  /**
   * Detects text regions in an image canvas.
   * Outputs clean bounding boxes for text lines, ready for CTC recognition.
   */
  public async detectText(
    canvas: OffscreenCanvas,
    originalWidth: number,
    originalHeight: number
  ): Promise<BoundingBox[]> {
    // 1. Prepare 640x640 resized canvas for RT-DETR
    const resizedCanvas = new OffscreenCanvas(this.inputSize, this.inputSize);
    const ctx = resizedCanvas.getContext('2d');
    if (!ctx) throw new Error('Không thể tạo context 2D cho ComicDetEngine');

    ctx.drawImage(canvas, 0, 0, this.inputSize, this.inputSize);
    const imageData = ctx.getImageData(0, 0, this.inputSize, this.inputSize);
    const data = imageData.data;

    // 2. Build RGB Float32 tensor: [1, 3, 640, 640] normalized [0, 1]
    const channelSize = this.inputSize * this.inputSize;
    const rgbTensorData = new Float32Array(3 * channelSize);

    for (let i = 0; i < channelSize; i++) {
      const px = i * 4;
      rgbTensorData[i] = data[px] / 255.0;                   // R
      rgbTensorData[channelSize + i] = data[px + 1] / 255.0; // G
      rgbTensorData[2 * channelSize + i] = data[px + 2] / 255.0; // B
    }

    const imagesTensor = new ort.Tensor('float32', rgbTensorData, [1, 3, this.inputSize, this.inputSize]);

    // 3. Build orig_target_sizes tensor: [1, 2] int64 [origW, origH]
    const origTargetSizes = new ort.Tensor('int64', new BigInt64Array([
      BigInt(originalWidth),
      BigInt(originalHeight)
    ]), [1, 2]);

    // 4. Run inference and copy result typed arrays before disposing tensors
    const feeds: Record<string, ort.Tensor> = {
      images: imagesTensor,
      orig_target_sizes: origTargetSizes
    };

    let results: Record<string, ort.Tensor> | null = null;
    let labelsData: ArrayLike<number | bigint>;
    let boxesData: Float32Array;
    let scoresData: Float32Array;
    try {
      results = await this.session.run(feeds);
      labelsData = Array.from(results.labels.data as ArrayLike<number | bigint>);
      boxesData = new Float32Array(results.boxes.data as Float32Array);
      scoresData = new Float32Array(results.scores.data as Float32Array);
    } finally {
      imagesTensor.dispose?.();
      origTargetSizes.dispose?.();
      if (results) {
        for (const out of Object.values(results)) out.dispose?.();
      }
    }

    // 5. Extract bounding boxes
    const numQueries = scoresData.length;
    const textCandidates: BoundingBox[] = [];
    const bubbleCandidates: BoundingBox[] = [];

    for (let i = 0; i < numQueries; i++) {
      const score = scoresData[i];
      const label = Number(labelsData[i]);

      // RT-DETR v2 output format is [xmin, ymin, xmax, ymax] in absolute pixels
      const xmin = Math.max(0, Math.round(boxesData[i * 4 + 0]));
      const ymin = Math.max(0, Math.round(boxesData[i * 4 + 1]));
      const xmax = Math.min(originalWidth, Math.round(boxesData[i * 4 + 2]));
      const ymax = Math.min(originalHeight, Math.round(boxesData[i * 4 + 3]));

      const width = xmax - xmin;
      const height = ymax - ymin;

      // Discard invalid or full-frame borders
      if (width < 8 || height < 8) continue;
      if (width >= originalWidth * 0.98 && height >= originalHeight * 0.95) continue;

      const box: BoundingBox = {
        x: xmin,
        y: ymin,
        width,
        height,
        confidence: score
      };

      // Label 1: text_bubble → dialogue, Label 2: text_free (SFX) → sfx
      if (label === 1 && score >= this.textBubbleThresh) {
        box.kind = 'dialogue';
        textCandidates.push(box);
      } else if (label === 2 && score >= this.textFreeThresh) {
        box.kind = 'sfx';
        textCandidates.push(box);
      } else if (label === 0 && score >= this.bubbleFallbackThresh) {
        bubbleCandidates.push(box);
      }
    }

    // Include speech bubbles that don't already enclose a detected text_bubble
    for (const b of bubbleCandidates) {
      const hasTextInside = textCandidates.some(
        (t) =>
          t.x >= b.x - 12 &&
          t.y >= b.y - 12 &&
          t.x + t.width <= b.x + b.width + 12 &&
          t.y + t.height <= b.y + b.height + 12
      );
      if (!hasTextInside) {
        const padX = Math.round(b.width * 0.08);
        const padY = Math.round(b.height * 0.08);
        textCandidates.push({
          x: b.x + padX,
          y: b.y + padY,
          width: Math.max(12, b.width - padX * 2),
          height: Math.max(12, b.height - padY * 2),
          confidence: b.confidence,
          kind: 'dialogue'
        });
      }
    }

    const rawCandidates = ComicDetEngine.suppressOverlappingBoxes(textCandidates);

    // 6. Split multi-line paragraph bubbles into individual text lines
    const finalBoxes: BoundingBox[] = [];
    const sourceCtx = canvas.getContext('2d');

    for (const box of rawCandidates) {
      if (box.height >= 34 && box.width >= 28 && sourceCtx) {
        const lines = LineSegmenter.segmentLines(sourceCtx, box, originalWidth, originalHeight);
        if (lines.length > 0) {
          finalBoxes.push(...lines);
          continue;
        }
      }
      finalBoxes.push(box);
    }

    // 7. Suppress any remaining overlapping split lines and sort top-to-bottom
    return ComicDetEngine.suppressOverlappingBoxes(finalBoxes).sort((a, b) => a.y - b.y);
  }

  /**
   * NMS + containment suppression: drops lower-confidence overlapping or
   * containing duplicates while preserving distinct adjacent lines/SFX.
   */
  public static suppressOverlappingBoxes(boxes: BoundingBox[]): BoundingBox[] {
    if (boxes.length <= 1) return boxes;
    const ranked = [...boxes].sort((a, b) => {
      const confDiff = (b.confidence ?? 0) - (a.confidence ?? 0);
      if (Math.abs(confDiff) > 1e-4) return confDiff;
      return a.width * a.height - b.width * b.height;
    });
    const kept: BoundingBox[] = [];
    for (const cand of ranked) {
      const cArea = Math.max(1, cand.width * cand.height);
      const suppressed = kept.some((k) => {
        if ((k.kind === 'sfx') !== (cand.kind === 'sfx')) return false;
        const ix = Math.max(0, Math.min(k.x + k.width, cand.x + cand.width) - Math.max(k.x, cand.x));
        const iy = Math.max(0, Math.min(k.y + k.height, cand.y + cand.height) - Math.max(k.y, cand.y));
        const inter = ix * iy;
        if (inter <= 0) return false;
        const kArea = Math.max(1, k.width * k.height);
        const iou = inter / Math.max(1, kArea + cArea - inter);
        const contain = inter / Math.min(kArea, cArea);
        if (iou > 0.35 || contain >= 0.65) return true;
        const xOv = ix / Math.max(1, Math.min(k.width, cand.width));
        const yOv = iy / Math.max(1, Math.min(k.height, cand.height));
        return xOv >= 0.70 && yOv >= 0.40;
      });
      if (!suppressed) kept.push(cand);
    }
    return kept;
  }

}
