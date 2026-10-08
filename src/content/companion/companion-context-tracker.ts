import { ToonheyAdapter } from '../toonhey-adapter';
import { SafeMessenger } from '../safe-messenger';

/**
 * Comic Panel Snapshot & Context Tracker
 * Captures currently viewed comic panels and OCR translation context
 * Following Single Responsibility Principle (SRP)
 */
export class CompanionContextTracker {
  private lastCapturedHash: string = '';
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  private cleanImageCache: Map<string, HTMLImageElement> = new Map();

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  /**
   * Finds the most prominent comic image currently visible in viewport
   */
  public getActiveMangaImage(): HTMLImageElement | null {
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    let maxVisibleArea = 0;
    let mostVisibleImg: HTMLImageElement | null = null;

    const candidates = ToonheyAdapter.getChapterImages();
    const imageList = candidates.length > 0
      ? candidates
      : Array.from(document.querySelectorAll<HTMLImageElement>('img')).filter(
          (img) => (img.naturalWidth >= 200 || img.width >= 200) && (img.naturalHeight >= 200 || img.height >= 200)
        );

    for (const img of imageList) {
      const rect = img.getBoundingClientRect();
      const visibleX = Math.max(0, Math.min(rect.right, viewportWidth) - Math.max(rect.left, 0));
      const visibleY = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));
      const visibleArea = visibleX * visibleY;

      if (visibleArea > maxVisibleArea) {
        maxVisibleArea = visibleArea;
        mostVisibleImg = img;
      }
    }

    return mostVisibleImg;
  }

  /**
   * Captures the visible region of the active comic image as JPEG.
   * If canvas is tainted by cross-origin CORS, falls back to fetching
   * the clean image data via Background Service Worker.
   * Compresses to max 768px dimension and 0.65 quality for ultra-low latency.
   */
  public async captureActivePanelSnapshot(
    force: boolean = false
  ): Promise<{ base64Jpeg: string; dataUrl: string } | null> {
    const img = this.getActiveMangaImage();
    if (!img || !this.ctx) return null;

    const rect = img.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const cropTop = Math.max(0, -rect.top);
    const cropBottom = Math.max(0, rect.bottom - viewportHeight);
    const domHeight = Math.max(1, rect.height);
    const maxDim = 768;

    let dataUrl: string | null = null;

    // Attempt 1: Direct in-DOM canvas draw (0ms latency if same-origin / untainted)
    try {
      const sourceNatW = img.naturalWidth || img.width || 800;
      const sourceNatH = img.naturalHeight || img.height || 1200;
      const scaleY = sourceNatH / domHeight;
      const sourceY = Math.max(0, cropTop * scaleY);
      const sourceH = Math.min(sourceNatH - sourceY, Math.max(100, (rect.height - cropTop - cropBottom) * scaleY));
      const scale = Math.min(1, maxDim / Math.max(sourceNatW, sourceH));
      const targetW = Math.max(1, Math.round(sourceNatW * scale));
      const targetH = Math.max(1, Math.round(sourceH * scale));

      this.canvas.width = targetW;
      this.canvas.height = targetH;
      this.ctx.drawImage(img, 0, sourceY, sourceNatW, sourceH, 0, 0, targetW, targetH);
      dataUrl = this.canvas.toDataURL('image/jpeg', 0.65);
    } catch {
      // Canvas is tainted by cross-origin manga image -> proceed to clean background fetch
      dataUrl = null;
    }

    // Attempt 2: Background fetch clean image bypassing CORS
    if (!dataUrl) {
      const imageUrl = img.currentSrc || img.src || img.getAttribute('data-src') || '';
      if (imageUrl) {
        const cleanImg = await this.getCleanImage(imageUrl);
        if (cleanImg && this.ctx) {
          const cNatW = cleanImg.naturalWidth;
          const cNatH = cleanImg.naturalHeight;
          const cScaleY = cNatH / domHeight;
          const cSourceY = Math.max(0, cropTop * cScaleY);
          const cSourceH = Math.min(cNatH - cSourceY, Math.max(100, (rect.height - cropTop - cropBottom) * cScaleY));
          const cScale = Math.min(1, maxDim / Math.max(cNatW, cSourceH));
          const targetW = Math.max(1, Math.round(cNatW * cScale));
          const targetH = Math.max(1, Math.round(cSourceH * cScale));

          this.canvas.width = targetW;
          this.canvas.height = targetH;
          this.ctx.drawImage(cleanImg, 0, cSourceY, cNatW, cSourceH, 0, 0, targetW, targetH);
          dataUrl = this.canvas.toDataURL('image/jpeg', 0.65);
        }
      }
    }

    if (!dataUrl) return null;

    const base64Jpeg = dataUrl.split(',')[1];
    if (!base64Jpeg) return null;

    // Deduplicate identical captures unless forced (e.g. user question)
    const shortHash = base64Jpeg.slice(0, 40);
    if (!force && shortHash === this.lastCapturedHash) {
      return null;
    }
    this.lastCapturedHash = shortHash;

    return { base64Jpeg, dataUrl };
  }

  /**
   * Safely loads a clean Image instance via Background fetch to bypass CORS tainting
   */
  private async getCleanImage(imageUrl: string): Promise<HTMLImageElement | null> {
    if (!imageUrl) return null;
    if (this.cleanImageCache.has(imageUrl)) {
      return this.cleanImageCache.get(imageUrl)!;
    }

    try {
      const resp: any = await SafeMessenger.send({
        action: 'FETCH_IMAGE_BASE64',
        imageUrl,
        chapterUrl: window.location.href
      });

      if (!resp?.success || !resp.base64Data) {
        return null;
      }

      const mime = resp.mimeType || 'image/jpeg';
      const cleanImg = new Image();
      await new Promise<void>((resolve, reject) => {
        cleanImg.onload = () => resolve();
        cleanImg.onerror = reject;
        cleanImg.src = `data:${mime};base64,${resp.base64Data}`;
      });

      // Maintain compact cache (max 5 images)
      if (this.cleanImageCache.size > 5) {
        const firstKey = this.cleanImageCache.keys().next().value;
        if (firstKey) this.cleanImageCache.delete(firstKey);
      }
      this.cleanImageCache.set(imageUrl, cleanImg);
      return cleanImg;
    } catch (err) {
      console.warn('[CompanionContextTracker] Failed to load clean image via background:', err);
      return null;
    }
  }

  /**
   * Collects recent dialogue translation text currently visible on page
   */
  public getVisibleTranslatedText(): string {
    const overlays = Array.from(
      document.querySelectorAll<HTMLElement>(
        '.speedyslate-bubble, .speedyslate-overlay, [data-speedyslate-dialogue]'
      )
    );
    const texts: string[] = [];

    for (const el of overlays) {
      const rect = el.getBoundingClientRect();
      if (rect.top >= -50 && rect.bottom <= window.innerHeight + 50) {
        const translated = el.textContent?.trim();
        const title = el.getAttribute('title') || '';
        const origMatch = title.match(/Gốc:\s*"([^"]+)"/);
        const original = origMatch ? origMatch[1] : '';

        if (translated && original) {
          texts.push(`[Gốc: "${original}" -> Dịch: "${translated}"]`);
        } else if (translated) {
          texts.push(`[Dịch: "${translated}"]`);
        }
      }
    }

    return texts.slice(0, 8).join('\n');
  }
}
