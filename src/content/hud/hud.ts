import { ChubbyIcons } from './chubby-icons';
import { HudMenu } from './hud-menu';

export type HudState = 'idle' | 'translating' | 'paused' | 'completed' | 'error';

export interface HudCallbacks {
  onToggleTranslate: () => void;
  onToggleVisibility: (visible: boolean) => void;
  onClearChapterCache: () => void;
  onClearAllCache?: () => void;
}

/**
 * SpeedySlate Minimalist Floating Action Pill
 * Compact icon-only translate button + adjacent menu button in one HUD group.
 * Aesthetic: Minimalist Anime Editorial
 * Palette: #111111 (Ink), #F5F5F4 (Paper), #E52E3D (Accent)
 * Following Single Responsibility Principle (SRP) & strictly under 500 lines.
 */
export class FloatingHud {
  private container: HTMLDivElement;
  private btn: HTMLButtonElement;
  private menuBtn: HTMLButtonElement;
  private hudMenu: HudMenu;
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

    this.container = document.createElement('div');
    this.container.id = 'speedyslate-hud';

    this.btn = document.createElement('button');
    this.btn.id = 'speedyslate-floating-btn';
    this.btn.setAttribute('type', 'button');

    this.menuBtn = document.createElement('button');
    this.menuBtn.id = 'speedyslate-hud-menu-btn';
    this.menuBtn.setAttribute('type', 'button');
    this.menuBtn.title = 'Mở menu SpeedySlate';
    this.menuBtn.innerHTML = ChubbyIcons.dots(15, '#FFFFFF');

    this.container.appendChild(this.btn);
    this.container.appendChild(this.menuBtn);

