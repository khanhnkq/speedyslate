import { BoundingBox, DialogueItem } from '../shared/types';
import { EraseMasker } from './erase-masker';
import { BubbleFiller } from './bubble-filler';
import { BubbleAggregator } from './bubble-aggregator';
import { PagePixelBuffer } from './bubble-wall-detector';
import { BubbleChamberExtractor } from './bubble-chamber';

export function findBubbleMember(
  lb: BoundingBox,
  boxToItem: Map<BoundingBox, DialogueItem>,
  items: DialogueItem[]
): DialogueItem | undefined {
  return (
    boxToItem.get(lb) ??
    items.find(
      (it) =>
        Math.abs(it.box.x - lb.x) <= 2 &&
        Math.abs(it.box.y - lb.y) <= 2 &&
        Math.abs(it.box.height - lb.height) <= 4 &&
        lb.width <= it.box.width + 4
    )
  );
}

/**
 * Builds pixel-level erase patches per recognized line (Otsu glyph mask +
 * diffusion inpaint) and whole-bubble interior repaints via BubbleFiller.
 */
export function attachErasePatches(
  canvas: OffscreenCanvas,
  items: DialogueItem[],
  textMap?: Float32Array,
  pageImg?: PagePixelBuffer
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const pad = 16;
  for (const item of items) {
    const srcX = Math.max(0, item.box.x - pad);
    const srcY = Math.max(0, item.box.y - pad);
    const srcW = Math.min(canvas.width - srcX, item.box.width + (item.box.x - srcX) + pad);
    const srcH = Math.min(canvas.height - srcY, item.box.height + (item.box.y - srcY) + pad);
    if (srcW < 4 || srcH < 4) continue;
    try {
      const img = ctx.getImageData(srcX, srcY, srcW, srcH);
      const localQuad = item.box.quad?.map(([qx, qy]) => [qx - srcX, qy - srcY] as [number, number]);
      const innerRect = {
        x0: item.box.x - srcX,
        y0: item.box.y - srcY,
        x1: item.box.x - srcX + item.box.width,
        y1: item.box.y - srcY + item.box.height
      };
      const patch = EraseMasker.buildPatch(
        img,
        srcX,
        srcY,
        item.bgColor,
        textMap,
        canvas.width,
        localQuad,
        innerRect
      );
      if (patch) item.erasePatch = patch;
    } catch {
      // patch is best-effort — rendering falls back to box styling
    }
  }

  // Whole-bubble interior repaint: aggregate items into bubbles, then
  // flood-fill each bubble's interior once. Kills specks that line patches
  // can't reach (between-line gaps) and keeps borders pixel-perfect.
  try {
    if (items.length === 1) items[0].bubbleClusterId = 0;
    const bubbles = BubbleAggregator.aggregateDialogues(items, canvas.width, canvas.height, undefined, pageImg);
    const boxToItem = new Map(items.map((it) => [it.box, it]));
    for (let bIdx = 0; bIdx < bubbles.length; bIdx++) {
      const b = bubbles[bIdx];
      for (const lb of b.lineBoxes || []) {
        const member = findBubbleMember(lb, boxToItem, items);
        if (member) member.bubbleClusterId = bIdx;
      }
      // Search window generous enough horizontally to capture oval CJK chambers
      const padX = Math.max(24, Math.min(180, Math.round(Math.max(b.box.width * 1.6, b.box.height * 0.85))));
      const padY = Math.max(16, Math.min(120, Math.round(b.box.height * 0.45)));
      const cx = Math.max(0, b.box.x - padX);
      const cy = Math.max(0, b.box.y - padY);
      const cw = Math.min(canvas.width - cx, b.box.width + padX * 2);
      const ch = Math.min(canvas.height - cy, b.box.height + padY * 2);
      let chamberBox: BoundingBox | undefined;
      if (b.kind === 'dialogue' && cw >= 20 && ch >= 20) {
        const cImg = ctx.getImageData(cx, cy, cw, ch);
        const chamber = BubbleChamberExtractor.extractChamber(cImg, cx, cy, b.box);
        if (chamber) {
          chamberBox = chamber.chamberBox;
          for (const lb of b.lineBoxes || []) {
            const member = findBubbleMember(lb, boxToItem, items);
            if (member) {
              member.chamberBox = chamber.chamberBox;
              member.isOvalChamber = chamber.isOval;
            }
          }
        }
      }

      const useChamberCrop =
        chamberBox !== undefined &&
        chamberBox.width * chamberBox.height <= canvas.width * canvas.height * 0.40;
      const minX = useChamberCrop ? Math.min(b.box.x, chamberBox!.x) : b.box.x;
      const minY = useChamberCrop ? Math.min(b.box.y, chamberBox!.y) : b.box.y;
      const maxX = useChamberCrop ? Math.max(b.box.x + b.box.width, chamberBox!.x + chamberBox!.width) : b.box.x + b.box.width;
      const maxY = useChamberCrop ? Math.max(b.box.y + b.box.height, chamberBox!.y + chamberBox!.height) : b.box.y + b.box.height;
      const bx = Math.max(0, minX - 16), by = Math.max(0, minY - 16);
      const bw = Math.min(canvas.width - bx, maxX + 16 - bx), bh = Math.min(canvas.height - by, maxY + 16 - by);
      if (bw < 12 || bh < 12) continue;
      const img = ctx.getImageData(bx, by, bw, bh);
      const patch = BubbleFiller.buildBubblePatch(img, bx, by, b.lineBoxes, useChamberCrop ? chamberBox : undefined);
      if (!patch) continue;
      for (const lb of b.lineBoxes || []) {
        const member = findBubbleMember(lb, boxToItem, items);
        if (member) member.bubblePatch = patch;
      }
    }
    let nextClusterId = bubbles.length;
    for (const it of items) {
      if (it.bubbleClusterId === undefined) it.bubbleClusterId = nextClusterId++;
    }
  } catch {
    // bubble fill is optional — line patches already cover the common case
  }
}
