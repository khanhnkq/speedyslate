import { describe, expect, it } from 'vitest';
import { BubbleChamberExtractor } from '../../src/worker/bubble-chamber';

function drawOvalBubbleWithTail(w: number, h: number, dark = false): Uint8ClampedArray {
  const bg = dark ? 220 : 40;
  const paper = dark ? 22 : 250;
  const border = dark ? 245 : 15;
  const buf = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = (x - 100) / 65;
      const dy = (y - 90) / 55;
      const d2 = dx * dx + dy * dy;
      const inTail = y >= 140 && y <= 185 && Math.abs(x - 100) <= Math.max(2, 8 - (y - 140) * 0.15);
      const v = d2 <= 0.92 || inTail ? paper : d2 <= 1.08 ? border : bg;
      buf.set([v, v, v, 255], (y * w + x) * 4);
    }
  }
  return buf;
}

describe('BubbleChamberExtractor', () => {
  it('expands a narrow vertical CJK column to the oval chamber while severing the pointing tail', () => {
    const data = drawOvalBubbleWithTail(200, 200, false);
    const res = BubbleChamberExtractor.extractChamber(
      { data, width: 200, height: 200 },
      0,
      0,
      { x: 88, y: 50, width: 24, height: 80 }
    );
    expect(res).not.toBeNull();
    expect(res!.chamberBox.width).toBeGreaterThan(95);
    expect(res!.chamberBox.y + res!.chamberBox.height).toBeLessThan(152);
    expect(res!.isOval).toBe(true);
  });

  it('supports dark scream bubbles and rejects unbounded open backgrounds', () => {
    const darkData = drawOvalBubbleWithTail(200, 200, true);
    const darkRes = BubbleChamberExtractor.extractChamber(
      { data: darkData, width: 200, height: 200 },
      0,
      0,
      { x: 88, y: 50, width: 24, height: 80 }
    );
    expect(darkRes).not.toBeNull();
    expect(darkRes!.chamberBox.width).toBeGreaterThan(95);

    const openWhite = new Uint8ClampedArray(200 * 200 * 4).fill(255);
    const leak = BubbleChamberExtractor.extractChamber(
      { data: openWhite, width: 200, height: 200 },
      0,
      0,
      { x: 88, y: 50, width: 24, height: 80 }
    );
    expect(leak).toBeNull();
  });

  it('stops at faint anti-aliased grey borders (luma 218 on 250 paper) and never merges into an adjacent bubble', () => {
    const w = 260, h = 160;
    const buf = new Uint8ClampedArray(w * h * 4).fill(218); // light-grey gutter between two bubbles
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        buf.set([218, 218, 218, 255], (y * w + x) * 4);
        const inLeftBubble = ((x - 60) / 42) ** 2 + ((y - 80) / 55) ** 2 <= 1;
        const inRightBubble = ((x - 185) / 45) ** 2 + ((y - 80) / 55) ** 2 <= 1;
        if (inLeftBubble || inRightBubble) {
          buf.set([250, 250, 250, 255], (y * w + x) * 4);
        }
      }
    }
    const res = BubbleChamberExtractor.extractChamber(
      { data: buf, width: w, height: h },
      0,
      0,
      { x: 173, y: 45, width: 24, height: 70 }
    );
    expect(res).not.toBeNull();
    expect(res!.chamberBox.x).toBeGreaterThanOrEqual(135); // never crosses gutter into left bubble (x <= 102)
  });

  it('recovers a chromatic peach/pastel oval bubble on white page without leaking while rejecting unbounded peach wash', () => {
    const w = 280, h = 240;
    const buf = new Uint8ClampedArray(w * h * 4);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const d2 = ((x - 140) / 85) ** 2 + ((y - 120) / 72) ** 2;
        if (d2 <= 0.94) {
          // Peach pastel interior (~250, 212, 193 -> sat ~57)
          const shade = Math.round(((y - 48) / 144) * 10);
          buf.set([252 - shade, 218 - shade, 198 - shade, 255], (y * w + x) * 4);
        } else if (d2 <= 1.03) {
          // Soft glowing peach rim (still light luma ~215)
          buf.set([248, 224, 214, 255], (y * w + x) * 4);
        } else {
          // Pure white background page
          buf.set([255, 255, 255, 255], (y * w + x) * 4);
        }
      }
    }
    const res = BubbleChamberExtractor.extractChamber(
      { data: buf, width: w, height: h },
      0,
      0,
      { x: 95, y: 108, width: 90, height: 24 },
      { width: w, height: h }
    );
    expect(res).not.toBeNull();
    expect(res!.isOval).toBe(true);
    expect(res!.chamberBox.width).toBeGreaterThanOrEqual(140);
    expect(res!.chamberBox.width).toBeLessThanOrEqual(190);
    expect(res!.chamberBox.height).toBeGreaterThanOrEqual(120);

    // Unbounded uniform peach wash across whole crop must still fail closed
    const openPeach = new Uint8ClampedArray(w * h * 4);
    for (let i = 0; i < w * h * 4; i += 4) {
      openPeach[i] = 250; openPeach[i + 1] = 212; openPeach[i + 2] = 193; openPeach[i + 3] = 255;
    }
    const leak = BubbleChamberExtractor.extractChamber(
      { data: openPeach, width: w, height: h },
      0,
      0,
      { x: 95, y: 108, width: 90, height: 24 },
      { width: w, height: h }
    );
    expect(leak).toBeNull();
  });
});
