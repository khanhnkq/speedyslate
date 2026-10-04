import { BoundingBox } from '../shared/types';
import { ITextDetector } from './detector-interface';

/**
 * StripSlicer: Slices ultra-tall webtoon continuous image strips into page-sized chunks
 * (e.g. 2000px height) so ONNX detection models (RT-DETR and DBNet) operate within
 * their optimal receptive field and aspect ratios (~1:2.5 instead of 1:20).
 * Prevents vertical squashing, box fragmentation, and duplicate detections.
 * Following Single Responsibility Principle (SRP).
 */
export class StripSlicer {
  /**
   * Detects text regions in an OffscreenCanvas, automatically slicing if tall.
   */
  public static async detectWithSlicing(
    canvas: OffscreenCanvas,
    width: number,
    height: number,
    detEngine: ITextDetector,
    maxSliceHeight = 2000,
    overlap = 200
  ): Promise<BoundingBox[]> {
    // Fast path: standard comic page (Toonhey, manga, or single panels)
    if (height <= maxSliceHeight + 200) {
      return detEngine.detectText(canvas, width, height);
    }

    const step = maxSliceHeight - overlap;
    const allBoxes: BoundingBox[] = [];

    for (let startY = 0; startY < height; startY += step) {
      const currentH = Math.min(maxSliceHeight, height - startY);
      const sliceCanvas = new OffscreenCanvas(width, currentH);
      const sliceCtx = sliceCanvas.getContext('2d');
      if (!sliceCtx) continue;

      sliceCtx.drawImage(canvas, 0, startY, width, currentH, 0, 0, width, currentH);
      const sliceBoxes = await detEngine.detectText(sliceCanvas, width, currentH);

      for (const box of sliceBoxes) {
        const globalBox: BoundingBox = {
          x: box.x,
          y: startY + box.y,
          width: box.width,
          height: box.height,
          confidence: box.confidence
        };

        // If in overlap region with preceding slice, deduplicate
        if (startY > 0 && box.y < overlap + 40) {
          const isDup = allBoxes.some((existing) => this.calculateIoU(existing, globalBox) > 0.35);
          if (isDup) continue;
        }

        allBoxes.push(globalBox);
      }
    }

    return allBoxes.sort((a, b) => a.y - b.y);
  }

  /**
   * Computes Intersection over Union (IoU) between two bounding boxes
   */
  public static calculateIoU(a: BoundingBox, b: BoundingBox): number {
    const xOverlap = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
    const yOverlap = Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
    const intersection = xOverlap * yOverlap;
    if (intersection <= 0) return 0;

    const areaA = a.width * a.height;
    const areaB = b.width * b.height;
    const union = areaA + areaB - intersection;
    return union > 0 ? intersection / union : 0;
  }
}
