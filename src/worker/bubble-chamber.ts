import { BoundingBox } from '../shared/types';

export interface ChamberResult {
  chamberBox: BoundingBox;
  isOval: boolean;
}

const INF_DIST = 1 << 20;

/**
 * BubbleChamberExtractor: Zero-model (0 MB) morphological speech-bubble chamber
 * detector. Flood-fills light or dark bubble paper from the OCR text box, fills
 * interior glyph holes, and applies a Chamfer 3-4 morphological opening to
 * sever narrow pointing tails while rejecting unbounded open panel backgrounds.
 */
export class BubbleChamberExtractor {
  public static extractChamber(
    img: { data: Uint8ClampedArray; width: number; height: number },
    cropOriginX: number,
    cropOriginY: number,
    textBox: BoundingBox
  ): ChamberResult | null {
    const { data, width: w, height: h } = img;
    const total = w * h;
    if (w < 20 || h < 20 || textBox.width < 8 || textBox.height < 8) return null;

    const tx0 = Math.max(0, Math.floor(textBox.x - cropOriginX));
    const ty0 = Math.max(0, Math.floor(textBox.y - cropOriginY));
    const tx1 = Math.min(w - 1, Math.ceil(textBox.x + textBox.width - cropOriginX) - 1);
    const ty1 = Math.min(h - 1, Math.ceil(textBox.y + textBox.height - cropOriginY) - 1);
    if (tx1 <= tx0 || ty1 <= ty0) return null;

    const lumas = new Uint8Array(total);
    for (let i = 0; i < total; i++) {
      const p = i * 4;
      lumas[i] = (data[p] * 77 + data[p + 1] * 150 + data[p + 2] * 29) >> 8;
    }

    // 1. 16-bin interior luma histogram to determine paper polarity
    const bins = new Int32Array(16);
    for (let y = ty0; y <= ty1; y++) {
      for (let x = tx0; x <= tx1; x++) {
        bins[lumas[y * w + x] >> 4]++;
      }
    }
    let peakBin = 0;
    for (let b = 1; b < 16; b++) {
      if (bins[b] > bins[peakBin]) peakBin = b;
    }
    if (peakBin > 5 && peakBin < 9) return null; // Mid-grey textured art, not a clean bubble

    const isDarkBubble = peakBin <= 5;
    const nearSamples: number[] = [];
    for (let y = ty0; y <= ty1; y++) {
      for (let x = tx0; x <= tx1; x++) {
        const l = lumas[y * w + x];
        if (Math.abs((l >> 4) - peakBin) <= 2) nearSamples.push(l);
      }
    }
    if (nearSamples.length < 8) return null;
    nearSamples.sort((a, b) => a - b);
    const medL = nearSamples[nearSamples.length >> 1];

    const paper = new Uint8Array(total);
    if (isDarkBubble) {
      const thresh = Math.min(105, medL + 40);
      for (let i = 0; i < total; i++) if (lumas[i] <= thresh) paper[i] = 1;
    } else {
      const thresh = Math.max(125, medL - 40);
      for (let i = 0; i < total; i++) if (lumas[i] >= thresh) paper[i] = 1;
    }

    // 2. 4-connected BFS flood from interior paper seeds
    const flood = new Uint8Array(total);
    const q = new Int32Array(total);
    let qh = 0, qt = 0;
    for (let y = ty0; y <= ty1; y++) {
      for (let x = tx0; x <= tx1; x++) {
        const i = y * w + x;
        if (paper[i] && !flood[i]) {
          flood[i] = 1;
          q[qt++] = i;
        }
      }
    }
    if (qt < 12) return null;

    let fx0 = w, fy0 = h, fx1 = 0, fy1 = 0, borderHits = 0;
    while (qh < qt) {
      const i = q[qh++];
      const x = i % w;
      const y = (i / w) | 0;
      if (x < fx0) fx0 = x;
      if (x > fx1) fx1 = x;
      if (y < fy0) fy0 = y;
      if (y > fy1) fy1 = y;
      if (x === 0 || x === w - 1 || y === 0 || y === h - 1) borderHits++;

      if (x > 0 && paper[i - 1] && !flood[i - 1]) { flood[i - 1] = 1; q[qt++] = i - 1; }
      if (x < w - 1 && paper[i + 1] && !flood[i + 1]) { flood[i + 1] = 1; q[qt++] = i + 1; }
      if (y > 0 && paper[i - w] && !flood[i - w]) { flood[i - w] = 1; q[qt++] = i - w; }
      if (y < h - 1 && paper[i + w] && !flood[i + w]) { flood[i + w] = 1; q[qt++] = i + w; }
    }

    // Leak guard: unbounded background touches a large share of crop perimeter
    const perimeter = 2 * (w + h);
    if (borderHits > perimeter * 0.35) return null;
    if (fx1 - fx0 + 1 >= w * 0.96 && fy1 - fy0 + 1 >= h * 0.96) return null;

    // 3. Fill interior glyph holes so erosion only shrinks from outer bubble border
    const outside = new Uint8Array(total);
    qh = 0; qt = 0;
    const seedOut = (i: number) => {
      if (!flood[i] && !outside[i]) { outside[i] = 1; q[qt++] = i; }
    };
    for (let x = 0; x < w; x++) { seedOut(x); seedOut((h - 1) * w + x); }
    for (let y = 0; y < h; y++) { seedOut(y * w); seedOut(y * w + w - 1); }
    while (qh < qt) {
      const i = q[qh++];
      const x = i % w;
      const y = (i / w) | 0;
      if (x > 0 && !flood[i - 1] && !outside[i - 1]) { outside[i - 1] = 1; q[qt++] = i - 1; }
      if (x < w - 1 && !flood[i + 1] && !outside[i + 1]) { outside[i + 1] = 1; q[qt++] = i + 1; }
      if (y > 0 && !flood[i - w] && !outside[i - w]) { outside[i - w] = 1; q[qt++] = i - w; }
      if (y < h - 1 && !flood[i + w] && !outside[i + w]) { outside[i + w] = 1; q[qt++] = i + w; }
    }

    const solid = new Uint8Array(total);
    for (let i = 0; i < total; i++) solid[i] = outside[i] ? 0 : 1;

    // 4. Chamfer 3-4 distance to !solid + morphological opening to sever tails
    const distToEdge = BubbleChamberExtractor.chamferDistance(solid, w, h, 0);
    const minSpan = Math.min(fx1 - fx0 + 1, fy1 - fy0 + 1);
    let erodeR = Math.max(6, Math.min(14, Math.round(minSpan * 0.11)));

    let core = BubbleChamberExtractor.extractSeededCore(distToEdge, erodeR * 3, tx0, ty0, tx1, ty1, w, h);
    if (!core && erodeR > 5) {
      erodeR = Math.max(4, erodeR >> 1);
      core = BubbleChamberExtractor.extractSeededCore(distToEdge, erodeR * 3, tx0, ty0, tx1, ty1, w, h);
    }
    if (!core) return null;

    const distFromCore = BubbleChamberExtractor.chamferDistance(core, w, h, 1);
    const dilateLimit = (erodeR + 1) * 3;

    let cx0 = w, cy0 = h, cx1 = 0, cy1 = 0, area = 0;
    for (let i = 0; i < total; i++) {
      if (!solid[i] || distFromCore[i] > dilateLimit) continue;
      const x = i % w;
      const y = (i / w) | 0;
      if (x < cx0) cx0 = x;
      if (x > cx1) cx1 = x;
      if (y < cy0) cy0 = y;
      if (y > cy1) cy1 = y;
      area++;
    }
    if (area < 64 || cx1 <= cx0 || cy1 <= cy0) return null;

    const cw = cx1 - cx0 + 1;
    const ch = cy1 - cy0 + 1;
    const fillRatio = area / (cw * ch);

    // Ensure textBox remains enclosed inside the discovered chamber bounds
    const outX0 = Math.min(cx0, tx0);
    const outY0 = Math.min(cy0, ty0);
    const outX1 = Math.max(cx1, tx1);
    const outY1 = Math.max(cy1, ty1);

    return {
      chamberBox: {
        x: cropOriginX + outX0,
        y: cropOriginY + outY0,
        width: outX1 - outX0 + 1,
        height: outY1 - outY0 + 1
      },
      isOval: fillRatio < 0.88
    };
  }

