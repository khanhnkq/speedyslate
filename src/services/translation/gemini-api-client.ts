import { ApiKeyRotator } from './api-key-rotator';
import { DebugLogger } from '../../shared/debug-logger';

/**
 * Shared Gemini HTTP client: POST generateContent with key rotation,
 * timeout, 401/403/429/5xx handling and exponential backoff.
 * Used by both text (translateDialogues) and vision (translateImage) calls.
 */
export class GeminiApiClient {
  /**
   * POST to :generateContent with automatic key rotation.
   * Returns the parsed JSON body on success; throws a Vietnamese
   * user-facing error after exhausting keys/retries.
   */
  public static async postGenerate(opts: {
    baseUrl: string;
    model: string;
    requestBody: unknown;
    keyRotator: ApiKeyRotator;
    timeoutMs: number;
    tag: string; // log prefix, e.g. 'Gemini API' | 'Gemini Vision API'
    onSuccess?: (keyIndex: number) => void;
  }): Promise<any> {
    const { baseUrl, model, requestBody, keyRotator, timeoutMs, tag, onSuccess } = opts;

    let resp: Response | null = null;
    const limitCheck = keyRotator.areAllKeysRateLimited();
    if (limitCheck.allLimited) {
      const sec = Math.ceil(limitCheck.minRemainingMs / 1000);
      throw new Error(`Tất cả (${keyRotator.count}) API key đều đang bị giới hạn (429 Rate Limit). Vui lòng đợi ${sec}s.`);
    }

    const maxRetries = Math.min(keyRotator.count, 3);
    let lastErrorMsg = '';

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const activeKey = keyRotator.getNextKey();
      const maskedKey = ApiKeyRotator.maskKey(activeKey);
      const endpoint = `${baseUrl}/models/${model}:generateContent?key=${activeKey}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      try {
        resp = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
          signal: controller.signal
        });
      } catch (netErr: any) {
        clearTimeout(timeoutId);
        lastErrorMsg = netErr.name === 'AbortError'
          ? `Quá thời gian phản hồi từ ${tag} (timeout ${timeoutMs / 1000}s). Key ${maskedKey}`
          : `Lỗi mạng: ${netErr?.message || netErr}`;
        DebugLogger.warn(tag, `${lastErrorMsg}. Đang đổi key hoặc thử lại...`);
        if (attempt < maxRetries && keyRotator.hasMultipleKeys) continue;
        if (attempt < maxRetries) {
          await new Promise((r) => setTimeout(r, 1000));
          continue;
        }
        break;
      }
      clearTimeout(timeoutId);

      if (resp.ok) {
        onSuccess?.(keyRotator.getKeyIndex(activeKey));
        keyRotator.markSuccess(activeKey);
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
      lastErrorMsg = `${tag} lỗi ${errorDetail}`;

      // 1. HTTP 401 / 403: Invalid Key or Project Denied
      if (resp.status === 401 || resp.status === 403) {
        keyRotator.markFailed(activeKey, `HTTP ${resp.status}`);
        DebugLogger.warn(tag, `Key ${maskedKey} bị từ chối ${errorDetail}. Đang tự động chuyển sang key khác...`);
        if (attempt < maxRetries && keyRotator.hasMultipleKeys) continue;
        break;
      }

      // 2. HTTP 429: Rate Limit
      if (resp.status === 429) {
        const retryAfterSec = Number(resp.headers.get('retry-after'));
        const backoffMs = !isNaN(retryAfterSec) && retryAfterSec > 0
          ? retryAfterSec * 1000
          : 2500 * Math.pow(1.4, Math.min(attempt, 3)) + Math.random() * 500;

        keyRotator.markRateLimited(activeKey, backoffMs);

        const checkAll = keyRotator.areAllKeysRateLimited();
        if (checkAll.allLimited) {
          const sec = Math.ceil(checkAll.minRemainingMs / 1000);
          throw new Error(`Tất cả (${keyRotator.count}) API key đều đang bị giới hạn (429 Rate Limit). Vui lòng đợi ${sec}s.`);
        }

        if (keyRotator.hasMultipleKeys && attempt < maxRetries) {
          DebugLogger.warn(tag, `Key ${maskedKey} gặp 429 (Rate limit). Chuyển sang key khác ngay...`);
          continue;
        }
        if (attempt < maxRetries) {
          DebugLogger.warn(tag, `429 Rate limited. Đang chờ ${Math.round(backoffMs)}ms...`);
          await new Promise((r) => setTimeout(r, backoffMs));
          continue;
        }
        break;
      }

      // 3. HTTP 5xx: Server Errors
      if (resp.status >= 500) {
        keyRotator.markRateLimited(activeKey, 10000);
        DebugLogger.warn(tag, `Key ${maskedKey} gặp lỗi máy chủ ${errorDetail}. Đang thử key khác...`);
        if (keyRotator.hasMultipleKeys && attempt < maxRetries) continue;
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
      if (keyRotator.hasMultipleKeys) {
        throw new Error(`${tag}: Đã thử qua ${keyRotator.count} API keys nhưng đều thất bại. ${lastErrorMsg}`);
      }
      throw new Error(lastErrorMsg || `${tag} lỗi (${resp?.status || 0})`);
    }

    return resp.json();
  }
}
