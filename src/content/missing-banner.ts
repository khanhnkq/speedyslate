/**
 * Banner shown when OCR model is missing in Hybrid OCR mode
 */
export class ModelMissingBanner {
  public static show(): void {
    if (document.getElementById('speedyslate-missing-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'speedyslate-missing-banner';
    banner.style.cssText = `
      position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
      background: #111111; color: #F5F5F4; padding: 10px 18px;
      border-radius: 9999px; z-index: 2147483647; box-shadow: 0 8px 24px rgba(0,0,0,0.45);
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif; font-size: 12px; display: flex; align-items: center; gap: 12px;
      border: 1px solid rgba(168, 85, 247, 0.4); user-select: none;
    `;
    banner.innerHTML = `
      <span><b style="color: #A855F7;">SpeedySlate</b>: Chưa tải model OCR (~10MB). Mở popup cài đặt để tải model.</span>
      <button style="background: #A855F7; border: none; color: #ffffff; padding: 4px 12px; border-radius: 9999px; cursor: pointer; font-weight: 600; font-size: 11px;">Đóng</button>
    `;
    banner.querySelector('button')?.addEventListener('click', () => banner.remove());
    document.body?.appendChild(banner);
  }
}
