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

export class ImageCompressor {
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
