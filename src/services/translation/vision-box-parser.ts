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

    return dialogues;
  }
}
