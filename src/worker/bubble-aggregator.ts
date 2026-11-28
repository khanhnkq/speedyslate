import { BoundingBox, DialogueItem, DialogueKind, ErasePatch } from '../shared/types';
import type { ErasePatchDbg } from './erase-masker';
import { BubbleWallDetector, PagePixelBuffer } from './bubble-wall-detector';
import { VerticalText } from './vertical-text';
import { OcrNoiseFilter } from './ocr-noise-filter';
import { ReadingOrderSorter } from './reading-order';

/**
 * Aggregates individual text lines into unified dialogue bubbles
 * following post-OCR recognition using strict Cotrans (manga-image-translator) clustering rules.
 * Following Single Responsibility Principle (SRP).
 */
export class BubbleAggregator {
  /**
   * Groups text lines that belong to the SAME comic speech bubble.
   * Horizontal lines use font-height consistency, bounded vertical gaps, and horizontal alignment.
   * Vertical CJK columns (`isVertical`) group by font-width consistency, bounded horizontal gaps,
   * and vertical alignment, then join text right-to-left.
   * Guarantees that separate speech bubbles are never merged into one giant cluster.
   */
  public static aggregateDialogues(
    items: DialogueItem[],
    imageWidth: number,
    imageHeight: number,
    sourceLang?: string,
    pageImg?: PagePixelBuffer
  ): DialogueItem[] {
    if (items.length === 0) return items;
    const filtered = OcrNoiseFilter.filterRawLines(items, imageWidth, imageHeight);
    if (filtered.length === 0) return [];
    if (filtered.length === 1) return [this.enrichSingleItem(filtered[0])];

    // Vertical CJK columns follow a separate grouping path (columns, not stacked lines)
    const horizontalItems = filtered.filter((d) => d.isVertical !== true);
    const verticalItems = filtered.filter((d) => d.isVertical === true);

    const groups: DialogueItem[][] = [
      ...this.groupHorizontalLines(horizontalItems, pageImg),
      ...this.groupVerticalColumns(verticalItems, pageImg)
    ];

    // 2. Build aggregated DialogueItem for each speech bubble
    const rawDialogues = groups.map((group, groupIdx) =>
      this.buildBubble(group, groupIdx, imageWidth, imageHeight)
    );

    // 3. Drop detection junk that would paint over artwork:
    //  - a giant box (>=15% of the page) holding very little text is a
    //    misdetected art region, not real lettering;
    //  - non-dialogue items of <=1 alphanumeric char are page-number noise.
    const pageArea = imageWidth * imageHeight;
    const sane = rawDialogues.filter((d) => {
      const normLen = d.originalText.replace(/[^a-zA-Z0-9]/g, '').length;
      const areaRatio = (d.box.width * d.box.height) / Math.max(1, pageArea);
      if (areaRatio > 0.15 && normLen < 20) return false;
      if (d.kind !== 'dialogue' && normLen <= 1) return false;
      return true;
    });

    // 4. Deduplicate overlapping bubbles (e.g. multiple detector hits for same
    // bubble). Longer-text bubbles register first so line-level fragments lose.
    const deduped: DialogueItem[] = [];
    const byLen = [...sane].sort((a, b) => b.originalText.length - a.originalText.length);
    for (const d of byLen) {
      const isDuplicate = deduped.some((existing) => {
        const iou = this.calculateIoU(existing.box, d.box);
        if (iou > 0.45) return true;

        const textA = existing.originalText.toLowerCase().replace(/[^a-z0-9]/g, '');
        const textB = d.originalText.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (!textA || !textB) return false;
        if (iou > 0.20 && (textA === textB || textA.includes(textB) || textB.includes(textA))) {
          return true;
        }

        // Contained fragment: the smaller box sits mostly inside the bigger
        // one and its (short) text is fuzzily present in the bigger text —
        // e.g. "GOOD" inside "OH THEY ARE HAVING A GOOD TIME". Long bubbles
        // sharing words with a neighbouring blob are never dropped this way.
        const kb = existing.box;
        const ib = d.box;
        const ix = Math.max(0, Math.min(kb.x + kb.width, ib.x + ib.width) - Math.max(kb.x, ib.x));
        const iy = Math.max(0, Math.min(kb.y + kb.height, ib.y + ib.height) - Math.max(kb.y, ib.y));
        const minArea = Math.min(kb.width * kb.height, ib.width * ib.height);
        if (minArea > 0 && (ix * iy) / minArea >= 0.5) {
          const [shorter, longer] = textA.length >= textB.length ? [textB, textA] : [textA, textB];
          if (longer.includes(shorter)) return true;
          if (shorter.length <= 15 && this.lcsRatio(shorter, longer) >= 0.75) return true;
        }
        return false;
      });

      if (!isDuplicate) {
        deduped.push(d);
      }
    }

    const dir = ReadingOrderSorter.detectDirection(deduped, sourceLang);
    return ReadingOrderSorter.sort(deduped, dir);
  }

