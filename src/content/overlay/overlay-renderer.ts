import { BubbleTheme, DialogueItem } from '../../shared/types';
import { BubbleGeometry } from './bubble-geometry';
import { TextAutoFitter } from './text-auto-fitter';
import { OverlayStyler } from './overlay-styler';
import { ErasePatcher } from './erase-patcher';
import { ComicFontLoader } from './comic-font-loader';

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
    ComicFontLoader.ensureLoaded();

    // 1. Remove previous bubbles, patches and clean canvases if any
    const existing = wrapper.querySelectorAll(
      '.speedyslate-bubble, .speedyslate-erase-patch, .speedyslate-clean-canvas'
    );
    existing.forEach((el) => el.remove());

    // 2. Pixel-level erase: repaint only ink pixels so the original bubble
    // and artwork are fully preserved (no overlay shape spills outside).
    const cleanCanvas = ErasePatcher.renderCleanCanvas(
      wrapper,
      dialogues,
      naturalWidth,
      naturalHeight
    );

    for (const item of dialogues) {
      if (!item.translatedText || !item.translatedText.trim()) continue;

      // 2. Calculate calibrated coordinates covering the original text
      const coords = BubbleGeometry.computeCoordinates(item, naturalWidth, naturalHeight);

      // 3. Fit font size + chord-aware line breaks for elliptical vs rectangular bubbles
      const useEllipse =
        item.isOvalChamber ?? (item.kind === undefined || item.kind === 'dialogue');
      const fitted = TextAutoFitter.fitDialogue(
        coords.pixelWidth,
        coords.pixelHeight,
        item.translatedText,
        { elliptical: useEllipse }
      );
      const fontSize = fitted.fontSize;

      // 4. Determine dark/light mode and the true sampled bubble colour
      const isDark = theme === 'dark' || (theme === 'auto' && item.isDarkBackground);
      const sampledBg =
        theme === 'auto' && item.bgColor && /^#[0-9a-fA-F]{6}$/.test(item.bgColor)
          ? item.bgColor
          : undefined;
      const eraseBg = OverlayStyler.resolveBackground(theme, !!isDark, item.bgColor);

      // 5. Erasure strategy: pixel patches from the worker already removed the
      // ink — the bubble goes transparent on top. Legacy per-line rect divs
      // cover cached items that have lineBoxes but no pixel data.
      const hasPixelPatch = (item.erasePatches?.length ?? 0) > 0;
      const useLineErase =
        !hasPixelPatch &&
        item.kind !== undefined &&
        !item.normBox &&
        item.lineBoxes !== undefined &&
        item.lineBoxes.length > 0;
      if (useLineErase) {
        ErasePatcher.renderPatches(
          wrapper,
          item.lineBoxes!,
          naturalWidth,
          naturalHeight,
          eraseBg,
          item.id
        );
      }

      // 6. Create DOM element
      const bubble = document.createElement('div');
      bubble.className = 'speedyslate-bubble';
      bubble.id = item.id;
      if (item.originalText) {
        bubble.title = item.originalText;
      }

      // 7. Apply manga-authentic visual styling
      const transparentBg = hasPixelPatch || useLineErase;
      OverlayStyler.applyStyles(
        bubble,
        coords,
        fontSize,
        !!isDark,
        sampledBg,
        transparentBg,
        item.kind
      );

      bubble.textContent = fitted.lines.length > 0 ? fitted.lines.join('\n') : item.translatedText;

      // 8. Peek original comic art only if holding Alt key (prevents accidental opacity loss during reading)
      bubble.addEventListener('mouseenter', (e: MouseEvent) => {
        if (e.altKey) {
          bubble.style.opacity = '0.12';
          if (cleanCanvas) cleanCanvas.style.opacity = '0.12';
          wrapper
            .querySelectorAll<HTMLElement>(`.speedyslate-erase-patch[data-for="${item.id}"]`)
            .forEach((p) => (p.style.opacity = '0.12'));
        }
      });
      bubble.addEventListener('mouseleave', () => {
        bubble.style.opacity = '1';
        if (cleanCanvas) cleanCanvas.style.opacity = '1';
        wrapper
          .querySelectorAll<HTMLElement>(`.speedyslate-erase-patch[data-for="${item.id}"]`)
          .forEach((p) => (p.style.opacity = '1'));
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
