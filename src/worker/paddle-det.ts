import * as ort from 'onnxruntime-web';
import { BoundingBox } from '../shared/types';
import { ImageUtils } from './image-utils';

export class PaddleDetEngine {
  private session: ort.InferenceSession;
  private thresh: number = 0.3;
  private boxThresh: number = 0.45;
  private unclipRatio: number = 1.6;

  constructor(session: ort.InferenceSession) {
    this.session = session;
  }

  /**
   * Detects text regions in an image bitmap or canvas.
   * Outputs individual text-line bounding boxes without pre-merging multi-line regions.
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

      // Filter tiny noise while preserving short words/dialogues
      if (clamped.width >= 8 && clamped.height >= 8) {
        scaledBoxes.push(clamped);
      }
    }

    // Sort detected lines top-to-bottom for natural reading order
    return scaledBoxes.sort((a, b) => a.y - b.y);
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
