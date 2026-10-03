import { ChubbyIcons } from './chubby-icons';

export type HudState = 'idle' | 'translating' | 'paused' | 'completed';

export interface HudCallbacks {
  onToggleTranslate: () => void;
  onToggleVisibility: (visible: boolean) => void;
  onClearChapterCache: () => void;
}

/**
 * Modern Glassmorphism Floating HUD for SpeedySlate
 * 100% Emoji-Free: Powered by Chubby Cute Vector SVG Icons
 * Following Single Responsibility Principle (SRP)
 */
export class FloatingHud {
  private container: HTMLElement;
  private miniBadge: HTMLElement;
  private translateBtn!: HTMLButtonElement;
  private progressLabel!: HTMLElement;
  private eyeBtn!: HTMLButtonElement;
  private clearBtn!: HTMLButtonElement;
  private logDot!: HTMLElement;
  private logTicker!: HTMLElement;
  private logListContainer!: HTMLElement;

  private isVisible: boolean = true;
  private state: HudState = 'idle';
  private showLogHistory: boolean = false;
  private logs: string[] = [];
  private callbacks: HudCallbacks;

  constructor(callbacks: HudCallbacks) {
    this.callbacks = callbacks;

    // 1. Mini Mascot Badge (shown when minimized)
    this.miniBadge = document.createElement('div');
    this.miniBadge.id = 'speedyslate-mini-badge';
    this.initMiniBadge();

    // 2. Main HUD Container
    this.container = document.createElement('div');
    this.container.id = 'speedyslate-hud-root';
    this.render();

    this.makeDraggable(this.container);
    this.mountToBody();
  }

  private mountToBody(): void {
    const tryMount = () => {
      const root = document.body || document.documentElement;
      if (root) {
        if (!document.getElementById('speedyslate-mini-badge')) {
          root.appendChild(this.miniBadge);
        }
        if (!document.getElementById('speedyslate-hud-root')) {
          root.appendChild(this.container);
        }
      } else {
        setTimeout(tryMount, 50);
      }
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', tryMount);
    } else {
      tryMount();
    }
  }

  public log(message: string, isError: boolean = false): void {
    const time = new Date().toLocaleTimeString('vi-VN', { hour12: false });
    const formatted = `[${time}] ${message}`;
    this.logs.unshift(formatted);
    if (this.logs.length > 30) this.logs.pop();

    if (this.logTicker) {
      this.logTicker.textContent = message;
      this.logTicker.style.color = isError ? '#f87171' : '#cbd5e1';
    }

    if (this.logDot) {
      const dotColor = isError ? '#ef4444' : this.state === 'translating' ? '#ec4899' : '#10b981';
      this.logDot.innerHTML = ChubbyIcons.pulseDot(dotColor);
    }

    if (this.logListContainer) {
      this.logListContainer.innerHTML = this.logs
        .map((l) => `<div style="padding: 3px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">${l}</div>`)
        .join('');
    }
  }

  public updateStatus(translatedCount: number, totalCount: number): void {
    if (this.progressLabel) {
      this.progressLabel.textContent = `${translatedCount} / ${totalCount} trang`;
    }
    if (totalCount > 0 && translatedCount >= totalCount && this.state === 'translating') {
      this.setState('completed');
    }
  }

  public getState(): HudState {
    return this.state;
  }

