const KNOWN = 0;
const BAND = 1;
const INSIDE = 2;
const INF_T = 1e6;
const EPS = 1e-6;

class FlatMinHeap {
  private keys: Float32Array;
  private idxs: Int32Array;
  public size = 0;

  constructor(cap: number) {
    const c = Math.max(32, cap);
    this.keys = new Float32Array(c);
    this.idxs = new Int32Array(c);
  }

  public push(key: number, idx: number): void {
    if (this.size >= this.keys.length) {
      const next = this.keys.length * 2;
      const nk = new Float32Array(next);
      const ni = new Int32Array(next);
      nk.set(this.keys);
      ni.set(this.idxs);
      this.keys = nk;
      this.idxs = ni;
    }
    let i = this.size++;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.keys[p] <= key) break;
      this.keys[i] = this.keys[p];
      this.idxs[i] = this.idxs[p];
      i = p;
    }
    this.keys[i] = key;
    this.idxs[i] = idx;
  }

  public pop(): number {
    if (this.size === 0) return -1;
    const top = this.idxs[0];
    const lastK = this.keys[--this.size];
    const lastI = this.idxs[this.size];
    if (this.size > 0) {
      let i = 0;
      const half = this.size >> 1;
      while (i < half) {
        let c = (i << 1) + 1;
        const r = c + 1;
        if (r < this.size && this.keys[r] < this.keys[c]) c = r;
        if (lastK <= this.keys[c]) break;
        this.keys[i] = this.keys[c];
        this.idxs[i] = this.idxs[c];
        i = c;
      }
      this.keys[i] = lastK;
      this.idxs[i] = lastI;
    }
    return top;
  }
}

function solveQuadrant(
  i1: number,
  valid1: boolean,
  i2: number,
  valid2: boolean,
  flag: Uint8Array,
  T: Float32Array
): number {
  const k1 = valid1 && flag[i1] === KNOWN;
  const k2 = valid2 && flag[i2] === KNOWN;
  if (k1 && k2) {
    const t1 = T[i1];
    const t2 = T[i2];
    const d = t1 - t2;
    const disc = 2 - d * d;
    if (disc >= 0) {
      const s = (t1 + t2 + Math.sqrt(disc)) * 0.5;
      if (s >= t1 && s >= t2) return s;
    }
    return Math.min(t1, t2) + 1;
  }
  if (k1) return T[i1] + 1;
  if (k2) return T[i2] + 1;
  return INF_T;
}

/**
 * InpaintSolver: Clean-room implementation of Alexandru Telea's (2004)
 * Fast Marching Method (FMM) solving the Eikonal PDE |grad T| = 1 with
 * directional, geometric-distance, and level-set gradient propagation.
 */
export class InpaintSolver {
  public static computeDilationRadius(cropHeight: number): number {
    return Math.max(2, Math.min(5, Math.round(cropHeight * 0.1)));
  }

  public static diffuseMaskedRegion(
    data: Uint8ClampedArray,
    dilMask: Uint8Array,
    emitMask: Uint8Array,
    w: number,
    h: number
  ): Uint8ClampedArray {
    return InpaintSolver.teleaInpaint(data, dilMask, emitMask, w, h, 3);
  }

