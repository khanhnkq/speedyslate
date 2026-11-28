import { describe, expect, it } from 'vitest';
import { BubbleChamberExtractor } from '../../src/worker/bubble-chamber';
import { attachErasePatches } from '../../src/worker/erase-pipeline';
import { EraseMasker } from '../../src/worker/erase-masker';
import { featherTeleaAlpha } from '../../src/worker/erase-mask-utils';
import { BubbleFiller } from '../../src/worker/bubble-filler';
import { BubbleGeometry } from '../../src/content/overlay/bubble-geometry';
import { PagePixelBuffer } from '../../src/worker/bubble-wall-detector';
import { DialogueItem } from '../../src/shared/types';

function makeBuffer(width: number, height: number, r = 40, g = 40, b = 40): PagePixelBuffer {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
    data[i + 3] = 255;
  }
  return { data, width, height };
}

function paintRect(
  buf: PagePixelBuffer,
  x0: number,
  y0: number,
  w: number,
  h: number,
  r: number,
  g: number,
  b: number
): void {
  const xEnd = Math.min(buf.width, x0 + w);
  const yEnd = Math.min(buf.height, y0 + h);
  for (let y = Math.max(0, y0); y < yEnd; y++) {
    for (let x = Math.max(0, x0); x < xEnd; x++) {
      const idx = (y * buf.width + x) * 4;
      buf.data[idx] = r;
      buf.data[idx + 1] = g;
      buf.data[idx + 2] = b;
      buf.data[idx + 3] = 255;
    }
  }
}

function drawClippedOval(
  buf: PagePixelBuffer,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  dark = false
): void {
  const paper = dark ? 22 : 250;
  const border = dark ? 245 : 15;
  for (let y = 0; y < buf.height; y++) {
    for (let x = 0; x < buf.width; x++) {
      const d2 = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2;
      if (d2 <= 0.94) paintRect(buf, x, y, 1, 1, paper, paper, paper);
      else if (d2 <= 1.04) paintRect(buf, x, y, 1, 1, border, border, border);
    }
  }
}

function paintGlyphBand(
  buf: PagePixelBuffer,
  x0: number,
  y0: number,
  x1: number,
  h: number,
  luma: number
): void {
  for (let y = y0; y < y0 + h; y++) {
    for (let x = x0; x <= x1; x += 6) {
      paintRect(buf, x, y, 2, 1, luma, luma, luma);
    }
  }
}

function makeMockCanvas(buf: PagePixelBuffer): OffscreenCanvas {
  const ctx = {
    getImageData(sx: number, sy: number, sw: number, sh: number): ImageData {
      const out = new Uint8ClampedArray(sw * sh * 4);
      for (let row = 0; row < sh; row++) {
        const yy = Math.max(0, Math.min(buf.height - 1, sy + row));
        const off = (yy * buf.width + sx) * 4;
        out.set(buf.data.subarray(off, off + sw * 4), row * sw * 4);
      }
      return { data: out, width: sw, height: sh } as ImageData;
    }
  } as unknown as OffscreenCanvasRenderingContext2D;
  return {
    width: buf.width,
    height: buf.height,
    getContext: () => ctx
  } as unknown as OffscreenCanvas;
}