  public setState(state: HudState): void {
    this.state = state;
    if (!this.translateBtn) return;

    switch (state) {
      case 'idle':
        this.translateBtn.innerHTML = `
          <div style="display:flex; align-items:center; justify-content:center; gap:8px;">
            ${ChubbyIcons.play(16, '#ffffff')}
            <span>Bắt đầu dịch truyện</span>
          </div>
        `;
        this.translateBtn.style.background = 'linear-gradient(135deg, #6366f1, #8b5cf6)';
        this.translateBtn.style.boxShadow = '0 4px 16px rgba(99, 102, 241, 0.4)';
        break;
      case 'translating':
        this.translateBtn.innerHTML = `
          <div style="display:flex; align-items:center; justify-content:center; gap:8px;">
            ${ChubbyIcons.pause(16, '#ffffff')}
            <span>Đang dịch... (Bấm tạm dừng)</span>
          </div>
        `;
        this.translateBtn.style.background = 'linear-gradient(135deg, #ec4899, #f43f5e)';
        this.translateBtn.style.boxShadow = '0 4px 16px rgba(236, 72, 153, 0.45)';
        break;
      case 'paused':
        this.translateBtn.innerHTML = `
          <div style="display:flex; align-items:center; justify-content:center; gap:8px;">
            ${ChubbyIcons.play(16, '#ffffff')}
            <span>Tiếp tục dịch truyện</span>
          </div>
        `;
        this.translateBtn.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
        this.translateBtn.style.boxShadow = '0 4px 16px rgba(245, 158, 11, 0.4)';
        break;
      case 'completed':
        this.translateBtn.innerHTML = `
          <div style="display:flex; align-items:center; justify-content:center; gap:8px;">
            ${ChubbyIcons.checkCircle(16, '#ffffff')}
            <span>Đã dịch xong toàn bộ</span>
          </div>
        `;
        this.translateBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        this.translateBtn.style.boxShadow = '0 4px 16px rgba(16, 185, 129, 0.4)';
        break;
    }
  }

  private initMiniBadge(): void {
    Object.assign(this.miniBadge.style, {
      position: 'fixed',
      bottom: '90px',
      right: '20px',
      zIndex: '2147483647',
      background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
      color: '#ffffff',
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      boxShadow: '0 8px 25px rgba(236, 72, 153, 0.5), 0 0 12px rgba(139, 92, 246, 0.5)',
      display: 'none',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      userSelect: 'none',
      border: '2px solid rgba(255, 255, 255, 0.8)',
      transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
    });
    this.miniBadge.innerHTML = ChubbyIcons.bolt(22, '#ffffff');
    this.miniBadge.title = 'Mở bảng điều khiển SpeedySlate';
    this.miniBadge.onmouseenter = () => (this.miniBadge.style.transform = 'scale(1.12)');
    this.miniBadge.onmouseleave = () => (this.miniBadge.style.transform = 'scale(1)');
    this.miniBadge.onclick = () => this.toggleExpand(true);
  }

  private toggleExpand(expand: boolean): void {
    this.container.style.display = expand ? 'flex' : 'none';
    this.miniBadge.style.display = expand ? 'none' : 'flex';
  }

