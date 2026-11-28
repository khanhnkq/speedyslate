import * as ort from 'onnxruntime-web';
import { BoundingBox, DialogueItem } from '../shared/types';
import { ImageUtils } from './image-utils';
import { ColorSampler } from './color-sampler';
import { VerticalText } from './vertical-text';
import { RecBatcher } from './rec-batcher';
import { PolygonDeskew, Quad4 } from './polygon-deskew';
import { RecCropCleaner } from './rec-crop-cleaner';

interface PreparedCrop {
  index: number;
  box: BoundingBox;
  imageData: ImageData;
  targetW: number;
  inverted: boolean;
  isDark: boolean;
  bgColor: string;
  bgLumaStdDev: number;
  isVertical: boolean;
  text: string;
  confidence: number;
  decoded: boolean;
}

export function parseCtcDictionary(keysText: string): string[] {
  const trimmed = keysText.replace(/(?:\r?\n)+$/, '');
  if (!trimmed) return [' '];
  const chars = trimmed.split(/\r?\n/);
  while (chars.length > 0 && chars[0] === '') {
    chars.shift();
  }
  if (chars.length === 0) return [' '];
  if (chars[chars.length - 1] !== ' ') {
    chars.push(' ');
  }
  return chars;
}

export class PaddleRecEngine {
  private session: ort.InferenceSession;
  private characters: string[];
  private targetH: number = 48; // PP-OCRv4/v5/v6 standard height
  private isCjkModel: boolean;
  private batchSupported: boolean = true;

  constructor(
    session: ort.InferenceSession,
    keysText: string,
    opts?: { isCjkModel?: boolean }
  ) {
    this.session = session;
    this.isCjkModel = opts?.isCjkModel ?? false;
    this.characters = parseCtcDictionary(keysText);
  }

