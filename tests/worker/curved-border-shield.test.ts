import { describe, expect, it } from 'vitest';
import { BubbleAggregator } from '../../src/worker/bubble-aggregator';
import { BubbleChamberExtractor } from '../../src/worker/bubble-chamber';
import { BubbleFiller } from '../../src/worker/bubble-filler';
import { EraseMasker } from '../../src/worker/erase-masker';
import { DialogueItem, ErasePatch } from '../../src/shared/types';

function makeCanvasBuffer(w: number, h: number, fill = 252): Uint8ClampedArray {
  const data = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    const p = i * 4;
    data[p] = fill;
    data[p + 1] = fill;
    data[p + 2] = fill;
    data[p + 3] = 255;
  }
  return data;
}

function setPixel(data: Uint8ClampedArray, w: number, x: number, y: number, v: number): void {
  const p = (y * w + x) * 4;
  data[p] = v;
  data[p + 1] = v;
  data[p + 2] = v;
  data[p + 3] = 255;
}

function lumaAt(px: Uint8ClampedArray, w: number, x: number, y: number): number {
  const p = (y * w + x) * 4;
  return (px[p] * 299 + px[p + 1] * 587 + px[p + 2] * 114) / 1000;
}

describe('computeCurvedBorderShield & EraseMasker curved border protection', () => {
  it('erases "An" inside a 140x170 pear-shaped bubble without touching 3px curved/slanted walls', () => {
    const w = 140;
    const h = 170;
    const data = makeCanvasBuffer(w, h, 200);

    const leftWall = (y: number) => Math.round(46 - 26 * Math.sin(Math.PI * Math.pow(y / (h - 1), 1.3)));
    const rightWall = (y: number) => Math.round(94 + 26 * Math.sin(Math.PI * Math.pow(y / (h - 1), 1.3)));

    const borderPixels: Array<[number, number]> = [];
    for (let y = 0; y < h; y++) {
      const lx = leftWall(y);
      const rx = rightWall(y);
      for (let x = lx + 3; x <= rx - 3; x++) {
        setPixel(data, w, x, y, 252);
      }
      for (let dx = 0; dx < 3; dx++) {
        setPixel(data, w, lx + dx, y, 18);
        setPixel(data, w, rx - dx, y, 18);
        borderPixels.push([lx + dx, y], [rx - dx, y]);
      }
    }

    // Draw "An" glyph strokes in center (x=54..84, y=72..100)
    const glyphPixels: Array<[number, number]> = [];
    // 'A' left & right legs + crossbar
    for (let y = 74; y <= 98; y++) {
      for (let dx = 0; dx < 3; dx++) {
        setPixel(data, w, 56 + dx, y, 18);
        setPixel(data, w, 65 + dx, y, 18);
        glyphPixels.push([56 + dx, y], [65 + dx, y]);
      }
    }
    for (let x = 58; x <= 66; x++) {
      for (let y = 86; y <= 88; y++) {
        setPixel(data, w, x, y, 18);
        glyphPixels.push([x, y]);
      }
    }
    // 'n' two stems + top bar
    for (let y = 80; y <= 98; y++) {
      for (let dx = 0; dx < 3; dx++) {
        setPixel(data, w, 73 + dx, y, 18);
        setPixel(data, w, 82 + dx, y, 18);
        glyphPixels.push([73 + dx, y], [82 + dx, y]);
      }
    }
    for (let x = 75; x <= 83; x++) {
      for (let y = 80; y <= 82; y++) {
        setPixel(data, w, x, y, 18);
        glyphPixels.push([x, y]);
      }
    }

    // Bloated innerRect crossing both slanted right wall and top/bottom left shoulders
    const patch = EraseMasker.buildPatch(
      { data, width: w, height: h } as ImageData,
      0,
      0,
      '#fcfcfc',
      undefined,
      undefined,
      undefined,
      { x0: 28, y0: 20, x1: 112, y1: 150 }
    );

    expect(patch).not.toBeNull();
    const out = patch!.pixels as Uint8ClampedArray;

    for (const [gx, gy] of glyphPixels) {
      const idx = (gy * w + gx) * 4;
      expect(out[idx + 3]).toBe(255);
      expect(lumaAt(out, w, gx, gy)).toBeGreaterThan(240);
    }

    for (const [bx, by] of borderPixels) {
      expect(out[(by * w + bx) * 4 + 3]).toBe(0);
    }
  });

  it('erases innerRect line (including trailing letters at rx0/rx1) while keeping neighboring upper line untouched', () => {
    const w = 110;
    const h = 50;
    const data = makeCanvasBuffer(w, h, 252);

    // Side border on left (x=5..7)
    for (let y = 0; y < h; y++) {
      for (let x = 5; x <= 7; x++) setPixel(data, w, x, y, 18);
    }

    // Line 1 at y=2..10
    const line1Pixels: Array<[number, number]> = [];
    for (let y = 2; y <= 10; y++) {
      for (let x = 22; x <= 86; x += 8) {
        setPixel(data, w, x, y, 18);
        setPixel(data, w, x + 1, y, 18);
        line1Pixels.push([x, y], [x + 1, y]);
      }
    }

    // Whitespace at y=11..15, Line 2 innerRect at y=16..38 with trailing letters at rx0=16 and rx1=94
    const innerRect = { x0: 16, y0: 16, x1: 94, y1: 38 };
    const line2Pixels: Array<[number, number]> = [];
    for (let y = 18; y <= 35; y++) {
      for (const x of [16, 30, 50, 72, 92]) {
        setPixel(data, w, x, y, 18);
        setPixel(data, w, x + 1, y, 18);
        line2Pixels.push([x, y], [x + 1, y]);
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
      innerRect
    );

    expect(patch).not.toBeNull();
    const out = patch!.pixels as Uint8ClampedArray;

    for (const [gx, gy] of line2Pixels) {
      const idx = (gy * w + gx) * 4;
      expect(out[idx + 3]).toBe(255);
      expect(lumaAt(out, w, gx, gy)).toBeGreaterThan(240);
    }
    for (const [nx, ny] of line1Pixels) {
      expect(out[(ny * w + nx) * 4 + 3]).toBe(0);
    }
  });

  it('erases a 3px glyph stem welded onto the inner face of a curved 3px border while keeping border intact', () => {
    const w = 120;
    const h = 120;
    const data = makeCanvasBuffer(w, h, 195);

    const wallX = (y: number) => Math.round(98 - 16 * Math.sin((Math.PI * y) / (h - 1)));
    const borderPixels: Array<[number, number]> = [];

    for (let y = 0; y < h; y++) {
      const rx = wallX(y);
      for (let x = 21; x < rx; x++) setPixel(data, w, x, y, 252);
      for (let dx = 0; dx < 3; dx++) {
        setPixel(data, w, 18 + dx, y, 18);
        setPixel(data, w, rx + dx, y, 18);
        borderPixels.push([18 + dx, y], [rx + dx, y]);
      }
    }

    // Center glyph strokes + 3px stem welded onto inner face at y=58..60 (wallX(59) = 82)
    for (let y = 46; y <= 66; y++) {
      for (let dx = 0; dx < 3; dx++) {
        setPixel(data, w, 45 + dx, y, 18);
        setPixel(data, w, 58 + dx, y, 18);
      }
    }
    for (let y = 58; y <= 60; y++) {
      const rx = wallX(y);
      for (let x = 70; x < rx; x++) {
        setPixel(data, w, x, y, 18);
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
      { x0: 34, y0: 40, x1: 84, y1: 72 }
    );

    expect(patch).not.toBeNull();
    const out = patch!.pixels as Uint8ClampedArray;

    // Welded stem body (x=72..78, y=59) must be erased
    for (let x = 72; x <= 78; x++) {
      const idx = (59 * w + x) * 4;
      expect(out[idx + 3]).toBe(255);
      expect(lumaAt(out, w, x, 59)).toBeGreaterThan(240);
    }

    // Every 3px curved border pixel must remain untouched (alpha === 0)
    for (const [bx, by] of borderPixels) {
      expect(out[(by * w + bx) * 4 + 3]).toBe(0);
    }
  });
});

describe('BubbleAggregator bubblePatch priority', () => {
  const mkPatch = (x: number, y: number, width: number, height: number): ErasePatch => ({
    x,
    y,
    width,
    height,
    pixels: 'RLE:mock'
  });

  it('uses [bubblePatch] alone in buildBubble when bubblePatch encloses all lineBoxes by >= 8px', () => {
    const bubblePatch = mkPatch(80, 80, 240, 140);
    const items: DialogueItem[] = [
      {
        id: 'l1',
        box: { x: 100, y: 100, width: 180, height: 30 },
        originalText: 'FIRST LINE',
        erasePatch: mkPatch(88, 88, 204, 54),
        bubblePatch
      },
      {
        id: 'l2',
        box: { x: 100, y: 145, width: 180, height: 30 },
        originalText: 'SECOND LINE',
        erasePatch: mkPatch(88, 133, 204, 54),
        bubblePatch
      }
    ];

    const out = BubbleAggregator.aggregateDialogues(items, 800, 1200);
    expect(out).toHaveLength(1);
    expect(out[0].erasePatches).toEqual([bubblePatch]);
  });

  it('falls back to [...linePatches, bubblePatch] when bubblePatch margin is < 8px', () => {
    const lp1 = mkPatch(88, 88, 204, 54);
    const lp2 = mkPatch(88, 133, 204, 54);
    const tightBubblePatch = mkPatch(96, 96, 190, 90);
    const items: DialogueItem[] = [
      {
        id: 'l1',
        box: { x: 100, y: 100, width: 180, height: 30 },
        originalText: 'FIRST LINE',
        erasePatch: lp1,
        bubblePatch: tightBubblePatch
      },
      {
        id: 'l2',
        box: { x: 100, y: 145, width: 180, height: 30 },
        originalText: 'SECOND LINE',
        erasePatch: lp2,
        bubblePatch: tightBubblePatch
      }
    ];

    const out = BubbleAggregator.aggregateDialogues(items, 800, 1200);
    expect(out).toHaveLength(1);
    expect(out[0].erasePatches).toEqual([lp1, lp2, tightBubblePatch]);
  });

  it('uses [bubblePatch] alone in enrichSingleItem when enclosing by >= 8px, and [erasePatch, bubblePatch] otherwise', () => {
    const wideBubblePatch = mkPatch(80, 80, 140, 100);
    const linePatch = mkPatch(88, 88, 120, 50);
    const enclosed = BubbleAggregator.aggregateDialogues(
      [
        {
          id: 's1',
          box: { x: 100, y: 100, width: 80, height: 40 },
          originalText: 'An',
          erasePatch: linePatch,
          bubblePatch: wideBubblePatch
        }
      ],
      800,
      1200
    );
    expect(enclosed[0].erasePatches).toEqual([wideBubblePatch]);

    const tightBubblePatch = mkPatch(95, 95, 95, 55);
    const unenclosed = BubbleAggregator.aggregateDialogues(
      [
        {
          id: 's2',
          box: { x: 100, y: 100, width: 80, height: 40 },
          originalText: 'An',
          erasePatch: linePatch,
          bubblePatch: tightBubblePatch
        }
      ],
      800,
      1200
    );
    expect(unenclosed[0].erasePatches).toEqual([linePatch, tightBubblePatch]);
  });

  it('preserves linePatches in BubbleAggregator when BubbleFiller leaves a >10px wall-welded bold glyph unpainted', () => {
    const w = 120, h = 100;
    const data = makeCanvasBuffer(w, h, 252);
    const borderPixels: Array<[number, number]> = [];
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const d = Math.hypot((x - 60) / 46, (y - 50) / 40);
        if (d > 1.02) setPixel(data, w, x, y, 200);
        else if (d >= 0.93) {
          setPixel(data, w, x, y, 18);
          borderPixels.push([x, y]);
        }
      }
    }
    // Bold 14px-thick glyph block (x=86..101, y=42..56) welded onto right inner wall
    const boldPixels: Array<[number, number]> = [];
    for (let y = 42; y <= 56; y++) {
      for (let x = 86; x <= 101; x++) {
        setPixel(data, w, x, y, 18);
        boldPixels.push([x, y]);
      }
    }
    const lineBox = { x: 40, y: 38, width: 62, height: 24 };
    const chamberBox = { x: 14, y: 10, width: 92, height: 80 };
    const bubblePatch = BubbleFiller.buildBubblePatch({ data, width: w, height: h } as ImageData, 0, 0, [lineBox], chamberBox);
    expect(bubblePatch).not.toBeNull();
    expect(bubblePatch!.dbg?.coversLineInk).toBe(false);

    const erasePatch = EraseMasker.buildPatch(
      { data, width: w, height: h } as ImageData,
      0,
      0,
      '#fcfcfc',
      undefined,
      undefined,
      undefined,
      { x0: lineBox.x, y0: lineBox.y, x1: lineBox.x + lineBox.width, y1: lineBox.y + lineBox.height }
    );
    expect(erasePatch).not.toBeNull();

    const out = BubbleAggregator.aggregateDialogues(
      [{ id: 'bold', box: lineBox, originalText: 'BOLD', erasePatch: erasePatch!, bubblePatch: bubblePatch! }],
      w,
      h
    );
    expect(out[0].erasePatches).toEqual([erasePatch, bubblePatch]);

    // Composite both patches and verify bold welded glyph is erased while border remains intact
    const comp = new Uint8ClampedArray(data);
    for (const p of out[0].erasePatches!) {
      const px = p.pixels as Uint8ClampedArray;
      for (let i = 0; i < w * h; i++) {
        if (px[i * 4 + 3] > 0) comp.set([px[i * 4], px[i * 4 + 1], px[i * 4 + 2], 255], i * 4);
      }
    }
    expect(lumaAt(comp, w, 92, 49)).toBeGreaterThan(240);
    for (const [bx, by] of borderPixels) expect(lumaAt(comp, w, bx, by)).toBeLessThan(80);
  });
});

