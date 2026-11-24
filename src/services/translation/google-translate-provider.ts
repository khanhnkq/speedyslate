import { DialogueTranslateContext } from '../../shared/types';
import { ITranslationProvider } from './translation-provider.interface';
import { KeyedJson } from './keyed-json';

const GTX_SEPARATOR = '\n⟪991⟫\n';
const GTX_SPLIT_RE = /\s*⟪991⟫\s*/;

const LANG_MAP: Record<string, string> = {
  auto: 'auto',
  'tiếng việt': 'vi',
  vietnamese: 'vi',
  english: 'en',
  'tiếng anh': 'en',
  japanese: 'ja',
  'tiếng nhật': 'ja',
  korean: 'ko',
  'tiếng hàn': 'ko',
  chinese: 'zh-CN',
  'chinese simplified': 'zh-CN',
  'chinese traditional': 'zh-TW',
  french: 'fr',
  german: 'de',
  spanish: 'es',
  portuguese: 'pt',
  russian: 'ru',
  thai: 'th',
  indonesian: 'id'
};

/**
 * GoogleFreeProvider: Zero-configuration Google Translate GTX provider.
 * Works immediately without API keys and acts as a last-resort rescue fallback
 * when all configured LLM providers fail or hit rate-limit exhaustion.
 */
export class GoogleFreeProvider implements ITranslationProvider {
  public lastKeyIndex = 1;
  public readonly keyCount = 1;

  public static mapLangCode(lang?: string): string {
    if (!lang) return 'auto';
    const norm = lang.trim().toLowerCase();
    if (LANG_MAP[norm]) return LANG_MAP[norm];
    if (/^[a-z]{2}(?:-[a-z]{2})?$/i.test(lang.trim())) return lang.trim();
    return 'en';
  }

  public async translateDialogues(
    texts: string[],
    targetLang: string,
    sourceLang?: string,
    ctx?: DialogueTranslateContext
  ): Promise<string[]> {
    if (!texts.length) return [];
    const sl = GoogleFreeProvider.mapLangCode(sourceLang || 'auto');
    const tl = GoogleFreeProvider.mapLangCode(targetLang || 'Tiếng Việt');
    const skipSfx = ctx?.translateSfx === false;

    const sendIndices: number[] = [];
    const sendTexts: string[] = [];
    const outputs = new Array<string>(texts.length).fill('');

    texts.forEach((raw, idx) => {
      const item = ctx?.items?.[idx];
      if (skipSfx && item?.kind === 'sfx') {
        outputs[idx] = '';
        return;
      }
      if (KeyedJson.isPassthroughOnly(raw)) {
        outputs[idx] = raw.trim();
        return;
      }
      sendIndices.push(idx);
      sendTexts.push(raw.trim());
    });

    if (sendTexts.length === 0) return outputs;

    const chunks = KeyedJson.chunkArray(sendTexts, 15);
    const translatedFlat: string[] = [];

    for (const chunk of chunks) {
      const joined = chunk.join(GTX_SEPARATOR);
      const batchStr = await this.fetchGtx(joined, sl, tl);
      const parts = batchStr.split(GTX_SPLIT_RE).map((s) => s.trim());

      if (parts.length === chunk.length) {
        translatedFlat.push(...parts);
      } else {
        for (const single of chunk) {
          translatedFlat.push((await this.fetchGtx(single, sl, tl)).trim());
        }
      }
    }

    sendIndices.forEach((origIdx, k) => {
      outputs[origIdx] = translatedFlat[k] ?? sendTexts[k];
    });
    return outputs;
  }

  private async fetchGtx(query: string, sl: string, tl: string): Promise<string> {
    const url =
      `https://translate.googleapis.com/translate_a/single?client=gtx` +
      `&sl=${encodeURIComponent(sl)}&tl=${encodeURIComponent(tl)}&dt=t&q=${encodeURIComponent(query)}`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    try {
      const resp = await fetch(url, { method: 'GET', signal: controller.signal });
      if (!resp.ok) {
        throw new Error(`Google Translate lỗi HTTP ${resp.status}`);
      }
      const data = await resp.json();
      if (!Array.isArray(data?.[0])) {
        throw new Error('Phản hồi Google Translate không hợp lệ.');
      }
      return data[0].map((seg: any) => String(seg?.[0] ?? '')).join('');
    } finally {
      clearTimeout(timer);
    }
  }

  public async testConnection(): Promise<boolean> {
    const out = await this.translateDialogues(['Hello'], 'Tiếng Việt', 'English');
    return out.length === 1 && out[0].length > 0;
  }
}
