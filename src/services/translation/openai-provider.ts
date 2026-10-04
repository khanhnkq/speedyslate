import { DialogueItem } from '../../shared/types';
import { ITranslationProvider } from './translation-provider.interface';
import { ApiKeyRotator } from './api-key-rotator';
import { DebugLogger } from '../../shared/debug-logger';

export class OpenAIProvider implements ITranslationProvider {
  private baseUrl: string;
  private keyRotator: ApiKeyRotator;
  private model: string;

  constructor(baseUrl: string, apiKey: string | string[], model: string) {
    this.baseUrl = baseUrl.trim().replace(/\/+$/, '');
    this.keyRotator = new ApiKeyRotator(apiKey);
    this.model = model.trim();
  }

  public get keyCount(): number {
    return this.keyRotator.count;
  }

  public async translateDialogues(texts: string[], targetLang: string): Promise<string[]> {
    if (!texts.length) return [];

    const endpoint = `${this.baseUrl}/chat/completions`;
    const systemPrompt = `You are an expert manga, manhwa, and comic translator into ${targetLang}.
Translate the provided JSON array of dialogue strings into natural, expressive comic Vietnamese/target language.

RULES FOR TRANSLATION:
1. Translate speech bubbles, inner thoughts, and narrator boxes naturally, keeping character tone, emotion, and brevity.
   - If an OCR text line has minor typos or missing spaces (e.g. "WHAT'S GONC" -> "WHAT'S GOING", "ON IN THEREP" -> "ON IN THERE?"), automatically correct it using context and translate accurately.
   - NEVER discard or omit valid character speech bubbles!
2. Brevity & Bubble Formatting:
   - Keep translations concise to fit nicely inside speech bubbles.
   - For longer sentences, you may insert a single newline character (\\n) at natural pauses to balance text across lines.
3. CRITICAL FILTERING - ONLY OMIT TRUE JUNK & WATERMARKS:
   - Scanlation credits, website URLs, group plugs, Discord/Patreon links (e.g. "toonhey.com", "asura", "reaper", "read at...", "join our discord").
   - Standalone chapter numbers, page numbers, status labels (e.g. "Ch. 5", "Page 12", "01/24", "End of chapter").
   - Non-dialogue graphic noise or single punctuation symbols (e.g. "|", "---", "/", ";;", "..", "~~~").
   - FOR TRUE JUNK / WATERMARK / CREDIT ONLY: Return an EMPTY STRING ("") at that index! Do NOT omit real dialogue.
4. STRICT JSON OUTPUT FORMAT:
   - Return ONLY a JSON object with a single key "translations" containing an array of strings with the EXACT same length and order:
   {"translations": ["CÓ CHUYỆN GÌ ĐANG XẢY RA TRONG ĐÓ THẾ?", "", "Hừ"]}`;

    const payload: any = {
      model: this.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: JSON.stringify(texts) }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3
    };

    let resp: Response | null = null;
    const maxRetries = Math.max(3, this.keyRotator.count * 2);
    let lastErrorMsg = '';

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const activeKey = this.keyRotator.getNextKey();
      const maskedKey = ApiKeyRotator.maskKey(activeKey);
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (activeKey) {
        headers['Authorization'] = `Bearer ${activeKey}`;
      }