describe('Audit edge cases: external hair, oval shoulders, soft borders, chamberBox, and localQuad', () => {
  it('shields right border despite partial external dark hair (<50% rows), shallow Euclidean oval shoulder, and dark-bg oval', () => {
    // 1a. Partial external dark hair on top 45/120 rows
    const w = 120, h = 120;
    const data1 = makeCanvasBuffer(w, h, 252);
    const border1: Array<[number, number]> = [];
    for (let y = 0; y < h; y++) {
      for (let dx = 0; dx < 3; dx++) {
        setPixel(data1, w, 90 + dx, y, 18);
        border1.push([90 + dx, y]);
      }
      if (y < 45) for (let x = 93; x < w; x++) setPixel(data1, w, x, y, 18);
    }
    for (let y = 40; y <= 65; y++) for (let x = 40; x <= 82; x += 6) setPixel(data1, w, x, y, 18);
    const p1 = EraseMasker.buildPatch({ data: data1, width: w, height: h } as ImageData, 0, 0, '#fcfcfc', undefined, undefined, undefined, { x0: 36, y0: 36, x1: 93, y1: 72 });
    expect(p1).not.toBeNull();
    const out1 = p1!.pixels as Uint8ClampedArray;
    for (const [bx, by] of border1) expect(out1[(by * w + bx) * 4 + 3]).toBe(0);

    // 1c. Shallow Euclidean 3px oval shoulder touching top/bottom crop edges
    const data2 = makeCanvasBuffer(w, 80, 252);
    const border2: Array<[number, number]> = [];
    for (let y = 0; y < 80; y++) {
      for (let x = 0; x < w; x++) {
        const d = Math.hypot((x - 60) / 56, (y - 40) / 40);
        if (d >= 0.91 && d <= 1.0) {
          setPixel(data2, w, x, y, 18);
          border2.push([x, y]);
        }
      }
    }
    for (let y = 20; y <= 50; y++) for (let x = 35; x <= 85; x += 7) setPixel(data2, w, x, y, 18);
    const p2 = EraseMasker.buildPatch({ data: data2, width: w, height: 80 } as ImageData, 0, 0, '#fcfcfc', undefined, undefined, undefined, { x0: 20, y0: 8, x1: 100, y1: 60 });
    expect(p2).not.toBeNull();
    const out2 = p2!.pixels as Uint8ClampedArray;
    for (const [bx, by] of border2) expect(out2[(by * w + bx) * 4 + 3]).toBe(0);

    // 1b. Dark-bg (22) oval bubble with light text (245) and light outer surround (240)
    const data3 = makeCanvasBuffer(w, 100, 240);
    const border3: Array<[number, number]> = [];
    for (let y = 0; y < 100; y++) {
      for (let x = 0; x < w; x++) {
        const d = Math.hypot((x - 60) / 48, (y - 50) / 40);
        if (d < 0.91) setPixel(data3, w, x, y, 22);
        else if (d <= 1.0) {
          setPixel(data3, w, x, y, 240);
          border3.push([x, y]);
        }
      }
    }
    for (let y = 35; y <= 60; y++) for (let x = 35; x <= 82; x += 6) setPixel(data3, w, x, y, 245);
    const p3 = EraseMasker.buildPatch({ data: data3, width: w, height: 100 } as ImageData, 0, 0, '#161616', undefined, undefined, undefined, { x0: 20, y0: 15, x1: 100, y1: 85 });
    expect(p3).not.toBeNull();
    const out3 = p3!.pixels as Uint8ClampedArray;
    expect(out3[(45 * w + 35) * 4 + 3]).toBe(255);
    expect(lumaAt(out3, w, 35, 45)).toBeLessThan(40);
    for (const [bx, by] of border3) expect(out3[(by * w + bx) * 4 + 3]).toBe(0);
  });

  it('shields soft grey border (luma 205 on 252 paper) even with blurred tm=0.65 adjacent to it', () => {
    const w = 100, h = 80;
    const data = makeCanvasBuffer(w, h, 252);
    const border: Array<[number, number]> = [];
    for (let y = 0; y < h; y++) {
      for (let dx = 0; dx < 3; dx++) {
        setPixel(data, w, 82 + dx, y, 205);
        border.push([82 + dx, y]);
      }
    }
    for (let y = 24; y <= 50; y++) for (let x = 25; x <= 74; x += 7) setPixel(data, w, x, y, 20);
    const tm = new Float32Array(w * h);
    for (let y = 20; y <= 56; y++) for (let x = 20; x <= 86; x++) tm[y * w + x] = 0.65;

    const patch = EraseMasker.buildPatch({ data, width: w, height: h } as ImageData, 0, 0, '#fcfcfc', tm, w, undefined, { x0: 22, y0: 20, x1: 85, y1: 56 });
    expect(patch).not.toBeNull();
    const out = patch!.pixels as Uint8ClampedArray;
    expect(out[(35 * w + 25) * 4 + 3]).toBe(255);
    for (const [bx, by] of border) expect(out[(by * w + bx) * 4 + 3]).toBe(0);
  });

  it('shields border 3px above innerRect and slanted wall crossing midX of bloated innerRect', () => {
    const w = 120, h = 140;
    const data = makeCanvasBuffer(w, h, 252);
    const border: Array<[number, number]> = [];
    // Top arch 3px above innerRect.y0=20 (arch at y=14..16, curving down sides)
    for (let x = 15; x <= 105; x++) {
      for (let dy = 0; dy < 3; dy++) {
        setPixel(data, w, x, 14 + dy, 18);
        border.push([x, 14 + dy]);
      }
    }
    for (let y = 14; y < h; y++) {
      const rx = Math.round(105 - (y / h) * 50); // slants from 105 down to 55 (crosses midX=64!)
      for (let dx = 0; dx < 3; dx++) {
        setPixel(data, w, rx + dx, y, 18);
        border.push([rx + dx, y]);
      }
      for (let x = rx + 3; x < w; x++) setPixel(data, w, x, y, 200);
    }
    for (let y = 22; y <= 45; y++) for (let x = 25; x <= 55; x += 6) setPixel(data, w, x, y, 18);

    const patch = EraseMasker.buildPatch({ data, width: w, height: h } as ImageData, 0, 0, '#fcfcfc', undefined, undefined, undefined, { x0: 18, y0: 20, x1: 110, y1: 110 });
    expect(patch).not.toBeNull();
    const out = patch!.pixels as Uint8ClampedArray;
    expect(out[(30 * w + 25) * 4 + 3]).toBe(255);
    for (const [bx, by] of border) expect(out[(by * w + bx) * 4 + 3]).toBe(0);
  });

  it('builds non-null BubbleFiller patch for spacious "An" 140x170 pear bubble when chamberBox is supplied', () => {
    const w = 140, h = 170;
    const data = makeCanvasBuffer(w, h, 200);
    for (let y = 12; y <= 158; y++) {
      const t = (y - 12) / 146;
      const halfW = Math.round(24 + 32 * Math.sin(Math.PI * Math.pow(t, 0.85)));
      for (let x = 70 - halfW; x <= 70 + halfW; x++) {
        const onEdge = x <= 70 - halfW + 2 || x >= 70 + halfW - 2 || y <= 14 || y >= 156;
        setPixel(data, w, x, y, onEdge ? 18 : 252);
      }
    }
    const lineBox = { x: 56, y: 74, width: 28, height: 22 };
    for (let y = 76; y <= 94; y++) {
      setPixel(data, w, 62, y, 18);
      setPixel(data, w, 76, y, 18);
    }
    const chamber = BubbleChamberExtractor.extractChamber({ data, width: w, height: h }, 0, 0, lineBox);
    expect(chamber).not.toBeNull();

    const patch = BubbleFiller.buildBubblePatch({ data, width: w, height: h } as ImageData, 0, 0, [lineBox], chamber!.chamberBox);
    expect(patch).not.toBeNull();
    const out = patch!.pixels as Uint8ClampedArray;
    expect(out[(85 * w + 62) * 4 + 3]).toBe(255);
    expect(out[(4 * w + 4) * 4 + 3]).toBe(0);
  });

  it('respects localQuad clipping even when innerRect is also passed', () => {
    const w = 100, h = 80;
    const data = makeCanvasBuffer(w, h, 252);
    // Target stroke inside quad, plus dark art inside innerRect but outside localQuad
    for (let y = 32; y <= 48; y++) for (let x = 42; x <= 58; x += 4) setPixel(data, w, x, y, 18);
    setPixel(data, w, 20, 20, 18);
    setPixel(data, w, 21, 20, 18);
    setPixel(data, w, 20, 21, 18);

    const localQuad: [number, number][] = [[35, 28], [65, 28], [65, 52], [35, 52]];
    const patch = EraseMasker.buildPatch(
      { data, width: w, height: h } as ImageData,
      0,
      0,
      '#fcfcfc',
      undefined,
      undefined,
      localQuad,
      { x0: 15, y0: 15, x1: 80, y1: 65 }
    );
    expect(patch).not.toBeNull();
    const out = patch!.pixels as Uint8ClampedArray;
    expect(out[(40 * w + 42) * 4 + 3]).toBe(255);
    expect(out[(20 * w + 20) * 4 + 3]).toBe(0);
  });
});
