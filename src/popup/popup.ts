import browser from 'webextension-polyfill';
import { ModelHubController } from './model-hub-controller';
import { API_PRESETS, OCR_MODEL_PRESETS } from '../shared/presets';
import { StorageService } from '../shared/storage';
import { TranslationCacheDb } from '../shared/translation-db';
import { BubbleTheme, ExtensionSettings, ProviderType } from '../shared/types';
import { ApiKeyRotator } from '../services/translation/api-key-rotator';
import { DebugLogger } from '../shared/debug-logger';

class PopupController {
  private settings!: ExtensionSettings;

  // DOM Elements - OCR Hub
  private statusBadge = document.getElementById('model-status-badge') as HTMLElement;
  private backendBadge = document.getElementById('ocr-backend-badge') as HTMLElement;
  private webgpuToggle = document.getElementById('toggle-webgpu') as HTMLInputElement;
  private modelHub!: ModelHubController;

  // DOM Elements - Mode
  private radioModeHybrid = document.getElementById('radio-mode-hybrid') as HTMLInputElement;
  private radioModeVision = document.getElementById('radio-mode-vision') as HTMLInputElement;
  private sectionOcrModels = document.getElementById('section-ocr-models') as HTMLElement;
  private visionNotice = document.getElementById('vision-mode-notice') as HTMLElement;

  private backendPollTimer: ReturnType<typeof setInterval> | null = null;

  // DOM Elements - API
  private providerSelect = document.getElementById('provider-select') as HTMLSelectElement;
  private baseUrlInput = document.getElementById('input-base-url') as HTMLInputElement;
  private modelPresetSelect = document.getElementById('select-model-preset') as HTMLSelectElement;
  private customModelInput = document.getElementById('input-custom-model') as HTMLInputElement;
  private apiKeyInput = document.getElementById('input-api-key') as HTMLTextAreaElement;
  private apiKeyCountBadge = document.getElementById('api-key-count-badge') as HTMLElement;
  private rateLimitInput = document.getElementById('input-rate-limit') as HTMLInputElement;
  private testBtn = document.getElementById('btn-test-connection') as HTMLButtonElement;
  private testResult = document.getElementById('test-result') as HTMLElement;

  // DOM Elements - Cache DB
  private cacheStatsText = document.getElementById('cache-stats-text') as HTMLElement;
  private clearCacheBtn = document.getElementById('btn-clear-cache') as HTMLButtonElement;

  // DOM Elements - Preferences & Save
  private themeSelect = document.getElementById('select-theme') as HTMLSelectElement;
  private speedInput = document.getElementById('input-speed') as HTMLInputElement;
  private saveBtn = document.getElementById('btn-save-settings') as HTMLButtonElement;
  private saveStatus = document.getElementById('save-status') as HTMLElement;

  // DOM Elements - Debug & Logs
  private logCountBadge = document.getElementById('log-count-badge') as HTMLElement;
  private logViewerBox = document.getElementById('log-viewer-box') as HTMLElement;
  private logContentText = document.getElementById('log-content-text') as HTMLElement;
  private copyLogsBtn = document.getElementById('btn-copy-logs') as HTMLButtonElement;
  private refreshLogsBtn = document.getElementById('btn-refresh-logs') as HTMLButtonElement;
  private clearLogsBtn = document.getElementById('btn-clear-logs') as HTMLButtonElement;
  private copyLogStatus = document.getElementById('copy-log-status') as HTMLElement;
  private cachedLogs: any[] = [];

  public async init(): Promise<void> {
    this.settings = await StorageService.getSettings();

    // Initialize Interactive Model Cards Hub
    const cardsContainer = document.getElementById('ocr-model-cards') as HTMLElement;
    const storageLabel = document.getElementById('model-storage-used') as HTMLElement;

    this.modelHub = new ModelHubController(
      cardsContainer,
      storageLabel,
      this.statusBadge,
      this.settings.activeOcrModelId || OCR_MODEL_PRESETS[0]?.id || 'pp-ocrv4-server-heavy',
      async (newModelId) => {
        this.settings.activeOcrModelId = newModelId;
        await StorageService.saveSettings(this.settings);
        browser.runtime.sendMessage({ action: 'WARMUP_OCR' })
          .then((resp: any) => {
            if (resp?.backend) this.renderBackendBadge(resp.backend);
          })
          .catch(() => {});
      }
    );

    await this.modelHub.render();
    this.renderProviderPresets();
    this.loadDisplayPreferences();

    // Restore WebGPU toggle state
    this.webgpuToggle.checked = this.settings.useWebGpu ?? true;

    // Restore Translation Mode
    const currentMode = this.settings.translationMode || 'hybrid_ocr';
    if (currentMode === 'vision_ai' && this.radioModeVision) {
      this.radioModeVision.checked = true;
    } else if (this.radioModeHybrid) {
      this.radioModeHybrid.checked = true;
    }
    this.applyModeUI(currentMode);

    this.attachEventListeners();
    await this.updateCacheStats();
    await this.loadDebugLogs();
    this.startBackendStatusPolling();
  }

