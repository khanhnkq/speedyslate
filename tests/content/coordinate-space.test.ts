import { describe, expect, it } from 'vitest';
import { ImageCompressor, resolveOverlayDimensions } from '../../src/content/image-compressor';

describe('resolveOverlayDimensions', () => {
  it('prefers OCR bitmap dimensions over larger DOM naturalWidth to prevent coordinate drift', () => {
    expect(resolveOverlayDimensions(1280, 1920, 1600, 2400)).toEqual({ width: 1280, height: 1920 });
  });

  it('falls back to DOM dimensions only when OCR dimensions are absent or non-positive', () => {
    expect(resolveOverlayDimensions(undefined, undefined, 1600, 2400)).toEqual({ width: 1600, height: 2400 });
    expect(resolveOverlayDimensions(0, 0, 1600, 2400)).toEqual({ width: 1600, height: 2400 });
  });
});

describe('ImageCompressor.captureForOcr', () => {
  it('downscales proportionally only when width exceeds maxWidth and preserves native dimensions otherwise', () => {
    const normal = ImageCompressor.captureForOcr({ naturalWidth: 1600, naturalHeight: 2400 } as HTMLImageElement, 2200);
    expect(normal.compressedWidth).toBe(1600);
    expect(normal.compressedHeight).toBe(2400);

    const huge = ImageCompressor.captureForOcr({ naturalWidth: 3300, naturalHeight: 4950 } as HTMLImageElement, 2200);
    expect(huge.compressedWidth).toBe(2200);
    expect(huge.compressedHeight).toBe(3300);
  });
});
