import { BubbleTheme, DialogueItem } from '../../shared/types';
import { BubbleGeometry } from './bubble-geometry';
import { TextAutoFitter } from './text-auto-fitter';
import { OverlayStyler } from './overlay-styler';
import { ErasePatcher } from './erase-patcher';
import { ComicFontLoader } from './comic-font-loader';
import { ImageBoxSync } from './image-box-sync';

const resizeObservers = new WeakMap<HTMLElement, ResizeObserver>();

/**
 * OverlayRenderer: Coordinates the rendering, bitmap-to-DOM sync, responsive CSS scaling,
 * and post-mount DOM overflow clamping of comic speech-bubble overlays.
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
      '.speedyslate-overlay-layer, .speedyslate-bubble, .speedyslate-erase-patch, .speedyslate-clean-canvas'
    );
    existing.forEach((el) => el.remove());

    const layer = document.createElement('div');
    layer.className = 'speedyslate-overlay-layer';
    layer.dataset.natImgW = String(naturalWidth);
    layer.dataset.natImgH = String(naturalHeight);
    wrapper.appendChild(layer);

    const { renderedWidth: renderedW } = ImageBoxSync.syncOverlayLayer(
      wrapper,
      layer,
      naturalWidth,
      naturalHeight
    );

    const cleanCanvas = ErasePatcher.renderCleanCanvas(
      layer,
      dialogues,
      naturalWidth,
      naturalHeight
    );

    for (const item of dialogues) {
      const cleanTranslated = (item.translatedText || '').replace(/\s+/g, ' ').trim();
      if (!cleanTranslated) continue;

      const coords = BubbleGeometry.computeCoordinates(item, naturalWidth, naturalHeight);
      const useEllipse =
        item.isOvalChamber ?? (item.kind === undefined || item.kind === 'dialogue');

      const fitted = TextAutoFitter.fitScaledDialogue(
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
          layer,
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
      bubble.dataset.rawText = cleanTranslated;
      bubble.dataset.padX = String(fitted.padX);
      bubble.dataset.padY = String(fitted.padY);
      if (item.originalText) {
        bubble.title = item.originalText;
      }

      const hasManualLineBreaks = useEllipse && fitted.lines.length >= 2;
      const transparentBg = hasPixelPatch || useLineErase;
      OverlayStyler.applyStyles(
        bubble,
        coords,
        fitted.fontSize,
        !!isDark,
        sampledBg,
        transparentBg,
        item.kind,
        { padX: fitted.padX, padY: fitted.padY },
        hasManualLineBreaks
      );

      const textSpan = document.createElement('span');
      textSpan.className = 'speedyslate-bubble-text';
      Object.assign(textSpan.style, {
        display: 'block',
        maxWidth: '100%',
        pointerEvents: 'none'
      });
      textSpan.textContent = hasManualLineBreaks ? fitted.lines.join('\n') : cleanTranslated;
      bubble.appendChild(textSpan);

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

      layer.appendChild(bubble);
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

    const layer = wrapper.querySelector<HTMLElement>('.speedyslate-overlay-layer');
    const firstImgW = Number(bubbles[0].dataset.natImgW) || 800;
    const natImgW = Number(layer?.dataset.natImgW) || firstImgW;
    const natImgH = Number(layer?.dataset.natImgH) || 1200;

    const renderedW = layer
      ? ImageBoxSync.syncOverlayLayer(wrapper, layer, natImgW, natImgH).renderedWidth
      : OverlayRenderer.measureRenderedWidth(wrapper, firstImgW);

    bubbles.forEach((bubble) => {
      const natBoxW = Number(bubble.dataset.natBoxW) || 100;
      const natBoxH = Number(bubble.dataset.natBoxH) || 60;
      const natImg = Number(bubble.dataset.natImgW) || natImgW;
      const elliptical = bubble.dataset.ellipse === '1';
      const rawText = (bubble.dataset.rawText || bubble.textContent || '').replace(/\s+/g, ' ').trim();
      if (!rawText) return;

      const fitted = TextAutoFitter.fitScaledDialogue(natBoxW, natBoxH, rawText, {
        naturalWidth: natImg,
        renderedWidth: renderedW,
        elliptical
      });
      const hasManualLineBreaks = elliptical && fitted.lines.length >= 2;

      bubble.style.fontSize = `${fitted.fontSize}px`;
      bubble.style.padding = `${fitted.padY}px ${fitted.padX}px`;
      bubble.dataset.padX = String(fitted.padX);
      bubble.dataset.padY = String(fitted.padY);
      bubble.style.whiteSpace = hasManualLineBreaks ? 'pre-line' : 'normal';
      bubble.style.setProperty('text-wrap', hasManualLineBreaks ? 'normal' : 'balance');
      bubble.style.setProperty('-webkit-text-wrap', hasManualLineBreaks ? 'normal' : 'balance');

      const textSpan = bubble.querySelector<HTMLElement>('.speedyslate-bubble-text');
      const nextText = hasManualLineBreaks ? fitted.lines.join('\n') : rawText;
      if (textSpan) {
        textSpan.textContent = nextText;
      } else {
        bubble.textContent = nextText;
      }
    });

    OverlayRenderer.clampMountedBubbles(wrapper);
  }

  /**
   * Shrinks any mounted bubble whose rendered text span (or scroll box)
   * exceeds its inner speech-bubble client box down to a 6.5px floor.
   */
  private static clampMountedBubbles(wrapper: HTMLElement): void {
    const bubbles = wrapper.querySelectorAll<HTMLElement>('.speedyslate-bubble');
    bubbles.forEach((b) => {
      if (b.clientHeight < 8 || b.clientWidth < 8) return;
      const padX = Number(b.dataset.padX) || 0;
      const padY = Number(b.dataset.padY) || 0;
      const availClientW = Math.max(8, b.clientWidth - padX * 2);
      const availClientH = Math.max(8, b.clientHeight - padY * 2);
      const textEl = b.querySelector<HTMLElement>('.speedyslate-bubble-text');

      let fs = parseFloat(b.style.fontSize) || 12;
      let guard = 0;
      while (
        guard < 36 &&
        fs > 6.5 &&
        (textEl
          ? textEl.offsetHeight > availClientH + 2 ||
            Math.max(textEl.offsetWidth, textEl.scrollWidth) > availClientW + 2
          : b.scrollHeight > b.clientHeight + 2 || b.scrollWidth > b.clientWidth + 2)
      ) {
        fs = Math.max(6.5, Number((fs - 0.5).toFixed(1)));
        b.style.fontSize = `${fs}px`;
        guard++;
      }
    });
  }

  private static attachResizeRefitter(wrapper: HTMLElement): void {
    const img = wrapper.querySelector?.('img') as HTMLImageElement | null;
    if (img && !img.complete && typeof img.addEventListener === 'function') {
      img.addEventListener('load', () => OverlayRenderer.refitWrapperBubbles(wrapper), { once: true });
    }
    if (typeof ResizeObserver === 'undefined' || resizeObservers.has(wrapper)) return;

    const getDims = () => {
      const iRect = img?.getBoundingClientRect?.();
      const wRect = wrapper.getBoundingClientRect?.();
      const w = Math.round(iRect?.width || img?.clientWidth || wRect?.width || wrapper.clientWidth || 0);
      const h = Math.round(iRect?.height || img?.clientHeight || wRect?.height || wrapper.clientHeight || 0);
      return { w, h };
    };
    let { w: lastW, h: lastH } = getDims();
    const ro = new ResizeObserver(() => {
      const { w: nextW, h: nextH } = getDims();
      if (nextW > 20 && (Math.abs(nextW - lastW) >= 3 || Math.abs(nextH - lastH) >= 3)) {
        lastW = nextW;
        lastH = nextH;
        OverlayRenderer.refitWrapperBubbles(wrapper);
      }
    });
    ro.observe(wrapper);
    if (img) ro.observe(img);
    resizeObservers.set(wrapper, ro);
  }

  public static setAllVisibility(visible: boolean): void {
    const bubbles = document.querySelectorAll<HTMLElement>('.speedyslate-bubble');
    bubbles.forEach((b) => {
      b.style.display = visible ? 'flex' : 'none';
    });
  }
}
