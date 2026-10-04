/**
 * ImageCompressor: Helper to capture and optimize comic images for Vision AI & OCR.
 * Preserves high width fidelity (720px - 1280px) so small text in speech bubbles
 * remains crisp and easily readable without horizontal squashing.
 * Slices tall continuous webtoon strips into manageable panels.
 */
export interface CompressedImageResult {
  dataUrl?: string;
  naturalWidth: number;
  naturalHeight: number;
  compressedWidth: number;
  compressedHeight: number;
}

export interface ImageSliceInfo {
  dataUrl: string;
  startY: number;
  sliceHeight: number;
  naturalWidth: number;
  naturalHeight: number;
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
      // Cross-origin tainted canvas fallback
    }

    return {
      naturalWidth,
      naturalHeight,
      compressedWidth: targetWidth,
      compressedHeight: targetHeight
    };
  }

  /**
   * Slices a tall continuous webtoon image strip into standard page-sized chunks
   * (e.g. 2200px height with 150px overlap) for high-accuracy Vision AI / OCR.
   */
  public static sliceForProcessing(
    img: HTMLImageElement,
    maxSliceHeight: number = 2200,
    overlap: number = 150,
    quality: number = 0.85
  ): ImageSliceInfo[] {
    const naturalWidth = img.naturalWidth || img.width || 800;
    const naturalHeight = img.naturalHeight || img.height || 1200;

    // Fast path: standard comic page / panel (Toonhey, manga, or sliced webtoon)
    if (naturalHeight <= maxSliceHeight + 200) {
      const compressed = this.compressForVision(img, 1280, quality);
      if (compressed.dataUrl) {
        return [
          {
            dataUrl: compressed.dataUrl,
            startY: 0,
            sliceHeight: naturalHeight,
            naturalWidth,
            naturalHeight
          }
        ];
      }
      return [];
    }

    // Tall webtoon strip (Toonily, Madara, etc. > 2400px tall)
    let targetWidth = naturalWidth;
    if (naturalWidth > 1280) {
      targetWidth = 1280;
    }

    const slices: ImageSliceInfo[] = [];
    const step = maxSliceHeight - overlap;

    for (let startY = 0; startY < naturalHeight; startY += step) {
      const currentH = Math.min(maxSliceHeight, naturalHeight - startY);
      const targetH = naturalWidth > 1280 ? Math.round((currentH / naturalWidth) * 1280) : currentH;

      try {
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        ctx.drawImage(img, 0, startY, naturalWidth, currentH, 0, 0, targetWidth, targetH);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);

        slices.push({
          dataUrl,
          startY,
          sliceHeight: currentH,
          naturalWidth,
          naturalHeight
        });
      } catch {
        // Tainted canvas error
        break;
      }
    }

    return slices;
  }
}
