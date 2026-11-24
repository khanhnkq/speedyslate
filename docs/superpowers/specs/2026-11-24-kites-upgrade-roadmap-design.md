# SpeedySlate v2 Full Roadmap Design (Kites Comparative Upgrade — Option C)

**Date:** 2026-11-24  
**Author:** Devin & KhanhNKQ  
**License Invariant:** MIT (100% clean-room implementations from published algorithms/papers & official library docs; zero code copied from GPL-3.0 `Unheat/Kites`).

---

## 1. Intent & Why

SpeedySlate (`v1.3.1`) already excels at being an ultra-lightweight (<500 KB bundle), framework-free, AMO-compliant dual-browser (Chrome MV3 Offscreen + Firefox MV3 Direct Worker) comic translator with DOM overlays, auto-scroll HUD, Multimodal Vision AI mode, and multi-key/multi-provider failover.

A side-by-side audit against `Unheat/Kites` (`v1.5.2`) and official library documentation via **Context7** (`onnxruntime-web`, `PaddleOCR`, `@google/genai`) exposed four concrete bugs/bottlenecks in SpeedySlate and several high-leverage `0 MB` / WebGPU techniques where Kites produces cleaner scanlation quality:

1. **Coordinate Mismatch & JPEG Poisoning (`P0 Bug`):** `TaskProcessor.processOcrTask` compresses images through `compressForVision(img, 1280, 0.78)` even in `hybrid_ocr` mode, while `OverlayRenderer` renders against `img.naturalWidth` (`>1280px`) and `offscreen.ts` overrides `bitmap.width` with `naturalW` — shifting overlays/patches on wide scans and injecting `8×8` JPEG ringing into Otsu masks.
2. **ONNX GPU/WASM Memory Leak & CTC Dict Edge Case (`P0 Bug`):** `PaddleDetEngine`, `ComicDetEngine`, and `PaddleRecEngine` never call `tensor.dispose()` or `session.release()`, and `PaddleRecEngine` overwrites `characters[characters.length - 1] = ' '` instead of appending `' '` after stripping trailing newlines (breaking dictionaries without a trailing blank line such as `ppocrv5_dict.txt` / `ppocrv6_dict.txt`).
3. **Cache Bloat & Near-Limit Files (`P0/P1`):** `TranslationCacheDb` stores uncompressed base64 RGBA patches (~150–300 KB/bubble), and 8 source files sit at 415–488 lines (approaching the hard 500-line ceiling in `AGENTS.md` §2).
4. **Positional Array Drift, LTR-Only Sort, Naive Width Expansion, Voronoi Blur, & RT-DETR WASM Bottleneck (`P1/P2`):** Positional JSON arrays (`["..."]`) shift all subsequent bubbles if an LLM drops/merges one item; `a.box.y - b.box.y` scrambles RTL manga reading order; `BubbleGeometry` widens narrow vertical CJK strips blindly (`1.5×`) instead of finding the real speech bubble chamber; `EraseMasker` uses unweighted BFS + box blur instead of Eikonal Fast Marching; and `OCR_MODEL_PRESETS` lacks WebGPU-native PP-OCRv5/v6 presets and rotated-quad deskewing.

---

## 2. Goals, Non-Goals, and Anti-Goals

### Goals
- **G1 (Foundation & Zero Leaks):** Fix native-coordinate invariance for `hybrid_ocr`, upgrade `onnxruntime-web` to `1.31.1` with strict `tensor.dispose()` + `session.release()` + `powerPreference: 'high-performance'`, shrink IndexedDB patch storage by >85% synchronously via RLE codec, and keep every source file comfortably `< 400` lines.
- **G2 (Translation Integrity & Manga Reading Order):** Replace positional arrays with **Keyed JSON (`{"b0": "..."}`)** backed by Gemini `response_schema` `OBJECT` properties + OpenAI `json_object` (with HTTP 400 prompt-only fallback), deterministic punctuation passthrough, batch chunking (`≤ 20`), RTL/LTR row-band reading order, a 12-rule post-OCR noise/furigana/watermark filter, and an optional 0-key Google Translate fallback provider.
- **G3 (Scanlation-Grade Erase & Typeset on DOM):** Add a `0 MB` CPU **Heuristic Bubble Chamber Extractor** (dual-polarity flood-fill + morphological tail severing), **Telea Fast Marching Method (FMM)** inpainting with dynamic `2–5px` halo dilation, real `ctx.measureText()` + elliptical chord line-wrapping, a bundled local SIL-OFL Vietnamese comic font (`.woff2`), and `paint-order: stroke fill` halo styling for `free`/`sfx` overlays.
- **G4 (Next-Gen WebGPU OCR & Universal Media Discovery):** Ship WebGPU-native **PP-OCRv6 Small Multilingual** (`~29.7 MB`) and **PP-OCRv5 English Mobile** (`~12.0 MB`) `.onnx` presets + optional `det2Url` gap-fill wiring, 4-point min-area-rect polygon extraction + bilinear perspective deskew for tilted text (`|angle| ≥ 4°`), universal `MediaTarget` (`srcset`, `background-image`, hidden backing `<img>`), SPA single-page navigation reset/shield, and `Alt+Shift+X` viewport Screen Crop using existing `activeTab` permission.

