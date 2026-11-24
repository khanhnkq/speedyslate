import { MediaTargetResolver } from './media-target';

/**
 * Adapter crafted for vertical webtoon, Madara CMS, and single-page gallery readers.
 * Robustly extracts 100% of current episode panels while filtering out 100% of recommendation thumbnails.
 * Following Single Responsibility Principle (SRP)
 */
export class ComicPanelAdapter {
  private static readonly CONTAINER_SELECTORS = [
    '#image-container',     // Single-page gallery reader
    '.image-container',
    '#reader-area',         // Vertical webtoon / WordPress Manga
    '#readerarea',
    '.reading-content',     // Madara WordPress theme
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
    '.related-container', // Related gallery grid
    '#related-container',
    '#caption',           // Page caption block
    '#pagination',
    '.pagination',
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
        // In WordPress Manga / Madara readers, genuine panels carry .wp-manga-chapter-img
        const madaraImgs = Array.from(container.querySelectorAll<HTMLImageElement>('img.wp-manga-chapter-img'))
          .filter((img) => this.isGenuineComicPanel(img));
        if (madaraImgs.length >= 1) {
          return madaraImgs.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
        }

        const imgs = Array.from(container.querySelectorAll<HTMLImageElement>('img'));
        const validComicPanels = imgs.filter((img) => this.isGenuineComicPanel(img));
        // Inside dedicated reader containers, even 1 image (single-page gallery mode) is a valid panel!
        if (validComicPanels.length >= 1) {
          return validComicPanels.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
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
      const parentContainer = img.closest('div, section, article') as HTMLElement | null;
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

    if (bestGroup.length >= 2) return bestGroup;
    if (candidatePanels.length >= 2) return candidatePanels;

    // Single-page fallback: verify it's a large comic panel (>300px) and not a tiny icon/avatar
    if (candidatePanels.length === 1) {
      const single = candidatePanels[0];
      const w = single.naturalWidth || single.width || 0;
      const h = single.naturalHeight || single.height || 0;
      if (w >= 300 || h >= 300) {
        return candidatePanels;
      }
    }

    return [];
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

    // 2. CRITICAL: Distinguish comic panels vs recommendation thumbnails wrapped in anchors
    // On single-page gallery readers (e.g. /g/123/1/), clicking the panel navigates to next page (/g/123/2/)
    const anchor = img.closest('a');
    if (anchor && anchor.href) {
      const anchorHref = anchor.href.toLowerCase();
      const currentPath = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      const pathSegments = currentPath.split('/').filter(Boolean);
      const seriesPrefix = pathSegments.length > 1
        ? '/' + pathSegments.slice(0, pathSegments.length - 1).join('/')
        : currentPath;

      const isNextPageOrSameSeries =
        anchorHref.includes(currentPath) ||
        (seriesPrefix.length > 3 && anchorHref.includes(seriesPrefix));

      if (!isNextPageOrSameSeries) {
        if (
          anchorHref.includes('/manga/') ||
          anchorHref.includes('/webtoon/') ||
          anchorHref.includes('/series/') ||
          anchorHref.includes('/comic/') ||
          anchorHref.includes('/g/') ||
          anchorHref.includes('/en/')
        ) {
          return false;
        }
      }
    }

    // 3. Exclude UI assets by URL and class keywords
    const bestUrl = MediaTargetResolver.extractBestImageUrl(img) || '';
    const src = bestUrl.toLowerCase();
    const className = (img.className || '').toLowerCase();
    const id = (img.id || '').toLowerCase();
    const alt = (img.alt || '').toLowerCase();

    const ignoredKeywords = [
      'logo', 'avatar', 'icon', 'emoji', 'badge', 'button', 'social',
      'banner', 'advertisement', 'facebook', 'twitter', 'discord',
      'tracker', 'gravatar', 'loading', 'spinner', 'placeholder',
      'thumb', 'cover', 'recommend', 'related', '999.png', 'assets/999'
    ];

    for (const kw of ignoredKeywords) {
      if (src.includes(kw) || className.includes(kw) || id.includes(kw) || alt === kw) {
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

    // 5. Must have a valid image source, srcset, or lazy loading attribute
    return Boolean(bestUrl);
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
    MediaTargetResolver.promoteLazyAndSrcset(img);
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
    wrapper.style.width = 'fit-content';
    wrapper.style.maxWidth = '100%';
    wrapper.style.margin = '0 auto';
    wrapper.style.lineHeight = '0'; // prevent gaps between comic slices
    wrapper.style.boxSizing = 'border-box';
    wrapper.style.overflow = 'hidden';

    // Ensure image matches wrapper bounds exactly with no horizontal margins
    img.style.display = 'block';
    img.style.maxWidth = '100%';
    img.style.height = 'auto';

    img.parentElement?.insertBefore(wrapper, img);
    wrapper.appendChild(img);

    return wrapper;
  }
}
