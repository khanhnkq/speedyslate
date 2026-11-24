import { DialogueKind, DialogueTranslateContext } from '../../shared/types';

export interface BuiltDialoguePrompt {
  systemPrompt: string;
  userPayload: string;
  /** original item index -> payload index, or -1 when filtered out (e.g. sfx). */
  sendMap: number[];
}

export interface DialoguePromptItem {
  text: string;
  confidence?: number;
  kind?: DialogueKind;
}

/**
 * Builds the shared rich-context prompt for dialogue translation:
 * OCR confidence flags, dialogue-kind tags, glossary terms and rolling
 * chapter context. SRP: prompt text lives here only — providers just send it.
 */
export class PromptBuilder {
  /**
   * Parse "Term = Translation" lines from a settings textarea.
   * Blank lines and lines starting with '#' are ignored.
   */
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

  /**
   * Build system prompt + compact JSON payload [{t, c?, k?}].
   * `c` (confidence) is emitted only when < 0.6 so the model knows the OCR
   * line may be unreliable; `k` is emitted only for non-dialogue kinds.
   * When ctx.translateSfx === false, sfx items are dropped from the payload
   * and marked -1 in sendMap so callers can map results back to "".
   */
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
    const srcDesc = !sourceLang || sourceLang === 'auto'
      ? 'the original comic language (auto-detect)'
      : sourceLang;

    const skipSfx = ctx?.translateSfx === false;
    const sendMap: number[] = [];
    const payload: { t: string; c?: number; k?: DialogueKind }[] = [];

    items.forEach((item, origIdx) => {
      if (skipSfx && item.kind === 'sfx') {
        sendMap[origIdx] = -1;
        return;
      }
      const entry: { t: string; c?: number; k?: DialogueKind } = { t: item.text };
      if (item.confidence !== undefined && item.confidence < 0.6) {
        entry.c = Math.round(item.confidence * 100) / 100;
      }
      if (item.kind && item.kind !== 'dialogue') {
        entry.k = item.kind;
      }
      sendMap[origIdx] = payload.length;
      payload.push(entry);
    });

    const extras: string[] = [];

    if (payload.some((p) => p.c !== undefined)) {
      extras.push(
        '5. OCR CONFIDENCE: some entries include field "c" = OCR confidence (0-1). ' +
        'A low "c" means the OCR reading may be unreliable — silently fix obvious ' +
        'typos/misreads using surrounding context before translating.'
      );
    }
    if (payload.some((p) => p.k === 'sfx')) {
      extras.push(
        '6. SOUND EFFECTS: entries with "k":"sfx" are onomatopoeia. Translate them ' +
        'as short expressive sound-effect words in the target language.'
      );
    }
    if (ctx?.glossaryPairs?.length) {
      const terms = ctx.glossaryPairs.map(([a, b]) => `"${a}" => "${b}"`).join(', ');
      extras.push(
        `GLOSSARY (apply verbatim, never improvise these terms): ${terms}.`
      );
    }
    if (ctx?.chapterContext?.length) {
      const lines = ctx.chapterContext.map((p) => `  ${p}`).join('\n');
      extras.push(
        'CHAPTER CONTEXT — recent original => translation pairs from this chapter. ' +
        'Keep character names, pronouns and tone consistent with them:\n' + lines
      );
    }

    const systemPrompt = `You are an expert manga, manhwa, and comic translator.
Translate the provided JSON array of OCR-extracted dialogue entries from ${srcDesc} into natural, contextual, expressive ${targetLang}.
Each entry is an object {"t": original text, "c"?: ocr confidence, "k"?: kind}.

RULES FOR COMIC TRANSLATION:
1. Translate dialogue, speech bubbles, inner monologues, and story narrations naturally, matching character emotion and comic context.
   - If an OCR text line has minor typos or missing spaces (e.g. "WHAT'S GONC" -> "WHAT'S GOING"), automatically correct it using context and translate accurately.
   - NEVER discard or omit valid character speech bubbles!
2. Brevity & Bubble Formatting:
   - Keep translations concise to fit inside comic bubbles.
   - For longer sentences, you may insert a single newline character (\\n) at natural phrasing pauses to balance text across lines.
3. FILTERING - ONLY OMIT TRUE JUNK & WATERMARKS:
   - Scanlation credits, website URLs (e.g. "toonhey.com", "asura"), chapter numbers, or non-dialogue graphic noise: return empty string (""). Do NOT omit real character dialogue.
${extras.length ? '\n' + extras.join('\n') : ''}`;

    return { systemPrompt, userPayload: JSON.stringify(payload), sendMap };
  }

  /**
   * Map a provider's payload-indexed results back to the original item order.
   * Filtered items (sendMap === -1) and out-of-range results become "".
   */
  public static remapResults(results: string[], sendMap: number[], total: number): string[] {
    const out = new Array<string>(total).fill('');
    for (let i = 0; i < total; i++) {
      const pi = sendMap[i];
      if (pi >= 0 && pi < results.length) {
        out[i] = results[pi];
      }
    }
    return out;
  }

  /** Build prompt items from DialogueItem[] (or fall back to plain texts). */
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
