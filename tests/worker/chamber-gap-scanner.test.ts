import { describe, expect, it } from 'vitest';
import { ChamberGapScanner } from '../../src/worker/chamber-gap-scanner';
import { BoundingBox } from '../../src/shared/types';

describe('ChamberGapScanner.recoverMissedLines', () => {
  it('recovers unread text bands above and below detected lines inside the same white speech bubble', () => {
    const w = 120;
    const h = 220;
    const data = new Uint8ClampedArray(w * h * 4).fill(180); // grey outside

    // Tall narrow speech bubble x=25..95, y=15..200 with black border (15) and white paper (252)
    for (let y = 15; y <= 200; y++) {
      for (let x = 25; x <= 95; x++) {
        const border = x === 25 || x === 95 || y === 15 || y === 200;
        const v = border ? 15 : 252;
        data.set([v, v, v, 255], (y * w + x) * 4);
      }
    }

    const drawLine = (y0: number, y1: number, x0: number, x1: number) => {
      for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x += 3) {
          data.set([12, 12, 12, 255], (y * w + x) * 4);
          data.set([12, 12, 12, 255], (y * w + x + 1) * 4);
        }
      }
    };

    // Line 1 (TOP — missed by DBNet, e.g. "Don't"): y=26..37
    drawLine(26, 37, 40, 78);
    // Line 2 (DETECTED): y=55..70
    drawLine(55, 70, 35, 85);
    // Line 3 (DETECTED): y=85..100
    drawLine(85, 100, 42, 76);
    // Line 4 (BOTTOM — missed by DBNet, touching walls like "breathing"): y=120..135
    drawLine(120, 135, 26, 94);
    // Line 5 (BOTTOM — missed by DBNet, "is ragged."): y=150..165
    drawLine(150, 165, 26, 94);

    const existing: BoundingBox[] = [
      { x: 34, y: 54, width: 52, height: 18, kind: 'dialogue' },
      { x: 40, y: 84, width: 38, height: 18, kind: 'dialogue' }
    ];

    const recovered = ChamberGapScanner.recoverMissedLines({ data, width: w, height: h }, existing);
    expect(recovered.length).toBe(3); // recovers top line + 2 bottom lines!
    expect(recovered.some((b) => b.y <= 28 && b.y + b.height >= 36)).toBe(true);
    expect(recovered.some((b) => b.y <= 122 && b.y + b.height >= 134)).toBe(true);
    expect(recovered.some((b) => b.y <= 152 && b.y + b.height >= 164)).toBe(true);
  });
});
