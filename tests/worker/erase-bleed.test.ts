import { describe, expect, it } from 'vitest';
import { EraseMasker } from '../../src/worker/erase-masker';
import { BubbleFiller } from '../../src/worker/bubble-filler';

describe('EraseMasker & BubbleFiller border-gap protection', () => {
  it('aborts whole-bubble flood when bubble outline has an open gap leading into screentone dots', () => {
    const w = 120;
    const h = 120;
    const data = new Uint8ClampedArray(w * h * 4);
    // Fill outside with halftone screentone: white (250) with dark dots every 3px
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const isDot = x % 3 === 0 && y % 3 === 0;
        const v = isDot ? 40 : 250;
        data.set([v, v, v, 255], (y * w + x) * 4);
      }
    }
    // Draw bubble interior (white 252) + black border (15), WITH A 14px OPEN GAP on bottom-right!
    for (let y = 20; y <= 95; y++) {
      for (let x = 30; x <= 85; x++) {
        const onBorder = x === 30 || x === 85 || y === 20 || y === 95;
        const inOpenGap = x === 85 && y >= 72 && y <= 86;
        const v = onBorder && !inOpenGap ? 15 : 252;
        data.set([v, v, v, 255], (y * w + x) * 4);
      }
    }

    const patch = BubbleFiller.buildBubblePatch(
      { data, width: w, height: h } as ImageData,
      0,
      0,
      [{ x: 38, y: 35, width: 40, height: 50 }]
    );
    // Must either reject (null) so per-line glyph erase handles it, or never paint outside x > 85!
    if (patch !== null) {
      const out = patch.pixels as Uint8ClampedArray;
      expect(out[(78 * w + 92) * 4 + 3]).toBe(0);
    }
  });
  it('never paints rectangular corners outside a curved bubble border onto grey screentone (luma 195)', () => {
    const w = 100;
    const h = 44;
    const data = new Uint8ClampedArray(w * h * 4);

    // Curved bubble: white interior (252), 2px black border (20), grey screentone outside (195)
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const dx = (x - 50) / 44;
        const dy = (y - 22) / 26;
        const r = Math.sqrt(dx * dx + dy * dy);
        let v = 195; // outside grey screentone (|195 - 252| = 57 <= 90!)
        if (r < 0.92) v = 252;
        else if (r <= 1.02) v = 20;
        data.set([v, v, v, 255], (y * w + x) * 4);
      }
    }

    // Draw dark glyph strokes strictly inside the center of the bubble
    for (let y = 14; y <= 28; y++) {
      for (let x = 26; x <= 74; x += 6) {
        data.set([15, 15, 15, 255], (y * w + x) * 4);
        data.set([15, 15, 15, 255], (y * w + x + 1) * 4);
      }
    }

    // DBNet textMap highlights ONLY the glyph region inside the bubble (guidedActive = true)
    const textMap = new Float32Array(w * h);
    for (let y = 14; y <= 28; y++) {
      for (let x = 26; x <= 74; x++) {
        textMap[y * w + x] = 0.85;
      }
    }

    const patch = EraseMasker.buildPatch(
      { data, width: w, height: h } as ImageData,
      0,
      0,
      '#fcfcfc',
      textMap,
      w
    );
    expect(patch).not.toBeNull();
    const out = patch!.pixels as Uint8ClampedArray;

    // Top-left & bottom-left corners sit outside the curved border on grey screentone: alpha MUST be 0!
    expect(out[(2 * w + 2) * 4 + 3]).toBe(0);
    expect(out[((h - 3) * w + 2) * 4 + 3]).toBe(0);
    expect(out[(2 * w + (w - 3)) * 4 + 3]).toBe(0);
    // Center glyph pixel MUST be erased (alpha = 255)
    expect(out[(20 * w + 26) * 4 + 3]).toBe(255);
  });

  it('erases a glyph welded directly to the inner black border of a closed speech bubble without bleeding outside', () => {
    const w = 120;
    const h = 90;
    const data = new Uint8ClampedArray(w * h * 4);
    // Oval bubble centered at (60, 45), rx=44, ry=34: white 252 inside, 3px black border (15), grey 185 outside
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const d = Math.hypot((x - 60) / 44, (y - 45) / 34);
        let v = 185;
        if (d < 0.93) v = 252;
        else if (d <= 1.02) v = 15;
        data.set([v, v, v, 255], (y * w + x) * 4);
      }
    }
    // Weld a 3px-thick dark glyph stem (x=94..98, y=41..49) directly onto the right inner wall (x=101)!
    for (let y = 43; y <= 46; y++) {
      for (let x = 92; x <= 101; x++) {
        data.set([15, 15, 15, 255], (y * w + x) * 4);
      }
    }

    const patch = BubbleFiller.buildBubblePatch(
      { data, width: w, height: h } as ImageData,
      0,
      0,
      [{ x: 30, y: 35, width: 72, height: 20 }]
    );
    expect(patch).not.toBeNull();
    const out = patch!.pixels as Uint8ClampedArray;
    // Welded glyph stroke at (95, 44) MUST be erased (alpha = 255, luma > 240)!
    const glyphIdx = (44 * w + 95) * 4;
    expect(out[glyphIdx + 3]).toBe(255);
    expect(out[glyphIdx]).toBeGreaterThan(240);
    // Outside pixel at (110, 45) MUST stay untouched (alpha = 0)!
    expect(out[(45 * w + 110) * 4 + 3]).toBe(0);
  });

  it('leaves zero grey AA smudge residue on spiky/open bubbles when erasing glyph strokes', () => {
    const w = 110;
    const h = 48;
    const data = new Uint8ClampedArray(w * h * 4).fill(252);
    // Draw spiky border at x=8 and bottom screentone (y>=40) so crop enters textured/donor path
    for (let y = 0; y < h; y++) {
      data.set([20, 20, 20, 255], (y * w + 8) * 4);
      if (y >= 38) {
        for (let x = 0; x < w; x += 2) data.set([40, 40, 40, 255], (y * w + x) * 4);
      }
    }
    // Draw dark stroke (18) connected to border at x=78..109? No: word-end at x=82 outside shrunk tm!
    for (let y = 18; y <= 30; y++) {
      for (let x = 22; x <= 84; x += 7) {
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            const core = Math.abs(dx) <= 1 && Math.abs(dy) <= 1;
            const v = core ? 18 : 155;
            data.set([v, v, v, 255], ((y + dy) * w + (x + dx)) * 4);
          }
        }
      }
    }
    // Shrunk DBNet map covers ONLY x=24..64 (misses word-end letter at x=82 completely!)
    const tm = new Float32Array(w * h);
    for (let y = 20; y <= 28; y++) for (let x = 24; x <= 64; x++) tm[y * w + x] = 0.85;

    const patch = EraseMasker.buildPatch(
      { data, width: w, height: h } as ImageData,
      0,
      0,
      '#fcfcfc',
      tm,
      w,
      undefined,
      { x0: 14, y0: 12, x1: 92, y1: 36 }
    );
    expect(patch).not.toBeNull();
    const comp = new Uint8ClampedArray(data);
    const px = patch!.pixels as Uint8ClampedArray;
    for (let i = 0; i < w * h; i++) {
      if (px[i * 4 + 3] > 0) {
        comp[i * 4] = px[i * 4];
        comp[i * 4 + 1] = px[i * 4 + 1];
        comp[i * 4 + 2] = px[i * 4 + 2];
      }
    }
    // Word-end letter at (78, 24) inside innerRect (x1=92) MUST be erased (>240), not left behind!
    expect(comp[(24 * w + 78) * 4]).toBeGreaterThan(240);
    // Spiky border line at x=8 (outside innerRect x0=14) MUST stay intact!
    expect(comp[(24 * w + 8) * 4]).toBe(20);
  });
});
