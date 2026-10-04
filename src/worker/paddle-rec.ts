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
    // In PaddleOCR CTC models, the last class index represents SPACE (' ')
    if (this.characters.length > 0) {
      this.characters[this.characters.length - 1] = ' ';
    }
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
      // 1. Add slight padding to prevent edge characters from being clipped
      const padX = 2;
      const padY = 1;
      const srcX = Math.max(0, box.x - padX);
      const srcY = Math.max(0, box.y - padY);
      const srcW = Math.max(1, Math.min(sourceCanvas.width - srcX, box.width + padX * 2));
      const srcH = Math.max(1, Math.min(sourceCanvas.height - srcY, box.height + padY * 2));

      // 2. Calculate target width preserving ratio (up to 960px for full lines)
      const ratio = srcW / srcH;
      let targetW = Math.max(32, Math.min(960, Math.round(this.targetH * ratio)));
      targetW = Math.round(targetW / 8) * 8; // round to multiple of 8

      // 3. Crop and resize to targetH x targetW
      const cropCanvas = new OffscreenCanvas(targetW, this.targetH);
      const cropCtx = cropCanvas.getContext('2d');
      if (!cropCtx) continue;

      cropCtx.drawImage(
        sourceCanvas,
        srcX,
        srcY,
        srcW,
        srcH,
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

        const cleanText = text.replace(/\s+/g, ' ').trim();
        // Ignore noise, empty text, or non-alphanumeric graphic artifacts (e.g. "--", "..", "|")
        const hasLetterOrDigit = /[\p{L}\p{N}]/u.test(cleanText);
        if (cleanText.length > 0 && hasLetterOrDigit && confidence > 0.35) {
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
   * Fast background luminance check sampling the outer perimeter of the text box
   * where text characters do not reside.
   * Returns true if the background is dark (e.g. black speech balloon in manhwa/manga).
   */
  private detectDarkBackground(imageData: ImageData): boolean {
    const data = imageData.data;
    const w = imageData.width;
    const h = imageData.height;
    if (w <= 0 || h <= 0) return false;

    let edgeLuma = 0;
    let samples = 0;

    // Sample top and bottom margin rows
    for (let x = 0; x < w; x += 3) {
      const idxTop = (0 * w + x) * 4;
      edgeLuma += 0.299 * data[idxTop] + 0.587 * data[idxTop + 1] + 0.114 * data[idxTop + 2];
      const idxBot = ((h - 1) * w + x) * 4;
      edgeLuma += 0.299 * data[idxBot] + 0.587 * data[idxBot + 1] + 0.114 * data[idxBot + 2];
      samples += 2;
    }

    // Sample left and right margin columns
    for (let y = 1; y < h - 1; y += 2) {
      const idxLeft = (y * w + 0) * 4;
      edgeLuma += 0.299 * data[idxLeft] + 0.587 * data[idxLeft + 1] + 0.114 * data[idxLeft + 2];
      const idxRight = (y * w + (w - 1)) * 4;
      edgeLuma += 0.299 * data[idxRight] + 0.587 * data[idxRight + 1] + 0.114 * data[idxRight + 2];
      samples += 2;
    }

    const avgLuma = samples > 0 ? edgeLuma / samples : 255;
    return avgLuma < 105;
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
