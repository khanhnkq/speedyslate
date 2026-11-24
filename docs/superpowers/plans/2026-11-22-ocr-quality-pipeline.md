# OCR → Erase → Translate Quality Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Nâng độ chính xác OCR (batch rec, text nền tối, text dọc CJK, tiling ComicDet), làm sạch vùng xóa text (màu nền thật + patch per-line), và cải thiện bản dịch (confidence/kind context, glossary, chapter memory, SFX filter).

**Architecture:** Pipeline hiện tại: `det engine (DBNet | RT-DETR) → PaddleRecEngine (per-box, CTC greedy) → BubbleAggregator → TranslationProvider → OverlayRenderer`. Plan này thêm `ColorSampler`, `RecBatcher`, `VerticalText`, `ErasePatcher`, `PromptBuilder` — mỗi file một trách nhiệm (SRP), thay đổi type mở rộng (`DialogueItem` += confidence/kind/bgColor/lineBoxes/isVertical) giữ tương thích cache cũ (mọi field mới đều optional).

**Tech Stack:** TypeScript, onnxruntime-web 1.21 (WebGPU + WASM fallback), WebExtension MV3 (Chrome offscreen + Firefox direct worker), Vite, vitest (mới — chỉ devDep, test pure helpers trong Node).

**Spec:** `ocr-improvement-plan.md` (root) — outline + phân tích hiện trạng đã được duyệt.

## Global Constraints

- Mọi file TS **< 500 dòng**; file tiệm cận 400 thì tách helper (AGENTS.md §2).
- AMO: không `eval`/remote code; model ONNX chỉ tải qua `ModelDbService` (IndexedDB), không fetch runtime.
- Mọi field mới trên `DialogueItem`/`BoundingBox` phải **optional** — cache cũ trong `TranslationCacheDb` vẫn render được (fallback path hiện tại).
- Không đổi signature public trừ khi plan ghi rõ; `translateDialogues` chỉ được **thêm optional param**.
- `DialogueKind = 'dialogue' | 'sfx' | 'free'` — dùng chung cho `BoundingBox.kind` và `DialogueItem.kind`.
- Verification mặc định mỗi task: `npm run type-check` + `npm run test` (vitest) + bước manual ghi rõ.

## Review Focus

1. Rec ONNX model có thể không hỗ trợ dynamic batch dim → Task 3 phải probe bằng 1 run batch=2 rồi fallback sequential, không crash.
2. Heuristic `isDark` sai trên nền art nhiều màu → invert làm hỏng rec → Task 2 chỉ retry-invert khi confidence < 0.45, và Task 1 sampler trả về `lumaStdDev` để caller quyết định.
3. Rotate 90° trên box không phải vertical thật (narrator box cao hẹp) → Task 4 chỉ kích hoạt khi model rec là CJK (`japan|korean|chinese|cjk` trong modelId) VÀ `h/w > 1.6`.
4. `bgColor` sample trên viền box có art phức tạp → median nhiễu → Task 8 fallback `isDark` binary khi `lumaStdDev > 60`.
5. Cache cũ thiếu `lineBoxes`/`bgColor`/`kind` → renderer/sampler phải `undefined`-safe, giữ nguyên render path hiện tại.

---

### Task 1: Test infra + shared types + ColorSampler

**Files:**
- Modify: `package.json` (script `"test": "vitest run"`, devDep `vitest`)
- Modify: `src/shared/types.ts` (BoundingBox.kind; DialogueItem: confidence/kind/bgColor/isVertical/lineBoxes; DialogueTranslateContext; ExtensionSettings: glossary/translateSfx)
- Create: `src/worker/color-sampler.ts`
- Test: `tests/worker/color-sampler.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export type DialogueKind = 'dialogue' | 'sfx' | 'free';
  export interface PixelRegion { data: Uint8ClampedArray; width: number; height: number; }
  export class ColorSampler {
    static analyzeRegion(r: PixelRegion, ringFrac?: number): { isDark: boolean; bgHex: string; luma: number; lumaStdDev: number };
  }
  export interface DialogueTranslateContext {
    items?: DialogueItem[]; glossary?: string; chapterContext?: string[]; translateSfx?: boolean;
  }
  ```
  `analyzeRegion`: sample ring ngoài (perimeter, dày `ringFrac` mặc định 0.18 của min(w,h)); trả về **median** RGB → `bgHex` `#RRGGBB`; luma = `0.299R+0.587G+0.114B`; `isDark = luma < 105`; `lumaStdDev` trên tập sample.

