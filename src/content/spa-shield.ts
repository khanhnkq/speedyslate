import { MediaTargetResolver } from './media-target';

/**
 * SpaOverlayShield: Watches wrapped `<img>` elements in React/Vue single-page
 * readers. When the reader navigates to a new page by mutating `src`/`srcset`
 * on a recycled `<img>` element, clears stale overlays and notifies the scanner.
 */
export class SpaOverlayShield {
  private observers = new WeakMap<HTMLImageElement, MutationObserver>();
  private trackedUrls = new WeakMap<HTMLImageElement, string>();

  constructor(private onRecycledImage: (img: HTMLImageElement) => void) {}

  public watch(img: HTMLImageElement): void {
    if (this.observers.has(img)) return;
    const initial = MediaTargetResolver.extractBestImageUrl(img) || img.src || '';
    this.trackedUrls.set(img, initial);

    const observer = new MutationObserver(() => {
      const nextUrl = MediaTargetResolver.extractBestImageUrl(img) || img.src || '';
      if (!nextUrl || nextUrl.startsWith('data:image/svg')) return;
      const prevUrl = this.trackedUrls.get(img) || '';
      if (prevUrl && nextUrl !== prevUrl) {
        this.trackedUrls.set(img, nextUrl);
        const wrapper = img.parentElement;
        if (wrapper?.classList.contains('speedyslate-wrapper')) {
          wrapper
            .querySelectorAll('.speedyslate-overlay-layer, .speedyslate-bubble, .speedyslate-erase-patch, .speedyslate-clean-canvas')
            .forEach((el) => el.remove());
        }
        delete img.dataset.slateStatus;
        this.onRecycledImage(img);
      } else if (!prevUrl) {
        this.trackedUrls.set(img, nextUrl);
      }
    });

    observer.observe(img, {
      attributes: true,
      attributeFilter: ['src', 'srcset', 'data-src', 'data-original', 'data-lazy-src']
    });
    this.observers.set(img, observer);
  }
}
