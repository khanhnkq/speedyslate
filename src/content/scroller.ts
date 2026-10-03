/**
 * Smooth auto-scroll controller for webtoon reading
 * Supports both normal reading scroll and fast preload-to-bottom-then-return
 * Following Single Responsibility Principle (SRP)
 */
export class AutoScroller {
  private isRunning: boolean = false;
  private isPreloading: boolean = false;
  private speed: number = 3; // pixels per frame (1-10)
  private animId: number | null = null;
  private onStateChange?: (running: boolean, isPreloading?: boolean) => void;
  private userPausedTimeout: number | null = null;

  constructor(speed: number = 3, onStateChange?: (running: boolean, isPreloading?: boolean) => void) {
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

  public isPreloadMode(): boolean {
    return this.isPreloading;
  }

  /**
   * Normal smooth auto-scroll for reading
   */
  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.isPreloading = false;
    this.onStateChange?.(true, false);
    this.loop();
  }

  public pause(): void {
    if (!this.isRunning) return;
    this.isRunning = false;
    this.isPreloading = false;
    if (this.animId !== null) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    this.onStateChange?.(false, false);
  }

  public toggle(): void {
    if (this.isRunning) {
      this.pause();
    } else {
      this.start();
    }
  }

  /**
   * Fast auto-scroll to bottom to trigger lazy-load on all images,
   * then automatically scrolls back to the top of the chapter!
   */
  public preloadToBottomAndReturn(onComplete?: () => void): void {
    if (this.isRunning) this.pause();

    this.isRunning = true;
    this.isPreloading = true;
    this.onStateChange?.(true, true);

    const fastSpeed = 22; // Pixels per frame for rapid image triggering

    const preloadLoop = () => {
      if (!this.isRunning || !this.isPreloading) return;

      window.scrollBy(0, fastSpeed);

      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 20;
      if (atBottom) {
        this.pause();
        // Return back to top of the chapter smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
        onComplete?.();
        return;
      }

      this.animId = requestAnimationFrame(preloadLoop);
    };

    this.animId = requestAnimationFrame(preloadLoop);
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
        if (this.isRunning && !this.isPreloading) {
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
