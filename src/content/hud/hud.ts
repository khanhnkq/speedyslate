export type HudState = 'idle' | 'translating' | 'paused' | 'completed';

export interface HudCallbacks {
  onToggleTranslate: () => void;
  onToggleVisibility: (visible: boolean) => void;
  onClearChapterCache: () => void;
}

/**
 * Anime-Themed Floating HUD (漫画翻訳)
 * Ultra-lightweight, 100% focused on translation state & anime aesthetics
 * Following Single Responsibility Principle (SRP)
 */
export class FloatingHud {
  private container: HTMLElement;
  private miniBadge: HTMLElement;
  private translateBtn!: HTMLButtonElement;
  private progressLabel!: HTMLElement;
  private eyeBtn!: HTMLButtonElement;
  private clearBtn!: HTMLButtonElement;
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
      this.logTicker.style.color = isError ? '#f87171' : '#a5b4fc';
    }

    if (this.logListContainer) {
      this.logListContainer.innerHTML = this.logs
        .map((l) => `<div style="padding: 2px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">${l}</div>`)
        .join('');
    }
  }

  public updateStatus(translatedCount: number, totalCount: number): void {
    if (this.progressLabel) {
      this.progressLabel.textContent = `🍙 Đã dịch: ${translatedCount}/${totalCount}`;
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
        this.translateBtn.innerHTML = '✨ Bắt đầu dịch truyện';
        this.translateBtn.style.background = 'linear-gradient(135deg, #6366f1, #a855f7)';
        break;
      case 'translating':
        this.translateBtn.innerHTML = '🍡 Đang dịch... (Bấm tạm dừng)';
        this.translateBtn.style.background = 'linear-gradient(135deg, #ec4899, #f43f5e)';
        break;
      case 'paused':
        this.translateBtn.innerHTML = '▶ Tiếp tục dịch truyện';
        this.translateBtn.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
        break;
      case 'completed':
        this.translateBtn.innerHTML = '🎉 Đã dịch xong toàn bộ!';
        this.translateBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
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
      width: '46px',
      height: '46px',
      borderRadius: '50%',
      boxShadow: '0 8px 25px rgba(236, 72, 153, 0.5), 0 0 10px rgba(139, 92, 246, 0.5)',
      display: 'none',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '22px',
      cursor: 'pointer',
      userSelect: 'none',
      border: '2px solid rgba(255, 255, 255, 0.8)',
      transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
    });
    this.miniBadge.textContent = '🌸';
    this.miniBadge.title = '🌸 Mở bảng điều khiển SpeedySlate (漫画翻訳)';
    this.miniBadge.onmouseenter = () => (this.miniBadge.style.transform = 'scale(1.1)');
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
      background: 'linear-gradient(135deg, rgba(20, 20, 32, 0.95), rgba(28, 24, 60, 0.95))',
      backdropFilter: 'blur(16px)',
      color: '#ffffff',
      padding: '12px 14px',
      borderRadius: '16px',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.7), 0 0 15px rgba(236, 72, 153, 0.25)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '13px',
      display: 'flex',
      flexDirection: 'column',
      gap: '9px',
      border: '1px solid rgba(244, 114, 182, 0.35)',
      userSelect: 'none',
      width: '320px',
      maxWidth: '90vw'
    });

    // 1. HEADER ROW: Anime Badge + Title + Minimize
    const headerRow = document.createElement('div');
    headerRow.style.cssText = `
      display: flex; align-items: center; justify-content: space-between;
      border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 7px; cursor: move;
    `;
    const titleBox = document.createElement('div');
    titleBox.style.cssText = 'display: flex; align-items: center; gap: 6px; font-weight: bold; font-size: 13px;';
    titleBox.innerHTML = `
      <span style="font-size: 15px;">🌸</span>
      <span style="background: linear-gradient(90deg, #f472b6, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 800;">SpeedySlate</span>
      <span style="font-size: 10px; background: rgba(236,72,153,0.22); color: #f472b6; padding: 1px 6px; border-radius: 6px; font-weight: normal; border: 1px solid rgba(236,72,153,0.3);">漫画</span>
    `;

    const minBtn = document.createElement('button');
    minBtn.innerHTML = '✕';
    minBtn.title = 'Thu nhỏ (Bấm 🌸 để mở lại)';
    minBtn.style.cssText = `
      background: rgba(255,255,255,0.1); color: #e2e8f0; border: none; border-radius: 6px;
      padding: 2px 7px; cursor: pointer; font-size: 12px; font-weight: bold; transition: background 0.2s;
    `;
    minBtn.onmouseenter = () => (minBtn.style.background = 'rgba(239, 68, 68, 0.4)');
    minBtn.onmouseleave = () => (minBtn.style.background = 'rgba(255,255,255,0.1)');
    minBtn.onclick = () => this.toggleExpand(false);

    headerRow.appendChild(titleBox);
    headerRow.appendChild(minBtn);

    // 2. MAIN ANIME BUTTON
    this.translateBtn = document.createElement('button');
    this.translateBtn.innerHTML = '✨ Bắt đầu dịch truyện';
    this.translateBtn.style.cssText = `
      background: linear-gradient(135deg, #6366f1, #a855f7); color: #ffffff;
      border: none; border-radius: 10px; padding: 9px 12px; font-weight: bold;
      cursor: pointer; font-size: 13px; width: 100%; transition: transform 0.15s, filter 0.2s;
      box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4); text-align: center;
    `;
    this.translateBtn.onmouseenter = () => (this.translateBtn.style.filter = 'brightness(1.1)');
    this.translateBtn.onmouseleave = () => (this.translateBtn.style.filter = 'brightness(1)');
    this.translateBtn.onclick = () => {
      if (this.state === 'idle' || this.state === 'paused' || this.state === 'completed') {
        this.setState('translating');
      } else {
        this.setState('paused');
      }
      this.callbacks.onToggleTranslate();
    };

    // 3. ROW 2: Anime Progress & Action Icons
    const row2 = document.createElement('div');
    row2.style.cssText = 'display: flex; align-items: center; justify-content: space-between; gap: 8px;';

    this.progressLabel = document.createElement('span');
    this.progressLabel.textContent = '🍙 Đã dịch: 0/0';
    this.progressLabel.style.cssText = 'font-weight: bold; color: #fde047; font-size: 12px; letter-spacing: 0.3px;';

    const toolsWrapper = document.createElement('div');
    toolsWrapper.style.cssText = 'display: flex; gap: 5px;';

    this.eyeBtn = document.createElement('button');
    this.eyeBtn.title = '👁 Ẩn / Hiện chữ dịch (Xem lại tranh gốc)';
    this.eyeBtn.textContent = '👁';
    this.eyeBtn.style.cssText = `
      background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.15);
      border-radius: 7px; color: #fff; padding: 4px 8px; cursor: pointer; font-size: 13px;
    `;
    this.eyeBtn.onclick = () => {
      this.isVisible = !this.isVisible;
      this.eyeBtn.style.opacity = this.isVisible ? '1' : '0.4';
      this.callbacks.onToggleVisibility(this.isVisible);
    };

    this.clearBtn = document.createElement('button');
    this.clearBtn.title = '🧹 Xóa cache bản dịch chương này để dịch lại từ đầu';
    this.clearBtn.textContent = '🧹';
    this.clearBtn.style.cssText = `
      background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.15);
      border-radius: 7px; color: #fff; padding: 4px 8px; cursor: pointer; font-size: 13px;
    `;
    this.clearBtn.onclick = () => this.callbacks.onClearChapterCache();

    const logToggleBtn = document.createElement('button');
    logToggleBtn.title = '📜 Bật / Tắt xem nhật ký hoạt động';
    logToggleBtn.textContent = '📜';
    logToggleBtn.style.cssText = `
      background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.15);
      border-radius: 7px; color: #fff; padding: 4px 8px; cursor: pointer; font-size: 13px;
    `;
    logToggleBtn.onclick = () => {
      this.showLogHistory = !this.showLogHistory;
      this.logListContainer.style.display = this.showLogHistory ? 'block' : 'none';
    };

    toolsWrapper.appendChild(this.eyeBtn);
    toolsWrapper.appendChild(this.clearBtn);
    toolsWrapper.appendChild(logToggleBtn);

    row2.appendChild(this.progressLabel);
    row2.appendChild(toolsWrapper);

    // 4. ROW 3: LIVE LOG TICKER
    const logRow = document.createElement('div');
    logRow.style.cssText = `
      background: rgba(0, 0, 0, 0.5); border-radius: 8px; padding: 6px 9px;
      font-size: 11px; font-family: monospace; display: flex; align-items: center; gap: 6px;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      border: 1px solid rgba(244, 114, 182, 0.15);
    `;
    const logIcon = document.createElement('span');
    logIcon.textContent = '🌸';
    this.logTicker = document.createElement('span');
    this.logTicker.textContent = 'SpeedySlate sẵn sàng đồng hành cùng bạn!';
    this.logTicker.style.color = '#a5b4fc';
    logRow.appendChild(logIcon);
    logRow.appendChild(this.logTicker);

    // 5. ROW 4: EXPANDABLE LOG HISTORY
    this.logListContainer = document.createElement('div');
    this.logListContainer.style.cssText = `
      max-height: 130px; overflow-y: auto; background: rgba(0,0,0,0.65); border-radius: 8px;
      padding: 6px 9px; font-size: 10px; font-family: monospace; color: #cbd5e1; display: none;
      border: 1px solid rgba(255,255,255,0.08);
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
        if ((e.target as HTMLElement).tagName === 'BUTTON') return;
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
