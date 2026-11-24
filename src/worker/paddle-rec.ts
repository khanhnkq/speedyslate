import * as ort from 'onnxruntime-web';
import { BoundingBox, DialogueItem } from '../shared/types';
import { ImageUtils } from './image-utils';
import { ColorSampler } from './color-sampler';
import { VerticalText } from './vertical-text';
import { RecBatcher } from './rec-batcher';

interface PreparedCrop {
  index: number;
  box: BoundingBox;
  imageData: ImageData;
  targetW: number;
  inverted: boolean;
  isDark: boolean;
  bgColor: string;
  isVertical: boolean;
  text: string;
  confidence: number;
  decoded: boolean;
}

export class PaddleRecEngine {
  private session: ort.InferenceSession;
  private characters: string[];
  private targetH: number = 48; // PP-OCRv4 standard height
  private isCjkModel: boolean;
  private batchSupported: boolean = true;

  constructor(
    session: ort.InferenceSession,
    keysText: string,
    opts?: { isCjkModel?: boolean }
  ) {
    this.session = session;
    this.isCjkModel = opts?.isCjkModel ?? false;
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
    const ctx = sourceCanvas.getContext('2d');
    if (!ctx) return [];

    const prepared: PreparedCrop[] = [];
    for (let i = 0; i < boxes.length; i++) {
      const crop = this.prepareCrop(sourceCanvas, boxes[i], i);
      if (crop) prepared.push(crop);
    }

    const inputName = this.session.inputNames[0] || 'x';
    if (this.batchSupported) {
      try {
        await this.runBatched(prepared, inputName);
      } catch (err) {
        this.batchSupported = false;
        console.warn('[SpeedySlate] Rec batch inference unsupported, using sequential path:', err);
      }
    }
    if (!this.batchSupported) {
      await this.runSequential(prepared, inputName);
    }
    await this.retryLowConfidence(prepared, inputName);

    const results: DialogueItem[] = [];
    for (const crop of prepared) {
      if (!crop.decoded) continue;
      const cleanText = crop.text.replace(/\s+/g, ' ').trim();
      // Ignore noise, empty text, or non-alphanumeric graphic artifacts (e.g. "--", "..", "|")
      const hasLetterOrDigit = /[\p{L}\p{N}]/u.test(cleanText);
      // 1-2 char results are overwhelmingly artifacts (hearts→"4", art edges→"R"/"8");
      // real short words ("YES", "ahh") decode well above 0.65
      const suspiciousShort = cleanText.length <= 2 && crop.confidence < 0.65;
      if (cleanText.length > 0 && hasLetterOrDigit && !suspiciousShort && crop.confidence > 0.28) {
        results.push({
          id: `bubble-${Date.now()}-${crop.index}`,
          box: crop.box,
          originalText: cleanText,
          isDarkBackground: crop.isDark,
          confidence: crop.confidence,
          bgColor: crop.bgColor,
          kind: crop.box.kind ?? 'dialogue',
          ...(crop.isVertical ? { isVertical: true } : {})
        });
      }
    }

    return results;
  }

