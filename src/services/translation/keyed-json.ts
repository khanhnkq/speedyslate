import { DialogueKind } from '../../shared/types';
import { JsonExtractor } from './json-extractor';

export const MAX_DIALOGUE_BATCH_SIZE = 20;

export interface KeyedDialogueEntry {
  t: string;
  c?: number;
  k?: DialogueKind;
}

/**
 * KeyedJson: Implements the Keyed JSON translation protocol ({"b0": "...", "b1": "..."}).
 * Guarantees positional integrity when LLMs drop or merge lines, builds strict
 * Gemini OBJECT schemas, and identifies deterministic punctuation passthroughs.
 */
export class KeyedJson {
  /**
   * Lines with zero Unicode letters and <= 8 chars (e.g. "...", "!?", "—")
   * need no LLM call and pass through unchanged.
   */
  public static isPassthroughOnly(text: string): boolean {
    const trimmed = (text || '').trim();
    if (!trimmed || trimmed.length > 8) return false;
    if (/^[|─│/\\_=~]+$/.test(trimmed)) return false;
    return !/\p{L}/u.test(trimmed);
  }

  public static buildKeyedPayload(entries: KeyedDialogueEntry[]): {
    keys: string[];
    payloadJson: string;
  } {
    const keys: string[] = [];
    const obj: Record<string, KeyedDialogueEntry> = {};
    for (let i = 0; i < entries.length; i++) {
      const k = `b${i}`;
      keys.push(k);
      obj[k] = entries[i];
    }
    return { keys, payloadJson: JSON.stringify(obj) };
  }

  public static buildGeminiObjectSchema(keys: string[]): {
    type: 'OBJECT';
    properties: Record<string, { type: 'STRING' }>;
    required: string[];
    propertyOrdering: string[];
  } {
    const properties: Record<string, { type: 'STRING' }> = {};
    for (const k of keys) {
      properties[k] = { type: 'STRING' };
    }
    return {
      type: 'OBJECT',
      properties,
      required: [...keys],
      propertyOrdering: [...keys]
    };
  }

  /**
   * Parses a Keyed JSON LLM response into an array aligned with `keys`.
   * Missing keys yield `undefined` so neighbors never shift indices.
   * Gracefully falls back to exact-length array responses if a legacy custom
   * model ignores key names.
   */
  public static parseKeyedResponse(rawText: string, keys: string[]): (string | undefined)[] {
    if (keys.length === 0) return [];
    const parsed = JsonExtractor.safeParse<any>(rawText, null);

    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const container =
        parsed.translations && typeof parsed.translations === 'object' && !Array.isArray(parsed.translations)
          ? parsed.translations
          : parsed;

      const hasAnyKey = keys.some((k) => Object.prototype.hasOwnProperty.call(container, k));
      if (hasAnyKey) {
        return keys.map((k) => {
          const val = container[k];
          if (val === undefined || val === null) return undefined;
          if (typeof val === 'object' && typeof val.t === 'string') return val.t;
          return String(val);
        });
      }

      if (Array.isArray(parsed.translations) && parsed.translations.length === keys.length) {
        return parsed.translations.map((v: any) => String(v ?? ''));
      }
    }

    if (Array.isArray(parsed) && parsed.length === keys.length) {
      return parsed.map((v: any) => String(v ?? ''));
    }

    // Regex key-by-key salvage if JSON was truncated mid-stream
    const salvaged = keys.map((k) => {
      const re = new RegExp(`"${k}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`);
      const m = rawText.match(re);
      if (!m) return undefined;
      try {
        return JSON.parse(`"${m[1]}"`) as string;
      } catch {
        return m[1];
      }
    });
    if (salvaged.some((v) => v !== undefined)) {
      return salvaged;
    }

    throw new Error('Không thể phân tích định dạng Keyed JSON từ phản hồi AI.');
  }

  public static chunkArray<T>(items: T[], maxChunk: number = MAX_DIALOGUE_BATCH_SIZE): T[][] {
    if (items.length === 0) return [];
    const size = Math.max(1, maxChunk);
    const chunks: T[][] = [];
    for (let i = 0; i < items.length; i += size) {
      chunks.push(items.slice(i, i + size));
    }
    return chunks;
  }
}
