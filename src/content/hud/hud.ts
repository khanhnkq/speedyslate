import { ChubbyIcons } from './chubby-icons';

export type HudState = 'idle' | 'translating' | 'paused' | 'completed' | 'error';

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
        background: #0D0D11;
        color: #FFFFFF;
        border: 1px solid #26262E;
        border-radius: 8px;
        padding: 8px 14px;
        height: 38px;
        font-family: 'Space Grotesk', 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 11px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        user-select: none;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.05);
        transition: border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
        outline: none;
        white-space: nowrap;
      }
      #speedyslate-floating-btn:hover {
        border-color: #E52E3D;
        transform: translateY(-1px);
        box-shadow: 0 6px 24px rgba(0, 0, 0, 0.8), 0 0 16px rgba(229, 46, 61, 0.4);
      }
      #speedyslate-floating-btn:active {
        transform: translateY(0px) scale(0.98);
      }
      .speedyslate-menu-item {
        padding: 9px 14px;
        font-size: 11px;
        font-weight: 600;
        font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
        color: #FFFFFF;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 9px;
        transition: background 0.12s ease;
      }
      .speedyslate-menu-item:hover {
        background: rgba(229, 46, 61, 0.16);
        color: #FFFFFF;
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
    if (this.state === 'idle' || this.state === 'error') {
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
      background: '#0D0D11',
      border: '1px solid #26262E',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7), 0 0 14px rgba(229, 46, 61, 0.15)',
      minWidth: '170px',
      userSelect: 'none'
    });

    // Item 1: Toggle Visibility
    const itemVis = document.createElement('div');
    itemVis.className = 'speedyslate-menu-item';
    itemVis.innerHTML = `
      ${ChubbyIcons.eye(15, '#E52E3D')}
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
    itemClear.style.borderTop = '1px solid #26262E';
    itemClear.innerHTML = `
      ${ChubbyIcons.broom(15, '#E52E3D')}
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
    itemClearAll.style.borderTop = '1px solid #26262E';
    itemClearAll.innerHTML = `
      ${ChubbyIcons.trash(15, '#FF3B47')}
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
      background: '#140A0B',
      color: '#FFA5AC',
      border: '1px solid #E52E3D',
      borderRadius: '8px',
      padding: '8px 14px',
      fontSize: '11px',
      fontFamily: "'Space Grotesk', 'Inter', system-ui, -apple-system, sans-serif",
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7), 0 0 12px rgba(229, 46, 61, 0.25)',
      pointerEvents: 'none',
      transition: 'opacity 0.2s ease',
      maxWidth: '340px',
      lineHeight: '1.4'
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
    }, 6000);
  }

  private render(): void {
    switch (this.state) {
      case 'idle': {
        const badge = this.totalCount > 0
          ? `<span style="background: #140A0B; border: 1px solid #4D1217; color: #FFA5AC; border-radius: 4px; padding: 1px 6px; font-size: 10px; font-weight: 700;">${this.totalCount}</span>`
          : '';
        this.btn.innerHTML = `
          ${ChubbyIcons.bolt(15, '#E52E3D')}
          <span>DỊCH TRUYỆN</span>
          ${badge}
        `;
        this.btn.style.background = '#0D0D11';
        this.btn.style.borderColor = '#26262E';
        this.btn.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.7)';
        this.btn.title = 'Bấm để bắt đầu dịch truyện • Chuột phải mở menu';
        break;
      }
      case 'error': {
        const badge = this.totalCount > 0
          ? `<span style="background: #1C0A0B; border: 1px solid #E52E3D; color: #FFA5AC; border-radius: 4px; padding: 1px 6px; font-size: 10px; font-weight: 700;">${this.translatedCount}/${this.totalCount}</span>`
          : '';
        this.btn.innerHTML = `
          ${ChubbyIcons.alert(15, '#FF3B47')}
          <span style="color: #FFA5AC;">LỖI DỊCH</span>
          ${badge}
        `;
        this.btn.style.background = '#180D0E';
        this.btn.style.borderColor = '#FF3B47';
        this.btn.style.boxShadow = '0 6px 24px rgba(0, 0, 0, 0.8), 0 0 18px rgba(255, 59, 71, 0.35)';
        this.btn.title = 'Có lỗi xảy ra khi dịch • Bấm để thử lại • Chuột phải mở menu';
        break;
      }
      case 'translating': {
        const badge = this.totalCount > 0
          ? `<span style="background: #1C0A0B; border: 1px solid #E52E3D; color: #FFA5AC; border-radius: 4px; padding: 1px 6px; font-size: 10px; font-weight: 700;">${this.translatedCount}/${this.totalCount}</span>`
          : '<span style="color: #E52E3D; font-size: 10px;">...</span>';
        this.btn.innerHTML = `
          ${ChubbyIcons.spinner(15, '#E52E3D')}
          <span>ĐANG DỊCH</span>
          ${badge}
        `;
        this.btn.style.background = '#0D0D11';
        this.btn.style.borderColor = '#E52E3D';
        this.btn.style.boxShadow = '0 6px 24px rgba(0, 0, 0, 0.8), 0 0 18px rgba(229, 46, 61, 0.45)';
        this.btn.title = 'Đang dịch truyện... Bấm để tạm dừng';
        break;
      }
      case 'paused': {
        const badge = this.totalCount > 0
          ? `<span style="background: #181820; border: 1px solid #33333E; color: #FFFFFF; border-radius: 4px; padding: 1px 6px; font-size: 10px; font-weight: 700;">${this.translatedCount}/${this.totalCount}</span>`
          : '';
        this.btn.innerHTML = `
          ${ChubbyIcons.play(14, '#FFFFFF')}
          <span>TẠM DỪNG</span>
          ${badge}
        `;
        this.btn.style.background = '#0D0D11';
        this.btn.style.borderColor = '#26262E';
        this.btn.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.7)';
        this.btn.title = 'Bấm để tiếp tục dịch';
        break;
      }
      case 'completed': {
        this.btn.style.background = '#0D0D11';
        this.btn.style.borderColor = '#26262E';
        this.btn.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.7)';
        if (this.isVisible) {
          const badge = this.totalCount > 0
            ? `<span style="background: #140A0B; border: 1px solid #4D1217; color: #FFA5AC; border-radius: 4px; padding: 1px 6px; font-size: 10px; font-weight: 700;">${this.totalCount}</span>`
            : '';
          this.btn.innerHTML = `
            ${ChubbyIcons.checkCircle(15, '#E52E3D')}
            <span>ĐÃ DỊCH</span>
            ${badge}
          `;
          this.btn.title = 'Bấm để ẩn bản dịch (Xem tranh gốc) • Chuột phải mở menu';
        } else {
          this.btn.innerHTML = `
            ${ChubbyIcons.eye(15, '#FFFFFF')}
            <span>XEM ẢNH GỐC</span>
          `;
          this.btn.title = 'Bấm để hiện lại bản dịch • Chuột phải mở menu';
        }
        break;
      }
    }
  }
}
