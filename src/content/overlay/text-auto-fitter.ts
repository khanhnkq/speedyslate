import { OverlayStyler } from './overlay-styler';

export type WidthMeasurer = (text: string, fontPx: number) => number;

const COMIC_FONT_STACK = "'SpeedySlateComic', 'Segoe UI', system-ui, -apple-system, Roboto, sans-serif";

/**
 * TextAutoFitter: Fits translated dialogue inside rectangular or elliptical
 * comic speech bubbles using real Canvas 2D `measureText` (with pure-math
 * fallback in headless Node), rendered CSS display scaling, and elliptical
 * chord width budgets so glyphs never overflow speech bubble borders.
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
        // 1.08 safety multiplier absorbs font-swap metric variance (Patrick Hand vs fallback)
        return ctx.measureText(text).width * 1.08;
      };
    }

    return (text: string, fontPx: number) => {
      let units = 0;
      for (const ch of text) {
        if (ch === ' ') units += 0.32;
        else if (/[\u3000-\u9FFF\uAC00-\uD7AF]/.test(ch)) units += 1.02;
        else if (/\p{Lu}/u.test(ch)) units += 0.66;
        else units += 0.56;
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

  /**
   * Computes CSS font-size, wrapped lines, and pixel padding scaled to the actual
   * rendered DOM width of the comic image (`renderedWidth / naturalWidth`).
   */
  public static fitScaledDialogue(
    naturalBoxWidthPx: number,
    naturalBoxHeightPx: number,
    text: string,
    opts?: {
      naturalWidth?: number;
      renderedWidth?: number;
      elliptical?: boolean;
      measureWidth?: WidthMeasurer;
    }
  ): { fontSize: number; lines: string[]; padX: number; padY: number } {
    const natW = opts?.naturalWidth && opts.naturalWidth > 0 ? opts.naturalWidth : 0;
    const renW = opts?.renderedWidth && opts.renderedWidth > 0 ? opts.renderedWidth : 0;
    const scale = natW > 0 && renW > 0 ? renW / natW : 1;

    const cssW = naturalBoxWidthPx * scale;
    const cssH = naturalBoxHeightPx * scale;
    const elliptical = Boolean(opts?.elliptical);

    const { padX, padY } = OverlayStyler.computePaddingPx(cssW, cssH, elliptical);
    const innerW = Math.max(14, cssW - padX * 2);
    const innerH = Math.max(12, cssH - padY * 2);

    const res = this.fitDialogue(innerW, innerH, text, {
      elliptical,
      measureWidth: opts?.measureWidth,
      minFontPx: 7.5,
      maxFontPx: 22
    });
    return { fontSize: res.fontSize, lines: res.lines, padX, padY };
  }

  /**
   * Computes CSS font-size scaled to the actual rendered DOM width of the comic
   * image (`renderedWidth / naturalWidth`), deducting elliptical safe padding.
   */
  public static computeScaledFontSize(
    naturalBoxWidthPx: number,
    naturalBoxHeightPx: number,
    text: string,
    opts?: {
      naturalWidth?: number;
      renderedWidth?: number;
      elliptical?: boolean;
      measureWidth?: WidthMeasurer;
    }
  ): number {
    return this.fitScaledDialogue(naturalBoxWidthPx, naturalBoxHeightPx, text, opts).fontSize;
  }

  public static fitDialogue(
    boxWidthPx: number,
    boxHeightPx: number,
    text: string,
    opts?: {
      elliptical?: boolean;
      measureWidth?: WidthMeasurer;
      minFontPx?: number;
      maxFontPx?: number;
    }
  ): { fontSize: number; lines: string[] } {
    const trimmed = text.replace(/\s+/g, ' ').trim();
    if (!trimmed) return { fontSize: 12, lines: [] };

    const measure = opts?.measureWidth ?? this.getDefaultMeasurer();
    const elliptical = Boolean(opts?.elliptical);
    const words = trimmed.split(' ').filter((w) => w.length > 0);

    const availW = Math.max(16, boxWidthPx - 4);
    const availH = Math.max(14, boxHeightPx - 4);
    const lineHeightRatio = 1.26;
    const minFs = opts?.minFontPx ?? 9;
    const capFs = opts?.maxFontPx ?? 26;
    const maxFs = Math.min(capFs, Math.max(minFs, Math.floor(availH / 1.75)));

    for (let fs = maxFs; fs >= minFs; fs -= 0.5) {
      const lineH = fs * lineHeightRatio;
      const maxLines = Math.max(1, Math.floor((availH + 1) / lineH));

      if (!elliptical) {
        const lines = this.wrapGreedy(words, fs, () => availW, measure);
        if (lines && lines.length <= maxLines && lines.length * lineH <= availH + 1) {
          return { fontSize: Number(fs.toFixed(1)), lines };
        }
        continue;
      }

      for (let targetN = 1; targetN <= maxLines; targetN++) {
        const blockH = targetN * lineH;
        if (blockH > availH + 1) break;
        const startY = (availH - blockH) * 0.5;
        const chordAt = (lineIdx: number): number => {
          if (lineIdx >= targetN) return 0;
          const cy = startY + (lineIdx + 0.5) * lineH;
          const normY = (2 * cy) / availH - 1;
          const factor = Math.sqrt(Math.max(0.22, 1 - normY * normY * 0.75));
          return availW * Math.max(0.55, factor);
        };
        const lines = this.wrapGreedy(words, fs, chordAt, measure);
        if (lines && lines.length <= targetN) {
          return { fontSize: Number(fs.toFixed(1)), lines };
        }
      }
    }

    const fallbackLines = this.wrapGreedy(words, minFs, () => availW, measure, true) || [trimmed];
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