describe('Seam-Clipped Bubble Chambers', () => {
  it('recovers top-seam clipped oval chamber (17_5_2 pattern) and flows through ErasePipeline', () => {
    const pageW = 420;
    const pageH = 600;
    const buf = makeBuffer(pageW, pageH, 45, 45, 45);
    // Oval centered at y=10 with ry=125 -> bottom half extends to y=135, cut cleanly at y=0
    drawClippedOval(buf, 210, 10, 120, 125, false);
    // Dialogue clipped across y=0..24
    paintGlyphBand(buf, 145, 0, 275, 22, 15);

    const textBox = { x: 140, y: 2, width: 140, height: 22, kind: 'dialogue' as const };
    const direct = BubbleChamberExtractor.extractChamber(
      { data: buf.data.subarray(0, pageW * 200 * 4), width: pageW, height: 200 },
      0,
      0,
      textBox,
      { width: pageW, height: pageH }
    );
    expect(direct).not.toBeNull();
    expect(direct!.isOval).toBe(true);
    expect(direct!.chamberBox.y).toBe(0);
    expect(direct!.chamberBox.height).toBeGreaterThanOrEqual(110);
    expect(direct!.chamberBox.width).toBeGreaterThanOrEqual(210);

    const items: DialogueItem[] = [
      { id: 'top1', box: { ...textBox }, originalText: 'CLIPPED TOP', kind: 'dialogue' }
    ];
    attachErasePatches(makeMockCanvas(buf), items, undefined, buf);
    expect(items[0].chamberBox).toBeDefined();
    expect(items[0].isOvalChamber).toBe(true);
    expect(items[0].chamberBox!.height).toBeGreaterThanOrEqual(110);

    const geom = BubbleGeometry.computeCoordinates(items[0], pageW, pageH);
    expect(geom.pixelHeight).toBeGreaterThanOrEqual(95);
    expect(geom.pixelWidth).toBeGreaterThanOrEqual(180);
  });

  it('recovers bottom-seam clipped oval chamber (16_5_1 pattern) with cropOriginY > 0', () => {
    const pageW = 420;
    const pageH = 640;
    const buf = makeBuffer(pageW, pageH, 40, 40, 40);
    // Oval centered near bottom seam y=630 with ry=125 -> top half y=505..639
    drawClippedOval(buf, 210, 630, 125, 125, false);
    paintGlyphBand(buf, 145, 616, 275, 22, 15);

    const textBox = { x: 140, y: 616, width: 140, height: 22, kind: 'dialogue' as const };
    const cropY = 440;
    const cropH = pageH - cropY; // 200px, touches page bottom y=640
    const direct = BubbleChamberExtractor.extractChamber(
      { data: buf.data.subarray(cropY * pageW * 4, pageH * pageW * 4), width: pageW, height: cropH },
      0,
      cropY,
      textBox,
      { width: pageW, height: pageH }
    );
    expect(direct).not.toBeNull();
    expect(direct!.isOval).toBe(true);
    expect(direct!.chamberBox.y + direct!.chamberBox.height).toBe(pageH);
    expect(direct!.chamberBox.height).toBeGreaterThanOrEqual(110);

    const items: DialogueItem[] = [
      { id: 'bot1', box: { ...textBox }, originalText: 'CLIPPED BOT', kind: 'dialogue' }
    ];
    attachErasePatches(makeMockCanvas(buf), items, undefined, buf);
    expect(items[0].chamberBox).toBeDefined();
    expect(items[0].isOvalChamber).toBe(true);
    expect(items[0].chamberBox!.y + items[0].chamberBox!.height).toBe(pageH);
    expect(items[0].chamberBox!.height).toBeGreaterThanOrEqual(110);
  });

  it('supports dark scream bubbles cut at the page seam', () => {
    const pageW = 400;
    const pageH = 500;
    const buf = makeBuffer(pageW, pageH, 230, 230, 230);
    drawClippedOval(buf, 200, 10, 110, 115, true);
    paintGlyphBand(buf, 150, 2, 250, 18, 245);

    const res = BubbleChamberExtractor.extractChamber(
      { data: buf.data.subarray(0, pageW * 200 * 4), width: pageW, height: 200 },
      0,
      0,
      { x: 145, y: 2, width: 110, height: 20 },
      { width: pageW, height: pageH }
    );
    expect(res).not.toBeNull();
    expect(res!.chamberBox.width).toBeGreaterThanOrEqual(190);
    expect(res!.chamberBox.height).toBeGreaterThanOrEqual(100);
  });

  it('keeps open-page, non-seam edge leaks, horizontal asymmetry, and mid-grey art failing closed', () => {
    const w = 320;
    const h = 200;

    // 1. Open white page at top seam
    const openTop = makeBuffer(w, h, 252, 252, 252);
    paintGlyphBand(openTop, 110, 2, 210, 18, 15);
    expect(
      BubbleChamberExtractor.extractChamber(
        openTop,
        0,
        0,
        { x: 105, y: 2, width: 110, height: 20 },
        { width: w, height: 600 }
      )
    ).toBeNull();

    // 2. Open white page at bottom seam
    const openBot = makeBuffer(w, h, 252, 252, 252);
    paintGlyphBand(openBot, 110, 178, 210, 18, 15);
    expect(
      BubbleChamberExtractor.extractChamber(
        openBot,
        0,
        400,
        { x: 105, y: 578, width: 110, height: 20 },
        { width: w, height: 600 }
      )
    ).toBeNull();

    // 3. Top-seam clipped bubble with an open leak out the bottom wall (y = h - 1)
    const botLeak = makeBuffer(w, h, 30, 30, 30);
    paintRect(botLeak, 55, 0, 210, h, 15, 15, 15);
    paintRect(botLeak, 60, 0, 200, h, 252, 252, 252);
    paintGlyphBand(botLeak, 110, 2, 210, 18, 15);
    expect(
      BubbleChamberExtractor.extractChamber(
        botLeak,
        0,
        0,
        { x: 105, y: 2, width: 110, height: 20 },
        { width: w, height: 600 }
      )
    ).toBeNull();

    // 4. Top-seam clipped bubble with extreme horizontal right-lobe asymmetry
    const horizLeak = makeBuffer(440, 220, 40, 40, 40);
    paintRect(horizLeak, 56, 0, 348, 144, 15, 15, 15);
    paintRect(horizLeak, 60, 0, 340, 140, 252, 252, 252);
    paintGlyphBand(horizLeak, 80, 2, 170, 18, 15);
    expect(
      BubbleChamberExtractor.extractChamber(
        horizLeak,
        0,
        0,
        { x: 75, y: 2, width: 100, height: 20 },
        { width: 440, height: 600 }
      )
    ).toBeNull();

    // 5. Mid-grey textured art at top seam
    const midGrey = makeBuffer(w, h, 118, 118, 118);
    expect(
      BubbleChamberExtractor.extractChamber(
        midGrey,
        0,
        0,
        { x: 100, y: 2, width: 110, height: 20 },
        { width: w, height: 600 }
      )
    ).toBeNull();

    // 6. Interior bubble away from seam (y=500..520 on 600px page) touching crop bottom due to padY -> NOT seamBottom
    const nonSeamBuf = makeBuffer(w, h, 40, 40, 40);
    paintRect(nonSeamBuf, 55, 40, 210, h - 40, 15, 15, 15);
    paintRect(nonSeamBuf, 60, 45, 200, h - 45, 252, 252, 252);
    paintGlyphBand(nonSeamBuf, 110, 60, 210, 18, 15);
    expect(
      BubbleChamberExtractor.extractChamber(
        nonSeamBuf,
        0,
        400,
        { x: 105, y: 460, width: 110, height: 20 },
        { width: w, height: 600 }
      )
    ).toBeNull();
  });
});

