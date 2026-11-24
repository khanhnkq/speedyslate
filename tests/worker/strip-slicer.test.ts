import { describe, it, expect } from 'vitest';
import { StripSlicer } from '../../src/worker/strip-slicer';

describe('StripSlicer.computeSliceHeights', () => {
  it('aspectCap 1.8 on 800x5000 → sliceH 1440, starts 0/1240/2480/3720 + remainder', () => {
    const slices = StripSlicer.computeSliceHeights(800, 5000, {
      aspectCap: 1.8,
      maxSliceHeight: 2000,
      overlap: 200
    });

    // sliceH = clamp(round(800 * 1.8) = 1440, 640, 2000) = 1440; step = 1440 - 200 = 1240
    expect(slices.map((s) => s.startY)).toEqual([0, 1240, 2480, 3720, 4960]);
    expect(slices[0].h).toBe(1440);
    expect(slices[slices.length - 1].h).toBe(40);

    // Last slice ends exactly at the image bottom
    const last = slices[slices.length - 1];
    expect(last.startY + last.h).toBe(5000);

    // No coverage gap: every slice starts before the previous one ends (200px overlap)
    for (let i = 1; i < slices.length; i++) {
      const prevEnd = slices[i - 1].startY + slices[i - 1].h;
      expect(slices[i].startY).toBeLessThanOrEqual(prevEnd);
    }
  });

  it('without aspectCap keeps legacy 2000px chunks with 200 overlap', () => {
    const slices = StripSlicer.computeSliceHeights(800, 5000);
    expect(slices).toEqual([
      { startY: 0, h: 2000 },
      { startY: 1800, h: 2000 },
      { startY: 3600, h: 1400 }
    ]);
  });

  it('explicit maxSliceHeight/overlap without aspectCap match legacy slicing', () => {
    const slices = StripSlicer.computeSliceHeights(800, 5000, {
      maxSliceHeight: 2000,
      overlap: 200
    });
    expect(slices).toEqual([
      { startY: 0, h: 2000 },
      { startY: 1800, h: 2000 },
      { startY: 3600, h: 1400 }
    ]);
  });

  it('short page (height <= maxSliceHeight + 200) → single full-height slice', () => {
    expect(StripSlicer.computeSliceHeights(800, 2000)).toEqual([{ startY: 0, h: 2000 }]);
    expect(StripSlicer.computeSliceHeights(800, 2200)).toEqual([{ startY: 0, h: 2200 }]);
    expect(StripSlicer.computeSliceHeights(800, 2201).length).toBeGreaterThan(1);
  });

  it('aspectCap still tolerates a small overage (+200) before slicing', () => {
    // sliceH = 1440, tolerance = 1640 → 1500 stays whole even though aspect 1.875 > 1.8
    expect(StripSlicer.computeSliceHeights(800, 1500, { aspectCap: 1.8 })).toEqual([
      { startY: 0, h: 1500 }
    ]);
  });

  it('aspectCap slices a 800x2000 strip whose aspect (2.5) exceeds the cap', () => {
    const slices = StripSlicer.computeSliceHeights(800, 2000, { aspectCap: 1.8 });
    // sliceH = 1440 → 2000 > 1640 → two slices
    expect(slices).toEqual([
      { startY: 0, h: 1440 },
      { startY: 1240, h: 760 }
    ]);
  });

  it('aspectCap clamps slice height to minimum 640 for narrow strips', () => {
    // round(300 * 1.8) = 540 → clamped up to 640; step = 440
    const slices = StripSlicer.computeSliceHeights(300, 3000, { aspectCap: 1.8 });
    expect(slices[0].h).toBe(640);
    const last = slices[slices.length - 1];
    expect(last.startY + last.h).toBe(3000);
    for (let i = 1; i < slices.length; i++) {
      const prevEnd = slices[i - 1].startY + slices[i - 1].h;
      expect(slices[i].startY).toBeLessThanOrEqual(prevEnd);
    }
  });

  it('aspectCap clamps slice height to maxSliceHeight for wide strips', () => {
    // round(2000 * 1.8) = 3600 → clamped down to 2000 → identical to legacy
    const slices = StripSlicer.computeSliceHeights(2000, 5000, {
      aspectCap: 1.8,
      maxSliceHeight: 2000,
      overlap: 200
    });
    expect(slices).toEqual([
      { startY: 0, h: 2000 },
      { startY: 1800, h: 2000 },
      { startY: 3600, h: 1400 }
    ]);
  });
});
