import { DialogueItem, ExtensionSettings, ProviderType } from '../../shared/types';
import { ITranslationProvider } from './translation-provider.interface';
import { TranslationProviderFactory } from './provider-factory';
import { DebugLogger } from '../../shared/debug-logger';
import { ApiKeyRotator } from './api-key-rotator';
import { API_PRESETS } from '../../shared/presets';

/**
 * MultiProviderRotator: Coordinates multiple translation providers with
 * round-robin load balancing and automatic failover on HTTP 429 / server errors.
 * Complies with SOLID (LSP, SRP) and Mozilla AMO standards (< 500 lines).
 */
export class MultiProviderRotator implements ITranslationProvider {
  private static globalProviderIndex: number = 0;
  private static providerCooldowns: Map<string, number> = new Map();

  private settings: ExtensionSettings;
  private eligibleProviders: ProviderType[] = [];
  public lastKeyIndex: number = 1;
  public lastActiveProviderType: ProviderType;

  constructor(settings: ExtensionSettings) {
    this.settings = settings;
    this.lastActiveProviderType = settings.activeProvider;
    this.determineEligibleProviders();
  }

  /**
   * Discovers all providers configured with valid API keys or local offline endpoints.
   * Prioritizes the user's selected activeProvider first in line.
   */
  private determineEligibleProviders(): void {
    const list: ProviderType[] = [];
    const active = this.settings.activeProvider;

    const allTypes: ProviderType[] = [
      'gemini',
      'antigravity',
      'groq',
      'deepseek',
      'openrouter',
      'openai',
      'ollama',
      'custom'
    ];

    // Check active provider first
    if (this.isProviderConfigured(active)) {
      list.push(active);
    }

    // Add remaining configured providers
    for (const t of allTypes) {
      if (t !== active && this.isProviderConfigured(t)) {
        list.push(t);
      }
    }

    // Fallback: If no provider has keys, keep activeProvider so user gets configuration error
    this.eligibleProviders = list.length > 0 ? list : [active];
  }

  private isProviderConfigured(type: ProviderType): boolean {
    const cfg = this.settings.providers[type];
    if (!cfg) return false;
    if (type === 'ollama') return Boolean(cfg.baseUrl);
    const keys = ApiKeyRotator.parseKeys(cfg.apiKey);
    return keys.length > 0;
  }

  /**
   * Checks if a provider is temporarily cooling down due to 429 or persistent failure
   */
  private static isCoolingDown(type: string): boolean {
    const until = MultiProviderRotator.providerCooldowns.get(type) || 0;
    return Date.now() < until;
  }

  private static markCooldown(type: string, ms: number = 20000): void {
    MultiProviderRotator.providerCooldowns.set(type, Date.now() + ms);
  }

  private static clearCooldown(type: string): void {
    MultiProviderRotator.providerCooldowns.delete(type);
  }

  /**
   * Returns ordered list of providers for the current request.
   * If rotateProviders is true, advances round-robin global index.
   */
  private getOrderedCandidates(forVision: boolean = false): ProviderType[] {
    let pool = [...this.eligibleProviders];

    if (forVision) {
      // Filter to providers supporting multimodal image translation
      pool = pool.filter((t) => t === 'gemini' || t === 'antigravity');
      if (pool.length === 0) {
        pool = [this.settings.activeProvider];
      }
    }

    if (pool.length <= 1 || !this.settings.rotateProviders) {
      return pool;
    }

    // Round-robin selection across available providers
    const total = pool.length;
    const startIndex = MultiProviderRotator.globalProviderIndex % total;
    MultiProviderRotator.globalProviderIndex = (MultiProviderRotator.globalProviderIndex + 1) % 1000000;

    const ordered: ProviderType[] = [];
    for (let i = 0; i < total; i++) {
      const p = pool[(startIndex + i) % total];
      ordered.push(p);
    }

    // Sort non-cooling-down providers ahead of cooling-down ones
    return ordered.sort((a, b) => {
      const aCool = MultiProviderRotator.isCoolingDown(a) ? 1 : 0;
      const bCool = MultiProviderRotator.isCoolingDown(b) ? 1 : 0;
      return aCool - bCool;
    });
  }

