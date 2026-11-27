import { describe, it, expect } from 'vitest';
import { BubbleWallDetector, PagePixelBuffer } from '../../src/worker/bubble-wall-detector';
import { BubbleAggregator } from '../../src/worker/bubble-aggregator';
import { DialogueItem } from '../../src/shared/types';

function createBuffer(width: number, height: number, fillLuma = 255): PagePixelBuffer {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = fillLuma;
    data[i + 1] = fillLuma;
    data[i + 2] = fillLuma;
    data[i + 3] = 255;
  }
  return { data, width, height };
}

function paintRect(
  buf: PagePixelBuffer,
  x0: number,
  y0: number,
  w: number,
  h: number,
  luma: number
): void {
  const xEnd = Math.min(buf.width, x0 + w);
  const yEnd = Math.min(buf.height, y0 + h);
  for (let y = Math.max(0, y0); y < yEnd; y++) {
    for (let x = Math.max(0, x0); x < xEnd; x++) {
      const idx = (y * buf.width + x) * 4;
      buf.data[idx] = luma;
      buf.data[idx + 1] = luma;
      buf.data[idx + 2] = luma;
    }
  }
}

let seq = 0;
function makeItem(overrides: Partial<DialogueItem>): DialogueItem {
  return {
    id: `wall-item-${seq++}`,
    box: { x: 100, y: 100, width: 160, height: 30 },
    originalText: 'dialogue line',
    ...overrides
  };
}

