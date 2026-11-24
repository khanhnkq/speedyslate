import { describe, expect, it } from 'vitest';
import { decodePixels, encodeErasePatches, encodePixelsRle } from '../../src/shared/erase-codec';
import { DialogueItem } from '../../src/shared/types';

describe('erase-codec rle1', () => {
  it('losslessly round-trips sparse + flat-fill RGBA patches at <20% of raw base64 size', () => {
    const raw = new Uint8ClampedArray(120 * 80 * 4); // 38,400 bytes
    for (let i = 1200; i < 4800; i++) {
      raw.set([248, 246, 240, 255], i * 4);
    }
    for (let i = 5000; i < 5050; i++) {
      raw.set([(i * 17) & 255, (i * 31) & 255, (i * 13) & 255, 255], i * 4);
    }
    const rle = encodePixelsRle(raw);
    expect(rle.startsWith('rle1:')).toBe(true);
    expect(rle.length).toBeLessThan(((raw.length * 4) / 3) * 0.2);
    expect(Array.from(decodePixels(rle))).toEqual(Array.from(raw));
  });

  it('encodes DialogueItem erasePatches in-place idempotently and decodes legacy unprefixed base64', () => {
    const raw = new Uint8ClampedArray([10, 20, 30, 255, 0, 0, 0, 0, 0, 0, 0, 0]);
    const legacyB64 = Buffer.from(raw).toString('base64');
    expect(Array.from(decodePixels(legacyB64))).toEqual(Array.from(raw));

    const item: DialogueItem = {
      id: 'd1',
      originalText: 'Hi',
      box: { x: 0, y: 0, width: 3, height: 1 },
      erasePatches: [{ x: 0, y: 0, width: 3, height: 1, pixels: new Uint8ClampedArray(raw) }]
    };
    encodeErasePatches([item]);
    expect(typeof item.erasePatches![0].pixels).toBe('string');
    expect((item.erasePatches![0].pixels as string).startsWith('rle1:')).toBe(true);
    expect(Array.from(decodePixels(item.erasePatches![0].pixels))).toEqual(Array.from(raw));
  });
});
