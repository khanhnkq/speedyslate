/**
 * ImageCompressor: Helper to capture and optimize comic images for Vision AI & OCR.
 * Caps maximum dimension at 1280px to minimize token cost and upload latency,
 * while preserving high fidelity for small speech bubbles.
 */
export interface CompressedImageResult {
  dataUrl?: string;
  naturalWidth: number;
  naturalHeight: number;
  compressedWidth: number;
  compressedHeight: number;
}

export class ImageCompressor {
  /**
   * Captures and downsizes an image for Vision AI transmission.
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

    if (Math.max(naturalWidth, naturalHeight) > maxDim) {
      if (naturalWidth > naturalHeight) {
        targetWidth = maxDim;
        targetHeight = Math.round((naturalHeight / naturalWidth) * maxDim);
      } else {
        targetHeight = maxDim;
        targetWidth = Math.round((naturalWidth / naturalHeight) * maxDim);
      }
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
      // Cross-origin tainted canvas fallback
    }

    return {
      naturalWidth,
      naturalHeight,
      compressedWidth: targetWidth,
      compressedHeight: targetHeight
    };
  }
}
