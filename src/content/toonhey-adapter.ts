/**
 * Adapter specifically crafted for toonhey.com and similar vertical webtoon readers
 * Supports instant force-loading of all lazy images without requiring any scrolling
 * Following Single Responsibility Principle (SRP)
 */
export class ToonheyAdapter {
  private static readonly SELECTORS = [
    '.reading-content img',
    '#reader-area img',
    '#reader-container img',
    '.entry-content img',
    '.chapter-images img',
    '.page-break img',
    'div[id*="chapter"] img',
    'div[class*="reading"] img',
    'img[src*="toonhey"]',
    'img[class*="chapter"]',
    'img[data-src]',
    'img[data-original]',
    'img[data-lazy-src]'
  ];

  /**
   * Finds all comic strip images in the reader, even if lazy-loaded
   */
  public static getChapterImages(): HTMLImageElement[] {
    for (const selector of this.SELECTORS) {
      const images = Array.from(document.querySelectorAll<HTMLImageElement>(selector));
      if (images.length > 0) {
        // Exclude tiny icons, avatars or social buttons
        const valid = images.filter((img) => {
          const hasLazyAttr = Boolean(
            img.dataset.src ||
            img.getAttribute('data-src') ||
            img.getAttribute('data-original') ||
            img.getAttribute('data-lazy-src')
          );
          const isWideEnough = img.naturalWidth > 150 || img.width > 150;
          return hasLazyAttr || isWideEnough;
        });

        if (valid.length > 0) return valid;
      }
    }

    // Generic fallback: any tall image or image with lazy attributes on page
    const allImages = Array.from(document.querySelectorAll<HTMLImageElement>('img'));
    return allImages.filter(
      (img) =>
        (img.dataset.src || img.getAttribute('data-src') || img.naturalHeight > 250 || img.height > 250) &&
        !img.closest('header, footer, nav, aside')
    );
  }

  /**
   * Force-loads a single image by swapping lazy data-src attributes to active src
   * Bypasses the need for viewport scrolling!
   */
  public static forceTriggerImage(img: HTMLImageElement): void {
    const realSrc =
      img.dataset.src ||
      img.getAttribute('data-src') ||
      img.getAttribute('data-original') ||
      img.getAttribute('data-lazy-src') ||
      img.getAttribute('data-actual-src');

    if (realSrc && img.src !== realSrc) {
      img.src = realSrc;
    }
    img.loading = 'eager';
    img.removeAttribute('data-src');
    img.removeAttribute('data-lazy-src');
    img.classList.remove('lazy', 'lazyload', 'loading');
  }

  /**
   * Force-loads ALL images in the chapter simultaneously without any scrolling!
   */
  public static forceLoadAll(images: HTMLImageElement[]): void {
    for (const img of images) {
      this.forceTriggerImage(img);
    }
  }

  /**
   * Wraps an image inside a relative container to allow absolute percentage overlays
   */
  public static wrapImage(img: HTMLImageElement): HTMLElement {
    if (img.parentElement?.classList.contains('speedyslate-wrapper')) {
      return img.parentElement;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'speedyslate-wrapper';
    wrapper.style.position = 'relative';
    wrapper.style.display = 'block';
    wrapper.style.width = '100%';
    wrapper.style.margin = '0 auto';
    wrapper.style.lineHeight = '0'; // prevent gaps between comic slices

    img.parentElement?.insertBefore(wrapper, img);
    wrapper.appendChild(img);

    return wrapper;
  }
}
