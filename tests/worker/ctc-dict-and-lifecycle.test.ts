import { describe, expect, it, vi } from 'vitest';
import { parseCtcDictionary, PaddleRecEngine } from '../../src/worker/paddle-rec';
import { RecCropCleaner } from '../../src/worker/rec-crop-cleaner';
import { PaddleDetEngine } from '../../src/worker/paddle-det';
import { ComicDetEngine } from '../../src/worker/comic-det';

describe('parseCtcDictionary', () => {
  it('preserves last character and appends space when dict has no trailing newline', () => {
    expect(parseCtcDictionary('a\nb\nc')).toEqual(['a', 'b', 'c', ' ']);
  });

  it('strips trailing newlines and appends space exactly once', () => {
    expect(parseCtcDictionary('a\nb\nc\r\n')).toEqual(['a', 'b', 'c', ' ']);
    expect(parseCtcDictionary('a\nb\nc\n\n')).toEqual(['a', 'b', 'c', ' ']);
  });

  it('does not duplicate space if dictionary already ends with space', () => {
    expect(parseCtcDictionary('a\nb\n ')).toEqual(['a', 'b', ' ']);
  });

  it('strips pre-prepended leading blank line from ppu-paddle-ocr-models v5/v6 dicts to prevent -1 char shift', () => {
    expect(parseCtcDictionary('\n0\n1\n2\n')).toEqual(['0', '1', '2', ' ']);
    expect(parseCtcDictionary('\r\n!\n"\n')).toEqual(['!', '"', ' ']);
  });
});

describe('ONNX Tensor disposal & session release', () => {
  it('releases sessions cleanly across PaddleDetEngine, ComicDetEngine, and PaddleRecEngine', async () => {
    const mkSession = () => ({
      inputNames: ['x'],
      outputNames: ['out'],
      run: vi.fn(),
      release: vi.fn(async () => {})
    });
    const s1 = mkSession(), s2 = mkSession(), s3 = mkSession();
    await new PaddleDetEngine(s1 as any).release();
    await new ComicDetEngine(s2 as any).release();
    await new PaddleRecEngine(s3 as any, 'a\nb').release();

    expect(s1.release).toHaveBeenCalledOnce();
    expect(s2.release).toHaveBeenCalledOnce();
    expect(s3.release).toHaveBeenCalledOnce();
  });

  it('clones probMap data before disposing output tensor in PaddleDetEngine.detectText', async () => {
    const origOffscreen = (globalThis as any).OffscreenCanvas;
    (globalThis as any).OffscreenCanvas = class {
      constructor(public width: number, public height: number) {}
      getContext() {
        return {
          drawImage: () => {},
          getImageData: (_x: number, _y: number, w: number, h: number) => ({
            data: new Uint8ClampedArray(w * h * 4),
            width: w,
            height: h
          })
        };
      }
    };

    try {
      const raw = new Float32Array(960 * 960).fill(0.75);
      const disposeOut = vi.fn(() => raw.fill(0));
      const fakeSession: any = {
        inputNames: ['x'],
        outputNames: ['out'],
        run: vi.fn(async () => ({ out: { data: raw, dispose: disposeOut } })),
        release: vi.fn(async () => {})
      };
      const eng = new PaddleDetEngine(fakeSession);
      await eng.detectText(new (globalThis as any).OffscreenCanvas(800, 800), 800, 800);

      expect(disposeOut).toHaveBeenCalledOnce();
      expect(eng.lastProbMap?.data[0]).toBeCloseTo(0.75, 5);
    } finally {
      (globalThis as any).OffscreenCanvas = origOffscreen;
    }
  });

  it('keeps text lines separated across screentone background (prob ~0.18) using standard DBNet thresh 0.30', async () => {
    const origOffscreen = (globalThis as any).OffscreenCanvas;
    (globalThis as any).OffscreenCanvas = class {
      constructor(public width: number, public height: number) {}
      getContext() {
        return {
          drawImage: () => {},
          getImageData: (_x: number, _y: number, w: number, h: number) => ({
            data: new Uint8ClampedArray(w * h * 4),
            width: w,
            height: h
          })
        };
      }
    };

    try {
      const w = 128, h = 128;
      const prob = new Float32Array(w * h).fill(0.15); // screentone background noise (< 0.20 thresh)
      for (let y = 20; y < 32; y++) for (let x = 20; x < 90; x++) prob[y * w + x] = 0.88;
      for (let y = 70; y < 82; y++) for (let x = 20; x < 90; x++) prob[y * w + x] = 0.88;

      const fakeSession: any = {
        inputNames: ['x'],
        outputNames: ['out'],
        run: vi.fn(async () => ({ out: { data: prob, dispose: () => {} } })),
        release: vi.fn(async () => {})
      };
      const eng = new PaddleDetEngine(fakeSession);
      const boxes = await eng.detectText(new (globalThis as any).OffscreenCanvas(w, h), w, h);
      expect(boxes).toHaveLength(2);
    } finally {
      (globalThis as any).OffscreenCanvas = origOffscreen;
    }
  });
});

