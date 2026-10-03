import browser from 'webextension-polyfill';
import { StorageService } from '../shared/storage';
import { TranslationProviderFactory } from '../services/translation/provider-factory';

export interface BackgroundMessage {
  action: 'TRANSLATE_TEXTS' | 'TEST_CONNECTION' | 'GET_SETTINGS' | 'PING';
  texts?: string[];
  targetLang?: string;
  providerType?: any;
  customConfig?: any;
}

// Listen for messages from Content Script and Popup
browser.runtime.onMessage.addListener(async (rawMsg: any) => {
  const msg = rawMsg as BackgroundMessage;

  try {
    switch (msg.action) {
      case 'PING':
        return { success: true, message: 'SpeedySlate Background Ready' };

      case 'GET_SETTINGS': {
        const settings = await StorageService.getSettings();
        return { success: true, settings };
      }

      case 'TRANSLATE_TEXTS': {
        if (!msg.texts || !msg.texts.length) {
          return { success: true, translations: [] };
        }
        const settings = await StorageService.getSettings();
        const provider = TranslationProviderFactory.createProvider(settings);
        const targetLang = msg.targetLang || settings.targetLanguage || 'Tiếng Việt';

        const translations = await provider.translateDialogues(msg.texts, targetLang);
        return { success: true, translations };
      }

      case 'TEST_CONNECTION': {
        const settings = await StorageService.getSettings();
        const provider = TranslationProviderFactory.createProvider(
          settings,
          msg.providerType
        );
        const ok = await provider.testConnection();
        return { success: ok };
      }

      default:
        return { success: false, error: 'Hành động không hợp lệ' };
    }
  } catch (err: any) {
    console.error('[SpeedySlate Background] Error:', err);
    return { success: false, error: err?.message || 'Lỗi xử lý trong background script' };
  }
});

console.log('[SpeedySlate] Background Service Initialized');