- [ ] **Step 1:** `npm i -D vitest` + thêm script `"test": "vitest run"`. Chạy `npm run test` → pass (no tests) hoặc "no test files" — ghi nhận baseline.
- [ ] **Step 2:** Viết `tests/worker/color-sampler.test.ts` failing: region toàn trắng → `isDark=false`, `bgHex='#ffffff'`, `lumaStdDev≈0`; nửa trắng nửa đen theo viền → median đúng; lumaStdDev cao khi perimeter noise ngẫu nhiên (seeded RNG).
- [ ] **Step 3:** Implement `types.ts` additions + `color-sampler.ts` (median qua sort trên 3 channel riêng; step sample `x+=3` như `detectDarkBackground` hiện tại).
- [ ] **Step 4:** `npm run test && npm run type-check` → pass.
- [ ] **Step 5:** Commit `feat(ocr): add color sampler + extended dialogue types`.

### Task 2: Rec — invert text nền tối + confidence + low-conf retry

**Files:**
- Modify: `src/worker/paddle-rec.ts` (dùng `ColorSampler.analyzeRegion` thay `detectDarkBackground`; invert RGB khi cần; gắn `confidence`, `bgColor`, `isDarkBackground` lên DialogueItem)
- Test: `tests/worker/` — không đủ pure surface để test trong Node (crop cần OffscreenCanvas); verification chủ yếu manual + type-check. *(Giữ `recognizeBoxes` < 500 dòng: nếu vượt ~400, tách crop-prep sang `src/worker/rec-crop.ts`.)*

**Interfaces:**
- Consumes: `ColorSampler.analyzeRegion` (Task 1).
- Produces: `DialogueItem.confidence` (avg CTC score đã có sẵn), `bgColor`, logic invert private trong `paddle-rec.ts`.

- [ ] **Step 1:** Trong `recognizeBoxes`, sau `getImageData`: gọi `ColorSampler.analyzeRegion` → `{isDark, bgHex, lumaStdDev}`; nếu `isDark` → invert `data[i]=255-v` cho 3 kênh trước `imageToRecTensor`. Nếu `lumaStdDev > 60` (nền art nhiễu) → không invert, giữ nguyên.
- [ ] **Step 2:** Low-conf retry: sau `ctcDecode`, nếu `confidence < 0.45` và chưa invert → build tensor variant ngược lại (invert nếu !isDark, hoặc không invert nếu đã invert) → decode → giữ kết quả confidence cao hơn. Ghi `item.confidence`, `bgColor`, `isDarkBackground=isDark`.
- [ ] **Step 3:** `npm run type-check`. Manual: build firefox, test 1 trang manhwa có bubble nền đen → chữ trắng/nền đen đọc đúng hơn trước.
- [ ] **Step 4:** Commit `feat(ocr): invert dark-bg crops + confidence capture + low-conf retry`.

### Task 3: Rec — batch inference theo bucket width

**Files:**
- Create: `src/worker/rec-batcher.ts` (pure: bucket assignment + merge tensors)
- Modify: `src/worker/image-utils.ts` (`imageToRecTensorBatch(datas: ImageData[], bucketW, targetH): ort.Tensor` — pad phải với **0.0** post-normalization ≈ mid-gray 127.5)
- Modify: `src/worker/paddle-rec.ts` (`recognizeBoxes` dùng batcher)
- Test: `tests/worker/rec-batcher.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export class RecBatcher {
    static assignBuckets(widths: number[], buckets?: number[]): Map<number, number[]>; // bucketW -> box indices
    static concatTensors(tensors: Float32Array[], widths: number[], bucketW: number, targetH: number): Float32Array;
  }
  ```
  `BUCKETS = [64, 128, 256, 512, 960]`; box width > 960 vẫn downscale về 960 như hiện tại; `MAX_BATCH = 8`.

