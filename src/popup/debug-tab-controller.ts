import browser from 'webextension-polyfill';
import { DebugLogger } from '../shared/debug-logger';
import { TranslationCacheDb } from '../shared/translation-db';
import { ExtensionSettings } from '../shared/types';

/**
 * DebugTabController: Handles System tab operations in Popup
 * (Cache inspection/cleanup, error log display, and log clipboard export).
 * Complies with SOLID (SRP) and keeps popup.ts under 500 lines.
 */
export class DebugTabController {
  private cacheStatsText = document.getElementById('cache-stats-text') as HTMLElement;
  private clearCacheBtn = document.getElementById('btn-clear-cache') as HTMLButtonElement;
  private logCountBadge = document.getElementById('log-count-badge') as HTMLElement;
  private logViewerBox = document.getElementById('log-viewer-box') as HTMLElement;
  private logContentText = document.getElementById('log-content-text') as HTMLElement;
  private copyLogsBtn = document.getElementById('btn-copy-logs') as HTMLButtonElement;
  private refreshLogsBtn = document.getElementById('btn-refresh-logs') as HTMLButtonElement;
  private clearLogsBtn = document.getElementById('btn-clear-logs') as HTMLButtonElement;
  private copyLogStatus = document.getElementById('copy-log-status') as HTMLElement;

  private cachedLogs: any[] = [];
  private getSettings: () => ExtensionSettings;
  private getBackendName: () => string;

  constructor(getSettings: () => ExtensionSettings, getBackendName: () => string) {
    this.getSettings = getSettings;
    this.getBackendName = getBackendName;
    this.attachEventListeners();
  }

  public async init(): Promise<void> {
    await this.updateCacheStats();
    await this.loadDebugLogs(false);
  }

  public async updateCacheStats(): Promise<void> {
    if (!this.cacheStatsText) return;
    try {
      const stats = await TranslationCacheDb.getCacheStats();
      this.cacheStatsText.textContent = `${stats.count} ảnh`;
    } catch {
      this.cacheStatsText.textContent = '0 ảnh';
    }
  }

  public async loadDebugLogs(autoScroll: boolean = false): Promise<void> {
    try {
      const resp: any = await browser.runtime.sendMessage({ action: 'GET_DEBUG_LOGS' });
      if (resp?.success && Array.isArray(resp.logs)) {
        this.cachedLogs = resp.logs;
        if (this.logCountBadge) {
          this.logCountBadge.textContent = `${resp.logs.length} log`;
        }
        if (resp.logs.length === 0) {
          if (this.logContentText) this.logContentText.textContent = 'Chưa có nhật ký lỗi nào.';
        } else {
          const recent = resp.logs.slice(-30).map((l: any) => {
            const lvl = l.level === 'error' ? '✖' : l.level === 'warn' ? '⚠' : 'ℹ';
            return `${lvl} [${l.time}] [${l.tag}]: ${l.message}`;
          }).join('\n');
          if (this.logContentText) this.logContentText.textContent = recent;
          if (autoScroll && this.logViewerBox) {
            this.logViewerBox.scrollTop = this.logViewerBox.scrollHeight;
          }
        }
      }
    } catch {
      if (this.logContentText) this.logContentText.textContent = 'Không thể tải nhật ký.';
    }
  }

  private attachEventListeners(): void {
    // Clear Cache Button
    this.clearCacheBtn?.addEventListener('click', async () => {
      if (confirm('Bạn có chắc muốn xóa toàn bộ bộ nhớ đệm bản dịch trang truyện?')) {
        this.clearCacheBtn.disabled = true;
        this.clearCacheBtn.textContent = 'Đang dọn…';
        await TranslationCacheDb.clearAllCache();
        await this.updateCacheStats();
        setTimeout(() => {
          this.clearCacheBtn.textContent = 'Dọn sạch cache';
          this.clearCacheBtn.disabled = false;
        }, 1800);
      }
    });

    // Copy debug logs to clipboard
    this.copyLogsBtn?.addEventListener('click', async () => {
      try {
        this.copyLogsBtn.disabled = true;
        await this.loadDebugLogs(true);

        const settings = this.getSettings();
        const curProvider = settings?.activeProvider || 'unknown';
        const context = {
          activeOcrModel: settings?.activeOcrModelId || 'unknown',
          activeBackend: this.getBackendName() || 'idle',
          useWebGpu: settings?.useWebGpu ?? true,
          provider: curProvider,
          providerModel: settings?.providers[curProvider]?.model,
          hasApiKey: Boolean(settings?.providers[curProvider]?.apiKey),
          autoScrollSpeed: settings?.autoScrollSpeed,
          bubbleTheme: settings?.bubbleTheme,
          rotateProviders: settings?.rotateProviders ?? true
        };

        const text = DebugLogger.formatForClipboard(this.cachedLogs, context);
        const copied = await DebugLogger.copyToClipboard(text);

        if (copied) {
          this.copyLogStatus.textContent = '✓ Đã sao chép nhật ký!';
          this.copyLogStatus.className = 'inline-status ok';
        } else {
          this.copyLogStatus.textContent = 'Không thể copy tự động, vui lòng bôi đen nhật ký.';
          this.copyLogStatus.className = 'inline-status err';
        }
        setTimeout(() => {
          this.copyLogStatus.textContent = '';
        }, 3000);
      } catch (err: any) {
        this.copyLogStatus.textContent = `Lỗi copy: ${err.message}`;
        this.copyLogStatus.className = 'inline-status err';
      } finally {
        this.copyLogsBtn.disabled = false;
      }
    });

    // Refresh debug logs
    this.refreshLogsBtn?.addEventListener('click', async () => {
      await this.loadDebugLogs(true);
      this.copyLogStatus.textContent = '✓ Đã làm mới!';
      this.copyLogStatus.className = 'inline-status ok';
      setTimeout(() => {
        this.copyLogStatus.textContent = '';
      }, 1500);
    });

    // Clear debug logs
    this.clearLogsBtn?.addEventListener('click', async () => {
      await browser.runtime.sendMessage({ action: 'CLEAR_DEBUG_LOGS' });
      this.cachedLogs = [];
      if (this.logCountBadge) this.logCountBadge.textContent = '0 log';
      if (this.logContentText) this.logContentText.textContent = 'Đã xóa toàn bộ nhật ký.';
    });
  }
}
