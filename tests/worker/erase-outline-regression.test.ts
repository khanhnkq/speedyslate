import { describe, expect, it } from 'vitest';
import { BubbleGeometry } from '../../src/content/overlay/bubble-geometry';
import { DialogueItem } from '../../src/shared/types';
import { EraseMasker } from '../../src/worker/erase-masker';

function makeRgbBuffer(w: number, h: number, r: number, g: number, b: number): Uint8ClampedArray {
  const data = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    const p = i * 4;
    data[p] = r;
    data[p + 1] = g;
    data[p + 2] = b;
    data[p + 3] = 255;
  }
  return data;
}

function setRgb(data: Uint8ClampedArray, w: number, x: number, y: number, r: number, g: number, b: number): void {
  if (x < 0 || y < 0) return;
  const p = (y * w + x) * 4;
  if (p < 0 || p + 3 >= data.length) return;
  data[p] = r;
  data[p + 1] = g;
  data[p + 2] = b;
  data[p + 3] = 255;
}

function lumaAt(px: Uint8ClampedArray, w: number, x: number, y: number): number {
  const p = (y * w + x) * 4;
  return (px[p] * 299 + px[p + 1] * 587 + px[p + 2] * 114) / 1000;
}

function drawFuchidoriGlyph(
  data: Uint8ClampedArray,
  w: number,
  h: number,
  x0: number,
  y0: number,
  gw: number,
  gh: number,
  haloLuma = 252,
  inkLuma = 12
): Array<[number, number]> {
  const haloCoords: Array<[number, number]> = [];
  for (let y = Math.max(0, y0 - 3); y <= Math.min(h - 1, y0 + gh + 2); y++) {
    for (let x = Math.max(0, x0 - 3); x <= Math.min(w - 1, x0 + gw + 2); x++) {
      const inCore = x >= x0 && x < x0 + gw && y >= y0 && y < y0 + gh;
      if (!inCore) {
        setRgb(data, w, x, y, haloLuma, haloLuma, haloLuma);
        haloCoords.push([x, y]);
      }
    }
  }
  for (let y = y0; y < y0 + gh; y++) {
    for (let x = x0; x < x0 + gw; x++) {
      setRgb(data, w, x, y, inkLuma, inkLuma, inkLuma);
    }
  }
  return haloCoords;
}

