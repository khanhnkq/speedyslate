# Phase 1: Keyed JSON Protocol, Manga Reading Order, 12-Rule Noise Filter & Free Fallback Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate positional array translation drift via Keyed JSON (`{"b0": "..."}`), enforce Manga RTL vs Webtoon LTR row-band reading order, strip furigana/watermarks/tail artifacts before translation, and add a zero-key Google Translate fallback.

**Architecture:** `KeyedJson` encodes up to 20 dialogue items per chunk as `{"b0": ...}`, skips punctuation-only lines deterministically (`sendMap[i] = -2`), generates Gemini `response_schema` `OBJECT` properties (`required` + `propertyOrdering`), and maps returned keys independently so a dropped key never shifts neighbors. `OcrNoiseFilter` and `ReadingOrderSorter` run inside `BubbleAggregator` / `ocr-worker-client` / `offscreen` so all providers and `chapter-memory` receive clean bubbles in natural speaker sequence. `GoogleFreeProvider` (`google_free`) implements `ITranslationProvider` and serves as both a standalone zero-key preset and `MultiProviderRotator`'s optional final rescue tier.

**Tech Stack:** TypeScript 5.7, Vitest, Gemini Structured Outputs (`OBJECT` schema), OpenAI `json_object`, WebExtension MV3.

**Spec:** `docs/superpowers/specs/2026-11-24-kites-upgrade-roadmap-design.md` (requires Phase 0 complete).

## Global Constraints

- Every `.ts` file strictly **< 500 lines** (target **< 380 lines**).
- AMO Compliance: no remote code, no new manifest permissions (`https://*/*` host permissions already cover `translate.googleapis.com`).
- Public `ITranslationProvider.translateDialogues(texts, targetLang, sourceLang?, ctx?)` signature remains unchanged (LSP).
- Context7 Gemini `response_schema` rule: `Type.OBJECT` must never be sent with empty `properties`; when all items in a call are deterministic passthroughs (`keys.length === 0`), return immediately without calling the network!

## Review Focus

1. Every input line in a page is punctuation/ellipsis (`["...", "!?"]`) → `keys.length === 0` must short-circuit before network calls so Gemini never receives an empty `OBJECT` schema (HTTP 400).
2. LLM omits key `"b1"` or merges it into `"b0"` (`{"b0": "Hello world", "b2": "Bye"}`) → `"b2"` must still land at index 2 (zero shift!), while missing `"b1"` falls back cleanly to original text.
3. Tall webtoon strip produces 34 bubbles on one slice → chunker splits into `[20, 14]` batches (`b0..b19`, then `b0..b13`) so small/fast models never truncate output keys.
4. Furigana suppression false-positive risk: short dialogue `"えっ"` next to an SFX must NOT be deleted unless it sits directly parallel/adjacent (`gap <= parentWidth * 0.6`) to a Kanji-containing (`[\u4E00-\u9FFF]`) line AND its stroke width/height is `< 0.48×` the Kanji parent.
5. Mixed Chinese pages: modern Chinese webtoons are horizontal (LTR), whereas traditional HK/TW manhua are vertical (RTL) → `ReadingOrderSorter` resolves `'rtl'` for Chinese/auto ONLY when `verticalCount > 0 && verticalCount >= horizontalCount` (or Kana is present).

---

### Task 1: Keyed JSON Protocol, Deterministic Passthrough & 20-Item Batching

**Files:**
- Create: `src/services/translation/keyed-json.ts`
- Modify: `src/services/translation/prompt-builder.ts:1-158`
- Modify: `src/services/translation/gemini-provider.ts:27-131`
- Modify: `src/services/translation/openai-provider.ts:25-135`
- Modify: `src/services/translation/antigravity-provider.ts:53-125`
- Modify: `tests/services/prompt-builder.test.ts`
- Test: `tests/services/keyed-json.test.ts`