      try {
        resp = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });
      } catch (netErr: any) {
        lastErrorMsg = `Lỗi mạng: ${netErr?.message || netErr}`;
        DebugLogger.warn('OpenAI/Groq API', `Key ${maskedKey} gặp lỗi mạng. Đang đổi key hoặc thử lại...`);
        if (attempt < maxRetries && this.keyRotator.hasMultipleKeys) {
          continue;
        }
        if (attempt < maxRetries) {
          await new Promise((r) => setTimeout(r, 1000));
          continue;
        }
        break;
      }

      if (resp.ok) {
        this.keyRotator.markSuccess(activeKey);
        break;
      }

      const errText = await resp.text();
      let errorDetail = `HTTP ${resp.status}`;
      try {
        const json = JSON.parse(errText);
        if (json.error?.message) {
          errorDetail = `(${resp.status}): ${json.error.message}`;
        }
      } catch {
        errorDetail = `(${resp.status}): ${errText.substring(0, 120)}`;
      }
      lastErrorMsg = `API lỗi ${errorDetail}`;

      // 1. HTTP 401 / 403: Invalid Key or Forbidden
      if (resp.status === 401 || resp.status === 403) {
        this.keyRotator.markFailed(activeKey, `HTTP ${resp.status}`);
        DebugLogger.warn(
          'OpenAI/Groq API',
          `Key ${maskedKey} bị từ chối ${errorDetail}. Đang tự động chuyển sang key khác...`
        );
        if (attempt < maxRetries && this.keyRotator.hasMultipleKeys) {
          continue;
        }
        break;
      }

      // 2. HTTP 429: Rate Limit
      if (resp.status === 429) {
        const retryAfterSec = Number(resp.headers.get('retry-after'));
        const backoffMs = !isNaN(retryAfterSec) && retryAfterSec > 0
          ? retryAfterSec * 1000
          : 2500 * Math.pow(1.4, Math.min(attempt, 3)) + Math.random() * 500;

        this.keyRotator.markRateLimited(activeKey, backoffMs);

        if (this.keyRotator.hasMultipleKeys && attempt < maxRetries) {
          DebugLogger.warn('OpenAI/Groq API', `Key ${maskedKey} gặp 429 (Rate limit). Chuyển sang key khác ngay...`);
          continue;
        }

        if (attempt < maxRetries) {
          DebugLogger.warn('OpenAI/Groq API', `429 Rate limited. Đang chờ ${Math.round(backoffMs)}ms...`);
          await new Promise((r) => setTimeout(r, backoffMs));
          continue;
        }
        break;
      }

      // 3. HTTP 5xx: Server Errors (500, 502, 503, 504)
      if (resp.status >= 500) {
        this.keyRotator.markRateLimited(activeKey, 10000);
        DebugLogger.warn('OpenAI/Groq API', `Key ${maskedKey} gặp lỗi máy chủ ${errorDetail}. Đang thử key khác...`);
        if (this.keyRotator.hasMultipleKeys && attempt < maxRetries) {
          continue;
        }
        if (attempt < maxRetries) {
          await new Promise((r) => setTimeout(r, 1500));
          continue;
        }
        break;
      }

      // Other 4xx client errors
      break;
    }

    if (!resp || !resp.ok) {
      if (this.keyRotator.hasMultipleKeys) {
        throw new Error(`API: Đã thử qua ${this.keyRotator.count} API keys nhưng đều thất bại. ${lastErrorMsg}`);
      }
      throw new Error(lastErrorMsg || `API lỗi (${resp?.status || 0})`);
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

  /**
   * End-to-end Multimodal Vision AI translation:
   * Sends comic page image to OpenAI-compatible Vision API (OpenAI, OpenRouter, Groq Vision),
   * detects speech bubbles + 2D bounding boxes, translates dialogues with full visual context,
   * and identifies background color (dark/light).
   * STRICT: Never translates sound effects (SFX / onomatopoeia).
   */
  public async translateImage(
    base64Data: string,
    mimeType: string,
    targetLang: string,
    naturalWidth: number,
    naturalHeight: number
  ): Promise<DialogueItem[]> {
    const endpoint = `${this.baseUrl}/chat/completions`;
    const systemPrompt = `You are an expert manga, manhwa, and comic visual localization specialist.
Analyze the comic page image.

TASK:
1. Detect all character speech bubbles, inner thought bubbles, and narrator text boxes.
2. For each detected dialogue:
   - Provide a tight 2D bounding box normalized to 0-1000 scale: [ymin, xmin, ymax, xmax].
   - Transcribe original text.
   - Translate into natural, expressive, emotionally fitting ${targetLang}. Understand character gender, relationship, tone, and comic atmosphere from the visual drawings to pick proper pronouns.
   - Classify the bubble background color style:
     * "dark": speech bubble has black or dark background with white/light text (e.g. demonic, angry, horror, shock).
     * "light": speech bubble has white or light background with dark/black text (standard comic speech bubble).

CRITICAL NEGATIVE CONSTRAINTS (STRICTLY FORBIDDEN):
- DO NOT TRANSLATE SOUND EFFECTS (SFX / onomatopoeia / visual action sounds like "BOOM", "SWOOSH", "CRASH", "CLANG", "THUMP", "RUMBLE", "DOKI", stylized sound drawings). You MUST IGNORE all sound effect graphics completely!
- DO NOT translate scanlation credits, website URLs (e.g. toonhey.com, asura, reaper), group plugs, or chapter/page numbers.

OUTPUT FORMAT:
Return ONLY a valid JSON object containing a "dialogues" array:
{
  "dialogues": [
    {
      "box_2d": [ymin, xmin, ymax, xmax],
      "original_text": "MICHAEL!",
      "translation": "MICHAEL!",
      "background": "light"
    }
  ]
}
If no character dialogues or narrator boxes are found, return {"dialogues": []}.`;

    const payload: any = {
      model: this.model,
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Detect all character speech bubbles and narrator boxes in this comic image. Translate into ${targetLang}. Never translate sound effects (SFX). Return JSON object.`
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType || 'image/jpeg'};base64,${base64Data}`
              }
            }
          ]
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2
    };

    let resp: Response | null = null;
    const maxRetries = Math.max(3, this.keyRotator.count * 2);
    let lastErrorMsg = '';

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const activeKey = this.keyRotator.getNextKey();
      const maskedKey = ApiKeyRotator.maskKey(activeKey);
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (activeKey) {
        headers['Authorization'] = `Bearer ${activeKey}`;
      }

      try {
        resp = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });
      } catch (netErr: any) {
        lastErrorMsg = `Lỗi mạng: ${netErr?.message || netErr}`;
        DebugLogger.warn('OpenAI/Vision API', `Key ${maskedKey} gặp lỗi mạng. Đang đổi key hoặc thử lại...`);
        if (attempt < maxRetries && this.keyRotator.hasMultipleKeys) {
          continue;
        }
        if (attempt < maxRetries) {
          await new Promise((r) => setTimeout(r, 1000));
          continue;
        }
        break;
      }

      if (resp.ok) {
        this.keyRotator.markSuccess(activeKey);
        break;
      }

      const errText = await resp.text();
      let errorDetail = `HTTP ${resp.status}`;
      try {
        const json = JSON.parse(errText);
        if (json.error?.message) {
          errorDetail = `(${resp.status}): ${json.error.message}`;
        }
      } catch {
        errorDetail = `(${resp.status}): ${errText.substring(0, 120)}`;
      }
      lastErrorMsg = `Vision API lỗi ${errorDetail}`;

      // 1. HTTP 401 / 403: Invalid Key or Forbidden
      if (resp.status === 401 || resp.status === 403) {
        this.keyRotator.markFailed(activeKey, `HTTP ${resp.status}`);
        DebugLogger.warn(
          'OpenAI/Vision API',
          `Key ${maskedKey} bị từ chối ${errorDetail}. Đang tự động chuyển sang key khác...`
        );
        if (attempt < maxRetries && this.keyRotator.hasMultipleKeys) {
          continue;
        }
        break;
      }

      // 2. HTTP 429: Rate Limit
      if (resp.status === 429) {
        const retryAfterSec = Number(resp.headers.get('retry-after'));
        const backoffMs = !isNaN(retryAfterSec) && retryAfterSec > 0
          ? retryAfterSec * 1000
          : 2500 * Math.pow(1.4, Math.min(attempt, 3)) + Math.random() * 500;

        this.keyRotator.markRateLimited(activeKey, backoffMs);

        if (this.keyRotator.hasMultipleKeys && attempt < maxRetries) {
          DebugLogger.warn('OpenAI/Vision API', `Key ${maskedKey} gặp 429 (Rate limit). Chuyển sang key khác ngay...`);
          continue;
        }

        if (attempt < maxRetries) {
          DebugLogger.warn('OpenAI/Vision API', `429 Rate limited. Đang chờ ${Math.round(backoffMs)}ms...`);
          await new Promise((r) => setTimeout(r, backoffMs));
          continue;
        }
        break;
      }

      // 3. HTTP 5xx: Server Errors (500, 502, 503, 504)
      if (resp.status >= 500) {
        this.keyRotator.markRateLimited(activeKey, 10000);
        DebugLogger.warn('OpenAI/Vision API', `Key ${maskedKey} gặp lỗi máy chủ ${errorDetail}. Đang thử key khác...`);
        if (this.keyRotator.hasMultipleKeys && attempt < maxRetries) {
          continue;
        }
        if (attempt < maxRetries) {
          await new Promise((r) => setTimeout(r, 1500));
          continue;
        }
        break;
      }

      // Other 4xx client errors
      break;
    }

    if (!resp || !resp.ok) {
      if (this.keyRotator.hasMultipleKeys) {
        throw new Error(`Vision API: Đã thử qua ${this.keyRotator.count} API keys nhưng đều thất bại. ${lastErrorMsg}`);
      }
      throw new Error(lastErrorMsg || `Vision API lỗi (${resp?.status || 0})`);
    }

    const data = await resp.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      return [];
    }

    try {
      const parsed = JSON.parse(content.trim());
      const rawList = Array.isArray(parsed) ? parsed : (parsed.dialogues || parsed.items || []);
      const dialogues: DialogueItem[] = [];

      for (let i = 0; i < rawList.length; i++) {
        const item = rawList[i];
        if (!item || !item.translation) continue;

        const box2d = item.box_2d || item.box;
        if (!Array.isArray(box2d) || box2d.length < 4) continue;

        const [ymin, xmin, ymax, xmax] = box2d;
        const normYmin = Math.min(ymin, ymax);
        const normYmax = Math.max(ymin, ymax);
        const normXmin = Math.min(xmin, xmax);
        const normXmax = Math.max(xmin, xmax);

        const x = Math.round((normXmin / 1000) * naturalWidth);
        const y = Math.round((normYmin / 1000) * naturalHeight);
        const width = Math.round(((normXmax - normXmin) / 1000) * naturalWidth);
        const height = Math.round(((normYmax - normYmin) / 1000) * naturalHeight);

        if (width < 8 || height < 8) continue;

        dialogues.push({
          id: `slate_vision_${Date.now()}_${i}`,
          box: { x, y, width, height, confidence: 0.95 },
          originalText: String(item.original_text || item.text || '').trim(),
          translatedText: String(item.translation).trim(),
          isDarkBackground: item.background === 'dark'
        });
      }

      return dialogues;
    } catch (e: any) {
      console.error('[OpenAI Vision] Lỗi phân tích JSON:', content, e);
      throw new Error('Không thể phân tích dữ liệu tọa độ hộp thoại từ Vision API.');
    }
  }

  public async testConnection(): Promise<boolean> {
    const res = await this.translateDialogues(['Hello world'], 'Tiếng Việt');
    return Array.isArray(res) && res.length > 0;
  }
}
