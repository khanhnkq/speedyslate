import * as ort from 'onnxruntime-web';
import { BoundingBox, DialogueItem } from '../shared/types';
import { ImageUtils } from './image-utils';

export class PaddleRecEngine {
  private session: ort.InferenceSession;
  private characters: string[];
  private targetH: number = 48; // PP-OCRv4 standard height

  constructor(session: ort.InferenceSession, keysText: string) {
    this.session = session;
    // Split keysText by line, preserving character order
    this.characters = keysText.split(/\r?\n/);
  }

  /**
   * Recognizes text for each bounding box on the original canvas
   */
  public async recognizeBoxes(
    sourceCanvas: OffscreenCanvas,
    boxes: BoundingBox[]
  ): Promise<DialogueItem[]> {
    const results: DialogueItem[] = [];
    const ctx = sourceCanvas.getContext('2d');
    if (!ctx) return [];

    let counter = 0;
    for (const box of boxes) {
      counter++;
      const cropW = Math.max(1, Math.round(box.width));
      const cropH = Math.max(1, Math.round(box.height));

      // 1. Calculate target width preserving ratio
      const ratio = cropW / cropH;
      let targetW = Math.max(32, Math.min(480, Math.round(this.targetH * ratio)));
      targetW = Math.round(targetW / 8) * 8; // round to multiple of 8

      // 2. Crop and resize to targetH x targetW
      const cropCanvas = new OffscreenCanvas(targetW, this.targetH);
      const cropCtx = cropCanvas.getContext('2d');
      if (!cropCtx) continue;

      cropCtx.drawImage(
        sourceCanvas,
        box.x,
        box.y,
        cropW,
        cropH,
        0,
        0,
        targetW,
        this.targetH
      );

      const imageData = cropCtx.getImageData(0, 0, targetW, this.targetH);

      // Check if background is dark or light
      const isDark = this.detectDarkBackground(imageData);

      // 3. Build tensor
      const tensor = ImageUtils.imageToRecTensor(imageData, targetW, this.targetH);

      // 4. Inference
      const inputName = this.session.inputNames[0] || 'x';
      const feeds: Record<string, ort.Tensor> = { [inputName]: tensor };

      try {
        const output = await this.session.run(feeds);
        const outputName = this.session.outputNames[0];
        const outputTensor = output[outputName];

        const { text, confidence } = this.ctcDecode(
          outputTensor.data as Float32Array,
          outputTensor.dims
        );

        const cleanText = text.trim();
        // Ignore single noisy punctuation or meaningless 1-char symbols
        if (cleanText.length > 0 && confidence > 0.4) {
          results.push({
            id: `bubble-${Date.now()}-${counter}`,
            box,
            originalText: cleanText,
            isDarkBackground: isDark
          });
        }
      } catch (err) {
        console.warn('[SpeedySlate] Rec inference error for box:', err);
      }
    }

    return results;
  }

  /**
   * Fast brightness calculation on sampled pixels
   * Returns true if background is predominantly dark
   */
  private detectDarkBackground(imageData: ImageData): boolean {
    const data = imageData.data;
    let totalLuma = 0;

    // Sample every 4th pixel for speed
    let samples = 0;
    for (let i = 0; i < data.length; i += 16) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      // ITU-R BT.601 luminance
      totalLuma += 0.299 * r + 0.587 * g + 0.114 * b;
      samples++;
    }

    const avgLuma = samples > 0 ? totalLuma / samples : 255;
    return avgLuma < 110;
  }

  /**
   * CTC Greedy Decoder for PaddleOCR
   * Tensor shape: [1, sequence_length, num_classes] or [1, num_classes, sequence_length]
   */
  private ctcDecode(
    data: Float32Array,
    dims: readonly number[]
  ): { text: string; confidence: number } {
    let seqLen = 0;
    let numClasses = 0;

    if (dims.length === 3) {
      seqLen = dims[1];
      numClasses = dims[2];
    } else {
      return { text: '', confidence: 0 };
    }

    let decodedChars: string[] = [];
    let lastIndex = -1;
    let totalScore = 0;
    let validCharCount = 0;

    for (let t = 0; t < seqLen; t++) {
      let maxProb = -Infinity;
      let maxIdx = 0;

      const offset = t * numClasses;
      for (let c = 0; c < numClasses; c++) {
        const val = data[offset + c];
        if (val > maxProb) {
          maxProb = val;
          maxIdx = c;
        }
      }

      // In PaddleOCR: index 0 is blank!
      if (maxIdx !== 0 && maxIdx !== lastIndex) {
        const charIdx = maxIdx - 1;
        if (charIdx < this.characters.length) {
          decodedChars.push(this.characters[charIdx]);
          totalScore += maxProb;
          validCharCount++;
        }
      }

      lastIndex = maxIdx;
    }

    const avgConfidence = validCharCount > 0 ? totalScore / validCharCount : 0;
    return {
      text: decodedChars.join(''),
      confidence: avgConfidence
    };
  }
}