  private applyModeUI(mode: string): void {
    const isVision = mode === 'vision_ai';
    if (this.sectionOcrModels) {
      if (isVision) {
        this.sectionOcrModels.classList.add('section-dimmed');
      } else {
        this.sectionOcrModels.classList.remove('section-dimmed');
      }
    }
    if (this.visionNotice) {
      this.visionNotice.style.display = isVision ? 'block' : 'none';
    }
  }

  private renderProviderPresets(): void {
    this.providerSelect.innerHTML = '';
    const types: ProviderType[] = ['gemini', 'groq', 'deepseek', 'openrouter', 'openai', 'ollama', 'custom'];

    for (const t of types) {
      const info = API_PRESETS[t];
      const opt = document.createElement('option');
      opt.value = t;
      opt.textContent = info.name;
      if (t === this.settings.activeProvider) {
        opt.selected = true;
      }
      this.providerSelect.appendChild(opt);
    }

    this.updateProviderForm(this.settings.activeProvider);
  }

  private updateProviderForm(type: ProviderType): void {
    const preset = API_PRESETS[type];
    const savedConfig = this.settings.providers[type];

    this.baseUrlInput.value = savedConfig.baseUrl || preset.baseUrl;
    this.apiKeyInput.value = savedConfig.apiKey || '';
    this.updateApiKeyCount();

    // Populate suggested models dropdown
    this.modelPresetSelect.innerHTML = '';
    for (const m of preset.suggestedModels) {
      const opt = document.createElement('option');
      opt.value = m;
      opt.textContent = m;
      this.modelPresetSelect.appendChild(opt);
    }
    const currentModel = savedConfig.model || preset.defaultModel;
    if (preset.suggestedModels.includes(currentModel)) {
      this.modelPresetSelect.value = currentModel;
    }
    this.customModelInput.value = currentModel;

    const defaultDelay = preset.defaultDelayMs ?? 1200;
    this.rateLimitInput.value = String(this.settings.rateLimitDelayMs ?? defaultDelay);
  }

  private updateApiKeyCount(): void {
    if (!this.apiKeyInput || !this.apiKeyCountBadge) return;
    const count = ApiKeyRotator.parseKeys(this.apiKeyInput.value).length;
    this.apiKeyCountBadge.textContent = `${count} key${count > 1 ? 's (xoay vòng)' : ''}`;
    this.apiKeyCountBadge.style.color = count > 1 ? 'var(--accent)' : 'var(--ink2)';
  }

  private loadDisplayPreferences(): void {
    this.themeSelect.value = this.settings.bubbleTheme;
    this.speedInput.value = String(this.settings.autoScrollSpeed);
  }



  /** Poll background every 3 s to show which ONNX backend is active and refresh logs. */
  private startBackendStatusPolling(): void {
    const refresh = async () => {
      try {
        const resp: any = await browser.runtime.sendMessage({ action: 'GET_OCR_STATUS' });
        this.renderBackendBadge(resp?.backend ?? 'idle');
        await this.loadDebugLogs(false);
      } catch {
        this.renderBackendBadge('idle');
      }
    };
    refresh();
    this.backendPollTimer = setInterval(refresh, 3000);
    window.addEventListener('unload', () => {
      if (this.backendPollTimer) {
        clearInterval(this.backendPollTimer);
        this.backendPollTimer = null;
      }
    });
  }

