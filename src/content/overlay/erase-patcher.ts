import { BoundingBox, DialogueItem, ErasePatch } from '../../shared/types';
import { decodePixels } from '../../shared/erase-codec';

/**
 * ErasePatcher: Paints worker-produced pixel patches onto one clean canvas so
 * original ink disappears while the bubble shape and artwork stay untouched.
 * Falls back to per-line rounded-rect divs for cached items that only carry
 * lineBoxes (no pixel data). SRP & strictly < 500 lines.
 */
export class ErasePatcher {
  /**
   * Renders all dialogue erase patches on a single full-image canvas placed
   * under the translated text layer (zIndex 48).
   */
  public static renderCleanCanvas(
    wrapper: HTMLElement,
    dialogues: DialogueItem[],
    naturalWidth: number,
    naturalHeight: number
  ): HTMLCanvasElement | null {
    const patches: ErasePatch[] = [];
    for (const d of dialogues) {
      // Only erase regions whose translation is actually rendered — an
      // untranslated item (e.g. sfx skipped by settings) must keep its ink.
      if (d.erasePatches && d.translatedText?.trim()) patches.push(...d.erasePatches);
    }
    if (patches.length === 0) return null;

    const canvas = document.createElement('canvas');
    canvas.className = 'speedyslate-clean-canvas';
    canvas.width = naturalWidth;
    canvas.height = naturalHeight;
    Object.assign(canvas.style, {
      position: 'absolute',
      left: '0',
      top: '0',
      width: '100%',
      height: '100%',
      zIndex: '48',
      pointerEvents: 'none',
      transition: 'opacity 0.15s ease-in-out'
    });
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    for (const p of patches) {
      const u8 = decodePixels(p.pixels);
      if (!p.width || !p.height || u8.length !== p.width * p.height * 4) continue;
      const tmp = document.createElement('canvas');
      tmp.width = p.width;
      tmp.height = p.height;
      const tctx = tmp.getContext('2d');
      if (!tctx) continue;
      tctx.putImageData(new ImageData(u8, p.width, p.height), 0, 0);
      ctx.drawImage(tmp, p.x, p.y);
    }
    wrapper.appendChild(canvas);
    return canvas;
  }

  /**
   * Legacy fallback for cached dialogues that carry lineBoxes but no pixel
   * patches: rounded-rect divs per line, below the text layer (zIndex 49).
   */
  public static renderPatches(
    wrapper: HTMLElement,
    lines: BoundingBox[],
    naturalWidth: number,
    naturalHeight: number,
    bgHex: string,
    forId: string
  ): void {
    const padPxX = 4;
    const padPxY = 4;
    const w = Math.max(1, naturalWidth);
    const h = Math.max(1, naturalHeight);

    for (const line of lines) {
      const left = ((line.x - padPxX) / w) * 100;
      const top = ((line.y - padPxY) / h) * 100;
      const width = ((line.width + padPxX * 2) / w) * 100;
      const height = ((line.height + padPxY * 2) / h) * 100;

      const patch = document.createElement('div');
      patch.className = 'speedyslate-erase-patch';
      patch.dataset.for = forId;
      Object.assign(patch.style, {
        position: 'absolute',
        left: `${Math.max(0, left)}%`,
        top: `${Math.max(0, top)}%`,
        width: `${width}%`,
        height: `${height}%`,
        backgroundColor: bgHex,
        borderRadius: '6px',
        zIndex: '49',
        pointerEvents: 'none',
        transition: 'opacity 0.15s ease-in-out'
      });
      wrapper.appendChild(patch);
    }
  }
}
