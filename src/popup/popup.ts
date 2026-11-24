import browser from 'webextension-polyfill';
import { ModelHubController } from './model-hub-controller';
import { DebugTabController } from './debug-tab-controller';
import { SitesTabController } from './sites-tab-controller';
import { DisplayPrefsController } from './display-prefs-controller';
import { ProviderFormController } from './provider-form-controller';
import { OCR_MODEL_PRESETS, SOURCE_LANGUAGE_PRESETS, TARGET_LANGUAGE_PRESETS } from '../shared/presets';
import { StorageService } from '../shared/storage';
import { ExtensionSettings } from '../shared/types';
import { DebugLogger } from '../shared/debug-logger';

class PopupController {
  private settings!: ExtensionSettings;

  private statusBadge = document.getElementById('model-status-badge') as HTMLElement;
  private backendBadge = document.getElementById('ocr-backend-badge') as HTMLElement;
  private webgpuToggle = document.getElementById('toggle-webgpu') as HTMLInputElement;
  private modelHub!: ModelHubController;

  private radioModeHybrid = document.getElementById('radio-mode-hybrid') as HTMLInputElement;
  private radioModeVision = document.getElementById('radio-mode-vision') as HTMLInputElement;
  private sectionOcrModels = document.getElementById('section-ocr-models') as HTMLElement;
  private visionNotice = document.getElementById('vision-mode-notice') as HTMLElement;
  private selectSourceLang = document.getElementById('select-source-lang') as HTMLSelectElement;
  private inputCustomSourceLang = document.getElementById('input-custom-source-lang') as HTMLInputElement;
  private selectTargetLang = document.getElementById('select-target-lang') as HTMLSelectElement;
  private inputTargetLang = document.getElementById('input-target-lang') as HTMLInputElement;

  private backendPollTimer: ReturnType<typeof setInterval> | null = null;
  private displayPrefs = new DisplayPrefsController();
  private providerForm!: ProviderFormController;
  private saveBtn = document.getElementById('btn-save-settings') as HTMLButtonElement;
  private saveStatus = document.getElementById('save-status') as HTMLElement;
  private debugTab!: DebugTabController;
  private sitesTab!: SitesTabController;

