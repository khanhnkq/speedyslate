import { PixelRegion } from './color-sampler';

export interface InkBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

interface OtsuResult {
  otsuT: number;
  textIsDark: boolean;
  bgMean: number;
  lumas: Uint8Array;
  hist: Int32Array;
}

/**
 * Pure pixel-level helpers for preparing OCR recognition crops:
 * Otsu background/ink separation, horizontal/vertical ink-bound tightening,
 * border-wall masking in added padding, and halftone despeckle cleaning.
 */
export class RecCropCleaner {
  private static analyzeOtsu(img: PixelRegion): OtsuResult {
    const data = img.data;
    const total = img.width * img.height;
    const lumas = new Uint8Array(total);
    const hist = new Int32Array(256);

    for (let i = 0; i < total; i++) {
      const p = i * 4;
      const li = ((data[p] * 299 + data[p + 1] * 587 + data[p + 2] * 114) / 1000) | 0;
      lumas[i] = li;
      hist[li]++;
    }

    let sumAll = 0;
    for (let t = 0; t < 256; t++) sumAll += t * hist[t];
    let sumB = 0;
    let wB = 0;
    let maxVar = -1;
    let bestStart = 128;
    let bestEnd = 128;
    for (let t = 0; t < 256; t++) {
      wB += hist[t];
      if (wB === 0) continue;
      const wF = total - wB;
      if (wF === 0) break;
      sumB += t * hist[t];
      const mB = sumB / wB;
      const mF = (sumAll - sumB) / wF;
      const v = wB * wF * (mB - mF) * (mB - mF);
      if (v > maxVar + 1e-6) {
        maxVar = v;
        bestStart = t;
        bestEnd = t;
      } else if (Math.abs(v - maxVar) <= 1e-6) {
        bestEnd = t;
      }
    }
    const otsuT = (bestStart + bestEnd) >> 1;

    let below = 0;
    for (let t = 0; t <= otsuT; t++) below += hist[t];
    const textIsDark = below <= total / 2;

    let bgSum = 0;
    let bgCount = 0;
    for (let i = 0; i < total; i++) {
      const isText = textIsDark ? lumas[i] <= otsuT : lumas[i] > otsuT;
      if (!isText) {
        bgSum += lumas[i];
        bgCount++;
      }
    }

    return {
      otsuT,
      textIsDark,
      bgMean: bgCount > 0 ? bgSum / bgCount : 255,
      lumas,
      hist
    };
  }

  /**
   * Computes background luma standard deviation on the uncleaned crop
   * so downstream confidence gating knows whether the line sits on flat
   * bubble paper or textured art/foliage.
   */
  public static measureBgLumaStd(img: PixelRegion): number {
    const total = img.width * img.height;
    if (total === 0 || img.data.length < total * 4) return 0;
    const { otsuT, textIsDark, lumas } = this.analyzeOtsu(img);
    let lSum = 0;
    let lSq = 0;
    let bgCount = 0;
    for (let i = 0; i < total; i++) {
      const isText = textIsDark ? lumas[i] <= otsuT : lumas[i] > otsuT;
      if (isText) continue;
      lSum += lumas[i];
      lSq += lumas[i] * lumas[i];
      bgCount++;
    }
    if (bgCount === 0) return 0;
    const mean = lSum / bgCount;
    return Math.sqrt(Math.max(0, lSq / bgCount - mean * mean));
  }

  /**
   * Extends a page-edge-clipped crop (e.g. y=0 top-sliced line) by clamping
   * and replicating edge rows/columns into the clipped margin so sliced stems
   * aren't severed by artificial white borders while keeping symmetric padding.
   */
  public static padClippedImageData(
    src: PixelRegion,
    padL: number,
    padT: number,
    padR: number,
    padB: number
  ): { data: Uint8ClampedArray; width: number; height: number } {
    const sw = src.width;
    const sh = src.height;
    const dw = sw + padL + padR;
    const dh = sh + padT + padB;
    const out = new Uint8ClampedArray(dw * dh * 4);
    for (let y = 0; y < dh; y++) {
      const sy = Math.max(0, Math.min(sh - 1, y - padT));
      for (let x = 0; x < dw; x++) {
        const sx = Math.max(0, Math.min(sw - 1, x - padL));
        const sp = (sy * sw + sx) * 4;
        const dp = (y * dw + x) * 4;
        out[dp] = src.data[sp];
        out[dp + 1] = src.data[sp + 1];
        out[dp + 2] = src.data[sp + 2];
        out[dp + 3] = src.data[sp + 3];
      }
    }
    return { data: out, width: dw, height: dh };
  }

  /**
   * Finds the tight bounding box of actual glyph ink inside a detected line box.
   * Strips wide horizontal bubble margins so PP-OCRv4 rec isn't fed 50-100px
   * of empty whitespace on either side of short words like "HOME." or "HERE.".
   */
  public static findInkBounds(img: PixelRegion): InkBounds | null {
    const w = img.width;
    const h = img.height;
    if (w < 12 || h < 8 || img.data.length < w * h * 4) return null;

    const { otsuT, textIsDark, bgMean, lumas } = this.analyzeOtsu(img);
    if (otsuT < 20 || otsuT > 235) return null;

    const colCnt = new Int32Array(w);
    const rowCnt = new Int32Array(h);
    for (let y = 0; y < h; y++) {
      const rowOff = y * w;
      for (let x = 0; x < w; x++) {
        const l = lumas[rowOff + x];
        const isInk = textIsDark
          ? l <= otsuT && bgMean - l > 40
          : l > otsuT && l - bgMean > 40;
        if (isInk) {
          colCnt[x]++;
          rowCnt[y]++;
        }
      }
    }

    let minX = w;
    let maxX = -1;
    for (let x = 0; x < w; x++) {
      if (colCnt[x] >= 2) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
      }
    }