  private renderBackendBadge(backend: string): void {
    const map: Record<string, { label: string; cls: string }> = {
      webgpu: { label: 'WebGPU', cls: 'backend-webgpu' },
      wasm:   { label: 'WASM (CPU)', cls: 'backend-wasm' },
      idle:   { label: 'Chưa nạp', cls: 'backend-idle' }
    };
    const info = map[backend] ?? map['idle'];
    this.backendBadge.className = `status-val ${info.cls}`;
    this.backendBadge.textContent = info.label;
  }

  private async updateCacheStats(): Promise<void> {
    if (!this.cacheStatsText) return;
    const stats = await TranslationCacheDb.getCacheStats();
    this.cacheStatsText.textContent = `${stats.count} ảnh`;
  }

  private async loadDebugLogs(autoScroll = true): Promise<void> {
    try {
      const resp: any = await browser.runtime.sendMessage({ action: 'GET_DEBUG_LOGS' });
      if (resp?.success && Array.isArray(resp.logs)) {
        this.cachedLogs = resp.logs;
        this.logCountBadge.textContent = `${resp.logs.length} log`;
        if (resp.logs.length === 0) {
          this.logContentText.textContent = 'Chưa có nhật ký lỗi nào.';
        } else {
          const recent = resp.logs.slice(-30).map((l: any) => {
            const lvl = l.level === 'error' ? '✖' : l.level === 'warn' ? '⚠' : 'ℹ';
            return `${lvl} [${l.time}] [${l.tag}]: ${l.message}`;
          }).join('\n');
          this.logContentText.textContent = recent;
          if (autoScroll && this.logViewerBox) {
            this.logViewerBox.scrollTop = this.logViewerBox.scrollHeight;
          }
        }
      }
    } catch {
      this.logContentText.textContent = 'Không thể tải nhật ký.';
    }
  }

