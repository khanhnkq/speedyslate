import { BoundingBox } from '../shared/types';

export interface PagePixelBuffer {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

type PaperPolarity = 'light' | 'dark' | 'unknown';

/**
 * Detects physical speech-bubble walls (borders, panel gutters, pinched figure-8 waists,
 * or opposite-polarity backgrounds) between adjacent text lines or vertical columns.
 */
export class BubbleWallDetector {
  /** Returns true if a horizontal wall or opposite-polarity background separates boxA and boxB. */
  public static hasHorizontalWallBetween(img: PagePixelBuffer, boxA: BoundingBox, boxB: BoundingBox): boolean {
    const [topBox, botBox] = boxA.y <= boxB.y ? [boxA, boxB] : [boxB, boxA];
    const gapY0 = Math.floor(topBox.y + topBox.height);
    const gapY1 = Math.ceil(botBox.y);
    if (gapY1 - gapY0 < 4) return false;

    const paperLuma = this.resolveSharedPaperLuma(img, topBox, botBox);
    if (typeof paperLuma === 'boolean') return paperLuma;

    const span = this.computeProbeSpan(topBox.x, topBox.width, botBox.x, botBox.width, img.width);
    return span ? this.scanGapForWall(img, paperLuma, span[0], span[1], gapY0 + 1, gapY1 - 2, true) : false;
  }

  /** Returns true if a vertical wall or opposite-polarity background separates colA and colB. */
  public static hasVerticalWallBetween(img: PagePixelBuffer, colA: BoundingBox, colB: BoundingBox): boolean {
    const [leftCol, rightCol] = colA.x <= colB.x ? [colA, colB] : [colB, colA];
    const gapX0 = Math.floor(leftCol.x + leftCol.width);
    const gapX1 = Math.ceil(rightCol.x);
    if (gapX1 - gapX0 < 4) return false;

    const paperLuma = this.resolveSharedPaperLuma(img, leftCol, rightCol);
    if (typeof paperLuma === 'boolean') return paperLuma;

    const span = this.computeProbeSpan(leftCol.y, leftCol.height, rightCol.y, rightCol.height, img.height);
    return span ? this.scanGapForWall(img, paperLuma, span[0], span[1], gapX0 + 1, gapX1 - 2, false) : false;
  }

  /** Scans gap rows (horizontal) or columns (vertical) for >=60% non-paper pixels across the probe span. */
  private static scanGapForWall(
    img: PagePixelBuffer,
    paperLuma: number,
    spanStart: number,
    spanEnd: number,
    gapStart: number,
    gapEnd: number,
    horizontal: boolean
  ): boolean {
    const spanLen = spanEnd - spanStart + 1;
    const limit = horizontal ? img.height - 1 : img.width - 1;
    const g0 = Math.max(0, gapStart);
    const g1 = Math.min(limit, gapEnd);

    for (let g = g0; g <= g1; g++) {
      let nonPaperCount = 0;
      for (let s = spanStart; s <= spanEnd; s++) {
        const luma = horizontal
          ? this.pixelLuma(img.data, img.width, s, g)
          : this.pixelLuma(img.data, img.width, g, s);
        if (Math.abs(luma - paperLuma) > 45) nonPaperCount++;
      }
      if (nonPaperCount / spanLen >= 0.60) return true;
    }
    return false;
  }

  /** Resolves shared paper luma; returns true for opposite polarities and false for unknown. */
  private static resolveSharedPaperLuma(img: PagePixelBuffer, boxA: BoundingBox, boxB: BoundingBox): number | boolean {
    const classA = this.classifyPaper(img, boxA);
    const classB = this.classifyPaper(img, boxB);
    if (
      (classA.polarity === 'light' && classB.polarity === 'dark') ||
      (classA.polarity === 'dark' && classB.polarity === 'light')
    ) {
      return true;
    }
    if (classA.polarity === 'unknown' || classB.polarity === 'unknown') return false;
    return (classA.paperLuma + classB.paperLuma) * 0.5;
  }

  /** Classifies box interior paper polarity via luma p25/p75 histogram quantiles. */
  private static classifyPaper(img: PagePixelBuffer, box: BoundingBox): { polarity: PaperPolarity; paperLuma: number } {
    const x0 = Math.max(0, Math.floor(box.x));
    const y0 = Math.max(0, Math.floor(box.y));
    const x1 = Math.min(img.width - 1, Math.ceil(box.x + box.width) - 1);
    const y1 = Math.min(img.height - 1, Math.ceil(box.y + box.height) - 1);
    if (x1 < x0 || y1 < y0) return { polarity: 'unknown', paperLuma: 128 };

    const step = (x1 - x0 + 1) * (y1 - y0 + 1) > 4000 ? 2 : 1;
    const hist = new Int32Array(256);
    let total = 0;
    for (let y = y0; y <= y1; y += step) {
      for (let x = x0; x <= x1; x += step) {
        hist[this.pixelLuma(img.data, img.width, x, y)]++;
        total++;
      }
    }
    if (total === 0) return { polarity: 'unknown', paperLuma: 128 };

    const p25Target = Math.floor((total - 1) * 0.25);
    const p50Target = Math.floor((total - 1) * 0.5);
    const p75Target = Math.floor((total - 1) * 0.75);
    let p25 = 0;
    let p50 = 128;
    let p75 = 255;
    let seen = 0;
    let foundP25 = false;
    let foundP50 = false;
    for (let l = 0; l < 256; l++) {
      seen += hist[l];
      if (!foundP25 && seen > p25Target) {
        p25 = l;
        foundP25 = true;
      }
      if (!foundP50 && seen > p50Target) {
        p50 = l;
        foundP50 = true;
      }
      if (seen > p75Target) {
        p75 = l;
        break;
      }
    }

    if (p50 >= 160 && p75 >= 195) return { polarity: 'light', paperLuma: p75 };
    if (p50 <= 95 && p25 <= 60) return { polarity: 'dark', paperLuma: p25 };
    return { polarity: 'unknown', paperLuma: p50 };
  }

  /** Computes 15%-inset overlap span (min 8px) or a 16px midpoint band when overlap < 12px. */
  private static computeProbeSpan(
    aStart: number,
    aSize: number,
    bStart: number,
    bSize: number,
    limit: number
  ): [number, number] | null {
    if (limit <= 0) return null;
    const ovStart = Math.max(aStart, bStart);
    const ovEnd = Math.min(aStart + aSize - 1, bStart + bSize - 1);
    const ovWidth = ovEnd - ovStart + 1;

    let s0: number;
    let s1: number;
    if (ovWidth < 12) {
      const mid = (aStart + aSize * 0.5 + (bStart + bSize * 0.5)) * 0.5;
      s0 = Math.round(mid - 8);
      s1 = s0 + 15;
    } else {
      const inset = Math.floor(ovWidth * 0.15);
      s0 = Math.floor(ovStart) + inset;
      s1 = Math.ceil(ovEnd) - inset;
      if (s1 - s0 + 1 < 8) {
        const mid = (ovStart + ovEnd) * 0.5;
        s0 = Math.floor(mid - 3.5);
        s1 = s0 + 7;
      }
    }

    s0 = Math.max(0, s0);
    s1 = Math.min(limit - 1, s1);
    return s1 >= s0 ? [s0, s1] : null;
  }

  private static pixelLuma(data: Uint8ClampedArray, width: number, x: number, y: number): number {
    const idx = (y * width + x) << 2;
    return (data[idx] * 77 + data[idx + 1] * 150 + data[idx + 2] * 29) >> 8;
  }
}
