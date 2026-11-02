import { DialogueItem } from '../../shared/types';
import { DebugLogger } from '../../shared/debug-logger';
import { ITranslationProvider } from './translation-provider.interface';
import { ApiKeyRotator } from './api-key-rotator';
import { JsonExtractor } from './json-extractor';
import { VisionBoxParser } from './vision-box-parser';

export class OpenAIProvider implements ITranslationProvider {
  private baseUrl: string;
  private keyRotator: ApiKeyRotator;
  private model: string;
  public lastKeyIndex: number = 1;

  constructor(baseUrl: string, apiKey: string | string[], model: string) {
    this.baseUrl = baseUrl.trim().replace(/\/+$/, '');
    this.keyRotator = new ApiKeyRotator(apiKey);
    this.model = model.trim();
  }

  public get keyCount(): number {
    return this.keyRotator.count;
  }

  public async translateDialogues(texts: string[], targetLang: string, sourceLang?: string): Promise<string[]> {
    if (!texts.length) return [];

    const endpoint = `${this.baseUrl}/chat/completions`;
    const srcDesc = (!sourceLang || sourceLang === 'auto') ? 'the original comic language (auto-detect)' : sourceLang;
    const systemPrompt = `You are an expert manga, manhwa, and comic translator from ${srcDesc} into ${targetLang}.
Translate the provided JSON array of dialogue strings into natural, expressive comic speech in ${targetLang}.

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
    const limitCheck = this.keyRotator.areAllKeysRateLimited();
    if (limitCheck.allLimited) {
      const sec = Math.ceil(limitCheck.minRemainingMs / 1000);
      throw new Error(`Tất cả (${this.keyRotator.count}) API key đều đang bị giới hạn (429 Rate Limit). Vui lòng đợi ${sec}s.`);
    }

    const maxRetries = Math.min(this.keyRotator.count, 3);
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

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 14000);

      try {
        resp = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
          signal: controller.signal
        });
      } catch (netErr: any) {
        clearTimeout(timeoutId);
        if (netErr.name === 'AbortError') {
          lastErrorMsg = `Quá thời gian phản hồi từ API (timeout 14s). Key ${maskedKey}`;
        } else {
          lastErrorMsg = `Lỗi mạng: ${netErr?.message || netErr}`;
        }
        DebugLogger.warn('OpenAI/Groq API', `${lastErrorMsg}. Đang đổi key hoặc thử lại...`);
        if (attempt < maxRetries && this.keyRotator.hasMultipleKeys) {
          continue;
        }
        if (attempt < maxRetries) {
          await new Promise((r) => setTimeout(r, 1000));
          continue;
        }
        break;
      }
      clearTimeout(timeoutId);

      if (resp.ok) {
        this.lastKeyIndex = this.keyRotator.getKeyIndex(activeKey);
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

        const checkAll = this.keyRotator.areAllKeysRateLimited();
        if (checkAll.allLimited) {
          const sec = Math.ceil(checkAll.minRemainingMs / 1000);
          throw new Error(`Tất cả (${this.keyRotator.count}) API key đều đang bị giới hạn (429 Rate Limit). Vui lòng đợi ${sec}s.`);
        }

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

    const parsed = JsonExtractor.safeParse<any>(content, null);
    if (Array.isArray(parsed)) {
      return parsed.map((item: any) => String(item ?? ''));
    }
    if (parsed && typeof parsed === 'object') {
      if (Array.isArray(parsed.translations)) {
        return (parsed.translations as any[]).map((item: any) => String(item ?? ''));
      }
      const values = Object.values(parsed);
      if (values.length === texts.length && values.every((v) => typeof v === 'string')) {
        return values as string[];
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
    naturalHeight: number,
    sourceLang?: string
  ): Promise<DialogueItem[]> {
    const endpoint = `${this.baseUrl}/chat/completions`;
    const srcDesc = (!sourceLang || sourceLang === 'auto') ? 'original language (auto-detect)' : sourceLang;
    const systemPrompt = `You are an expert manga, manhwa, and comic visual localization specialist.
Analyze the comic page image. Translate dialogues from ${srcDesc} into natural, expressive, emotionally fitting ${targetLang}.

TASK:
1. Detect all character speech bubbles, inner thought bubbles, and narrator text boxes.
2. For each detected dialogue:
   - Provide a 2D bounding box normalized to 0-1000 scale: [ymin, xmin, ymax, xmax] covering the speech bubble interior area (excluding tails). For vertical Asian text manga, ensure the bounding box covers the natural horizontal width of the bubble so horizontal translated text fits.
   - Transcribe original text.
   - Translate into natural, expressive, emotionally fitting ${targetLang}. Understand character gender, relationship, tone, and comic atmosphere from the visual drawings to pick proper pronouns.
     BREVITY: Keep translations concise and punchy to fit nicely inside speech bubbles.
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
    const limitCheck = this.keyRotator.areAllKeysRateLimited();
    if (limitCheck.allLimited) {
      const sec = Math.ceil(limitCheck.minRemainingMs / 1000);
      throw new Error(`Tất cả (${this.keyRotator.count}) API key đều đang bị giới hạn (429 Rate Limit). Vui lòng đợi ${sec}s.`);
    }

    const maxRetries = Math.min(this.keyRotator.count, 3);
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

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 24000);