describe('PaddleRecEngine CTC space decoding & RecCropCleaner', () => {
  it('decodes PaddleOCR use_space_char=True trailing space class (numClasses === characters.length + 2)', () => {
    // 95-char dict matching en_dict.txt (index 94 is ' '), model outputs 97 classes (blank=0, 1..95=dict, 96=' ')
    const dictLines = Array.from({ length: 94 }, (_, i) => String.fromCharCode(33 + i));
    dictLines.push(' ');
    const dictText = dictLines.join('\n') + '\n';
    expect(parseCtcDictionary(dictText)).toHaveLength(95);

    const eng = new PaddleRecEngine({ inputNames: ['x'], outputNames: ['out'] } as any, dictText);
    const numClasses = 97;
    const tokens = [
      dictLines.indexOf('M') + 1,
      dictLines.indexOf('Y') + 1,
      96, // use_space_char trailing space class (charIdx === 95 === characters.length)
      dictLines.indexOf('E') + 1,
      dictLines.indexOf('Y') + 1,
      dictLines.indexOf('E') + 1,
      dictLines.indexOf('S') + 1
    ];
    const data = new Float32Array(tokens.length * numClasses).fill(-10);
    tokens.forEach((cls, t) => {
      data[t * numClasses + cls] = 0.95;
    });

    const decoded = eng.ctcDecode(data, [1, tokens.length, numClasses]);
    expect(decoded.text).toBe('MY EYES');
    expect(decoded.confidence).toBeCloseTo(0.95, 5);
  });

  it('ignores out-of-range class index when numClasses does not match use_space_char (+2)', () => {
    const eng = new PaddleRecEngine({ inputNames: ['x'], outputNames: ['out'] } as any, 'A\nB\n ');
    // characters = ['A', 'B', ' '] (length 3). numClasses = 6 -> charIdx 3 !== 3+2 rule (6 !== 5)
    const data = new Float32Array(3 * 6).fill(-10);
    data[0 * 6 + 1] = 0.9; // 'A'
    data[1 * 6 + 4] = 0.9; // charIdx 3, ignored since numClasses=6 !== 5
    data[2 * 6 + 2] = 0.9; // 'B'
    expect(eng.ctcDecode(data, [1, 3, 6]).text).toBe('AB');
  });

  it('RecCropCleaner.findInkBounds trims wide horizontal bubble margins without clipping text', () => {
    const w = 200;
    const h = 16;
    const data = new Uint8ClampedArray(w * h * 4).fill(255);
    // Draw dark ink block spanning x=70..130, y=2..13
    for (let y = 2; y <= 13; y++) {
      for (let x = 70; x <= 130; x++) {
        const p = (y * w + x) * 4;
        data[p] = 10;
        data[p + 1] = 10;
        data[p + 2] = 10;
      }
    }
    const bounds = RecCropCleaner.findInkBounds({ data, width: w, height: h });
    expect(bounds).not.toBeNull();
    expect(bounds!.minX).toBe(70);
    expect(bounds!.maxX).toBe(130);
  });

  it('RecCropCleaner.maskBorderWallsInPadding clears vertical wall in outer pad without touching glyphs', () => {
    const w = 40;
    const h = 16;
    const data = new Uint8ClampedArray(w * h * 4).fill(255);
    // Vertical black wall at x=0..1 (inside padL=6)
    for (let y = 0; y < h; y++) {
      for (let x = 0; x <= 1; x++) {
        const p = (y * w + x) * 4;
        data[p] = 15;
        data[p + 1] = 15;
        data[p + 2] = 15;
      }
    }
    // Interior glyph stroke at x=8..25, y=3..12
    for (let y = 3; y <= 12; y++) {
      for (let x = 8; x <= 25; x++) {
        const p = (y * w + x) * 4;
        data[p] = 10;
        data[p + 1] = 10;
        data[p + 2] = 10;
      }
    }
    RecCropCleaner.maskBorderWallsInPadding({ data, width: w, height: h }, 6, 6);
    expect(data[0]).toBeGreaterThan(200); // wall cleared
    expect(data[(5 * w + 10) * 4]).toBeLessThan(30); // glyph untouched
  });

  it('RecCropCleaner.cleanCropToMask removes isolated 1px speckles while preserving thin 1px strokes', () => {
    const w = 32;
    const h = 16;
    const data = new Uint8ClampedArray(w * h * 4);
    // High-variance screentone background (>30 stddev, mean ~205)
    const tones = [165, 195, 225, 255];
    for (let i = 0; i < w * h; i++) {
      const v = tones[i % tones.length];
      data[i * 4] = v;
      data[i * 4 + 1] = v;
      data[i * 4 + 2] = v;
      data[i * 4 + 3] = 255;
    }
    // Thin 1px vertical glyph stroke at x=12, y=3..12 and 2px bar so text covers >5% of crop
    for (let y = 3; y <= 12; y++) {
      for (const x of [12, 20]) {
        const p = (y * w + x) * 4;
        data[p] = 10;
        data[p + 1] = 10;
        data[p + 2] = 10;
      }
    }
    for (let x = 12; x <= 20; x++) {
      for (const y of [3, 8]) {
        const p = (y * w + x) * 4;
        data[p] = 10;
        data[p + 1] = 10;
        data[p + 2] = 10;
      }
    }
    // Isolated 1px speckle at x=2, y=2
    const sp = (2 * w + 2) * 4;
    data[sp] = 10;
    data[sp + 1] = 10;
    data[sp + 2] = 10;

    RecCropCleaner.cleanCropToMask({ data, width: w, height: h });
    expect(data[sp]).toBeGreaterThan(150); // isolated speckle cleared
    expect(data[(10 * w + 12) * 4]).toBeLessThan(30); // thin 1px stroke kept
  });
});
