# Phase 2: 0 MB Smart Bubble Fit, Telea FMM Inpainting & Comic Typography Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand narrow CJK text columns into actual speech-bubble chambers (with morphological tail severing), replace blurry Voronoi-diffusion erase with Telea Fast Marching Method (FMM) + dynamic halo dilation, and render real `measureText`-fitted Vietnamese comic typography with elliptical chord wrapping and SFX stroke halos.

**Architecture:** Inside `ocr.worker.ts`, `BubbleChamberExtractor` discovers the enclosed light/dark paper chamber around each aggregated dialogue block, severs pointing tails via chamfer-distance erosion + dilation, and attaches an optional `chamberBox` to `DialogueItem`. `InpaintSolver` upgrades from BFS+blur to Alexandru Telea's narrow-band Eikonal FMM (`MinHeap` + directional gradient propagation) with dynamic `2–5px` stroke dilation for textured backgrounds while preserving fast `BubbleFiller` for uniform bubbles. On the content side, a local SIL-OFL Vietnamese comic font (`PatrickHand-Regular.woff2`) is registered once, `TextAutoFitter` measures true glyph widths with elliptical chord budgets, and `OverlayStyler` applies `paint-order: stroke fill` halos on `free`/`sfx` overlays.

**Tech Stack:** Pure TypeScript (TypedArrays, flat binary MinHeap), OffscreenCanvas / Canvas 2D `measureText`, SIL-OFL WOFF2 font, Vitest.

**Spec:** `docs/superpowers/specs/2026-11-24-kites-upgrade-roadmap-design.md` (requires Phase 0 & Phase 1 complete).

## Global Constraints

- Zero external ML weights (`0 MB` runtime memory overhead for both Bubble Fit and Telea FMM).
- Clean-room MIT implementation from published algorithms (Telea 2004 JGT paper, standard chamfer distance transform & morphological opening).
- Every `.ts` file strictly **< 500 lines** (target **< 380 lines**).
- AMO Compliance: font file bundled locally in `public/fonts/` and declared in `web_accessible_resources` (`"fonts/*"`) of both `manifest.chrome.json` and `manifest.firefox.json`.
- Backward compatibility: `chamberBox` and `isOvalChamber` are optional on `DialogueItem`; cached entries without them keep rendering cleanly.

## Review Focus

1. Unbounded/open speech bubble or floating narration on white sky → flood-fill reaches `>= 94%` of the bounded search window edge → `BubbleChamberExtractor` MUST reject (`return null`) so `BubbleGeometry` never expands across the whole panel!
2. Pointing speech-bubble tail sticking out the bottom/side of a round balloon → without morphological opening, `chamberBox` includes the tail and pushes translated text off-center into the tail → Task 1 tests a synthetic round bubble with a 12px-wide pointing tail and asserts `chamberBox` excludes the tail.
3. Telea FMM numerical stability: zero-gradient flat plateaus or `NaN` directional dot products → Task 2 enforces `EPSILON = 1e-6` and finite distance clamping (`INF = 1e6`), verified on textured checkerboard/screentone + diagonal line-art crops.
4. Node/Vitest environment lacks browser `HTMLCanvasElement.getContext('2d')` → `TextAutoFitter` must accept an optional `(text: string, fontPx: number) => number` width measurer and gracefully fall back to calibrated per-script width table when 2D context is unavailable.
5. `OverlayStyler` stroke halo on `dialogue` bubbles vs `free`/`sfx` → solid halo (`-webkit-text-stroke`) must apply ONLY when `transparentBg && (kind === 'free' || kind === 'sfx')` so clean white bubbles keep crisp unstroked lettering.

---

### Task 1: 0 MB `BubbleChamberExtractor` (Dual-Polarity Flood + Tail Severing)

**Files:**
- Modify: `src/shared/types.ts:26-47` (`DialogueItem.chamberBox?: BoundingBox; isOvalChamber?: boolean`)
- Create: `src/worker/bubble-chamber.ts`
- Modify: `src/worker/ocr.worker.ts:336-356` (attach `chamberBox` on aggregated bubbles / transfer to items)
- Modify: `src/worker/bubble-aggregator.ts:279-313` (preserve/compute `chamberBox`)
- Modify: `src/content/overlay/bubble-geometry.ts:25-85` (prefer `item.chamberBox` when present)
- Test: `tests/worker/bubble-chamber.test.ts`