      try {
        resp = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
          signal: controller.signal
        });
      } catch (netErr: any) {
        clearTimeout(timeoutId);
        if (netErr.name === 'AbortError') {
          lastErrorMsg = `Quá thời gian phản hồi từ API (timeout 24s). Key ${maskedKey}`;
        } else {
          lastErrorMsg = `Lỗi mạng: ${netErr?.message || netErr}`;
        }
        DebugLogger.warn('OpenAI/Vision API', `${lastErrorMsg}. Đang đổi key hoặc thử lại...`);
        if (attempt < maxRetries && this.keyRotator.hasMultipleKeys) {
          continue;
        }
        if (attempt < maxRetries) {
          await new Promise((r) => setTimeout(r, 1000));
          continue;
        }
        break;
      }
      clearTimeout(timeoutId);

      if (resp.ok) {
        this.lastKeyIndex = this.keyRotator.getKeyIndex(activeKey);
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

        const checkAll = this.keyRotator.areAllKeysRateLimited();
        if (checkAll.allLimited) {
          const sec = Math.ceil(checkAll.minRemainingMs / 1000);
          throw new Error(`Tất cả (${this.keyRotator.count}) API key đều đang bị giới hạn (429 Rate Limit). Vui lòng đợi ${sec}s.`);
        }

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
    const choice = data?.choices?.[0];
    const finishReason = choice?.finish_reason;

    if (finishReason === 'content_filter') {
      DebugLogger.warn('OpenAI/Vision API', 'Ảnh bị Content Filter chặn (nội dung nhạy cảm/18+).');
      throw new Error('AI Content Filter chặn ảnh này (ảnh nhạy cảm/18+). Bạn có thể đổi sang chế độ OCR Hybrid (quét cục bộ bằng WebGPU) để dịch không bị kiểm duyệt.');
    }

    const content = choice?.message?.content;
    if (!content) {
      if (finishReason && finishReason !== 'stop') {
        DebugLogger.warn('OpenAI/Vision API', `Phản hồi rỗng với finish_reason: ${finishReason}`);
        throw new Error(`AI Vision không trả về nội dung (finish_reason: ${finishReason}).`);
      }
      return [];
    }

    try {
      const rawList = JsonExtractor.extractDialogueItems(content);
      return VisionBoxParser.parseItems(rawList, naturalWidth, naturalHeight);
    } catch (e: any) {
      DebugLogger.error('OpenAI Vision', `Lỗi parse JSON. Raw AI text: ${content.substring(0, 300)}`, e);
      throw new Error('Không thể phân tích dữ liệu tọa độ hộp thoại từ Vision API.');
    }
  }

  public async testConnection(): Promise<boolean> {
    const res = await this.translateDialogues(['Hello world'], 'Tiếng Việt');
    return Array.isArray(res) && res.length > 0;
  }
}
