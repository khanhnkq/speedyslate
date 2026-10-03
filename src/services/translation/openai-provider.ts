import { ITranslationProvider } from './translation-provider.interface';

export class OpenAIProvider implements ITranslationProvider {
  private baseUrl: string;
  private apiKey: string;
  private model: string;

  constructor(baseUrl: string, apiKey: string, model: string) {
    this.baseUrl = baseUrl.trim().replace(/\/+$/, '');
    this.apiKey = apiKey.trim();
    this.model = model.trim();
  }

  public async translateDialogues(texts: string[], targetLang: string): Promise<string[]> {
    if (!texts.length) return [];

    const endpoint = `${this.baseUrl}/chat/completions`;
    const systemPrompt = `You are a professional comic/manga/manhwa translator into ${targetLang}.
Translate the provided JSON array of dialogue strings accurately and naturally.
CRITICAL: You must return ONLY a JSON object with a single key "translations" containing an array of strings with the EXACT same length and order:
{"translations": ["dịch 1", "dịch 2"]}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const payload: any = {
      model: this.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: JSON.stringify(texts) }
      ],
      temperature: 0.3
    };

    // Add json_object response_format if not using older models
    payload.response_format = { type: 'json_object' };

    let resp: Response | null = null;
    const maxRetries = 3;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      resp = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (resp.status === 429 && attempt < maxRetries) {
        const retryAfterSec = Number(resp.headers.get('retry-after'));
        const backoffMs = !isNaN(retryAfterSec) && retryAfterSec > 0
          ? retryAfterSec * 1000
          : 2500 * Math.pow(2, attempt) + Math.random() * 500;

        console.warn(`[OpenAI/Groq API] 429 Rate limited. Đang chờ ${Math.round(backoffMs)}ms trước khi thử lại (lần ${attempt + 1}/${maxRetries})...`);
        await new Promise((r) => setTimeout(r, backoffMs));
        continue;
      }

      break;
    }

    if (!resp || !resp.ok) {
      const errText = resp ? await resp.text() : 'Không thể kết nối';
      let msg = `API lỗi (${resp?.status || 0})`;
      try {
        const json = JSON.parse(errText);
        if (json.error?.message) {
          msg += `: ${json.error.message}`;
        }
      } catch {
        msg += `: ${errText.substring(0, 100)}`;
      }
      throw new Error(msg);
    }

    const data = await resp.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('API không trả về kết quả choices[0].message.content.');
    }

    try {
      const parsed = JSON.parse(content.trim());
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item ?? ''));
      }
      if (parsed && Array.isArray(parsed.translations)) {
        return parsed.translations.map((item: any) => String(item ?? ''));
      }
      // If object with numeric or string keys
      const values = Object.values(parsed);
      if (values.length === texts.length && values.every((v) => typeof v === 'string')) {
        return values as string[];
      }
    } catch {
      // Regex fallback to extract array
      const match = content.match(/\[[\s\S]*\]/);
      if (match) {
        try {
          const arr = JSON.parse(match[0]);
          if (Array.isArray(arr)) {
            return arr.map((item) => String(item ?? ''));
          }
        } catch {
          // ignore
        }
      }
    }

    throw new Error('Không thể phân tích mảng câu dịch từ phản hồi API.');
  }

  public async testConnection(): Promise<boolean> {
    const res = await this.translateDialogues(['Hello world'], 'Tiếng Việt');
    return Array.isArray(res) && res.length > 0;
  }
}
