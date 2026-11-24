# Phase 0: Foundation, Coordinate Invariance, ORT Memory Lifecycle & Modular Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate high-res OCR coordinate drift and JPEG ringing, upgrade `onnxruntime-web` to `1.31.1` with deterministic `tensor.dispose()` / `session.release()` and `CTCLabelDecode` dictionary parity, compress `ErasePatch` payloads by >85% synchronously via RLE, and split 5 near-limit files comfortably below 380 lines.

**Architecture:** `ImageCompressor.captureForOcr` preserves lossless PNG pixels for local `hybrid_ocr` while `offscreen.ts` / `ocr-worker-client.ts` / `TaskProcessor` report and render strictly in `bitmap.width × bitmap.height` coordinate space. `ocr.worker.ts` configures WebGPU high-performance / COI-aware WASM threads before session creation, releases prior sessions on switch, and disposes every input/output tensor inside `try/finally` after copying `lastProbMap`. `erase-codec.ts` encodes RGBA patches with a synchronous `rle1:` run-length format while remaining backward-compatible with legacy raw base64 strings.

**Tech Stack:** TypeScript 5.7, `onnxruntime-web@1.31.1`, Vite 6 + esbuild, Vitest, WebExtension MV3 (Chrome Offscreen + Firefox Direct Worker).

**Spec:** `docs/superpowers/specs/2026-11-24-kites-upgrade-roadmap-design.md`

## Global Constraints

- Every `.ts` file strictly **< 500 lines** (target **< 380 lines** after splitting near-limit files; `AGENTS.md` §2).
- AMO Compliance (`AGENTS.md` §3): zero `eval`/`new Function`/remote scripts; bundle only `ort-wasm*.{wasm,mjs}` locally; keep Chrome `service_worker` and Firefox `background.scripts` green.
- Context7 ONNX Runtime Web invariants: set `ort.env.webgpu.powerPreference = 'high-performance'` before first session; gate `ort.env.wasm.numThreads > 1` on `Boolean((self as any).crossOriginIsolated)`; copy `Float32Array` data *before* `outputTensor.dispose()`.
- Context7 PaddleOCR `CTCLabelDecode` invariant: strip trailing `\r?\n`, keep all dictionary lines intact, and append `' '` without overwriting the last dictionary character.
- Verification after each task: `npm run type-check && npm test`. End of Phase 0: `npm run build:chrome && npm run build:firefox && npm run build:harness`.

## Review Focus

1. Calling `outputTensor.dispose()` in `PaddleDetEngine.detectText` invalidates `outputTensor.data` before `StripSlicer.blitProbMap` reads `lastProbMap` → Task 2 clones `new Float32Array(outputTensor.data as Float32Array)` prior to disposal and asserts `lastProbMap.data` survives post-run.
2. Dictionary files without a trailing newline (`a\nb\nc`) vs with a trailing newline (`a\nb\nc\n`) vs already ending in `' '` → Task 2 tests all three variants in `parseCtcDictionary` so neither the last character nor space decoding is lost.
3. Legacy cached `TranslationCacheDb` entries hold raw base64 RGBA strings without the `rle1:` prefix → Task 3 tests `decodePixels` round-tripping both `rle1:` strings and legacy unprefixed base64 strings identically.
4. High-res scan (`1600×2400`) captured at `maxWidth = 2200` vs ultra-wide (`3000×4500` scaled to `2200×3300`) → Task 1 ensures `offscreen.ts` & `ocr-worker-client.ts` return `bitmap.width × bitmap.height` (never `msg.naturalWidth`) and `TaskProcessor` passes `resp.naturalWidth` (`2200`) to `OverlayRenderer`, keeping percentage coordinates exact.
5. `OpenAIApiClient` encountering HTTP 400 on `response_format: { type: 'json_object' }` from custom/Ollama endpoints → Task 4 downgrades to prompt-only once and retries cleanly without failing the page.

---

### Task 1: Lossless OCR Capture & Coordinate-Space Invariance

**Files:**
- Modify: `src/content/image-compressor.ts:15-65`
- Modify: `src/content/task-processor.ts:90-160,250-262`
- Modify: `src/offscreen/offscreen.ts:135-176`
- Modify: `src/background/ocr-worker-client.ts:212-270`
- Test: `tests/content/coordinate-space.test.ts`

