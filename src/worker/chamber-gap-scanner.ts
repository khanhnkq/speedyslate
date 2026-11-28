import { BoundingBox } from '../shared/types';

/**
 * ChamberGapScanner: Recovers unread text lines sitting inside the same enclosed
 * speech-bubble chamber above or below already-detected lines (e.g. tiny words
 * tucked into a top spike like "Don't", or lines touching narrow side borders
 * like "breathing / is ragged." that general scene-text DBNet misses).
 */
export class ChamberGapScanner {
  public static recoverMissedLines(
    img: { data: Uint8ClampedArray; width: number; height: number },
    existingBoxes: BoundingBox[]
  ): BoundingBox[] {
    const { data, width: w, height: h } = img;
    if (existingBoxes.length === 0 || w < 24 || h < 24) return [];

    const lumas = new Uint8Array(w * h);
    for (let i = 0; i < w * h; i++) {
      const p = i * 4;
      lumas[i] = (data[p] * 77 + data[p + 1] * 150 + data[p + 2] * 29) >> 8;
    }

    const clusters = this.clusterVerticalStacks(existingBoxes);
    const recovered: BoundingBox[] = [];

    for (const cluster of clusters) {
      const gx0 = Math.max(0, Math.min(...cluster.map((b) => b.x)));
      const gy0 = Math.max(0, Math.min(...cluster.map((b) => b.y)));
      const gx1 = Math.min(w - 1, Math.max(...cluster.map((b) => b.x + b.width - 1)));
      const gy1 = Math.min(h - 1, Math.max(...cluster.map((b) => b.y + b.height - 1)));
      if (gx1 - gx0 < 14 || gy1 - gy0 < 10) continue;

      const avgH =
        cluster.reduce((s, b) => s + b.height, 0) / Math.max(1, cluster.length);
      if (avgH > 65) continue; // skip giant SFX/titles

      // 1. Sample paper luma inside the known text cluster
      const samples: number[] = [];
      for (let y = gy0; y <= gy1; y += 2) {
        for (let x = gx0; x <= gx1; x += 2) {
          samples.push(lumas[y * w + x]);
        }
      }
      if (samples.length < 12) continue;
      samples.sort((a, b) => a - b);
      // 70th percentile for light bubbles (since 20-35% of cluster pixels are dark ink)
      const p70 = samples[Math.floor(samples.length * 0.7)];
      const p30 = samples[Math.floor(samples.length * 0.3)];
      let med: number;
      if (p70 >= 215) med = p70;
      else if (p30 <= 45) med = p30;
      else continue; // textured background, not a clean speech bubble

      const padX = Math.max(48, Math.min(200, Math.round(Math.max(gx1 - gx0, avgH * 4) * 0.75)));
      const sx0 = Math.max(0, gx0 - padX);
      const sx1 = Math.min(w - 1, gx1 + padX);
      const sy0 = Math.max(0, Math.round(gy0 - Math.min(90, Math.max(46, avgH * 3.5))));
      const sy1 = Math.min(h - 1, Math.round(gy1 + Math.min(125, Math.max(65, avgH * 4.8))));
      const sw = sx1 - sx0 + 1;
      const sh = sy1 - sy0 + 1;
      if (sw < 16 || sh < 24) continue;

      // 2. Flood-fill bubble paper strictly inside [sx0..sx1, sy0..sy1]
      const paper = new Uint8Array(sw * sh);
      const q = new Int32Array(sw * sh);
      let qh = 0;
      let qt = 0;
      const isPaperLuma = (l: number) => Math.abs(l - med) <= 28;

      for (const b of cluster) {
        const bx0 = Math.max(sx0, Math.floor(b.x));
        const by0 = Math.max(sy0, Math.floor(b.y));
        const bx1 = Math.min(sx1, Math.ceil(b.x + b.width) - 1);
        const by1 = Math.min(sy1, Math.ceil(b.y + b.height) - 1);
        for (let y = by0; y <= by1; y++) {
          for (let x = bx0; x <= bx1; x++) {
            if (!isPaperLuma(lumas[y * w + x])) continue;
            const li = (y - sy0) * sw + (x - sx0);
            if (!paper[li]) {
              paper[li] = 1;
              q[qt++] = li;
            }
          }
        }
      }
      if (qt < 20) continue;

      let sideLeaks = 0;
      while (qh < qt) {
        const li = q[qh++];
        const lx = li % sw;
        const ly = (li / sw) | 0;
        if (lx === 0 || lx === sw - 1) sideLeaks++;

        const gx = sx0 + lx;
        const gy = sy0 + ly;
        if (lx > 0 && !paper[li - 1] && isPaperLuma(lumas[gy * w + gx - 1])) {
          paper[li - 1] = 1;
          q[qt++] = li - 1;
        }
        if (lx < sw - 1 && !paper[li + 1] && isPaperLuma(lumas[gy * w + gx + 1])) {
          paper[li + 1] = 1;
          q[qt++] = li + 1;
        }
        if (ly > 0 && !paper[li - sw] && isPaperLuma(lumas[(gy - 1) * w + gx])) {
          paper[li - sw] = 1;
          q[qt++] = li - sw;
        }
        if (ly < sh - 1 && !paper[li + sw] && isPaperLuma(lumas[(gy + 1) * w + gx])) {
          paper[li + sw] = 1;
          q[qt++] = li + sw;
        }
      }

      // Reject if flood leaked out sideways across both left/right search caps (open background)
      if (sideLeaks > sh * 0.45) continue;

      // 3. Compute chamber horizontal span [rowLeft..rowRight] per local row
      // (smoothed over +-4 rows so a text line spanning edge-to-edge still inherits paper width)
      const rawL = new Int16Array(sh).fill(sw);
      const rawR = new Int16Array(sh).fill(-1);
      for (let ly = 0; ly < sh; ly++) {
        const off = ly * sw;
        for (let lx = 0; lx < sw; lx++) {
          if (paper[off + lx]) {
            if (lx < rawL[ly]) rawL[ly] = lx;
            if (lx > rawR[ly]) rawR[ly] = lx;
          }
        }
      }

      const rowInk = new Int16Array(sh);
      const rowSpan = new Int16Array(sh);
      const isCoveredRow = (gy: number) =>
        existingBoxes.some(
          (b) =>
            gy >= b.y - 2 &&
            gy <= b.y + b.height + 2 &&
            b.x < sx1 &&
            b.x + b.width > sx0
        );

      for (let ly = 0; ly < sh; ly++) {
        const gy = sy0 + ly;
        if (isCoveredRow(gy)) continue;
        let minL = sw;
        let maxR = -1;
        for (let dy = -5; dy <= 5; dy++) {
          const ny = ly + dy;
          if (ny >= 0 && ny < sh && rawR[ny] >= rawL[ny]) {
            if (rawL[ny] < minL) minL = rawL[ny];
            if (rawR[ny] > maxR) maxR = rawR[ny];
          }
        }
        // Inset 2px from chamber left/right walls to ignore vertical bubble outline strokes
        const ix0 = minL + 2;
        const ix1 = maxR - 2;
        if (ix1 - ix0 < 8) continue;
        rowSpan[ly] = ix1 - ix0 + 1;

        let cnt = 0;
        for (let lx = ix0; lx <= ix1; lx++) {
          if (Math.abs(lumas[gy * w + (sx0 + lx)] - med) > 55) cnt++;
        }
        rowInk[ly] = cnt;
      }

      // 4. Extract contiguous horizontal ink bands in uncovered top/bottom chamber zones
      let bandStart = -1;
      for (let ly = 0; ly <= sh; ly++) {
        const span = ly < sh ? rowSpan[ly] : 0;
        const ink = ly < sh ? rowInk[ly] : 0;
        const active = span >= 8 && ink >= Math.max(2, Math.round(span * 0.04)) && ink <= span * 0.90;

        if (active && bandStart < 0) {
          bandStart = ly;
        } else if (!active && bandStart >= 0) {
          const bandH = ly - bandStart;
          if (bandH >= 8 && bandH <= Math.max(30, avgH * 1.85)) {
            const box = this.buildBandBox(
              lumas, w, h, sx0, sy0, bandStart, ly - 1, rawL, rawR, sh, sw, med
            );
            if (
              box &&
              !existingBoxes.some((eb) => this.overlapRatio(eb, box) > 0.2) &&
              !recovered.some((rb) => this.overlapRatio(rb, box) > 0.2)
            ) {
              recovered.push(box);
            }
          }
          bandStart = -1;
        }
      }
    }

    return recovered;
  }

