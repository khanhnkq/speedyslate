import { describe, expect, it } from 'vitest';
import { StripSlicer } from '../../src/worker/strip-slicer';
import { ITextDetector } from '../../src/worker/detector-interface';
import { BoundingBox } from '../../src/shared/types';

function makeImageBuffer(w: number, h: number, fillLuma = 250): Uint8ClampedArray {
  const data = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = fillLuma;
    data[i + 1] = fillLuma;
    data[i + 2] = fillLuma;
    data[i + 3] = 255;
  }
  return data;
}

function fillRect(
  data: Uint8ClampedArray,
  w: number,
  x0: number,
  y0: number,
  rw: number,
  rh: number,
  luma: number
): void {
  for (let y = y0; y < y0 + rh; y++) {
    for (let x = x0; x < x0 + rw; x++) {
      const idx = (y * w + x) * 4;
      data[idx] = luma;
      data[idx + 1] = luma;
      data[idx + 2] = luma;
    }
  }
}

describe('StripSlicer contrast-gated dark-range detection', () => {
  it('returns empty for plain dark artwork, gutters, and panel borders', () => {
    const w = 320;
    const h = 400;

    // 1. Plain solid dark artwork (luma 15)
    const plainDark = makeImageBuffer(w, h, 15);
    expect(StripSlicer.findDarkRangesFromImageData(plainDark, w, h, [])).toEqual([]);

    // 2. White top half + black bottom half (panel border at y=200)
    const border = makeImageBuffer(w, h, 250);
    fillRect(border, w, 0, 200, w, 200, 10);
    expect(StripSlicer.findDarkRangesFromImageData(border, w, h, [])).toEqual([]);

    // 3. Horizontal white speedlines across a dark panel (no vertical glyph breaks)
    const speedlines = makeImageBuffer(w, h, 15);
    for (let y = 80; y <= 240; y += 16) {
      fillRect(speedlines, w, 0, y, w, 2, 240);
    }
    expect(StripSlicer.findDarkRangesFromImageData(speedlines, w, h, [])).toEqual([]);
  });

  it('triggers on dark regions containing high-contrast bright text strokes', () => {
    const w = 320;
    const h = 300;
    const img = makeImageBuffer(w, h, 245);

    // Dark narration box at y=60..200
    fillRect(img, w, 20, 60, 280, 140, 12);

    // Draw crisp white glyph-like vertical/horizontal strokes inside y=100..145
    for (let x = 50; x <= 230; x += 12) {
      fillRect(img, w, x, 102, 3, 36, 245);
      fillRect(img, w, x, 102, 7, 3, 245);
    }

    const ranges = StripSlicer.findDarkRangesFromImageData(img, w, h, []);
    expect(ranges.length).toBeGreaterThan(0);
    expect(ranges[0].startY).toBeLessThanOrEqual(100);
    expect(ranges[0].startY + ranges[0].h).toBeGreaterThanOrEqual(138);

    // Once covered by an existing detected box covering the dark region, no dark range triggers
    const covered: BoundingBox[] = [{ x: 16, y: 56, width: 288, height: 148, kind: 'dialogue' }];
    expect(StripSlicer.findDarkRangesFromImageData(img, w, h, covered)).toEqual([]);
  });

  it('skips inverted ONNX pass in detectWithSlicing when dark regions lack bright text contrast', async () => {
    const originalOffscreen = (globalThis as any).OffscreenCanvas;
    let calls = 0;

    // Lightweight OffscreenCanvas mock for Node vitest
    (globalThis as any).OffscreenCanvas = class MockOffscreenCanvas {
      width: number;
      height: number;
      private buf: Uint8ClampedArray;
      constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.buf = makeImageBuffer(width, height, 20);
      }
      getContext() {
        const buf = this.buf;
        return {
          drawImage: () => {},
          getImageData: (_x: number, _y: number, w: number, h: number) => ({
            data: buf.subarray(0, w * h * 4),
            width: w,
            height: h
          }),
          putImageData: () => {}
        };
      }
    };

    try {
      const mockDetector: ITextDetector = {
        detectText: async () => {
          calls++;
          return [];
        }
      };
      const canvas = new (globalThis as any).OffscreenCanvas(320, 400);
      await StripSlicer.detectWithSlicing(canvas, 320, 400, mockDetector, {
        invertedPass: true
      });
      expect(calls).toBe(1);
    } finally {
      (globalThis as any).OffscreenCanvas = originalOffscreen;
    }
  });
});