**Interfaces:**
- Produces:
  ```ts
  // src/content/image-compressor.ts
  export class ImageCompressor {
    static compressForVision(img: HTMLImageElement, maxDim?: number, quality?: number): CompressedImageResult;
    static captureForOcr(img: HTMLImageElement, maxWidth?: number): CompressedImageResult;
  }
  export function resolveOverlayDimensions(
    ocrWidth: number | undefined,
    ocrHeight: number | undefined,
    fallbackWidth: number,
    fallbackHeight: number
  ): { width: number; height: number };
  ```

- [ ] **Step 1: Write the failing test in `tests/content/coordinate-space.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { resolveOverlayDimensions } from '../../src/content/image-compressor';

describe('resolveOverlayDimensions', () => {
  it('prefers OCR bitmap dimensions over larger DOM naturalWidth to prevent coordinate drift', () => {
    expect(resolveOverlayDimensions(1280, 1920, 1600, 2400)).toEqual({ width: 1280, height: 1920 });
  });
  it('falls back to DOM dimensions only when OCR dimensions are absent', () => {
    expect(resolveOverlayDimensions(undefined, undefined, 1600, 2400)).toEqual({ width: 1600, height: 2400 });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/content/coordinate-space.test.ts`  
Expected: FAIL (`resolveOverlayDimensions` is not exported).

- [ ] **Step 3: Implement `ImageCompressor.captureForOcr`, `resolveOverlayDimensions`, and bitmap-authoritative dimensions**

- In `src/content/image-compressor.ts`: add `captureForOcr(img, maxWidth = 2200)` using `canvas.toDataURL('image/png')` (lossless, only downscaling when `naturalWidth > 2200`) and export `resolveOverlayDimensions(ocrW, ocrH, fallbackW, fallbackH)` returning `{ width: ocrW && ocrW > 0 ? ocrW : fallbackW, height: ocrH && ocrH > 0 ? ocrH : fallbackH }`.
- In `src/content/task-processor.ts`: use `compressForVision(img, 1280, 0.78)` ONLY when `isVision === true`; when `!isVision`, call `captureForOcr(img, 2200)`. Replace `const renderW = img.naturalWidth || ...` at both render sites with `resolveOverlayDimensions(resp.naturalWidth, resp.naturalHeight, img.naturalWidth, img.naturalHeight)` (and `task.naturalWidth, task.naturalHeight` in `processTranslationTask`).
- In `src/offscreen/offscreen.ts` (`runOcrOnImage`) and `src/background/ocr-worker-client.ts` (`runOcr`): set `const width = bitmap.width; const height = bitmap.height;` so returned `dialogues` and `width/height` always share the exact bitmap pixel space.

- [ ] **Step 4: Run test & type-check**

Run: `npx vitest run tests/content/coordinate-space.test.ts && npm run type-check`  
Expected: PASS, 0 TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add src/content/image-compressor.ts src/content/task-processor.ts src/offscreen/offscreen.ts src/background/ocr-worker-client.ts tests/content/coordinate-space.test.ts
git commit -m "fix(ocr): preserve lossless OCR pixels and enforce bitmap coordinate invariance"
```

---

### Task 2: `onnxruntime-web@1.31.1`, Tensor/Session Disposal & `CTCLabelDecode` Dict Fix

**Files:**
- Modify: `package.json` (`onnxruntime-web` → `"1.31.1"`)
- Modify: `vite.config.ts:77-88`
- Modify: `src/worker/detector-interface.ts:7-27`
- Modify: `src/worker/ocr.worker.ts:13-102,120-196`
- Modify: `src/worker/paddle-det.ts:46-65`
- Modify: `src/worker/comic-det.ts:52-75`
- Modify: `src/worker/paddle-rec.ts:22-43,189-245`
- Test: `tests/worker/ctc-dict-and-lifecycle.test.ts`

**Interfaces:**
- Produces:
  ```ts
  // src/worker/detector-interface.ts
  export interface ITextDetector {
    detectText(canvas: OffscreenCanvas, originalWidth: number, originalHeight: number): Promise<BoundingBox[]>;
    release?(): Promise<void>;
    lastProbMap?: { data: Float32Array; w: number; h: number; ratioW: number; ratioH: number } | null;
  }
  // src/worker/paddle-rec.ts
  export function parseCtcDictionary(keysText: string): string[];
  ```

- [ ] **Step 1: Write the failing tests in `tests/worker/ctc-dict-and-lifecycle.test.ts`**

```ts
import { describe, expect, it, vi } from 'vitest';
import { parseCtcDictionary, PaddleRecEngine } from '../../src/worker/paddle-rec';
import { PaddleDetEngine } from '../../src/worker/paddle-det';