**Interfaces:**
- Produces:
  ```ts
  // src/worker/bubble-chamber.ts
  export interface ChamberResult {
    chamberBox: BoundingBox;
    isOval: boolean;
  }
  export class BubbleChamberExtractor {
    static extractChamber(
      img: { data: Uint8ClampedArray; width: number; height: number },
      cropOriginX: number,
      cropOriginY: number,
      textBox: BoundingBox
    ): ChamberResult | null;
  }
  ```

- [ ] **Step 1: Write failing tests in `tests/worker/bubble-chamber.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { BubbleChamberExtractor } from '../../src/worker/bubble-chamber';

function drawOvalBubbleWithTail(w: number, h: number, dark = false): Uint8ClampedArray {
  const bg = dark ? 220 : 40;
  const paper = dark ? 22 : 250;
  const border = dark ? 245 : 15;
  const buf = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = (x - 100) / 65;
      const dy = (y - 90) / 55;
      const d2 = dx * dx + dy * dy;
      const inTail = y >= 140 && y <= 185 && Math.abs(x - 100) <= Math.max(2, 8 - (y - 140) * 0.15);
      const v = d2 <= 0.92 || inTail ? paper : d2 <= 1.05 ? border : bg;
      buf.set([v, v, v, 255], (y * w + x) * 4);
    }
  }
  return buf;
}

describe('BubbleChamberExtractor', () => {
  it('expands a narrow vertical CJK column to the oval chamber while severing the pointing tail', () => {
    const data = drawOvalBubbleWithTail(200, 200, false);
    const res = BubbleChamberExtractor.extractChamber(
      { data, width: 200, height: 200 }, 0, 0, { x: 88, y: 50, width: 24, height: 80 }
    );
    expect(res).not.toBeNull();
    expect(res!.chamberBox.width).toBeGreaterThan(95);   // expanded from 24px -> ~115px chamber!
    expect(res!.chamberBox.y + res!.chamberBox.height).toBeLessThan(152); // tail (140..185) severed!
    expect(res!.isOval).toBe(true);
  });

  it('supports dark scream bubbles and rejects unbounded open backgrounds', () => {
    const darkData = drawOvalBubbleWithTail(200, 200, true);
    const darkRes = BubbleChamberExtractor.extractChamber(
      { data: darkData, width: 200, height: 200 }, 0, 0, { x: 88, y: 50, width: 24, height: 80 }
    );
    expect(darkRes).not.toBeNull();
    expect(darkRes!.chamberBox.width).toBeGreaterThan(95);

    const openWhite = new Uint8ClampedArray(200 * 200 * 4).fill(255);
    const leak = BubbleChamberExtractor.extractChamber(
      { data: openWhite, width: 200, height: 200 }, 0, 0, { x: 88, y: 50, width: 24, height: 80 }
    );
    expect(leak).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/worker/bubble-chamber.test.ts`  
Expected: FAIL (`bubble-chamber` missing).

- [ ] **Step 3: Implement `BubbleChamberExtractor` and wire into Worker & `BubbleGeometry`**

- Algorithm in `src/worker/bubble-chamber.ts`:
  1. 16-bin interior luma histogram on `textBox` determines light paper (`med >= 150`, threshold `max(130, med - 35)`) vs dark bubble (`med <= 85`, threshold `min(95, med + 35)`).
  2. 4-connected BFS flood-fill from non-ink paper seeds inside `textBox`; if flooded region touches `>= 94%` of `width` or `height` of the search crop (or exceeds `6.5×` textBox area without encountering enclosing contrast borders), return `null` (leak guard).
  3. Exact 2-pass Chamfer (3-4) distance transform on the flooded paper mask; erode at `R = clamp(round(min(regionW, regionH) * 0.08), 5, 13)` to sever narrow tails; BFS from eroded seeds inside `textBox`; dilate back by `R - 2` (safe 2px border inset) clipped to original paper mask.
  4. Compute bounding box of reconstructed chamber + `fillRatio = chamberPixels / (w * h)` (`isOval = fillRatio < 0.88`), ensuring `chamberBox` encloses `textBox` (`union` with `textBox` if curved top/bottom clipped 1–2px of tall strokes).
- In `BubbleGeometry.computeCoordinates`: when `item.chamberBox` exists, compute `topPct/leftPct/widthPct/heightPct` directly from `item.chamberBox` (with a 6% horizontal / 4% vertical safe core inset) instead of the blind `1.5×` width heuristic.

- [ ] **Step 4: Run tests & type-check**

