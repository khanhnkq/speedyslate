/**
 * Adapter specifically crafted for toonhey.com and similar vertical webtoon readers
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
    'img[src*="toonhey"]',
    'img[class*="chapter"]'
  ];

  /**
   * Finds all comic strip images in the reader
   */
  public static getChapterImages(): HTMLImageElement[] {
    for (const selector of this.SELECTORS) {
      const images = Array.from(document.querySelectorAll<HTMLImageElement>(selector));
      if (images.length > 0) {
        // Filter out tiny icons or banners
        const valid = images.filter((img) => img.naturalWidth > 200 || img.width > 200);
        if (valid.length > 0) return valid;
      }
    }

    // Generic fallback: any tall image on the page
    const allImages = Array.from(document.querySelectorAll<HTMLImageElement>('img'));
    return allImages.filter(
      (img) => (img.naturalHeight > 300 || img.height > 300) && !img.closest('header, footer, nav, aside')
    );
  }

  /**
   * Wraps an image inside a relative container to allow absolute percentage overlays
   * Returns the container
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
    wrapper.style.lineHeight = '0'; // prevent spacing gaps between slices

    img.parentElement?.insertBefore(wrapper, img);
    wrapper.appendChild(img);

    return wrapper;
  }
}