describe('Telea Alpha Feathering', () => {
  it('keeps mask + 1px safety border at 255 and tapers 2px outer dil rim (255 -> 210 -> 140 -> 0)', () => {
    const w = 15;
    const h = 15;
    const pixels = new Uint8ClampedArray(w * h * 4);
    const mask = new Uint8Array(w * h);

    // Core mask at (7, 7), dilated disk radius 4 (covers Chebyshev/Euclidean <= 4)
    mask[7 * w + 7] = 1;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if ((x - 7) ** 2 + (y - 7) ** 2 <= 16) {
          const p = (y * w + x) * 4;
          pixels[p] = 180;
          pixels[p + 1] = 180;
          pixels[p + 2] = 180;
          pixels[p + 3] = 255;
        }
      }
    }

    featherTeleaAlpha(pixels, mask, w, h);

    // Core pixel & 1px Chebyshev safety border must stay 255
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        expect(pixels[((7 + dy) * w + (7 + dx)) * 4 + 3]).toBe(255);
      }
    }
    // Untouched outside pixel (7, 2) stays 0
    expect(pixels[(2 * w + 7) * 4 + 3]).toBe(0);
    // Outermost 1px boundary pixel (7, 3) tapers to 140
    expect(pixels[(3 * w + 7) * 4 + 3]).toBe(140);
    // 2px inner ring pixel (7, 4) tapers to 210
    expect(pixels[(4 * w + 7) * 4 + 3]).toBe(210);
    // Deeper interior pixel (7, 5) stays 255
    expect(pixels[(5 * w + 7) * 4 + 3]).toBe(255);
  });

  it('feathers Telea patches on textured/dark SFX (23_7_2 pattern) while keeping flat and BubbleFiller crisp', () => {
    const w = 100;
    const h = 48;

    // Textured dark-toned SFX/dialogue background (high variance -> triggers Telea path)
    const texBuf = makeBuffer(w, h, 80, 95, 115);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const tone = 75 + ((x * 7 + y * 13) % 45);
        paintRect(texBuf, x, y, 1, 1, tone, tone + 10, tone + 20);
      }
    }
    // Bright white strokes inside innerRect
    for (let x = 22; x <= 74; x += 12) {
      paintRect(texBuf, x, 16, 4, 16, 250, 250, 250);
    }

    const teleaPatch = EraseMasker.buildPatch(
      { data: texBuf.data, width: w, height: h } as ImageData,
      0,
      0,
      '#556677',
      undefined,
      undefined,
      undefined,
      { x0: 16, y0: 12, x1: 84, y1: 36 }
    );
    expect(teleaPatch).not.toBeNull();
    expect(teleaPatch!.dbg?.path).toBe('telea');

    const tp = teleaPatch!.pixels as Uint8ClampedArray;
    const alphas = new Set<number>();
    for (let i = 3; i < tp.length; i += 4) alphas.add(tp[i]);
    expect(alphas.has(0)).toBe(true);
    expect(alphas.has(140)).toBe(true);
    expect(alphas.has(210)).toBe(true);
    expect(alphas.has(255)).toBe(true);
    // Core erased glyph pixel remains opaque 255
    expect(tp[(24 * w + 23) * 4 + 3]).toBe(255);

    // Uniform flat paper -> flat path must stay strictly 0 or 255 (no feathering)
    const flatBuf = makeBuffer(w, h, 250, 250, 250);
    for (let x = 22; x <= 74; x += 12) {
      paintRect(flatBuf, x, 16, 4, 16, 15, 15, 15);
    }
    const flatPatch = EraseMasker.buildPatch(
      { data: flatBuf.data, width: w, height: h } as ImageData,
      0,
      0,
      '#fafafa',
      undefined,
      undefined,
      undefined,
      { x0: 16, y0: 12, x1: 84, y1: 36 }
    );
    expect(flatPatch).not.toBeNull();
    expect(flatPatch!.dbg?.path).toBe('flat');
    const fp = flatPatch!.pixels as Uint8ClampedArray;
    for (let i = 3; i < fp.length; i += 4) {
      expect(fp[i] === 0 || fp[i] === 255).toBe(true);
    }

    // BubbleFiller -> must stay strictly 0 or 255 (no feathering)
    const bubbleBuf = makeBuffer(120, 120, 40, 40, 40);
    drawClippedOval(bubbleBuf, 60, 60, 42, 34, false);
    paintGlyphBand(bubbleBuf, 36, 52, 84, 16, 15);
    const bubblePatch = BubbleFiller.buildBubblePatch(
      { data: bubbleBuf.data, width: 120, height: 120 } as ImageData,
      0,
      0,
      [{ x: 30, y: 45, width: 60, height: 30 }]
    );
    expect(bubblePatch).not.toBeNull();
    const bp = bubblePatch!.pixels as Uint8ClampedArray;
    for (let i = 3; i < bp.length; i += 4) {
      expect(bp[i] === 0 || bp[i] === 255).toBe(true);
    }
  });
});