Run: `npx vitest run tests/worker/bubble-chamber.test.ts && npm run type-check`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/shared/types.ts src/worker/bubble-chamber.ts src/worker/ocr.worker.ts src/worker/bubble-aggregator.ts src/content/overlay/bubble-geometry.ts tests/worker/bubble-chamber.test.ts
git commit -m "feat(overlay): add 0MB Heuristic BubbleChamberExtractor with tail severing"
```

---

### Task 2: Telea Fast Marching Method (FMM) Inpainting & Dynamic Halo Dilation

**Files:**
- Modify: `src/worker/inpaint-solver.ts`
- Modify: `src/worker/erase-masker.ts:193-215,392-456`
- Test: `tests/worker/telea-inpaint.test.ts`

**Interfaces:**
- Produces:
  ```ts
  // src/worker/inpaint-solver.ts
  export class InpaintSolver {
    static computeDilationRadius(cropHeight: number): number; // clamp(round(cropHeight * 0.10), 2, 5)
    static teleaInpaint(
      data: Uint8ClampedArray,
      mask: Uint8Array,
      emitMask: Uint8Array,
      w: number,
      h: number,
      radius?: number
    ): Uint8ClampedArray;
  }
  ```

- [ ] **Step 1: Write failing tests in `tests/worker/telea-inpaint.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { InpaintSolver } from '../../src/worker/inpaint-solver';

