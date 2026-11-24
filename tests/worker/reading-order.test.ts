import { describe, expect, it } from 'vitest';
import { ReadingOrderSorter } from '../../src/worker/reading-order';
import { DialogueItem } from '../../src/shared/types';

const b = (
  id: string,
  text: string,
  x: number,
  y: number,
  w: number,
  h: number,
  isVertical = false
): DialogueItem => ({
  id,
  originalText: text,
  box: { x, y, width: w, height: h },
  isVertical
});

describe('ReadingOrderSorter', () => {
  it('sorts Japanese same-row bubbles Right-to-Left even when left bubble is slightly higher', () => {
    const leftSlightlyHigher = b('L', 'なんだ？', 80, 100, 90, 140, true);
    const rightSlightlyLower = b('R', 'おい見ろ！', 520, 118, 90, 140, true);
    const bottom = b('B', '本当だ', 300, 420, 90, 130, true);
    const dir = ReadingOrderSorter.detectDirection([leftSlightlyHigher, rightSlightlyLower, bottom], 'auto');
    expect(dir).toBe('rtl');
    expect(ReadingOrderSorter.sort([leftSlightlyHigher, rightSlightlyLower, bottom], dir).map((i) => i.id)).toEqual([
      'R',
      'L',
      'B'
    ]);
  });

  it('keeps horizontal Chinese/Korean webtoons Left-to-Right while sorting vertical HK/TW manhua Right-to-Left', () => {
    const left = b('L', '你好', 80, 110, 160, 45, false);
    const right = b('R', '走吧', 420, 100, 160, 45, false);
    expect(ReadingOrderSorter.detectDirection([left, right], 'Chinese')).toBe('ltr');
    expect(ReadingOrderSorter.sort([right, left], 'ltr').map((i) => i.id)).toEqual(['L', 'R']);

    const vLeft = b('VL', '真的嗎', 80, 100, 40, 150, true);
    const vRight = b('VR', '快看那裡', 480, 110, 40, 150, true);
    expect(ReadingOrderSorter.detectDirection([vLeft, vRight], 'Chinese')).toBe('rtl');
    expect(ReadingOrderSorter.sort([vLeft, vRight], 'rtl').map((i) => i.id)).toEqual(['VR', 'VL']);
  });
});