- [ ] **Step 1:** Failing test `rec-batcher.test.ts`: `assignBuckets([40,70,300,900])` → `{64:[0],128:[1],512:[2],960:[3]}`; `concatTensors` pad đúng 0.0 phần dư.
- [ ] **Step 2:** Implement `rec-batcher.ts` + `imageToRecTensorBatch`.
- [ ] **Step 3:** `recognizeBoxes`: prepare mọi crop ImageData trước (giữ map index→crop), group theo bucket, mỗi nhóm ≤8 → 1 `session.run` `[B,3,48,bucketW]`; decode từng row (seqLen đọc từ `dims`); giữ nguyên thứ tự output theo index gốc.
- [ ] **Step 4:** Dynamic-batch probe: lần đầu chạy batch wrap try/catch — lỗi → set flag `batchSupported=false`, fallback loop tuần tự (code path cũ). Log 1 dòng qua `console.warn`.
- [ ] **Step 5:** `npm run test && npm run type-check`. Manual: đo `console.time` rec trên trang ~30 box — kỳ vọng ≥3× nhanh hơn.
- [ ] **Step 6:** Commit `perf(ocr): batched recognition by width bucket`.

### Task 4: Vertical text CJK

**Files:**
- Create: `src/worker/vertical-text.ts`
- Modify: `src/worker/paddle-rec.ts` (rotate crop trước tensor; set `isVertical`), `src/worker/ocr.worker.ts` (truyền `isCjkModel` vào RecEngine constructor), `src/worker/bubble-aggregator.ts` (nhóm cột cho `isVertical`)
- Test: `tests/worker/bubble-aggregator.test.ts` (mới — case vertical columns)

**Interfaces:**
- Produces:
  ```ts
  export class VerticalText {
    static isVerticalCandidate(box: BoundingBox, isCjk: boolean): boolean; // isCjk && box.h > box.w*1.6
    static rotateCropCCW(src: ImageData): ImageData; // w,h hoán đổi; top-of-column -> left
    static groupColumns(items: DialogueItem[]): void; // in-place reorder text right->left khi aggregate
  }
  ```
  `PaddleRecEngine` constructor mới: `(session, keysText, opts?: { isCjkModel?: boolean })`; worker set `isCjkModel = /japan|korean|chinese|cjk/i.test(modelId)`.

- [ ] **Step 1:** Failing test aggregator: 3 item `isVertical` cột liền kề (x giảm dần) → gộp 1 bubble, `originalText` join theo thứ tự x **giảm dần** (phải→trái), `lineBoxes` đủ 3.
- [ ] **Step 2:** `vertical-text.ts`: `isVerticalCandidate` + `rotateCropCCW` (vòng lặp index: `dst[(x*h2 + (h-1-y))*4]` — kiểm tra mapping bằng test nhỏ 2×1). Rec: box vertical → `rotateCropCCW` crop → resize rec bình thường → `item.isVertical=true`.
- [ ] **Step 3:** Aggregator: tách items `isVertical` → group theo cột: font-width tương đồng (`wRatio ≥ 0.45`), gap ngang ≤ `2.8×width`, overlap dọc ≥ 25% hoặc centerY diff ≤ 45%; join text sort `x desc`. Non-vertical giữ path cũ.
- [ ] **Step 4:** `npm run test && npm run type-check`. Manual: trang manga RAW cột dọc → ra text đúng thứ tự.
- [ ] **Step 5:** Commit `feat(ocr): CJK vertical text column support`.

### Task 5: Worker perf — ComicDet tiling + WASM threads

**Files:**
- Modify: `src/worker/strip-slicer.ts`, `src/worker/ocr.worker.ts`, `src/worker/comic-det.ts` (chỉ expose flag nếu cần)
- Test: `tests/worker/strip-slicer.test.ts` (pure: `computeSliceHeights(width,height,aspectCap)`)

