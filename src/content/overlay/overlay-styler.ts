import { BubbleCoordinates } from './bubble-geometry';

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
    kind?: 'dialogue' | 'sfx' | 'free'
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
    let borderRadius: string;
    if (kind === 'free') {
      borderRadius = '8px';
    } else if (kind === 'sfx') {
      borderRadius = '10px';
    } else {
      // dialogue or unknown kind: organic balloon shape
      borderRadius = '50%';
    }

    Object.assign(bubble.style, {
      position: 'absolute',
      // Anchored directly over the detected dialogue block inside the speech bubble
      top: `${coords.topPct}%`,
      left: `${coords.leftPct}%`,
      transform: 'none',
      // Width covers the dialogue block cleanly so original text doesn't poke out
      width: `${coords.widthPct}%`,
      maxWidth: `${coords.widthPct}%`,
      // Height covers the full dialogue box so original text cannot poke out above or below
      minHeight: `${coords.heightPct}%`,
      height: 'auto',
      maxHeight: 'none',
      // Solid clean background masks underlying original comic text
      backgroundColor: bg,
      color: textColor,
      // Zero borders, zero shadows, zero filters
      border: 'none',
      outline: 'none',
      boxShadow: 'none',
      filter: 'none',
      textShadow: needsStrokeHalo ? `0 1px 2px rgba(0,0,0,0.38)` : 'none',
      webkitTextStroke: needsStrokeHalo ? `3px ${haloColor}` : '0px transparent',
      paintOrder: needsStrokeHalo ? 'stroke fill' : 'normal',
      borderRadius,
      boxSizing: 'border-box',
      padding: '3px 6px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      // Bundled Vietnamese comic font with clean UI fallback
      fontFamily: "'SpeedySlateComic', 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
      fontWeight: '600',
      lineHeight: '1.24',
      letterSpacing: '-0.01em',
      fontSize: `${fontSize}px`,
      zIndex: '50',
      cursor: 'default',
      transition: 'opacity 0.15s ease-in-out',
      userSelect: 'text',
      whiteSpace: 'pre-wrap',
      wordBreak: 'normal',
      overflowWrap: 'break-word',
      hyphens: 'none',
      // Allow Vietnamese diacritics and descenders to render without horizontal cutting
      overflow: 'visible'
    });

    // Balanced line breaking for natural comic dialogue layout
    bubble.style.setProperty('text-wrap', 'balance');
    bubble.style.setProperty('-webkit-text-wrap', 'balance');
  }
}
