import { DebugLogger } from '../shared/debug-logger';

declare const chrome: any;
declare const browser: any;

interface PresetDnrConfig {
  id: number;
  domains: string[];
  referer: string;
}

const PRESET_RULES: PresetDnrConfig[] = [
  {
    id: 1,
    domains: ['toonily.com', 'toonily.net', 'toonily.me'],
    referer: 'https://toonily.com/'
  },
  {
    id: 2,
    domains: ['toonhey.com'],
    referer: 'https://toonhey.com/'
  },
  {
    id: 3,
    domains: ['nhentai.net'],
    referer: 'https://nhentai.net/'
  }
];

/**
 * DnrManager: Manages DeclarativeNetRequest dynamic rules
 * to inject Referer and CORS headers for manga image requests.
 * Completely circumvents HTTP 403 Forbidden hotlink protection on sites like Toonily, Toonhey, nHentai.
 * Following Single Responsibility Principle (SRP) & strictly < 500 lines.
 */
export class DnrManager {
  private static registeredDomains = new Set<string>();
  private static nextDynamicId = 100;
  private static isInitialized = false;

  private static getDnrApi(): any {
    if (typeof chrome !== 'undefined' && chrome?.declarativeNetRequest) {
      return chrome.declarativeNetRequest;
    }
    if (typeof browser !== 'undefined' && browser?.declarativeNetRequest) {
      return browser.declarativeNetRequest;
    }
    return null;
  }

  /**
   * Initializes dynamic rules on extension startup
   */
  public static async init(): Promise<void> {
    if (this.isInitialized) return;
    this.isInitialized = true;

    const dnr = this.getDnrApi();
    if (!dnr?.updateDynamicRules) {
      DebugLogger.warn('DnrManager', 'declarativeNetRequest API không khả dụng trên trình duyệt này');
      return;
    }

    try {
      const existingRules = await dnr.getDynamicRules?.() || [];
      const removeRuleIds = existingRules.map((r: any) => r.id);

      const addRules = PRESET_RULES.map((preset) => {
        preset.domains.forEach((d) => this.registeredDomains.add(d));
        return {
          id: preset.id,
          priority: 1,
          action: {
            type: 'modifyHeaders',
            requestHeaders: [
              { header: 'Referer', operation: 'set', value: preset.referer },
              { header: 'Origin', operation: 'set', value: preset.referer.replace(/\/$/, '') }
            ],
            responseHeaders: [
              { header: 'Access-Control-Allow-Origin', operation: 'set', value: '*' },
              { header: 'Access-Control-Allow-Methods', operation: 'set', value: 'GET, HEAD, OPTIONS' },
              { header: 'Access-Control-Allow-Headers', operation: 'set', value: '*' }
            ]
          },
          condition: {
            requestDomains: preset.domains,
            resourceTypes: ['xmlhttprequest', 'image', 'other', 'sub_frame']
          }
        };
      });

      await dnr.updateDynamicRules({
        removeRuleIds,
        addRules
      });

      DebugLogger.log('info', 'DnrManager', `Đã cài đặt ${addRules.length} quy tắc chống chặn ảnh (HTTP 403)`);
    } catch (err: any) {
      DebugLogger.warn('DnrManager', `Khởi tạo quy tắc mạng thất bại: ${err?.message || err}`);
    }
  }

  /**
   * Dynamically ensures that an image domain has valid Referer/CORS headers
   * corresponding to the current reading chapter website.
   */
  public static async ensureRefererForDomain(chapterUrl?: string, imageUrl?: string): Promise<void> {
    if (!chapterUrl || !imageUrl) return;

    try {
      const chapterObj = new URL(chapterUrl);
      const imageObj = new URL(imageUrl);

      const imageHost = imageObj.hostname;
      const chapterOrigin = chapterObj.origin;

      if (!imageHost || this.registeredDomains.has(imageHost)) {
        return;
      }

      this.registeredDomains.add(imageHost);

      const dnr = this.getDnrApi();
      if (!dnr?.updateDynamicRules) return;

      const ruleId = this.nextDynamicId++;
      await dnr.updateDynamicRules({
        addRules: [
          {
            id: ruleId,
            priority: 2,
            action: {
              type: 'modifyHeaders',
              requestHeaders: [
                { header: 'Referer', operation: 'set', value: `${chapterOrigin}/` },
                { header: 'Origin', operation: 'set', value: chapterOrigin }
              ],
              responseHeaders: [
                { header: 'Access-Control-Allow-Origin', operation: 'set', value: '*' },
                { header: 'Access-Control-Allow-Methods', operation: 'set', value: 'GET, HEAD, OPTIONS' },
                { header: 'Access-Control-Allow-Headers', operation: 'set', value: '*' }
              ]
            },
            condition: {
              requestDomains: [imageHost],
              resourceTypes: ['xmlhttprequest', 'image', 'other', 'sub_frame']
            }
          }
        ]
      });

      DebugLogger.log(
        'info',
        'DnrManager',
        `Đã tạo quy tắc Referer động cho domain ${imageHost} -> ${chapterOrigin}/`
      );
    } catch (err: any) {
      DebugLogger.warn('DnrManager', `Lỗi đăng ký quy tắc động cho ảnh: ${err?.message || err}`);
    }
  }
}
