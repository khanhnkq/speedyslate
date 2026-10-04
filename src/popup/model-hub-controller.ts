import browser from 'webextension-polyfill';
import { ModelDbService } from '../shared/model-db';
import { OCR_MODEL_PRESETS } from '../shared/presets';
import { OcrModelPreset } from '../shared/types';

export class ModelHubController {
  private container: HTMLElement;
  private storageLabel: HTMLElement;
  private statusBadge: HTMLElement;
  private activeModelId: string;
  private onModelSelectedCallback: (modelId: string) => Promise<void>;
  private isDownloading: boolean = false;

  constructor(
    container: HTMLElement,
    storageLabel: HTMLElement,
    statusBadge: HTMLElement,
    initialModelId: string,
    onModelSelected: (modelId: string) => Promise<void>
  ) {
    this.container = container;
    this.storageLabel = storageLabel;
    this.statusBadge = statusBadge;
    this.activeModelId = initialModelId;
    this.onModelSelectedCallback = onModelSelected;
  }

  public setActiveModel(modelId: string): void {
    this.activeModelId = modelId;
  }

  public async render(): Promise<void> {
    const downloadedMap = await ModelDbService.getAllDownloadedModels();
    this.container.innerHTML = '';

    let totalStorageBytes = 0;
    for (const [, item] of downloadedMap.entries()) {
      if (item.ready) {
        totalStorageBytes += item.sizeBytes;
      }
    }
    const totalStorageMb = (totalStorageBytes / (1024 * 1024)).toFixed(1);
    this.storageLabel.textContent = `${totalStorageMb} MB đã lưu`;

    for (const preset of OCR_MODEL_PRESETS) {
      const isDownloaded = downloadedMap.get(preset.id)?.ready ?? false;
      const sizeBytes = downloadedMap.get(preset.id)?.sizeBytes ?? 0;
      const sizeMb = (sizeBytes / (1024 * 1024)).toFixed(1);
      const isActive = preset.id === this.activeModelId;

      const card = document.createElement('div');
      card.className = `model-card ${isActive ? 'active' : ''}`;
      card.id = `card-${preset.id}`;

      // Status badge text & style
      const badgeCls = isDownloaded ? 'ready' : 'not_downloaded';
      const badgeText = isDownloaded ? `✓ Đã tải (${sizeMb} MB)` : 'Chưa tải';

      card.innerHTML = `
        <div class="model-card-top">
          <div class="model-card-meta">
            <div class="model-radio-circle"></div>
            <div class="model-title-block">
              <span class="model-title" title="${preset.name}">${preset.name}</span>
              <span class="model-size-label">Kích thước: ~${preset.totalSizeMb} MB</span>
            </div>
          </div>
          <span class="model-card-badge ${badgeCls}">${badgeText}</span>
        </div>
        <p class="model-desc">${preset.description}</p>
        <div class="model-card-footer">
          ${
            isDownloaded
              ? `<button class="btn-card-action btn-card-delete" data-action="delete" title="Xóa model khỏi bộ nhớ máy">
                   <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                     <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/>
                   </svg>
                   Xóa model (${sizeMb} MB)
                 </button>`
              : `<button class="btn-card-action btn-card-download" data-action="download" title="Tải model về máy để sử dụng offline">
                   <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                     <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                   </svg>
                   Tải về máy (~${preset.totalSizeMb} MB)
                 </button>`
          }
          <div class="card-progress-bar-wrap" style="display:none">
            <div class="card-progress-track">
              <div class="card-progress-fill"></div>
            </div>
            <span class="card-progress-label">0%</span>
          </div>
        </div>
      `;

      // Click card to select active model
      card.addEventListener('click', async (e) => {
        const target = e.target as HTMLElement;
        if (target.closest('.btn-card-action')) return; // handled by button listener

        this.activeModelId = preset.id;
        await this.onModelSelectedCallback(preset.id);
        await this.render();
      });

      // Actions: Download or Delete
      const downloadBtn = card.querySelector<HTMLButtonElement>('[data-action="download"]');
      const deleteBtn = card.querySelector<HTMLButtonElement>('[data-action="delete"]');

      if (downloadBtn) {
        downloadBtn.addEventListener('click', async (e) => {
          e.stopPropagation();
          await this.handleDownload(preset, card);
        });
      }

      if (deleteBtn) {
        deleteBtn.addEventListener('click', async (e) => {
          e.stopPropagation();
          await this.handleDelete(preset, deleteBtn);
        });
      }

      this.container.appendChild(card);
    }

    this.updateActiveStatusBadge(downloadedMap);
  }

  private updateActiveStatusBadge(downloadedMap: Map<string, { ready: boolean; sizeBytes: number }>): void {
    const activeInfo = downloadedMap.get(this.activeModelId);
    if (activeInfo?.ready) {
      const mb = (activeInfo.sizeBytes / (1024 * 1024)).toFixed(1);
      this.statusBadge.className = 'status-val ready';
      this.statusBadge.textContent = `${mb} MB — Sẵn sàng`;
    } else {
      this.statusBadge.className = 'status-val not_downloaded';
      this.statusBadge.textContent = 'Chưa tải về máy';
    }
  }

  private async handleDownload(preset: OcrModelPreset, cardEl: HTMLElement): Promise<void> {
    if (this.isDownloading) return;
    this.isDownloading = true;

    const downloadBtn = cardEl.querySelector<HTMLButtonElement>('[data-action="download"]');
    const progressWrap = cardEl.querySelector<HTMLElement>('.card-progress-bar-wrap');
    const progressFill = cardEl.querySelector<HTMLElement>('.card-progress-fill');
    const progressLabel = cardEl.querySelector<HTMLElement>('.card-progress-label');

    if (downloadBtn) downloadBtn.style.display = 'none';
    if (progressWrap) progressWrap.style.display = 'flex';

    try {
      await ModelDbService.downloadModel(preset, (percent, stepName) => {
        if (progressFill) progressFill.style.width = `${percent}%`;
        if (progressLabel) progressLabel.textContent = `${percent}% - ${stepName}`;
      });

      this.activeModelId = preset.id;
      await this.onModelSelectedCallback(preset.id);
      await this.render();

      browser.runtime.sendMessage({ action: 'WARMUP_OCR' }).catch(() => {});
    } catch (err: any) {
      if (progressLabel) progressLabel.textContent = `Lỗi: ${err.message}`;
      setTimeout(() => this.render(), 2500);
    } finally {
      this.isDownloading = false;
    }
  }

  private async handleDelete(preset: OcrModelPreset, btn: HTMLButtonElement): Promise<void> {
    btn.disabled = true;
    btn.textContent = 'Đang xóa...';

    try {
      await browser.runtime.sendMessage({
        action: 'DELETE_MODEL',
        modelId: preset.id
      });
      await ModelDbService.deleteModel(preset.id);
      await this.render();
    } catch (err: any) {
      btn.textContent = 'Lỗi xóa';
      setTimeout(() => this.render(), 1500);
    }
  }
}
