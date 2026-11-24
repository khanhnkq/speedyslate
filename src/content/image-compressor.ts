/**
 * ImageCompressor: Helper to capture and optimize comic images for Vision AI & OCR.
 * Preserves high width fidelity (720px - 1280px) so small text in speech bubbles
 * remains crisp and easily readable without horizontal squashing.
 * Cross-origin tainted canvas errors are safely handled with fallback.
 */
export interface CompressedImageResult {
  dataUrl?: string;
  naturalWidth: number;
  naturalHeight: number;
  compressedWidth: number;
  compressedHeight: number;
}

export function resolveOverlayDimensions(
  ocrWidth: number | undefined,
  ocrHeight: number | undefined,
  fallbackWidth: number,
  fallbackHeight: number
): { width: number; height: number } {
  return {
    width: ocrWidth && ocrWidth > 0 ? ocrWidth : fallbackWidth || 800,
    height: ocrHeight && ocrHeight > 0 ? ocrHeight : fallbackHeight || 1200
  };
}

export class ImageCompressor {
  /**
   * Captures lossless PNG pixels for local Hybrid OCR without JPEG 8x8 ringing.
   * Only scales down proportionally when naturalWidth exceeds maxWidth (default 2200px).
   */
  public static captureForOcr(
    img: HTMLImageElement,
    maxWidth: number = 2200
  ): CompressedImageResult {
    const naturalWidth = img.naturalWidth || img.width || 800;
    const naturalHeight = img.naturalHeight || img.height || 1200;

    let targetWidth = naturalWidth;
    let targetHeight = naturalHeight;
    if (naturalWidth > maxWidth) {
      const scale = maxWidth / naturalWidth;
      targetWidth = maxWidth;
      targetHeight = Math.round(naturalHeight * scale);
    }

    try {
      if (typeof document !== 'undefined') {
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
          return {
            dataUrl: canvas.toDataURL('image/png'),
            naturalWidth,
            naturalHeight,
            compressedWidth: targetWidth,
            compressedHeight: targetHeight
          };
        }
      }
    } catch {
      // Cross-origin tainted canvas fallback (handled cleanly via background fetch)
    }

    return {
      naturalWidth,
      naturalHeight,
      compressedWidth: targetWidth,
      compressedHeight: targetHeight
    };
  }

  /**
   * Captures and optimizes an image for Vision AI transmission.
   * Only scales down width if naturalWidth exceeds maxDim (1280px).
   * Does NOT squash width when height is tall!
   */
  public static compressForVision(
    img: HTMLImageElement,
    maxDim: number = 1280,
    quality: number = 0.85
  ): CompressedImageResult {
    const naturalWidth = img.naturalWidth || img.width || 800;
    const naturalHeight = img.naturalHeight || img.height || 1200;

    let targetWidth = naturalWidth;
    let targetHeight = naturalHeight;

    // Only scale down if width exceeds maxDim, preserving comic panel resolution
    if (naturalWidth > maxDim) {
      const scale = maxDim / naturalWidth;
      targetWidth = maxDim;
      targetHeight = Math.round(naturalHeight * scale);
    }

    try {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        return {
          dataUrl,
          naturalWidth,
          naturalHeight,
          compressedWidth: targetWidth,
          compressedHeight: targetHeight
        };
      }
    } catch {
      // Cross-origin tainted canvas fallback (handled cleanly via background fetch)
    }

    return {
      naturalWidth,
      naturalHeight,
      compressedWidth: targetWidth,
      compressedHeight: targetHeight
    };
  }
}
