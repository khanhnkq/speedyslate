import { BoundingBox } from '../shared/types';

/**
 * Common abstraction for OCR text detection engines
 * Follows Open/Closed and Liskov Substitution Principles (SOLID)
 */
export interface ITextDetector {
  detectText(
    canvas: OffscreenCanvas,
    originalWidth: number,
    originalHeight: number
  ): Promise<BoundingBox[]>;

  /**
   * Segmentation detectors (DB/PaddleDet) expose the raw per-pixel text
   * probability map of the last detectText call, at model-input resolution.
   * ratioW/ratioH map source pixels onto it: mapPx = srcPx * ratio.
   * Box-only detectors (RT-DETR) leave this undefined.
   */
  lastProbMap?: {
    data: Float32Array;
    w: number;
    h: number;
    ratioW: number;
    ratioH: number;
  } | null;
}
