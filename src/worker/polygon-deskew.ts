import { PixelRegion } from './color-sampler';

export type Quad4 = [
  [number, number],
  [number, number],
  [number, number],
  [number, number]
]; // [TL, TR, BR, BL]

/**
 * PolygonDeskew: Monotone-chain convex hull, rotating-calipers minimum-area
 * rectangle, outward normal unclipping, bilinear quad rectification, and
 * point-in-quad testing for angled comic lettering & SFX.
 */
export class PolygonDeskew {
  public static shouldWarp(angleDeg?: number): boolean {
    return typeof angleDeg === 'number' && Math.abs(angleDeg) >= 10;
  }

  public static minAreaQuad(boundaryPoints: [number, number][]): {
    quad: Quad4;
    angleDeg: number;
  } {
    if (boundaryPoints.length < 3) {
      const [x = 0, y = 0] = boundaryPoints[0] || [];
      return {
        quad: [
          [x, y],
          [x + 1, y],
          [x + 1, y + 1],
          [x, y + 1]
        ],
        angleDeg: 0
      };
    }

    const hull = this.convexHull(boundaryPoints);
    if (hull.length < 3) {
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const [x, y] of boundaryPoints) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
      return {
        quad: [
          [minX, minY],
          [maxX, minY],
          [maxX, maxY],
          [minX, maxY]
        ],
        angleDeg: 0
      };
    }

    let bestArea = Infinity;
    let bestCorners: [number, number][] = [];

    for (let i = 0; i < hull.length; i++) {
      const [x1, y1] = hull[i];
      const [x2, y2] = hull[(i + 1) % hull.length];
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.hypot(dx, dy);
      if (len < 1e-6) continue;
      const ux = dx / len;
      const uy = dy / len;
      const vx = -uy;
      const vy = ux;

      let minU = Infinity, maxU = -Infinity, minV = Infinity, maxV = -Infinity;
      for (const [px, py] of hull) {
        const u = px * ux + py * uy;
        const v = px * vx + py * vy;
        if (u < minU) minU = u;
        if (u > maxU) maxU = u;
        if (v < minV) minV = v;
        if (v > maxV) maxV = v;
      }

      const area = (maxU - minU) * (maxV - minV);
      if (area < bestArea) {
        bestArea = area;
        bestCorners = [
          [minU * ux + minV * vx, minU * uy + minV * vy],
          [maxU * ux + minV * vx, maxU * uy + minV * vy],
          [maxU * ux + maxV * vx, maxU * uy + maxV * vy],
          [minU * ux + maxV * vx, minU * uy + maxV * vy]
        ];
      }
    }

    const ordered = this.orderCornersTLTRBRBL(bestCorners);
    const edgeW = Math.hypot(ordered[1][0] - ordered[0][0], ordered[1][1] - ordered[0][1]);
    const edgeH = Math.hypot(ordered[3][0] - ordered[0][0], ordered[3][1] - ordered[0][1]);

    let angleRad: number;
    if (edgeW >= edgeH) {
      angleRad = Math.atan2(ordered[1][1] - ordered[0][1], ordered[1][0] - ordered[0][0]);
    } else {
      angleRad = Math.atan2(ordered[2][1] - ordered[1][1], ordered[2][0] - ordered[1][0]) - Math.PI / 2;
    }
    let angleDeg = (angleRad * 180) / Math.PI;
    while (angleDeg > 45) angleDeg -= 90;
    while (angleDeg < -45) angleDeg += 90;

