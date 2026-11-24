import { DebugLogger } from '../shared/debug-logger';

declare const chrome: any;
declare const browser: any;

/**
 * DnrManager: Dynamically registers DeclarativeNetRequest Referer & CORS rules
 * on demand for whichever manga/webtoon websites the user activates locally.
 * Zero hardcoded domain lists — rules are derived strictly from live chapter origins.
 */
export class DnrManager {
  private static hostToRule = new Map<string, { id: number; origin: string }>();
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
   * Clears any stale session/legacy dynamic rules on background startup
   */
  public static async init(): Promise<void> {
    if (this.isInitialized) return;
    this.isInitialized = true;

    const dnr = this.getDnrApi();
    if (!dnr?.updateDynamicRules) return;

    try {
      const existingRules = (await dnr.getDynamicRules?.()) || [];
      const removeRuleIds = existingRules.map((r: any) => r.id);
      if (removeRuleIds.length > 0) {
        await dnr.updateDynamicRules({ removeRuleIds, addRules: [] });
      }
    } catch (err: any) {
      DebugLogger.warn('DnrManager', `Khởi tạo quy tắc mạng động thất bại: ${err?.message || err}`);
    }
  }

  /**
   * Dynamically ensures that an image CDN hostname receives valid Referer, Origin,
   * and CORS headers matching the chapter page currently being read.
   */
  public static async ensureRefererForDomain(chapterUrl?: string, imageUrl?: string): Promise<void> {
    if (!chapterUrl || !imageUrl) return;

    try {
      const chapterObj = new URL(chapterUrl);
      const imageObj = new URL(imageUrl);
      const imageHost = imageObj.hostname;
      const chapterOrigin = chapterObj.origin;
      if (!imageHost || (chapterObj.protocol !== 'http:' && chapterObj.protocol !== 'https:')) {
        return;
      }

      const prev = this.hostToRule.get(imageHost);
      if (prev && prev.origin === chapterOrigin) return;

      const dnr = this.getDnrApi();
      if (!dnr?.updateDynamicRules) return;

      const ruleId = prev ? prev.id : this.nextDynamicId++;
      this.hostToRule.set(imageHost, { id: ruleId, origin: chapterOrigin });

      await dnr.updateDynamicRules({
        removeRuleIds: prev ? [prev.id] : [],
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
    } catch (err: any) {
      DebugLogger.warn('DnrManager', `Lỗi đăng ký quy tắc động cho ảnh: ${err?.message || err}`);
    }
  }
}
