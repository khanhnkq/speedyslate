import { describe, expect, it } from 'vitest';
import { InpaintSolver } from '../../src/worker/inpaint-solver';

describe('InpaintSolver.teleaInpaint', () => {
  it('reconstructs a smooth linear gradient across a masked stroke without NaN or dark ghosts', () => {
    const w = 40;
    const h = 30;
    const img = new Uint8ClampedArray(w * h * 4);
    const mask = new Uint8Array(w * h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        const g = Math.round((x / (w - 1)) * 200) + 20;
        const isStroke = x >= 17 && x <= 21 && y >= 8 && y <= 22;
        mask[i] = isStroke ? 1 : 0;
        img.set(isStroke ? [5, 5, 5, 255] : [g, g, g, 255], i * 4);
      }
    }
    const out = InpaintSolver.teleaInpaint(img, mask, mask, w, h, 3);
    const mid = (15 * w + 19) * 4;
    const expected = Math.round((19 / 39) * 200) + 20;
    expect(out[mid + 3]).toBe(255);
    expect(Math.abs(out[mid] - expected)).toBeLessThanOrEqual(8);
  });

  it('scales stroke dilation between 2px and 5px to swallow fuchidori halos', () => {
    expect(InpaintSolver.computeDilationRadius(18)).toBe(2);
    expect(InpaintSolver.computeDilationRadius(36)).toBe(4);
    expect(InpaintSolver.computeDilationRadius(80)).toBe(5);
  });
});
