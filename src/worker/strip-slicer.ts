import { BoundingBox } from '../shared/types';
import { ITextDetector } from './detector-interface';

/**
 * Options controlling how tall image strips are sliced for detection.
 */
export interface SliceOptions {
  maxSliceHeight?: number; // Hard cap on slice height in px (default 2000)
  overlap?: number;        // Vertical overlap between consecutive slices in px (default 200)
  aspectCap?: number;      // Max height/width ratio per slice (e.g. 1.8 for RT-DETR 640x640 input)
  invertedPass?: boolean;  // Second detection pass on the inverted image (white-on-dark text)
  /** Page-sized buffer (width*height) receiving max-blended detector prob maps. */
  textMapOut?: Float32Array;
}

/**
 * StripSlicer: Slices ultra-tall webtoon continuous image strips into page-sized chunks
 * (e.g. 2000px height) so ONNX detection models (RT-DETR and DBNet) operate within
 * their optimal receptive field and aspect ratios (~1:2.5 instead of 1:20).
 * Prevents vertical squashing, box fragmentation, and duplicate detections.
 * Following Single Responsibility Principle (SRP).
 */
export class StripSlicer {
  /**
   * Computes the vertical slice layout for an image strip (pure geometry, no canvas ops).
   * With `aspectCap`, slice height = clamp(round(width * aspectCap), 640, maxSliceHeight)
   * so square-input engines (RT-DETR 640x640) never squash a tall strip beyond that ratio.
   * Without `aspectCap`, this reproduces the legacy fixed maxSliceHeight chunking exactly.
   */
  public static computeSliceHeights(
    width: number,
    height: number,
    opts: SliceOptions = {}
  ): { startY: number; h: number }[] {
    const maxSliceHeight = opts.maxSliceHeight ?? 2000;
    const overlap = opts.overlap ?? 200;

    const sliceHeight = opts.aspectCap !== undefined
      ? Math.min(maxSliceHeight, Math.max(640, Math.round(width * opts.aspectCap)))
      : maxSliceHeight;

    // Fast path: standard comic page fits in a single slice
    if (height <= sliceHeight + 200) {
      return [{ startY: 0, h: height }];
    }

    const step = Math.max(1, sliceHeight - overlap);
    const slices: { startY: number; h: number }[] = [];
    for (let startY = 0; startY < height; startY += step) {
      slices.push({ startY, h: Math.min(sliceHeight, height - startY) });
    }
    return slices;
  }

  /**
   * Detects text regions in an OffscreenCanvas, automatically slicing if tall.
   */
  public static async detectWithSlicing(
    canvas: OffscreenCanvas,
    width: number,
    height: number,
    detEngine: ITextDetector,
    opts: SliceOptions = {}
  ): Promise<BoundingBox[]> {
    const slices = this.computeSliceHeights(width, height, opts);
    const allBoxes = await this.detectSlices(canvas, width, height, detEngine, slices, opts.overlap ?? 200, opts.textMapOut);

    // Dark-region pass: white-on-dark narration/text is invisible to models
    // trained on black-on-white bubbles. Only run on y-ranges that contain
    // dark pixels not yet covered by any detected box — clean pages skip it.
    if (opts.invertedPass) {
      const darkRanges = this.findDarkRanges(canvas, width, height, allBoxes);
      if (darkRanges.length > 0) {
        const invCanvas = this.buildInverted(canvas, width, height);
        const invBoxes = await this.detectSlices(invCanvas, width, height, detEngine, darkRanges, 0, opts.textMapOut);
        for (const box of invBoxes) {
          const dup = allBoxes.some((e) => this.calculateIoU(e, box) > 0.5);
          if (!dup) allBoxes.push(box);
        }
      }
    }

    return allBoxes.sort((a, b) => a.y - b.y);
  }

