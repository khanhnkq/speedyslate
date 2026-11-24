import { describe, expect, it, vi } from 'vitest';
import { parseCtcDictionary, PaddleRecEngine } from '../../src/worker/paddle-rec';
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
});
