import { DialogueItem } from '../../shared/types';
import { ITranslationProvider } from './translation-provider.interface';
import { ApiKeyRotator } from './api-key-rotator';
import { DebugLogger } from '../../shared/debug-logger';
import { JsonExtractor } from './json-extractor';
import { VisionBoxParser } from './vision-box-parser';
import { InteractionsParser } from './interactions-parser';

/**
 * AntigravityProvider: Implements translation via Google Gemini Interactions API
 * Powered by Antigravity Agent (antigravity-preview-09-2026) running in Google secure Linux sandbox.
 * Complies with SOLID (LSP, SRP) and Mozilla AMO guidelines.
 */
export class AntigravityProvider implements ITranslationProvider {
  private keyRotator: ApiKeyRotator;
  private model: string;
  private baseUrl: string;
  public lastKeyIndex: number = 1;

  constructor(apiKey: string | string[], model: string = 'antigravity-preview-09-2026', baseUrl?: string) {
    this.keyRotator = new ApiKeyRotator(apiKey);
    this.model = model.trim() || 'antigravity-preview-09-2026';
    this.baseUrl = (baseUrl || 'https://generativelanguage.googleapis.com/v1beta').replace(/\/+$/, '');
  }

  public get keyCount(): number {
    return this.keyRotator.count;
  }

  /**
   * Parses agent name and optional underlying Gemini model (e.g. gemini-3.8-flash, gemini-3.5-flash-lite)
   */
  private parseModelConfig(): { agent: string; subModel?: string } {
    const raw = this.model.trim();
    let agent = 'antigravity-preview-09-2026';
    let subModel: string | undefined = undefined;

    // Detect submodel in parentheses or colon, e.g. "antigravity-preview-09-2026 (gemini-3.8-flash)"
    const subMatch = raw.match(/\(([^)]+)\)/) || raw.match(/:(.+)$/);
    if (subMatch) {
      subModel = subMatch[1].trim();
    } else if (raw.startsWith('gemini-')) {
      subModel = raw;
    }

    if (raw.startsWith('antigravity')) {
      agent = raw.split(/[\s(:]/)[0].trim() || 'antigravity-preview-09-2026';
    }

    return { agent, subModel };
  }

  /**
   * Hybrid OCR Mode: Translates OCR-extracted dialogue lines
   */
  public async translateDialogues(texts: string[], targetLang: string, sourceLang?: string): Promise<string[]> {
    if (!texts.length) return [];
    if (!this.keyRotator.hasKeys()) {
      throw new Error('Chưa cấu hình Gemini API Key cho Antigravity. Vui lòng mở cài đặt extension.');
    }

    const srcDesc = (!sourceLang || sourceLang === 'auto') ? 'original comic language (auto-detect)' : sourceLang;
    const prompt = `You are an expert manga, manhwa, and comic translator.
Translate the provided JSON array of OCR-extracted dialogue lines from ${srcDesc} into natural, contextual, expressive ${targetLang}.

RULES FOR COMIC TRANSLATION:
1. Translate dialogue, speech bubbles, inner monologues, and story narrations naturally, matching character emotion and comic context.
   - If an OCR text line has minor typos or missing spaces (e.g. "WHAT'S GONC" -> "WHAT'S GOING"), automatically correct it using context.
   - NEVER discard or omit valid character speech bubbles!
2. Brevity & Bubble Formatting: Keep translations concise to fit inside comic speech bubbles.
3. FILTERING: Scanlation credits, website URLs (e.g. "toonhey.com", "asura"), chapter numbers, or non-dialogue graphic noise: return empty string (""). Do NOT omit real character dialogue.
4. STRICT OUTPUT FORMAT:
Output MUST be a valid JSON array of strings with the EXACT same length and order as the input array.
Return ONLY raw JSON, with NO surrounding explanation or conversational text:
["text 1", "text 2"]

INPUT TEXTS:
${JSON.stringify(texts)}`;

    const { agent, subModel } = this.parseModelConfig();
    const requestBody: any = {
      agent,
      input: prompt,
      environment: 'remote',
      background: false
    };

    if (subModel) {
      requestBody.agent_config = {
        type: 'antigravity',
        model: subModel
      };
    }

    const endpointPath = `${this.baseUrl}/interactions`;
    const candidateText = await this.executeWithRetry(endpointPath, requestBody, 'Antigravity Agent');

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

    // Line-by-line fallback
    const lines = candidateText.split('\n').filter((l: string) => l.trim().length > 0);
    if (lines.length === texts.length) {
      return lines;
    }

    throw new Error('Không thể phân tích định dạng JSON kết quả từ Antigravity Agent.');
  }

