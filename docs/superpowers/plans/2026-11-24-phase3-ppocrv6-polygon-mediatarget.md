# Phase 3: PP-OCRv5/v6 WebGPU Presets, 4-Point Perspective Deskew & Universal MediaTarget Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unlock true WebGPU detection + recognition with `PP-OCRv6 Small Multilingual` & `PP-OCRv5 English Mobile` presets (plus optional `det2Url` gap-fill), rectify tilted comic text via 4-point min-area-rect polygons and bilinear perspective warp, and expand web compatibility with universal `MediaTarget` discovery, SPA navigation shield, and `Alt+Shift+X` viewport Screen Crop.

**Architecture:** `OCR_MODEL_PRESETS` adds verified `.onnx` WebGPU presets while `ModelDbService` supports optional `det2` buffers without invalidating existing downloads. `PolygonDeskew` computes convex hulls + rotating-calipers minimum-area rectangles (`quad`) on DBNet blobs, unclips along polygon normals, rectifies crops tilted `>= 4°` via homography before `PaddleRecEngine`, and clips `EraseMasker` inside `quad`. On the content side, `MediaTargetResolver`, `SpaOverlayShield`, and `ScreenCropOverlay` generalize DOM discovery and add protected-canvas screen-crop translation using the existing `activeTab` permission.

**Tech Stack:** TypeScript 5.7, `onnxruntime-web@1.31.1` (WebGPU JSEP), OffscreenCanvas, WebExtension `tabs.captureVisibleTab`, Vitest.

**Spec:** `docs/superpowers/specs/2026-11-24-kites-upgrade-roadmap-design.md` (requires Phases 0–2 complete).

## Global Constraints

- Every `.ts` file strictly **< 500 lines** (target **< 380 lines**).
- AMO Compliance: zero `world: "MAIN"` script injection, zero new manifest permissions (`activeTab` already declared in both manifests), `.onnx` weights downloaded strictly on user action via `ModelDbService` into IndexedDB.
- Context7 / Kites ONNX invariant: use `.onnx` URLs only (never `.ort`), `[1, 3, 48, W]` rec input, `parseCtcDictionary` space handling from Phase 0.
- Backward compatibility: existing `comic-manga-manhwa` and `comic-manga-cjk` downloads in IndexedDB remain `status: 'ready'` even when `det2` is absent.

## Review Focus

1. Existing user already downloaded `comic-manga-manhwa` (`det`, `rec`, `keys`) before `det2Url` was added → `ModelDbService.getModelStatus` must still return `'ready'` (`det2` optional on read, downloaded when present on fresh download).
2. Near-horizontal boxes (`|angle| < 4°`) should NOT undergo bilinear homography resampling (avoids unnecessary softness on 95% of straight lines) → `PolygonDeskew.shouldWarp(quad)` gates strictly on `|angleDeg| >= 4` and non-degenerate determinant `> 1e-6`.
3. Diagonal tilted SFX (`30°`): AABB covers large corners of untouched art → `EraseMasker` clips `raw`/`otsuRaw` outside `item.box.quad` (point-in-quad test) when `quad` is present so art outside the tilted text strip is never touched!
4. Single-page SPA manga reader (e.g. MangaDex / React reader) recycles the SAME `<img>` element when clicking "Next Page" by mutating `img.src` to page 2's URL → `SpaOverlayShield` must detect `newSrc !== trackedSrc`, purge page 1's `.speedyslate-bubble` / `.speedyslate-clean-canvas`, and re-enqueue the recycled `<img>` for page 2!
5. `Alt+Shift+X` pressed while user is typing in `<input>`, `<textarea>`, or `contentEditable` → shortcut guard must ignore keydown on editable targets, and `ScreenCropOverlay` must scale CSS viewport coordinates by `window.devicePixelRatio` when cropping `captureVisibleTab` PNG.

---

### Task 1: WebGPU `PP-OCRv6 Small` & `PP-OCRv5 English` Presets + Optional `det2Url` Wiring

**Files:**
- Modify: `src/shared/types.ts:108-118` (`OcrModelPreset.files.det2Url?: string`)
- Modify: `src/shared/presets.ts:117-141`
- Modify: `src/shared/model-db.ts:7-16,44-165`
- Modify: `src/offscreen/offscreen.ts:109-119`
- Modify: `src/background/ocr-worker-client.ts:181-191`
- Test: `tests/shared/model-presets.test.ts`