describe('EraseMasker — dual-outline & fuchidori text erasure regressions', () => {
  it('erases full-width black-stroke + bright-white-halo text across varying sky/foliage gradient (29_9_2 style)', () => {
    const w = 320;
    const h = 48;
    const data = new Uint8ClampedArray(w * h * 4);

    // Varying sky/foliage background: left green ~186, center lavender ~214, mid-right beige band ~174, far-right ~218
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let r = 212, g = 214, b = 220;
        if (x < 90) { r = 182; g = 192; b = 176; }
        else if (x >= 170 && x < 250) { r = 186; g = 172; b = 162; }
        else if (x >= 250) { r = 218; g = 216; b = 218; }
        setRgb(data, w, x, y, r, g, b);
      }
    }

    const innerRect = { x0: 16, y0: 16, x1: 304, y1: 32 };
    const glyphCenters: Array<[number, number]> = [];
    const haloPixels: Array<[number, number]> = [];
    for (let x = 20; x <= 292; x += 14) {
      const halos = drawFuchidoriGlyph(data, w, h, x, 17, 4, 14, 252, 12);
      haloPixels.push(...halos);
      glyphCenters.push([x + 1, 24]);
    }

    const patch = EraseMasker.buildPatch(
      { data, width: w, height: h } as ImageData,
      0,
      0,
      '#e3e0dc',
      undefined,
      undefined,
      undefined,
      innerRect
    );

    expect(patch).not.toBeNull();
    expect(patch!.dbg?.path).toBe('telea');

    const comp = new Uint8ClampedArray(data);
    const px = patch!.pixels as Uint8ClampedArray;
    for (let i = 0; i < w * h; i++) {
      if (px[i * 4 + 3] > 0) {
        comp[i * 4] = px[i * 4];
        comp[i * 4 + 1] = px[i * 4 + 1];
        comp[i * 4 + 2] = px[i * 4 + 2];
      }
    }

    // Left end, center, AND right end across the beige band must all be erased cleanly
    for (const [gx, gy] of glyphCenters) {
      const l = lumaAt(comp, w, gx, gy);
      expect(l).toBeGreaterThan(150);
      expect(l).toBeLessThan(235);
    }
    for (const [hx, hy] of haloPixels) {
      expect(lumaAt(comp, w, hx, hy)).toBeLessThan(236);
    }
  });

  it('erases both dark outline AND enclosed bright white interior core on bright paper (luma 232)', () => {
    const w = 140;
    const h = 64;
    const data = makeRgbBuffer(w, h, 232, 232, 232);
    const innerRect = { x0: 16, y0: 16, x1: 124, y1: 48 };

    // Two wide hollow glyphs: 2px black outline (15) enclosing a 10x18 bright white core (253)
    const coreCoords: Array<[number, number]> = [];
    const outlineCoords: Array<[number, number]> = [];
    for (const gx of [28, 76]) {
      for (let y = 20; y <= 43; y++) {
        for (let x = gx; x < gx + 16; x++) {
          const onEdge = x < gx + 2 || x >= gx + 14 || y < 22 || y >= 42;
          const v = onEdge ? 15 : 253;
          setRgb(data, w, x, y, v, v, v);
          if (onEdge) outlineCoords.push([x, y]);
          else coreCoords.push([x, y]);
        }
      }
    }

    const patch = EraseMasker.buildPatch(
      { data, width: w, height: h } as ImageData,
      0,
      0,
      '#e8e8e8',
      undefined,
      undefined,
      undefined,
      innerRect
    );

    expect(patch).not.toBeNull();
    const out = patch!.pixels as Uint8ClampedArray;
    for (const [ox, oy] of outlineCoords) {
      expect(out[(oy * w + ox) * 4 + 3]).toBe(255);
    }
    // Center of enclosed 10x18 white core (farther than dilRadius=3 from black outline!) must be erased to ~232
    for (const [cx, cy] of [[36, 32], [84, 32]]) {
      expect(out[(cy * w + cx) * 4 + 3]).toBe(255);
      const l = lumaAt(out, w, cx, cy);
      expect(l).toBeGreaterThan(222);
      expect(l).toBeLessThan(240);
    }
  });

  it('erases line 2 fuchidori text cleanly even when line 1 halo sits in its top padding', () => {
    const w = 220;
    const h = 48;
    const data = makeRgbBuffer(w, h, 206, 208, 210);

    // Line 1 bottom (with white halo reaching y=7) sits inside line 2 top pad
    for (let x = 20; x <= 190; x += 14) {
      drawFuchidoriGlyph(data, w, h, x, 0, 5, 5, 252, 12);
    }
    // Line 2 inside innerRect (y=16..32)
    const line2Centers: Array<[number, number]> = [];
    for (let x = 24; x <= 186; x += 14) {
      drawFuchidoriGlyph(data, w, h, x, 17, 4, 14, 252, 12);
      line2Centers.push([x + 1, 24]);
    }

    const patch = EraseMasker.buildPatch(
      { data, width: w, height: h } as ImageData,
      0,
      0,
      '#ced0d2',
      undefined,
      undefined,
      undefined,
      { x0: 16, y0: 16, x1: 204, y1: 32 }
    );

    expect(patch).not.toBeNull();
    const out = patch!.pixels as Uint8ClampedArray;
    for (const [gx, gy] of line2Centers) {
      expect(out[(gy * w + gx) * 4 + 3]).toBe(255);
      expect(lumaAt(out, w, gx, gy)).toBeGreaterThan(185);
      expect(lumaAt(out, w, gx, gy)).toBeLessThan(225);
    }
    // Line 1 ink at y=2 must remain untouched by line 2's patch
    expect(out[(2 * w + 21) * 4 + 3]).toBe(0);
  });

  it('still preserves curved bubble walls while erasing interior glyphs', () => {
    const w = 120;
    const h = 120;
    const data = makeRgbBuffer(w, h, 185, 185, 185);
    const borderPixels: Array<[number, number]> = [];

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const d = Math.hypot((x - 60) / 46, (y - 60) / 48);
        if (d < 0.91) setRgb(data, w, x, y, 252, 252, 252);
        else if (d <= 1.0) {
          setRgb(data, w, x, y, 18, 18, 18);
          borderPixels.push([x, y]);
        }
      }
    }

    for (let y = 48; y <= 70; y++) {
      for (let x = 42; x <= 78; x += 9) {
        setRgb(data, w, x, y, 18, 18, 18);
        setRgb(data, w, x + 1, y, 18, 18, 18);
      }
    }

    const patch = EraseMasker.buildPatch(
      { data, width: w, height: h } as ImageData,
      0,
      0,
      '#fcfcfc',
      undefined,
      undefined,
      undefined,
      { x0: 26, y0: 24, x1: 94, y1: 96 }
    );

    expect(patch).not.toBeNull();
    const out = patch!.pixels as Uint8ClampedArray;
    expect(out[(58 * w + 42) * 4 + 3]).toBe(255);
    expect(lumaAt(out, w, 42, 58)).toBeGreaterThan(240);
    for (const [bx, by] of borderPixels) {
      expect(out[(by * w + bx) * 4 + 3]).toBe(0);
    }
  });
});

