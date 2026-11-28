/**
 * OcrTextNormalizer: Pure post-OCR text normalization strictly for translation
 * inputs (leaves raw `DialogueItem.originalText` untouched for bubble matching
 * and display). Handles stray leading punctuation, missing punctuation/digit
 * spacing, glitched `?!!!` (`PANICPIII`), and noisy ALL-CAPS / erratic casing.
 */

const NON_LATIN_SCRIPT_RE =
  /[\u3040-\u30FF\u3400-\u9FFF\uAC00-\uD7AF\u0400-\u04FF\u0E00-\u0E7F\u0600-\u06FF]/;

const PROTECTED_SPAN_RE =
  /https?:\/\/\S+|www\.\S+|\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b|\b[a-zA-Z0-9-]+\.(?:com|net|org|io|gg|me|tv|to|cc|xyz|dev|co|edu|gov|uk|jp|vn|kr|info|biz)(?:\.[a-zA-Z]{2})?(?:\/\S*)?\b|\b[A-Za-z]\.(?:[A-Za-z]\.)+[A-Za-z]?\.?|\b\d+(?:[.,]\d+)+\b/g;

const ACRONYMS = new Set([
  'OK', 'TV', 'CEO', 'CFO', 'CTO', 'COO', 'RPG', 'MMORPG', 'NPC', 'HP', 'MP', 'XP',
  'AI', 'VR', 'AR', 'PC', 'USA', 'UK', 'EU', 'UN', 'FBI', 'CIA', 'NASA', 'VIP',
  'MVP', 'SOS', 'DIY', 'FAQ', 'URL', 'PDF', 'SFX', 'DJ', 'MC', 'GM', 'ATM', 'GPS',
  'DNA', 'RNA', 'ICU', 'ER', 'AC', 'DC', 'ID', 'OMG', 'WTF', 'BTW', 'FYI', 'IMO',
  'TBH', 'ASAP', 'GG', 'KO', 'PVP', 'PVE', 'DPS', 'AOE', 'HUD', 'UI', 'UX', 'API',
  'SDK', 'USB', 'DVD', 'CD', 'HD', 'SSD', 'CPU', 'GPU', 'RAM', 'OS', 'PIN', 'SIM',
  'SMS', 'MMS'
]);

const CAMEL_CASE_WORDS: Record<string, string> = {
  iphone: 'iPhone',
  ipad: 'iPad',
  ipod: 'iPod',
  imac: 'iMac',
  macbook: 'MacBook',
  youtube: 'YouTube',
  github: 'GitHub',
  playstation: 'PlayStation',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  tiktok: 'TikTok'
};

const ERRATIC_WORD_RE = /[A-Z]{2,}[a-z]|[a-z][A-Z]/;

function isPreservedAcronymOrCamel(word: string): string | null {
  const lower = word.toLowerCase();
  if (CAMEL_CASE_WORDS[lower]) return CAMEL_CASE_WORDS[lower];

  const upper = word.toUpperCase();
  if (ACRONYMS.has(upper)) return upper;

  // Handle plural acronyms like RPGs, NPCs, TVs, CEOs
  if (word.length >= 3 && (word.endsWith('s') || word.endsWith('S'))) {
    const stem = upper.slice(0, -1);
    if (ACRONYMS.has(stem)) return `${stem}s`;
  }
  return null;
}

function normalizeWordCasing(word: string, forceLower: boolean): string {
  const preserved = isPreservedAcronymOrCamel(word);
  if (preserved) return preserved;

  const lower = word.toLowerCase();
  if (lower === 'i') return 'I';

  if (forceLower || ERRATIC_WORD_RE.test(word)) {
    return lower;
  }
  return word;
}

