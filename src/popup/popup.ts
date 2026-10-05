import browser from 'webextension-polyfill';
import { ModelHubController } from './model-hub-controller';
import { DebugTabController } from './debug-tab-controller';
import { API_PRESETS, OCR_MODEL_PRESETS } from '../shared/presets';
import { StorageService } from '../shared/storage';
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
  private toggleRotateProviders = document.getElementById('toggle-rotate-providers') as HTMLInputElement;
  private testBtn = document.getElementById('btn-test-connection') as HTMLButtonElement;
  private testResult = document.getElementById('test-result') as HTMLElement;
  private currentEditingProvider: ProviderType = 'gemini';

  // DOM Elements - Preferences & Save
  private themeSelect = document.getElementById('select-theme') as HTMLSelectElement;
  private speedInput = document.getElementById('input-speed') as HTMLInputElement;
  private saveBtn = document.getElementById('btn-save-settings') as HTMLButtonElement;
  private saveStatus = document.getElementById('save-status') as HTMLElement;
  private debugTab!: DebugTabController;

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
    this.debugTab = new DebugTabController(
      () => this.settings,
      () => this.backendBadge.textContent || 'idle'
    );
    await this.debugTab.init();
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
    this.currentEditingProvider = this.settings.activeProvider || 'gemini';
    this.refreshProviderSelectLabels();
    this.updateProviderForm(this.currentEditingProvider);
  }

  private refreshProviderSelectLabels(): void {
    const types: ProviderType[] = ['gemini', 'antigravity', 'groq', 'deepseek', 'openrouter', 'openai', 'ollama', 'custom'];
    this.providerSelect.innerHTML = '';

    for (const t of types) {
      const info = API_PRESETS[t];
      const saved = this.settings.providers[t];
      const keyCount = ApiKeyRotator.parseKeys(saved?.apiKey || '').length;
      const opt = document.createElement('option');
      opt.value = t;

      let suffix = '';
      if (t === 'ollama') {
        suffix = ' (Offline)';
      } else if (keyCount > 0) {
        suffix = ` (${keyCount} key${keyCount > 1 ? 's' : ''})`;
      }

      opt.textContent = `${info.name}${suffix}`;
      if (t === this.currentEditingProvider) {
        opt.selected = true;
      }
      this.providerSelect.appendChild(opt);
    }
  }

  private saveCurrentProviderToMemory(): void {
    const cur = this.currentEditingProvider;
    if (!this.settings.providers[cur]) return;
    const keys = ApiKeyRotator.parseKeys(this.apiKeyInput.value);
    this.settings.providers[cur] = {
      type: cur,
      name: API_PRESETS[cur]?.name || cur,
      baseUrl: this.baseUrlInput.value.trim(),
      apiKey: keys.join('\n'),
      model: this.customModelInput.value.trim()
    };
  }

  private updateProviderForm(type: ProviderType): void {
    this.currentEditingProvider = type;
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
    if (this.toggleRotateProviders) {
      this.toggleRotateProviders.checked = this.settings.rotateProviders ?? true;
    }
  }



  /** Poll background every 3 s to show which ONNX backend is active and refresh logs. */
  private startBackendStatusPolling(): void {
    const refresh = async () => {
      try {
        const resp: any = await browser.runtime.sendMessage({ action: 'GET_OCR_STATUS' });
        this.renderBackendBadge(resp?.backend ?? 'idle');
        await this.debugTab?.loadDebugLogs(false);
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

  private initTabs(): void {
    const tabBtns = document.querySelectorAll<HTMLButtonElement>('.tab-btn');
    const tabPanes = document.querySelectorAll<HTMLElement>('.tab-pane');

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-tab');
        if (!targetId) return;

        tabBtns.forEach((b) => b.classList.remove('active'));
        tabPanes.forEach((p) => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPane = document.getElementById(targetId);
        if (targetPane) {
          targetPane.classList.add('active');
        }
      });
    });
  }

  private attachEventListeners(): void {
    this.initTabs();

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

    // Provider change: auto-saves previous provider before switching
    this.providerSelect.addEventListener('change', async () => {
      this.saveCurrentProviderToMemory();
      await StorageService.saveSettings(this.settings);

      const type = this.providerSelect.value as ProviderType;
      this.settings.activeProvider = type;
      this.updateProviderForm(type);
      this.refreshProviderSelectLabels();

      const p = API_PRESETS[type];
      if (p) {
        this.rateLimitInput.value = String(p.defaultDelayMs);
      }
    });

    // Realtime update memory & labels on entering keys
    this.apiKeyInput.addEventListener('input', () => {
      this.updateApiKeyCount();
      this.saveCurrentProviderToMemory();
      this.refreshProviderSelectLabels();
    });

    this.baseUrlInput.addEventListener('input', () => this.saveCurrentProviderToMemory());
    this.customModelInput.addEventListener('input', () => this.saveCurrentProviderToMemory());

    // Rotate providers toggle
    if (this.toggleRotateProviders) {
      this.toggleRotateProviders.addEventListener('change', async () => {
        this.settings.rotateProviders = this.toggleRotateProviders.checked;
        await StorageService.saveSettings(this.settings);
      });
    }

    // Model preset change
    this.modelPresetSelect.addEventListener('change', () => {
      this.customModelInput.value = this.modelPresetSelect.value;
      this.saveCurrentProviderToMemory();
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
  }

  private async saveCurrentFormToSettings(): Promise<void> {
    this.saveCurrentProviderToMemory();
    this.settings.activeProvider = this.currentEditingProvider;
    this.settings.translationMode = this.radioModeVision?.checked ? 'vision_ai' : 'hybrid_ocr';
    this.settings.bubbleTheme = this.themeSelect.value as BubbleTheme;
    this.settings.autoScrollSpeed = Number(this.speedInput.value) || 3;
    this.settings.rateLimitDelayMs = Number(this.rateLimitInput.value) || 1200;
    if (this.toggleRotateProviders) {
      this.settings.rotateProviders = this.toggleRotateProviders.checked;
    }

    await StorageService.saveSettings(this.settings);
    this.refreshProviderSelectLabels();
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