  /**
   * Multimodal Vision AI Mode: Sends comic image directly to Antigravity Agent
   */
  public async translateImage(
    base64Data: string,
    mimeType: string,
    targetLang: string,
    naturalWidth: number,
    naturalHeight: number,
    sourceLang?: string
  ): Promise<DialogueItem[]> {
    if (!this.keyRotator.hasKeys()) {
      throw new Error('Chưa cấu hình Gemini API Key cho Antigravity. Vui lòng mở cài đặt extension.');
    }

    const srcDesc = (!sourceLang || sourceLang === 'auto') ? 'original language (auto-detect)' : sourceLang;
    const prompt = `You are an expert manga, manhwa, and comic visual localization specialist.
Analyze this comic page image. Translate dialogues from ${srcDesc} into natural, expressive, emotionally fitting ${targetLang}.

TASK:
1. Detect all character speech dialogues, inner thoughts, and narrator text boxes.
2. For each detected dialogue:
   - Provide a tight 2D bounding box normalized to 0-1000 scale: [ymin, xmin, ymax, xmax] tightly enclosing the printed TEXT itself inside the speech bubble.
     CRITICAL: Bounding box must tightly wrap the printed text lines to be replaced. Do NOT include empty bubble margins or speech bubble tails.
   - Transcribe original text.
   - Translate into natural, expressive, emotionally fitting ${targetLang}.
   - Classify bubble background color style:
     * "dark": speech bubble has black or dark background with white/light text.
     * "light": speech bubble has white or light background with dark/black text.

CRITICAL NEGATIVE CONSTRAINTS:
- NEVER translate sound effects (SFX / onomatopoeia like "BOOM", "SWOOSH", "RUSTLE"). Ignore them completely!
- Never translate scanlation credits, website URLs, group plugs, or chapter/page numbers.

STRICT OUTPUT FORMAT:
Return ONLY a valid JSON array of objects with keys:
[
  {
    "box_2d": [ymin, xmin, ymax, xmax],
    "original_text": "...",
    "translation": "...",
    "background_color": "dark" | "light"
  }
]`;

    const { agent, subModel } = this.parseModelConfig();
    const requestBody: any = {
      agent,
      input: [
        {
          type: 'text',
          text: prompt
        },
        {
          type: 'image',
          mime_type: mimeType || 'image/jpeg',
          data: base64Data
        }
      ],
      environment: 'remote',
      background: false
    };

    if (subModel) {
      requestBody.agent_config = {
        type: 'antigravity',
        model: subModel
      };
    }

    const endpointPath = `${this.baseUrl}/interactions`;
    const candidateText = await this.executeWithRetry(endpointPath, requestBody, 'Antigravity Vision');

    try {
      const rawList = JsonExtractor.extractDialogueItems(candidateText);
      return VisionBoxParser.parseItems(rawList, naturalWidth, naturalHeight);
    } catch (e: any) {
      DebugLogger.error('Antigravity Vision', `Lỗi parse JSON. Raw text: ${candidateText.substring(0, 300)}`, e);
      throw new Error('Không thể phân tích dữ liệu tọa độ hộp thoại từ Antigravity Vision.');
    }
  }

  /**
   * Polls asynchronous interaction until completion
   */
  private async pollInteraction(nameOrId: string, apiKey: string, label: string): Promise<any> {
    const resourcePath = nameOrId.startsWith('interactions/') ? nameOrId : `interactions/${nameOrId}`;
    const pollUrl = `${this.baseUrl}/${resourcePath}?key=${encodeURIComponent(apiKey)}`;
    const maxPollAttempts = 15;
    const pollDelayMs = 1500;

    for (let i = 0; i < maxPollAttempts; i++) {
      await new Promise((r) => setTimeout(r, pollDelayMs));
      try {
        const resp = await fetch(pollUrl, {
          method: 'GET',
          headers: { 'x-goog-api-key': apiKey }
        });
        if (!resp.ok) continue;
        const result = await resp.json();
        const state = result.status || result.state;
        if (state === 'completed') {
          return result;
        }
        if (state === 'failed') {
          const errMsg = result.error?.message || result.failure_reason || 'Tác vụ Antigravity thất bại';
          throw new Error(`${label} lỗi khi xử lý: ${errMsg}`);
        }
      } catch (err: any) {
        if (err.message?.includes(label)) throw err;
      }
    }
    throw new Error(`${label}: Quá thời gian chờ phản hồi từ Google Interactions.`);
  }

