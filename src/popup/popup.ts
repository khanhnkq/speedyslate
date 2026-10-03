import browser from 'webextension-polyfill';
import { ModelDbService } from '../shared/model-db';
import { API_PRESETS, OCR_MODEL_PRESETS } from '../shared/presets';
import { StorageService } from '../shared/storage';
import { BubbleTheme, ExtensionSettings, ProviderType } from '../shared/types';

class PopupController {
  private settings!: ExtensionSettings;

  // DOM Elements - OCR
  private ocrSelect = document.getElementById('ocr-model-select') as HTMLSelectElement;
  private statusBadge = document.getElementById('model-status-badge') as HTMLElement;
  private progressContainer = document.getElementById('progress-container') as HTMLElement;
  private progressBar = document.getElementById('progress-bar') as HTMLElement;
  private progressText = document.getElementById('progress-text') as HTMLElement;
  private downloadBtn = document.getElementById('btn-download-model') as HTMLButtonElement;
  private deleteBtn = document.getElementById('btn-delete-model') as HTMLButtonElement;

  // DOM Elements - API
  private providerSelect = document.getElementById('provider-select') as HTMLSelectElement;
  private baseUrlInput = document.getElementById('input-base-url') as HTMLInputElement;
  private modelPresetSelect = document.getElementById('select-model-preset') as HTMLSelectElement;
  private customModelInput = document.getElementById('input-custom-model') as HTMLInputElement;
  private apiKeyInput = document.getElementById('input-api-key') as HTMLInputElement;
  private testBtn = document.getElementById('btn-test-connection') as HTMLButtonElement;
  private testResult = document.getElementById('test-result') as HTMLElement;

  // DOM Elements - Preferences & Save
  private themeSelect = document.getElementById('select-theme') as HTMLSelectElement;
  private speedInput = document.getElementById('input-speed') as HTMLInputElement;
  private saveBtn = document.getElementById('btn-save-settings') as HTMLButtonElement;
  private saveStatus = document.getElementById('save-status') as HTMLElement;

  public async init(): Promise<void> {
    this.settings = await StorageService.getSettings();

    this.renderOcrPresets();
    this.renderProviderPresets();
    this.loadDisplayPreferences();

    this.attachEventListeners();
    await this.updateOcrModelStatus();
  }

  private renderOcrPresets(): void {
    this.ocrSelect.innerHTML = '';
    for (const p of OCR_MODEL_PRESETS) {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = `${p.name} (~${p.totalSizeMb}MB)`;
      if (p.id === this.settings.activeOcrModelId) {
        opt.selected = true;
      }
      this.ocrSelect.appendChild(opt);
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
  }

  private loadDisplayPreferences(): void {
    this.themeSelect.value = this.settings.bubbleTheme;
    this.speedInput.value = String(this.settings.autoScrollSpeed);
  }

  private async updateOcrModelStatus(): Promise<void> {
    const modelId = this.ocrSelect.value;
    const status = await ModelDbService.getModelStatus(modelId);

    this.statusBadge.className = `status-badge ${status.status}`;
    if (status.status === 'ready') {
      const sizeMb = ((status.sizeBytes || 0) / (1024 * 1024)).toFixed(1);
      this.statusBadge.textContent = `Đã sẵn sàng (${sizeMb} MB)`;
      this.downloadBtn.style.display = 'none';
      this.deleteBtn.style.display = 'inline-flex';
    } else {
      this.statusBadge.textContent = 'Chưa tải';
      this.downloadBtn.style.display = 'inline-flex';
      this.deleteBtn.style.display = 'none';
    }
    this.progressContainer.style.display = 'none';
  }

  private attachEventListeners(): void {
    // OCR selection change
    this.ocrSelect.addEventListener('change', async () => {
      this.settings.activeOcrModelId = this.ocrSelect.value;
      await this.updateOcrModelStatus();
    });

    // Download model
    this.downloadBtn.addEventListener('click', async () => {
      const preset = OCR_MODEL_PRESETS.find((p) => p.id === this.ocrSelect.value);
      if (!preset) return;

      this.downloadBtn.disabled = true;
      this.statusBadge.className = 'status-badge downloading';
      this.statusBadge.textContent = 'Đang tải...';
      this.progressContainer.style.display = 'block';

      try {
        await ModelDbService.downloadModel(preset, (pct, stepName) => {
          this.progressBar.style.width = `${pct}%`;
          this.progressText.textContent = `${pct}% - ${stepName}`;
        });
        await this.updateOcrModelStatus();
      } catch (err: any) {
        alert('Tải model thất bại: ' + err.message);
        await this.updateOcrModelStatus();
      } finally {
        this.downloadBtn.disabled = false;
      }
    });

    // Delete model
    this.deleteBtn.addEventListener('click', async () => {
      if (!confirm('Bạn có chắc chắn muốn xóa model này để giải phóng bộ nhớ?')) return;
      await ModelDbService.deleteModel(this.ocrSelect.value);
      await this.updateOcrModelStatus();
    });

    // Provider change
    this.providerSelect.addEventListener('change', () => {
      const type = this.providerSelect.value as ProviderType;
      this.updateProviderForm(type);
    });

    // Model preset change
    this.modelPresetSelect.addEventListener('change', () => {
      this.customModelInput.value = this.modelPresetSelect.value;
    });

    // Test API Connection
    this.testBtn.addEventListener('click', async () => {
      this.testBtn.disabled = true;
      this.testResult.textContent = 'Đang kiểm tra...';
      this.testResult.className = 'test-result-text';

      // Save temp config to test
      await this.saveCurrentFormToSettings();

      try {
        const resp: any = await browser.runtime.sendMessage({
          action: 'TEST_CONNECTION',
          providerType: this.providerSelect.value
        });

        if (resp?.success) {
          this.testResult.textContent = '✓ Kết nối thành công!';
          this.testResult.className = 'test-result-text success';
        } else {
          this.testResult.textContent = `✗ Lỗi: ${resp?.error || 'Không thể kết nối'}`;
          this.testResult.className = 'test-result-text error';
        }
      } catch (err: any) {
        this.testResult.textContent = `✗ Lỗi: ${err?.message}`;
        this.testResult.className = 'test-result-text error';
      } finally {
        this.testBtn.disabled = false;
      }
    });

    // Save All Settings
    this.saveBtn.addEventListener('click', async () => {
      await this.saveCurrentFormToSettings();
      this.saveStatus.textContent = '✓ Đã lưu cài đặt thành công!';
      setTimeout(() => {
        this.saveStatus.textContent = '';
      }, 2500);
    });
  }

  private async saveCurrentFormToSettings(): Promise<void> {
    const curType = this.providerSelect.value as ProviderType;
    this.settings.activeProvider = curType;
    this.settings.activeOcrModelId = this.ocrSelect.value;
    this.settings.bubbleTheme = this.themeSelect.value as BubbleTheme;
    this.settings.autoScrollSpeed = Number(this.speedInput.value) || 3;

    this.settings.providers[curType] = {
      type: curType,
      name: API_PRESETS[curType].name,
      baseUrl: this.baseUrlInput.value.trim(),
      apiKey: this.apiKeyInput.value.trim(),
      model: this.customModelInput.value.trim()
    };

    await StorageService.saveSettings(this.settings);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const popup = new PopupController();
  popup.init().catch(console.error);
});