    return { quad: ordered, angleDeg };
  }

  public static unclipQuad(quad: Quad4, unclipRatio: number): Quad4 {
    const w1 = Math.hypot(quad[1][0] - quad[0][0], quad[1][1] - quad[0][1]);
    const h1 = Math.hypot(quad[3][0] - quad[0][0], quad[3][1] - quad[0][1]);
    const area = w1 * h1;
    const perim = Math.max(1, 2 * (w1 + h1));
    const dist = Math.max(3, Math.min(18, (area * unclipRatio) / perim));

    const cx = (quad[0][0] + quad[1][0] + quad[2][0] + quad[3][0]) * 0.25;
    const cy = (quad[0][1] + quad[1][1] + quad[2][1] + quad[3][1]) * 0.25;

    const ux = w1 > 1e-6 ? (quad[1][0] - quad[0][0]) / w1 : 1;
    const uy = w1 > 1e-6 ? (quad[1][1] - quad[0][1]) / w1 : 0;
    const vx = h1 > 1e-6 ? (quad[3][0] - quad[0][0]) / h1 : 0;
    const vy = h1 > 1e-6 ? (quad[3][1] - quad[0][1]) / h1 : 1;

    const hw = w1 * 0.5 + dist;
    const hh = h1 * 0.5 + dist;

    return [
      [cx - hw * ux - hh * vx, cy - hw * uy - hh * vy],
      [cx + hw * ux - hh * vx, cy + hw * uy - hh * vy],
      [cx + hw * ux + hh * vx, cy + hw * uy + hh * vy],
      [cx - hw * ux + hh * vx, cy - hw * uy + hh * vy]
    ];
  }

  public static warpQuadToHorizontal(src: PixelRegion, quad: Quad4): PixelRegion | null {
    const topW = Math.hypot(quad[1][0] - quad[0][0], quad[1][1] - quad[0][1]);
    const botW = Math.hypot(quad[2][0] - quad[3][0], quad[2][1] - quad[3][1]);
    const leftH = Math.hypot(quad[3][0] - quad[0][0], quad[3][1] - quad[0][1]);
    const rightH = Math.hypot(quad[2][0] - quad[1][0], quad[2][1] - quad[1][1]);

    const dstW = Math.max(4, Math.round((topW + botW) * 0.5));
    const dstH = Math.max(4, Math.round((leftH + rightH) * 0.5));
    if (dstW < 4 || dstH < 4) return null;

    const out = new Uint8ClampedArray(dstW * dstH * 4);
    const { data, width: sw, height: sh } = src;

    for (let y = 0; y < dstH; y++) {
      const v = dstH > 1 ? y / (dstH - 1) : 0;
      const lx = quad[0][0] + (quad[3][0] - quad[0][0]) * v;
      const ly = quad[0][1] + (quad[3][1] - quad[0][1]) * v;
      const rx = quad[1][0] + (quad[2][0] - quad[1][0]) * v;
      const ry = quad[1][1] + (quad[2][1] - quad[1][1]) * v;

      for (let x = 0; x < dstW; x++) {
        const u = dstW > 1 ? x / (dstW - 1) : 0;
        const sx = Math.max(0, Math.min(sw - 1.001, lx + (rx - lx) * u));
        const sy = Math.max(0, Math.min(sh - 1.001, ly + (ry - ly) * u));

        const x0 = sx | 0;
        const y0 = sy | 0;
        const fx = sx - x0;
        const fy = sy - y0;
        const x1 = Math.min(sw - 1, x0 + 1);
        const y1 = Math.min(sh - 1, y0 + 1);

        const p00 = (y0 * sw + x0) * 4;
        const p10 = (y0 * sw + x1) * 4;
        const p01 = (y1 * sw + x0) * 4;
        const p11 = (y1 * sw + x1) * 4;

        const w00 = (1 - fx) * (1 - fy);
        const w10 = fx * (1 - fy);
        const w01 = (1 - fx) * fy;
        const w11 = fx * fy;

        const di = (y * dstW + x) * 4;
        out[di] = data[p00] * w00 + data[p10] * w10 + data[p01] * w01 + data[p11] * w11;
        out[di + 1] = data[p00 + 1] * w00 + data[p10 + 1] * w10 + data[p01 + 1] * w01 + data[p11 + 1] * w11;
        out[di + 2] = data[p00 + 2] * w00 + data[p10 + 2] * w10 + data[p01 + 2] * w01 + data[p11 + 2] * w11;
        out[di + 3] = 255;
      }
    }

    return { data: out, width: dstW, height: dstH };
  }

  public static pointInQuad(px: number, py: number, quad: [number, number][]): boolean {
    if (quad.length < 4) return true;
    let pos = 0;
    let neg = 0;
    for (let i = 0; i < 4; i++) {
      const [x1, y1] = quad[i];
      const [x2, y2] = quad[(i + 1) & 3];
      const cross = (x2 - x1) * (py - y1) - (y2 - y1) * (px - x1);
      if (cross > 1e-6) pos++;
      else if (cross < -1e-6) neg++;
      if (pos > 0 && neg > 0) return false;
    }
    return true;
  }

  private static convexHull(pts: [number, number][]): [number, number][] {
    const sorted = [...pts].sort((a, b) => (a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]));
    const cross = (o: [number, number], a: [number, number], b: [number, number]) =>
      (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);

    const lower: [number, number][] = [];
    for (const p of sorted) {
      while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
        lower.pop();
      }
      lower.push(p);
    }
    const upper: [number, number][] = [];
    for (let i = sorted.length - 1; i >= 0; i--) {
      const p = sorted[i];
      while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
        upper.pop();
      }
      upper.push(p);
    }
    lower.pop();
    upper.pop();
    return lower.concat(upper);
  }

  private static orderCornersTLTRBRBL(pts: [number, number][]): Quad4 {
    const byY = [...pts].sort((a, b) => a[1] - b[1]);
    const topTwo = byY.slice(0, 2).sort((a, b) => a[0] - b[0]);
    const botTwo = byY.slice(2, 4).sort((a, b) => a[0] - b[0]);
    return [topTwo[0], topTwo[1], botTwo[1], botTwo[0]];
  }
}
