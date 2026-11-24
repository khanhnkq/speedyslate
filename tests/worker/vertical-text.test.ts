import { describe, it, expect } from 'vitest';
import { VerticalText } from '../../src/worker/vertical-text';
import { PixelRegion } from '../../src/worker/color-sampler';
import { DialogueItem } from '../../src/shared/types';

function makeRegion(w: number, h: number, px: number[][]): PixelRegion {
  const data = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const p = px[y][x];
      data[i] = data[i + 1] = data[i + 2] = p;
      data[i + 3] = 255;
    }
  }
  return { data, width: w, height: h };
}

function lumaAt(r: PixelRegion, x: number, y: number): number {
  return r.data[(y * r.width + x) * 4];
}

describe('VerticalText.isVerticalCandidate', () => {
  it('tall box + CJK model → true', () => {
    expect(VerticalText.isVerticalCandidate({ x: 0, y: 0, width: 50, height: 100 }, true)).toBe(true);
  });
  it('tall box + non-CJK model → false', () => {
    expect(VerticalText.isVerticalCandidate({ x: 0, y: 0, width: 50, height: 100 }, false)).toBe(false);
  });
  it('wide box + CJK model → false', () => {
    expect(VerticalText.isVerticalCandidate({ x: 0, y: 0, width: 100, height: 100 }, true)).toBe(false);
  });
});

describe('VerticalText.rotateCropCCW', () => {
  it('2x1 row becomes 1x2 column, top-of-column at left', () => {
    // src: 2 wide, 1 tall. [A][B] where A=10, B=20
    const src = makeRegion(2, 1, [[10, 20]]);
    const dst = VerticalText.rotateCropCCW(src);
    expect(dst.width).toBe(1);
    expect(dst.height).toBe(2);
    // CCW: src(x,y) -> dst(x'=y, y'=w-1-x)
    // src(0,0)=10 -> dst(0,1); src(1,0)=20 -> dst(0,0)
    expect(lumaAt(dst, 0, 0)).toBe(20);
    expect(lumaAt(dst, 0, 1)).toBe(10);
  });

  it('column top maps to line left', () => {
    // Vertical column 1x3: top=10, mid=50, bottom=90
    const src = makeRegion(1, 3, [[10], [50], [90]]);
    const dst = VerticalText.rotateCropCCW(src);
    expect(dst.width).toBe(3);
    expect(dst.height).toBe(1);
    // Reading order after rotation: top -> left
    expect(lumaAt(dst, 0, 0)).toBe(10);
    expect(lumaAt(dst, 1, 0)).toBe(50);
    expect(lumaAt(dst, 2, 0)).toBe(90);
  });
});

describe('VerticalText.groupColumns', () => {
  function item(x: number, y: number, text: string): DialogueItem {
    return { id: text, box: { x, y, width: 40, height: 120 }, originalText: text, isVertical: true };
  }

  it('orders columns right-to-left, lines top-to-bottom', () => {
    const items = [item(10, 200, 'L-bottom'), item(300, 50, 'R-top'), item(10, 50, 'L-top'), item(300, 200, 'R-bottom')];
    VerticalText.groupColumns(items);
    expect(items.map(i => i.originalText)).toEqual(['R-top', 'R-bottom', 'L-top', 'L-bottom']);
  });
});
