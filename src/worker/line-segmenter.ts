import { BoundingBox } from '../shared/types';
import { ImageUtils } from './image-utils';

/**
 * Splits a multi-line text region into per-line boxes using horizontal
 * projection profiling. Shared by ComicDetEngine (bubble interiors) and
 * the supplementary det pass (raw narration blocks can cover several lines).
 */
export class LineSegmenter {
  static segmentLines(
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

      // 1. Otsu binarization with multi-tone light/dark cloud refinement:
      // a 2-tone background (e.g. pale-grey cloud ~212 on white panel ~254) can
      // trick single-pass Otsu into splitting white vs cloud instead of cloud vs ink.
      const hist = new Int32Array(256);
      const lumaAt = (i: number): number =>
        (data[i * 4] * 299 + data[i * 4 + 1] * 587 + data[i * 4 + 2] * 114) / 1000;
      const total = w * h;
      for (let i = 0; i < total; i++) hist[Math.round(lumaAt(i))]++;

      let otsuT = LineSegmenter.otsuRange(hist, 0, 255);
      const p03 = LineSegmenter.histQuantile(hist, total, 0.03);
      const p25 = LineSegmenter.histQuantile(hist, total, 0.25);
      const p50 = LineSegmenter.histQuantile(hist, total, 0.5);
      const p75 = LineSegmenter.histQuantile(hist, total, 0.75);
      const p97 = LineSegmenter.histQuantile(hist, total, 0.97);

      let below = 0;
      for (let t = 0; t <= otsuT; t++) below += hist[t];
      const textIsDark =
        p50 >= 145 && p03 < p50 - 35
          ? true
          : p50 <= 110 && p97 > p50 + 35
            ? false
            : below <= total / 2;

      if (textIsDark) {
        for (let pass = 0; pass < 3 && otsuT >= 165; pass++) {
          const belowMed = LineSegmenter.histRangeMedian(hist, 0, otsuT);
          if (belowMed < 155) break;
          const nextT = LineSegmenter.otsuRange(hist, 0, otsuT);
          if (nextT >= otsuT) break;
          otsuT = nextT;
        }
        // Require dark ink to deviate cleanly below light-grey paper/clouds
        if (p75 >= 190 && p03 <= 135) {
          otsuT = Math.min(otsuT, 165);
        }
      } else {
        for (let pass = 0; pass < 3 && otsuT <= 90; pass++) {
          const aboveMed = LineSegmenter.histRangeMedian(hist, otsuT + 1, 255);
          if (aboveMed > 100) break;
          const nextT = LineSegmenter.otsuRange(hist, otsuT + 1, 255);
          if (nextT <= otsuT) break;
          otsuT = nextT;
        }
        if (p25 <= 65 && p97 >= 120) {
          otsuT = Math.max(otsuT, 95);
        }
      }
      const isTextPx = (luma: number): boolean => (textIsDark ? luma <= otsuT : luma > otsuT);

      // 2. Count text-like pixels per row, ignoring the outer 8% columns —
      // oval bubble borders and corner art hug the box edges and would
      // otherwise keep every row above the threshold, merging all lines.
      const marginX = Math.round(w * 0.08);
      const textPixelsPerRow = new Int32Array(h);
      for (let y = 0; y < h; y++) {
        let count = 0;
        const rowOffset = y * w;
        for (let x = marginX; x < w - marginX; x++) {
          if (isTextPx(lumaAt(rowOffset + x))) count++;
        }
        textPixelsPerRow[y] = count;
      }

      // 3. Identify contiguous vertical text bands
      const minTextPixels = Math.max(4, Math.round(w * 0.03));
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

      // 4. Find foreign solid interiors (bright-text case only): a large
      // contiguous block of text-class pixels — e.g. a WHITE bubble sitting
      // inside a dark narration blob — is not stroke ink. Detect it on a
      // coarse 8px grid as BFS regions >= 4x4 cells; strokes never form those.
      const solidRects: { x0: number; x1: number; y0: number; y1: number }[] = [];
      if (!textIsDark) {
        const cell = 8;
        const gw = Math.ceil(w / cell);
        const gh = Math.ceil(h / cell);
        const cellCnt = new Int32Array(gw * gh);
        const cellTot = new Int32Array(gw * gh);
        for (let y = 0; y < h; y++) {
          const gy = (y / cell) | 0;
          const rowOffset = y * w;
          for (let x = 0; x < w; x++) {
            const gi = gy * gw + ((x / cell) | 0);
            cellTot[gi]++;
            if (isTextPx(lumaAt(rowOffset + x))) cellCnt[gi]++;
          }
        }
        const isSolid = new Uint8Array(gw * gh);
        for (let i = 0; i < gw * gh; i++) {
          if (cellTot[i] > 0 && cellCnt[i] / cellTot[i] >= 0.85) isSolid[i] = 1;
        }
        const region = new Int16Array(gw * gh).fill(-1);
        let rid = 0;
        const bounds: { cx0: number; cx1: number; cy0: number; cy1: number }[] = [];
        for (let i = 0; i < gw * gh; i++) {
          if (!isSolid[i] || region[i] >= 0) continue;
          let cx0 = gw, cx1 = -1, cy0 = gh, cy1 = -1;
          const q = [i];
          region[i] = rid;
          while (q.length) {
            const c = q.pop()!;
            const cy = (c / gw) | 0;
            const cx = c % gw;
            if (cx < cx0) cx0 = cx;
            if (cx > cx1) cx1 = cx;
            if (cy < cy0) cy0 = cy;
            if (cy > cy1) cy1 = cy;
            const nb = [
              cy > 0 ? c - gw : -1,
              cy < gh - 1 ? c + gw : -1,
              cx > 0 ? c - 1 : -1,
              cx < gw - 1 ? c + 1 : -1
            ];
            for (const n of nb) {
              if (n >= 0 && isSolid[n] && region[n] < 0) {
                region[n] = rid;
                q.push(n);
              }
            }
          }
          bounds.push({ cx0, cx1, cy0, cy1 });
          rid++;
        }
        for (const b of bounds) {
          if (b.cx1 - b.cx0 + 1 >= 4 && b.cy1 - b.cy0 + 1 >= 4) {
            solidRects.push({
              x0: b.cx0 * cell,
              x1: Math.min(w - 1, (b.cx1 + 1) * cell),
              y0: b.cy0 * cell,
              y1: Math.min(h - 1, (b.cy1 + 1) * cell)
            });
          }
        }
      }

      // 5. Tighten each line horizontally. When a solid interior overlaps the
      // band's y-range, exclude its columns — the line splits at the intruder.
      return lines.flatMap((l) => {
        const bandY0 = l.startY;
        const bandY1 = l.startY + l.height;
        const blocks = solidRects.filter((r) => r.y0 < bandY1 && r.y1 > bandY0);

        const colHasText = new Uint8Array(w);
        for (let dy = 0; dy < l.height; dy++) {
          const y = l.startY + dy;
          const rowOffset = y * w;
          for (let x = 0; x < w; x++) {
            if (isTextPx(lumaAt(rowOffset + x))) colHasText[x] = 1;
          }
        }
        for (const r of blocks) {
          for (let x = r.x0; x <= r.x1 && x < w; x++) colHasText[x] = 0;
        }

        // Span of text-bearing columns; split only at intruder x-ranges so
        // natural inter-letter gaps never fragment the line.
        let minX = w;
        let maxX = -1;
        for (let x = 0; x < w; x++) {
          if (colHasText[x]) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
          }
        }
        let runs: { x0: number; x1: number }[];
        if (minX > maxX) {
          runs = [{ x0: 0, x1: w - 1 }];
        } else {
          runs = [{ x0: minX, x1: maxX }];
          for (const b of blocks) {
            const next: { x0: number; x1: number }[] = [];
            for (const r of runs) {
              if (b.x1 < r.x0 || b.x0 > r.x1) { next.push(r); continue; }
              if (b.x0 > r.x0) next.push({ x0: r.x0, x1: b.x0 - 1 });
              if (b.x1 < r.x1) next.push({ x0: b.x1 + 1, x1: r.x1 });
            }
            runs = next;
          }
          if (runs.length === 0) runs.push({ x0: 0, x1: w - 1 });
        }
        // No intruder and tightening collapses to a tiny speck (<14% width or <20px) ->
        // unreliable minority-class guess on art/stylized glyphs -> keep full width.
        if (blocks.length === 0 && runs.length === 1 &&
            runs[0].x1 - runs[0].x0 < Math.max(20, w * 0.14)) {
          runs[0] = { x0: 0, x1: w - 1 };
        }

        const padX = 7;
        const kept = runs.filter((r) => r.x1 - r.x0 >= 10);
        if (kept.length === 0) kept.push({ x0: 0, x1: w - 1 });
        const lineY0 = box.y + l.startY;
        return kept
          .map((r) => {
            let finalX0 = box.x + r.x0 - padX;
            if (finalX0 < box.x) {
              finalX0 = LineSegmenter.extendEdgeWithoutWall(
                ctx, box.x - 1, box.x - Math.max(0, finalX0), -1,
                lineY0, l.height, canvasW, canvasH, textIsDark
              );
            }
            let finalX1 = box.x + r.x1 + padX;
            if (finalX1 >= box.x + w) {
              finalX1 = LineSegmenter.extendEdgeWithoutWall(
                ctx, box.x + w, Math.min(canvasW - 1, finalX1) - (box.x + w) + 1, 1,
                lineY0, l.height, canvasW, canvasH, textIsDark
              );
            }
            const clamped = ImageUtils.clampBox(
              {
                x: finalX0,
                y: lineY0,
                width: finalX1 - finalX0 + 1,
                height: l.height,
                confidence: box.confidence
              },
              canvasW,
              canvasH
            );
            clamped.kind = box.kind;
            return clamped;
          });
      });
    } catch {
      return [box];
    }
  }

  private static otsuRange(hist: Int32Array, lo: number, hi: number): number {
    let tot = 0;
    let sumAll = 0;
    for (let t = lo; t <= hi; t++) {
      tot += hist[t];
      sumAll += t * hist[t];
    }
    if (tot === 0) return Math.round((lo + hi) * 0.5);
    let sumB = 0;
    let wB = 0;
    let maxVar = -1;
    let bestT = Math.round((lo + hi) * 0.5);
    for (let t = lo; t <= hi; t++) {
      wB += hist[t];
      if (wB === 0) continue;
      const wF = tot - wB;
      if (wF === 0) break;
      sumB += t * hist[t];
      const mB = sumB / wB;
      const mF = (sumAll - sumB) / wF;
      const v = wB * wF * (mB - mF) * (mB - mF);
      if (v > maxVar) { maxVar = v; bestT = t; }
    }
    return bestT;
  }

  private static histQuantile(hist: Int32Array, total: number, q: number): number {
    const target = Math.floor(Math.max(0, total - 1) * q);
    let seen = 0;
    for (let t = 0; t < 256; t++) {
      seen += hist[t];
      if (seen > target) return t;
    }
    return 255;
  }

  private static histRangeMedian(hist: Int32Array, lo: number, hi: number): number {
    let tot = 0;
    for (let t = lo; t <= hi; t++) tot += hist[t];
    if (tot === 0) return Math.round((lo + hi) * 0.5);
    const target = tot >> 1;
    let seen = 0;
    for (let t = lo; t <= hi; t++) {
      seen += hist[t];
      if (seen > target) return t;
    }
    return hi;
  }

  /**
   * Probes up to `steps` columns outward from `startOutsideX` in direction `dir` (-1 left, +1 right),
   * returning the farthest safe coordinate before any bubble wall column.
   */
  private static extendEdgeWithoutWall(
    ctx: OffscreenCanvasRenderingContext2D,
    startOutsideX: number,
    steps: number,
    dir: -1 | 1,
    y0: number,
    lh: number,
    canvasW: number,
    canvasH: number,
    textIsDark: boolean
  ): number {
    if (steps <= 0) return startOutsideX - dir;
    const minX = dir === -1 ? Math.max(0, startOutsideX - steps + 1) : startOutsideX;
    const maxX = dir === -1 ? startOutsideX : Math.min(canvasW - 1, startOutsideX + steps - 1);
    const probeW = maxX - minX + 1;
    if (probeW <= 0) return startOutsideX - dir;

    const py0 = Math.max(0, y0 - 3);
    const py1 = Math.min(canvasH - 1, y0 + lh + 2);
    const probeH = py1 - py0 + 1;
    const { data } = ctx.getImageData(minX, py0, probeW, probeH);

    const bandStart = y0 - py0;
    const bandEnd = Math.min(probeH, bandStart + lh);
    let bestX = startOutsideX - dir;
    for (let s = 0; s < steps; s++) {
      const x = startOutsideX + dir * s;
      if (x < 0 || x >= canvasW) break;
      const colX = x - minX;
      if (LineSegmenter.isWallColumn(data, probeW, probeH, colX, bandStart, bandEnd, textIsDark)) {
        break;
      }
      bestX = x;
    }
    return bestX;
  }

  private static isWallColumn(
    data: Uint8ClampedArray,
    probeW: number,
    probeH: number,
    colX: number,
    bandStart: number,
    bandEnd: number,
    textIsDark: boolean
  ): boolean {
    let bandHits = 0;
    let aboveHits = 0;
    let belowHits = 0;
    let totalHits = 0;
    for (let y = 0; y < probeH; y++) {
      const p = (y * probeW + colX) * 4;
      const l = (data[p] * 299 + data[p + 1] * 587 + data[p + 2] * 114) / 1000;
      const isWall = textIsDark ? l <= 125 : l >= 145;
      if (!isWall) continue;
      totalHits++;
      if (y < bandStart) aboveHits++;
      else if (y >= bandEnd) belowHits++;
      else bandHits++;
    }
    const bandFrac = bandHits / Math.max(1, bandEnd - bandStart);
    const totalFrac = totalHits / Math.max(1, probeH);
    return bandFrac >= 0.55 && ((aboveHits > 0 && belowHits > 0) || totalFrac >= 0.75);
  }
}
