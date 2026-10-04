import browser from 'webextension-polyfill';

export interface LogEntry {
  time: string;
  level: 'info' | 'warn' | 'error';
  tag: string;
  message: string;
  stack?: string;
}

const STORAGE_KEY = 'speedyslate_debug_logs';
const MAX_LOGS = 120;

export class DebugLogger {
  private static memoryLogs: LogEntry[] = [];

  private static formatTime(): string {
    const d = new Date();
    return d.toTimeString().split(' ')[0] + '.' + String(d.getMilliseconds()).padStart(3, '0');
  }

  private static extractErrorInfo(error?: any): { message?: string; stack?: string } {
    if (!error) return {};
    if (error instanceof Error) {
      return { message: error.message, stack: error.stack };
    }
    if (typeof error === 'string') {
      return { message: error };
    }
    if (typeof error === 'object') {
      try {
        const msg = error.message || error.reason || error.error || JSON.stringify(error);
        const stack = error.stack || (error.reason && error.reason.stack);
        return { message: String(msg), stack: stack ? String(stack) : undefined };
      } catch {
        return { message: String(error) };
      }
    }
    return { message: String(error) };
  }

  public static async log(
    level: 'info' | 'warn' | 'error',
    tag: string,
    message: string,
    error?: any
  ): Promise<void> {
    const errInfo = this.extractErrorInfo(error);
    const fullMsg = errInfo.message && errInfo.message !== message
      ? `${message} (${errInfo.message})`
      : String(message);

    const entry: LogEntry = {
      time: this.formatTime(),
      level,
      tag,
      message: fullMsg,
      stack: errInfo.stack
    };

    this.memoryLogs.push(entry);
    if (this.memoryLogs.length > MAX_LOGS) {
      this.memoryLogs.shift();
    }

    const prefix = `[${entry.time}] [${tag}]`;
    if (level === 'error') {
      console.error(prefix, message, error || '');
    } else if (level === 'warn') {
      console.warn(prefix, message);
    } else {
      console.log(prefix, message);
    }

    try {
      const data: Record<string, any> = await browser.storage.local.get(STORAGE_KEY);
      const stored: LogEntry[] = Array.isArray(data[STORAGE_KEY]) ? data[STORAGE_KEY] : [];
      const updated = [...stored, entry];
      if (updated.length > MAX_LOGS) {
        updated.splice(0, updated.length - MAX_LOGS);
      }
      await browser.storage.local.set({ [STORAGE_KEY]: updated });
    } catch {
      // Storage might be restricted in some execution contexts
    }
  }

  public static async error(tag: string, message: string, error?: any): Promise<void> {
    return this.log('error', tag, message, error);
  }

  public static async warn(tag: string, message: string): Promise<void> {
    return this.log('warn', tag, message);
  }

  public static async info(tag: string, message: string): Promise<void> {
    return this.log('info', tag, message);
  }

  public static async getLogs(): Promise<LogEntry[]> {
    try {
      const res = await browser.storage.local.get(STORAGE_KEY);
      return (res[STORAGE_KEY] as LogEntry[]) || this.memoryLogs;
    } catch {
      return this.memoryLogs;
    }
  }

  public static async clearLogs(): Promise<void> {
    this.memoryLogs = [];
    try {
      await browser.storage.local.remove(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  public static formatForClipboard(logs: LogEntry[], extraContext?: Record<string, any>): string {
    const timeStr = new Date().toISOString();
    let header = `=== SpeedySlate Debug Logs (${timeStr}) ===\n`;
    header += `UserAgent: ${typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A'}\n`;
    header += `Platform: ${typeof navigator !== 'undefined' ? navigator.platform : 'N/A'}\n`;

    if (extraContext) {
      header += `Context: ${JSON.stringify(extraContext, null, 2)}\n`;
    }
    header += `--------------------------------------------------------\n\n`;

    if (!logs || logs.length === 0) {
      return header + 'Chưa có nhật ký nào được ghi nhận.';
    }

    const body = logs
      .map((l) => {
        let str = `[${l.time}] [${l.level.toUpperCase()}] [${l.tag}]: ${l.message}`;
        if (l.stack) {
          str += `\n  Stack trace:\n  ${l.stack.split('\n').join('\n  ')}`;
        }
        return str;
      })
      .join('\n\n');

    return header + body;
  }

  public static async copyToClipboard(text: string): Promise<boolean> {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      // Fallback to execCommand below
    }

    if (typeof document !== 'undefined') {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        return success;
      } catch {
        return false;
      }
    }
    return false;
  }
}