  private static async detectSlices(
    canvas: OffscreenCanvas,
    width: number,
    height: number,
    detEngine: ITextDetector,
    slices: { startY: number; h: number }[],
    overlap: number,
    textMapOut?: Float32Array
  ): Promise<BoundingBox[]> {
    if (slices.length === 1 && slices[0].h === height) {
      const boxes = await detEngine.detectText(canvas, width, height);
      this.blitProbMap(detEngine, textMapOut, width, 0);
      return boxes;
    }

    const allBoxes: BoundingBox[] = [];

    for (const slice of slices) {
      const sliceCanvas = new OffscreenCanvas(width, slice.h);
      const sliceCtx = sliceCanvas.getContext('2d');
      if (!sliceCtx) continue;

      sliceCtx.drawImage(canvas, 0, slice.startY, width, slice.h, 0, 0, width, slice.h);
      const sliceBoxes = await detEngine.detectText(sliceCanvas, width, slice.h);
      this.blitProbMap(detEngine, textMapOut, width, slice.startY);

      for (const box of sliceBoxes) {
        const globalBox: BoundingBox = {
          x: box.x,
          y: slice.startY + box.y,
          width: box.width,
          height: box.height,
          confidence: box.confidence,
          kind: box.kind,
          ...(box.quad
            ? {
                quad: box.quad.map(([qx, qy]) => [qx, slice.startY + qy] as [number, number]),
                angleDeg: box.angleDeg
              }
            : {})
        };

        // If in overlap region with preceding slice, deduplicate
        if (slice.startY > 0 && box.y < overlap + 40) {
          const isDup = allBoxes.some((existing) => this.calculateIoU(existing, globalBox) > 0.35);
          if (isDup) continue;
        }

        allBoxes.push(globalBox);
      }
    }

    return allBoxes;
  }

  /**
   * Max-blends the detector's prob map into the page-level text map at the
   * slice's y offset. Map pixels land on page pixels via srcPx * ratio.
   */
  private static blitProbMap(
    detEngine: ITextDetector,
    out: Float32Array | undefined,
    pageW: number,
    offsetY: number
  ): void {
    const pm = detEngine.lastProbMap;
    if (!pm || !out) return;
    const srcH = Math.round(pm.h / pm.ratioH);
    const srcW = Math.min(pageW, Math.round(pm.w / pm.ratioW));
    for (let sy = 0; sy < srcH; sy++) {
      const gy = offsetY + sy;
      if (gy * pageW >= out.length) break;
      const my = Math.min(pm.h - 1, Math.floor(sy * pm.ratioH));
      const rowOut = gy * pageW;
      const rowMap = my * pm.w;
      for (let sx = 0; sx < srcW; sx++) {
        const mx = Math.min(pm.w - 1, Math.floor(sx * pm.ratioW));
        const v = pm.data[rowMap + mx];
        if (v > out[rowOut + sx]) out[rowOut + sx] = v;
      }
    }
  }

  /**
   * Finds y-ranges holding dark background regions (luma <= 70) that ALSO contain
   * high-contrast bright text foreground strokes (bright core >= 215 adjacent to
   * dark bg <= 70 with meaningful foreground density), avoiding wasted inverted
   * ONNX passes on plain dark artwork, gutters, margins, or panel borders.
   * Contiguous dark rows are merged (gaps <= 80px) and ranges < 48px dropped.
   */
  public static findDarkRanges(
    canvas: OffscreenCanvas,
    width: number,
    height: number,
    boxes: BoundingBox[]
  ): { startY: number; h: number }[] {
    const src = canvas.getContext('2d');
    if (!src) return [];
    const img = src.getImageData(0, 0, width, height).data;
    return this.findDarkRangesFromImageData(img, width, height, boxes);
  }

