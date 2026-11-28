import { describe, expect, it } from 'vitest';
import { LineSegmenter } from '../../src/worker/line-segmenter';
import { BubbleWallDetector, PagePixelBuffer } from '../../src/worker/bubble-wall-detector';
import { BubbleAggregator } from '../../src/worker/bubble-aggregator';
import { attachErasePatches } from '../../src/worker/erase-pipeline';
import { ComicDetEngine } from '../../src/worker/comic-det';
import { ChamberGapScanner } from '../../src/worker/chamber-gap-scanner';
import { BubbleChamberExtractor } from '../../src/worker/bubble-chamber';
import { BoundingBox, DialogueItem } from '../../src/shared/types';

function makeBuffer(width: number, height: number, r = 255, g = 255, b = 255): PagePixelBuffer {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
    data[i + 3] = 255;
  }
  return { data, width, height };
}

function paintRectRgb(
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

function paintGlyphBand(
  buf: PagePixelBuffer,
  x0: number,
  y0: number,
  x1: number,
  h: number,
  luma: number
): void {
  for (let y = y0; y < y0 + h; y++) {
    for (let x = x0; x <= x1; x += 5) {
      paintRectRgb(buf, x, y, 2, 1, luma, luma, luma);
    }
  }
}

function makeMockCanvas(buf: PagePixelBuffer): {
  canvas: OffscreenCanvas;
  ctx: OffscreenCanvasRenderingContext2D;
} {
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
  const canvas = {
    width: buf.width,
    height: buf.height,
    getContext: () => ctx
  } as unknown as OffscreenCanvas;
  return { canvas, ctx };
}

describe('LineSegmenter cloud & tight-box regression', () => {
  it('tightens 3-line dark text on pale-grey #d4d6e0 cloud over #ffffff white without dragging cloud wisps', () => {
    const buf = makeBuffer(440, 220, 255, 255, 255);
    // Wide pale-grey cloud (#d4d6e0 -> luma ~213) spanning across x=40..400, y=36..170
    paintRectRgb(buf, 40, 36, 360, 134, 0xd4, 0xd6, 0xe0);
    // Softer inner cloud aura (~186 luma) spanning wide on line 3 too
    paintRectRgb(buf, 55, 48, 330, 110, 0xb8, 0xbc, 0xc8);

    // 3 stacked dark lines (luma 24); line 3 is intentionally < 45% of box width (110px in 320px box)
    paintGlyphBand(buf, 130, 56, 280, 16, 24); // w=151
    paintGlyphBand(buf, 90, 84, 340, 16, 24);  // w=251
    paintGlyphBand(buf, 150, 112, 260, 16, 24); // w=111

    const { ctx } = makeMockCanvas(buf);
    const box: BoundingBox = { x: 60, y: 42, width: 320, height: 112, confidence: 0.9, kind: 'dialogue' };
    const lines = LineSegmenter.segmentLines(ctx, box, buf.width, buf.height);

    expect(lines).toHaveLength(3);
    // Line 3 must tighten strictly around [150..260] + padX instead of expanding across the 320px cloud
    expect(lines[2].x).toBeGreaterThanOrEqual(140);
    expect(lines[2].x + lines[2].width).toBeLessThanOrEqual(272);
    expect(lines[2].width).toBeLessThan(145);
  });

  it('pads tight left/right boxes flush to first/last glyph without crossing a bubble wall', () => {
    // 1) Open paper: tight box flush to glyphs on both edges (r.x0 === 0, r.x1 === w - 1)
    const openBuf = makeBuffer(240, 120, 255, 255, 255);
    paintGlyphBand(openBuf, 40, 20, 198, 16, 18);
    paintGlyphBand(openBuf, 40, 48, 198, 16, 18);

    const { ctx: openCtx } = makeMockCanvas(openBuf);
    const tightBox: BoundingBox = { x: 40, y: 16, width: 160, height: 54, kind: 'dialogue' };
    const openLines = LineSegmenter.segmentLines(openCtx, tightBox, openBuf.width, openBuf.height);

    expect(openLines).toHaveLength(2);
    expect(openLines[0].x).toBeLessThan(tightBox.x);
    expect(openLines[0].x).toBeGreaterThanOrEqual(tightBox.x - 7);
    expect(openLines[0].x + openLines[0].width).toBeGreaterThan(tightBox.x + tightBox.width);

    // 2) Nearby 3px black vertical bubble border 3px outside left/right box edges
    const walledBuf = makeBuffer(240, 120, 255, 255, 255);
    paintRectRgb(walledBuf, 34, 4, 3, 90, 10, 10, 10);  // left border at x=34..36
    paintRectRgb(walledBuf, 203, 4, 3, 90, 10, 10, 10); // right border at x=203..205
    paintGlyphBand(walledBuf, 40, 20, 198, 16, 18);
    paintGlyphBand(walledBuf, 40, 48, 198, 16, 18);

    const { ctx: walledCtx } = makeMockCanvas(walledBuf);
    const walledLines = LineSegmenter.segmentLines(walledCtx, tightBox, walledBuf.width, walledBuf.height);

    expect(walledLines).toHaveLength(2);
    expect(walledLines[0].x).toBeGreaterThan(36); // never crosses left border
    expect(walledLines[0].x + walledLines[0].width).toBeLessThanOrEqual(203); // never crosses right border
  });
});

describe('BubbleWallDetector pale-grey cloud regression', () => {
  it('merges stacked lines on a #d4d6e0 cloud over #ffffff white panel (06_1_3 pattern)', () => {
    const buf = makeBuffer(400, 240, 255, 255, 255);
    // Cloud background (#d4d6e0) + softer interior (#b8bcc8, luma ~186) while box corners hit 255 white
    paintRectRgb(buf, 85, 45, 230, 125, 0xd4, 0xd6, 0xe0);
    paintRectRgb(buf, 100, 60, 200, 95, 0xb8, 0xbc, 0xc8);

    const l1: BoundingBox = { x: 110, y: 50, width: 180, height: 16, kind: 'dialogue' };
    const l2: BoundingBox = { x: 75, y: 76, width: 250, height: 16, kind: 'dialogue' };
    const l3: BoundingBox = { x: 120, y: 102, width: 160, height: 16, kind: 'dialogue' };

    expect(BubbleWallDetector.hasHorizontalWallBetween(buf, l1, l2)).toBe(false);
    expect(BubbleWallDetector.hasHorizontalWallBetween(buf, l2, l3)).toBe(false);

    const items: DialogueItem[] = [
      { id: 'c1', box: l1, originalText: "I'M FACING THE", kind: 'dialogue' },
      { id: 'c2', box: l2, originalText: 'GREATEST CRISIS OF MY', kind: 'dialogue' },
      { id: 'c3', box: l3, originalText: 'ENTIRE LIFE.', kind: 'dialogue' }
    ];
    const bubbles = BubbleAggregator.aggregateDialogues(items, buf.width, buf.height, undefined, buf);
    expect(bubbles).toHaveLength(1);
    expect(bubbles[0].originalText).toBe("I'M FACING THE GREATEST CRISIS OF MY ENTIRE LIFE.");
  });

  it('still detects dark gutters and high-variance textured panel art between light bubbles', () => {
    const gutterBuf = makeBuffer(300, 220, 255, 255, 255);
    paintRectRgb(gutterBuf, 0, 90, 300, 24, 90, 90, 90);
    const topBox = { x: 70, y: 55, width: 160, height: 26 };
    const botBox = { x: 70, y: 122, width: 160, height: 26 };
    expect(BubbleWallDetector.hasHorizontalWallBetween(gutterBuf, topBox, botBox)).toBe(true);

    const artBuf = makeBuffer(300, 220, 255, 255, 255);
    // High-variance foliage/hatching band (mean ~157 >= 155, stddev ~61 > 25)
    for (let y = 90; y < 114; y++) {
      for (let x = 0; x < 300; x++) {
        const v = (x + y) % 3 === 0 ? 70 : 200;
        paintRectRgb(artBuf, x, y, 1, 1, v, v, v);
      }
    }
    expect(BubbleWallDetector.hasHorizontalWallBetween(artBuf, topBox, botBox)).toBe(true);
  });
});

describe('ErasePipeline tall chamber & touching-box regression', () => {
  it('recovers chamberBox for a 250px tall vertical oval bubble around short stacked lines', () => {
    const w = 400;
    const h = 420;
    const buf = makeBuffer(w, h, 45, 45, 45);
    // Draw 240x250 oval white bubble centered at (200, 210) with 4px black border
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const dx = (x - 200) / 115;
        const dy = (y - 210) / 125;
        const d2 = dx * dx + dy * dy;
        if (d2 <= 0.94) paintRectRgb(buf, x, y, 1, 1, 252, 252, 252);
        else if (d2 <= 1.06) paintRectRgb(buf, x, y, 1, 1, 12, 12, 12);
      }
    }
    paintGlyphBand(buf, 120, 184, 280, 16, 15);
    paintGlyphBand(buf, 110, 210, 290, 16, 15);

    const items: DialogueItem[] = [
      { id: 't1', box: { x: 118, y: 184, width: 164, height: 16, kind: 'dialogue' }, originalText: 'FIRST LINE', kind: 'dialogue' },
      { id: 't2', box: { x: 108, y: 210, width: 184, height: 16, kind: 'dialogue' }, originalText: 'SECOND LINE', kind: 'dialogue' }
    ];
    const { canvas } = makeMockCanvas(buf);
    attachErasePatches(canvas, items, undefined, buf);

    expect(items[0].chamberBox).toBeDefined();
    expect(items[0].chamberBox!.height).toBeGreaterThanOrEqual(215);
    expect(items[0].isOvalChamber).toBe(true);
    expect(items[0].bubblePatch).toBeDefined();
    expect(items[1].chamberBox).toEqual(items[0].chamberBox);
  });

  it('guards against merged chamberBox and bubblePatch across touching double boxes (09_2_3 pattern)', () => {
    const w = 520;
    const h = 420;
    const buf = makeBuffer(w, h, 80, 110, 70);
    // Box A: x=60..280, y=50..200; Box B: x=200..440, y=160..320 (joined interior, no wall between them)
    paintRectRgb(buf, 57, 47, 226, 156, 15, 15, 15);
    paintRectRgb(buf, 197, 157, 246, 166, 15, 15, 15);
    paintRectRgb(buf, 60, 50, 220, 150, 252, 252, 252);
    paintRectRgb(buf, 200, 160, 240, 160, 252, 252, 252);

    paintGlyphBand(buf, 90, 100, 240, 16, 15);
    paintGlyphBand(buf, 230, 230, 400, 16, 15);

    const items: DialogueItem[] = [
      { id: 'd1', box: { x: 90, y: 100, width: 150, height: 16, kind: 'dialogue' }, originalText: 'WHEN I OPENED', kind: 'dialogue' },
      { id: 'd2', box: { x: 230, y: 230, width: 170, height: 16, kind: 'dialogue' }, originalText: 'I FOUND MYSELF', kind: 'dialogue' }
    ];
    const { canvas } = makeMockCanvas(buf);
    attachErasePatches(canvas, items, undefined, buf);

    expect(items[0].bubbleClusterId).not.toBe(items[1].bubbleClusterId);
    expect(items[0].chamberBox).toBeUndefined();
    expect(items[1].chamberBox).toBeUndefined();
    expect(items[0].bubblePatch).toBeUndefined();
    expect(items[1].bubblePatch).toBeUndefined();
    expect(items[0].erasePatch).toBeDefined();
    expect(items[1].erasePatch).toBeDefined();
  });

  it('rejects extreme one-sided starburst lobe leaks in BubbleChamberExtractor and encroaching chambers in ErasePipeline', () => {
    const w = 520;
    const h = 420;
    const buf = makeBuffer(w, h, 200, 200, 200);
    // Asymmetric double-lobe chamber: narrow left lobe around text + huge 175px right lobe leak
    paintRectRgb(buf, 66, 56, 368, 208, 12, 12, 12);
    paintRectRgb(buf, 70, 60, 360, 200, 252, 252, 252);
    const smallText: BoundingBox = { x: 105, y: 120, width: 130, height: 32, kind: 'dialogue' };
    paintGlyphBand(buf, 110, 124, 230, 18, 15);

    const leaked = BubbleChamberExtractor.extractChamber(buf, 0, 0, smallText);
    expect(leaked).toBeNull();

    // Encroaching chamber touching a second bubble's box by >= 8px
    const items: DialogueItem[] = [
      { id: 's1', box: smallText, originalText: 'IS THAT..?', kind: 'dialogue' },
      { id: 's2', box: { x: 250, y: 245, width: 150, height: 40, kind: 'dialogue' }, originalText: 'AN EXIT!', kind: 'dialogue' }
    ];
    paintGlyphBand(buf, 260, 252, 390, 20, 15);
    const { canvas } = makeMockCanvas(buf);
    attachErasePatches(canvas, items, undefined, buf);
    expect(items[0].chamberBox).toBeUndefined();
  });
});

