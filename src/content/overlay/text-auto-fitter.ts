export type WidthMeasurer = (text: string, fontPx: number) => number;

const COMIC_FONT_STACK = "'SpeedySlateComic', 'Segoe UI', system-ui, -apple-system, Roboto, sans-serif";

/**
 * TextAutoFitter: Fits translated dialogue inside rectangular or elliptical
 * comic speech bubbles using real Canvas 2D `measureText` (with pure-math
 * fallback in headless Node) and elliptical chord width budgets so glyphs
 * never clip curved balloon borders.
 */
export class TextAutoFitter {
  private static measureCtx: CanvasRenderingContext2D | null | undefined;

  private static getDefaultMeasurer(): WidthMeasurer {
    if (this.measureCtx === undefined) {
      try {
        if (typeof document !== 'undefined') {
          const c = document.createElement('canvas');
          this.measureCtx = c.getContext('2d');
        } else {
          this.measureCtx = null;
        }
      } catch {
        this.measureCtx = null;
      }
    }

    const ctx = this.measureCtx;
    if (ctx) {
      return (text: string, fontPx: number) => {
        ctx.font = `600 ${fontPx}px ${COMIC_FONT_STACK}`;
        return ctx.measureText(text).width;
      };
    }

    return (text: string, fontPx: number) => {
      let units = 0;
      for (const ch of text) {
        if (ch === ' ') units += 0.3;
        else if (/[\u3000-\u9FFF\uAC00-\uD7AF]/.test(ch)) units += 1.0;
        else if (/\p{Lu}/u.test(ch)) units += 0.64;
        else units += 0.54;
      }
      return units * fontPx;
    };
  }

  public static getLongestWordLength(text: string): number {
    if (!text) return 0;
    const words = text.split(/\s+/);
    let maxLen = 0;
    for (const w of words) {
      const clean = w.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
      if (clean.length > maxLen) maxLen = clean.length;
    }
    return maxLen;
  }

  public static computeOptimalFontSize(
    boxWidthPx: number,
    boxHeightPx: number,
    text: string
  ): number {
    return this.fitDialogue(boxWidthPx, boxHeightPx, text).fontSize;
  }

  public static fitDialogue(
    boxWidthPx: number,
    boxHeightPx: number,
    text: string,
    opts?: { elliptical?: boolean; measureWidth?: WidthMeasurer }
  ): { fontSize: number; lines: string[] } {
    const trimmed = text.replace(/\s+/g, ' ').trim();
    if (!trimmed) return { fontSize: 14, lines: [] };

    const measure = opts?.measureWidth ?? this.getDefaultMeasurer();
    const elliptical = Boolean(opts?.elliptical);
    const words = trimmed.split(' ').filter((w) => w.length > 0);

    const availW = Math.max(20, boxWidthPx - 10);
    const availH = Math.max(18, boxHeightPx - 6);
    const lineHeightRatio = 1.24;
    const maxFs = Math.min(28, Math.max(14, Math.floor(availH / 1.75)));
    const minFs = 9;

    for (let fs = maxFs; fs >= minFs; fs -= 0.5) {
      const lineH = fs * lineHeightRatio;
      const maxLines = Math.max(1, Math.floor((availH + 2) / lineH));

      if (!elliptical) {
        const lines = this.wrapGreedy(words, fs, () => availW, measure);
        if (lines && lines.length <= maxLines && lines.length * lineH <= availH + 1) {
          return { fontSize: Number(fs.toFixed(1)), lines };
        }
        continue;
      }

      // Elliptical bubble: try target line counts 1..maxLines so top/bottom
      // lines wrap to the narrower chord width at their vertical position.
      for (let targetN = 1; targetN <= maxLines; targetN++) {
        const blockH = targetN * lineH;
        if (blockH > availH + 1) break;
        const startY = (availH - blockH) * 0.5;
        const chordAt = (lineIdx: number): number => {
          if (lineIdx >= targetN) return 0; // force spillover check
          const cy = startY + (lineIdx + 0.5) * lineH;
          const normY = (2 * cy) / availH - 1; // -1..+1
          const factor = Math.sqrt(Math.max(0.2, 1 - normY * normY * 0.78));
          return availW * Math.max(0.52, factor);
        };
        const lines = this.wrapGreedy(words, fs, chordAt, measure);
        if (lines && lines.length <= targetN) {
          return { fontSize: Number(fs.toFixed(1)), lines };
        }
      }
    }

    const fallbackLines =
      this.wrapGreedy(words, minFs, () => availW, measure, true) || [trimmed];
    return { fontSize: minFs, lines: fallbackLines };
  }

  private static wrapGreedy(
    words: string[],
    fs: number,
    maxWidthForLine: (lineIdx: number) => number,
    measure: WidthMeasurer,
    allowOverflowWord = false
  ): string[] | null {
    const lines: string[] = [];
    let cur = '';

    for (const w of words) {
      const limit = maxWidthForLine(lines.length);
      if (limit <= 0) return null;

      if (!cur) {
        if (!allowOverflowWord && measure(w, fs) > limit) return null;
        cur = w;
        continue;
      }

      const candidate = `${cur} ${w}`;
      if (measure(candidate, fs) <= limit) {
        cur = candidate;
      } else {
        lines.push(cur);
        const nextLimit = maxWidthForLine(lines.length);
        if (nextLimit <= 0 || (!allowOverflowWord && measure(w, fs) > nextLimit)) {
          return null;
        }
        cur = w;
      }
    }

    if (cur) lines.push(cur);
    return lines;
  }
}
