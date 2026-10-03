import browser from 'webextension-polyfill';
import { ExtensionSettings, ProviderConfig, ProviderType } from './types';
import { DEFAULT_SETTINGS } from './presets';

const SETTINGS_KEY = 'speedyslate_settings';

/**
 * Type-safe storage wrapper for Extension Settings
 * Following Single Responsibility Principle (SRP)
 */
export class StorageService {
  /**
   * Retrieves user settings, merging with default settings if missing
   */
  public static async getSettings(): Promise<ExtensionSettings> {
    try {
      const data = await browser.storage.local.get(SETTINGS_KEY);
      if (!data || !data[SETTINGS_KEY]) {
        return DEFAULT_SETTINGS;
      }
      const saved = data[SETTINGS_KEY] as Partial<ExtensionSettings>;
      return {
        ...DEFAULT_SETTINGS,
        ...saved,
        providers: {
          ...DEFAULT_SETTINGS.providers,
          ...(saved.providers || {})
        }
      };
    } catch (err) {
      console.error('[SpeedySlate] Failed to read settings, fallback to defaults:', err);
      return DEFAULT_SETTINGS;
    }
  }

  /**
   * Persists entire settings object
   */
  public static async saveSettings(settings: ExtensionSettings): Promise<void> {
    await browser.storage.local.set({ [SETTINGS_KEY]: settings });
  }

  /**
   * Updates configuration for a specific provider
   */
  public static async updateProviderConfig(
    providerType: ProviderType,
    config: Partial<ProviderConfig>
  ): Promise<ExtensionSettings> {
    const current = await this.getSettings();
    current.providers[providerType] = {
      ...current.providers[providerType],
      ...config
    };
    await this.saveSettings(current);
    return current;
  }

  /**
   * Sets active provider
   */
  public static async setActiveProvider(providerType: ProviderType): Promise<void> {
    const current = await this.getSettings();
    current.activeProvider = providerType;
    await this.saveSettings(current);
  }
}
