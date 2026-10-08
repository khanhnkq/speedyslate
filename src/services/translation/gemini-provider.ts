import { DialogueItem } from '../../shared/types';
import { ITranslationProvider } from './translation-provider.interface';
import { ApiKeyRotator } from './api-key-rotator';
import { DebugLogger } from '../../shared/debug-logger';
import { JsonExtractor } from './json-extractor';
import { VisionBoxParser } from './vision-box-parser';
import { AntigravityProvider } from './antigravity-provider';

export class GeminiProvider implements ITranslationProvider {
  private keyRotator: ApiKeyRotator;
  private model: string;
  private baseUrl: string;
  public lastKeyIndex: number = 1;

  constructor(apiKey: string | string[], model: string = 'gemini-3.5-flash-lite', baseUrl?: string) {
    this.keyRotator = new ApiKeyRotator(apiKey);
    this.model = model.trim() || 'gemini-3.5-flash-lite';
    this.baseUrl = (baseUrl || 'https://generativelanguage.googleapis.com/v1beta').replace(/\/+$/, '');
  }

  public get keyCount(): number {
    return this.keyRotator.count;
  }

  public async translateDialogues(texts: string[], targetLang: string): Promise<string[]> {
    if (!texts.length) return [];
    if (!this.keyRotator.hasKeys()) {
      throw new Error('Chưa cấu hình Gemini API Key. Vui lòng mở cài đặt extension.');
    }
    if (this.model.includes('antigravity')) {
      const antigravity = new AntigravityProvider(this.keyRotator.getRawKeys(), this.model, this.baseUrl);
      return antigravity.translateDialogues(texts, targetLang);
    }
    const systemPrompt = `You are an expert manga, manhwa, and comic translator.
Translate the provided JSON array of OCR-extracted dialogue lines into natural, contextual, expressive ${targetLang}.

RULES FOR COMIC TRANSLATION:
1. Translate dialogue, speech bubbles, inner monologues, and story narrations naturally, matching character emotion and comic context.
   - If an OCR text line has minor typos or missing spaces (e.g. "WHAT'S GONC" -> "WHAT'S GOING", "ON IN THEREP" -> "ON IN THERE?"), automatically correct it using context and translate accurately.
   - NEVER discard or omit valid character speech bubbles!
2. Brevity & Bubble Formatting:
   - Keep translations concise to fit inside comic bubbles.
   - For longer sentences, you may insert a single newline character (\\n) at natural phrasing pauses to balance text across lines.
3. FILTERING - ONLY OMIT TRUE JUNK & WATERMARKS:
   - Scanlation credits, website URLs (e.g. "toonhey.com", "asura"), chapter numbers, or non-dialogue graphic noise: return empty string (""). Do NOT omit real character dialogue.`;

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
        response_schema: {
          type: 'ARRAY',
          items: { type: 'STRING' }
        },
        temperature: 0.2
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_CIVIC_INTEGRITY', threshold: 'BLOCK_NONE' }
      ]
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
      const endpoint = `${this.baseUrl}/models/${this.model}:generateContent?key=${activeKey}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      try {
        resp = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal
        });
      } catch (netErr: any) {
        clearTimeout(timeoutId);
        if (netErr.name === 'AbortError') {
          lastErrorMsg = `Quá thời gian phản hồi từ Gemini API (timeout 12s). Key ${maskedKey}`;
        } else {
          lastErrorMsg = `Lỗi mạng: ${netErr?.message || netErr}`;
        }
        DebugLogger.warn('Gemini API', `${lastErrorMsg}. Đang đổi key hoặc thử lại...`);
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
      lastErrorMsg = `Gemini API lỗi ${errorDetail}`;

      // 1. HTTP 401 / 403: Invalid Key or Project Denied
      if (resp.status === 401 || resp.status === 403) {
        this.keyRotator.markFailed(activeKey, `HTTP ${resp.status}`);
        DebugLogger.warn(
          'Gemini API',
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
          DebugLogger.warn('Gemini API', `Key ${maskedKey} gặp 429 (Rate limit). Chuyển sang key khác ngay...`);
          continue;
        }

        if (attempt < maxRetries) {
          DebugLogger.warn('Gemini API', `429 Rate limited. Đang chờ ${Math.round(backoffMs)}ms...`);
          await new Promise((r) => setTimeout(r, backoffMs));
          continue;
        }
        break;
      }

      // 3. HTTP 5xx: Server Errors (500, 502, 503, 504)
      if (resp.status >= 500) {
        this.keyRotator.markRateLimited(activeKey, 10000);
        DebugLogger.warn('Gemini API', `Key ${maskedKey} gặp lỗi máy chủ ${errorDetail}. Đang thử key khác...`);
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
        throw new Error(`Gemini API: Đã thử qua ${this.keyRotator.count} API keys nhưng đều thất bại. ${lastErrorMsg}`);
      }
      throw new Error(lastErrorMsg || `Gemini API lỗi (${resp?.status || 0})`);
    }

    const data = await resp.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error('Gemini API không trả về nội dung hợp lệ.');
    }

    const parsed = JsonExtractor.safeParse<any>(candidateText, null);
    if (Array.isArray(parsed)) {
      return parsed.map((item: any) => String(item ?? ''));
    }
    if (parsed && typeof parsed === 'object') {
      const found = Object.values(parsed).find((v) => Array.isArray(v)) || Object.values(parsed);
      if (Array.isArray(found) && found.length === texts.length) {
        return (found as any[]).map((v: any) => String(v ?? ''));
      }
    }

    // Fallback: line-by-line parsing if json was completely broken
    const lines = candidateText.split('\n').filter((l: string) => l.trim().length > 0);
    if (lines.length === texts.length) {
      return lines;
    }

    throw new Error('Không thể phân tích định dạng JSON kết quả từ Gemini.');
  }

  /**
   * End-to-end Multimodal Vision AI translation:
   * Sends comic page image directly to Gemini Vision, detects speech bubbles + 2D bounding boxes,
   * translates dialogues with full visual context, and identifies background color (dark/light).
   * STRICT: Never translates sound effects (SFX / onomatopoeia).
   */
  public async translateImage(
    base64Data: string,
    mimeType: string,
    targetLang: string,
    naturalWidth: number,
    naturalHeight: number
  ): Promise<DialogueItem[]> {
    if (!this.keyRotator.hasKeys()) {
      throw new Error('Chưa cấu hình Gemini API Key. Vui lòng mở cài đặt extension.');
    }
    if (this.model.includes('antigravity')) {
      const antigravity = new AntigravityProvider(this.keyRotator.getRawKeys(), this.model, this.baseUrl);
      return antigravity.translateImage(base64Data, mimeType, targetLang, naturalWidth, naturalHeight);
    }
    const systemPrompt = `You are an expert manga, manhwa, and comic visual localization specialist.
Analyze the comic page image.

TASK:
1. Detect all character speech dialogues, inner thoughts, and narrator text boxes.
2. For each detected dialogue:
   - Provide a tight 2D bounding box normalized to 0-1000 scale: [ymin, xmin, ymax, xmax] tightly enclosing the printed TEXT itself inside the speech bubble.
     CRITICAL: Bounding box must tightly wrap the printed text lines to be replaced. Do NOT include the empty bubble margins or the speech bubble tail pointing to the character.
   - Transcribe original text.
   - Translate into natural, expressive, emotionally fitting ${targetLang}. Understand character gender, relationship, tone, and comic atmosphere from the visual drawings to pick proper pronouns.
   - Classify the bubble background color style:
     * "dark": speech bubble has black or dark background with white/light text.
     * "light": speech bubble has white or light background with dark/black text.

CRITICAL NEGATIVE CONSTRAINTS:
- NEVER translate sound effects (SFX / onomatopoeia like "BOOM", "SWOOSH", "RUSTLE", "HAAA..."). Ignore them completely!
- Never translate scanlation credits, website URLs (e.g. toonhey.com), group plugs, or chapter/page numbers.`;

    const requestBody = {
      system_instruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: [
        {
          parts: [
            {
              inline_data: {
                mime_type: mimeType || 'image/jpeg',
                data: base64Data
              }
            },
            {
              text: `Detect all character dialogue text in this comic image. Bounding box [ymin, xmin, ymax, xmax] must tightly wrap the TEXT itself (not the bubble tail). Translate to ${targetLang}. Never translate sound effects (SFX). Return JSON array.`
            }
          ]
        }
      ],
      generationConfig: {
        response_mime_type: 'application/json',
        response_schema: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              box_2d: {
                type: 'ARRAY',
                items: { type: 'INTEGER' },
                description: '[ymin, xmin, ymax, xmax] tight bounding box of dialogue TEXT itself (excluding bubble tail), normalized 0-1000'
              },
              original_text: { type: 'STRING' },
              translation: { type: 'STRING' },
              background: {
                type: 'STRING',
                enum: ['light', 'dark']
              }
            },
            required: ['box_2d', 'translation']
          }
        },
        temperature: 0.2
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_CIVIC_INTEGRITY', threshold: 'BLOCK_NONE' }
      ]
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
      const endpoint = `${this.baseUrl}/models/${this.model}:generateContent?key=${activeKey}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 24000);

      try {
        resp = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
          signal: controller.signal
        });
      } catch (netErr: any) {
        clearTimeout(timeoutId);
        if (netErr.name === 'AbortError') {
          lastErrorMsg = `Quá thời gian phản hồi từ Gemini API (timeout 24s). Key ${maskedKey}`;
        } else {
          lastErrorMsg = `Lỗi mạng: ${netErr?.message || netErr}`;
        }
        DebugLogger.warn('Gemini Vision API', `${lastErrorMsg}. Đang đổi key hoặc thử lại...`);
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
      lastErrorMsg = `Gemini Vision API lỗi ${errorDetail}`;

      // 1. HTTP 401 / 403: Invalid Key or Project Denied
      if (resp.status === 401 || resp.status === 403) {
        this.keyRotator.markFailed(activeKey, `HTTP ${resp.status}`);
        DebugLogger.warn(
          'Gemini Vision API',
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
          DebugLogger.warn('Gemini Vision API', `Key ${maskedKey} gặp 429 (Rate limit). Chuyển sang key khác ngay...`);
          continue;
        }

        if (attempt < maxRetries) {
          DebugLogger.warn('Gemini Vision API', `429 Rate limited. Đang chờ ${Math.round(backoffMs)}ms...`);
          await new Promise((r) => setTimeout(r, backoffMs));
          continue;
        }
        break;
      }

      // 3. HTTP 5xx: Server Errors (500, 502, 503, 504)
      if (resp.status >= 500) {
        this.keyRotator.markRateLimited(activeKey, 10000);
        DebugLogger.warn('Gemini Vision API', `Key ${maskedKey} gặp lỗi máy chủ ${errorDetail}. Đang thử key khác...`);
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
        throw new Error(`Gemini Vision API: Đã thử qua ${this.keyRotator.count} API keys nhưng đều thất bại. ${lastErrorMsg}`);
      }
      throw new Error(lastErrorMsg || `Gemini Vision API lỗi (${resp?.status || 0})`);
    }

    const data = await resp.json();
    const candidate = data?.candidates?.[0];
    const finishReason = candidate?.finishReason;
    const blockReason = data?.promptFeedback?.blockReason;

    // Detect Google Safety Filter block on sensitive/18+ content
    if (finishReason === 'SAFETY' || blockReason === 'SAFETY') {
      const reason = finishReason || blockReason;
      DebugLogger.warn('Gemini Vision', `Ảnh bị Google Safety Filter chặn (${reason}: nội dung nhạy cảm/18+).`);
      throw new Error(`Google Safety Filter chặn ảnh này (${reason}: ảnh nhạy cảm/18+). Bạn có thể đổi sang chế độ OCR Hybrid (quét cục bộ bằng WebGPU) để dịch không bị kiểm duyệt.`);
    }

    const candidateText = candidate?.content?.parts?.[0]?.text;
    if (!candidateText) {
      if (finishReason && finishReason !== 'STOP') {
        DebugLogger.warn('Gemini Vision', `Phản hồi rỗng với finishReason: ${finishReason}`);
        throw new Error(`Gemini không trả về văn bản (finishReason: ${finishReason}).`);
      }
      return [];
    }

    try {
      const rawList = JsonExtractor.extractDialogueItems(candidateText);
      return VisionBoxParser.parseItems(rawList, naturalWidth, naturalHeight);
    } catch (e: any) {
      DebugLogger.error('Gemini Vision', `Lỗi parse JSON. Raw AI text: ${candidateText.substring(0, 300)}`, e);
      throw new Error('Không thể phân tích dữ liệu tọa độ hộp thoại từ Gemini Vision.');
    }
  }

  public async testConnection(): Promise<boolean> {
    const testResult = await this.translateDialogues(['Hello, world!'], 'Tiếng Việt');
    return Array.isArray(testResult) && testResult.length > 0;
  }
}
