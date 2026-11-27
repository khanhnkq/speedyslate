export interface PaintedImageRect {
  leftPct: number;
  topPct: number;
  widthPct: number;
  heightPct: number;
  renderedWidth: number;
  renderedHeight: number;
}

const safePx = (v: string | undefined): number => (Number.isFinite(parseFloat(v || '0')) ? parseFloat(v || '0') : 0);

/**
 * ImageBoxSync: Computes the painted bitmap rect of `<img>` inside `.speedyslate-wrapper`
 * (host CSS padding/border, partial-width imgs, object-fit contain/scale-down)
 * and syncs `.speedyslate-overlay-layer` to match it 1:1.
 */
export class ImageBoxSync {
  public static computePaintedImageRect(
    wrapper: HTMLElement,
    img: HTMLImageElement | null,
    naturalWidth: number,
    naturalHeight: number
  ): PaintedImageRect {
    const fallbackW = wrapper.clientWidth || naturalWidth || 800;
    const fallbackH = wrapper.clientHeight || naturalHeight || 1200;
    const wrapperRect = wrapper.getBoundingClientRect?.();
    const imgRect = img?.getBoundingClientRect?.();

    if (!img || !wrapperRect || !imgRect || wrapperRect.width < 8 || wrapperRect.height < 8 || imgRect.width < 8 || imgRect.height < 8) {
      return { leftPct: 0, topPct: 0, widthPct: 100, heightPct: 100, renderedWidth: fallbackW, renderedHeight: fallbackH };
    }

    let elLeft = imgRect.left - wrapperRect.left;
    let elTop = imgRect.top - wrapperRect.top;
    let elW = imgRect.width;
    let elH = imgRect.height;

    const cs = typeof getComputedStyle === 'function' ? getComputedStyle(img) : null;
    if (cs) {
      const padL = safePx(cs.paddingLeft), padR = safePx(cs.paddingRight);
      const padT = safePx(cs.paddingTop), padB = safePx(cs.paddingBottom);
      const borL = safePx(cs.borderLeftWidth), borR = safePx(cs.borderRightWidth);
      const borT = safePx(cs.borderTopWidth), borB = safePx(cs.borderBottomWidth);
      elLeft += padL + borL;
      elTop += padT + borT;
      elW = Math.max(1, elW - padL - padR - borL - borR);
      elH = Math.max(1, elH - padT - padB - borT - borB);
    }

    const intrinsicW = (img.naturalWidth || 0) > 0 ? img.naturalWidth : naturalWidth;
    const intrinsicH = (img.naturalHeight || 0) > 0 ? img.naturalHeight : naturalHeight;
    const fit = cs?.objectFit;
    if ((fit === 'contain' || fit === 'scale-down') && intrinsicW > 0 && intrinsicH > 0) {
      if (fit === 'scale-down' && intrinsicW < elW && intrinsicH < elH) {
        elLeft += (elW - intrinsicW) / 2;
        elTop += (elH - intrinsicH) / 2;
        elW = intrinsicW;
        elH = intrinsicH;
      } else {
        const imgAspect = intrinsicW / intrinsicH;
        const boxAspect = elW / elH;
        if (Math.abs(imgAspect - boxAspect) / Math.max(imgAspect, boxAspect) > 0.015) {
          if (boxAspect > imgAspect) {
            const paintedW = elH * imgAspect;
            elLeft += (elW - paintedW) / 2;
            elW = paintedW;
          } else {
            const paintedH = elW / imgAspect;
            elTop += (elH - paintedH) / 2;
            elH = paintedH;
          }
        }
      }
    }

    return {
      leftPct: (elLeft / wrapperRect.width) * 100,
      topPct: (elTop / wrapperRect.height) * 100,
      widthPct: (elW / wrapperRect.width) * 100,
      heightPct: (elH / wrapperRect.height) * 100,
      renderedWidth: Math.max(1, elW),
      renderedHeight: Math.max(1, elH)
    };
  }

  public static syncOverlayLayer(
    wrapper: HTMLElement,
    layer: HTMLElement,
    naturalWidth: number,
    naturalHeight: number
  ): { renderedWidth: number; renderedHeight: number } {
    const img = wrapper.querySelector?.('img') as HTMLImageElement | null;
    const rect = ImageBoxSync.computePaintedImageRect(wrapper, img, naturalWidth, naturalHeight);
    Object.assign(layer.style, {
      position: 'absolute',
      left: `${rect.leftPct}%`,
      top: `${rect.topPct}%`,
      width: `${rect.widthPct}%`,
      height: `${rect.heightPct}%`,
      pointerEvents: 'none',
      zIndex: '47'
    });
    return { renderedWidth: rect.renderedWidth, renderedHeight: rect.renderedHeight };
  }
}
