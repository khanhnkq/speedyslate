export type PageBadgeStatus =
  | 'idle'
  | 'ocr_running'
  | 'ocr_done'
  | 'translating'
  | 'translated'
  | 'no_text'
  | 'error';

export interface PageBadgeKeyInfo {
  keyIndex?: number;
  totalKeys?: number;
  errorMessage?: string;
}

/**
 * Modern floating glassmorphism page badge for comic panels
 * Displays page number (#1, #2...) and live status matching the Floating HUD
 * Following Single Responsibility Principle (SRP)
 */
export class PageBadgeManager {
  private static readonly BADGE_CLASS = 'speedyslate-page-badge';

  /**
   * Mounts or retrieves existing page badge on the comic image wrapper
   */
  public static ensureBadge(wrapper: HTMLElement, pageIndex: number): HTMLElement {
    let badge = wrapper.querySelector<HTMLElement>(`.${this.BADGE_CLASS}`);
    if (badge) return badge;

    badge = document.createElement('div');
    badge.className = this.BADGE_CLASS;
    badge.dataset.pageIndex = String(pageIndex);

    Object.assign(badge.style, {
      position: 'absolute',
      top: '12px',
      left: '12px',
      zIndex: '60',
      background: '#111111',
      border: '1px solid rgba(255, 255, 255, 0.16)',
      borderRadius: '9999px',
      padding: '3px 10px',
      color: '#F5F5F4',
      fontFamily: "'DM Sans', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      fontWeight: '600',
      fontSize: '11px',
      letterSpacing: '-0.01em',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.35)',
      pointerEvents: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      transition: 'all 0.2s ease',
      userSelect: 'none'
    });

    this.renderBadgeContent(badge, pageIndex, 'idle');
    wrapper.appendChild(badge);
    return badge;
  }

  /**
   * Updates badge status and message
   */
  public static updateBadge(
    wrapper: HTMLElement,
    pageIndex: number,
    status: PageBadgeStatus,
    count?: number,
    keyInfo?: PageBadgeKeyInfo
  ): void {
    const badge = this.ensureBadge(wrapper, pageIndex);
    this.renderBadgeContent(badge, pageIndex, status, count, keyInfo);
  }

  private static renderBadgeContent(
    badge: HTMLElement,
    pageIndex: number,
    status: PageBadgeStatus,
    count?: number,
    keyInfo?: PageBadgeKeyInfo
  ): void {
    let dotColor = '#555555';
    let statusText = '';
    let isPulsing = false;

    switch (status) {
      case 'idle':
        dotColor = '#555555';
        statusText = '';
        break;
      case 'ocr_running':
        dotColor = '#A855F7';
        statusText = 'Quét OCR...';
        isPulsing = true;
        break;
      case 'ocr_done':
        dotColor = '#A855F7';
        statusText = count !== undefined ? `${count} câu` : 'Đã quét';
        break;
      case 'translating':
        dotColor = '#A855F7';
        statusText = 'Đang dịch...';
        isPulsing = true;
        break;
      case 'translated':
        dotColor = '#A855F7';
        statusText = count !== undefined ? `${count} câu` : 'Đã dịch';
        break;
      case 'no_text':
        dotColor = '#444444';
        statusText = 'Không chữ';
        break;
      case 'error': {
        dotColor = '#ef4444';
        const rawErr = (keyInfo?.errorMessage || '').toLowerCase();
        if (rawErr.includes('timeout') || rawErr.includes('quá thời gian')) {
          statusText = 'Timeout 27s';
        } else if (rawErr.includes('429')) {
          statusText = 'Limit (429)';
        } else if (rawErr.includes('403')) {
          statusText = 'Từ chối (403)';
        } else if (rawErr.includes('401')) {
          statusText = 'Key sai (401)';
        } else if (rawErr.includes('safety')) {
          statusText = 'Chặn 18+';
        } else {
          statusText = keyInfo?.errorMessage ? keyInfo.errorMessage.slice(0, 18) : 'Lỗi';
        }
        break;
      }
    }

    const pulseAnim = isPulsing ? 'animation: speedyslatePulse 1.2s infinite ease-in-out;' : '';

    const keyBadge =
      keyInfo?.keyIndex !== undefined
        ? `<span style="background: rgba(168, 85, 247, 0.22); border: 1px solid rgba(168, 85, 247, 0.5); color: #e9d5ff; border-radius: 4px; padding: 1px 5px; font-size: 10px; font-weight: 700; letter-spacing: 0.02em;">Key #${keyInfo.keyIndex}${keyInfo.totalKeys && keyInfo.totalKeys > 1 ? `/${keyInfo.totalKeys}` : ''}</span>`
        : '';

    const statusSpan = statusText
      ? status === 'error'
        ? `<span style="color: #f87171; font-weight: 700; font-size: 10px; background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.45); border-radius: 4px; padding: 1px 5px;">${statusText}</span>`
        : `<span style="color: #999999; font-weight: 500; font-size: 10px;">${statusText}</span>`
      : '';

    badge.innerHTML = `
      <style>
        @keyframes speedyslatePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(0.85); }
        }
      </style>
      <span style="width: 6px; height: 6px; border-radius: 50%; background: ${dotColor}; box-shadow: 0 0 5px ${dotColor}; display: inline-block; ${pulseAnim}"></span>
      <span style="color: #F5F5F4; font-weight: 700;">#${pageIndex + 1}</span>
      ${keyBadge}
      ${statusSpan}
    `;

    // Dynamic border color and tooltip based on status
    if (status === 'error') {
      badge.style.border = '1px solid rgba(239, 68, 68, 0.5)';
      badge.title = keyInfo?.errorMessage ? `Trang #${pageIndex + 1}: ${keyInfo.errorMessage}` : 'Đã xảy ra lỗi';
      badge.style.pointerEvents = 'auto';
      badge.style.cursor = 'help';
    } else if (status === 'translated' || status === 'translating' || status === 'ocr_running') {
      badge.style.border = '1px solid rgba(168, 85, 247, 0.4)';
      badge.title = '';
      badge.style.pointerEvents = 'none';
      badge.style.cursor = 'default';
    } else {
      badge.style.border = '1px solid rgba(255, 255, 255, 0.12)';
      badge.title = '';
      badge.style.pointerEvents = 'none';
      badge.style.cursor = 'default';
    }
  }
}