**Interfaces:**
- Produces:
  ```ts
  // src/services/translation/keyed-json.ts
  export const MAX_DIALOGUE_BATCH_SIZE = 20;
  export class KeyedJson {
    static isPassthroughOnly(text: string): boolean;
    static buildKeyedPayload(entries: { t: string; c?: number; k?: DialogueKind }[]): {
      keys: string[];
      payloadJson: string;
    };
    static buildGeminiObjectSchema(keys: string[]): {
      type: 'OBJECT';
      properties: Record<string, { type: 'STRING' }>;
      required: string[];
      propertyOrdering: string[];
    };
    static parseKeyedResponse(rawText: string, keys: string[]): (string | undefined)[];
    static chunkArray<T>(items: T[], maxChunk?: number): T[][];
  }
  ```

- [ ] **Step 1: Write failing tests in `tests/services/keyed-json.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { KeyedJson } from '../../src/services/translation/keyed-json';
import { PromptBuilder } from '../../src/services/translation/prompt-builder';

describe('KeyedJson & PromptBuilder', () => {
  it('preserves exact positional alignment even when LLM drops a middle key', () => {
    const parsed = KeyedJson.parseKeyedResponse('{"b0": "Chào", "b2": "Tạm biệt"}', ['b0', 'b1', 'b2']);
    expect(parsed).toEqual(['Chào', undefined, 'Tạm biệt']);
  });

  it('marks punctuation-only strings as passthrough (-2) and emits zero LLM keys when all passthrough', () => {
    const built = PromptBuilder.buildDialogue(
      [{ text: '...' }, { text: '?!' }],
      'Tiếng Việt',
      'Japanese'
    );
    expect(built.keys).toEqual([]);
    expect(PromptBuilder.remapResults([], built.sendMap, ['...', '?!'])).toEqual(['...', '?!']);
  });

  it('builds non-empty Gemini OBJECT schema with required and propertyOrdering', () => {
    const schema = KeyedJson.buildGeminiObjectSchema(['b0', 'b1']);
    expect(schema).toEqual({
      type: 'OBJECT',
      properties: { b0: { type: 'STRING' }, b1: { type: 'STRING' } },
      required: ['b0', 'b1'],
      propertyOrdering: ['b0', 'b1']
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/services/keyed-json.test.ts`  
Expected: FAIL (`keyed-json` module missing).

- [ ] **Step 3: Implement `KeyedJson` and wire into `PromptBuilder`, `GeminiProvider`, `OpenAIProvider`, and `AntigravityProvider`**

- `KeyedJson.isPassthroughOnly(text)`: returns `true` when trimmed text is non-empty and contains zero Unicode letters `!/\p{L}/u.test(trimmed)` AND length `<= 8` (e.g., `"..."`, `"!?"`, `"—"`), while pure junk `"|"` / `"---"` returns `""` via noise filter.
- `PromptBuilder.buildDialogue`: `sendMap[i] = -1` (skipped SFX → `""`), `-2` (passthrough → keep `origTexts[i].trim()`), or `>= 0` (`keys = ["b0", ...]`). Overload `remapResults(results: (string | undefined)[], sendMap: number[], totalOrOrigTexts: number | string[]): string[]` so existing numeric callers (`total: number`) remain 100% compatible while `string[]` callers recover `origTexts[i].trim()` for `-2` passthroughs and `undefined` missing keys.
- Chunk calls over `MAX_DIALOGUE_BATCH_SIZE = 20` sequentially inside `GeminiProvider`, `OpenAIProvider`, and `AntigravityProvider`; short-circuit immediately with `remapResults([], built.sendMap, batchTexts)` when `built.keys.length === 0`.

- [ ] **Step 4: Run tests & type-check**

