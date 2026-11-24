import { describe, expect, it } from 'vitest';
import { PageBadgeManager } from '../../src/content/page-badge';

describe('PageBadgeManager disabled (no per-image progress badges)', () => {
  it('never appends a badge element to the image wrapper and strips any stale badge', () => {
    const stale = { removeCalled: false, remove() { this.removeCalled = true; } };
    const appended: unknown[] = [];
    const fakeWrapper: any = {
      querySelectorAll: (sel: string) => (sel.includes('speedyslate-page-badge') ? [stale] : []),
      querySelector: () => null,
      appendChild: (el: unknown) => appended.push(el)
    };

    PageBadgeManager.ensureBadge(fakeWrapper, 0);
    PageBadgeManager.updateBadge(fakeWrapper, 0, 'translating', 4);

    expect(appended).toHaveLength(0);
    expect(stale.removeCalled).toBe(true);
  });
});