  /**
   * Crops a box to targetH height (rotating vertical CJK columns first),
   * samples its ring background and pre-inverts flat dark crops.
   */
  private prepareCrop(
    sourceCanvas: OffscreenCanvas,
    box: BoundingBox,
    index: number
  ): PreparedCrop | null {
    // 1. Add padding: extra horizontal room preserves inter-word spacing
    const padX = 5;
    const padY = 2;
    const srcX = Math.max(0, box.x - padX);
    const srcY = Math.max(0, box.y - padY);
    const srcW = Math.max(1, Math.min(sourceCanvas.width - srcX, box.width + padX * 2));
    const srcH = Math.max(1, Math.min(sourceCanvas.height - srcY, box.height + padY * 2));

    // 2. Build the native-res crop and clean it: Otsu-separate the minority
    // (text) class, then repaint all background pixels with their mean color
    // so screentone/art noise never reaches the rec model.
    const nativeCanvas = new OffscreenCanvas(srcW, srcH);
    const nativeCtx = nativeCanvas.getContext('2d');
    if (!nativeCtx) return null;
    nativeCtx.drawImage(sourceCanvas, srcX, srcY, srcW, srcH, 0, 0, srcW, srcH);
    const nativeData = nativeCtx.getImageData(0, 0, srcW, srcH);
    if (srcW >= 16 && srcH >= 12) {
      PaddleRecEngine.cleanCropToMask(nativeData);
      nativeCtx.putImageData(nativeData, 0, 0);
    }

    // 3. Vertical CJK columns are rotated CCW so the rec model reads them left-to-right
    const isVertical = VerticalText.isVerticalCandidate(box, this.isCjkModel);
    let cropW = srcW;
    let cropH = srcH;
    let rotatedCanvas: OffscreenCanvas | null = null;
    if (isVertical) {
      const rotated = VerticalText.rotateCropCCW(nativeData);
      rotatedCanvas = new OffscreenCanvas(rotated.width, rotated.height);
      const rotCtx = rotatedCanvas.getContext('2d');
      if (!rotCtx) return null;
      const rotData = new Uint8ClampedArray(rotated.data);
      rotCtx.putImageData(new ImageData(rotData, rotated.width, rotated.height), 0, 0);
      cropW = rotated.width;
      cropH = rotated.height;
    }

    // 3. Calculate target width preserving ratio (up to 960px for full lines)
    const ratio = cropW / cropH;
    let targetW = Math.max(32, Math.min(960, Math.round(this.targetH * ratio)));
    targetW = Math.round(targetW / 8) * 8; // round to multiple of 8

    // 4. Crop and resize to targetH x targetW
    const cropCanvas = new OffscreenCanvas(targetW, this.targetH);
    const cropCtx = cropCanvas.getContext('2d');
    if (!cropCtx) return null;

    if (rotatedCanvas) {
      cropCtx.drawImage(rotatedCanvas, 0, 0, cropW, cropH, 0, 0, targetW, this.targetH);
    } else {
      cropCtx.drawImage(nativeCanvas, 0, 0, srcW, srcH, 0, 0, targetW, this.targetH);
    }

    const imageData = cropCtx.getImageData(0, 0, targetW, this.targetH);

    // 5. Sample ring background; dark crops always start inverted — the
    // low-confidence retry path picks the better variant if wrong.
    const sample = ColorSampler.analyzeRegion(imageData);
    const inverted = sample.isDark;
    if (inverted) PaddleRecEngine.invertRgb(imageData.data);

    return {
      index,
      box,
      imageData,
      targetW,
      inverted,
      isDark: sample.isDark,
      bgColor: sample.bgHex,
      isVertical,
      text: '',
      confidence: 0,
      decoded: false
    };
  }

  /**
   * Runs one session.run per bucket group of up to MAX_BATCH crops.
   * A batch-incompatible model throws here once and the caller falls back.
   */
  private async runBatched(prepared: PreparedCrop[], inputName: string): Promise<void> {
    const groups = RecBatcher.assignBuckets(prepared.map((c) => c.targetW));
    for (const [bucketW, indices] of groups) {
      for (let s = 0; s < indices.length; s += RecBatcher.MAX_BATCH) {
        const batch = indices.slice(s, s + RecBatcher.MAX_BATCH).map((i) => prepared[i]);
        const tensor = ImageUtils.imageToRecTensorBatch(
          batch.map((c) => c.imageData),
          bucketW,
          this.targetH
        );
        const output = await this.session.run({ [inputName]: tensor });
        const outputTensor = output[this.session.outputNames[0]];
        const dims = outputTensor.dims;
        if (dims.length !== 3) {
          throw new Error(`Unexpected rec output dims: ${dims.join('x')}`);
        }
        const seqLen = dims[1];
        const numClasses = dims[2];
        const rowLen = seqLen * numClasses;
        const data = outputTensor.data as Float32Array;
        for (let r = 0; r < batch.length; r++) {
          const row = data.subarray(r * rowLen, (r + 1) * rowLen);
          const res = this.ctcDecode(row, [1, seqLen, numClasses]);
          batch[r].text = res.text;
          batch[r].confidence = res.confidence;
          batch[r].decoded = true;
        }
      }
    }
  }

  /**
   * Sequential fallback for models without a dynamic batch dimension.
   */
  private async runSequential(prepared: PreparedCrop[], inputName: string): Promise<void> {
    for (const crop of prepared) {
      if (crop.decoded) continue;
      try {
        const res = await this.runSingle(crop, inputName);
        crop.text = res.text;
        crop.confidence = res.confidence;
        crop.decoded = true;
      } catch (err) {
        console.warn('[SpeedySlate] Rec inference error for box:', err);
      }
    }
  }

  private async runSingle(
    crop: PreparedCrop,
    inputName: string
  ): Promise<{ text: string; confidence: number }> {
    const tensor = ImageUtils.imageToRecTensor(crop.imageData, crop.targetW, this.targetH);
    const output = await this.session.run({ [inputName]: tensor });
    const outputTensor = output[this.session.outputNames[0]];
    return this.ctcDecode(outputTensor.data as Float32Array, outputTensor.dims);
  }

