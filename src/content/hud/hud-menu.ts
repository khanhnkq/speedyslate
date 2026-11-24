import browser from 'webextension-polyfill';
import { ChubbyIcons } from './chubby-icons';

export interface HudMenuCallbacks {
  /** Current overlay visibility, read when building the toggle item. */
  isVisible: () => boolean;
  onToggleVisibility: () => void;
  onClearChapterCache: () => void;
  onClearAllCache?: () => void;
}

/**
 * Floating settings panel opened from the HUD menu button.
 * Row of page-level quick actions on top, full extension popup embedded
 * below via iframe so every settings tab is reachable without leaving the page.
 */
export class HudMenu {
  private panel: HTMLElement | null = null;
  private escHandler: ((e: KeyboardEvent) => void) | null = null;

  constructor(private callbacks: HudMenuCallbacks) {}

  public get isOpen(): boolean {
    return this.panel !== null;
  }

  public toggle(anchor: HTMLElement): void {
    if (this.isOpen) this.close();
    else this.open(anchor);
  }

  public open(anchor: HTMLElement): void {
    this.close();

    const rect = anchor.getBoundingClientRect();
    const panel = document.createElement('div');
    panel.id = 'speedyslate-floating-menu';
    Object.assign(panel.style, {
      position: 'fixed',
      right: `${Math.max(8, window.innerWidth - rect.right)}px`,
      bottom: `${window.innerHeight - rect.top + 8}px`,
      zIndex: '2147483647',
      background: '#0D0D11',
      border: '1px solid #26262E',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7), 0 0 14px rgba(229, 46, 61, 0.15)',
      width: '400px',
      maxWidth: 'calc(100vw - 16px)',
      height: `${Math.max(200, Math.min(640, rect.top - 16))}px`,
      display: 'flex',
      flexDirection: 'column',
      userSelect: 'none'
    });

    panel.appendChild(this.buildQuickActions());
    panel.appendChild(this.buildPopupFrame());

    this.panel = panel;
    document.body.appendChild(panel);

    this.escHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') this.close();
    };
    document.addEventListener('keydown', this.escHandler, true);
  }

  private buildQuickActions(): HTMLElement {
    const wrap = document.createElement('div');
    Object.assign(wrap.style, { flexShrink: '0' });

    const itemVis = this.menuItem(
      ChubbyIcons.eye(15, '#E52E3D'),
      this.callbacks.isVisible() ? 'Ẩn bản dịch (Xem gốc)' : 'Hiện lại bản dịch',
      false
    );
    itemVis.onclick = (e) => {
      e.stopPropagation();
      this.callbacks.onToggleVisibility();
      this.close();
    };

    const itemClear = this.menuItem(
      ChubbyIcons.broom(15, '#E52E3D'),
      'Xóa cache chương này',
      true
    );
    itemClear.onclick = (e) => {
      e.stopPropagation();
      this.close();
      this.callbacks.onClearChapterCache();
    };

    const itemClearAll = this.menuItem(
      ChubbyIcons.trash(15, '#FF3B47'),
      'Dọn sạch toàn bộ cache',
      true
    );
    itemClearAll.onclick = (e) => {
      e.stopPropagation();
      this.close();
      this.callbacks.onClearAllCache?.();
    };

    wrap.appendChild(itemVis);
    wrap.appendChild(itemClear);
    wrap.appendChild(itemClearAll);
    return wrap;
  }

  private menuItem(icon: string, label: string, topBorder: boolean): HTMLElement {
    const item = document.createElement('div');
    item.className = 'speedyslate-menu-item';
    if (topBorder) item.style.borderTop = '1px solid #26262E';
    item.innerHTML = `${icon}<span>${label}</span>`;
    return item;
  }

  private buildPopupFrame(): HTMLElement {
    const holder = document.createElement('div');
    Object.assign(holder.style, {
      flex: '1',
      minHeight: '0',
      borderTop: '1px solid #26262E',
      background: '#FFFFFF',
      overflow: 'hidden'
    });

    const iframe = document.createElement('iframe');
    iframe.src = browser.runtime.getURL('src/popup/popup.html');
    iframe.title = 'SpeedySlate Settings';
    Object.assign(iframe.style, {
      width: '100%',
      height: '100%',
      border: 'none',
      display: 'block'
    });

    holder.appendChild(iframe);
    return holder;
  }

  public contains(target: Node): boolean {
    return this.panel?.contains(target) ?? false;
  }

  public close(): void {
    if (this.escHandler) {
      document.removeEventListener('keydown', this.escHandler, true);
      this.escHandler = null;
    }
    if (this.panel) {
      this.panel.remove();
      this.panel = null;
    }
  }
}
