import { BubbleTheme } from '../shared/types';
import { SafeMessenger } from './safe-messenger';
import { OverlayRenderer } from './overlay/overlay-renderer';
import { PageBadgeManager } from './page-badge';

/**
 * CacheRestorer: Restores previously completed translations from IndexedDB cache
 * without needing re-OCR or API queries (0ms instant load).
 * Follows Single Responsibility Principle (SRP) & strictly < 500 lines.
 */
export class CacheRestorer {
  public static async restore(
    images: HTMLImageElement[],
    completedImages: Set<HTMLImageElement>,
    bubbleTheme: BubbleTheme,
    onRestored: (count: number) => void,
    markCompleted: (img: HTMLImageElement) => void
  ): Promise<void> {
    if (images.length === 0) return;

    const urls = images
      .map((img) => img.dataset.src || img.getAttribute('data-src') || img.src)
      .filter(Boolean);

    try {
      const resp: any = await SafeMessenger.send({
        action: 'GET_CHAPTER_TRANSLATIONS',
        imageUrls: urls
      });

      if (!resp?.success || !resp.translations) return;

      const cache = resp.translations;
      let newlyRestored = 0;

      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        if (completedImages.has(img)) continue;

        const url = img.dataset.src || img.getAttribute('data-src') || img.src;
        const cached = cache[url];
        if (cached && Array.isArray(cached.dialogues) && cached.dialogues.length > 0) {
          const wrapper = img.parentElement;
          if (wrapper) {
            OverlayRenderer.renderDialogues(
              wrapper,
              cached.dialogues,
              img.naturalWidth || cached.naturalWidth || 800,
              img.naturalHeight || cached.naturalHeight || 1200,
              bubbleTheme
            );
            img.dataset.slateStatus = 'translated';
            PageBadgeManager.updateBadge(wrapper, i, 'translated', cached.dialogues.length);
          }
          markCompleted(img);
          newlyRestored++;
        }
      }

      if (newlyRestored > 0) {
        onRestored(newlyRestored);
      }
    } catch {
      // Quiet fallback if cache retrieval encounters context interruption
    }
  }
}
