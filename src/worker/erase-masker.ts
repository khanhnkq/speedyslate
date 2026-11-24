import { ErasePatch } from '../shared/types';
import { filterMask } from './erase-mask-utils';
import { InpaintSolver } from './inpaint-solver';
import { PolygonDeskew } from './polygon-deskew';

export interface ErasePatchDbg extends ErasePatch {
  dbg?: { path: string; risky?: number; std?: number; guided?: boolean; tmMax?: number };
}

export interface InnerTextRect {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

/**
 * EraseMasker: Clean-room stroke-level text eraser combining localized Otsu
 * binarization inside the text bounding region, border-stroke exclusion,
 * circular disk halo dilation (3..5px to swallow anti-aliased fringes and
 * artist outlines), and Telea Fast Marching Method (FMM) inpainting.
 */
export class EraseMasker {
  public static buildPatch(
    img: ImageData,
    x: number,
    y: number,
    bgHex?: string,
    textMap?: Float32Array,
    textMapW?: number,
    localQuad?: [number, number][],
    innerRect?: InnerTextRect
  ): ErasePatchDbg | null {
    const w = img.width;
    const h = img.height;
    const total = w * h;
    if (total < 16) return null;
    const data = img.data;

    // 1. Luminance buffer & Otsu threshold computed strictly over the inner text box
    const lumas = new Uint8Array(total);
    for (let i = 0; i < total; i++) {
      const p = i * 4;
      lumas[i] = ((data[p] * 299 + data[p + 1] * 587 + data[p + 2] * 114) / 1000) | 0;
    }

    const rx0 = innerRect ? Math.max(0, Math.min(w - 1, innerRect.x0)) : 0;
    const ry0 = innerRect ? Math.max(0, Math.min(h - 1, innerRect.y0)) : 0;
    const rx1 = innerRect ? Math.max(rx0 + 1, Math.min(w, innerRect.x1)) : w;
    const ry1 = innerRect ? Math.max(ry0 + 1, Math.min(h, innerRect.y1)) : h;
    const boxH = Math.max(8, ry1 - ry0);

    const hist = new Int32Array(256);
    let boxTotal = 0;
    for (let yy = ry0; yy < ry1; yy++) {
      for (let xx = rx0; xx < rx1; xx++) {
        hist[lumas[yy * w + xx]]++;
        boxTotal++;
      }
    }
    if (boxTotal < 8) return null;

    let sumAll = 0;
    for (let t = 0; t < 256; t++) sumAll += t * hist[t];
    let sumB = 0;
    let wB = 0;
    let maxVar = -1;
    let otsuT = 128;
    for (let t = 0; t < 256; t++) {
      wB += hist[t];
      if (wB === 0) continue;
      const wF = boxTotal - wB;
      if (wF === 0) break;
      sumB += t * hist[t];
      const mB = sumB / wB;
      const mF = (sumAll - sumB) / wF;
      const v = wB * wF * (mB - mF) * (mB - mF);
      if (v > maxVar) {
        maxVar = v;
        otsuT = t;
      }
    }

    // 2. Determine text region (`inside`) and background polarity
    const tm = new Float32Array(total);
    let tmMax = 0;
    let mapCoverage = 0;
    if (textMap && textMapW) {
      for (let i = 0; i < total; i++) {
        const gy = y + ((i / w) | 0);
        const gx = x + (i % w);
        const v = textMap[gy * textMapW + gx] || 0;
        tm[i] = v;
        if (v > tmMax) tmMax = v;
        if (v > 0.25) mapCoverage++;
      }
    }
    const guidedActive = mapCoverage > total * 0.01;

    const inside = new Uint8Array(total);
    if (innerRect) {
      // Inner text box is explicitly known (crop has +12px clean context padding):
      // cover the full inner text box so word-end letters missed by shrunk DBNet
      // centerlines are NEVER left behind!
      for (let yy = ry0; yy < ry1; yy++) {
        inside.fill(1, yy * w + rx0, yy * w + rx1);
      }
    } else if (guidedActive) {
      const mapExpand = Math.max(4, Math.min(10, Math.round(h * 0.16)));
      for (let i = 0; i < total; i++) inside[i] = tm[i] > 0.10 ? 1 : 0;
      EraseMasker.dilateBox(inside, w, h, mapExpand);
    } else {
      inside.fill(1);
    }

    if (localQuad && localQuad.length === 4) {
      for (let i = 0; i < total; i++) {
        if (!PolygonDeskew.pointInQuad(i % w, (i / w) | 0, localQuad)) {
          inside[i] = 0;
        }
      }
    }

    // Sample local background luma from surround / inner border
    const bgRgb = EraseMasker.hexToRgb(bgHex);
    const bgSamples: number[] = [];
    for (let yy = ry0; yy < ry1; yy++) {
      for (let xx = rx0; xx < rx1; xx++) {
        if (yy === ry0 || yy === ry1 - 1 || xx === rx0 || xx === rx1 - 1) {
          bgSamples.push(lumas[yy * w + xx]);
        }
      }
    }
    if (innerRect) {
      for (let i = 0; i < total; i++) {
        if (!inside[i]) bgSamples.push(lumas[i]);
      }
    }
    bgSamples.sort((a, b) => a - b);
    const localBg = bgSamples.length > 8
      ? bgSamples[(bgSamples.length * 0.6) | 0]
      : bgRgb
        ? (bgRgb[0] * 299 + bgRgb[1] * 587 + bgRgb[2] * 114) / 1000
        : 240;
    const isBgLight = localBg > 127;

    // 3. Identify continuous bubble/panel border strokes connected to the outer crop boundary
    // (where `tm < 0.25`) so borders entering from outside are NEVER erased!
    const borderShield = EraseMasker.detectOuterBorderStrokes(lumas, tm, localBg, w, h, innerRect);

    // 4. Extract raw glyph strokes strictly inside `inside` and outside `borderShield`
    const raw = new Uint8Array(total);
    for (let i = 0; i < total; i++) {
      if (!inside[i] || borderShield[i]) continue;
      const l = lumas[i];
      const byOtsu = isBgLight ? l <= Math.max(otsuT, localBg - 28) : l >= Math.min(otsuT, localBg + 28);
      const byDev = Math.abs(l - localBg) > 26;
      if (byOtsu || byDev) raw[i] = 1;
    }

    const mask = filterMask(raw, w, h, total, true) ?? (EraseMasker.hasAny(raw) ? raw : null);
    if (!mask) return null;

    // 5. Circular disk dilation (radius 3..5px) swallows 100% of anti-aliased grey
    // fringes AND artist white/black halos (`fuchidori`), blocked by `borderShield`
    const dilRadius = Math.max(3, InpaintSolver.computeDilationRadius(boxH));
    const dil = EraseMasker.dilateDisk(mask, w, h, dilRadius);
    for (let i = 0; i < total; i++) {
      if (borderShield[i]) dil[i] = 0;
    }
    if (!EraseMasker.hasAny(dil)) return null;

    // 6. Check immediate surround ring (`dil + 3px`) for uniform flat paper:
    // on clean bubble paper (`stddev < 14`), flat median paper fill is 100% spotless;
    // on textured screentone/gradients, Telea FMM (`radius = 4`) diffuses seamlessly!
    const ringOuter = EraseMasker.dilateDisk(dil, w, h, 3);
    const ringL: number[] = [];
    for (let i = 0; i < total; i++) {
      if (ringOuter[i] && !dil[i] && !borderShield[i]) ringL.push(lumas[i]);
    }
    if (ringL.length >= 16) {
      ringL.sort((a, b) => a - b);
      const med = ringL[(ringL.length / 2) | 0];
      let nS = 0, accR = 0, accG = 0, accB = 0, sumL = 0, sumSq = 0;
      for (let i = 0; i < total; i++) {
        if (!ringOuter[i] || dil[i] || borderShield[i] || Math.abs(lumas[i] - med) > 25) continue;
        const p = i * 4;
        accR += data[p]; accG += data[p + 1]; accB += data[p + 2];
        sumL += lumas[i]; sumSq += lumas[i] * lumas[i];
        nS++;
      }
      if (nS >= 16) {
        const mean = sumL / nS;
        const stddev = Math.sqrt(Math.max(0, sumSq / nS - mean * mean));
        if (stddev < 14 && nS >= ringL.length * 0.72) {
          const out = new Uint8ClampedArray(total * 4);
          const r = accR / nS, g = accG / nS, b = accB / nS;
          for (let i = 0; i < total; i++) {
            if (!dil[i]) continue;
            const p = i * 4;
            out[p] = r; out[p + 1] = g; out[p + 2] = b; out[p + 3] = 255;
          }
          return { x, y, width: w, height: h, pixels: out, dbg: { path: 'flat', std: stddev, guided: guidedActive, tmMax } };
        }
      }
    }

    const inpainted = InpaintSolver.teleaInpaint(data, dil, dil, w, h, 4);
    return {
      x,
      y,
      width: w,
      height: h,
      pixels: inpainted,
      dbg: { path: 'telea', guided: guidedActive, tmMax }
    };
  }

