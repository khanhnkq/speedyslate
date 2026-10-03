import { BoundingBox, DialogueItem } from '../shared/types';

/**
 * Aggregates individual text lines into unified dialogue bubbles
 * following post-OCR recognition.
 * Following Single Responsibility Principle (SRP).
 */
export class BubbleAggregator {
  /**
   * Groups vertically stacked text lines that belong to the same comic speech bubble
   */
  public static aggregateDialogues(
    items: DialogueItem[],
    imageWidth: number,
    imageHeight: number
  ): DialogueItem[] {
    if (items.length <= 1) return items;

    // 1. Sort top to bottom
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

        // Current bounding box of the group
        const groupMinX = Math.min(...currentGroup.map((d) => d.box.x));
        const groupMaxX = Math.max(...currentGroup.map((d) => d.box.x + d.box.width));
        const groupMinY = Math.min(...currentGroup.map((d) => d.box.y));
        const groupMaxY = Math.max(...currentGroup.map((d) => d.box.y + d.box.height));
        const groupW = groupMaxX - groupMinX;
        const groupH = groupMaxY - groupMinY;
        const groupCenterX = groupMinX + groupW / 2;

        for (let j = 0; j < sorted.length; j++) {
          if (used.has(j)) continue;
          const candidate = sorted[j];

          // 1. Vertical proximity
          // Candidate line must be close to the bottom of the current group
          const verticalGap = candidate.box.y - groupMaxY;
          const candidateH = candidate.box.height;
          const maxAllowedGap = Math.max(candidateH, groupH / currentGroup.length) * 1.6;

          // Vertical gap must be within reading distance (allows small overlap up to maxAllowedGap)
          const isVerticallyAdjacent = verticalGap >= -candidateH * 0.5 && verticalGap <= maxAllowedGap;
          if (!isVerticallyAdjacent) continue;

          // 2. Horizontal alignment / overlap
          const xOverlap = Math.max(
            0,
            Math.min(groupMaxX, candidate.box.x + candidate.box.width) - Math.max(groupMinX, candidate.box.x)
          );
          const candidateCenterX = candidate.box.x + candidate.box.width / 2;
          const centerDiff = Math.abs(groupCenterX - candidateCenterX);
          const maxCenterDiff = Math.max(groupW, candidate.box.width) * 0.65;

          // Speech bubbles can be center-aligned or overlapping
          const isHorizontallyAligned = xOverlap > 0 || centerDiff <= maxCenterDiff;
          if (!isHorizontallyAligned) continue;

          // Matched: add candidate to group
          currentGroup.push(candidate);
          used.add(j);
          changed = true;
          break; // restart loop with updated group bounds
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
