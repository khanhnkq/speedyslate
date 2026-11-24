/**
 * Groups rec crops by width bucket and merges their CHW tensors into one
 * batched tensor so a single session.run handles up to MAX_BATCH boxes.
 * Pure helpers: no ONNX or DOM dependency, unit-testable in Node.
 */
export class RecBatcher {
  static readonly BUCKETS = [64, 128, 256, 512, 960];
  static readonly MAX_BATCH = 8;

  /**
   * Maps each target width to the smallest bucket that fits it.
   * Returns bucket width -> original indices (order preserved).
   */
  static assignBuckets(
    widths: number[],
    buckets: number[] = RecBatcher.BUCKETS
  ): Map<number, number[]> {
    const groups = new Map<number, number[]>();
    const maxBucket = buckets[buckets.length - 1];
    for (let i = 0; i < widths.length; i++) {
      let bucketW = maxBucket;
      for (const b of buckets) {
        if (widths[i] <= b) {
          bucketW = b;
          break;
        }
      }
      const list = groups.get(bucketW);
      if (list) {
        list.push(i);
      } else {
        groups.set(bucketW, [i]);
      }
    }
    return groups;
  }

  /**
   * Merges per-crop CHW float tensors into a [B,3,targetH,bucketW] buffer.
   * Right-side padding stays 0.0 (post-normalization mid-gray).
   */
  static concatTensors(
    tensors: Float32Array[],
    widths: number[],
    bucketW: number,
    targetH: number
  ): Float32Array {
    const channelSize = targetH * bucketW;
    const merged = new Float32Array(tensors.length * 3 * channelSize);
    for (let i = 0; i < tensors.length; i++) {
      const w = Math.min(widths[i], bucketW);
      const srcChannel = targetH * w;
      const dstBase = i * 3 * channelSize;
      for (let c = 0; c < 3; c++) {
        const srcOff = c * srcChannel;
        const dstOff = dstBase + c * channelSize;
        for (let y = 0; y < targetH; y++) {
          merged.set(
            tensors[i].subarray(srcOff + y * w, srcOff + y * w + w),
            dstOff + y * bucketW
          );
        }
      }
    }
    return merged;
  }
}