    this.hudMenu = new HudMenu({
      isVisible: () => this.isVisible,
      onToggleVisibility: () => {
        this.isVisible = !this.isVisible;
        this.callbacks.onToggleVisibility(this.isVisible);
        this.render();
      },
      onClearChapterCache: () => {
        this.callbacks.onClearChapterCache();
        this.setState('idle');
      },
      onClearAllCache: () => {
        this.callbacks.onClearAllCache?.();
        this.setState('idle');
      }
    });

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
      #speedyslate-hud {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 2147483647;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        user-select: none;
      }
      #speedyslate-floating-btn,
      #speedyslate-hud-menu-btn {
        background: #0D0D11;
        color: #FFFFFF;
        border: 1px solid #26262E;
        border-radius: 8px;
        height: 38px;
        font-family: 'Space Grotesk', 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 11px;
        font-weight: 800;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        cursor: pointer;
        user-select: none;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.05);
        transition: border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
        outline: none;
        white-space: nowrap;
        padding: 0 10px;
      }
      #speedyslate-hud-menu-btn {
        width: 38px;
        padding: 0;
      }
      #speedyslate-floating-btn:hover,
      #speedyslate-hud-menu-btn:hover {
        border-color: #E52E3D;
        transform: translateY(-1px);
        box-shadow: 0 6px 24px rgba(0, 0, 0, 0.8), 0 0 16px rgba(229, 46, 61, 0.4);
      }
      #speedyslate-floating-btn:active,
      #speedyslate-hud-menu-btn:active {
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

  private mountToBody(): void {
    const tryMount = () => {
      const root = document.body || document.documentElement;
      if (root && !document.getElementById('speedyslate-hud')) {
        root.appendChild(this.container);
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
    // 1. Mouse Dragging vs Clicking — drag moves the whole HUD group
    const onDragStart = (e: MouseEvent) => {
      if (e.button !== 0) return; // Only primary click
      this.hasMoved = false;
      this.startX = e.clientX;
      this.startY = e.clientY;

      const rect = this.container.getBoundingClientRect();
      this.initialLeft = rect.left;
      this.initialTop = rect.top;

      const onMouseMove = (moveEvent: MouseEvent) => {
        const dx = moveEvent.clientX - this.startX;
        const dy = moveEvent.clientY - this.startY;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
          this.hasMoved = true;
          this.hudMenu.close();
        }
        if (this.hasMoved) {
          this.container.style.bottom = 'auto';
          this.container.style.right = 'auto';
          this.container.style.left = `${this.initialLeft + dx}px`;
          this.container.style.top = `${this.initialTop + dy}px`;
        }
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    this.btn.addEventListener('mousedown', onDragStart);
    this.menuBtn.addEventListener('mousedown', onDragStart);

    // 2. Left Click Handlers
    this.btn.addEventListener('click', (e: MouseEvent) => {
      if (this.hasMoved) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      this.hudMenu.close();
      this.handlePrimaryClick();
    });

    this.menuBtn.addEventListener('click', (e: MouseEvent) => {
      if (this.hasMoved) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      e.stopPropagation();
      this.hudMenu.toggle(this.menuBtn);
    });

    // 3. Right Click on either button: open the same menu
    this.btn.addEventListener('contextmenu', (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      this.hudMenu.toggle(this.menuBtn);
    });
    this.menuBtn.addEventListener('contextmenu', (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      this.hudMenu.toggle(this.menuBtn);
    });

    // Close menu on click outside
    document.addEventListener('click', (e: MouseEvent) => {
      if (
        this.hudMenu.isOpen &&
        !this.hudMenu.contains(e.target as Node) &&
        e.target !== this.menuBtn &&
        e.target !== this.btn &&
        !this.menuBtn.contains(e.target as Node) &&
        !this.btn.contains(e.target as Node)
      ) {
        this.hudMenu.close();
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

  public updateStatus(translatedCount: number, totalCount: number): void {
    this.translatedCount = translatedCount;
    this.totalCount = totalCount;
    this.render();
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

    const rect = this.container.getBoundingClientRect();
    this.toast = document.createElement('div');
    Object.assign(this.toast.style, {
      position: 'fixed',
      right: `${window.innerWidth - rect.right}px`,
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

  private badge(text: string, opts: { alert?: boolean } = {}): string {
    const border = opts.alert ? '#E52E3D' : '#4D1217';
    const bg = opts.alert ? '#1C0A0B' : '#140A0B';
    return `<span style="background: ${bg}; border: 1px solid ${border}; color: #FFA5AC; border-radius: 4px; padding: 1px 6px; font-size: 10px; font-weight: 700;">${text}</span>`;
  }

  private render(): void {
    const count = `${this.translatedCount}/${this.totalCount}`;
    switch (this.state) {
      case 'idle': {
        const badge = this.totalCount > 0 ? this.badge(`${this.totalCount}`) : '';
        this.btn.innerHTML = `${ChubbyIcons.bolt(15, '#E52E3D')}${badge}`;
        this.btn.style.background = '#0D0D11';
        this.btn.style.borderColor = '#26262E';
        this.btn.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.7)';
        this.btn.title = 'Bấm để bắt đầu dịch truyện';
        break;
      }
      case 'error': {
        const badge = this.totalCount > 0 ? this.badge(count, { alert: true }) : '';
        this.btn.innerHTML = `${ChubbyIcons.alert(15, '#FF3B47')}${badge}`;
        this.btn.style.background = '#180D0E';
        this.btn.style.borderColor = '#FF3B47';
        this.btn.style.boxShadow = '0 6px 24px rgba(0, 0, 0, 0.8), 0 0 18px rgba(255, 59, 71, 0.35)';
        this.btn.title = 'Có lỗi xảy ra khi dịch • Bấm để thử lại';
        break;
      }
      case 'translating': {
        const badge = this.totalCount > 0
          ? this.badge(count, { alert: true })
          : '<span style="color: #E52E3D; font-size: 10px;">...</span>';
        this.btn.innerHTML = `${ChubbyIcons.spinner(15, '#E52E3D')}${badge}`;
        this.btn.style.background = '#0D0D11';
        this.btn.style.borderColor = '#E52E3D';
        this.btn.style.boxShadow = '0 6px 24px rgba(0, 0, 0, 0.8), 0 0 18px rgba(229, 46, 61, 0.45)';
        this.btn.title = 'Đang dịch truyện... Bấm để tạm dừng';
        break;
      }
      case 'paused': {
        const badge = this.totalCount > 0
          ? `<span style="background: #181820; border: 1px solid #33333E; color: #FFFFFF; border-radius: 4px; padding: 1px 6px; font-size: 10px; font-weight: 700;">${count}</span>`
          : '';
        this.btn.innerHTML = `${ChubbyIcons.play(14, '#FFFFFF')}${badge}`;
        this.btn.style.background = '#0D0D11';
        this.btn.style.borderColor = '#26262E';
        this.btn.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.7)';
        this.btn.title = 'Đang tạm dừng • Bấm để tiếp tục dịch';
        break;
      }
      case 'completed': {
        this.btn.style.background = '#0D0D11';
        this.btn.style.borderColor = '#26262E';
        this.btn.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.7)';
        if (this.isVisible) {
          const badge = this.totalCount > 0 ? this.badge(`${this.totalCount}`) : '';
          this.btn.innerHTML = `${ChubbyIcons.checkCircle(15, '#E52E3D')}${badge}`;
          this.btn.title = 'Đã dịch xong • Bấm để ẩn bản dịch (xem tranh gốc)';
        } else {
          this.btn.innerHTML = `${ChubbyIcons.eye(15, '#FFFFFF')}`;
          this.btn.title = 'Đang xem ảnh gốc • Bấm để hiện lại bản dịch';
        }
        break;
      }
    }
  }

  public destroy(): void {
    this.hudMenu.close();
    this.container?.remove();
    this.toast?.remove();
    const styleEl = document.getElementById('speedyslate-hud-styles');
    if (styleEl) styleEl.remove();
  }
}