  public static teleaInpaint(
    data: Uint8ClampedArray,
    mask: Uint8Array,
    emitMask: Uint8Array,
    w: number,
    h: number,
    radius: number = 3
  ): Uint8ClampedArray {
    const total = w * h;
    const rgb = new Float32Array(total * 3);
    const flag = new Uint8Array(total);
    const T = new Float32Array(total);
    const heap = new FlatMinHeap(total >> 2);

    for (let i = 0; i < total; i++) {
      const p = i * 4;
      rgb[i * 3] = data[p];
      rgb[i * 3 + 1] = data[p + 1];
      rgb[i * 3 + 2] = data[p + 2];
      if (mask[i]) {
        flag[i] = INSIDE;
        T[i] = INF_T;
      } else {
        flag[i] = KNOWN;
        T[i] = 0;
      }
    }

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        if (flag[i] !== INSIDE) continue;
        const hasKnownNeighbor =
          (x > 0 && flag[i - 1] === KNOWN) ||
          (x < w - 1 && flag[i + 1] === KNOWN) ||
          (y > 0 && flag[i - w] === KNOWN) ||
          (y < h - 1 && flag[i + w] === KNOWN);
        if (hasKnownNeighbor) {
          flag[i] = BAND;
          T[i] = 1;
          InpaintSolver.inpaintPixel(i, x, y, w, h, radius, flag, T, rgb);
          heap.push(1, i);
        }
      }
    }

    const dirs = [-1, 1, -w, w];
    while (heap.size > 0) {
      const p = heap.pop();
      if (p < 0 || flag[p] === KNOWN) continue;
      flag[p] = KNOWN;
      const px = p % w;
      const py = (p / w) | 0;

      for (let d = 0; d < 4; d++) {
        if ((d === 0 && px === 0) || (d === 1 && px === w - 1) || (d === 2 && py === 0) || (d === 3 && py === h - 1)) {
          continue;
        }
        const q = p + dirs[d];
        if (flag[q] === KNOWN) continue;
        const qx = q % w;
        const qy = (q / w) | 0;

        const nextT = Math.min(
          solveQuadrant(q - w, qy > 0, q - 1, qx > 0, flag, T),
          solveQuadrant(q - w, qy > 0, q + 1, qx < w - 1, flag, T),
          solveQuadrant(q + w, qy < h - 1, q - 1, qx > 0, flag, T),
          solveQuadrant(q + w, qy < h - 1, q + 1, qx < w - 1, flag, T)
        );
        if (nextT < T[q]) T[q] = nextT;

        if (flag[q] === INSIDE) {
          InpaintSolver.inpaintPixel(q, qx, qy, w, h, radius, flag, T, rgb);
          flag[q] = BAND;
          heap.push(T[q], q);
        }
      }
    }

    const out = new Uint8ClampedArray(total * 4);
    for (let i = 0; i < total; i++) {
      if (!emitMask[i]) continue;
      const p = i * 4;
      out[p] = Math.max(0, Math.min(255, Math.round(rgb[i * 3])));
      out[p + 1] = Math.max(0, Math.min(255, Math.round(rgb[i * 3 + 1])));
      out[p + 2] = Math.max(0, Math.min(255, Math.round(rgb[i * 3 + 2])));
      out[p + 3] = 255;
    }
    return out;
  }

  private static inpaintPixel(
    q: number,
    qx: number,
    qy: number,
    w: number,
    h: number,
    radius: number,
    flag: Uint8Array,
    T: Float32Array,
    rgb: Float32Array
  ): void {
    // Arrival front normal gradT at q
    let gtx = 0;
    let gty = 0;
    if (qx > 0 && qx < w - 1 && flag[q - 1] === KNOWN && flag[q + 1] === KNOWN) {
      gtx = (T[q + 1] - T[q - 1]) * 0.5;
    } else if (qx > 0 && flag[q - 1] === KNOWN) {
      gtx = T[q] - T[q - 1];
    } else if (qx < w - 1 && flag[q + 1] === KNOWN) {
      gtx = T[q + 1] - T[q];
    }
    if (qy > 0 && qy < h - 1 && flag[q - w] === KNOWN && flag[q + w] === KNOWN) {
      gty = (T[q + w] - T[q - w]) * 0.5;
    } else if (qy > 0 && flag[q - w] === KNOWN) {
      gty = T[q] - T[q - w];
    } else if (qy < h - 1 && flag[q + w] === KNOWN) {
      gty = T[q + w] - T[q];
    }
    const gtNorm = Math.hypot(gtx, gty);
    if (gtNorm > EPS) {
      gtx /= gtNorm;
      gty /= gtNorm;
    }

    const r2 = radius * radius;
    const y0 = Math.max(0, qy - radius);
    const y1 = Math.min(h - 1, qy + radius);
    const x0 = Math.max(0, qx - radius);
    const x1 = Math.min(w - 1, qx + radius);

    let sumR = 0, sumG = 0, sumB = 0, sumW = 0;
    const tq = T[q] < INF_T ? T[q] : 1;

    for (let ky = y0; ky <= y1; ky++) {
      const dy = qy - ky;
      for (let kx = x0; kx <= x1; kx++) {
        const dx = qx - kx;
        const d2 = dx * dx + dy * dy;
        if (d2 === 0 || d2 > r2) continue;
        const k = ky * w + kx;
        if (flag[k] !== KNOWN) continue;

        const dist = Math.sqrt(d2);
        const dir = gtNorm > EPS ? Math.max(EPS, Math.abs(dx * gtx + dy * gty) / dist) : 1;
        const dst = 1 / (d2 * dist);
        const lev = 1 / (1 + Math.abs(tq - T[k]));
        const weight = dir * dst * lev;

        const kb = k * 3;
        let gxR = 0, gxG = 0, gxB = 0;
        if (kx > 0 && kx < w - 1 && flag[k - 1] === KNOWN && flag[k + 1] === KNOWN) {
          gxR = Math.max(-40, Math.min(40, (rgb[kb + 3] - rgb[kb - 3]) * 0.5));
          gxG = Math.max(-40, Math.min(40, (rgb[kb + 4] - rgb[kb - 2]) * 0.5));
          gxB = Math.max(-40, Math.min(40, (rgb[kb + 5] - rgb[kb - 1]) * 0.5));
        }
        let gyR = 0, gyG = 0, gyB = 0;
        if (ky > 0 && ky < h - 1 && flag[k - w] === KNOWN && flag[k + w] === KNOWN) {
          const up = (k - w) * 3;
          const dn = (k + w) * 3;
          gyR = Math.max(-40, Math.min(40, (rgb[dn] - rgb[up]) * 0.5));
          gyG = Math.max(-40, Math.min(40, (rgb[dn + 1] - rgb[up + 1]) * 0.5));
          gyB = Math.max(-40, Math.min(40, (rgb[dn + 2] - rgb[up + 2]) * 0.5));
        }

        sumR += weight * (rgb[kb] + gxR * dx + gyR * dy);
        sumG += weight * (rgb[kb + 1] + gxG * dx + gyG * dy);
        sumB += weight * (rgb[kb + 2] + gxB * dx + gyB * dy);
        sumW += weight;
      }
    }

    if (sumW > EPS) {
      rgb[q * 3] = sumR / sumW;
      rgb[q * 3 + 1] = sumG / sumW;
      rgb[q * 3 + 2] = sumB / sumW;
    }
  }
}