  private render(): void {
    Object.assign(this.container.style, {
      position: 'fixed',
      bottom: '90px',
      right: '20px',
      zIndex: '2147483647',
      background: 'rgba(16, 16, 26, 0.92)',
      backdropFilter: 'blur(20px) saturate(180%)',
      color: '#ffffff',
      padding: '14px 16px',
      borderRadius: '18px',
      boxShadow: '0 16px 45px rgba(0, 0, 0, 0.7), 0 0 20px rgba(139, 92, 246, 0.25)',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: '13px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      border: '1px solid rgba(168, 85, 247, 0.35)',
      userSelect: 'none',
      width: '320px',
      maxWidth: '90vw'
    });

    // 1. HEADER ROW: Chubby Bolt + Title + Tag + Minimize
    const headerRow = document.createElement('div');
    headerRow.style.cssText = `
      display: flex; align-items: center; justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 8px; cursor: move;
    `;
    const titleBox = document.createElement('div');
    titleBox.style.cssText = 'display: flex; align-items: center; gap: 7px;';
    titleBox.innerHTML = `
      ${ChubbyIcons.bolt(18, '#ec4899')}
      <span style="background: linear-gradient(90deg, #f472b6, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 800; font-size: 14px; letter-spacing: -0.3px;">SpeedySlate</span>
      <span style="font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 8px; background: rgba(168,85,247,0.22); color: #c084fc; border: 1px solid rgba(168,85,247,0.35);">AI</span>
    `;

    const minBtn = document.createElement('button');
    minBtn.innerHTML = ChubbyIcons.close(12, '#94a3b8');
    minBtn.title = 'Thu nhỏ cửa sổ';
    minBtn.style.cssText = `
      background: rgba(255, 255, 255, 0.08); color: #94a3b8; border: none; border-radius: 8px;
      padding: 4px 6px; cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: all 0.2s;
    `;
    minBtn.onmouseenter = () => {
      minBtn.style.background = 'rgba(239, 68, 68, 0.3)';
      minBtn.innerHTML = ChubbyIcons.close(12, '#ffffff');
    };
    minBtn.onmouseleave = () => {
      minBtn.style.background = 'rgba(255, 255, 255, 0.08)';
      minBtn.innerHTML = ChubbyIcons.close(12, '#94a3b8');
    };
    minBtn.onclick = () => this.toggleExpand(false);

    headerRow.appendChild(titleBox);
    headerRow.appendChild(minBtn);

    // 2. MAIN TACTILE ACTION BUTTON
    this.translateBtn = document.createElement('button');
    this.translateBtn.style.cssText = `
      background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff;
      border: none; border-radius: 12px; padding: 10px 14px; font-weight: 700;
      cursor: pointer; font-size: 13px; width: 100%; transition: all 0.2s;
      box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4); text-align: center;
    `;
    this.translateBtn.onmousedown = () => (this.translateBtn.style.transform = 'scale(0.97)');
    this.translateBtn.onmouseup = () => (this.translateBtn.style.transform = 'scale(1)');
    this.translateBtn.onmouseenter = () => (this.translateBtn.style.filter = 'brightness(1.1)');
    this.translateBtn.onmouseleave = () => {
      this.translateBtn.style.transform = 'scale(1)';
      this.translateBtn.style.filter = 'brightness(1)';
    };
    this.translateBtn.onclick = () => {
      if (this.state === 'idle' || this.state === 'paused' || this.state === 'completed') {
        this.setState('translating');
      } else {
        this.setState('paused');
      }
      this.callbacks.onToggleTranslate();
    };
    this.setState('idle');

    // 3. ROW 2: Pill Progress & Action Tools
    const row2 = document.createElement('div');
    row2.style.cssText = 'display: flex; align-items: center; justify-content: space-between; gap: 8px;';

    const progressWrapper = document.createElement('div');
    progressWrapper.style.cssText = `
      display: flex; align-items: center; gap: 6px; background: rgba(255, 255, 255, 0.06);
      padding: 5px 10px; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.08);
    `;
    const bookIconSpan = document.createElement('span');
    bookIconSpan.innerHTML = ChubbyIcons.book(15, '#38bdf8');
    this.progressLabel = document.createElement('span');
    this.progressLabel.textContent = '0 / 0 trang';
    this.progressLabel.style.cssText = 'font-weight: 700; color: #f1f5f9; font-size: 12px;';
    progressWrapper.appendChild(bookIconSpan);
    progressWrapper.appendChild(this.progressLabel);

    const toolsWrapper = document.createElement('div');
    toolsWrapper.style.cssText = 'display: flex; gap: 6px;';

    this.eyeBtn = document.createElement('button');
    this.eyeBtn.title = 'Ẩn / Hiện chữ dịch (Xem tranh gốc)';
    this.eyeBtn.innerHTML = ChubbyIcons.eye(15, '#e2e8f0');
    this.eyeBtn.style.cssText = `
      background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 9px; color: #fff; padding: 6px 9px; cursor: pointer; display: flex; align-items: center;
      transition: background 0.2s;
    `;
    this.eyeBtn.onclick = () => {
      this.isVisible = !this.isVisible;
      this.eyeBtn.style.opacity = this.isVisible ? '1' : '0.4';
      this.callbacks.onToggleVisibility(this.isVisible);
    };

    this.clearBtn = document.createElement('button');
    this.clearBtn.title = 'Dọn sạch cache bản dịch của chương này để dịch lại';
    this.clearBtn.innerHTML = ChubbyIcons.broom(15, '#e2e8f0');
    this.clearBtn.style.cssText = `
      background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 9px; color: #fff; padding: 6px 9px; cursor: pointer; display: flex; align-items: center;
      transition: background 0.2s;
    `;
    this.clearBtn.onclick = () => this.callbacks.onClearChapterCache();

    const logToggleBtn = document.createElement('button');
    logToggleBtn.title = 'Bật / Tắt xem nhật ký hoạt động';
    logToggleBtn.innerHTML = ChubbyIcons.document(15, '#e2e8f0');
    logToggleBtn.style.cssText = `
      background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 9px; color: #fff; padding: 6px 9px; cursor: pointer; display: flex; align-items: center;
      transition: background 0.2s;
    `;
    logToggleBtn.onclick = () => {
      this.showLogHistory = !this.showLogHistory;
      this.logListContainer.style.display = this.showLogHistory ? 'block' : 'none';
    };

    toolsWrapper.appendChild(this.eyeBtn);
    toolsWrapper.appendChild(this.clearBtn);
    toolsWrapper.appendChild(logToggleBtn);

    row2.appendChild(progressWrapper);
    row2.appendChild(toolsWrapper);

    // 4. ROW 3: LIVE LOG TICKER WITH PULSING STATUS DOT
    const logRow = document.createElement('div');
    logRow.style.cssText = `
      background: rgba(0, 0, 0, 0.45); border-radius: 10px; padding: 7px 10px;
      font-size: 11px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      display: flex; align-items: center; gap: 4px; overflow: hidden; text-overflow: ellipsis;
      white-space: nowrap; border: 1px solid rgba(255, 255, 255, 0.06);
    `;
    this.logDot = document.createElement('span');
    this.logDot.innerHTML = ChubbyIcons.pulseDot('#10b981');
    this.logTicker = document.createElement('span');
    this.logTicker.textContent = 'SpeedySlate sẵn sàng';
    this.logTicker.style.color = '#cbd5e1';
    this.logTicker.style.overflow = 'hidden';
    this.logTicker.style.textOverflow = 'ellipsis';

    logRow.appendChild(this.logDot);
    logRow.appendChild(this.logTicker);

    // 5. ROW 4: EXPANDABLE LOG HISTORY
    this.logListContainer = document.createElement('div');
    this.logListContainer.style.cssText = `
      max-height: 130px; overflow-y: auto; background: rgba(0, 0, 0, 0.6); border-radius: 10px;
      padding: 6px 10px; font-size: 10px; font-family: ui-monospace, SFMono-Regular, monospace;
      color: #94a3b8; display: none; border: 1px solid rgba(255, 255, 255, 0.08);
    `;

    this.container.appendChild(headerRow);
    this.container.appendChild(this.translateBtn);
    this.container.appendChild(row2);
    this.container.appendChild(logRow);
    this.container.appendChild(this.logListContainer);
  }

  private makeDraggable(el: HTMLElement): void {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const header = el.firstElementChild as HTMLElement;

    if (header) {
      header.onmousedown = (e: MouseEvent) => {
        if ((e.target as HTMLElement).tagName === 'BUTTON' || (e.target as HTMLElement).closest('button')) return;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = () => {
          document.onmouseup = null;
          document.onmousemove = null;
        };
        document.onmousemove = (me: MouseEvent) => {
          me.preventDefault();
          pos1 = pos3 - me.clientX;
          pos2 = pos4 - me.clientY;
          pos3 = me.clientX;
          pos4 = me.clientY;
          el.style.bottom = 'auto';
          el.style.right = 'auto';
          el.style.top = `${el.offsetTop - pos2}px`;
          el.style.left = `${el.offsetLeft - pos1}px`;
        };
      };
    }
  }
}