describe('ComicDetEngine overlap NMS & ChamberGapScanner starburst rim rejection', () => {
  it('suppresses overlapping/containing lower-confidence duplicate RT-DETR boxes (05_1_2 & 11_3_2)', () => {
    const kept05 = ComicDetEngine.suppressOverlappingBoxes([
      { x: 235, y: 601, width: 246, height: 39, confidence: 0.683, kind: 'dialogue' },
      { x: 261, y: 612, width: 194, height: 16, confidence: 0.929, kind: 'dialogue' },
      { x: 246, y: 638, width: 225, height: 16, confidence: 0.929, kind: 'dialogue' }
    ]);
    expect(kept05).toHaveLength(2);
    expect(kept05.every((b) => (b.confidence ?? 0) > 0.9)).toBe(true);

    const kept11 = ComicDetEngine.suppressOverlappingBoxes([
      { x: 269, y: 753, width: 181, height: 15, confidence: 0.295, kind: 'dialogue' },
      { x: 284, y: 761, width: 153, height: 16, confidence: 0.896, kind: 'dialogue' },
      { x: 278, y: 786, width: 165, height: 16, confidence: 0.896, kind: 'dialogue' }
    ]);
    expect(kept11).toHaveLength(2);
    expect(kept11.every((b) => (b.confidence ?? 0) > 0.8)).toBe(true);
  });

  it('rejects radial starburst spike rims attached to the outer burst ring (26_8_2) while keeping interior lines', () => {
    const w = 280;
    const h = 240;
    const buf = makeBuffer(w, h, 255, 255, 255);
    // Draw starburst chamber x=30..250, y=30..200 with solid dark outer ring + inward spikes on y=172..195
    paintRectRgb(buf, 30, 30, 220, 170, 12, 12, 12);
    paintRectRgb(buf, 36, 36, 208, 158, 254, 254, 254);
    for (let x = 44; x <= 236; x += 6) {
      for (let y = 172; y <= 194; y++) {
        const halfW = y >= 186 ? 2 : y >= 179 ? 1 : 0;
        paintRectRgb(buf, x - halfW, y, halfW * 2 + 1, 1, 14, 14, 14);
      }
    }
    paintGlyphBand(buf, 75, 80, 205, 20, 14);
    const existing: BoundingBox[] = [{ x: 72, y: 78, width: 136, height: 24, kind: 'dialogue' }];

    const recovered = ChamberGapScanner.recoverMissedLines(buf, existing);
    expect(recovered).toHaveLength(0);
  });

  it('preserves low-confidence non-overlapping hatching/fuchidori dialogue boxes in suppressOverlappingBoxes (14_4_2 & 29_9_2)', () => {
    const kept = ComicDetEngine.suppressOverlappingBoxes([
      { x: 238, y: 1302, width: 245, height: 16, confidence: 0.176, kind: 'dialogue' },
      { x: 190, y: 1328, width: 341, height: 16, confidence: 0.176, kind: 'dialogue' },
      { x: 112, y: 1425, width: 231, height: 16, confidence: 0.193, kind: 'dialogue' }
    ]);
    expect(kept).toHaveLength(3);
  });
});
