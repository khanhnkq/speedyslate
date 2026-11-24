import { describe, expect, it } from 'vitest';
import { PolygonDeskew } from '../../src/worker/polygon-deskew';

describe('PolygonDeskew', () => {
  it('recovers ~30° tilt angle on rotated rectangle points and gates shouldWarp at >= 4°', () => {
    const rad = (30 * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const pts: [number, number][] = [];
    for (let x = -40; x <= 40; x += 8) {
      for (const y of [-10, 10]) {
        pts.push([100 + x * cos - y * sin, 100 + x * sin + y * cos]);
      }
    }
    const { quad, angleDeg } = PolygonDeskew.minAreaQuad(pts);
    expect(Math.abs(Math.abs(angleDeg) - 30)).toBeLessThan(2.5);
    expect(PolygonDeskew.shouldWarp(angleDeg)).toBe(true);
    expect(PolygonDeskew.shouldWarp(2.1)).toBe(false);
    expect(PolygonDeskew.pointInQuad(100, 100, quad)).toBe(true);
    expect(PolygonDeskew.pointInQuad(10, 10, quad)).toBe(false);
  });

  it('warps a tilted quad crop into an upright horizontal PixelRegion', () => {
    const w = 120;
    const h = 120;
    const data = new Uint8ClampedArray(w * h * 4).fill(250);
    const quad = PolygonDeskew.unclipQuad(
      [
        [30, 50],
        [90, 20],
        [98, 36],
        [38, 66]
      ],
      1.2
    );
    const warped = PolygonDeskew.warpQuadToHorizontal({ data, width: w, height: h }, quad);
    expect(warped).not.toBeNull();
    expect(warped!.width).toBeGreaterThan(warped!.height * 2);
  });
});
