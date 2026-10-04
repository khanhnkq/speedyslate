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
      // Controlled elastic breathing room to fit dialogue comfortably without exploding
      const expandX = Math.min(box.width * 0.08, 12);
      const expandY = Math.min(box.height * 0.06, 8);

      const adjX = Math.max(0, box.x - expandX / 2);
      const adjY = Math.max(0, box.y - expandY / 2);
      const adjW = Math.min(naturalWidth - adjX, box.width + expandX);
      const adjH = Math.min(naturalHeight - adjY, box.height + expandY);

      // Convert pixel box to percentage of original image dimensions
      const topPct = (adjY / naturalHeight) * 100;
      const leftPct = (adjX / naturalWidth) * 100;
      const widthPct = (adjW / naturalWidth) * 100;
      const minHeightPct = (adjH / naturalHeight) * 100;

      const bubble = document.createElement('div');
      bubble.className = 'speedyslate-bubble';
      bubble.id = item.id;
      bubble.title = `Gốc: "${item.originalText}" (Rê chuột để soi chữ gốc)`;

      // Determine style based on theme (defaults to auto: dark balloon -> dark background)
      const isDark = theme === 'dark' || (theme === 'auto' && item.isDarkBackground);
      const bg = isDark ? '#111111' : '#ffffff';
      const textColor = isDark ? '#ffffff' : '#000000';

      // Inline styles: tight, clean comic dialogue overlay
      Object.assign(bubble.style, {
        position: 'absolute',
        top: `${topPct}%`,
        left: `${leftPct}%`,
        width: `${widthPct}%`,
        maxWidth: `${Math.min(85, Math.max(25, widthPct + 4))}%`,
        height: 'auto',
        minHeight: `${minHeightPct}%`,
        backgroundColor: bg,
        color: textColor,
        border: 'none',
        outline: 'none',
        borderRadius: '4px',
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
        hyphens: 'auto',
        boxShadow: 'none'
      });

      // Compute adaptive font size based on box dimensions and text length
      const fontSize = this.calculateFontSize(adjW, adjH, item.translatedText.length);
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
    let base = Math.sqrt(area / Math.max(1, textLength)) * 0.92;
    // Bound font size between 11px and 20px for comic text readability
    base = Math.max(11, Math.min(20, Math.round(base)));
    return base;
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
