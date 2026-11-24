import { describe, expect, it } from 'vitest';
import { MediaTargetResolver } from '../../src/content/media-target';
import { isScreenCropShortcut, scaleViewportCropToBitmap } from '../../src/content/screen-crop';

describe('MediaTargetResolver & ScreenCrop helpers (pure Node Vitest)', () => {
  it('picks highest-width candidate from srcset and extracts CSS background-image URLs', () => {
    expect(
      MediaTargetResolver.parseBestSrcsetUrl('https://cdn.ex/p1-480.webp 480w, https://cdn.ex/p1-1400.webp 1400w')
    ).toBe('https://cdn.ex/p1-1400.webp');
    expect(
      MediaTargetResolver.parseCssBackgroundUrl('url("https://cdn.ex/panel-02.jpg")')
    ).toBe('https://cdn.ex/panel-02.jpg');
  });

  it('guards Alt+Shift+X against editable inputs and scales crop rect by devicePixelRatio', () => {
    expect(
      isScreenCropShortcut({ altKey: true, ctrlKey: false, shiftKey: true, code: 'KeyX', target: { tagName: 'INPUT' } })
    ).toBe(false);
    expect(
      isScreenCropShortcut({ altKey: true, ctrlKey: false, shiftKey: true, code: 'KeyX', target: { tagName: 'DIV' } })
    ).toBe(true);
    expect(scaleViewportCropToBitmap({ x: 10, y: 20, width: 100, height: 80 }, 2, 1000, 1000)).toEqual({
      sx: 20,
      sy: 40,
      sw: 200,
      sh: 160
    });
  });
});
