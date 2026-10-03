import { ExtensionSettings, ProviderType } from '../../shared/types';
import { GeminiProvider } from './gemini-provider';
import { OpenAIProvider } from './openai-provider';
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
    const type = targetProviderType || settings.activeProvider;
    const config = settings.providers[type];

    if (!config) {
      throw new Error(`Cấu hình provider ${type} không tồn tại.`);
    }

    if (type === 'gemini') {
      return new GeminiProvider(config.apiKey, config.model, config.baseUrl);
    }

    // All other providers (groq, deepseek, openrouter, openai, ollama, custom)
    // use OpenAI-compatible API interface
    return new OpenAIProvider(config.baseUrl, config.apiKey, config.model);
  }
}
