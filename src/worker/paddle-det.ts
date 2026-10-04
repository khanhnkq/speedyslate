import * as ort from 'onnxruntime-web';
import { BoundingBox } from '../shared/types';
import { ImageUtils } from './image-utils';

export class PaddleDetEngine {
  private session: ort.InferenceSession;
  private thresh: number = 0.10;
  private boxThresh: number = 0.15;
  private unclipRatio: number = 1.65;

  constructor(session: ort.InferenceSession) {
    this.session = session;
  }

  /**
   * Detects text regions in an image bitmap or canvas.
   * Outputs unified text-line bounding boxes (words on the same line are merged).
   */
  public async detectText(
    canvas: OffscreenCanvas,
    originalWidth: number,
    originalHeight: number
  ): Promise<BoundingBox[]> {
    const { targetW, targetH, ratioW, ratioH } = ImageUtils.calculateDetResize(
      originalWidth,
      originalHeight
    );

    // Create a temporary offscreen canvas for resized input
    const resizedCanvas = new OffscreenCanvas(targetW, targetH);
    const ctx = resizedCanvas.getContext('2d');
    if (!ctx) throw new Error('Khong the khoi tao OffscreenCanvas 2D context');

    ctx.drawImage(canvas, 0, 0, targetW, targetH);
    const imageData = ctx.getImageData(0, 0, targetW, targetH);

    const tensor = ImageUtils.imageToDetTensor(imageData, targetW, targetH);

    // Run inference
    const feeds: Record<string, ort.Tensor> = {};
    const inputName = this.session.inputNames[0] || 'x';
    feeds[inputName] = tensor;

    const results = await this.session.run(feeds);
    const outputName = this.session.outputNames[0];
    const outputTensor = results[outputName];
    const predData = outputTensor.data as Float32Array;

    // Extract raw bounding boxes from probability map
    const rawBoxes = this.extractBoxes(predData, targetW, targetH);

    // Scale back to original coordinates and unclip
    const scaledBoxes: BoundingBox[] = [];
    for (const b of rawBoxes) {
      if (b.confidence && b.confidence < this.boxThresh) continue;

      // True DBNet unclip expansion: dist = (Area * unclipRatio) / Perimeter
      const area = b.width * b.height;
      const perimeter = 2 * (b.width + b.height);
      const unclipDist = Math.max(3, Math.min(18, (area * this.unclipRatio) / Math.max(1, perimeter)));

      const cx = b.x + b.width / 2;
      const cy = b.y + b.height / 2;
      const expW = b.width + unclipDist * 2;
      const expH = b.height + unclipDist * 2;

      const origX = Math.round((cx - expW / 2) / ratioW);
      const origY = Math.round((cy - expH / 2) / ratioH);
      const origW = Math.round(expW / ratioW);
      const origH = Math.round(expH / ratioH);

      const clamped = ImageUtils.clampBox(
        { x: origX, y: origY, width: origW, height: origH, confidence: b.confidence },
        originalWidth,
        originalHeight
      );

      // Filter tiny noise while preserving wide shout bubbles and dialogues
      // Only filter out true full-image outer frame borders
      const isTooTiny = clamped.width < 8 || clamped.height < 8;
      const isWholePageBorder = clamped.width >= originalWidth * 0.98 && clamped.height >= originalHeight * 0.94;

      if (!isTooTiny && !isWholePageBorder) {
        scaledBoxes.push(clamped);
      }
    }

    // Merge horizontally adjacent word boxes on the same line
    const mergedLines = this.mergeHorizontalBoxes(scaledBoxes, originalWidth);

    // Sort detected lines top-to-bottom for natural reading order
    return mergedLines.sort((a, b) => a.y - b.y);
  }