**Interfaces:**
- Produces: `StripSlicer.computeSliceHeights(width, height, opts): {startY, h}[]` (pure); `detectWithSlicing(canvas,w,h,engine,opts?: {maxSliceHeight?, aspectCap?})` — với `aspectCap`, sliceH = `clamp(width*aspectCap, 640, maxSliceHeight)`.
- Worker: `aspectCap = detEngine instanceof ComicDetEngine ? 1.8 : undefined`; `ort.env.wasm.numThreads = Math.min(4, Math.max(1, (self.navigator?.hardwareConcurrency ?? 2) - 1))`.

- [ ] **Step 1:** Failing test: `computeSliceHeights(800, 5000, {aspectCap:1.8, maxSliceHeight:2000, overlap:200})` → sliceH = 1440, starts `0,1240,2480,3720` + phần dư.
- [ ] **Step 2:** Implement `computeSliceHeights` + `aspectCap` trong `detectWithSlicing` (giữ dedupe IoU>0.35 trong vùng overlap).
- [ ] **Step 3:** `ocr.worker.ts`: truyền `aspectCap` khi engine là ComicDet + đổi `numThreads` theo `hardwareConcurrency`.
- [ ] **Step 4:** `npm run test && npm run type-check`. Manual: strip 800×6000 ComicDet — trước/sau so sánh số bubble bắt được.
- [ ] **Step 5:** Commit `perf(ocr): aspect-capped slicing for RT-DETR + adaptive wasm threads`.

### Task 6: Metadata plumbing — kind tagging + lineBoxes + aggregator

**Files:**
- Modify: `src/worker/comic-det.ts` (tag `box.kind`: label 1→`dialogue`, label 2→`sfx`, bubble-fallback→`dialogue`), `src/worker/paddle-det.ts` (`kind:'dialogue'`), `src/worker/paddle-rec.ts` (copy `box.kind` → item; khi không có → `'dialogue'`), `src/worker/bubble-aggregator.ts` (bubble.kind = majority; `lineBoxes` = boxes thành viên đã sort; `confidence` = mean)
- Test: `tests/worker/bubble-aggregator.test.ts` (thêm case kind majority + lineBoxes)

**Interfaces:**
- Consumes: `BoundingBox.kind` (Task 1 types).
- Produces: `DialogueItem.kind`, `lineBoxes`, `confidence` — renderer (Task 8/9) và prompt-builder (Task 9) dùng.

- [ ] **Step 1:** Failing test: group 3 lines (2 `sfx` + 1 `dialogue`) → bubble `kind='sfx'`; `lineBoxes.length===3` sort theo y.
- [ ] **Step 2:** Implement tagging + aggregator fields. `paddle-det.ts` merge step giữ `kind` từ member box đầu.
- [ ] **Step 3:** `npm run test && npm run type-check`.
- [ ] **Step 4:** Commit `feat(ocr): propagate kind/confidence/lineBoxes metadata`.

### Task 7 — Phase 2: Overlay màu nền thật

**Files:**
- Modify: `src/worker/paddle-rec.ts` (gắn `bgHex` từ `analyzeRegion` → `item.bgColor`), `src/worker/bubble-aggregator.ts` (bubble `bgColor` = median của member bgHex — majority vote theo hex string phổ biến nhất), `src/content/overlay/overlay-renderer.ts` (truyền `item.bgColor`), `src/content/overlay/overlay-styler.ts` (param `bgColor?`)
- Test: `tests/worker/bubble-aggregator.test.ts` (bgColor majority)

**Interfaces:**
- Consumes: `ColorSampler` (T1), `DialogueItem.bgColor` (T2/T6).
- `OverlayStyler.applyStyles(bubble, coords, fontSize, isDark, bgColor?: string)`: nếu `bgColor` hợp lệ và `theme` resolve là auto → `backgroundColor = bgColor`; `color = luma(bgColor) < 140 ? '#ffffff' : '#000000'` (ghi đè isDark). Parse hex helper private `hexToLuma()`.

- [ ] **Step 1:** Failing test aggregator: members bgHex `['#fff8e7','#fff8e7','#111111']` → bubble `'#fff8e7'`.
- [ ] **Step 2:** Implement pipeline bgColor end-to-end; guard `lumaStdDev > 60` → bỏ bgColor (fallback isDark binary cũ).
- [ ] **Step 3:** `npm run test && npm run type-check`. Manual: trang webtoon bubble kem → overlay trùng màu, không còn trắng cứng.
- [ ] **Step 4:** Commit `feat(overlay): sample true bubble background color`.

