import { describe, it, expect } from 'vitest';
import { BubbleAggregator } from '../../src/worker/bubble-aggregator';
import { DialogueItem } from '../../src/shared/types';

const IMG_W = 800;
const IMG_H = 2000;

let seq = 0;
function makeItem(overrides: Partial<DialogueItem>): DialogueItem {
  return {
    id: `item-${seq++}`,
    box: { x: 100, y: 100, width: 200, height: 40 },
    originalText: 'line',
    ...overrides
  };
}

describe('BubbleAggregator — vertical column grouping', () => {
  it('merges 3 adjacent vertical columns into one bubble, text joined right→left', () => {
    const items = [
      makeItem({ originalText: 'LEFT', isVertical: true, box: { x: 180, y: 55, width: 40, height: 115 } }),
      makeItem({ originalText: 'RIGHT', isVertical: true, box: { x: 300, y: 50, width: 40, height: 120 } }),
      makeItem({ originalText: 'MID', isVertical: true, box: { x: 240, y: 60, width: 40, height: 110 } })
    ];
    const out = BubbleAggregator.aggregateDialogues(items, IMG_W, IMG_H);
    expect(out).toHaveLength(1);
    expect(out[0].originalText).toBe('RIGHT MID LEFT');
    expect(out[0].isVertical).toBe(true);
    expect(out[0].lineBoxes).toHaveLength(3);
    expect(out[0].lineBoxes!.map((b) => b.x)).toEqual([300, 240, 180]);
  });

  it('does not merge columns separated by more than 2.8x width', () => {
    const items = [
      makeItem({ originalText: 'A', isVertical: true, box: { x: 400, y: 50, width: 40, height: 120 } }),
      makeItem({ originalText: 'B', isVertical: true, box: { x: 50, y: 50, width: 40, height: 120 } })
    ];
    const out = BubbleAggregator.aggregateDialogues(items, IMG_W, IMG_H);
    expect(out).toHaveLength(2);
  });

  it('does not merge vertical items with horizontal items', () => {
    const items = [
      makeItem({ originalText: 'COL', isVertical: true, box: { x: 300, y: 50, width: 40, height: 120 } }),
      makeItem({ originalText: 'HLINE', box: { x: 100, y: 500, width: 200, height: 40 } })
    ];
    const out = BubbleAggregator.aggregateDialogues(items, IMG_W, IMG_H);
    expect(out).toHaveLength(2);
  });
});

describe('BubbleAggregator — bubble metadata', () => {
  it('kind majority vote: 2 sfx + 1 dialogue → sfx', () => {
    const items = [
      makeItem({ originalText: 'BOOM', kind: 'sfx', box: { x: 100, y: 100, width: 200, height: 40 } }),
      makeItem({ originalText: 'CRASH', kind: 'sfx', box: { x: 100, y: 150, width: 200, height: 40 } }),
      makeItem({ originalText: 'hey', kind: 'dialogue', box: { x: 100, y: 200, width: 200, height: 40 } })
    ];
    const out = BubbleAggregator.aggregateDialogues(items, IMG_W, IMG_H);
    expect(out).toHaveLength(1);
    expect(out[0].kind).toBe('sfx');
  });

  it('lineBoxes sorted by y ascending for horizontal bubbles', () => {
    const items = [
      makeItem({ originalText: 'lower', box: { x: 100, y: 300, width: 200, height: 40 } }),
      makeItem({ originalText: 'upper', box: { x: 100, y: 100, width: 200, height: 40 } }),
      makeItem({ originalText: 'mid', box: { x: 100, y: 200, width: 200, height: 40 } })
    ];
    const out = BubbleAggregator.aggregateDialogues(items, IMG_W, IMG_H);
    expect(out).toHaveLength(1);
    expect(out[0].lineBoxes!.map((b) => b.y)).toEqual([100, 200, 300]);
    expect(out[0].originalText).toBe('upper mid lower');
  });

  it('confidence = mean of members that have one; bgColor = majority hex', () => {
    const items = [
      makeItem({ originalText: 'a', confidence: 0.9, bgColor: '#fff8e7', box: { x: 100, y: 100, width: 200, height: 40 } }),
      makeItem({ originalText: 'b', confidence: 0.6, bgColor: '#fff8e7', box: { x: 100, y: 150, width: 200, height: 40 } }),
      makeItem({ originalText: 'c', bgColor: '#111111', box: { x: 100, y: 200, width: 200, height: 40 } })
    ];
    const out = BubbleAggregator.aggregateDialogues(items, IMG_W, IMG_H);
    expect(out).toHaveLength(1);
    expect(out[0].confidence).toBeCloseTo(0.75, 5);
    expect(out[0].bgColor).toBe('#fff8e7');
    expect(out[0].kind).toBe('dialogue'); // all members undefined → default
  });

  it('omits confidence/bgColor when no member provides them', () => {
    const items = [
      makeItem({ originalText: 'x', box: { x: 100, y: 100, width: 200, height: 40 } }),
      makeItem({ originalText: 'y', box: { x: 100, y: 150, width: 200, height: 40 } })
    ];
    const out = BubbleAggregator.aggregateDialogues(items, IMG_W, IMG_H);
    expect(out).toHaveLength(1);
    expect(out[0].confidence).toBeUndefined();
    expect(out[0].bgColor).toBeUndefined();
  });

  it('single item still receives metadata defaults (kind, lineBoxes)', () => {
    const out = BubbleAggregator.aggregateDialogues(
      [makeItem({ originalText: 'solo', box: { x: 10, y: 10, width: 100, height: 30 } })],
      IMG_W,
      IMG_H
    );
    expect(out).toHaveLength(1);
    expect(out[0].kind).toBe('dialogue');
    expect(out[0].lineBoxes).toHaveLength(1);
    expect(out[0].lineBoxes![0].x).toBe(10);
  });
});

describe('BubbleAggregator — horizontal regression', () => {
  it('still merges stacked plain lines into one bubble (kind defaults to dialogue)', () => {
    const items = [
      makeItem({ originalText: "Won't", box: { x: 120, y: 100, width: 160, height: 40 } }),
      makeItem({ originalText: 'BE HOME TONIGHT', box: { x: 60, y: 150, width: 280, height: 40 } })
    ];
    const out = BubbleAggregator.aggregateDialogues(items, IMG_W, IMG_H);
    expect(out).toHaveLength(1);
    expect(out[0].originalText).toBe("Won't BE HOME TONIGHT");
    expect(out[0].kind).toBe('dialogue');
    expect(out[0].isVertical).toBeUndefined();
    expect(out[0].lineBoxes).toHaveLength(2);
  });

  it('keeps separate speech bubbles apart', () => {
    const items = [
      makeItem({ originalText: 'top bubble', box: { x: 100, y: 100, width: 200, height: 40 } }),
      makeItem({ originalText: 'far away', box: { x: 100, y: 900, width: 200, height: 40 } })
    ];
    const out = BubbleAggregator.aggregateDialogues(items, IMG_W, IMG_H);
    expect(out).toHaveLength(2);
  });
});
