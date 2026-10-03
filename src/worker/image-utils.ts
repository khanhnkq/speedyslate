import * as ort from 'onnxruntime-web';
import { BoundingBox } from '../shared/types';

/**
 * Utility functions for image manipulation and ONNX tensor preparation
 */
export class ImageUtils {
  /**
   * Resizes dimensions to be divisible by 32 (required by DBNet)
   * Preserves optimal width (768-960px) for tall webtoon comic strips
   */
  public static calculateDetResize(
    width: number,
    height: number
  ): { targetW: number; targetH: number; ratioW: number; ratioH: number } {
    let ratio = 1.0;

    // For webtoons, keep width in optimal reading range 768-960px
    if (width > 960) {
      ratio = 960 / width;
    } else if (width < 640 && height < 1200) {
      ratio = Math.min(1.5, 768 / width);
    }

    // Safety limit on height to prevent excessive memory on ultra-long strips
    if (height * ratio > 2048) {
      ratio = 2048 / height;
    }

    let targetW = Math.round(width * ratio);
    let targetH = Math.round(height * ratio);

    targetW = Math.max(32, Math.round(targetW / 32) * 32);
    targetH = Math.max(32, Math.round(targetH / 32) * 32);

    return {
      targetW,
      targetH,
      ratioW: targetW / width,
      ratioH: targetH / height
    };
  }

  /**
   * Converts ImageData to CHW Float32Array normalized tensor for Det model
   * Normalization: (v / 255.0 - mean) / std
   */
  public static imageToDetTensor(
    imageData: ImageData,
    width: number,
    height: number
  ): ort.Tensor {
    const mean = [0.485, 0.456, 0.406];
    const std = [0.229, 0.224, 0.225];
    const floatData = new Float32Array(3 * height * width);

    const data = imageData.data;
    const channelSize = height * width;

    for (let h = 0; h < height; h++) {
      for (let w = 0; w < width; w++) {
        const srcIdx = (h * width + w) * 4;
        const dstIdx = h * width + w;

        // R, G, B
        const r = (data[srcIdx] / 255.0 - mean[0]) / std[0];
        const g = (data[srcIdx + 1] / 255.0 - mean[1]) / std[1];
        const b = (data[srcIdx + 2] / 255.0 - mean[2]) / std[2];

        floatData[dstIdx] = r;
        floatData[dstIdx + channelSize] = g;
        floatData[dstIdx + channelSize * 2] = b;
      }
    }

    return new ort.Tensor('float32', floatData, [1, 3, height, width]);
  }

  /**
   * Converts cropped ImageData to Rec tensor: [1, 3, targetH, targetW]
   * Normalization: (v / 255.0 - 0.5) / 0.5
   */
  public static imageToRecTensor(
    imageData: ImageData,
    targetW: number,
    targetH: number
  ): ort.Tensor {
    const floatData = new Float32Array(3 * targetH * targetW);
    const data = imageData.data;
    const channelSize = targetH * targetW;

    for (let h = 0; h < targetH; h++) {
      for (let w = 0; w < targetW; w++) {
        const srcIdx = (h * targetW + w) * 4;
        const dstIdx = h * targetW + w;

        const r = (data[srcIdx] / 255.0 - 0.5) / 0.5;
        const g = (data[srcIdx + 1] / 255.0 - 0.5) / 0.5;
        const b = (data[srcIdx + 2] / 255.0 - 0.5) / 0.5;

        floatData[dstIdx] = r;
        floatData[dstIdx + channelSize] = g;
        floatData[dstIdx + channelSize * 2] = b;
      }
    }

    return new ort.Tensor('float32', floatData, [1, 3, targetH, targetW]);
  }

  /**
   * Clamps box coordinates to stay inside the image boundaries
   */
  public static clampBox(box: BoundingBox, maxW: number, maxH: number): BoundingBox {
    const x = Math.max(0, Math.min(box.x, maxW - 1));
    const y = Math.max(0, Math.min(box.y, maxH - 1));
    const width = Math.max(1, Math.min(box.width, maxW - x));
    const height = Math.max(1, Math.min(box.height, maxH - y));
    return { x, y, width, height, confidence: box.confidence };
  }
}
