/**
 * JsonExtractor: Extracts and safely parses JSON from LLM responses.
 * Handles markdown fences (```json), leading/trailing commentary, trailing commas,
 * and extracts individual dialogue objects if entire JSON is malformed.
 * Follows Single Responsibility Principle (SRP).
 */
export class JsonExtractor {
  public static extractCleanJson(text: string): string {
    if (!text || typeof text !== 'string') return '';
    const trimmed = text.trim();

    // 1. Try markdown code block
    const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    let target = fenceMatch ? fenceMatch[1].trim() : trimmed;

    // 2. Find bracket / brace boundaries
    const firstBracket = target.indexOf('[');
    const firstBrace = target.indexOf('{');

    let start = -1;
    let end = -1;

    if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
      start = firstBracket;
      end = target.lastIndexOf(']');
    } else if (firstBrace !== -1) {
      start = firstBrace;
      end = target.lastIndexOf('}');
    }

    if (start !== -1 && end !== -1 && end > start) {
      target = target.substring(start, end + 1);
    }

    // 3. Remove trailing commas before closing braces/brackets
    return target.replace(/,\s*([}\]])/g, '$1').trim();
  }

  public static safeParse<T = any>(text: string, defaultValue: T): T {
    const cleaned = this.extractCleanJson(text);
    if (!cleaned) return defaultValue;

    try {
      return JSON.parse(cleaned) as T;
    } catch {
      // Fallback: try removing unescaped control characters
      try {
        const sanitized = cleaned.replace(/[\u0000-\u001F\u007F-\u009F]/g, (c) => {
          return c === '\n' || c === '\r' || c === '\t' ? c : '';
        });
        return JSON.parse(sanitized) as T;
      } catch {
        return defaultValue;
      }
    }
  }

  /**
   * Resilient extraction of dialogue items if the top-level array JSON is corrupted
   */
  public static extractDialogueItems(text: string): any[] {
    const parsed = this.safeParse(text, null);
    if (parsed) {
      if (Array.isArray(parsed)) return parsed;
      if (typeof parsed === 'object') {
        const found = Object.values(parsed).find((v) => Array.isArray(v));
        if (Array.isArray(found)) return found as any[];
      }
    }

    // Regex fallback: match individual { ... } objects containing box and translation
    const items: any[] = [];
    const blockRegex = /\{[^{}]*?(?:box|translation)[^{}]*?\}/gi;
    let match: RegExpExecArray | null;
    while ((match = blockRegex.exec(text)) !== null) {
      try {
        const obj = JSON.parse(match[0].replace(/,\s*([}\]])/g, '$1'));
        if (obj && typeof obj === 'object') items.push(obj);
      } catch {
        const boxMatch = match[0].match(/(?:box_2d|box)\s*:\s*\[\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\]/i);
        const transMatch = match[0].match(/(?:translation|translated_text)\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/i);
        const origMatch = match[0].match(/(?:original_text|text)\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/i);
        if (boxMatch && transMatch) {
          items.push({
            box_2d: [Number(boxMatch[1]), Number(boxMatch[2]), Number(boxMatch[3]), Number(boxMatch[4])],
            translation: transMatch[1],
            original_text: origMatch ? origMatch[1] : ''
          });
        }
      }
    }

    return items;
  }
}