    let minY = h;
    let maxY = -1;
    for (let y = 0; y < h; y++) {
      if (rowCnt[y] >= 2) {
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }

    if (maxX <= minX + 6 || maxY <= minY + 4) return null;
    return { minX, maxX, minY, maxY };
  }

  /**
   * Repaints tall border-connected wall segments that fall strictly inside the
   * left/right added padding strips (never touching interior glyph bounds or
   * top/bottom glyph ascenders/descenders).
   */
  public static maskBorderWallsInPadding(
    img: PixelRegion,
    padL: number,
    padR: number
  ): void {
    const w = img.width;
    const h = img.height;
    const data = img.data;
    if (w < 12 || h < 8 || data.length < w * h * 4) return;

    const safeL = Math.max(0, Math.min(w - 1, padL - 2));
    const safeR = Math.max(safeL + 1, Math.min(w, w - Math.max(0, padR - 2)));
    if (safeL === 0 && safeR === w) return;

    const { otsuT, textIsDark, lumas } = this.analyzeOtsu(img);
    let rSum = 0;
    let gSum = 0;
    let bSum = 0;
    let lSum = 0;
    let bgCount = 0;
    const total = w * h;
    for (let i = 0; i < total; i++) {
      const isText = textIsDark ? lumas[i] <= otsuT : lumas[i] > otsuT;
      if (isText) continue;
      const p = i * 4;
      rSum += data[p];
      gSum += data[p + 1];
      bSum += data[p + 2];
      lSum += lumas[i];
      bgCount++;
    }
    if (bgCount === 0) return;

    const bgR = Math.round(rSum / bgCount);
    const bgG = Math.round(gSum / bgCount);
    const bgB = Math.round(bSum / bgCount);
    const bgL = lSum / bgCount;

    const clearEdgeStrip = (xStart: number, xEnd: number) => {
      for (let x = xStart; x < xEnd; x++) {
        let darkCount = 0;
        for (let y = 0; y < h; y++) {
          if (Math.abs(lumas[y * w + x] - bgL) > 45) darkCount++;
        }
        // Only repaint columns that look like a continuous vertical bubble wall
        if (darkCount >= h * 0.65) {
          for (let y = 0; y < h; y++) {
            const p = (y * w + x) * 4;
            data[p] = bgR;
            data[p + 1] = bgG;
            data[p + 2] = bgB;
          }
        }
      }
    };

    if (safeL > 0) clearEdgeStrip(0, safeL);
    if (safeR < w) clearEdgeStrip(safeR, w);
  }

  /**
   * Otsu-binarizes a crop and repaints every background pixel with the mean
   * background color when background variance is high (screentone/art noise).
   * Preserves thin 1px glyph tips (requires >= 2 neighbors rather than 3).
   */
  public static cleanCropToMask(img: PixelRegion): void {
    const data = img.data;
    const w = img.width;
    const h = img.height;
    const total = w * h;
    if (total === 0 || data.length < total * 4) return;

    const { otsuT, textIsDark, lumas, hist } = this.analyzeOtsu(img);

    let below = 0;
    for (let t = 0; t <= otsuT; t++) below += hist[t];
    if (otsuT < 20 || otsuT > 235) return;
    const minority = Math.min(below, total - below);
    if (minority < total * 0.02 || minority > total * 0.45) return;

    let rSum = 0;
    let gSum = 0;
    let bSum = 0;
    let lSum = 0;
    let lSq = 0;
    let bgCount = 0;
    for (let i = 0; i < total; i++) {
      const isText = textIsDark ? lumas[i] <= otsuT : lumas[i] > otsuT;
      if (isText) continue;
      const p = i * 4;
      rSum += data[p];
      gSum += data[p + 1];
      bSum += data[p + 2];
      lSum += lumas[i];
      lSq += lumas[i] * lumas[i];
      bgCount++;
    }
    if (bgCount === 0) return;

    const bgLumaStd = Math.sqrt(Math.max(0, lSq / bgCount - (lSum / bgCount) ** 2));
    if (bgLumaStd <= 30) return;

    const bgR = rSum / bgCount;
    const bgG = gSum / bgCount;
    const bgB = bSum / bgCount;

    const textMask = new Uint8Array(total);
    for (let i = 0; i < total; i++) {
      textMask[i] = (textIsDark ? lumas[i] <= otsuT : lumas[i] > otsuT) ? 1 : 0;
    }

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        if (textMask[i]) {
          let n = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (!dx && !dy) continue;
              const nx = x + dx;
              const ny = y + dy;
              if (nx >= 0 && nx < w && ny >= 0 && ny < h && textMask[ny * w + nx]) n++;
            }
          }
          if (n >= 2) continue;
        }
        const p = i * 4;
        data[p] = bgR;
        data[p + 1] = bgG;
        data[p + 2] = bgB;
      }
    }
  }
}
