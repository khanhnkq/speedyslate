import { ToonheyAdapter } from './toonhey-adapter';
import { PageBadgeManager } from './page-badge';
import { SpaOverlayShield } from './spa-shield';

export interface ChapterScannerHooks {
  images: HTMLImageElement[];
  completedImages: Set<HTMLImageElement>;
  isTranslating: () => boolean;
  onNewImagesDetected: (totalCount: number) => void;
  onImageVisible: (index: number, img: HTMLImageElement) => void;
  onImageRecycled?: (index: number, img: HTMLImageElement) => void;
}

/**
 * ChapterScanner: Manages DOM comic panel discovery, MutationObserver for
 * lazy-inserted strips, and IntersectionObserver prefetching.
 * Extracted from content/index.ts (SRP & < 500 lines invariant).
 */
export class ChapterScanner {
  private mutationObserver: MutationObserver | null = null;
  private intersectionObserver: IntersectionObserver | null = null;
  private observeInterval: ReturnType<typeof setInterval> | null = null;
  private spaShield: SpaOverlayShield;
  private isDetecting = false;

  constructor(private hooks: ChapterScannerHooks) {
    this.spaShield = new SpaOverlayShield((img) => {
      this.hooks.completedImages.delete(img);
      const idx = this.hooks.images.indexOf(img);
      if (idx !== -1) {
        if (img.parentElement) PageBadgeManager.updateBadge(img.parentElement, idx, 'idle');
        this.hooks.onImageRecycled?.(idx, img);
      }
    });
  }

  public start(): void {
    this.detectImages();
    this.setupMutationObserver();
    this.setupIntersectionObserver();
  }

  public stop(): void {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
    }
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }
    if (this.observeInterval) {
      clearInterval(this.observeInterval);
      this.observeInterval = null;
    }
  }

  public detectImages(): void {
    if (this.isDetecting) return;
    this.isDetecting = true;
    try {
      const rawImages = ToonheyAdapter.getChapterImages();
      let newFound = 0;

      for (const img of rawImages) {
        if (!this.hooks.images.includes(img)) {
          ToonheyAdapter.wrapImage(img);
          this.spaShield.watch(img);
          this.hooks.images.push(img);
          const index = this.hooks.images.length - 1;
          if (img.parentElement) {
            PageBadgeManager.ensureBadge(img.parentElement, index);
          }
          newFound++;
        }
      }

      if (newFound > 0) {
        this.hooks.images.sort((a, b) =>
          a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
        );
        this.hooks.images.forEach((img, idx) => {
          if (img.parentElement) {
            PageBadgeManager.ensureBadge(img.parentElement, idx);
          }
        });
        this.hooks.onNewImagesDetected(this.hooks.images.length);
      }
    } finally {
      this.isDetecting = false;
    }
  }

  private setupMutationObserver(): void {
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    this.mutationObserver = new MutationObserver(() => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        this.detectImages();
      }, 300);
    });
    this.mutationObserver.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  private setupIntersectionObserver(): void {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const img = entry.target as HTMLImageElement;
          const index = this.hooks.images.indexOf(img);
          if (
            index !== -1 &&
            !this.hooks.completedImages.has(img) &&
            !img.dataset.slateStatus &&
            this.hooks.isTranslating()
          ) {
            this.hooks.onImageVisible(index, img);
          }
        }
      },
      { root: null, rootMargin: '0px 0px 800px 0px', threshold: 0.01 }
    );

    this.observeInterval = setInterval(() => {
      this.hooks.images.forEach((img) => this.intersectionObserver?.observe(img));
    }, 2000);
  }
}
