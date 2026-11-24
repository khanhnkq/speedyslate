import { DialogueItem } from '../shared/types';

export type ReadingDirection = 'rtl' | 'ltr';

const HAS_KANA_RE = /[\u3040-\u309F\u30A0-\u30FF]/;

/**
 * ReadingOrderSorter: Sequences clustered comic speech bubbles into natural
 * chronological speaker order across multi-panel pages using row-band sorting
 * (Right-to-Left for Japanese Manga & vertical CJK; Left-to-Right for Webtoons).
 */
export class ReadingOrderSorter {
  public static detectDirection(items: DialogueItem[], sourceLang?: string): ReadingDirection {
    const lang = (sourceLang || 'auto').toLowerCase();
    if (lang.includes('japanese') || lang === 'ja') return 'rtl';
    if (
      lang.includes('english') ||
      lang.includes('korean') ||
      lang.includes('french') ||
      lang.includes('spanish') ||
      lang.includes('russian') ||
      lang.includes('vietnamese') ||
      lang.includes('german') ||
      lang.includes('portuguese')
    ) {
      return 'ltr';
    }

    if (items.some((i) => HAS_KANA_RE.test(i.originalText || ''))) {
      return 'rtl';
    }

    const verticalCount = items.filter((i) => i.isVertical === true).length;
    if (verticalCount > 0 && verticalCount >= items.length - verticalCount) {
      return 'rtl';
    }

    return 'ltr';
  }

  public static sort(items: DialogueItem[], direction: ReadingDirection): DialogueItem[] {
    if (items.length <= 1) return [...items];

    const byCenterY = [...items].sort(
      (a, b) => a.box.y + a.box.height / 2 - (b.box.y + b.box.height / 2)
    );

    const bands: DialogueItem[][] = [];
    for (const item of byCenterY) {
      const cy = item.box.y + item.box.height / 2;
      const lastBand = bands[bands.length - 1];
      if (!lastBand) {
        bands.push([item]);
        continue;
      }

      const sharesBand = lastBand.some((member) => {
        const mCy = member.box.y + member.box.height / 2;
        const minH = Math.max(1, Math.min(member.box.height, item.box.height));
        const yOverlap =
          Math.min(member.box.y + member.box.height, item.box.y + item.box.height) -
          Math.max(member.box.y, item.box.y);
        return yOverlap >= minH * 0.35 || Math.abs(cy - mCy) <= minH * 0.45;
      });

      if (sharesBand) {
        lastBand.push(item);
      } else {
        bands.push([item]);
      }
    }

    const ordered: DialogueItem[] = [];
    for (const band of bands) {
      band.sort((a, b) => {
        const cxA = a.box.x + a.box.width / 2;
        const cxB = b.box.x + b.box.width / 2;
        return direction === 'rtl' ? cxB - cxA : cxA - cxB;
      });
      ordered.push(...band);
    }

    return ordered;
  }
}