**Interfaces:**
- Produces:
  ```ts
  // src/shared/types.ts
  export interface OcrModelPreset {
    id: string;
    name: string;
    description: string;
    totalSizeMb: number;
    files: { detUrl: string; recUrl: string; keysUrl: string; det2Url?: string };
  }
  ```

- [ ] **Step 1: Write failing tests in `tests/shared/model-presets.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { OCR_MODEL_PRESETS } from '../../src/shared/presets';

describe('OCR_MODEL_PRESETS', () => {
  it('includes WebGPU-compatible .onnx presets for PP-OCRv6 Multilingual and PP-OCRv5 English', () => {
    const ids = OCR_MODEL_PRESETS.map((p) => p.id);
    expect(ids).toContain('ppocr-v6-multilingual');
    expect(ids).toContain('ppocr-v5-english-fast');
    for (const preset of OCR_MODEL_PRESETS) {
      expect(preset.files.detUrl.endsWith('.onnx')).toBe(true);
      expect(preset.files.recUrl.endsWith('.onnx')).toBe(true);
      expect(preset.files.detUrl.includes('.ort')).toBe(false);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/shared/model-presets.test.ts`  
Expected: FAIL (`ppocr-v6-multilingual` not in `OCR_MODEL_PRESETS`).

- [ ] **Step 3: Add PP-OCRv6 / PP-OCRv5 `.onnx` presets and optional `det2Url` support**

- In `src/shared/presets.ts`: add:
  1. `ppocr-v6-multilingual` (`~29.7 MB` — `PP-OCRv6_small_det.onnx` + `PP-OCRv6_small_rec.onnx` + `ppocrv6_dict.txt`, full WebGPU JSEP support for CJK + English + multilingual).
  2. `ppocr-v5-english-fast` (`~12.0 MB` — `PP-OCRv5_mobile_det_infer.onnx` + `en_PP-OCRv5_mobile_rec_infer.onnx` + `ppocrv5_en_dict.txt`, ultra-fast WebGPU English/Latin).
  3. Attach optional `det2Url: '.../PP-OCRv5_mobile_det_infer.onnx'` on `comic-manga-manhwa` and `comic-manga-cjk` so newly downloaded comic bundles activate `det2Engine` gap-fill for narration outside speech bubbles.
- In `ModelDbService`: support `type: 'det' | 'det2' | 'rec' | 'keys'`; keep `getModelStatus` requiring only `hasDet && hasRec && hasKeys` for backward compatibility; return `det2Buffer?: ArrayBuffer` in `getModelBuffers` and pass it into `INIT_MODEL` in both `offscreen.ts` and `ocr-worker-client.ts` (allowing `det2Session` to use WebGPU when available!).

- [ ] **Step 4: Run tests & type-check**

Run: `npx vitest run tests/shared/model-presets.test.ts && npm run type-check`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/shared/types.ts src/shared/presets.ts src/shared/model-db.ts src/offscreen/offscreen.ts src/background/ocr-worker-client.ts tests/shared/model-presets.test.ts
git commit -m "feat(models): add WebGPU PP-OCRv6/v5 ONNX presets and wire supplementary det2 gap-fill"
```

---

### Task 2: 4-Point Rotated Polygon Extraction, Perspective Deskew & Quad-Clipped Erase

**Files:**
- Modify: `src/shared/types.ts:8-15` (`BoundingBox.quad?: [number, number][]; angleDeg?: number`)
- Create: `src/worker/polygon-deskew.ts`
- Modify: `src/worker/paddle-det.ts:62-108,192-259`
- Modify: `src/worker/paddle-rec.ts:104-163`
- Modify: `src/worker/erase-masker.ts:79-105`
- Test: `tests/worker/polygon-deskew.test.ts`

**Interfaces:**
- Produces:
  ```ts
  // src/worker/polygon-deskew.ts
  export type Quad4 = [[number, number], [number, number], [number, number], [number, number]]; // TL, TR, BR, BL
  export class PolygonDeskew {
    static minAreaQuad(boundaryPoints: [number, number][]): { quad: Quad4; angleDeg: number };
    static unclipQuad(quad: Quad4, unclipRatio: number): Quad4;
    static shouldWarp(angleDeg?: number): boolean;
    static warpQuadToHorizontal(src: { data: Uint8ClampedArray; width: number; height: number }, quad: Quad4): ImageData | null;
    static pointInQuad(px: number, py: number, quad: [number, number][]): boolean;
  }
  ```

- [ ] **Step 1: Write failing tests in `tests/worker/polygon-deskew.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { PolygonDeskew } from '../../src/worker/polygon-deskew';

