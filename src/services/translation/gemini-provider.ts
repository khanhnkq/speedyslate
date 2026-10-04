import { DialogueItem } from '../../shared/types';
import { ITranslationProvider } from './translation-provider.interface';
import { ApiKeyRotator } from './api-key-rotator';

export class GeminiProvider implements ITranslationProvider {
  private keyRotator: ApiKeyRotator;
  private model: string;
  private baseUrl: string;

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
    const maxRetries = Math.max(3, this.keyRotator.count * 2);

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const activeKey = this.keyRotator.getNextKey();
      const endpoint = `${this.baseUrl}/models/${this.model}:generateContent?key=${activeKey}`;

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
          : 2500 * Math.pow(1.4, Math.min(attempt, 3)) + Math.random() * 500;

        this.keyRotator.markRateLimited(activeKey, backoffMs);

        // Instant failover: If we have multiple keys, rotate immediately without sleeping!
        if (this.keyRotator.count > 1) {
          console.warn(`[Gemini API] Key ...${activeKey.slice(-6)} gặp 429. Đang chuyển ngay sang key kế tiếp...`);
          continue;
        }

        console.warn(`[Gemini API] 429 Rate limited. Đang chờ ${Math.round(backoffMs)}ms trước khi thử lại...`);
        await new Promise((r) => setTimeout(r, backoffMs));
        continue;
      }

      if (resp.ok) {
        this.keyRotator.markSuccess(activeKey);
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
Return ONLY a valid JSON array of objects conforming to:
[
  {
    "box_2d": [ymin, xmin, ymax, xmax],
    "original_text": "MICHAEL!",
    "translation": "MICHAEL!",
    "background": "light"
  }
]
If no character dialogues or narrator boxes are found, return an empty array [].`;

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
              text: `Detect all character speech bubbles and narrator boxes in this comic image. Translate to ${targetLang}. Never translate sound effects (SFX). Return JSON array.`
            }
          ]
        }
      ],
      generationConfig: {
        response_mime_type: 'application/json',
        temperature: 0.2
      }
    };

    let resp: Response | null = null;
    const maxRetries = Math.max(3, this.keyRotator.count * 2);

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const activeKey = this.keyRotator.getNextKey();
      const endpoint = `${this.baseUrl}/models/${this.model}:generateContent?key=${activeKey}`;

      resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (resp.status === 429 && attempt < maxRetries) {
        const retryAfterSec = Number(resp.headers.get('retry-after'));
        const backoffMs = !isNaN(retryAfterSec) && retryAfterSec > 0
          ? retryAfterSec * 1000
          : 2500 * Math.pow(1.4, Math.min(attempt, 3)) + Math.random() * 500;

        this.keyRotator.markRateLimited(activeKey, backoffMs);

        // Instant failover: Rotate to next key without waiting
        if (this.keyRotator.count > 1) {
          console.warn(`[Gemini Vision API] Key ...${activeKey.slice(-6)} gặp 429. Đang chuyển ngay sang key kế tiếp...`);
          continue;
        }

        console.warn(`[Gemini Vision API] 429 Rate limited. Đang chờ ${Math.round(backoffMs)}ms...`);
        await new Promise((r) => setTimeout(r, backoffMs));
        continue;
      }

      if (resp.ok) {
        this.keyRotator.markSuccess(activeKey);
      }
      break;
    }

    if (!resp || !resp.ok) {
      const errText = resp ? await resp.text() : 'Không thể kết nối';
      let message = `Gemini Vision API lỗi (${resp?.status || 0})`;
      try {
        const json = JSON.parse(errText);
        if (json.error?.message) message += `: ${json.error.message}`;
      } catch {
        message += `: ${errText.substring(0, 100)}`;
      }
      throw new Error(message);
    }

    const data = await resp.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      return [];
    }

    try {
      const parsed = JSON.parse(candidateText.trim());
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
      console.error('[Gemini Vision] Lỗi phân tích JSON:', candidateText, e);
      throw new Error('Không thể phân tích dữ liệu tọa độ hộp thoại từ Gemini Vision.');
    }
  }

  public async testConnection(): Promise<boolean> {
    const testResult = await this.translateDialogues(['Hello, world!'], 'Tiếng Việt');
    return Array.isArray(testResult) && testResult.length > 0;
  }
}
