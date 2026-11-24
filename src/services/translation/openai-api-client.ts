import { DebugLogger } from '../../shared/debug-logger';
import { ApiKeyRotator } from './api-key-rotator';

export interface OpenAIChatRequestParams {
  baseUrl: string;
  model: string;
  messages: { role: string; content: any }[];
  keyRotator: ApiKeyRotator;
  jsonObjectMode?: boolean;
  timeoutMs?: number;
  temperature?: number;
  tag?: string;
  onSuccess?: (keyIndex: number) => void;
}

/**
 * OpenAIApiClient: Shared HTTP transport for OpenAI-compatible endpoints
 * (OpenAI, Groq, DeepSeek, OpenRouter, Ollama, Custom).
 * Centralizes multi-key rotation, 429 cooldowns, 5xx retries, and automatic
 * 1-time downgrade from `response_format: { type: 'json_object' }` on HTTP 400.
 */
export class OpenAIApiClient {
  private static readonly promptOnlyHosts = new Set<string>();

  public static async postChatCompletion(params: OpenAIChatRequestParams): Promise<any> {
    const baseUrl = params.baseUrl.trim().replace(/\/+$/, '');
    const endpoint = `${baseUrl}/chat/completions`;
    const tag = params.tag || 'OpenAI/Groq API';
    const timeoutMs = params.timeoutMs ?? 14000;
    const rotator = params.keyRotator;

    const limitCheck = rotator.areAllKeysRateLimited();
    if (limitCheck.allLimited) {
      const sec = Math.ceil(limitCheck.minRemainingMs / 1000);
      throw new Error(
        `Tất cả (${rotator.count}) API key đều đang bị giới hạn (429 Rate Limit). Vui lòng đợi ${sec}s.`
      );
    }

    let useJsonObject =
      Boolean(params.jsonObjectMode) && !OpenAIApiClient.promptOnlyHosts.has(`${baseUrl}|${params.model}`);
    const maxRetries = Math.min(rotator.count, 3);
    let lastErrorMsg = '';
    let resp: Response | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const activeKey = rotator.getNextKey();
      const maskedKey = ApiKeyRotator.maskKey(activeKey);
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (activeKey) {
        headers['Authorization'] = `Bearer ${activeKey}`;
      }

      const payload: Record<string, unknown> = {
        model: params.model,
        messages: params.messages,
        temperature: params.temperature ?? 0.3
      };
      if (useJsonObject) {
        payload.response_format = { type: 'json_object' };
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      try {
        resp = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
          signal: controller.signal
        });
      } catch (netErr: any) {
        clearTimeout(timeoutId);
        lastErrorMsg =
          netErr.name === 'AbortError'
            ? `Quá thời gian phản hồi từ API (timeout ${Math.round(timeoutMs / 1000)}s). Key ${maskedKey}`
            : `Lỗi mạng: ${netErr?.message || netErr}`;
        DebugLogger.warn(tag, `${lastErrorMsg}. Đang đổi key hoặc thử lại...`);
        if (attempt < maxRetries && rotator.hasMultipleKeys) continue;
        if (attempt < maxRetries) {
          await new Promise((r) => setTimeout(r, 1000));
          continue;
        }
        break;
      }
      clearTimeout(timeoutId);

      if (resp.ok) {
        params.onSuccess?.(rotator.getKeyIndex(activeKey));
        rotator.markSuccess(activeKey);
        return resp.json();
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

      // Automatic 1-time downgrade when custom/local endpoints reject response_format
      if (resp.status === 400 && useJsonObject) {
        useJsonObject = false;
        OpenAIApiClient.promptOnlyHosts.add(`${baseUrl}|${params.model}`);
        DebugLogger.warn(tag, `Endpoint không hỗ trợ json_object (${errorDetail}), tự động chuyển sang prompt-only.`);
        attempt--;
        continue;
      }

      if (resp.status === 401 || resp.status === 403) {
        rotator.markFailed(activeKey, `HTTP ${resp.status}`);
        DebugLogger.warn(tag, `Key ${maskedKey} bị từ chối ${errorDetail}. Đang chuyển key...`);
        if (attempt < maxRetries && rotator.hasMultipleKeys) continue;
        break;
      }

      if (resp.status === 429) {
        const retryAfterSec = Number(resp.headers.get('retry-after'));
        const backoffMs =
          !isNaN(retryAfterSec) && retryAfterSec > 0
            ? retryAfterSec * 1000
            : 2500 * Math.pow(1.4, Math.min(attempt, 3)) + Math.random() * 500;
        rotator.markRateLimited(activeKey, backoffMs);

        const checkAll = rotator.areAllKeysRateLimited();
        if (checkAll.allLimited) {
          const sec = Math.ceil(checkAll.minRemainingMs / 1000);
          throw new Error(
            `Tất cả (${rotator.count}) API key đều đang bị giới hạn (429 Rate Limit). Vui lòng đợi ${sec}s.`
          );
        }
        if (rotator.hasMultipleKeys && attempt < maxRetries) continue;
        if (attempt < maxRetries) {
          await new Promise((r) => setTimeout(r, backoffMs));
          continue;
        }
        break;
      }

      if (resp.status >= 500) {
        rotator.markRateLimited(activeKey, 10000);
        if (rotator.hasMultipleKeys && attempt < maxRetries) continue;
        if (attempt < maxRetries) {
          await new Promise((r) => setTimeout(r, 1500));
          continue;
        }
        break;
      }

      break;
    }

    if (rotator.hasMultipleKeys) {
      throw new Error(`API: Đã thử qua ${rotator.count} API keys nhưng đều thất bại. ${lastErrorMsg}`);
    }
    throw new Error(lastErrorMsg || `API lỗi (${resp?.status || 0})`);
  }
}
