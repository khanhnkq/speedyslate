import { ChubbyIcons } from './chubby-icons';

export type HudState = 'idle' | 'translating' | 'paused' | 'completed';

export interface HudCallbacks {
  onToggleTranslate: () => void;
  onToggleVisibility: (visible: boolean) => void;
  onClearChapterCache: () => void;
  onClearAllCache?: () => void;
}

/**
 * SpeedySlate Minimalist Floating Action Pill (Single Unified Button)
 * Aesthetic: Minimalist Anime Editorial
 * Palette: #111111 (Ink), #F5F5F4 (Paper), #A855F7 (Accent)
 * Following Single Responsibility Principle (SRP) & strictly under 500 lines.
 */
export class FloatingHud {
  private btn: HTMLButtonElement;
  private menu: HTMLElement | null = null;
  private toast: HTMLElement | null = null;
  private toastTimer: any = null;

  private state: HudState = 'idle';
  private isVisible: boolean = true;
  private translatedCount: number = 0;
  private totalCount: number = 0;
  private callbacks: HudCallbacks;

  // Drag tracking
  private startX: number = 0;
  private startY: number = 0;
  private initialLeft: number = 0;
  private initialTop: number = 0;
  private hasMoved: boolean = false;

  constructor(callbacks: HudCallbacks) {
    this.callbacks = callbacks;
    this.injectStyles();

    this.btn = document.createElement('button');
    this.btn.id = 'speedyslate-floating-btn';
    this.initButton();
    this.setupEvents();
    this.mountToBody();
    this.render();
  }

