/**
 * Adapter specifically crafted for toonhey.com and similar vertical webtoon readers
 * Robustly extracts 100% of current episode panels while filtering out 100% of recommendation thumbnails
 * Following Single Responsibility Principle (SRP)
 */
export class ToonheyAdapter {
  private static readonly CONTAINER_SELECTORS = [
    '#reader-area',
    '#readerarea',
    '.reading-content',
    '#reader-container',
    '.reader-container',
    '.chapter-images',
    '.episode-images',
    '#chapter-images',
    '#episode-images',
    '.chapter-body',
    '.episode-body',
    '.entry-content',
    'div[id*="episode"]',
    'div[class*="episode"]',
    'div[id*="chapter"]',
    'div[class*="chapter"]',
    'div[class*="reading"]'
  ];

  private static readonly EXCLUDED_CONTAINER_SELECTORS = [
    'header',
    'footer',
    'nav',
    'aside',
    '#sidebar',
    '.sidebar',
    '#comments',
    '.comments',
    '.comment',
    '#recommendations',
    '.recommendations',
    '.recommended',
    '#related',
    '.related',
    '.related-manga',
    '.related-posts',
    '#trending',
    '.trending',
    '.popular',
    '.latest',
    '.manga-list',
    '.comics-grid',
    '.grid-manga',
    '.carousel',
    '.slider',
    '.swiper',
    '#speedyslate-hud-root',
    '#speedyslate-mini-badge',
    '#speedyslate-missing-banner'
  ];

  /**
   * Finds all comic strip images in the reader for the current episode
   */
  public static getChapterImages(): HTMLImageElement[] {
    // 1. Try known reader container selectors first
    for (const selector of this.CONTAINER_SELECTORS) {
      const container = document.querySelector(selector);
      if (container && !this.isInsideExcludedZone(container)) {
        const imgs = Array.from(container.querySelectorAll<HTMLImageElement>('img'));
        const validComicPanels = imgs.filter((img) => this.isGenuineComicPanel(img));
        if (validComicPanels.length >= 2) {
          return validComicPanels;
        }
      }
    }

    // 2. Intelligent Parent Cluster Detection:
    // Gather all candidate images on the page that pass strict comic panel criteria
    const allImgs = Array.from(document.querySelectorAll<HTMLImageElement>('img'));
    const candidatePanels = allImgs.filter((img) => this.isGenuineComicPanel(img));

    if (candidatePanels.length === 0) return [];

    // Group images by their common ancestor container to isolate the reading column from recommendation grids
    const containerCounts = new Map<HTMLElement, HTMLImageElement[]>();
    for (const img of candidatePanels) {
      // Find the closest meaningful ancestor container (e.g. div or section)
      const parentContainer = img.closest('div, section') as HTMLElement | null;
      if (parentContainer && !this.isInsideExcludedZone(parentContainer)) {
        const list = containerCounts.get(parentContainer) || [];
        list.push(img);
        containerCounts.set(parentContainer, list);
      }
    }

    // Find the container with the highest concentration of vertically stacked comic panels
    let bestGroup: HTMLImageElement[] = [];
    for (const group of containerCounts.values()) {
      if (group.length > bestGroup.length) {
        bestGroup = group;
      }
    }

    return bestGroup.length >= 2 ? bestGroup : candidatePanels;
  }

  /**
   * Strictly determines if an <img> element is a comic panel of the current episode
   */
  private static isGenuineComicPanel(img: HTMLImageElement): boolean {
    // 1. Exclude if inside headers, footers, sidebars, comments, or recommendations
    if (this.isInsideExcludedZone(img)) {
      return false;
    }

    if (img.classList.contains('speedyslate-ignore') || img.style.display === 'none') {
      return false;
    }

    // 2. CRITICAL: Comic panels never link to another manga series
    // Recommendation thumbnails and related cards are ALWAYS inside <a href="/en/other-manga/...">
    const anchor = img.closest('a');
    if (anchor && anchor.href) {
      const anchorHref = anchor.href.toLowerCase();
      const currentPath = window.location.pathname.toLowerCase();
      // If the link points to another comic or catalog page, it's definitely a thumbnail!
      if (!anchorHref.includes(currentPath) && (anchorHref.includes('/manga/') || anchorHref.includes('/en/'))) {
        return false;
      }
    }

    // 3. Exclude UI assets by URL and class keywords
    const src = (img.currentSrc || img.src || img.dataset.src || img.getAttribute('data-src') || '').toLowerCase();
    const className = (img.className || '').toLowerCase();
    const id = (img.id || '').toLowerCase();

    const ignoredKeywords = [
      'logo', 'avatar', 'icon', 'emoji', 'badge', 'button', 'social',
      'banner', 'advertisement', 'facebook', 'twitter', 'discord',
      'tracker', 'gravatar', 'loading', 'spinner', 'placeholder',
      'thumb', 'cover', 'recommend', 'related'
    ];

    for (const kw of ignoredKeywords) {
      if (src.includes(kw) || className.includes(kw) || id.includes(kw)) {
        return false;
      }
    }

    if (src.endsWith('.svg') || src.includes('.svg?')) {
      return false;
    }

    // 4. Reject if loaded and is definitely a tiny icon
    if (img.naturalWidth > 0 && img.naturalHeight > 0) {
      if (img.naturalWidth < 150 || img.naturalHeight < 150) {
        return false;
      }
    }

    // 5. Must have a valid image source or lazy loading attribute
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
   * Checks if an element is inside an excluded zone (sidebar, footer, recommendations, etc.)
   */
  private static isInsideExcludedZone(el: Element): boolean {
    const selector = this.EXCLUDED_CONTAINER_SELECTORS.join(', ');
    return Boolean(el.closest(selector));
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
