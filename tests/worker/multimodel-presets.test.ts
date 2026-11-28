import { describe, expect, it, vi } from 'vitest';
import { OCR_MODEL_PRESETS } from '../../src/shared/presets';
import { PaddleDetEngine } from '../../src/worker/paddle-det';
import { PaddleRecEngine, parseCtcDictionary } from '../../src/worker/paddle-rec';

function makeLogits(tokens: number[], numClasses: number, prob = 0.96): Float32Array {
  const data = new Float32Array(tokens.length * numClasses).fill(0.001);
  tokens.forEach((cls, t) => {
    data[t * numClasses + cls] = prob;
  });
  return data;
}

describe('Multimodel OCR Presets: Dictionary & CTC Decoding Contracts', () => {
  it('defines all 4 OCR presets with valid ONNX & dictionary URLs', () => {
    expect(OCR_MODEL_PRESETS.map((p) => p.id)).toEqual([
      'comic-manga-manhwa',
      'comic-manga-cjk',
      'ppocr-v6-multilingual',
      'ppocr-v5-english-fast'
    ]);
    for (const preset of OCR_MODEL_PRESETS) {
      expect(preset.files.detUrl).toMatch(/\.onnx$/);
      expect(preset.files.recUrl).toMatch(/\.onnx$/);
      expect(preset.files.keysUrl).toMatch(/\.txt$/);
    }
  });

  it('comic-manga-manhwa (en_PP-OCRv4_rec): 95-char dict + blank(0) + trailing space(96) => 97 classes', () => {
    const baseChars = Array.from({ length: 94 }, (_, i) => String.fromCharCode(33 + i));
    const dictText = [...baseChars, ' '].join('\n') + '\n';
    const parsed = parseCtcDictionary(dictText);
    expect(parsed).toHaveLength(95);
    expect(parsed[0]).toBe('!');
    expect(parsed[94]).toBe(' ');

    const eng = new PaddleRecEngine({ inputNames: ['x'], outputNames: ['softmax_2.tmp_0'] } as any, dictText);
    const numClasses = 97;
    // Class 0=blank, 1='!', 'H'=72-33+1=40, 'I'=41, 96=use_space_char trailing space
    const tokens = [0, 40, 40, 0, 41, 96, 1, 0];
    const decoded = eng.ctcDecode(makeLogits(tokens, numClasses, 0.94), [1, tokens.length, numClasses]);
    expect(decoded.text).toBe('HI !');
    expect(decoded.confidence).toBeCloseTo(0.94, 4);
  });

  it('comic-manga-cjk (ch_PP-OCRv4_rec): appends space at end for C = dictLen + 2 (blank + chars + space)', () => {
    const dictChars = ["'", 'H', 'E', 'L', 'O', '1', '2', '你', '好'];
    const dictText = dictChars.join('\n'); // No trailing newline, no space char
    const parsed = parseCtcDictionary(dictText);
    expect(parsed).toEqual([...dictChars, ' ']);

    const eng = new PaddleRecEngine(
      { inputNames: ['x'], outputNames: ['softmax_11.tmp_0'] } as any,
      dictText,
      { isCjkModel: true }
    );
    const numClasses = parsed.length + 1; // 11 (0=blank, 1..9=chars, 10=' ')
    const tokens = [8, 9, 10, 2, 3, 4, 0, 4, 5, 10, 6, 7];
    const decoded = eng.ctcDecode(makeLogits(tokens, numClasses, 0.98), [1, tokens.length, numClasses]);
    expect(decoded.text).toBe('你好 HELLO 12');
    expect(decoded.confidence).toBeCloseTo(0.98, 4);
  });

  it('ppocr-v6-multilingual (ppocrv6_dict): shifts leading blank line so class 1="!", space=C-1', () => {
    // Mirrors ppocrv6_dict.txt layout: line 0 is '', line 1 is '!', ..., trailing newline
    const dictChars = ['!', '"', '0', '1', 'H', 'I', '日', '本', 'テ', 'ス', 'ト'];
    const dictText = '\n' + dictChars.join('\n') + '\n';
    const parsed = parseCtcDictionary(dictText);
    expect(parsed).toEqual([...dictChars, ' ']);
    expect(parsed[0]).toBe('!');

    const eng = new PaddleRecEngine(
      { inputNames: ['x'], outputNames: ['fetch_name_0'] } as any,
      dictText,
      { isCjkModel: true }
    );
    const numClasses = parsed.length + 1; // blank(0) + 11 chars + space(12) = 13
    const tokens = [5, 6, 12, 7, 8, 9, 10, 11, 1];
    const decoded = eng.ctcDecode(makeLogits(tokens, numClasses, 0.99), [1, tokens.length, numClasses]);
    expect(decoded.text).toBe('HI 日本テスト!');
  });

  it('ppocr-v5-english-fast (ppocrv5_en_dict): shifts leading blank line & strips BOM so class 1="0"', () => {
    // Mirrors ppocrv5_en_dict.txt layout: optional BOM + leading '', line 1='0', trailing newline
    const dictChars = ['0', '1', 'A', 'B', 'C', '☺'];
    const dictText = '\uFEFF\n' + dictChars.join('\n') + '\n';
    const parsed = parseCtcDictionary(dictText);
    expect(parsed).toEqual([...dictChars, ' ']);
    expect(parsed[0]).toBe('0');

    const eng = new PaddleRecEngine(
      { inputNames: ['x'], outputNames: ['fetch_name_0'] } as any,
      dictText,
      { isCjkModel: false }
    );
    const numClasses = parsed.length + 1; // blank(0) + 6 chars + space(7) = 8
    const tokens = [3, 4, 5, 7, 1, 2, 6];
    const decoded = eng.ctcDecode(makeLogits(tokens, numClasses, 0.97), [1, tokens.length, numClasses]);
    expect(decoded.text).toBe('ABC 01☺');
  });

  it('tightens unclipped PaddleDetEngine 20-27px boxes vertically when ink occupies < 78% height', async () => {
    const origOffscreen = (globalThis as any).OffscreenCanvas;
    const origImageData = (globalThis as any).ImageData;
    const w = 120;
    const h = 40;
    // 23px box at y=8..31 containing 14px tall dark glyph strokes at y=12..25 (4px empty margins top & bottom)
    const page = new Uint8ClampedArray(w * h * 4).fill(255);
    for (let y = 12; y <= 25; y++) {
      for (const x of [22, 23, 40, 41, 60, 61, 80, 81]) {
        const p = (y * w + x) * 4;
        page[p] = 10;
        page[p + 1] = 10;
        page[p + 2] = 10;
      }
    }

    let seenTensorH = 0;
    let seenTensorW = 0;
    const drawHeights: number[] = [];

    (globalThis as any).ImageData = class {
      constructor(public data: Uint8ClampedArray, public width: number, public height: number) {}
    };
    (globalThis as any).OffscreenCanvas = class {
      constructor(public width: number, public height: number) {}
      getContext() {
        const selfW = this.width;
        const selfH = this.height;
        return {
          drawImage: (_src: any, _sx: number, _sy: number, sw: number, sh: number, _dx: number, _dy: number, dw: number, dh: number) => {
            if (dh === 48) {
              seenTensorH = sh;
              seenTensorW = dw;
              drawHeights.push(sh);
            }
          },
          putImageData: () => {},
          getImageData: (gx: number, gy: number, gw: number, gh: number) => {
            const out = new Uint8ClampedArray(gw * gh * 4).fill(255);
            if (selfW === w && selfH === h) {
              for (let y = 0; y < gh; y++) {
                for (let x = 0; x < gw; x++) {
                  const sp = ((gy + y) * w + (gx + x)) * 4;
                  const dp = (y * gw + x) * 4;
                  out[dp] = page[sp];
                  out[dp + 1] = page[sp + 1];
                  out[dp + 2] = page[sp + 2];
                }
              }
            }
            return { data: out, width: gw, height: gh };
          }
        };
      }
    };

    try {
      const numClasses = 4; // blank=0, A=1, B=2, ' '=3
      const session: any = {
        inputNames: ['x'],
        outputNames: ['fetch_name_0'],
        run: vi.fn(async () => ({
          fetch_name_0: { data: makeLogits([1, 2], numClasses, 0.95), dims: [1, 2, numClasses], dispose: () => {} }
        })),
        release: vi.fn(async () => {})
      };
      const eng = new PaddleRecEngine(session, '\nA\nB\n');
      const items = await eng.recognizeBoxes(
        new (globalThis as any).OffscreenCanvas(w, h),
        [{ x: 15, y: 8, width: 88, height: 23 }]
      );
      expect(items).toHaveLength(1);
      expect(items[0].originalText).toBe('AB');
      // Tightened inkH=14 + padY(4)*2 = 22px (instead of untightened 23 + 6*2 = 35px)
      expect(seenTensorH).toBe(22);
      expect(seenTensorW).toBeGreaterThan(0);
      expect(drawHeights).toEqual([22]);
    } finally {
      (globalThis as any).OffscreenCanvas = origOffscreen;
      (globalThis as any).ImageData = origImageData;
    }
  });

  it('PaddleDetEngine handles both ch_PP-OCRv4_det and PP-OCRv5_mobile_det output tensor names', async () => {
    const origOffscreen = (globalThis as any).OffscreenCanvas;
    (globalThis as any).OffscreenCanvas = class {
      constructor(public width: number, public height: number) {}
      getContext() {
        return {
          drawImage: () => {},
          getImageData: (_x: number, _y: number, gw: number, gh: number) => ({
            data: new Uint8ClampedArray(gw * gh * 4).fill(255),
            width: gw,
            height: gh
          })
        };
      }
    };

    try {
      for (const outName of ['sigmoid_0.tmp_0', 'fetch_name_0']) {
        const w = 160;
        const h = 96;
        const prob = new Float32Array(w * h).fill(0);
        // Two adjacent word blobs on the same line (gap = 6px <= 0.85 * height)
        for (let y = 30; y < 44; y++) {
          for (let x = 20; x < 60; x++) prob[y * w + x] = 0.92;
          for (let x = 66; x < 110; x++) prob[y * w + x] = 0.92;
        }
        const sess: any = {
          inputNames: ['x'],
          outputNames: [outName],
          run: vi.fn(async () => ({ [outName]: { data: prob, dims: [1, 1, h, w], dispose: () => {} } })),
          release: vi.fn(async () => {})
        };
        const det = new PaddleDetEngine(sess);
        const boxes = await det.detectText(new (globalThis as any).OffscreenCanvas(w, h), w, h);
        expect(boxes).toHaveLength(1);
        expect(boxes[0].x).toBeLessThanOrEqual(20);
        expect(boxes[0].x + boxes[0].width).toBeGreaterThanOrEqual(110);
      }
    } finally {
      (globalThis as any).OffscreenCanvas = origOffscreen;
    }
  });
});