### Non-Goals
- Bundling React, Tailwind, Dexie, `@mlc-ai/web-llm` (multi-GB local LLMs), or a full-screen PSD/Studio editor.
- Replacing `<img>.src` with destructively baked full-page PNG blobs (SpeedySlate preserves crisp, zoom-independent DOM overlays).
- Adding multi-megabyte neural inpainting models (LaMa 50 MB / AOT-GAN 60 MB) before evaluating `BubbleFiller` + `Telea FMM`.

### Anti-Goals (Failure even if technically working)
- Breaking **Mozilla Firefox AMO compliance** (`eval`, `new Function`, remote scripts, `world: "MAIN"` content scripts without fallback, obfuscated bundles, or new invasive permissions).
- Any `.ts` file exceeding **500 lines** (`AGENTS.md` §2).
- Copying any code from `Unheat/Kites` (GPL-3.0) or breaking existing `TranslationCacheDb` cached entries (all new `DialogueItem`/`BoundingBox` fields must be optional and backward-compatible).

---

## 3. Global Constraints & Context7 Verified Technical Invariants

1. **File Size & SOLID (`AGENTS.md` §1–2):** Hard cap **500 lines/file**; target **< 380 lines/file** for all touched/created modules.
2. **AMO Dual-Platform MV3 (`AGENTS.md` §3):** `npm run build:chrome`, `npm run build:firefox`, `npm run type-check`, and `npm test` must pass at the end of every phase. No new manifest permissions required (`activeTab`, `storage`, `declarativeNetRequest`, `offscreen` on Chrome already suffice).
3. **ONNX Runtime Web (`onnxruntime-web@1.31.1`, Context7 `/websites/onnxruntime_ai`):**
   - Set `ort.env.webgpu.powerPreference = 'high-performance'` *before* creating the first WebGPU session.
   - Set `ort.env.wasm.numThreads = self.crossOriginIsolated ? Math.min(4, Math.max(1, (self.navigator?.hardwareConcurrency ?? 2) - 1)) : 1` (multi-threading requires `crossOriginIsolated`).
   - Copy `f.startsWith('ort-wasm') && (f.endsWith('.wasm') || f.endsWith('.mjs'))` in `vite.config.ts` so `.jsep.mjs`/`.jsep.wasm` are present locally without bundling 15 MB `ort.*.bundle.min.mjs` duplicates.
   - Copy `Float32Array` output data *before* calling `outputTensor.dispose()` in `try/finally`, and call `await session.release()` when unloading/switching models.
4. **PaddleOCR v4/v5/v6 Contract (Context7 `/paddlepaddle/paddleocr`):**
   - `PP-OCRv5` & `PP-OCRv6` `.onnx` models use `image_shape = [3, 48, W]`, `(v / 255 - 0.5) / 0.5` normalization, and `CTCLabelDecode` with `use_space_char: true`: index `0` = CTC blank, indices `1..L` = dictionary lines (`strip("\r\n")`), index `L + 1` = `' '` (appended, never overwriting line `L`).
   - Always load `.onnx` weights (never `.ort`, which lacks `com.ms.internal.nhwc` kernels for WebGPU EP).
5. **Gemini Structured Keyed JSON (Context7 `/googleapis/js-genai`):**
   - `Type.OBJECT` in `response_schema` must declare non-empty `properties`. Dynamically generate `properties`, `required`, and `propertyOrdering` for active batch keys `["b0", ..., "bN"]`.

---

## 4. Approaches Considered & Selected Direction

1. **Approach A (Pragmatic Core — Phases 0–2):** Fix foundation bugs, Keyed JSON + RTL/noise filter, and 0 MB Bubble Fit + Telea FMM + `measureText`/comic font.
2. **Approach B (Minimal Safe Patch — Phases 0–1):** Foundation fixes + Keyed JSON + RTL/noise filter only.
3. **Approach C (Selected — Full 4-Phase Roadmap, Phases 0–3):** Executes the complete upgrade across four decoupled, independently shippable subsystem plans so each phase leaves SpeedySlate green, benchmarked via `test-harness/`, and production-ready before the next begins.

