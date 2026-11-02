import { BubbleTheme, DialogueItem } from '../../shared/types';
import { BubbleGeometry } from './bubble-geometry';
import { TextAutoFitter } from './text-auto-fitter';
import { OverlayStyler } from './overlay-styler';

/**
 * OverlayRenderer: Coordinates the rendering and lifecycle of comic overlays.
 * Integrates BubbleGeometry (aspect ratio & bound clamping) and TextAutoFitter (dynamic font scaling).
 * Following Single Responsibility Principle (SRP) & strictly < 500 lines.
 */
export class OverlayRenderer {
  /**
   * Renders translated speech bubbles over the wrapped image.
   */
  public static renderDialogues(
    wrapper: HTMLElement,
    dialogues: DialogueItem[],
    naturalWidth: number,
    naturalHeight: number,
    theme: BubbleTheme = 'auto'
  ): void {
    // 1. Remove previous bubbles and clean canvases if any
    const existing = wrapper.querySelectorAll('.speedyslate-bubble, .speedyslate-clean-canvas');
    existing.forEach((el) => el.remove());

    for (const item of dialogues) {
      if (!item.translatedText || !item.translatedText.trim()) continue;

      // 2. Calculate calibrated coordinates covering the original text
      const coords = BubbleGeometry.computeCoordinates(item, naturalWidth, naturalHeight);

      // 3. Calculate optimal font size dynamically based on available area and text length
      const fontSize = TextAutoFitter.computeOptimalFontSize(
        coords.pixelWidth,
        coords.pixelHeight,
        item.translatedText
      );

      // 4. Determine dark/light mode
      const isDark = theme === 'dark' || (theme === 'auto' && item.isDarkBackground);

      // 5. Create DOM element
      const bubble = document.createElement('div');
      bubble.className = 'speedyslate-bubble';
      bubble.id = item.id;
      if (item.originalText) {
        bubble.title = item.originalText;
      }

      // 6. Apply manga-authentic visual styling
      OverlayStyler.applyStyles(bubble, coords, fontSize, !!isDark);

      bubble.textContent = item.translatedText;

      // 7. Peek original comic art only if holding Alt key (prevents accidental opacity loss during reading)
      bubble.addEventListener('mouseenter', (e: MouseEvent) => {
        if (e.altKey) {
          bubble.style.opacity = '0.12';
        }
      });
      bubble.addEventListener('mouseleave', () => {
        bubble.style.opacity = '1';
      });

      wrapper.appendChild(bubble);
    }
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
