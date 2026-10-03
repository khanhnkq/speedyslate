export interface HudCallbacks {
  onTogglePlay: () => void;
  onPreloadAllWithoutScroll: () => void;
  onPreloadAndReturn: () => void;
  onToggleTranslate: () => void;
  onSpeedChange: (speed: number) => void;
  onToggleVisibility: (visible: boolean) => void;
  onClearChapterCache: () => void;
}

export class FloatingHud {
  private container: HTMLElement;
  private miniBadge: HTMLElement;
  private playBtn!: HTMLButtonElement;
  private preloadBtn!: HTMLButtonElement;
  private translateBtn!: HTMLButtonElement;
  private speedInput!: HTMLInputElement;
  private progressLabel!: HTMLElement;
  private eyeBtn!: HTMLButtonElement;
  private clearBtn!: HTMLButtonElement;
  private logTicker!: HTMLElement;
  private logListContainer!: HTMLElement;

  private isVisible: boolean = true;
  private isTranslating: boolean = true;
  private showLogHistory: boolean = false;
  private logs: string[] = [];
  private callbacks: HudCallbacks;

  constructor(initialSpeed: number, callbacks: HudCallbacks) {
    this.callbacks = callbacks;

    // 1. Mini Badge (shown when minimized)
    this.miniBadge = document.createElement('div');
    this.miniBadge.id = 'speedyslate-mini-badge';
    this.initMiniBadge();

    // 2. Main HUD Container
    this.container = document.createElement('div');
    this.container.id = 'speedyslate-hud-root';
    this.render(initialSpeed);

    this.makeDraggable(this.container);

    // Ensure mounted even if DOM is not fully ready
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
    if (this.logs.length > 25) this.logs.pop();

    if (this.logTicker) {
      this.logTicker.textContent = message;
      this.logTicker.style.color = isError ? '#ff4757' : '#70a1ff';
    }

    if (this.logListContainer) {
      this.logListContainer.innerHTML = this.logs
        .map((l) => `<div style="padding: 2px 0; border-bottom: 1px solid rgba(255,255,255,0.08);">${l}</div>`)
        .join('');
    }
  }

  public updateStatus(translatedCount: number, totalCount: number): void {
    if (this.progressLabel) {
      this.progressLabel.textContent = `📖 ${translatedCount}/${totalCount}`;
    }
  }

  public setPlaying(isPlaying: boolean, isPreloading: boolean = false): void {
    if (this.playBtn) {
      this.playBtn.innerHTML = isPlaying ? '⏸ Dừng cuộn' : '▶ Tự cuộn';
      this.playBtn.style.backgroundColor = isPlaying ? '#ff4757' : '#2ed573';
    }
    if (this.preloadBtn) {
      this.preloadBtn.disabled = isPlaying && !isPreloading;
      this.preloadBtn.style.opacity = isPlaying && !isPreloading ? '0.5' : '1';
    }
  }

  public setTranslating(isTranslating: boolean): void {
    this.isTranslating = isTranslating;
    if (this.translateBtn) {
      this.translateBtn.innerHTML = isTranslating ? '⚡ Đang dịch' : '⏸ Ngưng dịch';
      this.translateBtn.style.backgroundColor = isTranslating ? '#3742fa' : '#747d8c';
    }
  }

  private initMiniBadge(): void {
    Object.assign(this.miniBadge.style, {
      position: 'fixed',
      bottom: '90px',
      right: '20px',
      zIndex: '2147483647',
      backgroundColor: '#2563eb',
      color: '#ffffff',
      width: '46px',
      height: '46px',
      borderRadius: '50%',
      boxShadow: '0 8px 25px rgba(37,99,235,0.6)',
      display: 'none',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '22px',
      cursor: 'pointer',
      userSelect: 'none',
      border: '2px solid #ffffff'
    });
    this.miniBadge.textContent = '⚡';
    this.miniBadge.title = 'Mở bảng điều khiển SpeedySlate';
    this.miniBadge.onclick = () => this.toggleExpand(true);
  }

  private toggleExpand(expand: boolean): void {
    this.container.style.display = expand ? 'flex' : 'none';
    this.miniBadge.style.display = expand ? 'none' : 'flex';
  }

