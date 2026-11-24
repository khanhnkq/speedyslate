import { ExtensionSettings, ProviderType } from '../../shared/types';
import { AntigravityProvider } from './antigravity-provider';
import { GeminiProvider } from './gemini-provider';
import { GoogleFreeProvider } from './google-translate-provider';
import { OpenAIProvider } from './openai-provider';
import { MultiProviderRotator } from './multi-provider-rotator';
import { ITranslationProvider } from './translation-provider.interface';

/**
 * Factory to instantiate the appropriate translation provider
 * Following Dependency Inversion and Open/Closed Principles
 */
export class TranslationProviderFactory {
  public static createProvider(
    settings: ExtensionSettings,
    targetProviderType?: ProviderType
  ): ITranslationProvider {
    // If a specific provider is requested (e.g. testing connection), create it directly
    if (targetProviderType) {
      return this.createSingleProvider(targetProviderType, settings);
    }

    // If multi-provider rotation is enabled, wrap in MultiProviderRotator
    if (settings.rotateProviders) {
      return new MultiProviderRotator(settings);
    }

    return this.createSingleProvider(settings.activeProvider, settings);
  }

  public static createSingleProvider(
    type: ProviderType,
    settings: ExtensionSettings
  ): ITranslationProvider {
    if (type === 'google_free') {
      return new GoogleFreeProvider();
    }

    const config = settings.providers[type];

    if (!config) {
      throw new Error(`Cấu hình provider ${type} không tồn tại.`);
    }

    if (type === 'antigravity') {
      return new AntigravityProvider(config.apiKey, config.model, config.baseUrl);
    }

    if (type === 'gemini') {
      return new GeminiProvider(config.apiKey, config.model, config.baseUrl);
    }

    // All other providers (groq, deepseek, openrouter, openai, ollama, custom)
    // use OpenAI-compatible API interface
    return new OpenAIProvider(config.baseUrl, config.apiKey, config.model);
  }
}
