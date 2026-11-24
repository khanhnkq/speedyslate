import { DialogueItem } from '../../shared/types';
import { TextAutoFitter } from './text-auto-fitter';

export interface BubbleCoordinates {
  topPct: number;
  leftPct: number;
  widthPct: number;
  heightPct: number;
  pixelWidth: number;
  pixelHeight: number;
  aspectRatio: number;
}

/**
 * BubbleGeometry: Computes precise overlay placement to mask original text cleanly.
 * Following user specifications:
 * - Anchors top/left/width directly over the printed dialogue so original text is covered 100%.
 * - Bounded height prevents overlays from bleeding outside speech bubbles into gutters.
 * Following Single Responsibility Principle (SRP) & strictly < 500 lines.
 */
export class BubbleGeometry {
  /**
   * Computes the calibrated position and dimensions to cover the dialogue text cleanly.
   */
  public static computeCoordinates(
    item: DialogueItem,
    naturalWidth: number,
    naturalHeight: number
  ): BubbleCoordinates {
    let topPct: number;
    let leftPct: number;
    let widthPct: number;
    let heightPct: number;

    if (item.normBox) {
      // Vision AI normalized 0-1000 scale -> direct percentage (0% - 100%)
      topPct = item.normBox.ymin / 10;
      leftPct = item.normBox.xmin / 10;
      widthPct = Math.max(1, (item.normBox.xmax - item.normBox.xmin) / 10);
      heightPct = Math.max(1, (item.normBox.ymax - item.normBox.ymin) / 10);
    } else {
      // Hybrid OCR pixel coordinates -> percentage of natural image dimensions
      topPct = (item.box.y / Math.max(1, naturalHeight)) * 100;
      leftPct = (item.box.x / Math.max(1, naturalWidth)) * 100;
      widthPct = (item.box.width / Math.max(1, naturalWidth)) * 100;
      heightPct = (item.box.height / Math.max(1, naturalHeight)) * 100;
    }

    // Safety clamp: Single dialogue block inside a bubble is capped at 28% height
    heightPct = Math.min(28, heightPct);

    let pixelWidth = (widthPct / 100) * naturalWidth;
    let pixelHeight = (heightPct / 100) * naturalHeight;
    const aspectRatio = pixelHeight / Math.max(1, pixelWidth);

    // If it's an extremely narrow vertical Japanese text strip, widen slightly from center
    // so horizontal Vietnamese text has sufficient room without breaking into 1-character lines
    if (aspectRatio >= 1.8 || pixelWidth < 45) {
      const longestWordLen = TextAutoFitter.getLongestWordLength(item.translatedText || '');
      const minWordPx = longestWordLen * 8.5 + 16;
      const targetWidthPx = Math.max(pixelWidth * 1.5, minWordPx, 60);
      const targetWidthPct = (targetWidthPx / Math.max(1, naturalWidth)) * 100;

      const centerX = leftPct + widthPct / 2;
      leftPct = Math.max(0.5, centerX - targetWidthPct / 2);
      widthPct = Math.min(99 - leftPct, targetWidthPct);
      pixelWidth = (widthPct / 100) * naturalWidth;
    }

    // Add subtle, calibrated padding to guarantee original text ink is covered
    // without pushing past the curved borders of circular comic balloons into
    // the drawing. Dialogue bubbles render as ellipses whose corners recede
    // inward, so they need a wider pad to still cover corner text.
    const ellipseBoost = item.kind === 'free' || item.kind === 'sfx' ? 1 : 1.6;
    const padPixelX = (item.normBox ? 3 : 5) * ellipseBoost;
    const padPixelY = (item.normBox ? 3 : 4) * ellipseBoost;
    const expandX = (padPixelX * 2 / Math.max(1, naturalWidth)) * 100;
    const expandY = (padPixelY * 2 / Math.max(1, naturalHeight)) * 100;

    const finalLeft = Math.max(0.5, leftPct - expandX / 2);
    const finalTop = Math.max(0.5, topPct - expandY / 2);
    const finalWidth = Math.min(99 - finalLeft, widthPct + expandX);
    const finalHeight = Math.min(28, heightPct + expandY);

    return {
      topPct: finalTop,
      leftPct: finalLeft,
      widthPct: finalWidth,
      heightPct: finalHeight,
      pixelWidth: (finalWidth / 100) * naturalWidth,
      pixelHeight: (finalHeight / 100) * naturalHeight,
      aspectRatio
    };
  }
}