  /**
   * Re-runs low-confidence crops once with the opposite invert variant and
   * keeps whichever decode scores higher.
   */
  private async retryLowConfidence(prepared: PreparedCrop[], inputName: string): Promise<void> {
    for (const crop of prepared) {
      if (!crop.decoded || crop.confidence >= 0.45) continue;
      const altData = new ImageData(
        new Uint8ClampedArray(crop.imageData.data),
        crop.imageData.width,
        crop.imageData.height
      );
      PaddleRecEngine.invertRgb(altData.data);
      try {
        const res = await this.runSingle({ ...crop, imageData: altData }, inputName);
        if (res.confidence > crop.confidence) {
          crop.text = res.text;
          crop.confidence = res.confidence;
          crop.inverted = !crop.inverted;
        }
      } catch (err) {
        console.warn('[SpeedySlate] Rec retry error for box:', err);
      }
    }
  }

  /**
   * Otsu-binarizes a crop and repaints every background pixel with the mean
   * background color. Text strokes (minority class) are kept untouched.
   * Skips degenerate splits (uniform crops, near-balanced art) where the
   * minority-class assumption is unreliable.
   */
  private static cleanCropToMask(img: ImageData): void {
    const data = img.data;
    const total = img.width * img.height;
    const lumas = new Uint8Array(total);
    const hist = new Int32Array(256);
    for (let i = 0; i < total; i++) {
      const p = i * 4;
      const l = (data[p] * 299 + data[p + 1] * 587 + data[p + 2] * 114) / 1000;
      const li = l | 0;
      lumas[i] = li;
      hist[li]++;
    }

    let sumAll = 0;
    for (let t = 0; t < 256; t++) sumAll += t * hist[t];
    let sumB = 0;
    let wB = 0;
    let maxVar = -1;
    let otsuT = 128;
    for (let t = 0; t < 256; t++) {
      wB += hist[t];
      if (wB === 0) continue;
      const wF = total - wB;
      if (wF === 0) break;
      sumB += t * hist[t];
      const mB = sumB / wB;
      const mF = (sumAll - sumB) / wF;
      const v = wB * wF * (mB - mF) * (mB - mF);
      if (v > maxVar) { maxVar = v; otsuT = t; }
    }

    let below = 0;
    for (let t = 0; t <= otsuT; t++) below += hist[t];
    // Degenerate: near-uniform crop or split that cannot be text-vs-background
    if (otsuT < 20 || otsuT > 235) return;
    const minority = Math.min(below, total - below);
    if (minority < total * 0.02 || minority > total * 0.45) return;

    const textIsDark = below <= total / 2;

    // Mean color + luma stddev of the majority (background) class
    let rSum = 0, gSum = 0, bSum = 0, lSum = 0, lSq = 0, bgCount = 0;
    for (let i = 0; i < total; i++) {
      const isText = textIsDark ? lumas[i] <= otsuT : lumas[i] > otsuT;
      if (isText) continue;
      const p = i * 4;
      rSum += data[p]; gSum += data[p + 1]; bSum += data[p + 2];
      lSum += lumas[i]; lSq += lumas[i] * lumas[i];
      bgCount++;
    }
    if (bgCount === 0) return;
    const bgLumaStd = Math.sqrt(Math.max(0, lSq / bgCount - (lSum / bgCount) ** 2));
    // Clean uniform background already: filling would only erase anti-aliasing
    if (bgLumaStd <= 30) return;
    const bgR = rSum / bgCount, bgG = gSum / bgCount, bgB = bSum / bgCount;

    // Text mask with despeckle: a pixel is text only if >=3 of its 8
    // neighbors share the class — removes halftone dots mistaken as glyphs
    const w = img.width, h = img.height;
    const textMask = new Uint8Array(total);
    for (let i = 0; i < total; i++) {
      textMask[i] = (textIsDark ? lumas[i] <= otsuT : lumas[i] > otsuT) ? 1 : 0;
    }
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        if (textMask[i]) {
          let n = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (!dx && !dy) continue;
              const nx = x + dx, ny = y + dy;
              if (nx >= 0 && nx < w && ny >= 0 && ny < h && textMask[ny * w + nx]) n++;
            }
          }
          if (n >= 3) continue; // real stroke pixel -> keep; else repaint as bg
        }
        const p = i * 4;
        data[p] = bgR; data[p + 1] = bgG; data[p + 2] = bgB;
      }
    }
  }

  private static invertRgb(data: Uint8ClampedArray): void {
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i];
      data[i + 1] = 255 - data[i + 1];
      data[i + 2] = 255 - data[i + 2];
    }
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