  private static buildBandBox(
    lumas: Uint8Array,
    w: number,
    h: number,
    sx0: number,
    sy0: number,
    ly0: number,
    ly1: number,
    rawL: Int16Array,
    rawR: Int16Array,
    sh: number,
    sw: number,
    med: number
  ): BoundingBox | null {
    let minL = sw;
    let maxR = -1;
    for (let ny = Math.max(0, ly0 - 5); ny <= Math.min(sh - 1, ly1 + 5); ny++) {
      if (rawR[ny] >= rawL[ny]) {
        if (rawL[ny] < minL) minL = rawL[ny];
        if (rawR[ny] > maxR) maxR = rawR[ny];
      }
    }
    const ix0 = minL + 2;
    const ix1 = maxR - 2;
    if (ix1 - ix0 < 10) return null;

    let inkMinX = sw;
    let inkMaxX = -1;
    let totalInk = 0;
    for (let ly = ly0; ly <= ly1; ly++) {
      const gy = sy0 + ly;
      for (let lx = ix0; lx <= ix1; lx++) {
        if (Math.abs(lumas[gy * w + (sx0 + lx)] - med) > 60) {
          if (lx < inkMinX) inkMinX = lx;
          if (lx > inkMaxX) inkMaxX = lx;
          totalInk++;
        }
      }
    }
    if (inkMaxX - inkMinX < 6 || totalInk < 8) return null;
    if (this.isStarburstRimBand(lumas, w, h, sx0, sy0, ly0, ly1, ix0, ix1, med)) {
      return null;
    }

    const x = Math.max(0, sx0 + inkMinX - 4);
    const y = Math.max(0, sy0 + ly0 - 1);
    const right = Math.min(w, sx0 + inkMaxX + 5);
    const bottom = Math.min(h, sy0 + ly1 + 2);
    return {
      x,
      y,
      width: right - x,
      height: bottom - y,
      confidence: 0.75,
      kind: 'dialogue'
    };
  }