  private injectStyles(): void {
    if (document.getElementById('speedyslate-hud-styles')) return;
    const style = document.createElement('style');
    style.id = 'speedyslate-hud-styles';
    style.textContent = `
      @keyframes speedyslateSpin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      #speedyslate-floating-btn {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 2147483647;
        background: #111111;
        color: #F5F5F4;
        border: 1px solid rgba(255, 255, 255, 0.16);
        border-radius: 9999px;
        padding: 8px 16px;
        height: 38px;
        font-family: 'DM Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: -0.01em;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        user-select: none;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.15);
        transition: border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
        outline: none;
        white-space: nowrap;
      }
      #speedyslate-floating-btn:hover {
        border-color: #A855F7;
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4), 0 0 10px rgba(168, 85, 247, 0.25);
      }
      #speedyslate-floating-btn:active {
        transform: translateY(0px) scale(0.98);
      }
      .speedyslate-menu-item {
        padding: 8px 12px;
        font-size: 11px;
        font-weight: 500;
        color: #F5F5F4;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: background 0.12s ease;
      }
      .speedyslate-menu-item:hover {
        background: rgba(168, 85, 247, 0.18);
        color: #ffffff;
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  private initButton(): void {
    this.btn.setAttribute('type', 'button');
    this.btn.title = 'SpeedySlate • Bấm để dịch • Chuột phải mở tùy chọn';
  }

  private mountToBody(): void {
    const tryMount = () => {
      const root = document.body || document.documentElement;
      if (root && !document.getElementById('speedyslate-floating-btn')) {
        root.appendChild(this.btn);
      } else if (!root) {
        setTimeout(tryMount, 50);
      }
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', tryMount);
    } else {
      tryMount();
    }
  }

  private setupEvents(): void {
    // 1. Mouse Dragging vs Clicking
    this.btn.addEventListener('mousedown', (e: MouseEvent) => {
      if (e.button !== 0) return; // Only primary click
      this.hasMoved = false;
      this.startX = e.clientX;
      this.startY = e.clientY;

      const rect = this.btn.getBoundingClientRect();
      this.initialLeft = rect.left;
      this.initialTop = rect.top;

      const onMouseMove = (moveEvent: MouseEvent) => {
        const dx = moveEvent.clientX - this.startX;
        const dy = moveEvent.clientY - this.startY;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
          this.hasMoved = true;
          this.closeMenu();
        }
        if (this.hasMoved) {
          this.btn.style.bottom = 'auto';
          this.btn.style.right = 'auto';
          this.btn.style.left = `${this.initialLeft + dx}px`;
          this.btn.style.top = `${this.initialTop + dy}px`;
        }
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });

    // 2. Left Click Handler
    this.btn.addEventListener('click', (e: MouseEvent) => {
      if (this.hasMoved) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      this.closeMenu();
      this.handlePrimaryClick();
    });

    // 3. Right Click: Context Menu for Secondary Actions
    this.btn.addEventListener('contextmenu', (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggleMenu();
    });

    // Close menu on click outside
    document.addEventListener('click', (e: MouseEvent) => {
      if (this.menu && !this.menu.contains(e.target as Node) && e.target !== this.btn) {
        this.closeMenu();
      }
    });
  }

  private handlePrimaryClick(): void {
    if (this.state === 'idle') {
      this.setState('translating');
      this.callbacks.onToggleTranslate();
    } else if (this.state === 'translating') {
      this.setState('paused');
      this.callbacks.onToggleTranslate();
    } else if (this.state === 'paused') {
      this.setState('translating');
      this.callbacks.onToggleTranslate();
    } else if (this.state === 'completed') {
      // Toggle visibility
      this.isVisible = !this.isVisible;
      this.callbacks.onToggleVisibility(this.isVisible);
      this.render();
    }
  }

  private toggleMenu(): void {
    if (this.menu) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  private openMenu(): void {
    this.closeMenu();

    const rect = this.btn.getBoundingClientRect();
    this.menu = document.createElement('div');
    this.menu.id = 'speedyslate-floating-menu';
    Object.assign(this.menu.style, {
      position: 'fixed',
      left: `${Math.max(12, rect.left)}px`,
      bottom: `${window.innerHeight - rect.top + 8}px`,
      zIndex: '2147483647',
      background: '#111111',
      border: '1px solid rgba(255, 255, 255, 0.16)',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
      minWidth: '160px',
      userSelect: 'none'
    });

    // Item 1: Toggle Visibility
    const itemVis = document.createElement('div');
    itemVis.className = 'speedyslate-menu-item';
    itemVis.innerHTML = `
      ${ChubbyIcons.eye(14, '#A855F7')}
      <span>${this.isVisible ? 'Ẩn bản dịch (Xem gốc)' : 'Hiện lại bản dịch'}</span>
    `;
    itemVis.onclick = (e) => {
      e.stopPropagation();
      this.isVisible = !this.isVisible;
      this.callbacks.onToggleVisibility(this.isVisible);
      this.closeMenu();
      this.render();
    };

    // Item 2: Clear chapter cache & re-translate
    const itemClear = document.createElement('div');
    itemClear.className = 'speedyslate-menu-item';
    itemClear.style.borderTop = '1px solid rgba(255, 255, 255, 0.08)';
    itemClear.innerHTML = `
      ${ChubbyIcons.broom(14, '#A855F7')}
      <span>Xóa cache chương này</span>
    `;
    itemClear.onclick = (e) => {
      e.stopPropagation();
      this.closeMenu();
      this.callbacks.onClearChapterCache();
      this.setState('idle');
    };

    // Item 3: Clear all cache
    const itemClearAll = document.createElement('div');
    itemClearAll.className = 'speedyslate-menu-item';
    itemClearAll.style.borderTop = '1px solid rgba(255, 255, 255, 0.08)';
    itemClearAll.innerHTML = `
      ${ChubbyIcons.trash(14, '#ef4444')}
      <span>Dọn sạch toàn bộ cache</span>
    `;
    itemClearAll.onclick = (e) => {
      e.stopPropagation();
      this.closeMenu();
      this.callbacks.onClearAllCache?.();
      this.setState('idle');
    };

    this.menu.appendChild(itemVis);
    this.menu.appendChild(itemClear);
    this.menu.appendChild(itemClearAll);
    document.body.appendChild(this.menu);
  }

  private closeMenu(): void {
    if (this.menu) {
      this.menu.remove();
      this.menu = null;
    }
  }

  public updateStatus(translatedCount: number, totalCount: number): void {
    this.translatedCount = translatedCount;
    this.totalCount = totalCount;
    if (totalCount > 0 && translatedCount >= totalCount && this.state === 'translating') {
      this.setState('completed');
    } else {
      this.render();
    }
  }

  public getState(): HudState {
    return this.state;
  }

  public setState(state: HudState): void {
    this.state = state;
    this.render();
  }

  public log(message: string, isError: boolean = false): void {
    this.btn.title = `SpeedySlate: ${message}`;

    if (isError) {
      this.showToast(message);
    }
  }

  private showToast(message: string): void {
    if (this.toast) {
      this.toast.remove();
      if (this.toastTimer) clearTimeout(this.toastTimer);
    }

    const rect = this.btn.getBoundingClientRect();
    this.toast = document.createElement('div');
    Object.assign(this.toast.style, {
      position: 'fixed',
      left: `${Math.max(12, rect.left)}px`,
      bottom: `${window.innerHeight - rect.top + 8}px`,
      zIndex: '2147483647',
      background: '#111111',
      color: '#F5F5F4',
      border: '1px solid rgba(239, 68, 68, 0.5)',
      borderRadius: '8px',
      padding: '6px 12px',
      fontSize: '11px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
      pointerEvents: 'none',
      transition: 'opacity 0.2s ease',
      maxWidth: '280px'
    });
    this.toast.textContent = message;
    document.body.appendChild(this.toast);

    this.toastTimer = setTimeout(() => {
      if (this.toast) {
        this.toast.style.opacity = '0';
        setTimeout(() => {
          this.toast?.remove();
          this.toast = null;
        }, 200);
      }
    }, 3500);
  }

  private render(): void {
    switch (this.state) {
      case 'idle': {
        const countTxt = this.totalCount > 0 ? ` (${this.totalCount})` : '';
        this.btn.innerHTML = `
          ${ChubbyIcons.bolt(14, '#A855F7')}
          <span>Dịch truyện${countTxt}</span>
        `;
        this.btn.title = 'Bấm để bắt đầu dịch truyện • Chuột phải mở menu';
        break;
      }
      case 'translating': {
        const prog = this.totalCount > 0 ? ` ${this.translatedCount}/${this.totalCount}` : '...';
        this.btn.innerHTML = `
          ${ChubbyIcons.spinner(14, '#A855F7')}
          <span>Đang dịch${prog}</span>
        `;
        this.btn.title = 'Đang dịch truyện... Bấm để tạm dừng';
        break;
      }
      case 'paused': {
        const prog = this.totalCount > 0 ? ` (${this.translatedCount}/${this.totalCount})` : '';
        this.btn.innerHTML = `
          ${ChubbyIcons.play(13, '#F5F5F4')}
          <span>Tiếp tục${prog}</span>
        `;
        this.btn.title = 'Bấm để tiếp tục dịch';
        break;
      }
      case 'completed': {
        if (this.isVisible) {
          const prog = this.totalCount > 0 ? ` (${this.totalCount})` : '';
          this.btn.innerHTML = `
            ${ChubbyIcons.checkCircle(14, '#A855F7')}
            <span>Đã dịch${prog}</span>
          `;
          this.btn.title = 'Bấm để ẩn bản dịch (Xem tranh gốc) • Chuột phải mở menu';
        } else {
          this.btn.innerHTML = `
            ${ChubbyIcons.eye(14, '#F5F5F4')}
            <span>Xem tranh gốc</span>
          `;
          this.btn.title = 'Bấm để hiện lại bản dịch • Chuột phải mở menu';
        }
        break;
      }
    }
  }
}