### Task 8 — Phase 2: Xóa theo từng dòng (ErasePatcher)

**Files:**
- Create: `src/content/overlay/erase-patcher.ts`
- Modify: `src/content/overlay/overlay-renderer.ts`, `src/content/overlay/overlay-styler.ts` (hỗ trợ `transparentBg` option)

**Interfaces:**
- Produces:
  ```ts
  export class ErasePatcher {
    static renderPatches(wrapper: HTMLElement, lines: BoundingBox[], naturalW: number, naturalH: number, bgHex: string): void;
  }
  ```
  Mỗi line box → `div.speedyslate-erase-patch`: absolute, `%` coords, `bgHex`, `borderRadius: 6px`, pad mỗi chiều +4px, `zIndex: 49` (dưới bubble text 50).

- [ ] **Step 1:** Renderer: nếu `item.kind !== 'dialogue'` (sfx/free) **và** `item.lineBoxes?.length` → `ErasePatcher.renderPatches` + text bubble với `background:'transparent'` (param mới trong applyStyles). Ngược lại path hiện tại. Cache cũ không có lineBoxes → luôn path cũ.
- [ ] **Step 2:** `npm run type-check`. Manual: SFX trên nền vẽ → text gốc bị xóa theo từng dòng, art giữa các dòng còn nguyên; bản dịch SFX vẫn đọc được trên patch.
- [ ] **Step 3:** Commit `feat(overlay): per-line erase patches for sfx/free text`.

### Task 9 — Phase 3: PromptBuilder + rich context (confidence/kind/SFX)

**Files:**
- Create: `src/services/translation/prompt-builder.ts`
- Modify: `src/services/translation/translation-provider.interface.ts` (`translateDialogues` += `ctx?: DialogueTranslateContext`), `gemini-provider.ts`, `openai-provider.ts`, `multi-provider-rotator.ts` (pass ctx), `src/background/index.ts` (build ctx trong `TRANSLATE_DIALOGUES` + `TRANSLATE_IMAGE`)
- Test: `tests/services/prompt-builder.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export interface BuiltDialoguePrompt { systemPrompt: string; userPayload: string; sendMap: number[] }
  export class PromptBuilder {
    static buildDialogue(items: {text: string; confidence?: number; kind?: DialogueKind}[],
      targetLang: string, sourceLang: string | undefined,
      ctx?: {glossaryPairs?: [string,string][]; chapterContext?: string[]; translateSfx?: boolean}): BuiltDialoguePrompt;
    static parseGlossary(raw?: string): [string,string][]; // "Term = Translation" per line, bỏ dòng trống/#comment
  }
  ```
  `sendMap`: index câu gốc → index trong payload. Khi `translateSfx === false`: lọc `kind==='sfx'` khỏi payload, map lại `""` ở caller. `userPayload` = JSON `[{t, c?, k?}]` (`c` = confidence làm tròn 2 số, chỉ khi < 0.6; `k` chỉ khi ≠ 'dialogue').

- [ ] **Step 1:** Failing tests: `parseGlossary("A = B\n#x\nC=D")` → `[['A','B'],['C','D']]`; `buildDialogue` với `translateSfx:false` loại item sfx khỏi `sendMap`; systemPrompt chứa block glossary khi có pairs + hướng dẫn sửa low-confidence khi có `c`.
- [ ] **Step 2:** Implement `prompt-builder.ts` (systemPrompt giữ nguyên rules hiện tại + 2 mục mới: glossary verbatim, "field `c` là độ tin cậy OCR — khi thấp hãy tự sửa typo bằng context"; chapterContext render dạng `EN => VI`).
- [ ] **Step 3:** `gemini-provider.ts` + `openai-provider.ts`: dùng `PromptBuilder.buildDialogue` khi `ctx?.items` có mặt (map `texts` ↔ items theo index); giữ prompt cũ khi không có ctx. Rotator + interface + background truyền `{items: dialogues, glossary, chapterContext, translateSfx}`.
- [ ] **Step 4:** Background `TRANSLATE_DIALOGUES`/`TRANSLATE_IMAGE`: trước khi gọi provider, nếu `!settings.translateSfx` → lọc sfx theo `sendMap` (hoặc lọc trực tiếp items, đơn giản hơn: gọi `PromptBuilder` ở background? — **Không**: giữ filter trong provider qua buildDialogue; background chỉ truyền ctx). Kết quả `""` cho sfx như cơ chế watermark hiện tại.
- [ ] **Step 5:** `npm run test && npm run type-check`. Manual: trang có SFX "BOOM" → không dịch/không overlay khi `translateSfx=false`.
- [ ] **Step 6:** Commit `feat(translate): rich dialogue context prompt + sfx filtering`.