  /**
   * Rejects radial starburst/border spike rims (e.g. thick serrated burst lines
   * attached directly to the outer dark ring, ramping in density toward the wall).
   */
  private static isStarburstRimBand(
    lumas: Uint8Array,
    w: number,
    h: number,
    sx0: number,
    sy0: number,
    ly0: number,
    ly1: number,
    ix0: number,
    ix1: number,
    med: number
  ): boolean {
    const x0 = sx0 + ix0;
    const x1 = sx0 + ix1;
    const span = Math.max(1, x1 - x0 + 1);
    const bandH = ly1 - ly0 + 1;
    if (bandH < 4) return false;

    const midLy = (ly0 + ly1) * 0.5;
    for (const checkBottom of [false, true]) {
      const gyEdge = sy0 + (checkBottom ? ly1 : ly0);
      const gyOut = gyEdge + (checkBottom ? 1 : -1);
      if (gyOut < 0 || gyOut >= h) continue;

      let outDark = 0;
      let edgeInk = 0;
      let connToWall = 0;
      for (let gx = x0; gx <= x1; gx++) {
        const isOutDark = Math.abs(lumas[gyOut * w + gx] - med) > 55;
        if (isOutDark) outDark++;
        if (Math.abs(lumas[gyEdge * w + gx] - med) > 55) {
          edgeInk++;
          if (isOutDark) connToWall++;
        }
      }
      if (edgeInk === 0 || outDark / span < 0.35 || connToWall / edgeInk < 0.60) continue;

      let innerInk = 0;
      let outerInk = 0;
      let maxTrans = 0;
      for (let ly = ly0; ly <= ly1; ly++) {
        const gy = sy0 + ly;
        let rowInk = 0;
        let trans = 0;
        let prevInk = false;
        for (let gx = x0; gx <= x1; gx++) {
          const isInk = Math.abs(lumas[gy * w + gx] - med) > 55;
          if (isInk) rowInk++;
          if (gx > x0 && isInk !== prevInk) trans++;
          prevInk = isInk;
        }
        const inOuterHalf = checkBottom ? ly >= midLy : ly <= midLy;
        if (inOuterHalf) {
          outerInk += rowInk;
          if (trans > maxTrans) maxTrans = trans;
        } else {
          innerInk += rowInk;
        }
      }
      if (edgeInk / span >= 0.30 || (maxTrans >= 12 && outerInk >= innerInk * 1.5)) {
        return true;
      }
    }
    return false;
  }

  private static clusterVerticalStacks(boxes: BoundingBox[]): BoundingBox[][] {
    const sorted = boxes
      .filter((b) => b.kind !== 'sfx')
      .sort((a, b) => a.y - b.y);
    const used = new Set<number>();
    const out: BoundingBox[][] = [];

    for (let i = 0; i < sorted.length; i++) {
      if (used.has(i)) continue;
      const group = [sorted[i]];
      used.add(i);
      let changed = true;
      while (changed) {
        changed = false;
        const last = group[group.length - 1];
        const lastCx = last.x + last.width * 0.5;
        for (let j = 0; j < sorted.length; j++) {
          if (used.has(j)) continue;
          const cand = sorted[j];
          const gapY = cand.y - (last.y + last.height);
          const maxH = Math.max(last.height, cand.height);
          if (gapY < -last.height * 0.5 || gapY > maxH * 3.6) continue;
          const overlapX = Math.max(
            0,
            Math.min(last.x + last.width, cand.x + cand.width) - Math.max(last.x, cand.x)
          );
          const minW = Math.max(1, Math.min(last.width, cand.width));
          const maxW = Math.max(1, Math.max(last.width, cand.width));
          const candCx = cand.x + cand.width * 0.5;
          if (overlapX / minW >= 0.25 || Math.abs(lastCx - candCx) / maxW <= 0.45) {
            group.push(cand);
            used.add(j);
            changed = true;
            break;
          }
        }
      }
      out.push(group);
    }
    return out;
  }

  private static overlapRatio(a: BoundingBox, b: BoundingBox): number {
    const ix = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
    const iy = Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
    const inter = ix * iy;
    if (inter <= 0) return 0;
    return inter / Math.max(1, Math.min(a.width * a.height, b.width * b.height));
  }
}
