/**
 * TextAutoFitter: Dynamically computes the optimal font size so text always fits
 * inside the comic speech bubble dimensions.
 * Following user specifications:
 * - When there is a lot of text, font size scales DOWN (instead of enlarging the bubble).
 * - When the bubble is large (e.g. shouts, screams), font size scales UP (up to 28px).
 * Following Single Responsibility Principle (SRP) & strictly < 500 lines.
 */
export class TextAutoFitter {
  /**
   * Finds the length of the longest word in the sentence (used for word-wrap constraints).
   */
  public static getLongestWordLength(text: string): number {
    if (!text) return 0;
    const words = text.split(/\s+/);
    let maxLen = 0;
    for (const w of words) {
      const clean = w.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
      if (clean.length > maxLen) {
        maxLen = clean.length;
      }
    }
    return maxLen;
  }

  /**
   * Dynamically calculates the optimal font size (in pixels) to fit inside the bubble bounds.
   * Scales from 9px up to 28px based on bubble capacity and text length.
   */
  public static computeOptimalFontSize(
    boxWidthPx: number,
    boxHeightPx: number,
    text: string
  ): number {
    const trimmed = text.trim();
    if (!trimmed) return 14;

    const words = trimmed.split(/\s+/).filter(w => w.length > 0);
    const longestWordLen = this.getLongestWordLength(trimmed);

    // Usable interior dimensions accounting for padding and Vietnamese diacritic heights
    const availW = Math.max(16, boxWidthPx - 12);
    const availH = Math.max(16, boxHeightPx - 8);

    const lineHeightRatio = 1.28; // Optimized for Vietnamese comic fonts with stacked diacritics
    const charWidthRatio = 0.56; // Vietnamese glyph width ratio

    // Dynamic upper bound: large bubbles scale up to 26px, standard bubbles cap at ~20-22px
    const maxFs = Math.min(26, Math.max(14, Math.floor(availH / 1.9)));
    const minFs = 9; // Absolute lower bound for dense text

    // Binary search / descending scan for largest font size where totalTextHeight <= availH
    for (let fs = maxFs; fs >= minFs; fs -= 0.5) {
      const longestWordWidth = longestWordLen * fs * 0.58;
      if (longestWordWidth > availW && fs > minFs) {
        continue;
      }

      const charsPerLine = Math.max(1, Math.floor(availW / (fs * charWidthRatio)));
      const linesCount = this.simulateLineCount(words, charsPerLine);
      const totalTextHeight = linesCount * (fs * lineHeightRatio);

      // Fits completely within available height with safety buffer for accents
      if (totalTextHeight <= availH - 2) {
        return Number(fs.toFixed(1));
      }
    }

    return minFs;
  }

  /**
   * Fast exact line-wrap simulation based on whitespace-separated words.
   */
  private static simulateLineCount(words: string[], charsPerLine: number): number {
    let lines = 1;
    let currentLineChars = 0;

    for (let i = 0; i < words.length; i++) {
      const wLen = words[i].length;
      if (currentLineChars === 0) {
        currentLineChars = wLen;
      } else if (currentLineChars + 1 + wLen <= charsPerLine) {
        currentLineChars += 1 + wLen;
      } else {
        lines++;
        currentLineChars = wLen;
      }
    }

    return lines;
  }
}
