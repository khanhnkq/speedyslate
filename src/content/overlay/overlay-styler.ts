import type { BubbleCoordinates } from './bubble-geometry';

/**
 * OverlayStyler: Manages clean, comic-authentic styling for speech bubble overlays.
 * Following user specifications:
 * - Bubble covers the dialogue area inside the bubble without spilling into surrounding panels.
 * - Fits within bubble bounds: text scales down when long; bubble never balloons across panels.
 * - Clean, borderless, shadowless comic typography.
 * Following Single Responsibility Principle (SRP) & strictly < 500 lines.
 */
export class OverlayStyler {
  /**
   * Computes pixel interior padding for a rendered speech bubble box.
   * Uses CSS pixel dimensions (never CSS `%`, which resolves against the full wrapper width).
   */
  public static computePaddingPx(
    cssBoxW: number,
    cssBoxH: number,
    isEllipse: boolean
  ): { padX: number; padY: number } {
    if (isEllipse) {
      return {
        padX: Math.max(3, Math.round(cssBoxW * 0.09)),
        padY: Math.max(2, Math.round(cssBoxH * 0.06))
      };
    }
    return {
      padX: Math.min(6, Math.max(2, Math.round(cssBoxW * 0.04))),
      padY: Math.min(3, Math.max(1, Math.round(cssBoxH * 0.04)))
    };
  }

  /**
   * Resolves the erase/background colour for an item under the given theme.
   * 'auto' prefers the real sampled bgColor; falls back to the dark/light binary.
   */
  public static resolveBackground(
    theme: 'light' | 'dark' | 'auto',
    isDark: boolean,
    bgColor?: string
  ): string {
    if (theme === 'light') return '#ffffff';
    if (theme === 'dark') return '#111111';
    if (bgColor && /^#[0-9a-fA-F]{6}$/.test(bgColor)) return bgColor;
    return isDark ? '#111111' : '#ffffff';
  }

  /** Picks readable text colour for a given background hex. */
  public static textColorFor(bgHex: string): string {
    return OverlayStyler.hexToLuma(bgHex) < 140 ? '#ffffff' : '#000000';
  }

  private static hexToLuma(hex: string): number {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return 0.299 * r + 0.587 * g + 0.114 * b;
  }

  /**
   * Applies complete overlay styles anchored to the comic speech bubble dimensions.
   * `transparentBg` leaves erasure to per-line patches (art between lines stays visible).
   */
  public static applyStyles(
    bubble: HTMLElement,
    coords: BubbleCoordinates,
    fontSize: number,
    isDark: boolean,
    bgColor?: string,
    transparentBg?: boolean,
    kind?: 'dialogue' | 'sfx' | 'free',
    paddingPx?: { padX: number; padY: number },
    hasManualLineBreaks?: boolean
  ): void {
    const bg = transparentBg ? 'transparent' : bgColor ?? (isDark ? '#111111' : '#ffffff');
    const textColor = OverlayStyler.textColorFor(
      bgColor ?? (isDark ? '#111111' : '#ffffff')
    );
    const needsStrokeHalo = Boolean(transparentBg && (kind === 'free' || kind === 'sfx'));
    const haloColor = textColor === '#ffffff' ? '#111111' : '#ffffff';

    // Speech bubbles erase as an ellipse so the overlay keeps the original
    // balloon silhouette and never pokes past its curved border. Rectangular
    // narration boxes (free) stay softly squared like the printed frame.
    const isEllipse = kind !== 'free' && kind !== 'sfx';
    let borderRadius: string;
    if (kind === 'free') {
      borderRadius = '8px';
    } else if (kind === 'sfx') {
      borderRadius = '10px';
    } else {
      borderRadius = '50%';
    }

    const pad = paddingPx ?? OverlayStyler.computePaddingPx(coords.pixelWidth, coords.pixelHeight, isEllipse);

    Object.assign(bubble.style, {
      position: 'absolute',
      top: `${coords.topPct}%`,
      left: `${coords.leftPct}%`,
      transform: 'none',
      width: `${coords.widthPct}%`,
      maxWidth: `${coords.widthPct}%`,
      height: `${coords.heightPct}%`,
      maxHeight: `${coords.heightPct}%`,
      margin: '0',
      backgroundColor: bg,
      color: textColor,
      border: 'none',
      outline: 'none',
      boxShadow: 'none',
      filter: 'none',
      textShadow: needsStrokeHalo
        ? `-1px -1px 0 ${haloColor}, 1px -1px 0 ${haloColor}, -1px 1px 0 ${haloColor}, 1px 1px 0 ${haloColor}, 0 1px 2px rgba(0,0,0,0.45)`
        : 'none',
      borderRadius,
      boxSizing: 'border-box',
      padding: `${pad.padY}px ${pad.padX}px`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      textIndent: '0px',
      wordSpacing: '0px',
      direction: 'ltr',
      writingMode: 'horizontal-tb',
      fontFamily: "'SpeedySlateComic', 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
      fontWeight: '600',
      lineHeight: '1.24',
      letterSpacing: '-0.01em',
      fontSize: `${fontSize}px`,
      zIndex: '50',
      cursor: 'default',
      pointerEvents: 'auto',
      transition: 'opacity 0.15s ease-in-out',
      userSelect: 'text',
      whiteSpace: hasManualLineBreaks ? 'pre-line' : 'normal',
      wordBreak: 'normal',
      overflowWrap: 'break-word',
      hyphens: 'none',
      overflow: 'visible'
    });

    if (needsStrokeHalo) {
      bubble.style.setProperty('-webkit-text-stroke', `3px ${haloColor}`);
      bubble.style.setProperty('paint-order', 'stroke fill');
    } else {
      bubble.style.setProperty('-webkit-text-stroke', '0px transparent');
      bubble.style.setProperty('paint-order', 'normal');
    }

    if (hasManualLineBreaks) {
      bubble.style.setProperty('text-wrap', 'normal');
      bubble.style.setProperty('-webkit-text-wrap', 'normal');
    } else {
      // Balanced line breaking for natural comic dialogue layout
      bubble.style.setProperty('text-wrap', 'balance');
      bubble.style.setProperty('-webkit-text-wrap', 'balance');
    }
  }
}
