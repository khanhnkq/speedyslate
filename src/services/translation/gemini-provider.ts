import { ITranslationProvider } from './translation-provider.interface';

export class GeminiProvider implements ITranslationProvider {
  private apiKey: string;
  private model: string;
  private baseUrl: string;

  constructor(apiKey: string, model: string = 'gemini-3.5-flash-lite', baseUrl?: string) {
    this.apiKey = apiKey.trim();
    this.model = model.trim() || 'gemini-3.5-flash-lite';
    this.baseUrl = (baseUrl || 'https://generativelanguage.googleapis.com/v1beta').replace(/\/+$/, '');
  }

  public async translateDialogues(texts: string[], targetLang: string): Promise<string[]> {
    if (!texts.length) return [];
    if (!this.apiKey) {
      throw new Error('Chưa cấu hình Gemini API Key. Vui lòng mở cài đặt extension.');
    }

    const endpoint = `${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`;
    const systemPrompt = `You are an expert manga, manhwa, and comic translator.
Translate the provided JSON array of OCR-extracted dialogue lines into natural, contextual, expressive ${targetLang}.

RULES FOR COMIC TRANSLATION:
1. Translate dialogue, speech bubbles, inner monologues, and story narrations naturally, matching character emotion and comic context.
   - If an OCR text line has minor typos or missing spaces (e.g. "WHAT'S GONC" -> "WHAT'S GOING", "ON IN THEREP" -> "ON IN THERE?"), automatically correct it using context and translate accurately.
   - NEVER discard or omit valid character speech bubbles!
2. Brevity & Bubble Formatting:
   - Keep translations concise to fit inside comic bubbles.
   - For longer sentences, you may insert a single newline character (\\n) at natural phrasing pauses to balance text across lines.
3. CRITICAL FILTERING - ONLY OMIT TRUE JUNK & WATERMARKS:
   - Scanlation credits, website URLs, group plugs, Discord/Patreon links (e.g. "toonhey.com", "asura", "reaper", "read at...", "join our discord", "uploaded by").
   - Standalone chapter numbers, page numbers, status labels (e.g. "Ch. 5", "Page 12", "01/24", "End of chapter").
   - Non-dialogue graphic noise or single punctuation symbols (e.g. "|", "---", "/", ";;", "..", "~~~").
   - FOR TRUE JUNK / WATERMARK / CREDIT ONLY: Return an EMPTY STRING ("") at that index! Do NOT omit real dialogue.
4. STRICT JSON OUTPUT FORMAT:
   - Return ONLY a valid JSON array of strings with the EXACT same length and order as the input array.
   - Example: Input: ["WHAT'S GOING ON IN THEREP", "toonhey.com", "Hmph"] -> Output: ["CÓ CHUYỆN GÌ ĐANG XẢY RA TRONG ĐÓ THẾ?", "", "Hừ"]`;

    const requestBody = {
      system_instruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: [
        {
          parts: [{ text: JSON.stringify(texts) }]
        }
      ],
      generationConfig: {
        response_mime_type: 'application/json',
        temperature: 0.3
      }
    };

    let resp: Response | null = null;
    const maxRetries = 3;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      resp = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (resp.status === 429 && attempt < maxRetries) {
        const retryAfterSec = Number(resp.headers.get('retry-after'));
        const backoffMs = !isNaN(retryAfterSec) && retryAfterSec > 0
          ? retryAfterSec * 1000
          : 3000 * Math.pow(2, attempt) + Math.random() * 500;

        console.warn(`[Gemini API] 429 Rate limited. Đang chờ ${Math.round(backoffMs)}ms trước khi thử lại (lần ${attempt + 1}/${maxRetries})...`);
        await new Promise((r) => setTimeout(r, backoffMs));
        continue;
      }

      break;
    }

    if (!resp || !resp.ok) {
      const errText = resp ? await resp.text() : 'Không thể kết nối';
      let message = `Gemini API lỗi (${resp?.status || 0})`;
      try {
        const json = JSON.parse(errText);
        if (json.error?.message) {
          message += `: ${json.error.message}`;
        }
      } catch {
        message += `: ${errText.substring(0, 100)}`;
      }
      throw new Error(message);
    }

    const data = await resp.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error('Gemini API không trả về nội dung hợp lệ.');
    }

    try {
      const parsed = JSON.parse(candidateText.trim());
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item ?? ''));
      }
      if (parsed && typeof parsed === 'object') {
        const values = Object.values(parsed);
        if (values.length === texts.length) {
          return values.map((v) => String(v ?? ''));
        }
      }
    } catch {
      // Fallback: line-by-line parsing if json is slightly malformed
      const lines = candidateText.split('\n').filter((l: string) => l.trim().length > 0);
      if (lines.length === texts.length) {
        return lines;
      }
    }

    throw new Error('Không thể phân tích định dạng JSON kết quả từ Gemini.');
  }

  public async testConnection(): Promise<boolean> {
    const testResult = await this.translateDialogues(['Hello, world!'], 'Tiếng Việt');
    return Array.isArray(testResult) && testResult.length > 0;
  }
}
