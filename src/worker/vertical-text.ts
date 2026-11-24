import { BoundingBox, DialogueItem } from '../shared/types';
import { PixelRegion } from './color-sampler';

/**
 * Helpers for vertical CJK text columns (read top->bottom, right->left).
 * rotateCropCCW maps the top of a column to the left of a horizontal line
 * so the standard rec model reads it left-to-right.
 */
export class VerticalText {
  static isVerticalCandidate(box: BoundingBox, isCjk: boolean): boolean {
    return isCjk && box.height > box.width * 1.6;
  }

  /**
   * Rotate a crop 90 degrees counter-clockwise.
   * src(w,h) -> dst(h,w); dst(x', y') = src(w-1-y', x').
   * Structural PixelRegion in/out: callers needing a real ImageData wrap via
   * `new ImageData(result.data, result.width, result.height)`.
   */
  static rotateCropCCW(src: PixelRegion): PixelRegion {
    const w = src.width;
    const h = src.height;
    const dst = new Uint8ClampedArray(src.data.length);
    for (let y = 0; y < w; y++) {
      const srcX = w - 1 - y;
      for (let x = 0; x < h; x++) {
        const di = (y * h + x) * 4;
        const si = (x * w + srcX) * 4;
        dst[di] = src.data[si];
        dst[di + 1] = src.data[si + 1];
        dst[di + 2] = src.data[si + 2];
        dst[di + 3] = src.data[si + 3];
      }
    }
    return { data: dst, width: h, height: w };
  }

  /**
   * In-place ordering of vertical items into reading order:
   * columns right->left, lines within a column top->bottom.
   */
  static groupColumns(items: DialogueItem[]): void {
    items.sort((a, b) => {
      const dx = b.box.x - a.box.x;
      return Math.abs(dx) > 1 ? dx : a.box.y - b.box.y;
    });
  }
}