  /**
   * 2-pass Chamfer 3-4 distance transform to pixels matching `zeroTarget` (`0` or `1`).
   */
  private static chamferDistance(
    mask: Uint8Array,
    w: number,
    h: number,
    zeroTarget: 0 | 1
  ): Int32Array {
    const total = w * h;
    const d = new Int32Array(total);
    for (let i = 0; i < total; i++) {
      d[i] = mask[i] === zeroTarget ? 0 : INF_DIST;
    }

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        let best = d[i];
        if (x > 0 && d[i - 1] + 3 < best) best = d[i - 1] + 3;
        if (y > 0) {
          if (d[i - w] + 3 < best) best = d[i - w] + 3;
          if (x > 0 && d[i - w - 1] + 4 < best) best = d[i - w - 1] + 4;
          if (x < w - 1 && d[i - w + 1] + 4 < best) best = d[i - w + 1] + 4;
        }
        d[i] = best;
      }
    }

    for (let y = h - 1; y >= 0; y--) {
      for (let x = w - 1; x >= 0; x--) {
        const i = y * w + x;
        let best = d[i];
        if (x < w - 1 && d[i + 1] + 3 < best) best = d[i + 1] + 3;
        if (y < h - 1) {
          if (d[i + w] + 3 < best) best = d[i + w] + 3;
          if (x < w - 1 && d[i + w + 1] + 4 < best) best = d[i + w + 1] + 4;
          if (x > 0 && d[i + w - 1] + 4 < best) best = d[i + w - 1] + 4;
        }
        d[i] = best;
      }
    }
    return d;
  }

  private static extractSeededCore(
    dist: Int32Array,
    thresh: number,
    tx0: number,
    ty0: number,
    tx1: number,
    ty1: number,
    w: number,
    h: number
  ): Uint8Array | null {
    const total = w * h;
    const core = new Uint8Array(total);
    const q = new Int32Array(total);
    let qh = 0, qt = 0;

    for (let y = ty0; y <= ty1; y++) {
      for (let x = tx0; x <= tx1; x++) {
        const i = y * w + x;
        if (dist[i] >= thresh && !core[i]) {
          core[i] = 1;
          q[qt++] = i;
        }
      }
    }
    if (qt === 0) return null;

    while (qh < qt) {
      const i = q[qh++];
      const x = i % w;
      const y = (i / w) | 0;
      if (x > 0 && dist[i - 1] >= thresh && !core[i - 1]) { core[i - 1] = 1; q[qt++] = i - 1; }
      if (x < w - 1 && dist[i + 1] >= thresh && !core[i + 1]) { core[i + 1] = 1; q[qt++] = i + 1; }
      if (y > 0 && dist[i - w] >= thresh && !core[i - w]) { core[i - w] = 1; q[qt++] = i - w; }
      if (y < h - 1 && dist[i + w] >= thresh && !core[i + w]) { core[i + w] = 1; q[qt++] = i + w; }
    }
    return core;
  }
}
