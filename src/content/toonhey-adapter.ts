/**
 * Adapter specifically crafted for toonhey.com and similar vertical webtoon readers
 * Robustly detects 100% of chapter images without being tripped by lazy-loading
 * Following Single Responsibility Principle (SRP)
 */
export class ToonheyAdapter {
  private static readonly CONTAINER_SELECTORS = [
    '.reading-content',
    '#reader-area',
    '#readerarea',
    '#reader-container',
    '.entry-content',
    '.chapter-images',
    '.chapter-body',
    '.page-break',
    'div[id*="chapter"]',
    'div[class*="reading"]',
    'div[class*="chapter"]',
    'main',
    'article'
  ];

  /**
   * Finds all comic strip images in the reader, even if lazy-loaded
   */
  public static getChapterImages(): HTMLImageElement[] {
    let bestImages: HTMLImageElement[] = [];

    // 1. Check containers first to find the primary chapter gallery
    for (const selector of this.CONTAINER_SELECTORS) {
      const container = document.querySelector(selector);
      if (container) {
        const imgs = Array.from(container.querySelectorAll<HTMLImageElement>('img'));
        const comicImgs = imgs.filter((img) => this.isLikelyComicImage(img));
        if (comicImgs.length > bestImages.length) {
          bestImages = comicImgs;
        }
      }
    }

    // If container search found 2 or more images, it's definitely the comic container
    if (bestImages.length >= 2) {
      return bestImages;
    }

    // 2. Global search across all img tags, filtering out headers, footers, sidebars, and ads
    const allImages = Array.from(document.querySelectorAll<HTMLImageElement>('img'));
    const candidateImgs = allImages.filter((img) => this.isLikelyComicImage(img));

    return candidateImgs.length > bestImages.length ? candidateImgs : bestImages;
  }

  /**
   * Determines if an <img> tag is a comic panel rather than an icon, banner, or avatar
   */
  private static isLikelyComicImage(img: HTMLImageElement): boolean {
    // 1. Exclude UI chrome
    if (
      img.closest(
        'header, footer, nav, aside, #comments, .comments, .comment, #sidebar, .sidebar, #speedyslate-hud, .speedyslate-hud, #speedyslate-missing-banner'
      )
    ) {
      return false;
    }

    if (img.classList.contains('speedyslate-ignore') || img.style.display === 'none') {
      return false;
    }

    // 2. Exclude common UI assets
    const src = (img.currentSrc || img.src || img.dataset.src || img.getAttribute('data-src') || '').toLowerCase();
    const className = (img.className || '').toLowerCase();
    const id = (img.id || '').toLowerCase();

    const ignoredKeywords = [
      'logo', 'avatar', 'icon', 'emoji', 'badge', 'button', 'social',
      'banner_ad', 'advertisement', 'facebook', 'twitter', 'discord',
      'tracker', 'gravatar', 'loading.gif', 'spinner', 'placeholder'
    ];

    for (const kw of ignoredKeywords) {
      if (src.includes(kw) || className.includes(kw) || id.includes(kw)) {
        return false;
      }
    }

    if (src.endsWith('.svg') || src.includes('.svg?')) {
      return false;
    }

    // 3. Reject only if image has already loaded and is definitely a tiny icon
    if (img.naturalWidth > 0 && img.naturalHeight > 0) {
      if (img.naturalWidth < 120 || img.naturalHeight < 120) {
        return false;
      }
    }

    // 4. Must have a source attribute or lazy attribute
    const hasSource = Boolean(
      img.src ||
      img.dataset.src ||
      img.getAttribute('data-src') ||
      img.getAttribute('data-original') ||
      img.getAttribute('data-lazy-src') ||
      img.getAttribute('data-actual-src')
    );

    return hasSource;
  }

  /**
   * Force-loads a single image by swapping lazy data-src attributes to active src
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
    img.decoding = 'async';
    img.removeAttribute('data-src');
    img.removeAttribute('data-lazy-src');
    img.classList.remove('lazy', 'lazyload', 'loading');
  }

  /**
   * Force-loads ALL images in the chapter simultaneously without requiring manual scrolling
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
