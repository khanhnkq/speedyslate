import { describe, it, expect } from 'vitest';
import { ColorSampler, PixelRegion } from '../../src/worker/color-sampler';

function makeRegion(w: number, h: number, fill: [number, number, number]): PixelRegion {
  const data = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = fill[0];
    data[i + 1] = fill[1];
    data[i + 2] = fill[2];
    data[i + 3] = 255;
  }
  return { data, width: w, height: h };
}

// Simple seeded PRNG (mulberry32) for deterministic noise
function rng(seed: number): () => number {
  let s = seed;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe('ColorSampler.analyzeRegion', () => {
  it('all-white region → light, #ffffff, near-zero stddev', () => {
    const r = ColorSampler.analyzeRegion(makeRegion(100, 60, [255, 255, 255]));
    expect(r.isDark).toBe(false);
    expect(r.bgHex).toBe('#ffffff');
    expect(r.luma).toBeCloseTo(255, 0);
    expect(r.lumaStdDev).toBeLessThan(1);
  });

  it('all-black region → dark, #000000', () => {
    const r = ColorSampler.analyzeRegion(makeRegion(80, 50, [0, 0, 0]));
    expect(r.isDark).toBe(true);
    expect(r.bgHex).toBe('#000000');
  });

  it('majority-white perimeter with black patch → median picks white', () => {
    const w = 100;
    const h = 60;
    const region = makeRegion(w, h, [255, 255, 255]);
    // Fill right 30% black — right perimeter column becomes black, rest stays white
    for (let y = 0; y < h; y++) {
      for (let x = Math.round(w * 0.7); x < w; x++) {
        const i = (y * w + x) * 4;
        region.data[i] = 0;
        region.data[i + 1] = 0;
        region.data[i + 2] = 0;
      }
    }
    const r = ColorSampler.analyzeRegion(region);
    expect(r.bgHex).toBe('#ffffff');
    expect(r.lumaStdDev).toBeGreaterThan(40);
  });

  it('noisy perimeter → high lumaStdDev', () => {
    const w = 90;
    const h = 60;
    const region = makeRegion(w, h, [255, 255, 255]);
    const rand = rng(42);
    const ring = Math.max(1, Math.round(Math.min(w, h) * 0.18));
    for (let x = 0; x < w; x += 3) {
      const v = rand() > 0.5 ? 255 : 0;
      for (let k = 0; k < ring; k++) {
        for (const y of [k, h - 1 - k]) {
          const i = (y * w + x) * 4;
          region.data[i] = v;
          region.data[i + 1] = v;
          region.data[i + 2] = v;
        }
      }
    }
    const r = ColorSampler.analyzeRegion(region);
    expect(r.lumaStdDev).toBeGreaterThan(60);
  });

  it('cream bubble color → median hex matches', () => {
    const r = ColorSampler.analyzeRegion(makeRegion(120, 80, [255, 248, 231]));
    expect(r.bgHex).toBe('#fff8e7');
    expect(r.isDark).toBe(false);
  });
});