  public async release(): Promise<void> {
    await this.session.release?.();
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
      const crop = this.prepareCrop(sourceCanvas, ctx, boxes[i], i);
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
      // real short words ("YES", "ahh") decode well above 0.65.
      // Textured art/foliage crops require higher confidence (>=0.45) than flat bubbles (>=0.34).
      const suspiciousShort = cleanText.length <= 2 && crop.confidence < 0.65;
      const minConfidence = crop.bgLumaStdDev > 20 ? 0.45 : 0.34;
      if (cleanText.length > 0 && hasLetterOrDigit && !suspiciousShort && crop.confidence >= minConfidence) {
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
    sourceCtx: OffscreenCanvasRenderingContext2D,
    box: BoundingBox,
    index: number
  ): PreparedCrop | null {
    const isVertical = VerticalText.isVerticalCandidate(box, this.isCjkModel);
    const willWarp = Boolean(box.quad && box.quad.length === 4 && PolygonDeskew.shouldWarp(box.angleDeg));

    // 1. Tighten horizontal (and excessive vertical) whitespace inside the box
    // so short bottom lines ("HOME.", "HERE.") don't shrink inside wide empty margins.
    let bx = Math.max(0, Math.min(sourceCanvas.width - 1, Math.round(box.x)));
    let by = Math.max(0, Math.min(sourceCanvas.height - 1, Math.round(box.y)));
    let bw0 = Math.max(1, Math.min(sourceCanvas.width - bx, Math.round(box.width)));
    let bh0 = Math.max(1, Math.min(sourceCanvas.height - by, Math.round(box.height)));

    if (!isVertical && !willWarp && bw0 >= 12 && bh0 >= 12) {
      const boxData = sourceCtx.getImageData(bx, by, bw0, bh0);
      const bounds = RecCropCleaner.findInkBounds(boxData);
      if (bounds) {
        const inkW = bounds.maxX - bounds.minX + 1;
        const inkH = bounds.maxY - bounds.minY + 1;
        if (inkW > 6) {
          bx += bounds.minX;
          bw0 = inkW;
        }
        if (inkH > 6 && bh0 >= 28 && inkH < bh0 * 0.65) {
          by += bounds.minY;
          bh0 = inkH;
        }
      }
    }

    // 2. Add crisp padding along and across the reading axis
    let padX = isVertical
      ? Math.max(3, Math.min(6, Math.round(bw0 * 0.2)))
      : Math.max(6, Math.min(12, Math.round(bh0 * 0.35)));
    let padY = isVertical
      ? Math.max(6, Math.min(12, Math.round(bw0 * 0.3)))
      : Math.max(3, Math.min(6, Math.round(bh0 * 0.25)));

    // Vertically clipped lines at page top/bottom need extra unclipped breathing room
    // so short 11-13px slices don't over-stretch and collapse inter-word spaces.
    const clippedTop = by === 0;
    const clippedBottom = by + bh0 >= sourceCanvas.height;
    const extraBottom = clippedTop && !clippedBottom && bh0 < 16 ? Math.max(padY, Math.min(7, 20 - bh0 - Math.min(3, padY))) : padY;
    const extraTop = clippedBottom && !clippedTop && bh0 < 16 ? Math.max(padY, Math.min(7, 20 - bh0 - Math.min(3, padY))) : padY;

    const srcX = Math.max(0, bx - padX);
    const srcY = Math.max(0, by - extraTop);
    const srcW = Math.max(1, Math.min(sourceCanvas.width - srcX, bx + bw0 + padX - srcX));
    const srcH = Math.max(1, Math.min(sourceCanvas.height - srcY, by + bh0 + extraBottom - srcY));

    // 3. Build the native-res crop, extend any page-edge-clipped sides with
    // clamped edge pixels, deskew if tilted, and clean textured backgrounds.
    let nativeCanvas = new OffscreenCanvas(srcW, srcH);
    let nativeCtx = nativeCanvas.getContext('2d');
    if (!nativeCtx) return null;
    nativeCtx.drawImage(sourceCanvas, srcX, srcY, srcW, srcH, 0, 0, srcW, srcH);
    let nativeData = nativeCtx.getImageData(0, 0, srcW, srcH);

    const edgePadL = bx === 0 ? padX : 0;
    const edgePadR = bx + bw0 >= sourceCanvas.width ? padX : 0;
    const edgePadT = clippedTop ? Math.min(3, padY) : 0;
    const edgePadB = clippedBottom ? Math.min(3, padY) : 0;
    if (!willWarp && (edgePadL > 0 || edgePadR > 0 || edgePadT > 0 || edgePadB > 0)) {
      const padded = RecCropCleaner.padClippedImageData(nativeData, edgePadL, edgePadT, edgePadR, edgePadB);
      nativeCanvas = new OffscreenCanvas(padded.width, padded.height);
      nativeCtx = nativeCanvas.getContext('2d');
      if (!nativeCtx) return null;
      nativeData = new ImageData(new Uint8ClampedArray(padded.data), padded.width, padded.height);
      nativeCtx.putImageData(nativeData, 0, 0);
    }

    // Perspective deskew for tilted comic lettering (>= 10 deg)
    if (willWarp && box.quad) {
      const localQuad: Quad4 = box.quad.map(([qx, qy]) => [qx - srcX, qy - srcY]) as Quad4;
      const warped = PolygonDeskew.warpQuadToHorizontal(nativeData, localQuad);
      if (warped) {
        nativeCanvas = new OffscreenCanvas(warped.width, warped.height);
        nativeCtx = nativeCanvas.getContext('2d');
        if (!nativeCtx) return null;
        nativeData = new ImageData(new Uint8ClampedArray(warped.data), warped.width, warped.height);
        nativeCtx.putImageData(nativeData, 0, 0);
      }
    }

    const rawBgLumaStdDev = RecCropCleaner.measureBgLumaStd(nativeData);
    if (nativeData.width >= 16 && nativeData.height >= 12) {
      if (!willWarp) {
        RecCropCleaner.maskBorderWallsInPadding(
          nativeData,
          edgePadL > 0 ? edgePadL : bx - srcX,
          edgePadR > 0 ? edgePadR : srcX + srcW - (bx + bw0)
        );
      }
      RecCropCleaner.cleanCropToMask(nativeData);
      nativeCtx.putImageData(nativeData, 0, 0);
    }

    // 4. Vertical CJK columns are rotated CCW so the rec model reads them left-to-right
    let cropW = nativeData.width;
    let cropH = nativeData.height;
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
      cropCtx.drawImage(nativeCanvas, 0, 0, cropW, cropH, 0, 0, targetW, this.targetH);
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
      bgLumaStdDev: Math.max(rawBgLumaStdDev, sample.lumaStdDev),
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
        let output: Record<string, ort.Tensor> | null = null;
        try {
          output = await this.session.run({ [inputName]: tensor });
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
        } finally {
          tensor.dispose?.();
          if (output) {
            for (const out of Object.values(output)) out.dispose?.();
          }
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
    let output: Record<string, ort.Tensor> | null = null;
    try {
      output = await this.session.run({ [inputName]: tensor });
      const outputTensor = output[this.session.outputNames[0]];
      return this.ctcDecode(outputTensor.data as Float32Array, outputTensor.dims);
    } finally {
      tensor.dispose?.();
      if (output) {
        for (const out of Object.values(output)) out.dispose?.();
      }
    }
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

  private static invertRgb(data: Uint8ClampedArray): void {
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i];
      data[i + 1] = 255 - data[i + 1];
      data[i + 2] = 255 - data[i + 2];
    }
  }

  /**
   * CTC Greedy Decoder for PaddleOCR
   * Tensor shape: [1, sequence_length, num_classes]
   */
  public ctcDecode(
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
      // en_PP-OCRv4_rec (use_space_char=True) appends a trailing space token at charIdx === characters.length.
      if (maxIdx !== 0 && maxIdx !== lastIndex) {
        const charIdx = maxIdx - 1;
        if (charIdx < this.characters.length) {
          decodedChars.push(this.characters[charIdx]);
          totalScore += maxProb;
          validCharCount++;
        } else if (charIdx === this.characters.length && numClasses === this.characters.length + 2) {
          decodedChars.push(' ');
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