  private attachEventListeners(): void {
    // Translation Mode radio toggle
    const onModeChange = () => {
      const mode = this.radioModeVision?.checked ? 'vision_ai' : 'hybrid_ocr';
      this.settings.translationMode = mode;
      this.applyModeUI(mode);
      StorageService.saveSettings(this.settings);
    };
    this.radioModeHybrid?.addEventListener('change', onModeChange);
    this.radioModeVision?.addEventListener('change', onModeChange);

    // API Key input live count & auto-persist
    this.apiKeyInput?.addEventListener('input', () => {
      this.updateApiKeyCount();
    });
    this.apiKeyInput?.addEventListener('change', () => {
      this.saveCurrentFormToSettings();
    });

    // WebGPU toggle
    this.webgpuToggle.addEventListener('change', async () => {
      this.settings.useWebGpu = this.webgpuToggle.checked;
      await StorageService.saveSettings(this.settings);
      try {
        const resp: any = await browser.runtime.sendMessage({ action: 'SET_WEBGPU' });
        this.renderBackendBadge(resp?.backend ?? 'idle');
      } catch {
        this.renderBackendBadge('idle');
      }
    });

    // Clear Cache DB
    this.clearCacheBtn.addEventListener('click', async () => {
      this.clearCacheBtn.disabled = true;
      this.clearCacheBtn.textContent = 'Đang dọn...';
      try {
        await browser.runtime.sendMessage({ action: 'CLEAR_ALL_CACHE' });
        await TranslationCacheDb.clearAllCache();
        await this.updateCacheStats();
        this.clearCacheBtn.textContent = '✓ Đã dọn sạch!';
        this.clearCacheBtn.style.color = '#10b981';
        this.clearCacheBtn.style.borderColor = '#10b981';
        setTimeout(() => {
          this.clearCacheBtn.textContent = 'Dọn sạch cache';
          this.clearCacheBtn.style.color = '';
          this.clearCacheBtn.style.borderColor = '';
          this.clearCacheBtn.disabled = false;
        }, 1800);
      } catch (err: any) {
        this.clearCacheBtn.textContent = 'Lỗi dọn cache';
        setTimeout(() => {
          this.clearCacheBtn.textContent = 'Dọn sạch cache';
          this.clearCacheBtn.disabled = false;
        }, 1800);
      }
    });

    // Provider change
    this.providerSelect.addEventListener('change', () => {
      const type = this.providerSelect.value as ProviderType;
      this.updateProviderForm(type);
      const p = API_PRESETS[type];
      if (p) {
        this.rateLimitInput.value = String(p.defaultDelayMs);
      }
    });

    // Model preset change
    this.modelPresetSelect.addEventListener('change', () => {
      this.customModelInput.value = this.modelPresetSelect.value;
    });

    // Test API Connection
    this.testBtn.addEventListener('click', async () => {
      this.testBtn.disabled = true;
      this.testResult.textContent = 'Đang kiểm tra…';
      this.testResult.className = 'inline-status';

      await this.saveCurrentFormToSettings();

      try {
        const resp: any = await browser.runtime.sendMessage({
          action: 'TEST_CONNECTION',
          providerType: this.providerSelect.value
        });

        if (resp?.success) {
          this.testResult.textContent = 'Kết nối OK';
          this.testResult.className = 'inline-status ok';
        } else {
          this.testResult.textContent = `Lỗi: ${resp?.error || 'Không thể kết nối'}`;
          this.testResult.className = 'inline-status err';
        }
      } catch (err: any) {
        this.testResult.textContent = `Lỗi: ${err?.message}`;
        this.testResult.className = 'inline-status err';
      } finally {
        this.testBtn.disabled = false;
      }
    });

    // Save All Settings
    this.saveBtn.addEventListener('click', async () => {
      await this.saveCurrentFormToSettings();
      this.saveStatus.textContent = 'Đã lưu';
      setTimeout(() => {
        this.saveStatus.textContent = '';
      }, 2000);
    });

    // Copy debug logs to clipboard
    this.copyLogsBtn.addEventListener('click', async () => {
      try {
        this.copyLogsBtn.disabled = true;
        await this.loadDebugLogs(true);

        const curProvider = this.settings?.activeProvider || 'unknown';
        const context = {
          activeOcrModel: this.settings?.activeOcrModelId || 'unknown',
          activeBackend: this.backendBadge.textContent || 'idle',
          useWebGpu: this.settings?.useWebGpu ?? true,
          provider: curProvider,
          providerModel: this.settings?.providers[curProvider]?.model,
          hasApiKey: Boolean(this.settings?.providers[curProvider]?.apiKey),
          autoScrollSpeed: this.settings?.autoScrollSpeed,
          bubbleTheme: this.settings?.bubbleTheme
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
    this.refreshLogsBtn.addEventListener('click', async () => {
      await this.loadDebugLogs(true);
      this.copyLogStatus.textContent = '✓ Đã làm mới!';
      this.copyLogStatus.className = 'inline-status ok';
      setTimeout(() => {
        this.copyLogStatus.textContent = '';
      }, 1500);
    });

    // Clear debug logs
    this.clearLogsBtn.addEventListener('click', async () => {
      await browser.runtime.sendMessage({ action: 'CLEAR_DEBUG_LOGS' });
      this.cachedLogs = [];
      this.logCountBadge.textContent = '0 log';
      this.logContentText.textContent = 'Đã xóa toàn bộ nhật ký.';
    });
  }

  private async saveCurrentFormToSettings(): Promise<void> {
    const curType = this.providerSelect.value as ProviderType;
    this.settings.translationMode = this.radioModeVision?.checked ? 'vision_ai' : 'hybrid_ocr';
    this.settings.activeProvider = curType;
    this.settings.bubbleTheme = this.themeSelect.value as BubbleTheme;
    this.settings.autoScrollSpeed = Number(this.speedInput.value) || 3;
    this.settings.rateLimitDelayMs = Number(this.rateLimitInput.value) || 1200;

    const keys = ApiKeyRotator.parseKeys(this.apiKeyInput.value);
    this.settings.providers[curType] = {
      type: curType,
      name: API_PRESETS[curType].name,
      baseUrl: this.baseUrlInput.value.trim(),
      apiKey: keys.join('\n'),
      model: this.customModelInput.value.trim()
    };

    await StorageService.saveSettings(this.settings);
  }
}

// Global error handlers for Popup
window.addEventListener('error', (e) => {
  DebugLogger.error('Popup:GlobalError', e.message, e.error);
});
window.addEventListener('unhandledrejection', (e) => {
  DebugLogger.error('Popup:UnhandledRejection', e.reason?.message || String(e.reason), e.reason);
});

document.addEventListener('DOMContentLoaded', () => {
  const popup = new PopupController();
  popup.init().catch((err) => {
    console.error(err);
    DebugLogger.error('Popup:Init', err?.message || String(err), err);
  });
});