### Task 10 — Phase 3: Glossary + chapter memory + settings UI

**Files:**
- Modify: `src/shared/presets.ts` (`DEFAULT_SETTINGS += glossary: '', translateSfx: false`), `src/background/index.ts` (chapter memory Map), `src/popup/popup.html` + `src/popup/popup.ts` (UI)
- Test: `tests/services/prompt-builder.test.ts` (đã cover glossary ở T9)

**Interfaces:**
- `ExtensionSettings.glossary: string` (textarea lines `"Term = Translation"`); `translateSfx: boolean`.
- Chapter memory: `const chapterMemory = new Map<string, string[]>()` trong `background/index.ts`; key = `chapterUrl || imageUrl`; mỗi cặp `"${original} => ${translated}"`, giữ tối đa **10** cuối (FIFO shift); Map cap **20** keys (xóa key cũ nhất).
- UI ids: `input-glossary` (textarea), `toggle-translate-sfx` (checkbox) — cùng section với `select-theme`/`input-rate-limit`; bind trong `loadForm` + `saveCurrentFormToSettings` theo pattern hiện có (`getElementById` + `settings.X = input.value` + `StorageService.saveSettings`).

- [ ] **Step 1:** `presets.ts` + `types.ts` defaults (types đã có từ T1 — chỉ defaults).
- [ ] **Step 2:** `background/index.ts`: sau mỗi translate thành công → push pairs vào `chapterMemory`; trước khi dịch → `ctx.chapterContext = chapterMemory.get(key)`.
- [ ] **Step 3:** popup.html thêm 2 control; popup.ts bind + save (theo pattern `bubbleTheme`/`rateLimitDelayMs` ~line 450).
- [ ] **Step 4:** `npm run type-check`. Manual: đặt glossary `Kai = Cai`; dịch 2 trang liên tiếp — tên nhân vật nhất quán; SFX toggle hoạt động.
- [ ] **Step 5:** Commit `feat(translate): glossary + chapter context memory + settings UI`.

### Task 11: Verification tổng

- [ ] **Step 1:** `npm run test && npm run type-check` → sạch.
- [ ] **Step 2:** `npm run build:chrome && npm run build:firefox` → pass, bundle không lỗi.
- [ ] **Step 3:** Checklist manual: (a) trang toonhey strip dài — rec nhanh hơn, overlay trùng màu bubble; (b) trang manga RAW cột dọc; (c) bubble nền đen; (d) SFX on/off; (e) glossary consistency qua 2 trang.
- [ ] **Step 4:** Kiểm tra file-size limit: `wc -l src/worker/*.ts src/content/overlay/*.ts src/services/translation/*.ts` — không file nào ≥ 500.
- [ ] **Step 5:** Commit `chore: verify ocr quality pipeline` (nếu có thay đổi).

---

## Self-Review Notes

- **Spec coverage:** T1–T11 của `ocr-improvement-plan.md` đều có task tương ứng (T5+T6 gộp; T7→Task 7; T8→Task 8; T9/T10→Task 9/10; T11→Task 11). PP-OCRv5 preset nằm ngoài scope — ghi ở Notes spec.
- **Type consistency:** `DialogueKind`, `PixelRegion`, `RecBatcher`, `VerticalText`, `ErasePatcher`, `PromptBuilder`, `DialogueTranslateContext` — tên/signature thống nhất xuyên task.
- **Không phá cache:** mọi field mới optional; renderer/overlay fallback về behavior hiện tại khi thiếu field.
