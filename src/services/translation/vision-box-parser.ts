import { DialogueItem } from '../../shared/types';

/**
 * Parses and normalizes 2D bounding boxes and translation data from Multimodal Vision AI.
 * Converts 0-1000 normalized coordinates into natural pixel coordinates.
 * Following Single Responsibility Principle (SRP).
 */
export class VisionBoxParser {
  public static parseItems(
    rawList: any[],
    naturalWidth: number,
    naturalHeight: number,
    prefix: string = 'slate_vision'
  ): DialogueItem[] {
    const dialogues: DialogueItem[] = [];

    for (let i = 0; i < rawList.length; i++) {
      const item = rawList[i];
      if (!item) continue;

      const translatedText = String(
        item.translation || item.translated_text || item.vietnamese || item.text || ''
      ).trim();
      if (!translatedText) continue;

      const rawBox = item.text_box_2d || item.box_2d || item.box || item.bounding_box;
      let ymin = 0, xmin = 0, ymax = 0, xmax = 0;

      // Filter out accidental sound effects (SFX / onomatopoeia)
      const orig = String(item.original_text || item.text || '').trim();
      if (/^(haha+|hehe+|kaka+|boom|swoosh|gasp|sigh|pant|thump|crash|bam|clang)$/i.test(orig)) {
        continue;
      }

      let flatBox: any[] = [];
      if (Array.isArray(rawBox)) {
        flatBox = Array.isArray(rawBox[0]) ? rawBox[0] : rawBox;
      }

      if (flatBox.length >= 4) {
        [ymin, xmin, ymax, xmax] = flatBox.map(Number);
      } else if (rawBox && typeof rawBox === 'object') {
        ymin = Number(rawBox.ymin ?? rawBox.top ?? 0);
        xmin = Number(rawBox.xmin ?? rawBox.left ?? 0);
        ymax = Number(rawBox.ymax ?? rawBox.bottom ?? 0);
        xmax = Number(rawBox.xmax ?? rawBox.right ?? 0);
      } else {
        continue;
      }

      if (isNaN(ymin) || isNaN(xmin) || isNaN(ymax) || isNaN(xmax)) continue;

      const normYmin = Math.min(ymin, ymax);
      const normYmax = Math.max(ymin, ymax);
      const normXmin = Math.min(xmin, xmax);
      const normXmax = Math.max(xmin, xmax);

      const x = Math.round((normXmin / 1000) * naturalWidth);
      const y = Math.round((normYmin / 1000) * naturalHeight);
      const width = Math.round(((normXmax - normXmin) / 1000) * naturalWidth);
      const height = Math.round(((normYmax - normYmin) / 1000) * naturalHeight);

      if (width < 8 || height < 8) continue;

      dialogues.push({
        id: `${prefix}_${Date.now()}_${i}`,
        box: { x, y, width, height, confidence: 0.95 },
        normBox: {
          ymin: normYmin,
          xmin: normXmin,
          ymax: normYmax,
          xmax: normXmax
        },
        originalText: String(item.original_text || item.text || '').trim(),
        translatedText,
        isDarkBackground: item.background === 'dark'
      });
    }

    return this.mergeAdjacentBubbles(dialogues, naturalWidth, naturalHeight);
  }

  /**
   * Merges dialogue items that belong to the SAME speech bubble
   * (e.g. when Vision AI splits multiple sentences in one bubble into separate items).
   */
  private static mergeAdjacentBubbles(
    items: DialogueItem[],
    naturalWidth: number,
    naturalHeight: number
  ): DialogueItem[] {
    if (items.length <= 1) return items;

    const merged: DialogueItem[] = [];
    const used = new Set<number>();

    for (let i = 0; i < items.length; i++) {
      if (used.has(i)) continue;
      const current = { ...items[i] };
      used.add(i);

      for (let j = i + 1; j < items.length; j++) {
        if (used.has(j)) continue;
        const candidate = items[j];

        if (current.isDarkBackground !== candidate.isDarkBackground) continue;

        if (current.normBox && candidate.normBox) {
          const a = current.normBox;
          const b = candidate.normBox;

          // Pixel-space vertical proximity: only merge overlapping or immediately touching
          // fragments within one bubble (never across inter-bubble borders/gutters)
          const aHeightPx = ((a.ymax - a.ymin) / 1000) * naturalHeight;
          const bHeightPx = ((b.ymax - b.ymin) / 1000) * naturalHeight;
          const minHPx = Math.max(8, Math.min(aHeightPx, bHeightPx));
          const yGapPx = ((Math.max(a.ymin, b.ymin) - Math.min(a.ymax, b.ymax)) / 1000) * naturalHeight;
          const isVertAdjacent = yGapPx <= Math.min(10, minHPx * 0.2);

          // Horizontal alignment: substantial overlap AND aligned center
          const xOverlap = Math.min(a.xmax, b.xmax) - Math.max(a.xmin, b.xmin);
          const minW = Math.min(a.xmax - a.xmin, b.xmax - b.xmin);
          const centerDiff = Math.abs((a.xmin + a.xmax) / 2 - (b.xmin + b.xmax) / 2);
          const hasXOverlap =
            xOverlap >= minW * 0.45 &&
            centerDiff <= Math.max(a.xmax - a.xmin, b.xmax - b.xmin) * 0.35;

          if (isVertAdjacent && hasXOverlap) {
            const unitedNormBox = {
              ymin: Math.min(a.ymin, b.ymin),
              xmin: Math.min(a.xmin, b.xmin),
              ymax: Math.max(a.ymax, b.ymax),
              xmax: Math.max(a.xmax, b.xmax)
            };

            current.normBox = unitedNormBox;
            current.originalText = (current.originalText + ' ' + candidate.originalText).trim();
            current.translatedText = (current.translatedText + '\n' + candidate.translatedText).trim();
            current.box = {
              x: Math.round((unitedNormBox.xmin / 1000) * naturalWidth),
              y: Math.round((unitedNormBox.ymin / 1000) * naturalHeight),
              width: Math.round(((unitedNormBox.xmax - unitedNormBox.xmin) / 1000) * naturalWidth),
              height: Math.round(((unitedNormBox.ymax - unitedNormBox.ymin) / 1000) * naturalHeight),
              confidence: 0.95
            };
            used.add(j);
          }
        }
      }

      merged.push(current);
    }

    return merged;
  }
}
