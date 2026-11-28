import { DialogueItem } from '../shared/types';

const THOUGHT_TAIL_RE = /^[0oO○●⊙◯°.\s]+$/;
const SPEEDLINE_STROKE_RE = /^[一丨丶─│|/\\_=~—–-]+$/;
const KANA_ONLY_RE = /^[\u3040-\u309F\u30A0-\u30FFー・\s]+$/;
const HAS_KANJI_RE = /[\u4E00-\u9FFF]/;

const FULL_WATERMARK_RE =
  /^(?:read\s+(?:first|free|more|latest|manga|comics?)?\s*(?:chapters?\s+)?(?:at|on)\b.*|read\s+(?:[\w'&+-]+\s+){0,6}(?:online\s+(?:in\s+[a-z]+\s+)?free|free\s+online|in\s+english\s+free)[.!]*|read\s+(?:free\s+)?(?:manga|manhwa|manhua|webtoon|comics?)\s+(?:online(?:\s+in\s+[a-z]+)?(?:\s+free)?|free(?:\s+online)?)[.!]*|read(?:manga|manhwa|manhua|webtoon|comics?)?(?:online(?:in[a-z]+)?free|freeonline|inenglishfree)[.!]*|read(?:manga|manhwa|manhua|webtoon|comics?)online(?:in[a-z]+)?(?:free)?[.!]*|(?:join\s+(?:our\s+)?)?discord\.gg\/\S+|patreon\.com\/\S+|(?:https?:\/\/)?(?:www\.)?[a-z0-9-]{3,}\.(?:com|net|org|xyz|gg|me|io|cc|tv|to)(?:\/\S*)?)$/i;

const TRAILING_DOMAIN_RE =
  /\s*(?:https?:\/\/)?(?:www\.)?[a-z0-9-]{3,}\.(?:com|net|org|xyz|gg|me|io|cc|tv|to)(?:\/\S*)?\s*$/i;

const TRAILING_READ_BANNER_RE =
  /\s+(?:read\s+(?:manga|manhwa|manhua|webtoon|comics?)\s+online(?:\s+in\s+[a-z]+)?(?:\s+free)?|read(?:manga|manhwa|manhua|webtoon|comics?)online(?:in[a-z]+)?(?:free)?)[.!]*\s*$/i;

/**
 * OcrNoiseFilter: Clean-room post-OCR noise, scanlator watermark, and
 * conservative furigana suppression battery.
 */
export class OcrNoiseFilter {
  public static stripTrailingWatermark(text: string): string {
    return text.replace(TRAILING_DOMAIN_RE, '').replace(TRAILING_READ_BANNER_RE, '').trim();
  }

  public static filterRawLines(
    items: DialogueItem[],
    imageWidth: number,
    imageHeight: number
  ): DialogueItem[] {
    if (items.length === 0) return items;

    const cleaned: DialogueItem[] = [];
    for (const item of items) {
      const { box } = item;
      const rawText = (item.originalText || '').trim();
      if (!rawText) continue;

      // 1. Micro-boxes & whole-page frame artifacts
      if (box.width < 8 || box.height < 8) continue;
      if (box.width >= imageWidth * 0.95 && box.height >= imageHeight * 0.9) continue;

      // 2. Low-confidence canvas-edge slivers
      const touchesEdge =
        box.x <= 4 ||
        box.y <= 4 ||
        box.x + box.width >= imageWidth - 4 ||
        box.y + box.height >= imageHeight - 4;
      if (touchesEdge && (item.confidence ?? 1) < 0.55 && Math.min(box.width, box.height) < 14) {
        continue;
      }

      // 3. Thought-bubble circle tails & speedline stroke artifacts
      if (THOUGHT_TAIL_RE.test(rawText)) continue;
      if (SPEEDLINE_STROKE_RE.test(rawText)) continue;

      // 4. Standalone page numbers in extreme top/bottom 3% margins
      const inExtremeVerticalMargin = box.y < imageHeight * 0.03 || box.y + box.height > imageHeight * 0.97;
      if (inExtremeVerticalMargin && /^\d{1,3}(?:\s*\/\s*\d{1,3})?$/.test(rawText)) {
        continue;
      }

      // 5. Full scanlation credit / watermark banners
      if (FULL_WATERMARK_RE.test(rawText)) continue;

      // 6. Strip trailing domain suffix glued onto genuine dialogue & rescale box width
      const stripped = this.stripTrailingWatermark(rawText);
      if (!stripped) continue;

      if (stripped.length < rawText.length) {
        const ratio = Math.max(0.25, stripped.length / rawText.length);
        cleaned.push({
          ...item,
          originalText: stripped,
          box: {
            ...box,
            width: Math.max(12, Math.round(box.width * ratio))
          }
        });
      } else {
        cleaned.push(item);
      }
    }

    // 7. Conservative Furigana reading-aid suppression:
    // Suppresses kana-only ruby ONLY when parallel & immediately adjacent to a Kanji-bearing parent
    // whose stroke thickness is more than ~2.08x larger (child thickness < 0.48 * parent thickness).
    return cleaned.filter((cand) => {
      if (!KANA_ONLY_RE.test(cand.originalText)) return true;
      const candVert = Boolean(cand.isVertical);
      const candThick = candVert ? cand.box.width : cand.box.height;

      const hasKanjiParent = cleaned.some((parent) => {
        if (parent === cand || !HAS_KANJI_RE.test(parent.originalText)) return false;
        const parentVert = Boolean(parent.isVertical);
        if (parentVert !== candVert) return false;
        const parentThick = parentVert ? parent.box.width : parent.box.height;
        if (candThick >= parentThick * 0.48) return false;

        if (parentVert) {
          const yOverlap =
            Math.min(parent.box.y + parent.box.height, cand.box.y + cand.box.height) -
            Math.max(parent.box.y, cand.box.y);
          if (yOverlap < Math.min(parent.box.height, cand.box.height) * 0.5) return false;
          const xGap = Math.max(
            0,
            Math.max(parent.box.x, cand.box.x) -
              Math.min(parent.box.x + parent.box.width, cand.box.x + cand.box.width)
          );
          return xGap <= parentThick * 0.6;
        } else {
          const xOverlap =
            Math.min(parent.box.x + parent.box.width, cand.box.x + cand.box.width) -
            Math.max(parent.box.x, cand.box.x);
          if (xOverlap < Math.min(parent.box.width, cand.box.width) * 0.5) return false;
          const yGap = Math.max(
            0,
            Math.max(parent.box.y, cand.box.y) -
              Math.min(parent.box.y + parent.box.height, cand.box.y + cand.box.height)
          );
          return yGap <= parentThick * 0.6;
        }
      });

      return !hasKanjiParent;
    });
  }
}
