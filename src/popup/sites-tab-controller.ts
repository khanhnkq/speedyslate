import browser from 'webextension-polyfill';
import { ExtensionSettings } from '../shared/types';
import { StorageService } from '../shared/storage';
import { SiteMatcher, DEFAULT_ALLOWED_SITES } from '../shared/site-matcher';

/**
 * SitesTabController: Manages website whitelist, custom domain additions,
 * active tab domain toggling, and allow-all-sites mode.
 * Follows Single Responsibility Principle (SRP) & strictly < 500 lines.
 */
export class SitesTabController {
  private currentHostname: string = '';
  private currentTabId: number | null = null;

  // DOM Elements
  private currentDomainText = document.getElementById('current-domain-text') as HTMLElement;
  private btnToggleCurrentSite = document.getElementById('btn-toggle-current-site') as HTMLButtonElement;
  private toggleAllowAllSites = document.getElementById('toggle-allow-all-sites') as HTMLInputElement;
  private inputNewSite = document.getElementById('input-new-site') as HTMLInputElement;
  private btnAddSite = document.getElementById('btn-add-site') as HTMLButtonElement;
  private addSiteFeedback = document.getElementById('add-site-feedback') as HTMLElement;
  private siteListContainer = document.getElementById('site-list-container') as HTMLElement;
  private siteCountBadge = document.getElementById('site-count-badge') as HTMLElement;

  private getSettings: () => ExtensionSettings;
  private onSettingsChanged: () => void;

  constructor(getSettings: () => ExtensionSettings, onSettingsChanged: () => void) {
    this.getSettings = getSettings;
    this.onSettingsChanged = onSettingsChanged;
  }

  public async init(): Promise<void> {
    await this.detectActiveTab();
    this.renderCurrentSiteCard();
    this.renderAllowAllToggle();
    this.renderSiteList();
    this.attachEvents();
  }