---

## 5. Decomposition into 4 Subsystem Plans

Because Option C spans four independent subsystems, execution is decomposed into four sequential plans under `docs/superpowers/plans/`:

| Order | Plan File | Subsystem & Deliverable |
| :--- | :--- | :--- |
| **Phase 0** | `2026-11-24-phase0-foundation-vram-refactor.md` | Native OCR image capture & coordinate invariance, `onnxruntime-web@1.31.1` + `tensor.dispose()` / `session.release()` + `CTCLabelDecode` dict fix, synchronous RLE `ErasePatch` codec (`rle1:`), and splitting 5 near-limit files `< 350` lines. |
| **Phase 1** | `2026-11-24-phase1-keyed-json-rtl-filter.md` | Keyed JSON protocol (`b0..bN`) across `PromptBuilder` / Gemini schema / OpenAI `json_object` fallback, deterministic punctuation passthrough + 20-item chunking, 12-rule `OcrNoiseFilter` (furigana, watermarks, tails, strokes), RTL/LTR `ReadingOrderSorter`, and `GoogleFreeProvider` (`google_free`). |
| **Phase 2** | `2026-11-24-phase2-bubble-fit-telea-typeset.md` | `0 MB` `BubbleChamberExtractor` (dual-polarity flood-fill + morphological tail severing), `TeleaInpainter` (Eikonal FMM + `2–5px` dynamic halo dilation), bundled SIL-OFL Vietnamese comic font (`.woff2`), real `ctx.measureText` + elliptical chord wrapping in `TextAutoFitter`, and `paint-order: stroke fill` halo for `free`/`sfx`. |
| **Phase 3** | `2026-11-24-phase3-ppocrv6-polygon-mediatarget.md` | WebGPU-native `PP-OCRv6 Small` & `PP-OCRv5 English` presets + `det2Url` supplementary DBNet support, 4-point min-area-rect `PolygonExtractor` + bilinear `PerspectiveDeskew` (`|angle| ≥ 4°`) + polygon-clipped erase masks, universal `MediaTargetResolver` + `SpaOverlayShield`, and `Alt+Shift+X` `ScreenCropOverlay`. |

---

## 6. Builder Decisions (Resolved Upfront)

- **Clean-room Comic Font Choice (Builder Call):** Bundle **Patrick Hand** (SIL Open Font License 1.1, Latin + full Vietnamese diacritics, ~38 KB `.woff2`) at `public/fonts/PatrickHand-Regular.woff2`, exposed via `web_accessible_resources` (`"fonts/*"`) in both Chrome and Firefox manifests, with `'Patrick Hand', 'Segoe UI', system-ui, sans-serif` stack.
- **Google Free Fallback Behavior (Builder Call):** Add `'google_free'` as both a selectable zero-setup `ProviderType` in Popup AND an opt-in automatic last-resort fallback (`enableFreeFallback: true` default in `DEFAULT_SETTINGS`) inside `MultiProviderRotator` when all configured LLM providers fail or have zero keys.
- **Screen Crop Transport (Builder Call):** Trigger via `Alt+Shift+X` (with editable-input guard) or HUD `⋯` menu item `"Khoanh vùng dịch màn hình"`; content script draws selection rect (`devicePixelRatio`-scaled), sends `CAPTURE_VISIBLE_TAB` to background (`browser.tabs.captureVisibleTab`), crops the selection, runs standard `TRANSLATE_IMAGE`, and mounts a dismissible/draggable overlay container pinned to document scroll coordinates.
- **`AntigravityProvider` Parity (Builder Call):** Wire `PromptBuilder` + `KeyedJson` into `AntigravityProvider.translateDialogues` (`src/services/translation/antigravity-provider.ts`) so Antigravity shares glossary, chapter memory, SFX filtering, and Keyed JSON positional safety while trimming duplicate inline prompt text.
- **Backward-Compatible `det2Url` Model Status (Builder Call):** `ModelDbService.getModelStatus` requires `'det'`, `'rec'`, and `'keys'` for `'ready'`; optional `'det2'` (`OcrModelPreset.files.det2Url`) is downloaded when present on new installs and returned via `getModelBuffers` if stored, without invalidating already-downloaded v1 models.
- **Font Bundling Path (Builder Call):** Vite's `publicDir: 'public'` copies `public/fonts/PatrickHand-Regular.woff2` to `dist/{chrome,firefox}/fonts/`, and both `manifest.chrome.json` and `manifest.firefox.json` expose `"fonts/*"` under `web_accessible_resources`.