Run: `npx vitest run tests/services/keyed-json.test.ts tests/services/prompt-builder.test.ts && npm run type-check`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/services/translation/keyed-json.ts src/services/translation/prompt-builder.ts src/services/translation/gemini-provider.ts src/services/translation/openai-provider.ts src/services/translation/antigravity-provider.ts tests/services/keyed-json.test.ts tests/services/prompt-builder.test.ts
git commit -m "feat(translation): adopt Keyed JSON protocol with passthrough and 20-item chunking"
```

---

### Task 2: 12-Rule Post-OCR Noise, Watermark & Furigana Filter

**Files:**
- Create: `src/worker/ocr-noise-filter.ts`
- Modify: `src/worker/bubble-aggregator.ts:22-52`
- Test: `tests/worker/ocr-noise-filter.test.ts`

**Interfaces:**
- Produces:
  ```ts
  // src/worker/ocr-noise-filter.ts
  export class OcrNoiseFilter {
    static filterRawLines(items: DialogueItem[], imageWidth: number, imageHeight: number): DialogueItem[];
    static stripTrailingWatermark(text: string): string;
  }
  ```

- [ ] **Step 1: Write failing tests in `tests/worker/ocr-noise-filter.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { OcrNoiseFilter } from '../../src/worker/ocr-noise-filter';
import { DialogueItem } from '../../src/shared/types';

const mk = (id: string, text: string, x: number, y: number, w: number, h: number, vert = false): DialogueItem => ({
  id, originalText: text, box: { x, y, width: w, height: h }, confidence: 0.85, isVertical: vert
});