  /**
   * Merges word-level boxes that belong to the same horizontal text line.
   * DBNet often breaks words separated by spaces into isolated boxes.
   * Merging horizontally creates complete line boxes, giving CTC models
   * the full sequence context needed for accurate text recognition.
   */
  private mergeHorizontalBoxes(boxes: BoundingBox[], maxWidthLimit: number): BoundingBox[] {
    if (boxes.length <= 1) return boxes;

    let merged = [...boxes];
    let changed = true;

    while (changed) {
      changed = false;
      const nextList: BoundingBox[] = [];
      const used = new Set<number>();

      for (let i = 0; i < merged.length; i++) {
        if (used.has(i)) continue;
        let cur = { ...merged[i] };

        for (let j = i + 1; j < merged.length; j++) {
          if (used.has(j)) continue;
          const other = merged[j];

          // Check vertical alignment (same text line with italic tolerance)
          const topA = cur.y;
          const botA = cur.y + cur.height;
          const topB = other.y;
          const botB = other.y + other.height;

          const overlapY = Math.max(0, Math.min(botA, botB) - Math.max(topA, topB));
          const minH = Math.min(cur.height, other.height);
          const isSameLine = overlapY / Math.max(1, minH) >= 0.40;

          if (isSameLine) {
            // Check horizontal proximity (natural word spacing in comic fonts)
            const leftA = cur.x;
            const rightA = cur.x + cur.width;
            const leftB = other.x;
            const rightB = other.x + other.width;

            const gapX = Math.max(0, Math.max(leftA, leftB) - Math.min(rightA, rightB));
            const maxAllowedGap = Math.max(cur.height, other.height) * 2.2;

            const newLeft = Math.min(leftA, leftB);
            const newRight = Math.max(rightA, rightB);
            const mergedW = newRight - newLeft;

            // Only merge if gap is small and merged width stays within reading limits
            if (gapX <= maxAllowedGap && mergedW <= maxWidthLimit * 0.96) {
              const newTop = Math.min(topA, topB);
              const newBot = Math.max(botA, botB);

              cur = {
                x: newLeft,
                y: newTop,
                width: mergedW,
                height: newBot - newTop,
                confidence: Math.max(cur.confidence || 0, other.confidence || 0)
              };

              used.add(j);
              changed = true;
            }
          }
        }

        nextList.push(cur);
      }

      merged = nextList;
    }

    return merged;
  }

  /**
   * Connected-Component Labeling on binary probability map with 1px step
   * Ensures no thin text strokes or stylized comic characters are skipped
   */
  private extractBoxes(predData: Float32Array, width: number, height: number): BoundingBox[] {
    const visited = new Uint8Array(width * height);
    const boxes: BoundingBox[] = [];

    // Scan every pixel (1px step: takes ~2ms in V8 typed arrays and catches all thin characters)
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        if (visited[idx] || predData[idx] < this.thresh) continue;

        // Flood fill / BFS queue
        let minX = x;
        let maxX = x;
        let minY = y;
        let maxY = y;
        let scoreSum = 0;
        let pixelCount = 0;

        const queue: number[] = [idx];
        visited[idx] = 1;

        while (queue.length > 0) {
          const curr = queue.pop()!;
          const cy = Math.floor(curr / width);
          const cx = curr % width;

          scoreSum += predData[curr];
          pixelCount++;

          if (cx < minX) minX = cx;
          if (cx > maxX) maxX = cx;
          if (cy < minY) minY = cy;
          if (cy > maxY) maxY = cy;

          // Check 4-connected neighbors
          const neighbors = [
            cy > 0 ? (cy - 1) * width + cx : -1,
            cy < height - 1 ? (cy + 1) * width + cx : -1,
            cx > 0 ? cy * width + (cx - 1) : -1,
            cx < width - 1 ? cy * width + (cx + 1) : -1
          ];

          for (const n of neighbors) {
            if (n >= 0 && !visited[n] && predData[n] >= this.thresh) {
              visited[n] = 1;
              queue.push(n);
            }
          }
        }

        const boxW = maxX - minX + 1;
        const boxH = maxY - minY + 1;

        if (boxW >= 5 && boxH >= 5 && pixelCount >= 6) {
          boxes.push({
            x: minX,
            y: minY,
            width: boxW,
            height: boxH,
            confidence: scoreSum / pixelCount
          });
        }
      }
    }

    return boxes;
  }
}