describe('PolygonDeskew', () => {
  it('recovers ~30° tilt angle on rotated rectangle points and gates shouldWarp at >= 4°', () => {
    const rad = (30 * Math.PI) / 180;
    const cos = Math.cos(rad), sin = Math.sin(rad);
    const pts: [number, number][] = [];
    for (let x = -40; x <= 40; x += 8) {
      for (const y of [-10, 10]) {
        pts.push([100 + x * cos - y * sin, 100 + x * sin + y * cos]);
      }
    }
    const { quad, angleDeg } = PolygonDeskew.minAreaQuad(pts);
    expect(Math.abs(Math.abs(angleDeg) - 30)).toBeLessThan(2.5);
    expect(PolygonDeskew.shouldWarp(angleDeg)).toBe(true);
    expect(PolygonDeskew.shouldWarp(2.1)).toBe(false);
    expect(PolygonDeskew.pointInQuad(100, 100, quad)).toBe(true);
    expect(PolygonDeskew.pointInQuad(10, 10, quad)).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/worker/polygon-deskew.test.ts`  
Expected: FAIL (`polygon-deskew` missing).

- [ ] **Step 3: Implement `PolygonDeskew` and integrate into `PaddleDetEngine`, `PaddleRecEngine`, and `EraseMasker`**

- `PolygonDeskew`: Monotone-chain convex hull on blob boundary pixels → rotating-calipers minimum-area bounding rectangle ordered `[TL, TR, BR, BL]` → normal outward offset `dist = clamp((area * unclipRatio) / perimeter, 3, 18)` → bilinear perspective sampling `warpQuadToHorizontal` when `|angleDeg| >= 4°`.
- `PaddleDetEngine`: record boundary pixels during connected-component BFS; attach `quad` and `angleDeg` when `|angleDeg| >= 4°` (only merging horizontally when both boxes have `|angleDeg| < 6°`).
- `PaddleRecEngine.prepareCrop`: if `box.quad && PolygonDeskew.shouldWarp(box.angleDeg)`, rectify via `warpQuadToHorizontal` before Otsu cleaning & resizing.
- `EraseMasker.buildPatch`: accept optional `quad` (translated to crop coordinates) and zero out mask pixels outside `pointInQuad` so diagonal SFX never erase corner art.

- [ ] **Step 4: Run tests & type-check**

Run: `npx vitest run tests/worker/polygon-deskew.test.ts && npm test && npm run type-check`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/shared/types.ts src/worker/polygon-deskew.ts src/worker/paddle-det.ts src/worker/paddle-rec.ts src/worker/erase-masker.ts tests/worker/polygon-deskew.test.ts
git commit -m "feat(ocr): add 4-point rotated polygon extraction, perspective deskew, and quad-clipped erase"
```

---

### Task 3: Universal `MediaTarget` Discovery, `SpaOverlayShield` & `Alt+Shift+X` Screen Crop

**Files:**
- Create: `src/content/media-target.ts`
- Create: `src/content/spa-shield.ts`
- Create: `src/content/screen-crop.ts`
- Modify: `src/content/toonhey-adapter.ts:174-244`
- Modify: `src/content/chapter-scanner.ts`
- Modify: `src/content/hud/hud-menu.ts` (add `"Khoanh vùng dịch màn hình (Alt+Shift+X)"` action)
- Modify: `src/background/index.ts` (add `CAPTURE_VISIBLE_TAB` handler calling `browser.tabs.captureVisibleTab`)
- Test: `tests/content/media-target-and-shortcuts.test.ts`

**Interfaces:**
- Produces:
  ```ts
  // src/content/media-target.ts
  export class MediaTargetResolver {
    static parseBestSrcsetUrl(srcset: string): string | null;
    static parseCssBackgroundUrl(bgValue: string): string | null;
    static extractBestImageUrl(el: HTMLElement): string | null;
    static promoteLazyAndSrcset(img: HTMLImageElement): void;
  }
  // src/content/screen-crop.ts
  export function isScreenCropShortcut(e: {
    altKey: boolean;
    ctrlKey: boolean;
    shiftKey: boolean;
    code: string;
    target?: { tagName?: string; isContentEditable?: boolean } | null;
  }): boolean;
  export function scaleViewportCropToBitmap(
    rect: { x: number; y: number; width: number; height: number },
    dpr: number,
    maxW: number,
    maxH: number
  ): { sx: number; sy: number; sw: number; sh: number };
  ```

- [ ] **Step 1: Write failing tests in `tests/content/media-target-and-shortcuts.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { MediaTargetResolver } from '../../src/content/media-target';
import { isScreenCropShortcut, scaleViewportCropToBitmap } from '../../src/content/screen-crop';

describe('MediaTargetResolver & ScreenCrop helpers (pure Node Vitest)', () => {
  it('picks highest-width candidate from srcset and extracts CSS background-image URLs', () => {
    expect(
      MediaTargetResolver.parseBestSrcsetUrl('https://cdn.ex/p1-480.webp 480w, https://cdn.ex/p1-1400.webp 1400w')
    ).toBe('https://cdn.ex/p1-1400.webp');
    expect(
      MediaTargetResolver.parseCssBackgroundUrl('url("https://cdn.ex/panel-02.jpg")')
    ).toBe('https://cdn.ex/panel-02.jpg');
  });

  it('guards Alt+Shift+X against editable inputs and scales crop rect by devicePixelRatio', () => {
    expect(
      isScreenCropShortcut({ altKey: true, ctrlKey: false, shiftKey: true, code: 'KeyX', target: { tagName: 'INPUT' } })
    ).toBe(false);
    expect(
      isScreenCropShortcut({ altKey: true, ctrlKey: false, shiftKey: true, code: 'KeyX', target: { tagName: 'DIV' } })
    ).toBe(true);
    expect(scaleViewportCropToBitmap({ x: 10, y: 20, width: 100, height: 80 }, 2, 1000, 1000)).toEqual({
      sx: 20, sy: 40, sw: 200, sh: 160
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/content/media-target-and-shortcuts.test.ts`  
Expected: FAIL (`media-target` and `screen-crop` modules missing).

- [ ] **Step 3: Implement `MediaTargetResolver`, `SpaOverlayShield`, and `ScreenCropOverlay`**

- `src/content/media-target.ts`: parse highest-resolution `srcset` candidate, 8 lazy-load attributes (`data-src`, `data-original`, `data-lazy-src`, `data-actual-src`, `data-url`, `data-origin`, `data-full-image`, `data-real-src`), `<picture><source srcset>`, and CSS `background-image` panels (`>= 200×200 px`).
- `src/content/spa-shield.ts`: attach lightweight `MutationObserver` (`attributeFilter: ['src', 'srcset', 'data-src']`) per wrapped `<img>`. When `resolvedUrl !== lastTranslatedUrl` (single-page reader navigated to next page), strip old `.speedyslate-bubble` / `.speedyslate-clean-canvas`, clear `completedImages` entry, and call `onRecycledImage(img)`.
- `src/content/screen-crop.ts` + `CAPTURE_VISIBLE_TAB` in `src/background/index.ts`: `Alt+Shift+X` (or `Ctrl+Shift+X` / HUD menu item) opens a crosshair viewport selection box; captures visible tab via `browser.tabs.captureVisibleTab(undefined, { format: 'png' })`, crops `dpr`-scaled region on `<canvas>`, sends `TRANSLATE_IMAGE` (`dataUrl`), and mounts a document-positioned `speedyslate-crop-result` wrapper rendered through the standard `OverlayRenderer.renderDialogues` with a `×` close button!

- [ ] **Step 4: Full Verification Gate (Tests, Line-Count Audit, Chrome/Firefox Packaging & Harness)**

Run: `npm test && npm run type-check && npm run build:chrome && npm run build:firefox && npm run build:harness`  
Audit line counts: `wc -l src/**/*.ts src/**/**/*.ts` → verify EVERY file is strictly `< 500` lines (target `< 400`).  
Expected: All tests PASS, both extension bundles & OCR harness build with 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/content/ src/background/index.ts tests/content/media-target-and-shortcuts.test.ts
git commit -m "feat(content): add universal MediaTarget, SPA page-navigation shield, and Alt+Shift+X Screen Crop"
```
