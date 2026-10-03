import * as ort from 'onnxruntime-web';
import { BoundingBox } from '../shared/types';
import { ImageUtils } from './image-utils';

export class PaddleDetEngine {
  private session: ort.InferenceSession;
  private thresh: number = 0.3;
  private boxThresh: number = 0.5;
  private unclipRatio: number = 1.6;

  constructor(session: ort.InferenceSession) {
    this.session = session;
  }

  /**
   * Detects text regions in an image bitmap or canvas
   */
  public async detectText(
    canvas: OffscreenCanvas,
    originalWidth: number,
    originalHeight: number
  ): Promise<BoundingBox[]> {
    const { targetW, targetH, ratioW, ratioH } = ImageUtils.calculateDetResize(
      originalWidth,
      originalHeight,
      960
    );

    // Create a temporary offscreen canvas for resized input
    const resizedCanvas = new OffscreenCanvas(targetW, targetH);
    const ctx = resizedCanvas.getContext('2d');
    if (!ctx) throw new Error('Không thể khởi tạo OffscreenCanvas 2D context');

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

      // Unclip expansion
      const cx = b.x + b.width / 2;
      const cy = b.y + b.height / 2;
      const expW = b.width * this.unclipRatio;
      const expH = b.height * this.unclipRatio;

      const origX = Math.round((cx - expW / 2) / ratioW);
      const origY = Math.round((cy - expH / 2) / ratioH);
      const origW = Math.round(expW / ratioW);
      const origH = Math.round(expH / ratioH);

      const clamped = ImageUtils.clampBox(
        { x: origX, y: origY, width: origW, height: origH, confidence: b.confidence },
        originalWidth,
        originalHeight
      );

      // Filter tiny noise
      if (clamped.width >= 12 && clamped.height >= 10) {
        scaledBoxes.push(clamped);
      }
    }

    // Merge line boxes that belong to the same dialogue bubble
    return this.mergeDialogueLines(scaledBoxes);
  }

  /**
   * Simple and fast Connected-Component Labeling on binary probability map
   */
  private extractBoxes(predData: Float32Array, width: number, height: number): BoundingBox[] {
    const visited = new Uint8Array(width * height);
    const boxes: BoundingBox[] = [];

    // Scan each pixel
    for (let y = 0; y < height; y += 2) { // 2px step for speed
      for (let x = 0; x < width; x += 2) {
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

          // Check 4-connected neighbors with step 2
          const neighbors = [
            cy > 1 ? (cy - 2) * width + cx : -1,
            cy < height - 2 ? (cy + 2) * width + cx : -1,
            cx > 1 ? cy * width + (cx - 2) : -1,
            cx < width - 2 ? cy * width + (cx + 2) : -1
          ];

          for (const n of neighbors) {
            if (n >= 0 && !visited[n] && predData[n] >= this.thresh) {
              visited[n] = 1;
              queue.push(n);
            }
          }
        }

        const boxW = maxX - minX + 2;
        const boxH = maxY - minY + 2;

        if (boxW >= 8 && boxH >= 8 && pixelCount >= 10) {
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

  /**
   * Merges dialogue text lines that are vertically adjacent or horizontally close
   * within speech bubbles
   */
  private mergeDialogueLines(boxes: BoundingBox[]): BoundingBox[] {
    if (boxes.length <= 1) return boxes;

    // Sort top to bottom
    const sorted = [...boxes].sort((a, b) => a.y - b.y);
    const merged: BoundingBox[] = [];
    const used = new Set<number>();

    for (let i = 0; i < sorted.length; i++) {
      if (used.has(i)) continue;
      let cur = { ...sorted[i] };
      used.add(i);

      let changed = true;
      while (changed) {
        changed = false;
        for (let j = 0; j < sorted.length; j++) {
          if (used.has(j)) continue;
          const other = sorted[j];

          // Check proximity: horizontal overlap and vertical distance < 1.5 * line height
          const xOverlap = Math.max(0, Math.min(cur.x + cur.width, other.x + other.width) - Math.max(cur.x, other.x));
          const yDist = Math.abs(other.y - (cur.y + cur.height));
          const avgHeight = (cur.height + other.height) / 2;

          if (xOverlap > Math.min(cur.width, other.width) * 0.3 && yDist < avgHeight * 1.2) {
            // Merge other into cur
            const newX = Math.min(cur.x, other.x);
            const newY = Math.min(cur.y, other.y);
            const newMaxX = Math.max(cur.x + cur.width, other.x + other.width);
            const newMaxY = Math.max(cur.y + cur.height, other.y + other.height);

            cur.x = newX;
            cur.y = newY;
            cur.width = newMaxX - newX;
            cur.height = newMaxY - newY;

            used.add(j);
            changed = true;
          }
        }
      }

      merged.push(cur);
    }

    return merged;
  }
}
