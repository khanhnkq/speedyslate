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
   * Applies complete overlay styles anchored to the comic speech bubble dimensions.
   */
  public static applyStyles(
    bubble: HTMLElement,
    coords: BubbleCoordinates,
    fontSize: number,
    isDark: boolean
  ): void {
    const bg = isDark ? '#111111' : '#ffffff';
    const textColor = isDark ? '#ffffff' : '#000000';

    // Adaptive border-radius: smooth curves matching organic comic balloons (avoids sharp protruding corners)
    let borderRadius = '18px';
    if (coords.aspectRatio >= 0.55 && coords.aspectRatio <= 1.7) {
      borderRadius = coords.pixelWidth >= 80 ? '22px' : '16px';
    } else if (coords.aspectRatio < 0.45) {
      borderRadius = '8px';
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
      textShadow: 'none',
      borderRadius,
      boxSizing: 'border-box',
      padding: '3px 6px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      // High-readability comic font stack with full Vietnamese diacritic support
      fontFamily: "'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
      fontWeight: 'bold',
      lineHeight: '1.25',
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
