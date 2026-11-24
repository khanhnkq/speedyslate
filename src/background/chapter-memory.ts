import { DialogueItem, DialogueTranslateContext, ExtensionSettings } from '../shared/types';

/**
 * Chapter memory: last N original=>translated pairs per chapter so the LLM
 * keeps names, pronouns and tone consistent across pages of the same chapter.
 */
const chapterMemory = new Map<string, string[]>();
const CHAPTER_MEM_PAIRS = 10;
const CHAPTER_MEM_KEYS = 20;

export function buildTranslateCtx(
  settings: ExtensionSettings,
  items: DialogueItem[],
  chapterKey?: string
): DialogueTranslateContext {
  return {
    items,
    glossary: settings.glossary,
    translateSfx: settings.translateSfx,
    chapterContext: chapterKey ? chapterMemory.get(chapterKey) : undefined
  };
}

export function rememberChapterPairs(chapterKey: string | undefined, items: DialogueItem[]): void {
  if (!chapterKey) return;
  let pairs = chapterMemory.get(chapterKey);
  if (!pairs) {
    if (chapterMemory.size >= CHAPTER_MEM_KEYS) {
      chapterMemory.delete(chapterMemory.keys().next().value!);
    }
    pairs = [];
    chapterMemory.set(chapterKey, pairs);
  }
  for (const d of items) {
    if (d.originalText?.trim() && d.translatedText?.trim()) {
      pairs.push(`${d.originalText.trim()} => ${d.translatedText.trim()}`);
    }
  }
  while (pairs.length > CHAPTER_MEM_PAIRS) pairs.shift();
}
