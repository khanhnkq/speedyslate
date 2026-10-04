import { DialogueItem } from '../../shared/types';
import { ITranslationProvider } from './translation-provider.interface';
import { ApiRateLimiter } from './rate-limiter';
import { DebugLogger } from '../../shared/debug-logger';

/**
 * VisionStripSlicer: Slices tall continuous webtoon image strips (height > 2200px)
 * into standard page-sized chunks for Vision AI within background/worker context.
 * Prevents horizontal squashing, maintains high text legibility, and ensures
 * exact bounding box coordinates without cross-origin tainted canvas issues.
 * Following Single Responsibility Principle (SRP) & strictly < 500 lines.
 */
export class VisionStripSlicer {
  /**
   * Translates a comic image with Vision AI, automatically slicing if it's a tall strip.
   */
  public static async processStrip(
    base64Data: string,
    mimeType: string,
    naturalWidth: number,
    naturalHeight: number,
    provider: ITranslationProvider,
    targetLang: string,
    minDelayMs: number,
    maxSliceHeight = 2200,
    overlap = 150
  ): Promise<DialogueItem[]> {
    if (!provider.translateImage) return [];

    // 1. Fast path: standard comic page (Toonhey, manga, or single panel)
    if (naturalHeight <= maxSliceHeight + 200) {
      return ApiRateLimiter.throttle(minDelayMs, () =>
        provider.translateImage!(base64Data, mimeType, targetLang, naturalWidth, naturalHeight)
      );
    }

    try {
      // 2. Decode base64 to Blob & ImageBitmap in background context (untainted)
      const dataUri = `data:${mimeType};base64,${base64Data}`;
      const res = await fetch(dataUri);
      const blob = await res.blob();
      const bitmap = await createImageBitmap(blob);

      const width = bitmap.width || naturalWidth;
      const height = bitmap.height || naturalHeight;

      const step = maxSliceHeight - overlap;
      const allDialogues: DialogueItem[] = [];

      for (let startY = 0; startY < height; startY += step) {
        const currentH = Math.min(maxSliceHeight, height - startY);

        const canvas = new OffscreenCanvas(width, currentH);
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        ctx.drawImage(bitmap, 0, startY, width, currentH, 0, 0, width, currentH);

        const sliceBlob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.85 });
        const sliceBase64 = await this.blobToBase64(sliceBlob);

        const sliceDialogues = await ApiRateLimiter.throttle(minDelayMs, () =>
          provider.translateImage!(sliceBase64, 'image/jpeg', targetLang, width, currentH)
        );

        if (Array.isArray(sliceDialogues)) {
          for (const d of sliceDialogues) {
            if (!d.normBox) continue;

            const slicePixelYmin = (d.normBox.ymin / 1000) * currentH;
            const slicePixelYmax = (d.normBox.ymax / 1000) * currentH;
            const globalPixelYmin = startY + slicePixelYmin;
            const globalPixelYmax = startY + slicePixelYmax;

            // Remap normalized coordinates to global image scale (0..1000)
            const globalNormYmin = Math.round((globalPixelYmin / height) * 1000);
            const globalNormYmax = Math.round((globalPixelYmax / height) * 1000);

            const remapped: DialogueItem = {
              ...d,
              box: {
                x: Math.round((d.normBox.xmin / 1000) * width),
                y: Math.round(globalPixelYmin),
                width: Math.round(((d.normBox.xmax - d.normBox.xmin) / 1000) * width),
                height: Math.round(globalPixelYmax - globalPixelYmin),
                confidence: d.box?.confidence ?? 0.95
              },
              normBox: {
                ymin: globalNormYmin,
                xmin: d.normBox.xmin,
                ymax: globalNormYmax,
                xmax: d.normBox.xmax
              }
            };

            // Deduplicate across slice overlap
            if (startY > 0 && slicePixelYmin < overlap + 30) {
              const curNormXmin = d.normBox.xmin;
              const isDup = allDialogues.some((existing) => {
                if (!existing.normBox) return false;
                const yDiff = Math.abs(existing.normBox.ymin - globalNormYmin);
                const xDiff = Math.abs(existing.normBox.xmin - curNormXmin);
                return yDiff < 20 && xDiff < 25;
              });
              if (isDup) continue;
            }

            allDialogues.push(remapped);
          }
        }
      }

      bitmap.close();
      return allDialogues;
    } catch (err: any) {
      DebugLogger.error('VisionStripSlicer', 'Slicing failed, falling back to direct translation', err);
      // Fallback: direct translation if canvas slicing fails
      return ApiRateLimiter.throttle(minDelayMs, () =>
        provider.translateImage!(base64Data, mimeType, targetLang, naturalWidth, naturalHeight)
      );
    }
  }

  /**
   * Universal chunked base64 conversion from Blob (avoids FileReader in ServiceWorker)
   */
  private static async blobToBase64(blob: Blob): Promise<string> {
    const buffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const chunkSize = 32768;
    const chunks: string[] = [];
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      chunks.push(String.fromCharCode.apply(null, chunk as unknown as number[]));
    }
    return btoa(chunks.join(''));
  }
}
