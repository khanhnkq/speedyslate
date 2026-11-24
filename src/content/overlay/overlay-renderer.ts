import { BubbleTheme, DialogueItem } from '../../shared/types';
import { BubbleGeometry } from './bubble-geometry';
import { TextAutoFitter } from './text-auto-fitter';
import { OverlayStyler } from './overlay-styler';
import { ErasePatcher } from './erase-patcher';
import { ComicFontLoader } from './comic-font-loader';

const resizeObservers = new WeakMap<HTMLElement, ResizeObserver>();

/**
 * OverlayRenderer: Coordinates the rendering, responsive CSS scaling, and
 * post-mount DOM overflow clamping of comic speech-bubble overlays.
 */
export class OverlayRenderer {
  public static renderDialogues(
    wrapper: HTMLElement,
    dialogues: DialogueItem[],
    naturalWidth: number,
    naturalHeight: number,
    theme: BubbleTheme = 'auto'
  ): void {
    ComicFontLoader.ensureLoaded();

    const existing = wrapper.querySelectorAll(
      '.speedyslate-bubble, .speedyslate-erase-patch, .speedyslate-clean-canvas'
    );
    existing.forEach((el) => el.remove());

    const cleanCanvas = ErasePatcher.renderCleanCanvas(
      wrapper,
      dialogues,
      naturalWidth,
      naturalHeight
    );

    const renderedW = OverlayRenderer.measureRenderedWidth(wrapper, naturalWidth);

    for (const item of dialogues) {
      const cleanTranslated = (item.translatedText || '').replace(/\s+/g, ' ').trim();
      if (!cleanTranslated) continue;

      const coords = BubbleGeometry.computeCoordinates(item, naturalWidth, naturalHeight);
      const useEllipse =
        item.isOvalChamber ?? (item.kind === undefined || item.kind === 'dialogue');

      const fontSize = TextAutoFitter.computeScaledFontSize(
        coords.pixelWidth,
        coords.pixelHeight,
        cleanTranslated,
        {
          naturalWidth,
          renderedWidth: renderedW,
          elliptical: useEllipse
        }
      );

      const isDark = theme === 'dark' || (theme === 'auto' && item.isDarkBackground);
      const sampledBg =
        theme === 'auto' && item.bgColor && /^#[0-9a-fA-F]{6}$/.test(item.bgColor)
          ? item.bgColor
          : undefined;
      const eraseBg = OverlayStyler.resolveBackground(theme, !!isDark, item.bgColor);

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

      const bubble = document.createElement('div');
      bubble.className = 'speedyslate-bubble';
      bubble.id = item.id;
      bubble.dataset.natBoxW = String(coords.pixelWidth);
      bubble.dataset.natBoxH = String(coords.pixelHeight);
      bubble.dataset.natImgW = String(naturalWidth);
      bubble.dataset.ellipse = useEllipse ? '1' : '0';
      if (item.originalText) {
        bubble.title = item.originalText;
      }

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

      bubble.textContent = cleanTranslated;

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

    // Immediate DOM overflow clamp + re-clamp once webfont finishes loading & on resize
    OverlayRenderer.clampMountedBubbles(wrapper);
    if (typeof document !== 'undefined' && (document as any).fonts?.ready) {
      (document as any).fonts.ready
        .then(() => OverlayRenderer.refitWrapperBubbles(wrapper))
        .catch(() => {});
    }
    OverlayRenderer.attachResizeRefitter(wrapper);
  }

  private static measureRenderedWidth(wrapper: HTMLElement, fallbackW: number): number {
    if (!wrapper) return fallbackW;
    const cw = wrapper.clientWidth || wrapper.getBoundingClientRect?.()?.width || 0;
    if (cw > 20) return cw;
    const img = wrapper.querySelector?.('img') as HTMLImageElement | null;
    const iw = img?.clientWidth || img?.getBoundingClientRect?.()?.width || 0;
    return iw > 20 ? iw : fallbackW;
  }

  private static refitWrapperBubbles(wrapper: HTMLElement): void {
    const bubbles = wrapper.querySelectorAll<HTMLElement>('.speedyslate-bubble');
    if (bubbles.length === 0) return;
    const firstImgW = Number(bubbles[0].dataset.natImgW) || 800;
    const renderedW = OverlayRenderer.measureRenderedWidth(wrapper, firstImgW);

    bubbles.forEach((bubble) => {
      const natBoxW = Number(bubble.dataset.natBoxW) || 100;
      const natBoxH = Number(bubble.dataset.natBoxH) || 60;
      const natImgW = Number(bubble.dataset.natImgW) || firstImgW;
      const elliptical = bubble.dataset.ellipse === '1';
      const fs = TextAutoFitter.computeScaledFontSize(natBoxW, natBoxH, bubble.textContent || '', {
        naturalWidth: natImgW,
        renderedWidth: renderedW,
        elliptical
      });
      bubble.style.fontSize = `${fs}px`;
    });

    OverlayRenderer.clampMountedBubbles(wrapper);
  }

  /**
   * Shrinks any mounted bubble whose rendered scrollHeight or scrollWidth
   * exceeds its bounded speech-bubble client box down to a 6.5px floor.
   */
  private static clampMountedBubbles(wrapper: HTMLElement): void {
    const bubbles = wrapper.querySelectorAll<HTMLElement>('.speedyslate-bubble');
    bubbles.forEach((b) => {
      if (b.clientHeight < 8 || b.clientWidth < 8) return;
      let fs = parseFloat(b.style.fontSize) || 12;
      let guard = 0;
      while (
        guard < 24 &&
        fs > 6.5 &&
        (b.scrollHeight > b.clientHeight + 2 || b.scrollWidth > b.clientWidth + 2)
      ) {
        fs = Math.max(6.5, Number((fs - 0.5).toFixed(1)));
        b.style.fontSize = `${fs}px`;
        guard++;
      }
    });
  }

  private static attachResizeRefitter(wrapper: HTMLElement): void {
    if (typeof ResizeObserver === 'undefined' || resizeObservers.has(wrapper)) return;
    let lastW = Math.round(wrapper.clientWidth || 0);
    const ro = new ResizeObserver(() => {
      const nextW = Math.round(wrapper.clientWidth || 0);
      if (nextW > 20 && Math.abs(nextW - lastW) >= 4) {
        lastW = nextW;
        OverlayRenderer.refitWrapperBubbles(wrapper);
      }
    });
    ro.observe(wrapper);
    resizeObservers.set(wrapper, ro);
  }

  public static setAllVisibility(visible: boolean): void {
    const bubbles = document.querySelectorAll<HTMLElement>('.speedyslate-bubble');
    bubbles.forEach((b) => {
      b.style.display = visible ? 'flex' : 'none';
    });
  }
}
