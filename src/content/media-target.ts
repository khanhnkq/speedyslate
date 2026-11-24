const LAZY_ATTRS = [
  'data-src',
  'data-original',
  'data-lazy-src',
  'data-actual-src',
  'data-url',
  'data-origin',
  'data-full-image',
  'data-real-src'
];

/**
 * MediaTargetResolver: Universal comic image URL extractor supporting
 * responsive `srcset`, `<picture><source>`, 8 lazy-loading attributes,
 * and CSS `background-image` panel containers.
 */
export class MediaTargetResolver {
  public static parseBestSrcsetUrl(srcset: string): string | null {
    if (!srcset || !srcset.trim()) return null;
    let bestUrl: string | null = null;
    let bestScore = -1;

    for (const part of srcset.split(',')) {
      const tokens = part.trim().split(/\s+/).filter(Boolean);
      if (tokens.length === 0) continue;
      const url = tokens[0];
      if (!url || url.startsWith('data:image/svg')) continue;

      let score = 1;
      const desc = tokens[1] || '';
      const wMatch = desc.match(/^(\d+(?:\.\d+)?)w$/i);
      const xMatch = desc.match(/^(\d+(?:\.\d+)?)x$/i);
      if (wMatch) score = Number(wMatch[1]);
      else if (xMatch) score = Number(xMatch[1]) * 1000;

      if (score >= bestScore) {
        bestScore = score;
        bestUrl = url;
      }
    }
    return bestUrl;
  }

  public static parseCssBackgroundUrl(bgValue: string): string | null {
    if (!bgValue || bgValue === 'none') return null;
    const m = bgValue.match(/url\(\s*['"]?([^'")]+)['"]?\s*\)/i);
    if (!m?.[1] || m[1].startsWith('data:image/svg')) return null;
    return m[1].trim();
  }

  public static extractBestImageUrl(el: HTMLElement): string | null {
    if (el.tagName === 'IMG') {
      const img = el as HTMLImageElement;
      for (const attr of LAZY_ATTRS) {
        const val = img.getAttribute(attr);
        if (val && !val.startsWith('data:image/svg')) return val.trim();
      }
      const picSource = img.parentElement?.tagName === 'PICTURE'
        ? img.parentElement.querySelector('source[srcset]')
        : null;
      if (picSource) {
        const fromPic = this.parseBestSrcsetUrl(picSource.getAttribute('srcset') || '');
        if (fromPic) return fromPic;
      }
      const fromSrcset = this.parseBestSrcsetUrl(img.getAttribute('srcset') || img.srcset || '');
      if (fromSrcset) return fromSrcset;

      const direct = img.currentSrc || img.src || '';
      return direct && !direct.startsWith('data:image/svg') ? direct : null;
    }

    const inlineBg = this.parseCssBackgroundUrl(el.style?.backgroundImage || '');
    if (inlineBg) return inlineBg;
    if (typeof window !== 'undefined' && window.getComputedStyle) {
      return this.parseCssBackgroundUrl(window.getComputedStyle(el).backgroundImage || '');
    }
    return null;
  }

  public static promoteLazyAndSrcset(img: HTMLImageElement): void {
    const best = this.extractBestImageUrl(img);
    if (best && !best.startsWith('data:') && img.src !== best) {
      img.src = best;
    }
    img.loading = 'eager';
    img.decoding = 'async';
    for (const attr of LAZY_ATTRS) {
      img.removeAttribute(attr);
    }
    img.classList.remove('lazy', 'lazyload', 'loading');
  }
}
