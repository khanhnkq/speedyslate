import { BubbleTheme, DialogueItem } from '../../shared/types';

export class OverlayRenderer {
  /**
   * Renders translated speech bubbles over the wrapped image
   */
  public static renderDialogues(
    wrapper: HTMLElement,
    dialogues: DialogueItem[],
    naturalWidth: number,
    naturalHeight: number,
    theme: BubbleTheme = 'auto'
  ): void {
    // Remove previous bubbles if any
    const existing = wrapper.querySelectorAll('.speedyslate-bubble');
    existing.forEach((el) => el.remove());

    for (const item of dialogues) {
      if (!item.translatedText || !item.translatedText.trim()) continue;

      const box = item.box;
      let topPct: number;
      let leftPct: number;
      let widthPct: number;
      let minHeightPct: number;

      if (item.normBox) {
        // 1. Vision AI normalized 0-1000 scale -> direct percentage (0% - 100%)
        topPct = item.normBox.ymin / 10;
        leftPct = item.normBox.xmin / 10;
        widthPct = Math.max(1, (item.normBox.xmax - item.normBox.xmin) / 10);
        minHeightPct = Math.max(1, (item.normBox.ymax - item.normBox.ymin) / 10);
      } else {
        // 2. Hybrid OCR pixel coordinates -> direct percentage of natural image dimensions
        topPct = (box.y / naturalHeight) * 100;
        leftPct = (box.x / naturalWidth) * 100;
        widthPct = (box.width / naturalWidth) * 100;
        minHeightPct = (box.height / naturalHeight) * 100;
      }

      // Add a modest breathing margin (+4% width, +3% height) so the clean background
      // completely masks and erases the original printed English text without showing edges
      const expandX = Math.min(widthPct * 0.12, 4);
      const expandY = Math.min(minHeightPct * 0.10, 3);

      const finalLeft = Math.max(0, leftPct - expandX / 2);
      const finalTop = Math.max(0, topPct - expandY / 2);
      const finalWidth = Math.min(100 - finalLeft, widthPct + expandX);
      const finalMinHeight = Math.min(100 - finalTop, minHeightPct + expandY);

      const bubble = document.createElement('div');
      bubble.className = 'speedyslate-bubble';
      bubble.id = item.id;
      bubble.title = `Gốc: "${item.originalText}" (Rê chuột để soi chữ gốc)`;

      // Determine style based on theme (defaults to auto: dark balloon -> dark background)
      const isDark = theme === 'dark' || (theme === 'auto' && item.isDarkBackground);
      const bg = isDark ? '#111111' : '#ffffff';
      const textColor = isDark ? '#ffffff' : '#000000';

      // Inline styles: direct bounding box overlay exactly matching Toonhey proven behavior
      Object.assign(bubble.style, {
        position: 'absolute',
        top: `${finalTop}%`,
        left: `${finalLeft}%`,
        width: `${finalWidth}%`,
        minHeight: `${finalMinHeight}%`,
        height: 'auto',
        backgroundColor: bg,
        color: textColor,
        border: 'none',
        outline: 'none',
        boxShadow: 'none',
        borderRadius: '3px',
        boxSizing: 'border-box',
        padding: '2px 4px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        fontFamily: "'Comic Sans MS', 'Bangers', 'Segoe UI', system-ui, sans-serif",
        fontWeight: 'bold',
        lineHeight: '1.22',
        zIndex: '50',
        cursor: 'pointer',
        transition: 'opacity 0.15s ease-in-out',
        userSelect: 'text',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        overflowWrap: 'anywhere',
        hyphens: 'auto'
      });

      // Compute adaptive font size based on box dimensions and text length
      const fontSize = this.calculateFontSize(
        (finalWidth / 100) * naturalWidth,
        (finalMinHeight / 100) * naturalHeight,
        item.translatedText.length
      );
      bubble.style.fontSize = `${fontSize}px`;

      bubble.textContent = item.translatedText;

      // Hover to peek original comic text
      bubble.addEventListener('mouseenter', () => {
        bubble.style.opacity = '0.08';
      });
      bubble.addEventListener('mouseleave', () => {
        bubble.style.opacity = '1';
      });

      wrapper.appendChild(bubble);
    }
  }

  /**
   * Adaptive font sizing heuristic to fit Vietnamese text inside comic bounding box
   */
  private static calculateFontSize(boxW: number, boxH: number, textLength: number): number {
    const area = boxW * boxH;
    // Multiplier tuned for clear, bold comic typography in Vietnamese
    let base = Math.sqrt(area / Math.max(1, textLength)) * 1.18;
    // If bounding box has decent height (>= 35px), ensure font is at least 14px
    if (boxH >= 35) {
      base = Math.max(14, base);
    }
    // Strict bounds: minimum 13px (guaranteed readable), maximum 22px (headings/shouts)
    return Math.max(13, Math.min(22, Math.round(base)));
  }

  /**
   * Toggles visibility of all translated overlays on the page
   */
  public static setAllVisibility(visible: boolean): void {
    const bubbles = document.querySelectorAll<HTMLElement>('.speedyslate-bubble');
    bubbles.forEach((b) => {
      b.style.display = visible ? 'flex' : 'none';
    });
  }
}