function fixCaseAndPronouns(text: string): string {
  let alphaCount = 0;
  let upperCount = 0;
  let hasErratic = false;

  const words = text.match(/[A-Za-z]+/g) || [];
  for (const w of words) {
    for (let i = 0; i < w.length; i++) {
      const ch = w[i];
      alphaCount++;
      if (ch >= 'A' && ch <= 'Z') upperCount++;
    }
    if (!isPreservedAcronymOrCamel(w) && ERRATIC_WORD_RE.test(w)) {
      hasErratic = true;
    }
  }

  if (alphaCount === 0) return text;

  const isAllCapsNoisy = alphaCount >= 2 && upperCount / alphaCount >= 0.65;
  if (!isAllCapsNoisy && !hasErratic) {
    return text;
  }

  // Transform word-by-word while keeping apostrophe contractions ("I'M" -> "I'm") intact
  let out = text.replace(/\b([A-Za-z]+)(['’][A-Za-z]+)?\b/g, (_m, base: string, suffix?: string) => {
    const baseLower = base.toLowerCase();
    if (baseLower === 'i' && suffix) {
      return `I${suffix.toLowerCase()}`;
    }
    const normBase = normalizeWordCasing(base, isAllCapsNoisy);
    if (!suffix) return normBase;
    const normSuffix = isAllCapsNoisy || ERRATIC_WORD_RE.test(suffix) ? suffix.toLowerCase() : suffix;
    return `${normBase}${normSuffix}`;
  });

  // Capitalize first letter of string and after sentence-ending punctuation
  out = out.replace(/^([\s"'“‘(\[.]*)([a-z])/, (_m, lead: string, ch: string) => `${lead}${ch.toUpperCase()}`);
  out = out.replace(/([.?!…]+["'”’)\]]*\s+["'“‘(\[]*)([a-z])/g, (_m, sep: string, ch: string) => {
    return `${sep}${ch.toUpperCase()}`;
  });

  return out;
}

/**
 * Normalizes noisy English comic OCR strings before sending to translators.
 * Leaves non-Latin/CJK text and raw OCR bounding-box strings untouched.
 */
export function normalizeOcrForTranslation(text: string): string {
  if (!text) return '';
  const trimmed = text.replace(/\s+/g, ' ').trim();
  if (!trimmed) return '';

  if (NON_LATIN_SCRIPT_RE.test(trimmed) || !/[A-Za-z]/.test(trimmed)) {
    return trimmed;
  }

  // Protect URLs, domains, emails, dotted abbreviations, and decimals/numbers
  const protectedTokens: string[] = [];
  let s = trimmed.replace(PROTECTED_SPAN_RE, (match) => {
    const idx = protectedTokens.length;
    protectedTokens.push(match);
    return `\uE000${idx}\uE001`;
  });

  // 1. Trim stray leading punctuation artifacts before words (keep ellipsis "..", "...", quotes, parens)
  s = s.replace(/^(?:[,;:]+\s*|\.(?!\.)\s*)(?=[A-Za-z0-9"'“‘(\[])/, '');

  // 2. Fix glitched `?!!!` / `PANICPIII` -> `PANIC?!!!` conservatively (never match `!` after `P`, e.g. `STOP!II`)
  s = s.replace(/\b([A-Z]{3,})P([Il]{2,})(?=$|[\s"'”’)\]])/g, (_m, stem: string, marks: string) => {
    return `${stem}?${'!'.repeat(marks.length)}`;
  });
  s = s.replace(/([?!])([Il]{2,}|[Il]$)/g, (_m, punc: string, marks: string) => {
    return `${punc}${'!'.repeat(marks.length)}`;
  });

  // 3. Insert missing spaces after comma / sentence punctuation before letters/digits
  //    (comma never splits digit-comma-digit; leading ellipsis at start stays attached)
  s = s.replace(/([A-Za-z0-9]),(?=[A-Za-z])/g, '$1, ');
  s = s.replace(/([A-Za-z]),(?=[0-9])/g, '$1, ');
  s = s.replace(/(?<=[^\s.])(\.{2,}|[.?!]+)(?=[A-Za-z0-9])/g, '$1 ');

  // 4. Insert missing spaces between digits and words (preserving ordinals like 1st/2nd/3rd/4th)
  s = s.replace(/\b(\d+)([A-Za-z]{2,})\b/g, (m, num: string, word: string) => {
    if (/^(?:st|nd|rd|th)$/i.test(word)) return m;
    return `${num} ${word}`;
  });
  s = s.replace(/\b([A-Za-z]{4,})(\d+)\b/g, '$1 $2');

  // 5. Collapse any extra spaces introduced and normalize noisy ALL-CAPS / erratic mixed case
  s = s.replace(/\s+/g, ' ').trim();
  s = fixCaseAndPronouns(s);

  // Restore protected tokens
  s = s.replace(/\uE000(\d+)\uE001/g, (_m, idxStr: string) => protectedTokens[Number(idxStr)] ?? '');

  return s.trim();
}