describe('InpaintSolver.teleaInpaint', () => {
  it('reconstructs a smooth linear gradient across a masked stroke without NaN or dark ghosts', () => {
    const w = 40, h = 30;
    const img = new Uint8ClampedArray(w * h * 4);
    const mask = new Uint8Array(w * h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        const g = Math.round((x / (w - 1)) * 200) + 20;
        const isStroke = x >= 17 && x <= 21 && y >= 8 && y <= 22;
        mask[i] = isStroke ? 1 : 0;
        img.set(isStroke ? [5, 5, 5, 255] : [g, g, g, 255], i * 4);
      }
    }
    const out = InpaintSolver.teleaInpaint(img, mask, mask, w, h, 3);
    const mid = (15 * w + 19) * 4;
    const expected = Math.round((19 / 39) * 200) + 20;
    expect(out[mid + 3]).toBe(255);
    expect(Math.abs(out[mid] - expected)).toBeLessThanOrEqual(8);
  });

  it('scales stroke dilation between 2px and 5px to swallow fuchidori halos', () => {
    expect(InpaintSolver.computeDilationRadius(18)).toBe(2);
    expect(InpaintSolver.computeDilationRadius(36)).toBe(4);
    expect(InpaintSolver.computeDilationRadius(80)).toBe(5);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/worker/telea-inpaint.test.ts`  
Expected: FAIL (`teleaInpaint` and `computeDilationRadius` missing).

- [ ] **Step 3: Implement narrow-band Eikonal Telea FMM in `InpaintSolver` and wire into `EraseMasker`**

- Implement zero-allocation typed `MinHeap` (`Float32Array` distances + `Int32Array` flat indices), upwind quadrant Eikonal solver `solveEikonal`, and Telea directional + distance + level-set weighted neighborhood estimator (`radius = 3`, `EPSILON = 1e-6`) in `src/worker/inpaint-solver.ts`.
- In `src/worker/erase-masker.ts`: replace fixed `it < 2` dilation with `InpaintSolver.computeDilationRadius(h)` (`2..5` px) when textured/non-guided halo is present, and call `InpaintSolver.teleaInpaint(data, dil, emit, w, h, 3)` in place of BFS+blur.

- [ ] **Step 4: Run tests & type-check**

Run: `npx vitest run tests/worker/telea-inpaint.test.ts && npm test && npm run type-check`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/worker/inpaint-solver.ts src/worker/erase-masker.ts tests/worker/telea-inpaint.test.ts
git commit -m "feat(inpaint): replace Voronoi blur with Telea Fast Marching Method and dynamic halo dilation"
```

---

### Task 3: Bundled Vietnamese Comic Font, `measureText` Elliptical Chord Fitter & SFX Stroke Halo

**Files:**
- Create: `public/fonts/PatrickHand-Regular.woff2` (download official SIL-OFL Google Fonts Latin+Vietnamese WOFF2)
- Create: `src/content/overlay/comic-font-loader.ts`
- Modify: `manifest.chrome.json:52-65` (`"fonts/*"` in `web_accessible_resources`)
- Modify: `manifest.firefox.json:67-80` (`"fonts/*"` in `web_accessible_resources`)
- Modify: `src/content/overlay/text-auto-fitter.ts:1-93`
- Modify: `src/content/overlay/overlay-styler.ts:43-122`
- Modify: `src/content/overlay/overlay-renderer.ts:22-105`
- Test: `tests/content/text-auto-fitter.test.ts`

**Interfaces:**
- Produces:
  ```ts
  // src/content/overlay/text-auto-fitter.ts
  export type WidthMeasurer = (text: string, fontPx: number) => number;
  export class TextAutoFitter {
    static fitDialogue(
      boxWidthPx: number,
      boxHeightPx: number,
      text: string,
      opts?: { elliptical?: boolean; measureWidth?: WidthMeasurer }
    ): { fontSize: number; lines: string[] };
    static computeOptimalFontSize(boxWidthPx: number, boxHeightPx: number, text: string): number;
  }
  ```

- [ ] **Step 1: Write failing tests in `tests/content/text-auto-fitter.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { TextAutoFitter } from '../../src/content/overlay/text-auto-fitter';

describe('TextAutoFitter.fitDialogue elliptical chord wrapping', () => {
  const monoMeasure = (s: string, px: number) => s.length * px * 0.6;

  it('wraps top and bottom lines narrower than middle lines inside an elliptical bubble', () => {
    const res = TextAutoFitter.fitDialogue(
      140, 130,
      'ANH KHÔNG THỂ NÀO TIN ĐƯỢC CHUYỆN NÀY ĐANG XẢY RA NGAY LÚC NÀY',
      { elliptical: true, measureWidth: monoMeasure }
    );
    expect(res.lines.length).toBeGreaterThanOrEqual(3);
    const firstW = monoMeasure(res.lines[0], res.fontSize);
    const midW = monoMeasure(res.lines[Math.floor(res.lines.length / 2)], res.fontSize);
    expect(firstW).toBeLessThanOrEqual(midW + 4);
    expect(res.fontSize).toBeGreaterThanOrEqual(9);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/content/text-auto-fitter.test.ts`  
Expected: FAIL (`fitDialogue` missing).

- [ ] **Step 3: Bundle `PatrickHand-Regular.woff2`, implement `ComicFontLoader`, elliptical `fitDialogue`, and SFX stroke halo**

- Fetch official SIL-OFL `PatrickHand-Regular.woff2` (Vietnamese + Latin subset, ~35–45 KB) into `public/fonts/PatrickHand-Regular.woff2` + `public/fonts/OFL.txt`; add `"fonts/*"` to `web_accessible_resources` in `manifest.chrome.json` and `manifest.firefox.json`.
- `src/content/overlay/comic-font-loader.ts`: idempotently injects `@font-face { font-family: 'SpeedySlateComic'; src: url('${browser.runtime.getURL('fonts/PatrickHand-Regular.woff2')}') format('woff2'); font-display: swap; }`.
- `TextAutoFitter`: uses a lazy singleton `<canvas>` `ctx.measureText` when running in browser DOM (falling back to script-aware width estimation in Node); for `elliptical: true`, computes usable chord width at line `k` of `N`: `chordW = availW * Math.max(0.58, Math.sqrt(Math.max(0.15, 1 - Math.pow((2 * lineCenterY) / availH - 1, 2) * 0.72)))` and joins balanced `lines.join('\n')` so glyphs never clip curved balloon corners!
- `OverlayStyler.applyStyles`: set `fontFamily: "'SpeedySlateComic', 'Segoe UI', system-ui, sans-serif"`; when `transparentBg && (kind === 'free' || kind === 'sfx')`, apply `-webkit-text-stroke: 3px ${haloColor}`, `paint-order: stroke fill`, and `textShadow: 0 1px 2px rgba(0,0,0,0.35)` so free/SFX text stands out cleanly over artwork.

- [ ] **Step 4: Run tests, type-check, Chrome/Firefox builds & OCR Test Harness check**

Run: `npm test && npm run type-check && npm run build:chrome && npm run build:firefox && npm run build:harness`  
Expected: PASS; verify `dist/chrome/fonts/PatrickHand-Regular.woff2` and `dist/firefox/fonts/PatrickHand-Regular.woff2` exist.

- [ ] **Step 5: Commit**

```bash
git add public/fonts/ manifest.chrome.json manifest.firefox.json src/content/overlay/ tests/content/text-auto-fitter.test.ts
git commit -m "feat(typeset): bundle Vietnamese comic font, elliptical measureText fitter, and SFX stroke halo"
```