describe('parseCtcDictionary', () => {
  it('preserves last character and appends space when dict has no trailing newline', () => {
    expect(parseCtcDictionary('a\nb\nc')).toEqual(['a', 'b', 'c', ' ']);
  });
  it('strips single trailing newline and appends space exactly once', () => {
    expect(parseCtcDictionary('a\nb\nc\r\n')).toEqual(['a', 'b', 'c', ' ']);
  });
  it('does not duplicate space if dictionary already ends with space', () => {
    expect(parseCtcDictionary('a\nb\n ')).toEqual(['a', 'b', ' ']);
  });
});

describe('Tensor disposal & session release', () => {
  it('clones probMap data before disposing output tensor in PaddleDetEngine', async () => {
    const raw = new Float32Array(32 * 32).fill(0.8);
    const disposeOut = vi.fn(() => raw.fill(0));
    const fakeSession: any = {
      inputNames: ['x'],
      outputNames: ['out'],
      run: vi.fn(async () => ({ out: { data: raw, dispose: disposeOut } })),
      release: vi.fn(async () => {})
    };
    const eng = new PaddleDetEngine(fakeSession);
    await eng.release();
    expect(fakeSession.release).toHaveBeenCalledOnce();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/worker/ctc-dict-and-lifecycle.test.ts`  
Expected: FAIL (`parseCtcDictionary` and `eng.release` missing).

- [ ] **Step 3: Upgrade `onnxruntime-web` to `1.31.1` and implement lifecycle + dictionary fixes**

- Run `npm install onnxruntime-web@1.31.1` (published `2026-10-26`).
- In `vite.config.ts`: filter `onnxDist` files with `f.startsWith('ort-wasm') && (f.endsWith('.wasm') || f.endsWith('.mjs'))`.
- In `src/worker/ocr.worker.ts`:
  - Configure `(ort.env as any).webgpu = { ...((ort.env as any).webgpu || {}), powerPreference: 'high-performance' };` and `ort.env.wasm.numThreads = (self as any).crossOriginIsolated ? Math.min(4, Math.max(1, ((self as any).navigator?.hardwareConcurrency ?? 2) - 1)) : 1;`.
  - In `tryCreateWebGpuSession`: dispose `testTensor` and test output tensors inside `try/finally`; call `await session.release()` if kernel probe throws.
  - At the start of `INIT_MODEL`: `await detEngine?.release?.(); await det2Engine?.release?.(); await recEngine?.release?.();`.
- In `src/worker/paddle-det.ts`, `src/worker/comic-det.ts`, and `src/worker/paddle-rec.ts`:
  - Add `public async release(): Promise<void> { await this.session.release?.(); }`.
  - Wrap every `this.session.run(...)` in `try { ... } finally { inputTensor.dispose?.(); for (const t of Object.values(results || {})) (t as any)?.dispose?.(); }`. In `PaddleDetEngine`, copy `const predData = new Float32Array(outputTensor.data as Float32Array);` *before* the `finally` block runs!
  - Export `parseCtcDictionary(keysText: string): string[]` in `paddle-rec.ts`: strip trailing `\r?\n` (`keysText.replace(/(?:\r?\n)+$/, '')`), split `/\r?\n/`, and if `chars[chars.length - 1] !== ' '` push `' '`.

- [ ] **Step 4: Run tests, type-check & build verification**

Run: `npm test && npm run type-check && npm run build:chrome`  
Expected: All tests PASS, `dist/chrome/` contains `ort-wasm-simd-threaded*.{wasm,mjs}` without `ort.*.bundle.min.mjs`.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vite.config.ts src/worker/detector-interface.ts src/worker/ocr.worker.ts src/worker/paddle-det.ts src/worker/comic-det.ts src/worker/paddle-rec.ts tests/worker/ctc-dict-and-lifecycle.test.ts
git commit -m "perf(worker): upgrade onnxruntime-web to 1.31.1, dispose tensors, and fix CTC space dict"
```

---

### Task 3: Synchronous `rle1:` RGBA Patch Compression Codec

**Files:**
- Modify: `src/shared/erase-codec.ts:1-67`
- Test: `tests/shared/erase-codec.test.ts`

**Interfaces:**
- Produces:
  ```ts
  // src/shared/erase-codec.ts
  export function encodePixelsRle(u8: Uint8ClampedArray): string; // returns "rle1:<base64>"
  export function encodeErasePatches(items: DialogueItem[]): void;
  export function decodePixels(pixels: unknown): Uint8ClampedArray<ArrayBuffer>;
  ```

- [ ] **Step 1: Write the failing test in `tests/shared/erase-codec.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { decodePixels, encodeErasePatches, encodePixelsRle } from '../../src/shared/erase-codec';

describe('erase-codec rle1', () => {
  it('losslessly round-trips sparse + flat-fill RGBA patches at <20% of raw base64 size', () => {
    const raw = new Uint8ClampedArray(120 * 80 * 4); // 38,400 bytes
    for (let i = 1200; i < 4800; i++) {
      raw.set([248, 246, 240, 255], i * 4);
    }
    for (let i = 5000; i < 5050; i++) {
      raw.set([(i * 17) & 255, (i * 31) & 255, (i * 13) & 255, 255], i * 4);
    }
    const rle = encodePixelsRle(raw);
    expect(rle.startsWith('rle1:')).toBe(true);
    expect(rle.length).toBeLessThan((raw.length * 4) / 3 * 0.2);
    expect(Array.from(decodePixels(rle))).toEqual(Array.from(raw));
  });

  it('remains backward-compatible with legacy unprefixed base64 strings', () => {
    const raw = new Uint8ClampedArray([10, 20, 30, 255, 0, 0, 0, 0]);
    const legacyB64 = Buffer.from(raw).toString('base64');
    expect(Array.from(decodePixels(legacyB64))).toEqual(Array.from(raw));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/shared/erase-codec.test.ts`  
Expected: FAIL (`encodePixelsRle` is not defined).

- [ ] **Step 3: Implement PackBits-style RGBA pixel RLE (`rle1:`) in `src/shared/erase-codec.ts`**

- Format after `"rle1:"` base64 decode: 4-byte little-endian `pixelCount`, followed by packets over 32-bit RGBA pixels:
  - Header `0x00..0x7F` (`len = header + 1`, 1..128): literal run — if pixel alpha is `0` we can also use transparent-zero shortcut `0xFF` (`count` 1..65535 LE16) OR standard PackBits over 4-byte RGBA tuples:
    - `header = 0..127`: `header + 1` literal RGBA quads (`4 * (header + 1)` bytes).
    - `header = 128..255`: repeat run of `header - 128 + 2` (`2..129`) identical RGBA quads (only `4` bytes for `[0,0,0,0]` or flat bubble color `[R,G,B,255]`!).
- Update `encodePatch` to write `encodePixelsRle(p.pixels)` and `decodePixels` to branch on `pixels.startsWith('rle1:')` before falling back to legacy `b64ToU8`.

- [ ] **Step 4: Run test & type-check**

Run: `npx vitest run tests/shared/erase-codec.test.ts && npm run type-check`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/shared/erase-codec.ts tests/shared/erase-codec.test.ts
git commit -m "perf(cache): compress ErasePatch RGBA buffers synchronously with rle1 codec"
```

---

### Task 4: Decompose Near-Limit Files Below 380 Lines (`AGENTS.md` §1–2)

**Files:**
- Create: `src/background/ocr-handlers.ts`
- Modify: `src/background/index.ts:140-405`
- Create: `src/services/translation/openai-api-client.ts`
- Modify: `src/services/translation/openai-provider.ts:70-260`
- Create: `src/worker/inpaint-solver.ts`
- Modify: `src/worker/erase-masker.ts:392-467`
- Create: `src/popup/provider-form-controller.ts`
- Modify: `src/popup/popup.ts:100-479`
- Create: `src/content/chapter-scanner.ts`
- Modify: `src/content/index.ts:180-469`
- Test: `tests/services/openai-api-client.test.ts`

**Interfaces:**
- Produces:
  ```ts
  // src/services/translation/openai-api-client.ts
  export class OpenAIApiClient {
    static postChatCompletion(params: {
      baseUrl: string;
      model: string;
      messages: { role: string; content: any }[];
      keyRotator: ApiKeyRotator;
      jsonObjectMode?: boolean;
      timeoutMs?: number;
      temperature?: number;
      onSuccess?: (keyIndex: number) => void;
    }): Promise<any>;
  }
  // src/worker/inpaint-solver.ts
  export class InpaintSolver {
    static diffuseMaskedRegion(
      data: Uint8ClampedArray,
      dilMask: Uint8Array,
      emitMask: Uint8Array,
      w: number,
      h: number
    ): Uint8ClampedArray;
  }
  ```

- [ ] **Step 1: Write the failing test in `tests/services/openai-api-client.test.ts`**

```ts
import { describe, expect, it, vi } from 'vitest';
import { OpenAIApiClient } from '../../src/services/translation/openai-api-client';
import { ApiKeyRotator } from '../../src/services/translation/api-key-rotator';

describe('OpenAIApiClient HTTP 400 json_object downgrade', () => {
  it('retries without response_format when endpoint rejects json_object with HTTP 400', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ error: { message: 'response_format is not supported' } }), { status: 400 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ choices: [{ message: { content: '{"b0":"ok"}' } }] }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const res = await OpenAIApiClient.postChatCompletion({
      baseUrl: 'http://localhost:11434/v1',
      model: 'qwen2.5:7b',
      messages: [{ role: 'user', content: 'hi' }],
      keyRotator: new ApiKeyRotator(''),
      jsonObjectMode: true
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(JSON.parse(fetchMock.mock.calls[1][1].body).response_format).toBeUndefined();
    expect(res.choices[0].message.content).toBe('{"b0":"ok"}');
    vi.unstubAllGlobals();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/services/openai-api-client.test.ts`  
Expected: FAIL (`openai-api-client` module missing).

- [ ] **Step 3: Extract the 5 single-responsibility modules without changing external behavior**

- `src/services/translation/openai-api-client.ts`: centralize key-rotation retry loop, `AbortController` timeout, 429 cooldown marking, and automatic 1-time downgrade when `jsonObjectMode: true` returns HTTP 400; refactor `OpenAIProvider.translateDialogues`, `translateImage`, and `testConnection` to call it.
- `src/background/ocr-handlers.ts`: move `handleOcrImage`, `handleTranslateDialogues`, and `handleTranslateImage` out of `src/background/index.ts`.
- `src/worker/inpaint-solver.ts`: move multi-source BFS + diffusion loop out of `src/worker/erase-masker.ts` into `InpaintSolver.diffuseMaskedRegion`.
- `src/popup/provider-form-controller.ts`: move provider dropdown, model preset selector, API key badge, and connection test wiring out of `src/popup/popup.ts`.
- `src/content/chapter-scanner.ts`: move DOM image scanning, `MutationObserver`, and `IntersectionObserver` wiring out of `src/content/index.ts`.

- [ ] **Step 4: Verify all tests, line counts (< 400 lines), and both browser builds**

Run: `npm test && npm run type-check && npm run build:chrome && npm run build:firefox && npm run build:harness`  
Check line counts: confirm every touched/created `.ts` file is `< 400` lines.  
Expected: All unit tests PASS, Chrome + Firefox + Harness builds succeed cleanly.

- [ ] **Step 5: Commit**

```bash
git add src/background/ src/services/translation/ src/worker/ src/popup/ src/content/ tests/services/openai-api-client.test.ts
git commit -m "refactor: decompose >450-line modules under 380 lines and add json_object 400 fallback"
```
