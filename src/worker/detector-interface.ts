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
}
