/**
 * Smooth auto-scroll controller for webtoon reading
 * Following Single Responsibility Principle (SRP)
 */
export class AutoScroller {
  private isRunning: boolean = false;
  private speed: number = 3; // pixels per frame (1-10)
  private animId: number | null = null;
  private onStateChange?: (running: boolean) => void;
  private userPausedTimeout: number | null = null;

  constructor(speed: number = 3, onStateChange?: (running: boolean) => void) {
    this.speed = Math.max(1, Math.min(10, speed));
    this.onStateChange = onStateChange;
    this.initEventListeners();
  }

  public setSpeed(speed: number): void {
    this.speed = Math.max(1, Math.min(10, speed));
  }

  public getSpeed(): number {
    return this.speed;
  }

  public isScrolling(): boolean {
    return this.isRunning;
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.onStateChange?.(true);
    this.loop();
  }

  public pause(): void {
    if (!this.isRunning) return;
    this.isRunning = false;
    if (this.animId !== null) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    this.onStateChange?.(false);
  }

  public toggle(): void {
    if (this.isRunning) {
      this.pause();
    } else {
      this.start();
    }
  }

  private loop = (): void => {
    if (!this.isRunning) return;

    window.scrollBy(0, this.speed);

    // Stop if reached the very bottom of the document
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 5) {
      this.pause();
      return;
    }

    this.animId = requestAnimationFrame(this.loop);
  };

  /**
   * Listen to user manual scroll/wheel to pause briefly without canceling intent
   */
  private initEventListeners(): void {
    // Spacebar shortcut to play/pause auto-scroll
    window.addEventListener('keydown', (e) => {
      // Don't trigger if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        this.toggle();
      }
    });

    // Detect user manual wheel intervention
    window.addEventListener(
      'wheel',
      () => {
        if (this.isRunning) {
          // Pause briefly for 800ms then resume if still running
          this.pause();
          if (this.userPausedTimeout) clearTimeout(this.userPausedTimeout);
          this.userPausedTimeout = window.setTimeout(() => {
            this.start();
          }, 1200);
        }
      },
      { passive: true }
    );
  }
}