  /**
   * Detects bubble/panel outline strokes connected to the outer crop boundary
   * where DBNet probability is absent (`tm < 0.25`), stopping 2px inside `innerRect`
   * so glyphs touching the border are still erased cleanly while the border line stays intact.
   */
  private static detectOuterBorderStrokes(
    lumas: Uint8Array,
    tm: Float32Array,
    localBg: number,
    w: number,
    h: number,
    innerRect?: InnerTextRect
  ): Uint8Array {
    const total = w * h;
    const shield = new Uint8Array(total);
    const q = new Int32Array(total);
    let qh = 0, qt = 0;

    // When `innerRect` is known, identify which columns `x` actually carry a
    // border stroke in the clean top/bottom context margin outside the text line;
    // inside `innerRect`, `shield` may only stay within +-3px of those border
    // columns so letters like 'me,' touching the wall are never shielded!
    const borderColAllowed = new Uint8Array(w);
    if (innerRect) {
      for (let xx = 0; xx < w; xx++) {
        let marginDark = false;
        for (let yy = 0; yy < innerRect.y0 && !marginDark; yy++) {
          if (Math.abs(lumas[yy * w + xx] - localBg) > 55) marginDark = true;
        }
        for (let yy = innerRect.y1; yy < h && !marginDark; yy++) {
          if (Math.abs(lumas[yy * w + xx] - localBg) > 55) marginDark = true;
        }
        if (marginDark) {
          for (let dx = -3; dx <= 3; dx++) {
            if (xx + dx >= 0 && xx + dx < w) borderColAllowed[xx + dx] = 1;
          }
        }
      }
    } else {
      borderColAllowed.fill(1);
    }

    const canConduct = (idx: number): boolean => {
      if (!innerRect && tm[idx] >= 0.25) return false;
      if (Math.abs(lumas[idx] - localBg) <= 55) return false;
      if (innerRect) {
        const xx = idx % w;
        const yy = (idx / w) | 0;
        if (yy >= innerRect.y0 && yy < innerRect.y1 && !borderColAllowed[xx]) {
          return false;
        }
        if (
          xx >= innerRect.x0 + 4 &&
          xx < innerRect.x1 - 4 &&
          yy >= innerRect.y0 + 2 &&
          yy < innerRect.y1 - 2
        ) {
          return false;
        }
      }
      return true;
    };

    const seed = (idx: number) => {
      if (!shield[idx] && canConduct(idx)) {
        shield[idx] = 1;
        q[qt++] = idx;
      }
    };
    for (let xx = 0; xx < w; xx++) { seed(xx); seed((h - 1) * w + xx); }
    for (let yy = 0; yy < h; yy++) { seed(yy * w); seed(yy * w + w - 1); }

    while (qh < qt) {
      const idx = q[qh++];
      const xx = idx % w;
      const yy = (idx / w) | 0;
      if (xx > 0) seed(idx - 1);
      if (xx < w - 1) seed(idx + 1);
      if (yy > 0) seed(idx - w);
      if (yy < h - 1) seed(idx + w);
    }
    return shield;
  }