describe('BubbleWallDetector & BubbleAggregator wall separation', () => {
  it('keeps two stacked white speech bubbles separated by a 3px black border apart', () => {
    const pageImg = createBuffer(400, 300, 255);
    // 3px black border separating top and bottom bubbles across the gap
    paintRect(pageImg, 40, 117, 320, 3, 10);

    const topBox = { x: 100, y: 70, width: 160, height: 30 };
    const botBox = { x: 100, y: 136, width: 160, height: 30 }; // gap = 36px on 30px tall lines

    expect(BubbleWallDetector.hasHorizontalWallBetween(pageImg, topBox, botBox)).toBe(true);

    const items = [
      makeItem({ originalText: 'FIRST BUBBLE', box: topBox }),
      makeItem({ originalText: 'SECOND BUBBLE', box: botBox })
    ];
    const out = BubbleAggregator.aggregateDialogues(items, 400, 300, undefined, pageImg);
    expect(out).toHaveLength(2);
    expect(out.map((b) => b.originalText)).toEqual(['FIRST BUBBLE', 'SECOND BUBBLE']);
  });

  it('keeps a figure-8 pinched double bubble (20px paper neck between 120px lobes) as 2 bubbles', () => {
    const pageImg = createBuffer(400, 300, 255);
    // Dark exterior/outline across the pinched waist band, leaving only a 20px paper neck
    paintRect(pageImg, 0, 82, 400, 26, 15);
    paintRect(pageImg, 140, 82, 20, 26, 255);

    const topLobeBox = { x: 90, y: 50, width: 120, height: 30 };
    const botLobeBox = { x: 90, y: 110, width: 120, height: 30 }; // gap = 30px, 15%-inset overlap = [108..191]

    expect(BubbleWallDetector.hasHorizontalWallBetween(pageImg, topLobeBox, botLobeBox)).toBe(true);

    const items = [
      makeItem({ originalText: 'TOP LOBE', box: topLobeBox }),
      makeItem({ originalText: 'BOTTOM LOBE', box: botLobeBox })
    ];
    const out = BubbleAggregator.aggregateDialogues(items, 400, 300, undefined, pageImg);
    expect(out).toHaveLength(2);
  });

  it('merges 3 stacked lines inside a single convex oval bubble on white paper', () => {
    const pageImg = createBuffer(400, 300, 255);
    // Oval dark rim strictly outside the interior text column
    paintRect(pageImg, 40, 40, 12, 160, 10);
    paintRect(pageImg, 280, 40, 12, 160, 10);

    const items = [
      makeItem({ originalText: 'LINE ONE', box: { x: 85, y: 50, width: 160, height: 30 } }),
      makeItem({ originalText: 'LINE TWO', box: { x: 80, y: 98, width: 170, height: 30 } }),
      makeItem({ originalText: 'LINE THREE', box: { x: 90, y: 146, width: 150, height: 30 } })
    ];

    expect(BubbleWallDetector.hasHorizontalWallBetween(pageImg, items[0].box, items[1].box)).toBe(false);
    expect(BubbleWallDetector.hasHorizontalWallBetween(pageImg, items[1].box, items[2].box)).toBe(false);

    const out = BubbleAggregator.aggregateDialogues(items, 400, 300, undefined, pageImg);
    expect(out).toHaveLength(1);
    expect(out[0].originalText).toBe('LINE ONE LINE TWO LINE THREE');
  });

  it('separates opposite-polarity bubbles (light vs dark)', () => {
    const pageImg = createBuffer(400, 300, 255);
    paintRect(pageImg, 60, 110, 220, 80, 15); // dark bottom bubble

    const lightBox = { x: 100, y: 60, width: 140, height: 24 };
    const darkBox = { x: 100, y: 120, width: 140, height: 24 };

    expect(BubbleWallDetector.hasHorizontalWallBetween(pageImg, lightBox, darkBox)).toBe(true);

    const out = BubbleAggregator.aggregateDialogues(
      [
        makeItem({ originalText: 'LIGHT', box: lightBox }),
        makeItem({ originalText: 'DARK', box: darkBox, isDarkBackground: true })
      ],
      400,
      300,
      undefined,
      pageImg
    );
    expect(out).toHaveLength(2);
  });

  it('preserves bubbleClusterId separation on second aggregation pass without pageImg', () => {
    const items = [
      makeItem({ originalText: 'BUBBLE A', box: { x: 100, y: 70, width: 160, height: 30 }, bubbleClusterId: 0 }),
      makeItem({ originalText: 'BUBBLE B', box: { x: 100, y: 118, width: 160, height: 30 }, bubbleClusterId: 1 })
    ];

    // Called WITHOUT pageImg (simulating offscreen.ts / ocr-worker-client.ts)
    const out = BubbleAggregator.aggregateDialogues(items, 400, 300);
    expect(out).toHaveLength(2);
    expect(out.map((b) => b.originalText)).toEqual(['BUBBLE A', 'BUBBLE B']);
  });

  it('prevents unstamped (undefined) bubbleClusterId from merging with stamped cluster without pageImg', () => {
    const items = [
      makeItem({ originalText: 'STAMPED', box: { x: 100, y: 70, width: 160, height: 30 }, bubbleClusterId: 0 }),
      makeItem({ originalText: 'UNSTAMPED', box: { x: 100, y: 118, width: 160, height: 30 } })
    ];

    const out = BubbleAggregator.aggregateDialogues(items, 400, 300);
    expect(out).toHaveLength(2);
    expect(out.map((b) => b.originalText)).toEqual(['STAMPED', 'UNSTAMPED']);
  });

  it('merges 2 stacked lines with ~30% white glyph pixels inside one dark speech bubble', () => {
    const pageImg = createBuffer(400, 300, 15);
    const line1 = { x: 100, y: 60, width: 160, height: 30 };
    const line2 = { x: 100, y: 108, width: 160, height: 30 };
    // ~31% white glyph ink inside each dark box (exceeds 25% so p75 == 250, while p50 == 15)
    paintRect(pageImg, 100, 60, 50, 30, 250);
    paintRect(pageImg, 100, 108, 50, 30, 250);

    expect(BubbleWallDetector.hasHorizontalWallBetween(pageImg, line1, line2)).toBe(false);

    const out = BubbleAggregator.aggregateDialogues(
      [
        makeItem({ originalText: 'DARK LINE 1', box: line1, isDarkBackground: true }),
        makeItem({ originalText: 'DARK LINE 2', box: line2, isDarkBackground: true })
      ],
      400,
      300,
      undefined,
      pageImg
    );
    expect(out).toHaveLength(1);
    expect(out[0].originalText).toBe('DARK LINE 1 DARK LINE 2');
  });

  it('separates light and dark bubbles even when both contain ~30% contrasting text pixels', () => {
    const pageImg = createBuffer(400, 300, 255);
    paintRect(pageImg, 60, 110, 220, 80, 15); // dark bottom bubble

    const lightBox = { x: 100, y: 60, width: 140, height: 24 };
    const darkBox = { x: 100, y: 120, width: 140, height: 24 };
    // ~30% contrasting text ink inside both boxes
    paintRect(pageImg, 100, 60, 42, 24, 10);
    paintRect(pageImg, 100, 120, 42, 24, 250);

    expect(BubbleWallDetector.hasHorizontalWallBetween(pageImg, lightBox, darkBox)).toBe(true);

    const out = BubbleAggregator.aggregateDialogues(
      [
        makeItem({ originalText: 'LIGHT TEXT', box: lightBox }),
        makeItem({ originalText: 'DARK TEXT', box: darkBox, isDarkBackground: true })
      ],
      400,
      300,
      undefined,
      pageImg
    );
    expect(out).toHaveLength(2);
  });

  it('detects vertical wall between side-by-side CJK columns', () => {
    const pageImg = createBuffer(400, 300, 255);
    // 4px vertical black border separating two columns
    paintRect(pageImg, 210, 30, 4, 200, 10);

    const leftCol = { x: 160, y: 60, width: 36, height: 120 };
    const rightCol = { x: 230, y: 60, width: 36, height: 120 }; // gap = 34px <= 1.85 * 36

    expect(BubbleWallDetector.hasVerticalWallBetween(pageImg, leftCol, rightCol)).toBe(true);

    const out = BubbleAggregator.aggregateDialogues(
      [
        makeItem({ originalText: '左列', isVertical: true, box: leftCol }),
        makeItem({ originalText: '右列', isVertical: true, box: rightCol })
      ],
      400,
      300,
      undefined,
      pageImg
    );
    expect(out).toHaveLength(2);
  });
});
