export type PageBadgeStatus =
  | 'idle'
  | 'ocr_running'
  | 'ocr_done'
  | 'translating'
  | 'translated'
  | 'no_text'
  | 'error';

export interface PageBadgeKeyInfo {
  keyIndex?: number;
  totalKeys?: number;
  errorMessage?: string;
}

/**
 * PageBadgeManager: Per-image progress badges are disabled per user preference
 * so comic artwork stays 100% unobstructed while reading/translating.
 */
export class PageBadgeManager {
  private static readonly BADGE_CLASS = 'speedyslate-page-badge';

  public static ensureBadge(wrapper: HTMLElement, _pageIndex: number): HTMLElement | null {
    this.stripStaleBadges(wrapper);
    return null;
  }

  public static updateBadge(
    wrapper: HTMLElement,
    _pageIndex: number,
    _status: PageBadgeStatus,
    _count?: number,
    _keyInfo?: PageBadgeKeyInfo
  ): void {
    this.stripStaleBadges(wrapper);
  }

  private static stripStaleBadges(wrapper?: HTMLElement | null): void {
    wrapper?.querySelectorAll?.(`.${this.BADGE_CLASS}`)?.forEach((el) => el.remove());
  }
}
