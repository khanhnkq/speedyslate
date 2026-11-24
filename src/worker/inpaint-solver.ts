/**
 * InpaintSolver: Dedicated pixel-level region filling & diffusion solver.
 * Extracted from EraseMasker (SRP & < 500 lines invariant).
 */
export class InpaintSolver {
  /**
   * Multi-source BFS donor seed + short diffusion pass to erase masked glyph
   * pixels while preserving local surrounding tone.
   * Returns an RGBA Uint8ClampedArray where alpha=255 on `emitMask` pixels.
   */
  public static diffuseMaskedRegion(
    data: Uint8ClampedArray,
    dilMask: Uint8Array,
    emitMask: Uint8Array,
    w: number,
    h: number
  ): Uint8ClampedArray {
    const total = w * h;
    const out = new Uint8ClampedArray(total * 4);
    const filled = new Float32Array(total * 3);
    const queue = new Int32Array(total);
    let qHead = 0;
    let qTail = 0;

    for (let i = 0; i < total; i++) {
      const p = i * 4;
      if (!dilMask[i]) {
        filled[i * 3] = data[p];
        filled[i * 3 + 1] = data[p + 1];
        filled[i * 3 + 2] = data[p + 2];
        queue[qTail++] = i;
      } else {
        filled[i * 3] = -1;
      }
    }

    while (qHead < qTail) {
      const i = queue[qHead++];
      const xx = i % w;
      const yy = (i / w) | 0;
      const spread = (j: number) => {
        if (filled[j * 3] >= 0) return;
        filled[j * 3] = filled[i * 3];
        filled[j * 3 + 1] = filled[i * 3 + 1];
        filled[j * 3 + 2] = filled[i * 3 + 2];
        queue[qTail++] = j;
      };
      if (xx > 0) spread(i - 1);
      if (xx < w - 1) spread(i + 1);
      if (yy > 0) spread(i - w);
      if (yy < h - 1) spread(i + w);
    }

    const work = new Float32Array(filled);
    for (let it = 0; it < 10; it++) {
      for (let yy = 0; yy < h; yy++) {
        for (let xx = 0; xx < w; xx++) {
          const i = yy * w + xx;
          if (!emitMask[i]) continue;
          let r = 0, g = 0, b = 0, n = 0;
          if (xx > 0) { r += filled[(i - 1) * 3]; g += filled[(i - 1) * 3 + 1]; b += filled[(i - 1) * 3 + 2]; n++; }
          if (xx < w - 1) { r += filled[(i + 1) * 3]; g += filled[(i + 1) * 3 + 1]; b += filled[(i + 1) * 3 + 2]; n++; }
          if (yy > 0) { r += filled[(i - w) * 3]; g += filled[(i - w) * 3 + 1]; b += filled[(i - w) * 3 + 2]; n++; }
          if (yy < h - 1) { r += filled[(i + w) * 3]; g += filled[(i + w) * 3 + 1]; b += filled[(i + w) * 3 + 2]; n++; }
          const idx = i * 3;
          work[idx] = r / n;
          work[idx + 1] = g / n;
          work[idx + 2] = b / n;
        }
      }
      filled.set(work);
    }

    for (let i = 0; i < total; i++) {
      if (!emitMask[i]) continue;
      const p = i * 4;
      out[p] = filled[i * 3];
      out[p + 1] = filled[i * 3 + 1];
      out[p + 2] = filled[i * 3 + 2];
      out[p + 3] = 255;
    }
    return out;
  }
}
