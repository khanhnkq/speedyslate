export interface HudCallbacks {
  onTogglePlay: () => void;
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

    // Persistent floating mini button (visible when HUD is minimized)
    this.miniBadge = document.createElement('div');
    this.miniBadge.id = 'speedyslate-mini-badge';
    this.initMiniBadge();

    // Main Floating HUD container
    this.container = document.createElement('div');
    this.container.id = 'speedyslate-hud-root';
    this.render(initialSpeed);

    document.body.appendChild(this.miniBadge);
    document.body.appendChild(this.container);
  }

  public log(message: string, isError: boolean = false): void {
    const time = new Date().toLocaleTimeString('vi-VN', { hour12: false });
    const formatted = `[${time}] ${message}`;
    this.logs.unshift(formatted);
    if (this.logs.length > 20) this.logs.pop();

    if (this.logTicker) {
      this.logTicker.textContent = message;
      this.logTicker.style.color = isError ? '#ff6b81' : '#70a1ff';
    }

    if (this.logListContainer) {
      this.logListContainer.innerHTML = this.logs
        .map((l) => `<div style="padding: 2px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">${l}</div>`)
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
      bottom: '24px',
      right: '24px',
      zIndex: '999998',
      backgroundColor: '#2563eb',
      color: '#ffffff',
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      boxShadow: '0 6px 20px rgba(37,99,235,0.5)',
      display: 'none',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      cursor: 'pointer',
      userSelect: 'none',
      transition: 'transform 0.2s ease'
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
      bottom: '24px',
      right: '24px',
      zIndex: '999999',
      backgroundColor: 'rgba(20, 20, 24, 0.96)',
      backdropFilter: 'blur(12px)',
      color: '#ffffff',
      padding: '12px 14px',
      borderRadius: '14px',
      boxShadow: '0 10px 35px rgba(0,0,0,0.5)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '13px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      border: '1px solid rgba(255,255,255,0.18)',
      userSelect: 'none',
      minWidth: '340px',
      maxWidth: '420px'
    });

    // ROW 1: Controls (Translate, Auto-scroll, Preload & Return, Minimize)
    const row1 = document.createElement('div');
    row1.style.display = 'flex';
    row1.style.alignItems = 'center';
    row1.style.gap = '6px';
    row1.style.flexWrap = 'wrap';

    // 1. Translate Toggle Button
    this.translateBtn = document.createElement('button');
    this.translateBtn.innerHTML = '⚡ Đang dịch';
    this.translateBtn.style.cssText = `
      background-color: #3742fa; color: #fff; border: none; border-radius: 8px;
      padding: 6px 10px; font-weight: bold; cursor: pointer; font-size: 12px;
    `;
    this.translateBtn.onclick = () => {
      this.isTranslating = !this.isTranslating;
      this.setTranslating(this.isTranslating);
      this.callbacks.onToggleTranslate();
    };

    // 2. Auto-scroll reading button
    this.playBtn = document.createElement('button');
    this.playBtn.innerHTML = '▶ Tự cuộn';
    this.playBtn.style.cssText = `
      background-color: #2ed573; color: #fff; border: none; border-radius: 8px;
      padding: 6px 10px; font-weight: bold; cursor: pointer; font-size: 12px;
    `;
    this.playBtn.onclick = () => this.callbacks.onTogglePlay();

    // 3. Preload to bottom and return button
    this.preloadBtn = document.createElement('button');
    this.preloadBtn.innerHTML = '🔄 Cuộn nạp & về đầu';
    this.preloadBtn.title = 'Tự cuộn nhanh xuống đáy để nạp toàn bộ ảnh, sau đó tự quay lại trang đầu';
    this.preloadBtn.style.cssText = `
      background-color: #ffa502; color: #fff; border: none; border-radius: 8px;
      padding: 6px 10px; font-weight: bold; cursor: pointer; font-size: 12px;
    `;
    this.preloadBtn.onclick = () => this.callbacks.onPreloadAndReturn();

    // Minimize Button
    const minBtn = document.createElement('button');
    minBtn.innerHTML = '✕';
    minBtn.title = 'Thu nhỏ thanh điều khiển';
    minBtn.style.cssText = `
      background: rgba(255,255,255,0.1); color: #a4b0be; border: none; border-radius: 6px;
      padding: 4px 8px; cursor: pointer; font-size: 12px; margin-left: auto;
    `;
    minBtn.onclick = () => this.toggleExpand(false);

    row1.appendChild(this.translateBtn);
    row1.appendChild(this.playBtn);
    row1.appendChild(this.preloadBtn);
    row1.appendChild(minBtn);

    // ROW 2: Settings (Speed, Progress, Visibility, Clear cache)
    const row2 = document.createElement('div');
    row2.style.display = 'flex';
    row2.style.alignItems = 'center';
    row2.style.justifyContent = 'space-between';
    row2.style.gap = '8px';

    // Speed wrapper
    const speedWrapper = document.createElement('div');
    speedWrapper.style.display = 'flex';
    speedWrapper.style.alignItems = 'center';
    speedWrapper.style.gap = '3px';

    const speedLabel = document.createElement('span');
    speedLabel.textContent = `${initialSpeed}x`;
    speedLabel.style.fontSize = '11px';
    speedLabel.style.color = '#a4b0be';

    this.speedInput = document.createElement('input');
    this.speedInput.type = 'range';
    this.speedInput.min = '1';
    this.speedInput.max = '8';
    this.speedInput.value = String(initialSpeed);
    this.speedInput.style.width = '50px';
    this.speedInput.style.cursor = 'pointer';

    this.speedInput.oninput = () => {
      const spd = Number(this.speedInput.value);
      speedLabel.textContent = `${spd}x`;
      this.callbacks.onSpeedChange(spd);
    };
    speedWrapper.appendChild(this.speedInput);
    speedWrapper.appendChild(speedLabel);

    // Progress counter
    this.progressLabel = document.createElement('span');
    this.progressLabel.textContent = '📖 0/0';
    this.progressLabel.style.fontWeight = 'bold';
    this.progressLabel.style.color = '#eccc68';
    this.progressLabel.style.fontSize = '12px';

    // Right tools (Eye, Broom, Log toggle)
    const toolsWrapper = document.createElement('div');
    toolsWrapper.style.display = 'flex';
    toolsWrapper.style.gap = '4px';

    this.eyeBtn = document.createElement('button');
    this.eyeBtn.title = 'Ẩn / Hiện bản dịch';
    this.eyeBtn.textContent = '👁';
    this.eyeBtn.style.cssText = `background: rgba(255,255,255,0.1); border: none; border-radius: 6px; color: #fff; padding: 4px 6px; cursor: pointer;`;
    this.eyeBtn.onclick = () => {
      this.isVisible = !this.isVisible;
      this.eyeBtn.style.opacity = this.isVisible ? '1' : '0.4';
      this.callbacks.onToggleVisibility(this.isVisible);
    };

    this.clearBtn = document.createElement('button');
    this.clearBtn.title = 'Xóa cache bản dịch của chương này để dịch lại';
    this.clearBtn.textContent = '🧹';
    this.clearBtn.style.cssText = `background: rgba(255,255,255,0.1); border: none; border-radius: 6px; color: #fff; padding: 4px 6px; cursor: pointer;`;
    this.clearBtn.onclick = () => this.callbacks.onClearChapterCache();

    const logToggleBtn = document.createElement('button');
    logToggleBtn.title = 'Bật / Tắt xem lịch sử log';
    logToggleBtn.textContent = '📋';
    logToggleBtn.style.cssText = `background: rgba(255,255,255,0.1); border: none; border-radius: 6px; color: #fff; padding: 4px 6px; cursor: pointer;`;
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
      background: rgba(0, 0, 0, 0.4); border-radius: 6px; padding: 5px 8px;
      font-size: 11px; font-family: monospace; display: flex; align-items: center; gap: 6px;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    `;
    const logIcon = document.createElement('span');
    logIcon.textContent = '📡';
    this.logTicker = document.createElement('span');
    this.logTicker.textContent = 'SpeedySlate sẵn sàng';
    this.logTicker.style.color = '#70a1ff';
    logRow.appendChild(logIcon);
    logRow.appendChild(this.logTicker);

    // ROW 4: EXPANDABLE LOG LIST (COLLAPSIBLE)
    this.logListContainer = document.createElement('div');
    this.logListContainer.style.cssText = `
      max-height: 120px; overflow-y: auto; background: rgba(0,0,0,0.5); border-radius: 6px;
      padding: 6px 8px; font-size: 10px; font-family: monospace; color: #ced6e0; display: none;
    `;

    this.container.appendChild(row1);
    this.container.appendChild(row2);
    this.container.appendChild(logRow);
    this.container.appendChild(this.logListContainer);
  }
}
