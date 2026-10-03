export interface HudCallbacks {
  onTogglePlay: () => void;
  onSpeedChange: (speed: number) => void;
  onToggleVisibility: (visible: boolean) => void;
  onOpenSettings: () => void;
}

export class FloatingHud {
  private container: HTMLElement;
  private playBtn!: HTMLButtonElement;
  private speedInput!: HTMLInputElement;
  private progressLabel!: HTMLElement;
  private eyeBtn!: HTMLButtonElement;
  private isVisible: boolean = true;
  private callbacks: HudCallbacks;

  constructor(initialSpeed: number, callbacks: HudCallbacks) {
    this.callbacks = callbacks;
    this.container = document.createElement('div');
    this.container.id = 'speedyslate-hud-root';
    this.render(initialSpeed);
    document.body.appendChild(this.container);
  }

  public updateStatus(translatedCount: number, totalCount: number): void {
    if (this.progressLabel) {
      this.progressLabel.textContent = `📖 ${translatedCount}/${totalCount}`;
    }
  }

  public setPlaying(isPlaying: boolean): void {
    if (this.playBtn) {
      this.playBtn.innerHTML = isPlaying ? '⏸ Tạm dừng' : '▶ Tự cuộn';
      this.playBtn.style.backgroundColor = isPlaying ? '#ff4757' : '#2ed573';
    }
  }

  private render(initialSpeed: number): void {
    Object.assign(this.container.style, {
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: '999999',
      backgroundColor: 'rgba(24, 24, 27, 0.92)',
      backdropFilter: 'blur(8px)',
      color: '#ffffff',
      padding: '10px 14px',
      borderRadius: '12px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '13px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      border: '1px solid rgba(255,255,255,0.15)',
      userSelect: 'none'
    });

    // 1. Play / Pause Button
    this.playBtn = document.createElement('button');
    this.playBtn.innerHTML = '▶ Tự cuộn';
    Object.assign(this.playBtn.style, {
      backgroundColor: '#2ed573',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      padding: '6px 12px',
      fontWeight: 'bold',
      cursor: 'pointer',
      fontSize: '12px',
      transition: 'all 0.2s ease'
    });
    this.playBtn.onclick = () => this.callbacks.onTogglePlay();

    // 2. Speed Slider
    const speedWrapper = document.createElement('div');
    speedWrapper.style.display = 'flex';
    speedWrapper.style.alignItems = 'center';
    speedWrapper.style.gap = '4px';

    const speedLabel = document.createElement('span');
    speedLabel.textContent = `${initialSpeed}x`;
    speedLabel.style.fontSize = '11px';
    speedLabel.style.color = '#a4b0be';
    speedLabel.style.minWidth = '22px';

    this.speedInput = document.createElement('input');
    this.speedInput.type = 'range';
    this.speedInput.min = '1';
    this.speedInput.max = '8';
    this.speedInput.value = String(initialSpeed);
    this.speedInput.style.width = '60px';
    this.speedInput.style.cursor = 'pointer';

    this.speedInput.oninput = () => {
      const spd = Number(this.speedInput.value);
      speedLabel.textContent = `${spd}x`;
      this.callbacks.onSpeedChange(spd);
    };
    speedWrapper.appendChild(this.speedInput);
    speedWrapper.appendChild(speedLabel);

    // 3. Progress counter
    this.progressLabel = document.createElement('span');
    this.progressLabel.textContent = '📖 0/0';
    this.progressLabel.style.fontWeight = 'bold';
    this.progressLabel.style.color = '#eccc68';

    // 4. Toggle Visibility (Eye) Button
    this.eyeBtn = document.createElement('button');
    this.eyeBtn.title = 'Ẩn / Hiện bản dịch';
    this.eyeBtn.textContent = '👁';
    Object.assign(this.eyeBtn.style, {
      background: 'rgba(255,255,255,0.1)',
      border: 'none',
      borderRadius: '6px',
      color: '#ffffff',
      padding: '4px 8px',
      cursor: 'pointer',
      fontSize: '14px'
    });
    this.eyeBtn.onclick = () => {
      this.isVisible = !this.isVisible;
      this.eyeBtn.style.opacity = this.isVisible ? '1' : '0.4';
      this.callbacks.onToggleVisibility(this.isVisible);
    };

    this.container.appendChild(this.playBtn);
    this.container.appendChild(speedWrapper);
    this.container.appendChild(this.progressLabel);
    this.container.appendChild(this.eyeBtn);
  }
}
