import { CompanionConnectionStatus } from './companion-types';
import { CompanionIcons } from './companion-icons';
import { CompanionStyles } from './companion-styles';

export interface BubbleCallbacks {
  onToggleExpand: () => void;
}

/**
 * Draggable Floating Companion Bubble
 * Aesthetic: Minimalist Anime Glassmorphism (52x52px circular orb)
 * Following Single Responsibility Principle (SRP)
 */
export class CompanionBubble {
  private el: HTMLElement;
  private iconEl: HTMLElement;
  private ringEl: HTMLElement;
  private callbacks: BubbleCallbacks;
  private status: CompanionConnectionStatus = 'idle';

  // Drag tracking
  private isDragging: boolean = false;
  private startX: number = 0;
  private startY: number = 0;
  private initialLeft: number = 0;
  private initialTop: number = 0;
  private hasMoved: boolean = false;

  constructor(callbacks: BubbleCallbacks) {
    this.callbacks = callbacks;
    CompanionStyles.inject();

    this.el = document.createElement('div');
    this.el.id = 'speedyslate-companion-bubble';
    this.el.title = 'Speedy Companion - Bấm để trò chuyện / đàm thoại cùng AI';

    this.ringEl = document.createElement('div');
    this.ringEl.className = 'companion-bubble-ring';

    this.iconEl = document.createElement('div');
    this.iconEl.className = 'companion-bubble-icon';
    this.iconEl.innerHTML = CompanionIcons.sparkles;

    this.el.appendChild(this.ringEl);
    this.el.appendChild(this.iconEl);

    this.setupEvents();
    this.restorePosition();
    document.body.appendChild(this.el);
    this.updateStatus(this.status);
  }

  public setStatus(status: CompanionConnectionStatus): void {
    this.status = status;
    this.updateStatus(status);
  }

  public setVisible(visible: boolean): void {
    this.el.style.display = visible ? 'flex' : 'none';
  }

  public getElement(): HTMLElement {
    return this.el;
  }

  public destroy(): void {
    this.el.remove();
  }

  private updateStatus(status: CompanionConnectionStatus): void {
    this.el.classList.remove('status-idle', 'status-connecting', 'status-connected', 'status-listening', 'status-speaking', 'status-error');
    this.el.classList.add(`status-${status}`);

    if (status === 'speaking') {
      this.iconEl.innerHTML = CompanionIcons.avatar;
    } else if (status === 'listening') {
      this.iconEl.innerHTML = CompanionIcons.micOn;
    } else {
      this.iconEl.innerHTML = CompanionIcons.sparkles;
    }
  }

  private setupEvents(): void {
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      this.isDragging = true;
      this.hasMoved = false;
      this.startX = clientX;
      this.startY = clientY;

      const rect = this.el.getBoundingClientRect();
      this.initialLeft = rect.left;
      this.initialTop = rect.top;

      this.el.style.transition = 'none';

      window.addEventListener('mousemove', onPointerMove, { passive: false });
      window.addEventListener('mouseup', onPointerUp);
      window.addEventListener('touchmove', onPointerMove, { passive: false });
      window.addEventListener('touchend', onPointerUp);
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!this.isDragging) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const dx = clientX - this.startX;
      const dy = clientY - this.startY;

      if (Math.hypot(dx, dy) > 5) {
        this.hasMoved = true;
        if (e.cancelable) e.preventDefault();
      }

      if (this.hasMoved) {
        let newLeft = this.initialLeft + dx;
        let newTop = this.initialTop + dy;

        // Clamp to viewport
        const maxLeft = window.innerWidth - 64;
        const maxTop = window.innerHeight - 64;
        newLeft = Math.max(12, Math.min(maxLeft, newLeft));
        newTop = Math.max(12, Math.min(maxTop, newTop));

        this.el.style.left = `${newLeft}px`;
        this.el.style.top = `${newTop}px`;
        this.el.style.right = 'auto';
        this.el.style.bottom = 'auto';
      }
    };

    const onPointerUp = () => {
      if (!this.isDragging) return;
      this.isDragging = false;

      this.el.style.transition = 'transform 0.15s ease, box-shadow 0.2s ease';

      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);

      if (this.hasMoved) {
        // Save position
        const rect = this.el.getBoundingClientRect();
        try {
          localStorage.setItem('speedyslate_companion_pos', JSON.stringify({
            x: rect.left,
            y: rect.top
          }));
        } catch {}
      } else {
        // Trigger Click Toggle
        this.callbacks.onToggleExpand();
      }
    };

    this.el.addEventListener('mousedown', onPointerDown);
    this.el.addEventListener('touchstart', onPointerDown, { passive: false });
  }

  private restorePosition(): void {
    try {
      const saved = localStorage.getItem('speedyslate_companion_pos');
      if (saved) {
        const { x, y } = JSON.parse(saved);
        const maxLeft = window.innerWidth - 64;
        const maxTop = window.innerHeight - 64;
        this.el.style.left = `${Math.max(12, Math.min(maxLeft, x))}px`;
        this.el.style.top = `${Math.max(12, Math.min(maxTop, y))}px`;
        this.el.style.right = 'auto';
        this.el.style.bottom = 'auto';
        return;
      }
    } catch {}

    // Default: bottom-right
    this.el.style.bottom = '78px';
    this.el.style.right = '24px';
  }
}