describe('OcrNoiseFilter', () => {
  it('drops thought-bubble circle tails, speedlines, and scanlator watermark lines', () => {
    const items = [
      mk('1', 'o O ○', 100, 100, 30, 40),
      mk('2', '一丨─', 120, 200, 40, 20),
      mk('3', 'Read first at toonhey.com', 50, 10, 400, 28),
      mk('4', 'やめろ！ colamanga.com', 200, 300, 180, 32)
    ];
    const kept = OcrNoiseFilter.filterRawLines(items, 800, 1200);
    expect(kept.map((k) => k.originalText)).toEqual(['やめろ！']);
  });

  it('suppresses tiny kana furigana alongside a Kanji parent but keeps standalone kana dialogue', () => {
    const kanjiParent = mk('p', '約束の場所', 500, 100, 36, 220, true);
    const furigana = mk('f', 'やくそく', 538, 105, 14, 95, true); // width 14 < 36 * 0.48
    const realKanaShout = mk('s', 'えっ', 200, 400, 34, 68, true);
    const kept = OcrNoiseFilter.filterRawLines([kanjiParent, furigana, realKanaShout], 800, 1200);
    expect(kept.map((k) => k.id)).toEqual(['p', 's']);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/worker/ocr-noise-filter.test.ts`  
Expected: FAIL (`ocr-noise-filter` missing).

- [ ] **Step 3: Implement `OcrNoiseFilter` and call it at the entry of `BubbleAggregator.aggregateDialogues`**

Implement clean-room rules in `src/worker/ocr-noise-filter.ts`:
1. Micro-box (`w < 8 || h < 8`) & edge sliver (`<= 4px` from border with `confidence < 0.65`).
2. Page-spanning frame (`w >= imageWidth * 0.95 && h >= imageHeight * 0.90`).
3. Thought-bubble circle tails (`^[0oO○●⊙◯°.\s]+$`).
4. Speedline / single-stroke misreads (`^[一丨丶─│|/\\_=~—–-]+$`).
5. Standalone page-number digits at top/bottom 4% margin.
6. Scanlator watermark full-line rejection (`/(?:discord\.gg|patreon\.com|read\s+(?:at|on)\b|toonhey\.com|colamanga|baozimh|asuracomic|reaperscans)/i` when text has no surrounding story clause).
7. Trailing domain/watermark debris stripper (`stripTrailingWatermark` removing trailing `(?:https?:\/\/)?[\w-]+\.(?:com|net|org|xyz|gg|me)\b.*$` and scaling `box.width` proportionally).
8. Conservative Furigana suppression: kana-only (`^[\u3040-\u309F\u30A0-\u30FFー・\s]+$`) item whose thickness (`isVertical ? width : height`) is `< 0.48×` a parallel overlapping Kanji-bearing (`[\u4E00-\u9FFF]`) item within `0.6×` parent thickness gap.

- [ ] **Step 4: Run tests & type-check**

Run: `npx vitest run tests/worker/ocr-noise-filter.test.ts tests/worker/bubble-aggregator.test.ts && npm run type-check`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/worker/ocr-noise-filter.ts src/worker/bubble-aggregator.ts tests/worker/ocr-noise-filter.test.ts
git commit -m "feat(ocr): add 12-rule noise, watermark, and conservative furigana filter"
```

---

### Task 3: Language-Aware Row-Band Reading Order (RTL Manga vs LTR Webtoon)

**Files:**
- Create: `src/worker/reading-order.ts`
- Modify: `src/worker/bubble-aggregator.ts:17-25,85-92`
- Modify: `src/offscreen/offscreen.ts:169-175`
- Modify: `src/background/ocr-worker-client.ts:265-269`
- Test: `tests/worker/reading-order.test.ts`

**Interfaces:**
- Produces:
  ```ts
  // src/worker/reading-order.ts
  export type ReadingDirection = 'rtl' | 'ltr';
  export class ReadingOrderSorter {
    static detectDirection(items: DialogueItem[], sourceLang?: string): ReadingDirection;
    static sort(items: DialogueItem[], direction: ReadingDirection): DialogueItem[];
  }
  ```

- [ ] **Step 1: Write failing tests in `tests/worker/reading-order.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { ReadingOrderSorter } from '../../src/worker/reading-order';
import { DialogueItem } from '../../src/shared/types';

const b = (id: string, text: string, x: number, y: number, w: number, h: number, isVertical = false): DialogueItem => ({
  id, originalText: text, box: { x, y, width: w, height: h }, isVertical
});

describe('ReadingOrderSorter', () => {
  it('sorts Japanese same-row bubbles Right-to-Left even when left bubble is slightly higher', () => {
    const leftSlightlyHigher = b('L', 'なんだ？', 80, 100, 90, 140, true);
    const rightSlightlyLower = b('R', 'おい見ろ！', 520, 118, 90, 140, true);
    const bottom = b('B', '本当だ', 300, 420, 90, 130, true);
    const dir = ReadingOrderSorter.detectDirection([leftSlightlyHigher, rightSlightlyLower, bottom], 'auto');
    expect(dir).toBe('rtl');
    expect(ReadingOrderSorter.sort([leftSlightlyHigher, rightSlightlyLower, bottom], dir).map((i) => i.id)).toEqual(['R', 'L', 'B']);
  });

  it('keeps horizontal Chinese/Korean webtoons Left-to-Right', () => {
    const left = b('L', '你好', 80, 110, 160, 45, false);
    const right = b('R', '走吧', 420, 100, 160, 45, false);
    const dir = ReadingOrderSorter.detectDirection([left, right], 'Chinese');
    expect(dir).toBe('ltr');
    expect(ReadingOrderSorter.sort([right, left], dir).map((i) => i.id)).toEqual(['L', 'R']);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/worker/reading-order.test.ts`  
Expected: FAIL (`reading-order` missing).

- [ ] **Step 3: Implement `ReadingOrderSorter` and wire into `BubbleAggregator.aggregateDialogues`**

- `detectDirection(items, sourceLang)`:
  - `/japanese/i.test(sourceLang ?? '')` or any item contains Kana `[\u3040-\u309F\u30A0-\u30FF]` → `'rtl'`.
  - `/english|korean|french|spanish|russian|vietnamese/i.test(sourceLang ?? '')` → `'ltr'`.
  - Otherwise (`'Chinese'` or `'auto'`): count `isVertical === true`; return `vCount > 0 && vCount >= items.length - vCount ? 'rtl' : 'ltr'`.
- `sort(items, direction)`: sort initially by centroid `cy = box.y + box.height / 2` ascending; group consecutive bubbles into row bands when vertical overlap `>= 0.35 * min(hA, hB)` or `|cyA - cyB| <= 0.45 * min(hA, hB)`; sort each band by centroid `cx` descending (`'rtl'`) or ascending (`'ltr'`).
- Add optional `sourceLang?: string` parameter to `BubbleAggregator.aggregateDialogues(items, imageWidth, imageHeight, sourceLang?)` and replace final `deduped.sort((a, b) => a.box.y - b.box.y)` with `ReadingOrderSorter.sort(deduped, ReadingOrderSorter.detectDirection(deduped, sourceLang))`.

- [ ] **Step 4: Run tests & type-check**

Run: `npx vitest run tests/worker/reading-order.test.ts tests/worker/bubble-aggregator.test.ts && npm run type-check`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/worker/reading-order.ts src/worker/bubble-aggregator.ts src/offscreen/offscreen.ts src/background/ocr-worker-client.ts tests/worker/reading-order.test.ts
git commit -m "feat(ocr): add language-aware RTL/LTR row-band reading order sorter"
```

---

### Task 4: Zero-Key `GoogleFreeProvider` & Last-Resort Rotator Fallback

**Files:**
- Create: `src/services/translation/google-translate-provider.ts`
- Modify: `src/shared/types.ts:65-106` (`ProviderType` += `'google_free'`, `ExtensionSettings.enableFreeFallback?: boolean`)
- Modify: `src/shared/presets.ts:7-111,171-245`
- Modify: `src/services/translation/provider-factory.ts`
- Modify: `src/services/translation/multi-provider-rotator.ts:32-70,128-179`
- Test: `tests/services/google-translate-provider.test.ts`

**Interfaces:**
- Produces:
  ```ts
  // src/services/translation/google-translate-provider.ts
  export class GoogleFreeProvider implements ITranslationProvider {
    static mapLangCode(lang?: string): string;
    translateDialogues(texts: string[], targetLang: string, sourceLang?: string, ctx?: DialogueTranslateContext): Promise<string[]>;
    testConnection(): Promise<boolean>;
  }
  ```

- [ ] **Step 1: Write failing test in `tests/services/google-translate-provider.test.ts`**

```ts
import { describe, expect, it, vi } from 'vitest';
import { GoogleFreeProvider } from '../../src/services/translation/google-translate-provider';

describe('GoogleFreeProvider', () => {
  it('maps human language names to ISO codes and preserves line alignment via separator', async () => {
    expect(GoogleFreeProvider.mapLangCode('Tiếng Việt')).toBe('vi');
    expect(GoogleFreeProvider.mapLangCode('Japanese')).toBe('ja');
    expect(GoogleFreeProvider.mapLangCode('auto')).toBe('auto');

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response(JSON.stringify([[['Xin chào\n', 'Hello\n'], ['⟪991⟫\n', '⟪991⟫\n'], ['Tạm biệt', 'Bye']]]), { status: 200 })
    ));
    const p = new GoogleFreeProvider();
    const out = await p.translateDialogues(['Hello', 'Bye'], 'Tiếng Việt', 'English');
    expect(out).toEqual(['Xin chào', 'Tạm biệt']);
    vi.unstubAllGlobals();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/services/google-translate-provider.test.ts`  
Expected: FAIL (`google-translate-provider` missing).

- [ ] **Step 3: Implement `GoogleFreeProvider` and wire into `presets.ts`, `provider-factory.ts`, and `MultiProviderRotator`**

- `GoogleFreeProvider`: uses `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=...` in chunks of `<= 15` lines joined with `\n⟪991⟫\n` (falling back to per-line requests if delimiter count mismatches so line alignment is 100% guaranteed); respects `ctx?.translateSfx === false` via `PromptBuilder` SFX skip.
- Add `google_free` preset (`requiresApiKey: false, defaultDelayMs: 300`) in `presets.ts` and `DEFAULT_SETTINGS.enableFreeFallback = true`.
- In `MultiProviderRotator.translateDialogues`: if all configured providers fail (or zero API keys are configured) AND `this.settings.enableFreeFallback !== false`, fall back to `new GoogleFreeProvider()` and log a warning in `DebugLogger`.

- [ ] **Step 4: Run full test suite, type-check & both builds**

Run: `npm test && npm run type-check && npm run build:chrome && npm run build:firefox`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/shared/types.ts src/shared/presets.ts src/services/translation/google-translate-provider.ts src/services/translation/provider-factory.ts src/services/translation/multi-provider-rotator.ts tests/services/google-translate-provider.test.ts
git commit -m "feat(translation): add zero-key GoogleFreeProvider and automatic rotator rescue"
```
