import { describe, expect, it } from 'vitest';
import { EraseMasker } from '../../src/worker/erase-masker';

describe('EraseMasker curved bubble border protection', () => {
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
});
