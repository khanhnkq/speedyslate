import { describe, it, expect } from 'vitest';
import { RecBatcher } from '../../src/worker/rec-batcher';

describe('RecBatcher.assignBuckets', () => {
  it('assigns each width to the smallest fitting bucket', () => {
    const groups = RecBatcher.assignBuckets([40, 70, 300, 900]);
    expect(groups.get(64)).toEqual([0]);
    expect(groups.get(128)).toEqual([1]);
    expect(groups.get(512)).toEqual([2]);
    expect(groups.get(960)).toEqual([3]);
    expect(groups.size).toBe(4);
  });

  it('keeps original index order within a bucket', () => {
    const groups = RecBatcher.assignBuckets([64, 10, 64, 30]);
    expect(groups.get(64)).toEqual([0, 1, 2, 3]);
  });

  it('caps oversized widths at the largest bucket', () => {
    const groups = RecBatcher.assignBuckets([1200, 961]);
    expect(groups.get(960)).toEqual([0, 1]);
  });

  it('honors a custom bucket list', () => {
    const groups = RecBatcher.assignBuckets([5, 50], [8, 32, 64]);
    expect(groups.get(8)).toEqual([0]);
    expect(groups.get(64)).toEqual([1]);
  });
});

describe('RecBatcher.concatTensors', () => {
  it('zero-pads the right edge of each row and channel', () => {
    const targetH = 2;
    const w = 3;
    const bucketW = 8;
    const t = new Float32Array(3 * targetH * w).fill(1);
    const merged = RecBatcher.concatTensors([t], [w], bucketW, targetH);

    expect(merged.length).toBe(3 * targetH * bucketW);
    // Channel 0: row 0 data at 0..2, padding at 3..7
    expect(merged[2]).toBe(1);
    expect(merged[3]).toBe(0);
    expect(merged[bucketW - 1]).toBe(0);
    // Channel 0 row 1 starts at bucketW
    expect(merged[bucketW + 2]).toBe(1);
    expect(merged[bucketW + 3]).toBe(0);
    // Channel 1 plane starts at targetH * bucketW
    const ch1 = targetH * bucketW;
    expect(merged[ch1 + 2]).toBe(1);
    expect(merged[ch1 + 3]).toBe(0);
  });

  it('places the second tensor at its own batch offset', () => {
    const targetH = 1;
    const bucketW = 4;
    const a = new Float32Array(3 * targetH * 2).fill(0.5);
    const b = new Float32Array(3 * targetH * 4).fill(-1);
    const merged = RecBatcher.concatTensors([a, b], [2, 4], bucketW, targetH);

    const batchStride = 3 * targetH * bucketW;
    expect(merged.length).toBe(2 * batchStride);
    expect(merged[0]).toBe(0.5);
    expect(merged[2]).toBe(0);
    expect(merged[batchStride]).toBe(-1);
    expect(merged[batchStride + batchStride / 3]).toBe(-1);
  });
});