  public async init(): Promise<void> {
    this.settings = await StorageService.getSettings();

    const cardsContainer = document.getElementById('ocr-model-cards') as HTMLElement;
    const storageLabel = document.getElementById('model-storage-used') as HTMLElement;

    this.modelHub = new ModelHubController(
      cardsContainer,
      storageLabel,
      this.statusBadge,
      this.settings.activeOcrModelId || OCR_MODEL_PRESETS[0]?.id || 'comic-manga-manhwa',
      async (newModelId) => {
        this.settings.activeOcrModelId = newModelId;
        await StorageService.saveSettings(this.settings);
        browser.runtime
          .sendMessage({ action: 'WARMUP_OCR' })
          .then((resp: any) => {
            if (resp?.backend) this.renderBackendBadge(resp.backend);
          })
          .catch(() => {});
      }
    );

    await this.modelHub.render();
    this.providerForm = new ProviderFormController(
      () => this.settings,
      () => this.saveCurrentFormToSettings()
    );
    this.providerForm.init();
    this.initLanguageControls();
    this.displayPrefs.load(this.settings);

    this.webgpuToggle.checked = this.settings.useWebGpu ?? true;

    const currentMode = this.settings.translationMode || 'hybrid_ocr';
    if (currentMode === 'vision_ai' && this.radioModeVision) {
      this.radioModeVision.checked = true;
    } else if (this.radioModeHybrid) {
      this.radioModeHybrid.checked = true;
    }
    this.applyModeUI(currentMode);

    this.attachEventListeners();

    this.sitesTab = new SitesTabController(
      () => this.settings,
      () => StorageService.saveSettings(this.settings)
    );
    await this.sitesTab.init();

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
      this.sectionOcrModels.classList.toggle('section-dimmed', isVision);
    }
    if (this.visionNotice) {
      this.visionNotice.style.display = isVision ? 'block' : 'none';
    }
  }

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
      wasm: { label: 'WASM (CPU)', cls: 'backend-wasm' },
      idle: { label: 'Chưa nạp', cls: 'backend-idle' }
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
        document.getElementById(targetId)?.classList.add('active');
      });
    });
  }

  private attachEventListeners(): void {
    this.initTabs();

    const onModeChange = () => {
      const mode = this.radioModeVision?.checked ? 'vision_ai' : 'hybrid_ocr';
      this.settings.translationMode = mode;
      this.applyModeUI(mode);
      StorageService.saveSettings(this.settings);
    };
    this.radioModeHybrid?.addEventListener('change', onModeChange);
    this.radioModeVision?.addEventListener('change', onModeChange);

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

    if (this.displayPrefs.rotateToggle) {
      this.displayPrefs.rotateToggle.addEventListener('change', async () => {
        this.settings.rotateProviders = this.displayPrefs.rotateToggle.checked;
        await StorageService.saveSettings(this.settings);
      });
    }

    this.saveBtn.addEventListener('click', async () => {
      await this.saveCurrentFormToSettings();
      this.saveStatus.textContent = 'Đã lưu';
      setTimeout(() => {
        this.saveStatus.textContent = '';
      }, 2000);
    });
  }

  private initLanguageControls(): void {
    if (!this.selectSourceLang || !this.selectTargetLang) return;

    this.selectSourceLang.innerHTML = '';
    for (const p of SOURCE_LANGUAGE_PRESETS) {
      const opt = document.createElement('option');
      opt.value = p.value;
      opt.textContent = p.label;
      this.selectSourceLang.appendChild(opt);
    }

    const currentSource = this.settings.sourceLanguage || 'auto';
    const isPresetSource = SOURCE_LANGUAGE_PRESETS.some((p) => p.value === currentSource && p.value !== 'custom');
    if (isPresetSource) {
      this.selectSourceLang.value = currentSource;
      if (this.inputCustomSourceLang) this.inputCustomSourceLang.style.display = 'none';
    } else {
      this.selectSourceLang.value = 'custom';
      if (this.inputCustomSourceLang) {
        this.inputCustomSourceLang.style.display = 'block';
        this.inputCustomSourceLang.value = currentSource;
      }
    }

    this.selectTargetLang.innerHTML = '';
    for (const p of TARGET_LANGUAGE_PRESETS) {
      const opt = document.createElement('option');
      opt.value = p.value;
      opt.textContent = p.label;
      this.selectTargetLang.appendChild(opt);
    }

    const currentTarget = this.settings.targetLanguage || 'Tiếng Việt';
    if (this.inputTargetLang) this.inputTargetLang.value = currentTarget;
    const isPresetTarget = TARGET_LANGUAGE_PRESETS.some((p) => p.value === currentTarget && p.value !== 'custom');
    this.selectTargetLang.value = isPresetTarget ? currentTarget : 'custom';

    this.selectSourceLang.addEventListener('change', () => {
      const isCustom = this.selectSourceLang.value === 'custom';
      if (this.inputCustomSourceLang) {
        this.inputCustomSourceLang.style.display = isCustom ? 'block' : 'none';
        if (isCustom) this.inputCustomSourceLang.focus();
      }
      this.saveCurrentFormToSettings();
    });
    this.inputCustomSourceLang?.addEventListener('input', () => this.saveCurrentFormToSettings());

    this.selectTargetLang.addEventListener('change', () => {
      const val = this.selectTargetLang.value;
      if (val !== 'custom' && this.inputTargetLang) {
        this.inputTargetLang.value = val;
      } else if (this.inputTargetLang) {
        this.inputTargetLang.focus();
      }
      this.saveCurrentFormToSettings();
    });

    this.inputTargetLang?.addEventListener('input', () => {
      const val = this.inputTargetLang.value.trim();
      const match = TARGET_LANGUAGE_PRESETS.find(
        (p) => p.value.toLowerCase() === val.toLowerCase() && p.value !== 'custom'
      );
      this.selectTargetLang.value = match ? match.value : 'custom';
      this.saveCurrentFormToSettings();
    });
  }

  private async saveCurrentFormToSettings(): Promise<void> {
    this.providerForm.saveCurrentProviderToMemory();
    this.settings.activeProvider = this.providerForm.currentEditingProvider;
    this.settings.translationMode = this.radioModeVision?.checked ? 'vision_ai' : 'hybrid_ocr';
    this.displayPrefs.applyTo(this.settings);
    this.settings.rateLimitDelayMs = Number(this.providerForm.rateLimitInput.value) || 1200;

    if (this.selectSourceLang) {
      this.settings.sourceLanguage =
        this.selectSourceLang.value === 'custom'
          ? this.inputCustomSourceLang?.value.trim() || 'auto'
          : this.selectSourceLang.value || 'auto';
    }
    if (this.inputTargetLang) {
      this.settings.targetLanguage = this.inputTargetLang.value.trim() || 'Tiếng Việt';
    }

    await StorageService.saveSettings(this.settings);
    this.providerForm.refreshProviderSelectLabels();
  }
}

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