  /**
   * Translates dialogue lines with round-robin rotation and automatic failover
   */
  public async translateDialogues(texts: string[], targetLang: string): Promise<string[]> {
    if (!texts.length) return [];

    const candidates = this.getOrderedCandidates(false);
    let lastError: any = null;

    for (let i = 0; i < candidates.length; i++) {
      const providerType = candidates[i];
      const providerName = this.settings.providers[providerType]?.name || providerType;

      try {
        const provider = TranslationProviderFactory.createSingleProvider(providerType, this.settings);
        const result = await provider.translateDialogues(texts, targetLang);

        MultiProviderRotator.clearCooldown(providerType);
        this.lastActiveProviderType = providerType;
        this.lastKeyIndex = (provider as any).lastKeyIndex || 1;
        return result;
      } catch (err: any) {
        lastError = err;
        const isRateLimit =
          err.message?.includes('429') ||
          err.message?.includes('Rate Limit') ||
          err.message?.includes('quota');

        MultiProviderRotator.markCooldown(providerType, isRateLimit ? 30000 : 10000);

        if (i < candidates.length - 1) {
          const nextType = candidates[i + 1];
          const nextName = this.settings.providers[nextType]?.name || nextType;
          DebugLogger.warn(
            'MultiProviderRotator',
            `Provider [${providerName}] gặp sự cố (${err.message}). Đang tự động đổi sang [${nextName}]...`
          );
        }
      }
    }

    throw lastError || new Error('Tất cả các nhà cung cấp dịch thuật đã cấu hình đều thất bại.');
  }

  /**
   * End-to-end Multimodal Vision AI translation with failover
   */
  public async translateImage(
    base64Data: string,
    mimeType: string,
    targetLang: string,
    naturalWidth: number,
    naturalHeight: number
  ): Promise<DialogueItem[]> {
    const candidates = this.getOrderedCandidates(true);
    let lastError: any = null;

    for (let i = 0; i < candidates.length; i++) {
      const providerType = candidates[i];
      const providerName = this.settings.providers[providerType]?.name || providerType;

      try {
        const provider = TranslationProviderFactory.createSingleProvider(providerType, this.settings);
        if (!provider.translateImage) {
          continue;
        }

        const result = await provider.translateImage(
          base64Data,
          mimeType,
          targetLang,
          naturalWidth,
          naturalHeight
        );

        MultiProviderRotator.clearCooldown(providerType);
        this.lastActiveProviderType = providerType;
        this.lastKeyIndex = (provider as any).lastKeyIndex || 1;
        return result;
      } catch (err: any) {
        lastError = err;
        MultiProviderRotator.markCooldown(providerType, 25000);

        if (i < candidates.length - 1) {
          const nextType = candidates[i + 1];
          const nextName = this.settings.providers[nextType]?.name || nextType;
          DebugLogger.warn(
            'MultiProviderRotator:Vision',
            `Vision Provider [${providerName}] lỗi (${err.message}). Đang tự động đổi sang [${nextName}]...`
          );
        }
      }
    }

    throw (
      lastError ||
      new Error('Tất cả các nhà cung cấp Multimodal Vision AI đã cấu hình đều thất bại.')
    );
  }

  public async testConnection(): Promise<boolean> {
    const provider = TranslationProviderFactory.createSingleProvider(
      this.settings.activeProvider,
      this.settings
    );
    return provider.testConnection();
  }

  /**
   * Computes total active keys available across rotating providers.
   */
  public static countTotalKeys(settings: ExtensionSettings): number {
    let totalKeys = 0;
    if (settings.rotateProviders) {
      for (const cfg of Object.values(settings.providers)) {
        totalKeys += ApiKeyRotator.parseKeys(cfg?.apiKey || '').length;
      }
    }
    if (totalKeys === 0) {
      totalKeys = ApiKeyRotator.parseKeys(settings.providers[settings.activeProvider]?.apiKey || '').length;
    }
    return totalKeys;
  }

  /**
   * Computes effective throttling delay based on total keys across configured rotating providers.
   */
  public static computeEffectiveDelay(settings: ExtensionSettings): number {
    const totalKeys = MultiProviderRotator.countTotalKeys(settings);
    const baseDelay =
      settings.rateLimitDelayMs !== undefined
        ? settings.rateLimitDelayMs
        : (API_PRESETS[settings.activeProvider]?.defaultDelayMs ?? 1200);

    return totalKeys > 1 ? Math.max(200, Math.round(baseDelay / totalKeys)) : baseDelay;
  }
}