  private render(initialSpeed: number): void {
    Object.assign(this.container.style, {
      position: 'fixed',
      bottom: '90px', // Placed above Toonhey's bottom-right AUTO button!
      right: '20px',
      zIndex: '2147483647', // Maximum 32-bit z-index to stay above all site UI
      backgroundColor: 'rgba(18, 18, 22, 0.96)',
      backdropFilter: 'blur(12px)',
      color: '#ffffff',
      padding: '12px 14px',
      borderRadius: '14px',
      boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '13px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      border: '1px solid rgba(255,255,255,0.22)',
      userSelect: 'none',
      width: '340px',
      maxWidth: '90vw'
    });

    // HEADER ROW: Title + Drag Handle + Minimize
    const headerRow = document.createElement('div');
    headerRow.style.cssText = `
      display: flex; align-items: center; justify-content: space-between;
      border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 6px; cursor: move;
    `;
    const titleBox = document.createElement('div');
    titleBox.style.cssText = 'display: flex; align-items: center; gap: 6px; font-weight: bold; font-size: 13px; color: #70a1ff;';
    titleBox.innerHTML = '<span>⚡</span><span>SpeedySlate</span>';

    const minBtn = document.createElement('button');
    minBtn.innerHTML = '✕';
    minBtn.title = 'Thu nhỏ (Bấm ⚡ để mở lại)';
    minBtn.style.cssText = `
      background: rgba(255,255,255,0.12); color: #ced6e0; border: none; border-radius: 6px;
      padding: 2px 7px; cursor: pointer; font-size: 12px; font-weight: bold;
    `;
    minBtn.onclick = () => this.toggleExpand(false);

    headerRow.appendChild(titleBox);
    headerRow.appendChild(minBtn);

    // ROW 1: Action Buttons (Translate, Auto-scroll, Preload & Return)
    const row1 = document.createElement('div');
    row1.style.cssText = 'display: flex; align-items: center; gap: 6px; flex-wrap: wrap;';

    this.translateBtn = document.createElement('button');
    this.translateBtn.innerHTML = '⚡ Đang dịch';
    this.translateBtn.style.cssText = `
      background-color: #3742fa; color: #fff; border: none; border-radius: 8px;
      padding: 6px 10px; font-weight: bold; cursor: pointer; font-size: 12px; flex: 1;
    `;
    this.translateBtn.onclick = () => {
      this.isTranslating = !this.isTranslating;
      this.setTranslating(this.isTranslating);
      this.callbacks.onToggleTranslate();
    };

    this.playBtn = document.createElement('button');
    this.playBtn.innerHTML = '▶ Tự cuộn';
    this.playBtn.style.cssText = `
      background-color: #2ed573; color: #fff; border: none; border-radius: 8px;
      padding: 6px 10px; font-weight: bold; cursor: pointer; font-size: 12px; flex: 1;
    `;
    this.playBtn.onclick = () => this.callbacks.onTogglePlay();

    this.preloadBtn = document.createElement('button');
    this.preloadBtn.innerHTML = '🔄 Nạp & về đầu';
    this.preloadBtn.title = 'Cuộn nhanh xuống đáy để nạp tất cả ảnh của chương, rồi tự quay lại đầu trang để đọc';
    this.preloadBtn.style.cssText = `
      background-color: #ffa502; color: #fff; border: none; border-radius: 8px;
      padding: 6px 10px; font-weight: bold; cursor: pointer; font-size: 12px; flex: 1.2;
    `;
    this.preloadBtn.onclick = () => this.callbacks.onPreloadAndReturn();

    // Button: Force load all without scrolling!
    const loadAllBtn = document.createElement('button');
    loadAllBtn.innerHTML = '📥 Nạp hết (Ko cuộn)';
    loadAllBtn.title = 'Kích hoạt nạp toàn bộ ảnh và dịch ngầm ngay tại chỗ, không cần cuộn trang!';
    loadAllBtn.style.cssText = `
      background-color: #8854d0; color: #fff; border: none; border-radius: 8px;
      padding: 6px 10px; font-weight: bold; cursor: pointer; font-size: 12px; flex: 1.2;
    `;
    loadAllBtn.onclick = () => this.callbacks.onPreloadAllWithoutScroll();

    row1.appendChild(this.translateBtn);
    row1.appendChild(loadAllBtn);
    row1.appendChild(this.playBtn);
    row1.appendChild(this.preloadBtn);

    // ROW 2: Speed + Progress + Tool Buttons
    const row2 = document.createElement('div');
    row2.style.cssText = 'display: flex; align-items: center; justify-content: space-between; gap: 8px;';

    const speedWrapper = document.createElement('div');
    speedWrapper.style.cssText = 'display: flex; align-items: center; gap: 3px;';

    const speedLabel = document.createElement('span');
    speedLabel.textContent = `${initialSpeed}x`;
    speedLabel.style.cssText = 'font-size: 11px; color: #a4b0be; min-width: 20px;';

    this.speedInput = document.createElement('input');
    this.speedInput.type = 'range';
    this.speedInput.min = '1';
    this.speedInput.max = '8';
    this.speedInput.value = String(initialSpeed);
    this.speedInput.style.cssText = 'width: 50px; cursor: pointer;';

    this.speedInput.oninput = () => {
      const spd = Number(this.speedInput.value);
      speedLabel.textContent = `${spd}x`;
      this.callbacks.onSpeedChange(spd);
    };
    speedWrapper.appendChild(this.speedInput);
    speedWrapper.appendChild(speedLabel);

    this.progressLabel = document.createElement('span');
    this.progressLabel.textContent = '📖 0/0';
    this.progressLabel.style.cssText = 'font-weight: bold; color: #eccc68; font-size: 12px;';

    const toolsWrapper = document.createElement('div');
    toolsWrapper.style.cssText = 'display: flex; gap: 4px;';

    this.eyeBtn = document.createElement('button');
    this.eyeBtn.title = 'Ẩn / Hiện bản dịch';
    this.eyeBtn.textContent = '👁';
    this.eyeBtn.style.cssText = 'background: rgba(255,255,255,0.12); border: none; border-radius: 6px; color: #fff; padding: 4px 7px; cursor: pointer;';
    this.eyeBtn.onclick = () => {
      this.isVisible = !this.isVisible;
      this.eyeBtn.style.opacity = this.isVisible ? '1' : '0.4';
      this.callbacks.onToggleVisibility(this.isVisible);
    };

    this.clearBtn = document.createElement('button');
    this.clearBtn.title = 'Xóa cache bản dịch của chương này để dịch lại';
    this.clearBtn.textContent = '🧹';
    this.clearBtn.style.cssText = 'background: rgba(255,255,255,0.12); border: none; border-radius: 6px; color: #fff; padding: 4px 7px; cursor: pointer;';
    this.clearBtn.onclick = () => this.callbacks.onClearChapterCache();

    const logToggleBtn = document.createElement('button');
    logToggleBtn.title = 'Bật / Tắt xem lịch sử log';
    logToggleBtn.textContent = '📋';
    logToggleBtn.style.cssText = 'background: rgba(255,255,255,0.12); border: none; border-radius: 6px; color: #fff; padding: 4px 7px; cursor: pointer;';
    logToggleBtn.onclick = () => {
      this.showLogHistory = !this.showLogHistory;
      this.logListContainer.style.display = this.showLogHistory ? 'block' : 'none';
    };

    toolsWrapper.appendChild(this.eyeBtn);
    toolsWrapper.appendChild(this.clearBtn);
    toolsWrapper.appendChild(logToggleBtn);

    row2.appendChild(speedWrapper);
    row2.appendChild(this.progressLabel);
    row2.appendChild(toolsWrapper);

    // ROW 3: LIVE LOG TICKER
    const logRow = document.createElement('div');
    logRow.style.cssText = `
      background: rgba(0, 0, 0, 0.45); border-radius: 6px; padding: 5px 8px;
      font-size: 11px; font-family: monospace; display: flex; align-items: center; gap: 6px;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap; border: 1px solid rgba(255,255,255,0.06);
    `;
    const logIcon = document.createElement('span');
    logIcon.textContent = '📡';
    this.logTicker = document.createElement('span');
    this.logTicker.textContent = 'SpeedySlate sẵn sàng';
    this.logTicker.style.color = '#70a1ff';
    logRow.appendChild(logIcon);
    logRow.appendChild(this.logTicker);

    // ROW 4: EXPANDABLE LOG HISTORY
    this.logListContainer = document.createElement('div');
    this.logListContainer.style.cssText = `
      max-height: 120px; overflow-y: auto; background: rgba(0,0,0,0.55); border-radius: 6px;
      padding: 6px 8px; font-size: 10px; font-family: monospace; color: #ced6e0; display: none;
    `;

    this.container.appendChild(headerRow);
    this.container.appendChild(row1);
    this.container.appendChild(row2);
    this.container.appendChild(logRow);
    this.container.appendChild(this.logListContainer);
  }

  /**
   * Draggable HUD implementation
   */
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