  /**
   * Original grouping path for horizontal lines: vertically stacked lines inside
   * the same speech bubble (font-height similarity, bounded vertical gap, horizontal overlap).
   */
  private static groupHorizontalLines(items: DialogueItem[], pageImg?: PagePixelBuffer): DialogueItem[][] {
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
          if (
            (lastLine.bubbleClusterId !== undefined || candidate.bubbleClusterId !== undefined) &&
            lastLine.bubbleClusterId !== candidate.bubbleClusterId
          ) {
            continue;
          }
          if (
            Boolean(lastLine.isDarkBackground) !== Boolean(candidate.isDarkBackground) &&
            Math.max(lastBox.height, candBox.height) >= 30
          ) {
            continue;
          }

          // 1. Font-size / Line-height consistency (lines in the same bubble have similar font size)
          const hRatio = Math.min(lastBox.height, candBox.height) / Math.max(lastBox.height, candBox.height);
          if (hRatio < 0.38) continue;

          // 2. Vertical gap: default 1.85x; relax up to 2.65x for aligned dialogue lines in a uniform bubble
          const lineMaxH = Math.max(lastBox.height, candBox.height);
          const verticalGap = candBox.y - (lastBox.y + lastBox.height);
          const maxAllowedGap = lineMaxH * 1.85;
          const relaxedMaxGap = lineMaxH * 2.65;
          const sameCluster =
            lastLine.bubbleClusterId !== undefined &&
            lastLine.bubbleClusterId === candidate.bubbleClusterId;
          if (verticalGap < -lastBox.height * 0.5 || verticalGap > relaxedMaxGap) continue;
          if (verticalGap > maxAllowedGap && !pageImg && !sameCluster) continue;

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

          // Lines in a speech bubble are horizontally aligned or centered
          const isAligned = overlapRatio >= 0.25 || centerDiffRatio <= 0.45;
          if (!isAligned) continue;

          if (verticalGap > maxAllowedGap) {
            const tightlyAligned = overlapRatio >= 0.4 || centerDiffRatio <= 0.25;
            const bothDialogue = lastLine.kind === 'dialogue' && candidate.kind === 'dialogue';
            if (!tightlyAligned || !bothDialogue) continue;
          }

          if (pageImg && BubbleWallDetector.hasHorizontalWallBetween(pageImg, lastBox, candBox)) {
            continue;
          }

          // Matched: add candidate line to bubble
          currentGroup.push(candidate);
          used.add(j);
          changed = true;
          break; // re-evaluate from the newly added line
        }
      }

      groups.push(currentGroup);
    }

    return groups;
  }

  /**
   * Grouping path for vertical CJK text columns: columns of the same bubble sit
   * side-by-side (read right-to-left) with similar font width and shared vertical band.
   */
  private static groupVerticalColumns(items: DialogueItem[], pageImg?: PagePixelBuffer): DialogueItem[][] {
    // 1. Sort right to left by X coordinate (CJK column reading order)
    const sorted = [...items].sort((a, b) => b.box.x - a.box.x);
    const groups: DialogueItem[][] = [];
    const used = new Set<number>();

    for (let i = 0; i < sorted.length; i++) {
      if (used.has(i)) continue;

      const currentGroup: DialogueItem[] = [sorted[i]];
      used.add(i);

      let changed = true;
      while (changed) {
        changed = false;
        // Compare candidate strictly against the immediate preceding column in the current bubble
        const lastLine = currentGroup[currentGroup.length - 1];
        const lastBox = lastLine.box;
        const lastCenterY = lastBox.y + lastBox.height / 2;

        for (let j = 0; j < sorted.length; j++) {
          if (used.has(j)) continue;
          const candidate = sorted[j];
          const candBox = candidate.box;
          if (
            (lastLine.bubbleClusterId !== undefined || candidate.bubbleClusterId !== undefined) &&
            lastLine.bubbleClusterId !== candidate.bubbleClusterId
          ) {
            continue;
          }
          if (
            Boolean(lastLine.isDarkBackground) !== Boolean(candidate.isDarkBackground) &&
            Math.max(lastBox.height, candBox.height) >= 30
          ) {
            continue;
          }

          // 1. Font-size / Column-width consistency (columns in the same bubble share font size)
          const wRatio = Math.min(lastBox.width, candBox.width) / Math.max(lastBox.width, candBox.width);
          if (wRatio < 0.45) continue;

          // 2. Strict horizontal gap between adjacent columns
          const horizontalGap = Math.max(
            lastBox.x - (candBox.x + candBox.width),
            candBox.x - (lastBox.x + lastBox.width)
          );
          const maxAllowedGap = Math.max(lastBox.width, candBox.width) * 1.85;
          const isHorizontallyAdjacent =
            horizontalGap >= -lastBox.width * 0.5 && horizontalGap <= maxAllowedGap;
          if (!isHorizontallyAdjacent) continue;

          // 3. Vertical overlap and center alignment (columns share a vertical band)
          const yOverlap = Math.max(
            0,
            Math.min(lastBox.y + lastBox.height, candBox.y + candBox.height) - Math.max(lastBox.y, candBox.y)
          );
          const minH = Math.min(lastBox.height, candBox.height);
          const maxH = Math.max(lastBox.height, candBox.height);
          const overlapRatio = yOverlap / Math.max(1, minH);

          const candCenterY = candBox.y + candBox.height / 2;
          const centerDiffRatio = Math.abs(lastCenterY - candCenterY) / Math.max(1, maxH);

          const isAligned = overlapRatio >= 0.25 || centerDiffRatio <= 0.45;
          if (!isAligned) continue;

          if (pageImg && BubbleWallDetector.hasVerticalWallBetween(pageImg, lastBox, candBox)) {
            continue;
          }

          // Matched: add candidate column to bubble
          currentGroup.push(candidate);
          used.add(j);
          changed = true;
          break; // re-evaluate from the newly added column
        }
      }

      groups.push(currentGroup);
    }

    return groups;
  }

  /**
   * Builds one aggregated bubble DialogueItem from a member group:
   * joined text, union box, and majority/mean metadata (kind, bgColor, confidence, lineBoxes).
   */
  private static buildBubble(
    group: DialogueItem[],
    groupIdx: number,
    imageWidth: number,
    imageHeight: number
  ): DialogueItem {
    const isVertical = group[0].isVertical === true;

    // Sort members into reading order: top->bottom for horizontal, right->left for vertical
    if (isVertical) {
      VerticalText.groupColumns(group);
    } else {
      group.sort((a, b) => a.box.y - b.box.y);
    }

    const fullText = this.joinLineTexts(group);

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

    const bubble: DialogueItem = {
      id: `dialogue-bubble-${Date.now()}-${groupIdx + 1}`,
      box: unifiedBox,
      originalText: fullText,
      isDarkBackground,
      kind: this.majorityKind(group),
      lineBoxes: group.map((d) => d.box)
    };
    if (group[0].bubbleClusterId !== undefined) bubble.bubbleClusterId = group[0].bubbleClusterId;

    const confidence = this.meanConfidence(group);
    if (confidence !== undefined) bubble.confidence = confidence;

    const bgColor = this.majorityBgColor(group);
    if (bgColor !== undefined) bubble.bgColor = bgColor;

    const linePatches = group.map((d) => d.erasePatch).filter((p): p is NonNullable<typeof p> => p !== undefined);
    const bubblePatch = group.map((d) => d.bubblePatch).find((p) => p !== undefined);
    // Prefer whole-bubble patch alone when it encloses all lines with >=8px margin
    const erasePatches = bubblePatch
      ? (this.enclosesBoxesWithMargin(bubblePatch, bubble.lineBoxes ?? [], 8) ? [bubblePatch] : [...linePatches, bubblePatch])
      : linePatches;
    if (erasePatches.length > 0) bubble.erasePatches = erasePatches;

    const memberWithChamber = group.find((d) => d.chamberBox !== undefined);
    if (memberWithChamber?.chamberBox) {
      bubble.chamberBox = memberWithChamber.chamberBox;
      bubble.isOvalChamber = memberWithChamber.isOvalChamber;
    }

    if (isVertical) bubble.isVertical = true;

    return bubble;
  }

  /** Joins member texts in order, stitching hyphenated words across lines. */
  private static joinLineTexts(group: DialogueItem[]): string {
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
    return fullText;
  }

  /** Majority vote over member kind values; defaults to 'dialogue' when none are tagged. */
  private static majorityKind(group: DialogueItem[]): DialogueKind {
    const counts = new Map<DialogueKind, number>();
    for (const d of group) {
      if (d.kind === undefined) continue;
      counts.set(d.kind, (counts.get(d.kind) ?? 0) + 1);
    }
    let best: DialogueKind = 'dialogue';
    let bestCount = 0;
    for (const [kind, count] of counts) {
      if (count > bestCount) {
        best = kind;
        bestCount = count;
      }
    }
    return best;
  }

  /** Mean of member confidence values; undefined when no member carries one. */
  private static meanConfidence(group: DialogueItem[]): number | undefined {
    let sum = 0;
    let count = 0;
    for (const d of group) {
      if (typeof d.confidence === 'number') {
        sum += d.confidence;
        count++;
      }
    }
    return count > 0 ? sum / count : undefined;
  }

  /** Most frequent member bgColor hex; undefined when no member carries one. */
  private static majorityBgColor(group: DialogueItem[]): string | undefined {
    const counts = new Map<string, number>();
    for (const d of group) {
      if (!d.bgColor) continue;
      counts.set(d.bgColor, (counts.get(d.bgColor) ?? 0) + 1);
    }
    let best: string | undefined;
    let bestCount = 0;
    for (const [hex, count] of counts) {
      if (count > bestCount) {
        best = hex;
        bestCount = count;
      }
    }
    return best;
  }

  private static enclosesBoxesWithMargin(p: ErasePatch, boxes: BoundingBox[], m = 8): boolean {
    if (boxes.length === 0 || (p as ErasePatchDbg).dbg?.coversLineInk === false) return false;
    return boxes.every((b) => {
      if (b.x < p.x + m || b.y < p.y + m || b.x + b.width > p.x + p.width - m || b.y + b.height > p.y + p.height - m) return false;
      if (!(p.pixels instanceof Uint8ClampedArray)) return true;
      const x0 = Math.max(0, Math.floor(b.x - p.x)), y0 = Math.max(0, Math.floor(b.y - p.y));
      const x1 = Math.min(p.width, Math.ceil(b.x - p.x + b.width)), y1 = Math.min(p.height, Math.ceil(b.y - p.y + b.height));
      for (let yy = y0; yy < y1; yy++) for (let xx = x0; xx < x1; xx++) if (p.pixels[(yy * p.width + xx) * 4 + 3] > 0) return true;
      return false;
    });
  }

  /** Single ungrouped item: keeps its box/id/text untouched and surfaces metadata/erasePatches. */
  private static enrichSingleItem(item: DialogueItem): DialogueItem {
    const enriched: DialogueItem = { ...item };
    if (enriched.kind === undefined) enriched.kind = 'dialogue';
    if (enriched.lineBoxes === undefined) enriched.lineBoxes = [item.box];
    if (enriched.erasePatches === undefined && (item.erasePatch || item.bubblePatch)) {
      if (item.bubblePatch) {
        const encloses = this.enclosesBoxesWithMargin(item.bubblePatch, [item.box], 8);
        enriched.erasePatches = encloses || !item.erasePatch ? [item.bubblePatch] : [item.erasePatch, item.bubblePatch];
      } else {
        enriched.erasePatches = [item.erasePatch!];
      }
    }
    return enriched;
  }

  /** Longest-common-subsequence length of `short` found in `long`, normalized. */
  private static lcsRatio(short: string, long: string): number {
    const m = short.length;
    const n = long.length;
    if (m === 0 || n === 0) return 0;
    let prev = new Int32Array(n + 1);
    let cur = new Int32Array(n + 1);
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        cur[j] = short[i - 1] === long[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], cur[j - 1]);
      }
      const tmp = prev;
      prev = cur;
      cur = tmp;
      cur.fill(0);
    }
    return prev[n] / m;
  }

  private static calculateIoU(a: BoundingBox, b: BoundingBox): number {
    const xOverlap = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
    const yOverlap = Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
    const intersection = xOverlap * yOverlap;
    if (intersection <= 0) return 0;

    const areaA = a.width * a.height;
    const areaB = b.width * b.height;
    const union = areaA + areaB - intersection;
    return union > 0 ? intersection / union : 0;
  }
}