  /**
   * Helper executing POST request with key rotation, error detection, and timeouts
   */
  private async executeWithRetry(endpointPath: string, requestBody: any, label: string): Promise<string> {
    const limitCheck = this.keyRotator.areAllKeysRateLimited();
    if (limitCheck.allLimited) {
      const sec = Math.ceil(limitCheck.minRemainingMs / 1000);
      throw new Error(`Tất cả (${this.keyRotator.count}) API key đều đang bị giới hạn (429 Rate Limit). Vui lòng đợi ${sec}s.`);
    }

    const maxRetries = Math.min(this.keyRotator.count, 3);
    let lastErrorMsg = '';
    let resp: Response | null = null;
    let activeKey = '';

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      activeKey = this.keyRotator.getNextKey();
      const maskedKey = ApiKeyRotator.maskKey(activeKey);
      const url = `${endpointPath}?key=${encodeURIComponent(activeKey)}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      try {
        resp = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': activeKey
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal
        });
      } catch (netErr: any) {
        clearTimeout(timeoutId);
        if (netErr.name === 'AbortError') {
          lastErrorMsg = `Quá thời gian phản hồi từ ${label} (timeout 30s). Key ${maskedKey}`;
        } else {
          lastErrorMsg = `Lỗi mạng: ${netErr?.message || netErr}`;
        }
        DebugLogger.warn(label, `${lastErrorMsg}. Đang đổi key hoặc thử lại...`);
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
      lastErrorMsg = `${label} lỗi ${errorDetail}`;

      // 1. 401 / 403: Invalid Key
      if (resp.status === 401 || resp.status === 403) {
        this.keyRotator.markFailed(activeKey, `HTTP ${resp.status}`);
        DebugLogger.warn(label, `Key ${maskedKey} bị từ chối ${errorDetail}. Đang đổi key...`);
        if (attempt < maxRetries && this.keyRotator.hasMultipleKeys) {
          continue;
        }
        break;
      }

      // 2. 429: Rate Limit
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
          DebugLogger.warn(label, `Key ${maskedKey} gặp 429 (Rate limit). Chuyển sang key khác ngay...`);
          continue;
        }

        if (attempt < maxRetries) {
          DebugLogger.warn(label, `429 Rate limited. Đang chờ ${Math.round(backoffMs)}ms...`);
          await new Promise((r) => setTimeout(r, backoffMs));
          continue;
        }
        break;
      }

      // 3. 5xx: Server Errors
      if (resp.status >= 500) {
        this.keyRotator.markRateLimited(activeKey, 10000);
        DebugLogger.warn(label, `Key ${maskedKey} gặp lỗi máy chủ ${errorDetail}. Đang thử key khác...`);
        if (this.keyRotator.hasMultipleKeys && attempt < maxRetries) {
          continue;
        }
        if (attempt < maxRetries) {
          await new Promise((r) => setTimeout(r, 1500));
          continue;
        }
        break;
      }

      break;
    }

    if (!resp || !resp.ok) {
      if (this.keyRotator.hasMultipleKeys) {
        throw new Error(`${label}: Đã thử qua ${this.keyRotator.count} API keys nhưng đều thất bại. ${lastErrorMsg}`);
      }
      throw new Error(lastErrorMsg || `${label} lỗi (${resp?.status || 0})`);
    }

    let data = await resp.json();

    // Check if interaction reported failure inside payload
    const failureCheck = InteractionsParser.checkFailure(data);
    if (failureCheck.failed) {
      throw new Error(`${label} lỗi máy chủ: ${failureCheck.message}`);
    }

    // Check if interaction returned asynchronous in_progress state
    const progressCheck = InteractionsParser.checkInProgress(data);
    if (progressCheck.inProgress && progressCheck.resourceId) {
      data = await this.pollInteraction(progressCheck.resourceId, activeKey, label);
    }

    const candidateText = InteractionsParser.extractText(data);
    if (!candidateText) {
      const preview = JSON.stringify(data).substring(0, 400);
      DebugLogger.error(label, `Không trích xuất được text. Keys: [${Object.keys(data || {}).join(', ')}]. Dữ liệu: ${preview}`);
      throw new Error(`${label} không trả về nội dung văn bản hợp lệ. Phản hồi nhận được: ${preview}`);
    }

    return candidateText;
  }

  /**
   * Lightweight connection probe
   */
  public async testConnection(): Promise<boolean> {
    const testResult = await this.translateDialogues(['Hello, world!'], 'Tiếng Việt');
    return Array.isArray(testResult) && testResult.length > 0;
  }
}
