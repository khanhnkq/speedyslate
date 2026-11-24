import browser from 'webextension-polyfill';

/**
 * Keeps the MV3 service worker / event page alive while OCR or translation
 * work is in flight (ref-counted start/stop).
 */
export class ServiceWorkerKeepAlive {
  private static timer: any = null;
  private static refCount = 0;

  public static start(): void {
    this.refCount++;
    if (this.timer) return;
    this.timer = setInterval(() => {
      try {
        browser.runtime.getPlatformInfo().catch(() => {});
      } catch {
        // ignore
      }
    }, 10000);
  }

  public static stop(): void {
    this.refCount = Math.max(0, this.refCount - 1);
    if (this.refCount === 0 && this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
