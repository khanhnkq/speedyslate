export type PageBadgeStatus =
  | 'idle'
  | 'ocr_running'
  | 'ocr_done'
  | 'translating'
  | 'translated'
  | 'no_text'
  | 'error';

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
    count?: number
  ): void {
    const badge = this.ensureBadge(wrapper, pageIndex);
    this.renderBadgeContent(badge, pageIndex, status, count);
  }

  private static renderBadgeContent(
    badge: HTMLElement,
    pageIndex: number,
    status: PageBadgeStatus,
    count?: number
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
      case 'error':
        dotColor = '#ef4444';
        statusText = 'Lỗi';
        break;
    }

    const pulseAnim = isPulsing ? 'animation: speedyslatePulse 1.2s infinite ease-in-out;' : '';

    badge.innerHTML = `
      <style>
        @keyframes speedyslatePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(0.85); }
        }
      </style>
      <span style="width: 6px; height: 6px; border-radius: 50%; background: ${dotColor}; box-shadow: 0 0 5px ${dotColor}; display: inline-block; ${pulseAnim}"></span>
      <span style="color: #F5F5F4; font-weight: 700;">#${pageIndex + 1}</span>
      ${statusText ? `<span style="color: #999999; font-weight: 500; font-size: 10px;">${statusText}</span>` : ''}
    `;

    // Dynamic border color based on status
    if (status === 'translated' || status === 'translating' || status === 'ocr_running') {
      badge.style.border = '1px solid rgba(168, 85, 247, 0.4)';
    } else if (status === 'error') {
      badge.style.border = '1px solid rgba(239, 68, 68, 0.4)';
    } else {
      badge.style.border = '1px solid rgba(255, 255, 255, 0.12)';
    }
  }
}