describe('BubbleGeometry.computeCoordinates — tall/wide oval chambers vs multi-panel leak rejection', () => {
  it('accepts a 274px tall single-line oval chamber (5.7x item.box.height) without falling back to tight box', () => {
    const item: DialogueItem = {
      id: 'tall-oval',
      kind: 'dialogue',
      box: { x: 200, y: 400, width: 140, height: 48 },
      chamberBox: { x: 170, y: 290, width: 200, height: 274 },
      originalText: 'HELLO',
      translatedText: 'XIN CHÀO ĐÂY LÀ MỘT KHUNG THOẠI DỌC CAO',
      erasePatches: [{ x: 200, y: 400, width: 10, height: 10, pixels: '' }]
    };

    const coords = BubbleGeometry.computeCoordinates(item, 720, 1667);
    expect(coords.pixelHeight).toBeGreaterThan(220);
    expect(coords.pixelWidth).toBeGreaterThan(170);
  });

  it('accepts a wide single-line oval chamber up to 3.2x / 260px', () => {
    const item: DialogueItem = {
      id: 'wide-oval',
      kind: 'dialogue',
      box: { x: 220, y: 300, width: 70, height: 32 },
      chamberBox: { x: 140, y: 260, width: 230, height: 110 },
      originalText: 'WHAT?',
      translatedText: 'CÁI GÌ THẾ NÀY?',
      erasePatches: [{ x: 220, y: 300, width: 10, height: 10, pixels: '' }]
    };

    const coords = BubbleGeometry.computeCoordinates(item, 800, 1200);
    expect(coords.pixelWidth).toBeGreaterThan(190);
    expect(coords.pixelHeight).toBeGreaterThan(90);
  });

  it('rejects oversized multi-bubble / panel leaks that exceed safe dimension or 25% area caps', () => {
    const giantLeak: DialogueItem = {
      id: 'multi-leak',
      kind: 'dialogue',
      box: { x: 200, y: 300, width: 80, height: 24 },
      chamberBox: { x: 40, y: 100, width: 460, height: 380 },
      originalText: 'HEY',
      translatedText: 'NÀY'
    };

    const coords = BubbleGeometry.computeCoordinates(giantLeak, 720, 1667);
    expect(coords.pixelWidth).toBeLessThan(120);
    expect(coords.pixelHeight).toBeLessThan(60);

    const areaLeak: DialogueItem = {
      id: 'area-leak',
      kind: 'dialogue',
      box: { x: 100, y: 100, width: 220, height: 180 },
      chamberBox: { x: 20, y: 20, width: 640, height: 680 }, // 435,200 > 25% of 800x1200 (240,000)
      originalText: 'BIG',
      translatedText: 'LỚN'
    };

    const areaCoords = BubbleGeometry.computeCoordinates(areaLeak, 800, 1200);
    expect(areaCoords.pixelWidth).toBeLessThan(260);
    expect(areaCoords.pixelHeight).toBeLessThan(220);
  });
});