  /**
   * Pure pixel-buffer implementation of contrast-gated dark-range detection.
   */
  public static findDarkRangesFromImageData(
    img: Uint8ClampedArray,
    width: number,
    height: number,
    boxes: BoundingBox[]
  ): { startY: number; h: number }[] {
    const step = 16;
    const cols = Math.ceil(width / step);
    const rows = Math.ceil(height / step);

    const rowDark = new Int32Array(rows);
    const rowContrast = new Int32Array(rows);
    let darkTotal = 0;

    const lumaAt = (x: number, y: number): number => {
      const i = (y * width + x) * 4;
      return (img[i] * 299 + img[i + 1] * 587 + img[i + 2] * 114) / 1000;
    };

    for (let gy = 0; gy < rows; gy++) {
      const y0 = gy * step;
      const y1 = Math.min(height, y0 + step);
      const cy = Math.min(height - 1, y0 + (step >> 1));

      for (let gx = 0; gx < cols; gx++) {
        const x0 = gx * step;
        const x1 = Math.min(width, x0 + step);
        const cx = Math.min(width - 1, x0 + (step >> 1));

        const covered = boxes.some(
          (b) => cx >= b.x && cx <= b.x + b.width && cy >= b.y && cy <= b.y + b.height
        );
        if (covered) continue;

        let samples = 0;
        let darkBg = 0;
        let brightCore = 0;
        let flankedContrastPx = 0;
        let horizFlankedPx = 0;

        for (let y = y0; y < y1; y += 2) {
          for (let x = x0; x < x1; x += 2) {
            samples++;
            const l = lumaAt(x, y);
            if (l <= 70) {
              darkBg++;
              continue;
            }
            if (l < 215) continue;
            brightCore++;

            const darkL = (x >= 2 && lumaAt(x - 2, y) <= 70) || (x >= 4 && lumaAt(x - 4, y) <= 70);
            const darkR = (x + 2 < width && lumaAt(x + 2, y) <= 70) || (x + 4 < width && lumaAt(x + 4, y) <= 70);
            const darkU = (y >= 2 && lumaAt(x, y - 2) <= 70) || (y >= 4 && lumaAt(x, y - 4) <= 70);
            const darkD = (y + 2 < height && lumaAt(x, y + 2) <= 70) || (y + 4 < height && lumaAt(x, y + 4) <= 70);

            if (darkL && darkR) {
              flankedContrastPx++;
              horizFlankedPx++;
            } else if (darkU && darkD) {
              flankedContrastPx++;
            }
          }
        }

        if (samples > 0 && darkBg >= Math.max(4, samples * 0.5)) {
          rowDark[gy]++;
          darkTotal++;
          if (brightCore <= samples * 0.45 && flankedContrastPx >= 2 && horizFlankedPx >= 1) {
            rowContrast[gy]++;
          }
        }
      }
    }

    if (darkTotal < 8) return [];

    // Group contiguous dark rows (gaps <= 5 rows = 80px) and gate each band
    // on meaningful bright-on-dark foreground density (>= 2 rows with >= 3 contrast cells,
    // >= 5 cells in peak row, and >= 10 total contrast cells across the band).
    const ranges: { startY: number; h: number }[] = [];
    let rangeStart = -1;
    let lastDarkRow = -1;
    for (let gy = 0; gy <= rows; gy++) {
      const isDark = gy < rows && rowDark[gy] >= 2;
      if (isDark) {
        if (rangeStart < 0) rangeStart = gy;
        lastDarkRow = gy;
      } else if (rangeStart >= 0 && (gy === rows || gy - lastDarkRow > 5)) {
        const y = rangeStart * step;
        const h = (lastDarkRow + 1) * step - y;
        if (h >= 48) {
          let bandContrastRows = 0;
          let bandContrastCells = 0;
          let peakRowCells = 0;
          for (let r = rangeStart; r <= lastDarkRow; r++) {
            const c = rowContrast[r];
            if (c >= 3) bandContrastRows++;
            if (c > peakRowCells) peakRowCells = c;
            bandContrastCells += c;
          }
          if (bandContrastRows >= 2 && peakRowCells >= 5 && bandContrastCells >= 10) {
            ranges.push({ startY: y, h: Math.min(h, height - y) });
          }
        }
        rangeStart = -1;
      }
    }
    return ranges;
  }

  private static buildInverted(canvas: OffscreenCanvas, width: number, height: number): OffscreenCanvas {
    const src = canvas.getContext('2d');
    const inv = new OffscreenCanvas(width, height);
    const dst = inv.getContext('2d');
    if (!src || !dst) return canvas;
    const img = src.getImageData(0, 0, width, height);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      d[i] = 255 - d[i];
      d[i + 1] = 255 - d[i + 1];
      d[i + 2] = 255 - d[i + 2];
    }
    dst.putImageData(img, 0, 0);
    return inv;
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
