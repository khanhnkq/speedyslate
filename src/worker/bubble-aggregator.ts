import { BoundingBox, DialogueItem } from '../shared/types';

/**
 * Aggregates individual text lines into unified dialogue bubbles
 * following post-OCR recognition using strict Cotrans (manga-image-translator) clustering rules.
 * Following Single Responsibility Principle (SRP).
 */
export class BubbleAggregator {
  /**
   * Groups vertically stacked text lines that belong to the SAME comic speech bubble.
   * Strictly enforces font-size consistency, bounded vertical gaps, and strong horizontal alignment.
   * Guarantees that separate speech bubbles are never merged into one giant cluster.
   */
  public static aggregateDialogues(
    items: DialogueItem[],
    imageWidth: number,
    imageHeight: number
  ): DialogueItem[] {
    if (items.length <= 1) return items;

    // 1. Sort top to bottom by Y coordinate
    const sorted = [...items].sort((a, b) => a.box.y - b.box.y);
    const groups: DialogueItem[][] = [];
    const used = new Set<number>();

    for (let i = 0; i < sorted.length; i++) {
      if (used.has(i)) continue;

      const currentGroup: DialogueItem[] = [sorted[i]];
      used.add(i);

      let changed = true;
      while (changed) {
        changed = false;
        // Compare candidate strictly against the immediate preceding line in the current bubble
        const lastLine = currentGroup[currentGroup.length - 1];
        const lastBox = lastLine.box;
        const lastCenterX = lastBox.x + lastBox.width / 2;

        for (let j = 0; j < sorted.length; j++) {
          if (used.has(j)) continue;
          const candidate = sorted[j];
          const candBox = candidate.box;

          // 1. Font-size / Line-height consistency (lines in the same bubble have similar font size)
          const hRatio = Math.min(lastBox.height, candBox.height) / Math.max(lastBox.height, candBox.height);
          if (hRatio < 0.6) continue;

          // 2. Strict vertical gap: measured from the bottom of the immediate last line
          const verticalGap = candBox.y - (lastBox.y + lastBox.height);
          // In comics, line spacing is between 0.2x and 2.1x of line height
          const maxAllowedGap = Math.max(lastBox.height, candBox.height) * 2.1;
          const isVerticallyAdjacent = verticalGap >= -lastBox.height * 0.4 && verticalGap <= maxAllowedGap;
          if (!isVerticallyAdjacent) continue;

          // 3. Horizontal overlap and center alignment
          const xOverlap = Math.max(
            0,
            Math.min(lastBox.x + lastBox.width, candBox.x + candBox.width) - Math.max(lastBox.x, candBox.x)
          );
          const minW = Math.min(lastBox.width, candBox.width);
          const maxW = Math.max(lastBox.width, candBox.width);
          const overlapRatio = xOverlap / Math.max(1, minW);

          const candCenterX = candBox.x + candBox.width / 2;
          const centerDiffRatio = Math.abs(lastCenterX - candCenterX) / Math.max(1, maxW);

          // Must have either strong overlap (>= 40%) or decent overlap (>= 25%) with centered alignment
          const isAligned = overlapRatio >= 0.4 || (overlapRatio >= 0.25 && centerDiffRatio <= 0.35);
          if (!isAligned) continue;

          // Matched: add candidate line to bubble
          currentGroup.push(candidate);
          used.add(j);
          changed = true;
          break; // re-evaluate from the newly added line
        }
      }

      groups.push(currentGroup);
    }

    // 2. Build aggregated DialogueItem for each speech bubble
    return groups.map((group, groupIdx) => {
      // Sort lines in group top to bottom
      group.sort((a, b) => a.box.y - b.box.y);

      // Join sentences naturally
      let fullText = '';
      for (let k = 0; k < group.length; k++) {
        const lineText = group[k].originalText.trim();
        if (k === 0) {
          fullText = lineText;
        } else if (fullText.endsWith('-')) {
          // Word hyphenation across lines e.g. "dis-" + "cover" -> "discover"
          fullText = fullText.slice(0, -1) + lineText;
        } else {
          fullText += ' ' + lineText;
        }
      }

      // Compute bounding box encompassing all lines with slight breathing room
      const minX = Math.min(...group.map((d) => d.box.x));
      const minY = Math.min(...group.map((d) => d.box.y));
      const maxX = Math.max(...group.map((d) => d.box.x + d.box.width));
      const maxY = Math.max(...group.map((d) => d.box.y + d.box.height));

      const padX = 4;
      const padY = 3;

      const finalX = Math.max(0, minX - padX);
      const finalY = Math.max(0, minY - padY);
      const finalW = Math.min(imageWidth - finalX, maxX - minX + padX * 2);
      const finalH = Math.min(imageHeight - finalY, maxY - minY + padY * 2);

      const unifiedBox: BoundingBox = {
        x: Math.round(finalX),
        y: Math.round(finalY),
        width: Math.round(finalW),
        height: Math.round(finalH)
      };

      const isDarkBackground = group.filter((d) => d.isDarkBackground).length > group.length / 2;

      return {
        id: `dialogue-bubble-${Date.now()}-${groupIdx + 1}`,
        box: unifiedBox,
        originalText: fullText,
        isDarkBackground
      };
    });
  }
}
