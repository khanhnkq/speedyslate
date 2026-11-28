import { DialogueItem } from '../../shared/types';

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
 * - Anchors overlays inside valid speech-bubble chambers for both horizontal & vertical text.
 * - Uses aspect-aware height limits and center-preserving symmetric boundary clamping.
 * Following Single Responsibility Principle (SRP) & strictly < 500 lines.
 */
export class BubbleGeometry {
  private static clampHeightPreservingCenter(
    topPct: number,
    heightPct: number,
    maxAllowedHeightPct: number
  ): { topPct: number; heightPct: number } {
    if (heightPct <= maxAllowedHeightPct) {
      return { topPct, heightPct };
    }
    const midY = topPct + heightPct / 2;
    const clampedTop = Math.max(
      0.5,
      Math.min(99.5 - maxAllowedHeightPct, midY - maxAllowedHeightPct / 2)
    );
    return { topPct: clampedTop, heightPct: maxAllowedHeightPct };
  }

  private static clampSymmetrically(
    leftPct: number,
    topPct: number,
    widthPct: number,
    heightPct: number
  ): { leftPct: number; topPct: number; widthPct: number; heightPct: number } {
    const cx = Math.max(1, Math.min(99, leftPct + widthPct / 2));
    const cy = Math.max(1, Math.min(99, topPct + heightPct / 2));

    const maxHalfW = Math.min(cx - 0.5, 99.5 - cx);
    const maxHalfH = Math.min(cy - 0.5, 99.5 - cy);
    const halfW = Math.min(widthPct / 2, maxHalfW);
    const halfH = Math.min(heightPct / 2, maxHalfH);

    let finalWidth = Math.min(99, Math.max(1, halfW * 2));
    let finalLeft = Math.max(0.5, Math.min(99.5 - finalWidth, cx - finalWidth / 2));

    let finalHeight = Math.min(99, Math.max(1, halfH * 2));
    let finalTop = Math.max(0.5, Math.min(99.5 - finalHeight, cy - finalHeight / 2));

    return { leftPct: finalLeft, topPct: finalTop, widthPct: finalWidth, heightPct: finalHeight };
  }

  /**
   * Computes the calibrated position and dimensions to cover the dialogue text cleanly.
   */
  public static computeCoordinates(
    item: DialogueItem,
    naturalWidth: number,
    naturalHeight: number
  ): BubbleCoordinates {
    const natW = Math.max(1, naturalWidth);
    const natH = Math.max(1, naturalHeight);
    const maxAllowedHeightPct =
      natH < natW * 1.35
        ? 92
        : Math.min(42, Math.max(28, ((natW * 0.6) / natH) * 100));

    let topPct: number;
    let leftPct: number;
    let widthPct: number;
    let heightPct: number;

    const chamber = item.chamberBox;
    const isValidChamber =
      Boolean(chamber) &&
      !item.normBox &&
      item.kind !== 'free' &&
      item.kind !== 'sfx' &&
      chamber!.width >= item.box.width * 0.85 &&
      chamber!.height >= item.box.height * 0.85 &&
      chamber!.width <= Math.max(item.box.width * 3.2, 260) &&
      chamber!.height <= Math.max(item.box.height * 4.5, 280) &&
      chamber!.width * chamber!.height <= natW * natH * 0.25;

    if (item.normBox) {
      topPct = item.normBox.ymin / 10;
      leftPct = item.normBox.xmin / 10;
      widthPct = Math.max(1, (item.normBox.xmax - item.normBox.xmin) / 10);
      heightPct = Math.max(1, (item.normBox.ymax - item.normBox.ymin) / 10);
    } else if (isValidChamber && chamber) {
      const insetX = Math.max(3, chamber.width * 0.06);
      const insetY = Math.max(3, chamber.height * 0.05);
      let ix0 = chamber.x + insetX;
      let iy0 = chamber.y + insetY;
      let ix1 = chamber.x + chamber.width - insetX;
      let iy1 = chamber.y + chamber.height - insetY;

      // Opaque fallback (no pixel patches): ensure safe box encloses raw OCR ink inside chamber
      if ((item.erasePatches?.length ?? 0) === 0) {
        ix0 = Math.max(chamber.x, Math.min(ix0, item.box.x));
        iy0 = Math.max(chamber.y, Math.min(iy0, item.box.y));
        ix1 = Math.min(chamber.x + chamber.width, Math.max(ix1, item.box.x + item.box.width));
        iy1 = Math.min(chamber.y + chamber.height, Math.max(iy1, item.box.y + item.box.height));
      }

      const safeW = Math.max(16, ix1 - ix0);
      const safeH = Math.max(16, iy1 - iy0);
      leftPct = (ix0 / natW) * 100;
      topPct = (iy0 / natH) * 100;
      widthPct = (safeW / natW) * 100;
      heightPct = (safeH / natH) * 100;
    } else {
      topPct = (item.box.y / natH) * 100;
      leftPct = (item.box.x / natW) * 100;
      widthPct = (item.box.width / natW) * 100;
      heightPct = (item.box.height / natH) * 100;
    }

    const cappedBefore = this.clampHeightPreservingCenter(topPct, heightPct, maxAllowedHeightPct);
    topPct = cappedBefore.topPct;
    heightPct = cappedBefore.heightPct;

    let pixelWidth = (widthPct / 100) * natW;
    const pixelHeight = (heightPct / 100) * natH;
    const aspectRatio = pixelHeight / Math.max(1, pixelWidth);

    if (
      !item.normBox &&
      !isValidChamber &&
      (item.isVertical === true || (aspectRatio >= 2.0 && pixelWidth < 48))
    ) {
      const targetWidthPx = Math.min(Math.max(pixelWidth * 1.45, 58), pixelWidth + 44);
      const targetWidthPct = (targetWidthPx / natW) * 100;
      const centerX = leftPct + widthPct / 2;
      leftPct = centerX - targetWidthPct / 2;
      widthPct = targetWidthPct;
      pixelWidth = (widthPct / 100) * natW;
    }

    if (!isValidChamber) {
      const ellipseBoost = item.kind === 'free' || item.kind === 'sfx' ? 1 : 1.6;
      const padPixelX = (item.normBox ? 3 : 5) * ellipseBoost;
      const padPixelY = (item.normBox ? 3 : 4) * ellipseBoost;
      const expandX = ((padPixelX * 2) / natW) * 100;
      const expandY = ((padPixelY * 2) / natH) * 100;
      leftPct -= expandX / 2;
      topPct -= expandY / 2;
      widthPct += expandX;
      heightPct += expandY;
    }

    const cappedAfter = this.clampHeightPreservingCenter(topPct, heightPct, maxAllowedHeightPct);
    const finalBox = this.clampSymmetrically(
      leftPct,
      cappedAfter.topPct,
      widthPct,
      cappedAfter.heightPct
    );

    return {
      topPct: finalBox.topPct,
      leftPct: finalBox.leftPct,
      widthPct: finalBox.widthPct,
      heightPct: finalBox.heightPct,
      pixelWidth: (finalBox.widthPct / 100) * natW,
      pixelHeight: (finalBox.heightPct / 100) * natH,
      aspectRatio
    };
  }
}
