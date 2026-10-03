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
    theme: BubbleTheme = 'light'
  ): void {
    // Remove previous bubbles if any
    const existing = wrapper.querySelectorAll('.speedyslate-bubble');
    existing.forEach((el) => el.remove());

    for (const item of dialogues) {
      if (!item.translatedText) continue;

      const box = item.box;
      // Convert pixel box to percentage of original image dimensions
      const topPct = (box.y / naturalHeight) * 100;
      const leftPct = (box.x / naturalWidth) * 100;
      const widthPct = (box.width / naturalWidth) * 100;
      const heightPct = (box.height / naturalHeight) * 100;

      const bubble = document.createElement('div');
      bubble.className = 'speedyslate-bubble';
      bubble.id = item.id;
      bubble.title = `Gốc: "${item.originalText}" (Rê chuột để soi chữ gốc)`;

      // Determine style based on theme
      const isDark = theme === 'dark' || (theme === 'auto' && item.isDarkBackground);
      const bg = isDark ? '#111111' : '#ffffff';
      const textColor = isDark ? '#ffffff' : '#000000';

      // Inline styles: no borders or shadows so it blends seamlessly into the original comic balloon
      Object.assign(bubble.style, {
        position: 'absolute',
        top: `${topPct}%`,
        left: `${leftPct}%`,
        width: `${widthPct}%`,
        minHeight: `${heightPct}%`,
        backgroundColor: bg,
        color: textColor,
        border: 'none',
        borderRadius: '2px',
        boxSizing: 'border-box',
        padding: '1px 2px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        fontFamily: "'Comic Sans MS', 'Bangers', 'Segoe UI', system-ui, sans-serif",
        fontWeight: 'bold',
        lineHeight: '1.2',
        zIndex: '50',
        cursor: 'pointer',
        transition: 'opacity 0.15s ease-in-out',
        userSelect: 'text',
        wordBreak: 'break-word',
        boxShadow: 'none'
      });

      // Compute adaptive font size based on box dimensions and text length
      const fontSize = this.calculateFontSize(box.width, box.height, item.translatedText.length);
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
    let base = Math.sqrt(area / Math.max(1, textLength)) * 0.9;
    // Bound font size between 11px and 22px
    base = Math.max(11, Math.min(22, Math.round(base)));
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