  private static dilateDisk(src: Uint8Array, w: number, h: number, radius: number): Uint8Array {
    const out = new Uint8Array(w * h);
    const r2 = radius * radius;
    for (let yy = 0; yy < h; yy++) {
      for (let xx = 0; xx < w; xx++) {
        if (!src[yy * w + xx]) continue;
        const y0 = Math.max(0, yy - radius);
        const y1 = Math.min(h - 1, yy + radius);
        const x0 = Math.max(0, xx - radius);
        const x1 = Math.min(w - 1, xx + radius);
        for (let ny = y0; ny <= y1; ny++) {
          const dy = ny - yy;
          for (let nx = x0; nx <= x1; nx++) {
            const dx = nx - xx;
            if (dx * dx + dy * dy <= r2) out[ny * w + nx] = 1;
          }
        }
      }
    }
    return out;
  }

  private static dilateBox(buf: Uint8Array, w: number, h: number, iters: number): void {
    for (let it = 0; it < iters; it++) {
      const prev = buf.slice();
      for (let yy = 0; yy < h; yy++) {
        for (let xx = 0; xx < w; xx++) {
          const i = yy * w + xx;
          if (prev[i]) continue;
          if (
            (xx > 0 && prev[i - 1]) ||
            (xx < w - 1 && prev[i + 1]) ||
            (yy > 0 && prev[i - w]) ||
            (yy < h - 1 && prev[i + w])
          ) {
            buf[i] = 1;
          }
        }
      }
    }
  }

  private static hasAny(buf: Uint8Array): boolean {
    for (let i = 0; i < buf.length; i++) if (buf[i]) return true;
    return false;
  }

  private static hexToRgb(hex?: string): [number, number, number] | null {
    if (!hex || !/^#[0-9a-fA-F]{6}$/.test(hex)) return null;
    return [
      parseInt(hex.slice(1, 3), 16),
      parseInt(hex.slice(3, 5), 16),
      parseInt(hex.slice(5, 7), 16)
    ];
  }
}
