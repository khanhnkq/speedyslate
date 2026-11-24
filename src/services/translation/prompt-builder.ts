import { DialogueKind, DialogueTranslateContext } from '../../shared/types';
import { KeyedDialogueEntry, KeyedJson } from './keyed-json';

export interface BuiltDialoguePrompt {
  systemPrompt: string;
  userPayload: string;
  keys: string[];
  /**
   * original item index ->
   *   >= 0 : index into `keys` (`b0..bN`)
   *   -1   : filtered out (e.g. skipped SFX -> "")
   *   -2   : deterministic passthrough (punctuation/ellipsis -> keep original text)
   */
  sendMap: number[];
}

export interface DialoguePromptItem {
  text: string;
  confidence?: number;
  kind?: DialogueKind;
}

/**
 * Builds the shared rich-context Keyed JSON prompt for dialogue translation:
 * OCR confidence flags, dialogue-kind tags, glossary terms, rolling chapter context,
 * and deterministic punctuation passthrough.
 */
export class PromptBuilder {
  public static parseGlossary(raw?: string): [string, string][] {
    if (!raw) return [];
    const pairs: [string, string][] = [];
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq <= 0) continue;
      const term = trimmed.slice(0, eq).trim();
      const trans = trimmed.slice(eq + 1).trim();
      if (term && trans) pairs.push([term, trans]);
    }
    return pairs;
  }

  public static buildDialogue(
    items: DialoguePromptItem[],
    targetLang: string,
    sourceLang: string | undefined,
    ctx?: {
      glossaryPairs?: [string, string][];
      chapterContext?: string[];
      translateSfx?: boolean;
    }
  ): BuiltDialoguePrompt {
    const srcDesc =
      !sourceLang || sourceLang === 'auto'
        ? 'the original comic language (auto-detect)'
        : sourceLang;

    const skipSfx = ctx?.translateSfx === false;
    const sendMap: number[] = [];
    const entries: KeyedDialogueEntry[] = [];

    items.forEach((item, origIdx) => {
      if (skipSfx && item.kind === 'sfx') {
        sendMap[origIdx] = -1;
        return;
      }
      if (KeyedJson.isPassthroughOnly(item.text)) {
        sendMap[origIdx] = -2;
        return;
      }
      const entry: KeyedDialogueEntry = { t: item.text };
      if (item.confidence !== undefined && item.confidence < 0.6) {
        entry.c = Math.round(item.confidence * 100) / 100;
      }
      if (item.kind && item.kind !== 'dialogue') {
        entry.k = item.kind;
      }
      sendMap[origIdx] = entries.length;
      entries.push(entry);
    });

    const { keys, payloadJson } = KeyedJson.buildKeyedPayload(entries);
    const extras: string[] = [];

    if (entries.some((p) => p.c !== undefined)) {
      extras.push(
        '5. OCR CONFIDENCE: entries with "c" < 0.6 may contain OCR typos — infer and fix obvious misreads from context before translating.'
      );
    }
    if (entries.some((p) => p.k === 'sfx')) {
      extras.push(
        '6. SOUND EFFECTS: entries with "k":"sfx" are onomatopoeia. Translate them as short expressive sound-effect words in the target language.'
      );
    }
    if (ctx?.glossaryPairs?.length) {
      const terms = ctx.glossaryPairs.map(([a, b]) => `"${a}" => "${b}"`).join(', ');
      extras.push(`GLOSSARY (apply verbatim, never improvise these terms): ${terms}.`);
    }
    if (ctx?.chapterContext?.length) {
      const lines = ctx.chapterContext.map((p) => `  ${p}`).join('\n');
      extras.push(
        'CHAPTER CONTEXT — recent original => translation pairs from this chapter. Keep character names, pronouns and tone consistent with them:\n' +
          lines
      );
    }

    const exampleKeys = keys.slice(0, 2);
    const exampleJson = JSON.stringify(
      Object.fromEntries(exampleKeys.map((k, idx) => [k, idx === 0 ? '...' : '...']))
    );

    const systemPrompt = `You are an expert manga, manhwa, and comic translator.
Translate the provided Keyed JSON object of OCR-extracted comic lines from ${srcDesc} into natural, contextual, expressive ${targetLang}.
Each input key ("b0", "b1", ...) maps to {"t": original text, "c"?: ocr confidence, "k"?: kind}.

RULES FOR COMIC TRANSLATION:
1. Translate dialogue, speech bubbles, inner monologues, and narrations naturally, matching character emotion and comic context.
   - Automatically correct minor OCR typos using surrounding context.
   - NEVER merge two keys together and NEVER drop any input key!
2. Brevity & Bubble Formatting:
   - Keep translations concise to fit inside comic bubbles.
3. FILTERING - ONLY OMIT TRUE JUNK & WATERMARKS:
   - Scanlation credits, website URLs, chapter numbers, or non-dialogue graphic noise: set that key's value to "" (empty string).
4. STRICT KEYED JSON OUTPUT FORMAT:
   - Return ONLY a valid JSON object with the EXACT same keys (${keys.join(', ')}) mapping each key directly to its translated string:
   ${exampleJson}${extras.length ? '\n' + extras.join('\n') : ''}`;

    return { systemPrompt, userPayload: payloadJson, keys, sendMap };
  }

  /**
   * Maps Keyed JSON results back to the original item order.
   * Supports both `total: number` (legacy test callers) and `origTexts: string[]`
   * (restoring passthrough `-2` strings and `undefined` missing keys).
   */
  public static remapResults(
    results: (string | undefined)[],
    sendMap: number[],
    totalOrOrigTexts: number | string[]
  ): string[] {
    const origTexts: string[] | null = Array.isArray(totalOrOrigTexts) ? totalOrOrigTexts : null;
    const total: number = Array.isArray(totalOrOrigTexts) ? totalOrOrigTexts.length : totalOrOrigTexts;
    const out = new Array<string>(total).fill('');

    for (let i = 0; i < total; i++) {
      const pi = sendMap[i];
      if (pi === -1) {
        out[i] = '';
      } else if (pi === -2) {
        out[i] = origTexts ? (origTexts[i] || '').trim() : '';
      } else if (pi >= 0) {
        const val = pi < results.length ? results[pi] : undefined;
        if (val !== undefined) {
          out[i] = val;
        } else if (origTexts) {
          out[i] = (origTexts[i] || '').trim();
        }
      }
    }
    return out;
  }

  public static itemsFrom(
    texts: string[],
    ctx?: DialogueTranslateContext
  ): DialoguePromptItem[] {
    return texts.map((t, i) => {
      const item = ctx?.items?.[i];
      return {
        text: t,
        confidence: item?.confidence,
        kind: item?.kind
      };
    });
  }
}
