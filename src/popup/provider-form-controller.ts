import browser from 'webextension-polyfill';
import { API_PRESETS } from '../shared/presets';
import { ExtensionSettings, ProviderType } from '../shared/types';
import { ApiKeyRotator } from '../services/translation/api-key-rotator';

export class ProviderFormController {
  private providerSelect = document.getElementById('provider-select') as HTMLSelectElement;
  private baseUrlInput = document.getElementById('input-base-url') as HTMLInputElement;
  private modelPresetSelect = document.getElementById('select-model-preset') as HTMLSelectElement;
  private customModelInput = document.getElementById('input-custom-model') as HTMLInputElement;
  private apiKeyInput = document.getElementById('input-api-key') as HTMLTextAreaElement;
  private apiKeyCountBadge = document.getElementById('api-key-count-badge') as HTMLElement;
  public rateLimitInput = document.getElementById('input-rate-limit') as HTMLInputElement;
  private testBtn = document.getElementById('btn-test-connection') as HTMLButtonElement;
  private testResult = document.getElementById('test-result') as HTMLElement;

  public currentEditingProvider: ProviderType = 'gemini';

  constructor(
    private getSettings: () => ExtensionSettings,
    private onSaveRequested: () => Promise<void>
  ) {}

  public init(): void {
    const settings = this.getSettings();
    this.currentEditingProvider = settings.activeProvider || 'gemini';
    this.refreshProviderSelectLabels();
    this.updateProviderForm(this.currentEditingProvider);
    this.attachEvents();
  }

  public refreshProviderSelectLabels(): void {
    const settings = this.getSettings();
    const types = Object.keys(API_PRESETS) as ProviderType[];
    this.providerSelect.innerHTML = '';

    for (const t of types) {
      const info = API_PRESETS[t];
      const saved = settings.providers[t];
      const keyCount = ApiKeyRotator.parseKeys(saved?.apiKey || '').length;
      const opt = document.createElement('option');
      opt.value = t;

      let suffix = '';
      if (!info.requiresApiKey) {
        suffix = t === 'ollama' ? ' (Offline)' : ' (Free)';
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

  public saveCurrentProviderToMemory(): void {
    const settings = this.getSettings();
    const cur = this.currentEditingProvider;
    const preset = API_PRESETS[cur];
    if (!preset) return;
    const keys = ApiKeyRotator.parseKeys(this.apiKeyInput.value);
    settings.providers[cur] = {
      type: cur,
      name: preset.name,
      baseUrl: this.baseUrlInput.value.trim(),
      apiKey: keys.join('\n'),
      model: this.customModelInput.value.trim()
    };
  }

  public updateProviderForm(type: ProviderType): void {
    const settings = this.getSettings();
    this.currentEditingProvider = type;
    const preset = API_PRESETS[type];
    const savedConfig = settings.providers[type] || {
      type,
      name: preset.name,
      baseUrl: preset.baseUrl,
      apiKey: '',
      model: preset.defaultModel
    };

    this.baseUrlInput.value = savedConfig.baseUrl || preset.baseUrl;
    this.apiKeyInput.value = savedConfig.apiKey || '';
    this.updateApiKeyCount();

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
    this.rateLimitInput.value = String(settings.rateLimitDelayMs ?? preset.defaultDelayMs ?? 1200);
  }

  private updateApiKeyCount(): void {
    if (!this.apiKeyInput || !this.apiKeyCountBadge) return;
    const count = ApiKeyRotator.parseKeys(this.apiKeyInput.value).length;
    this.apiKeyCountBadge.textContent = `${count} key${count > 1 ? 's (xoay vòng)' : ''}`;
    this.apiKeyCountBadge.style.color = count > 1 ? 'var(--accent)' : 'var(--ink2)';
  }

  private attachEvents(): void {
    this.apiKeyInput?.addEventListener('input', () => {
      this.updateApiKeyCount();
      this.saveCurrentProviderToMemory();
      this.refreshProviderSelectLabels();
    });
    this.apiKeyInput?.addEventListener('change', () => {
      this.onSaveRequested();
    });

    this.providerSelect.addEventListener('change', async () => {
      const settings = this.getSettings();
      this.saveCurrentProviderToMemory();
      const type = this.providerSelect.value as ProviderType;
      settings.activeProvider = type;
      this.updateProviderForm(type);
      this.refreshProviderSelectLabels();
      const p = API_PRESETS[type];
      if (p) this.rateLimitInput.value = String(p.defaultDelayMs);
      await this.onSaveRequested();
    });

    this.baseUrlInput.addEventListener('input', () => this.saveCurrentProviderToMemory());
    this.customModelInput.addEventListener('input', () => this.saveCurrentProviderToMemory());
    this.modelPresetSelect.addEventListener('change', () => {
      this.customModelInput.value = this.modelPresetSelect.value;
      this.saveCurrentProviderToMemory();
    });

    this.testBtn.addEventListener('click', async () => {
      this.testBtn.disabled = true;
      this.testResult.textContent = 'Đang kiểm tra…';
      this.testResult.className = 'inline-status';
      await this.onSaveRequested();

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
  }
}