  private async detectActiveTab(): Promise<void> {
    try {
      const tabs = await browser.tabs.query({ active: true, currentWindow: true });
      const active = tabs[0];
      if (active?.id) {
        this.currentTabId = active.id;
      }
      if (active?.url) {
        const urlObj = new URL(active.url);
        if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
          this.currentHostname = urlObj.hostname;
        } else {
          this.currentHostname = '';
        }
      }
    } catch {
      this.currentHostname = '';
    }
  }

  private renderCurrentSiteCard(): void {
    if (!this.currentDomainText || !this.btnToggleCurrentSite) return;

    if (!this.currentHostname) {
      this.currentDomainText.textContent = 'Không khả dụng trên trang này';
      this.currentDomainText.style.color = 'var(--text-dim)';
      this.btnToggleCurrentSite.disabled = true;
      this.btnToggleCurrentSite.style.display = 'none';
      return;
    }

    const settings = this.getSettings();
    const isAllowed = SiteMatcher.isSiteAllowed(this.currentHostname, settings);
    const normalized = SiteMatcher.normalizeDomain(this.currentHostname);
    const isDefault = DEFAULT_ALLOWED_SITES.some(
      (d) => normalized === d || normalized.endsWith('.' + d)
    );

    this.currentDomainText.textContent = this.currentHostname;
    this.currentDomainText.style.color = 'var(--text-primary)';
    this.btnToggleCurrentSite.disabled = false;
    this.btnToggleCurrentSite.style.display = 'inline-flex';

    if (settings.allowAllSites) {
      this.btnToggleCurrentSite.className = 'btn btn-secondary btn-sm';
      this.btnToggleCurrentSite.innerHTML = '<i class="ti ti-check"></i> Đang bật (Toàn cục)';
      this.btnToggleCurrentSite.disabled = true;
    } else if (isDefault) {
      this.btnToggleCurrentSite.className = 'btn btn-secondary btn-sm';
      this.btnToggleCurrentSite.innerHTML = '<i class="ti ti-check"></i> Đã bật (Mặc định)';
      this.btnToggleCurrentSite.disabled = true;
    } else if (isAllowed) {
      this.btnToggleCurrentSite.className = 'btn btn-secondary btn-sm';
      this.btnToggleCurrentSite.innerHTML = '<i class="ti ti-x"></i> Tắt trên trang này';
    } else {
      this.btnToggleCurrentSite.className = 'btn btn-primary btn-sm';
      this.btnToggleCurrentSite.innerHTML = '<i class="ti ti-plus"></i> Bật trên trang này';
    }
  }

  private renderAllowAllToggle(): void {
    if (!this.toggleAllowAllSites) return;
    this.toggleAllowAllSites.checked = this.getSettings().allowAllSites ?? false;
  }

  public renderSiteList(): void {
    if (!this.siteListContainer) return;
    const settings = this.getSettings();
    const customList = settings.customSites || [];
    const totalCount = DEFAULT_ALLOWED_SITES.length + customList.length;

    if (this.siteCountBadge) {
      this.siteCountBadge.textContent = `${totalCount} web`;
    }

    this.siteListContainer.innerHTML = '';

    if (totalCount === 0) {
      const empty = document.createElement('div');
      empty.className = 'site-list-item';
      empty.innerHTML = `
        <div class="site-item-info">
          <span class="site-item-domain" style="color: var(--text-dim); font-weight: 400;">Chưa có trang web nào trong danh sách riêng.</span>
        </div>
      `;
      this.siteListContainer.appendChild(empty);
      return;
    }

    // 1. Render default websites
    for (const site of DEFAULT_ALLOWED_SITES) {
      const row = document.createElement('div');
      row.className = 'site-list-item';
      row.innerHTML = `
        <div class="site-item-info">
          <i class="ti ti-shield-check site-icon-default"></i>
          <span class="site-item-domain">${site}</span>
          <span class="site-item-tag">Mặc định</span>
        </div>
      `;
      this.siteListContainer.appendChild(row);
    }

    // 2. Render user custom websites
    for (const site of customList) {
      const row = document.createElement('div');
      row.className = 'site-list-item';

      const info = document.createElement('div');
      info.className = 'site-item-info';
      info.innerHTML = `
        <i class="ti ti-world site-icon-custom"></i>
        <span class="site-item-domain">${site}</span>
      `;

      const delBtn = document.createElement('button');
      delBtn.className = 'btn-icon-danger';
      delBtn.type = 'button';
      delBtn.title = `Xóa ${site}`;
      delBtn.innerHTML = '<i class="ti ti-trash"></i>';
      delBtn.addEventListener('click', async () => {
        await this.removeCustomSite(site);
      });

      row.appendChild(info);
      row.appendChild(delBtn);
      this.siteListContainer.appendChild(row);
    }
  }

  private attachEvents(): void {
    // 1. Toggle current site button
    this.btnToggleCurrentSite?.addEventListener('click', async () => {
      if (!this.currentHostname) return;
      const settings = this.getSettings();
      const normalized = SiteMatcher.normalizeDomain(this.currentHostname);
      const customList = settings.customSites || [];

      if (customList.includes(normalized)) {
        // Remove it
        await this.removeCustomSite(normalized);
      } else {
        // Add it
        await this.addCustomSite(normalized);
      }
    });

    // 2. Global "Allow all sites" toggle
    this.toggleAllowAllSites?.addEventListener('change', async () => {
      const settings = this.getSettings();
      settings.allowAllSites = this.toggleAllowAllSites.checked;
      await StorageService.saveSettings(settings);
      this.onSettingsChanged();
      this.renderCurrentSiteCard();
      this.notifyActiveTab(settings.allowAllSites ? 'ACTIVATE_CURRENT_SITE' : 'DEACTIVATE_CURRENT_SITE');
    });

    // 3. Add custom website via input
    this.btnAddSite?.addEventListener('click', () => this.handleAddFromInput());
    this.inputNewSite?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.handleAddFromInput();
      }
    });
  }

  private async handleAddFromInput(): Promise<void> {
    if (!this.inputNewSite) return;
    const raw = this.inputNewSite.value.trim();
    if (!raw) return;

    const normalized = SiteMatcher.normalizeDomain(raw);
    if (!normalized || normalized.length < 3 || !normalized.includes('.')) {
      this.showFeedback('Vui lòng nhập tên miền hợp lệ (vd: mangadex.org)', true);
      return;
    }

    const settings = this.getSettings();
    if (DEFAULT_ALLOWED_SITES.includes(normalized) || (settings.customSites || []).includes(normalized)) {
      this.showFeedback(`Tên miền "${normalized}" đã có trong danh sách!`, true);
      return;
    }

    await this.addCustomSite(normalized);
    this.inputNewSite.value = '';
    this.showFeedback(`Đã thêm ${normalized} thành công!`, false);
  }

  private async addCustomSite(domain: string): Promise<void> {
    const settings = this.getSettings();
    if (!settings.customSites) settings.customSites = [];
    if (!settings.customSites.includes(domain)) {
      settings.customSites.push(domain);
      await StorageService.saveSettings(settings);
      this.onSettingsChanged();
      this.renderCurrentSiteCard();
      this.renderSiteList();

      const currentNorm = SiteMatcher.normalizeDomain(this.currentHostname);
      if (currentNorm === domain || currentNorm.endsWith('.' + domain)) {
        this.notifyActiveTab('ACTIVATE_CURRENT_SITE');
      }
    }
  }

  private async removeCustomSite(domain: string): Promise<void> {
    const settings = this.getSettings();
    settings.customSites = (settings.customSites || []).filter((s) => s !== domain);
    await StorageService.saveSettings(settings);
    this.onSettingsChanged();
    this.renderCurrentSiteCard();
    this.renderSiteList();

    const currentNorm = SiteMatcher.normalizeDomain(this.currentHostname);
    if (currentNorm === domain || currentNorm.endsWith('.' + domain)) {
      this.notifyActiveTab('DEACTIVATE_CURRENT_SITE');
    }
  }

  private notifyActiveTab(action: 'ACTIVATE_CURRENT_SITE' | 'DEACTIVATE_CURRENT_SITE'): void {
    if (this.currentTabId) {
      browser.tabs.sendMessage(this.currentTabId, { action }).catch(() => {});
    }
  }

  private showFeedback(msg: string, isError: boolean): void {
    if (!this.addSiteFeedback) return;
    this.addSiteFeedback.textContent = msg;
    this.addSiteFeedback.className = `inline-feedback ${isError ? 'err' : 'ok'}`;
    setTimeout(() => {
      if (this.addSiteFeedback.textContent === msg) {
        this.addSiteFeedback.textContent = '';
      }
    }, 2800);
  }
}
