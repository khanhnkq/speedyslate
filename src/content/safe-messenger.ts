import browser from 'webextension-polyfill';
import { DebugLogger } from '../shared/debug-logger';

export interface SafeMessageOptions {
  maxRetries?: number;
  retryDelayMs?: number;
  timeoutMs?: number;
}

/**
 * SafeMessenger: Bulletproof communication between Content Script & Background Service Worker.
 * Handles Chrome MV3 Service Worker termination, ephemeral lifecycles, and closed message channels.
 * Follows Single Responsibility Principle (SRP).
 */
export class SafeMessenger {
  private static isPortClosedError(errMsg: string): boolean {
    const lower = errMsg.toLowerCase();
    return (
      lower.includes('message channel closed') ||
      lower.includes('receiving end does not exist') ||
      lower.includes('could not establish connection') ||
      lower.includes('port closed') ||
      lower.includes('asynchronous response by returning true')
    );
  }

  /**
   * Send message with automatic Service Worker wake-up and retry on port closure
   */
  public static async send<T = any>(
    message: any,
    options: SafeMessageOptions = {}
  ): Promise<T> {
    const maxRetries = options.maxRetries ?? 2;
    const retryDelayMs = options.retryDelayMs ?? 400;

    let lastError: any = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const resp: any = await browser.runtime.sendMessage(message);
        if (resp !== undefined) {
          return resp as T;
        }
      } catch (err: any) {
        lastError = err;
        const errMsg = err?.message || String(err);

        // Extension was reloaded in chrome://extensions -> context is permanently dead for this tab
        if (errMsg.toLowerCase().includes('extension context invalidated')) {
          return {
            success: false,
            isContextInvalidated: true,
            error: 'Tiện ích đã được tải lại hoặc cập nhật. Vui lòng tải lại trang (F5 / Cmd+R).'
          } as unknown as T;
        }

        if (this.isPortClosedError(errMsg) && attempt < maxRetries) {
          const delay = retryDelayMs * (attempt + 1);
          console.warn(
            `[SpeedySlate] Service worker channel closed (attempt ${attempt + 1}/${maxRetries + 1}). Waking up worker and retrying in ${delay}ms...`
          );
          DebugLogger.warn(
            'SafeMessenger',
            `Message channel closed for ${message?.action || 'unknown'}. Waking worker (attempt ${attempt + 1})...`
          );

          await new Promise((r) => setTimeout(r, delay));

          // Send a lightweight ping to wake up the Service Worker
          try {
            await browser.runtime.sendMessage({ action: 'PING' });
          } catch {
            // Ignore wake-up ping error
          }

          continue;
        }

        // If it's another type of error or max retries exceeded, stop retrying
        break;
      }
    }

    const finalErrMsg =
      lastError?.message ||
      'Không nhận được phản hồi từ tiện ích (kênh liên lạc đã bị đóng)';

    return {
      success: false,
      error: finalErrMsg
    } as unknown as T;
  }
}
