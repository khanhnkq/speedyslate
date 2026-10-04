import * as ort from 'onnxruntime-web';
import { BoundingBox } from '../shared/types';
import { ImageUtils } from './image-utils';

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
  private textFreeThresh = 0.10;

  constructor(session: ort.InferenceSession) {
    this.session = session;
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

    // 4. Run inference
    const feeds: Record<string, ort.Tensor> = {
      images: imagesTensor,
      orig_target_sizes: origTargetSizes
    };

    const results = await this.session.run(feeds);
    const labelsData = results.labels.data;
    const boxesData = results.boxes.data as Float32Array;
    const scoresData = results.scores.data as Float32Array;

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

      // Label 1: text_bubble, Label 2: text_free (SFX)
      if (label === 1 && score >= this.textBubbleThresh) {
        textCandidates.push(box);
      } else if (label === 2 && score >= this.textFreeThresh) {
        textCandidates.push(box);
      } else if (label === 0 && score >= 0.40) {
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
          confidence: b.confidence
        });
      }
    }

    const rawCandidates = textCandidates;

    // 6. Split multi-line paragraph bubbles into individual text lines
    const finalBoxes: BoundingBox[] = [];
    const sourceCtx = canvas.getContext('2d');

    for (const box of rawCandidates) {
      if (box.height >= 34 && box.width >= 28 && sourceCtx) {
        const lines = this.segmentBubbleLines(sourceCtx, box, originalWidth, originalHeight);
        if (lines.length > 0) {
          finalBoxes.push(...lines);
          continue;
        }
      }
      finalBoxes.push(box);
    }

    // 7. Sort detected boxes top-to-bottom for natural reading order
    return finalBoxes.sort((a, b) => a.y - b.y);
  }

  /**
   * Performs horizontal projection profiling to segment a multi-line bubble into individual lines
   */
  private segmentBubbleLines(
    ctx: OffscreenCanvasRenderingContext2D,
    box: BoundingBox,
    canvasW: number,
    canvasH: number
  ): BoundingBox[] {
    try {
      const imgData = ctx.getImageData(box.x, box.y, box.width, box.height);
      const data = imgData.data;
      const w = box.width;
      const h = box.height;

      // 1. Detect background brightness from perimeter
      let perimeterLuma = 0;
      let samples = 0;
      for (let x = 0; x < w; x += 3) {
        const topIdx = x * 4;
        const botIdx = ((h - 1) * w + x) * 4;
        perimeterLuma += (data[topIdx] * 299 + data[topIdx + 1] * 587 + data[topIdx + 2] * 114) / 1000;
        perimeterLuma += (data[botIdx] * 299 + data[botIdx + 1] * 587 + data[botIdx + 2] * 114) / 1000;
        samples += 2;
      }
      const bgLuma = samples > 0 ? perimeterLuma / samples : 255;
      const isDarkBg = bgLuma < 120;

      // 2. Count text-like pixels per row
      const textPixelsPerRow = new Int32Array(h);
      for (let y = 0; y < h; y++) {
        let count = 0;
        const rowOffset = y * w * 4;
        for (let x = 0; x < w; x++) {
          const px = rowOffset + x * 4;
          const luma = (data[px] * 299 + data[px + 1] * 587 + data[px + 2] * 114) / 1000;
          const isText = isDarkBg ? luma > 160 : luma < 120;
          if (isText) count++;
        }
        textPixelsPerRow[y] = count;
      }

      // 3. Identify contiguous vertical text bands
      const minTextPixels = Math.max(3, Math.round(w * 0.02));
      const lines: { startY: number; height: number }[] = [];
      let inLine = false;
      let startY = 0;

      for (let y = 0; y < h; y++) {
        const hasText = textPixelsPerRow[y] >= minTextPixels;
        if (hasText && !inLine) {
          inLine = true;
          startY = y;
        } else if (!hasText && inLine) {
          inLine = false;
          const lineH = y - startY;
          if (lineH >= 11) {
            lines.push({ startY, height: lineH });
          }
        }
      }
      if (inLine) {
        const lineH = h - startY;
        if (lineH >= 11) {
          lines.push({ startY, height: lineH });
        }
      }

      if (lines.length <= 1) {
        return [box];
      }

      // 4. Tighten each line horizontally
      return lines.map((l) => {
        let minX = w;
        let maxX = 0;

        for (let dy = 0; dy < l.height; dy++) {
          const y = l.startY + dy;
          const rowOffset = y * w * 4;
          for (let x = 0; x < w; x++) {
            const px = rowOffset + x * 4;
            const luma = (data[px] * 299 + data[px + 1] * 587 + data[px + 2] * 114) / 1000;
            const isText = isDarkBg ? luma > 160 : luma < 120;
            if (isText) {
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
            }
          }
        }

        const padX = 6;
        const lineX = minX < maxX ? Math.max(box.x, box.x + minX - padX) : box.x;
        const lineW = minX < maxX ? Math.min(canvasW - lineX, (maxX - minX) + padX * 2) : box.width;

        return ImageUtils.clampBox(
          {
            x: lineX,
            y: box.y + l.startY,
            width: lineW,
            height: l.height,
            confidence: box.confidence
          },
          canvasW,
          canvasH
        );
      });
    } catch {
      return [box];
    }
  }
}
