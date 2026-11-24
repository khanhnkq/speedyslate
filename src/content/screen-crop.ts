import { BubbleTheme } from '../shared/types';
import { SafeMessenger } from './safe-messenger';
import { OverlayRenderer } from './overlay/overlay-renderer';

export function isScreenCropShortcut(e: {
  altKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  code: string;
  target?: EventTarget | { tagName?: string; isContentEditable?: boolean } | null;
}): boolean {
  const tgt = e.target as { tagName?: string; isContentEditable?: boolean } | null | undefined;
  const tag = (tgt?.tagName || '').toUpperCase();
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tgt?.isContentEditable) {
    return false;
  }
  return e.shiftKey && (e.altKey || e.ctrlKey) && e.code === 'KeyX';
}

export function scaleViewportCropToBitmap(
  rect: { x: number; y: number; width: number; height: number },
  dpr: number,
  maxW: number,
  maxH: number
): { sx: number; sy: number; sw: number; sh: number } {
  const scale = dpr > 0 ? dpr : 1;
  const sx = Math.max(0, Math.min(maxW - 1, Math.round(rect.x * scale)));
  const sy = Math.max(0, Math.min(maxH - 1, Math.round(rect.y * scale)));
  const sw = Math.max(1, Math.min(maxW - sx, Math.round(rect.width * scale)));
  const sh = Math.max(1, Math.min(maxH - sy, Math.round(rect.height * scale)));
  return { sx, sy, sw, sh };
}

/**
 * ScreenCropOverlay: Viewport area selector (`Alt+Shift+X`) for translating
 * protected `<canvas>` / WebGL comic viewers via `tabs.captureVisibleTab`.
 */
export class ScreenCropOverlay {
  private activeMask: HTMLElement | null = null;

  constructor(
    private getTheme: () => BubbleTheme,
    private onLog?: (msg: string, isErr?: boolean) => void
  ) {}

  public startSelection(): void {
    if (this.activeMask || typeof document === 'undefined') return;

    const mask = document.createElement('div');
    Object.assign(mask.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '2147483646',
      cursor: 'crosshair',
      background: 'rgba(0, 0, 0, 0.25)',
      userSelect: 'none'
    });

    const box = document.createElement('div');
    Object.assign(box.style, {
      position: 'fixed',
      border: '2px dashed #E52E3D',
      background: 'rgba(229, 46, 61, 0.12)',
      display: 'none',
      pointerEvents: 'none'
    });
    mask.appendChild(box);
    document.body.appendChild(mask);
    this.activeMask = mask;

    let startX = 0;
    let startY = 0;
    let dragging = false;

    const cleanup = () => {
      window.removeEventListener('keydown', onKey, true);
      mask.remove();
      this.activeMask = null;
    };

    const onKey = (ke: KeyboardEvent) => {
      if (ke.key === 'Escape') cleanup();
    };
    window.addEventListener('keydown', onKey, true);

    mask.addEventListener('mousedown', (e) => {
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      Object.assign(box.style, {
        display: 'block',
        left: `${startX}px`,
        top: `${startY}px`,
        width: '0px',
        height: '0px'
      });
    });

    mask.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      const x = Math.min(startX, e.clientX);
      const y = Math.min(startY, e.clientY);
      const w = Math.abs(e.clientX - startX);
      const h = Math.abs(e.clientY - startY);
      Object.assign(box.style, { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px` });
    });

    mask.addEventListener('mouseup', async (e) => {
      if (!dragging) return;
      dragging = false;
      const rect = {
        x: Math.min(startX, e.clientX),
        y: Math.min(startY, e.clientY),
        width: Math.abs(e.clientX - startX),
        height: Math.abs(e.clientY - startY)
      };
      cleanup();
      if (rect.width < 24 || rect.height < 24) return;
      await this.captureAndTranslate(rect);
    });
  }

  private async captureAndTranslate(rect: { x: number; y: number; width: number; height: number }): Promise<void> {
    this.onLog?.('Đang chụp vùng chọn và nhận diện thoại...');
    await new Promise((r) => requestAnimationFrame(() => r(null)));

    const cap: any = await SafeMessenger.send({ action: 'CAPTURE_VISIBLE_TAB' });
    if (!cap?.success || !cap.dataUrl) {
      this.onLog?.(cap?.error || 'Không thể chụp vùng màn hình', true);
      return;
    }

    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Không thể đọc ảnh chụp màn hình'));
      img.src = cap.dataUrl;
    });

    const { sx, sy, sw, sh } = scaleViewportCropToBitmap(
      rect,
      window.devicePixelRatio || 1,
      img.naturalWidth,
      img.naturalHeight
    );
    const canvas = document.createElement('canvas');
    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
    const cropDataUrl = canvas.toDataURL('image/png');

    const resp: any = await SafeMessenger.send({
      action: 'TRANSLATE_IMAGE',
      dataUrl: cropDataUrl,
      chapterUrl: window.location.href
    });

    if (!resp?.success || !Array.isArray(resp.dialogues) || resp.dialogues.length === 0) {
      this.onLog?.(resp?.error || 'Không tìm thấy chữ thoại trong vùng đã chọn', !resp?.success);
      return;
    }

    const holder = document.createElement('div');
    holder.className = 'speedyslate-crop-result';
    Object.assign(holder.style, {
      position: 'absolute',
      left: `${window.scrollX + rect.x}px`,
      top: `${window.scrollY + rect.y}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      zIndex: '2147483640',
      outline: '1px solid rgba(229, 46, 61, 0.55)',
      borderRadius: '4px'
    });

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.title = 'Đóng vùng dịch';
    Object.assign(closeBtn.style, {
      position: 'absolute',
      top: '-12px',
      right: '-12px',
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      border: 'none',
      background: '#111111',
      color: '#FFFFFF',
      cursor: 'pointer',
      zIndex: '60',
      fontWeight: 'bold',
      lineHeight: '24px'
    });
    closeBtn.onclick = () => holder.remove();

    document.body.appendChild(holder);
    OverlayRenderer.renderDialogues(
      holder,
      resp.dialogues,
      resp.naturalWidth || sw,
      resp.naturalHeight || sh,
      this.getTheme()
    );
    holder.appendChild(closeBtn);
    this.onLog?.(`Đã dịch ${resp.dialogues.length} câu thoại trong vùng chọn`);
  }
}
