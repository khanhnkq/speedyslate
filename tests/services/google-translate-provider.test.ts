import { describe, expect, it, vi } from 'vitest';
import { GoogleFreeProvider } from '../../src/services/translation/google-translate-provider';
import { MultiProviderRotator } from '../../src/services/translation/multi-provider-rotator';
import { DEFAULT_SETTINGS } from '../../src/shared/presets';

describe('GoogleFreeProvider & MultiProviderRotator fallback', () => {
  it('maps human language names to ISO codes and preserves line alignment via separator', async () => {
    expect(GoogleFreeProvider.mapLangCode('Tiếng Việt')).toBe('vi');
    expect(GoogleFreeProvider.mapLangCode('Japanese')).toBe('ja');
    expect(GoogleFreeProvider.mapLangCode('Chinese Simplified')).toBe('zh-CN');
    expect(GoogleFreeProvider.mapLangCode('auto')).toBe('auto');

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify([
            [
              ['Xin chào\n', 'Hello\n'],
              ['⟪991⟫\n', '⟪991⟫\n'],
              ['Tạm biệt', 'Bye']
            ]
          ]),
          { status: 200 }
        )
      )
    );
    const p = new GoogleFreeProvider();
    const out = await p.translateDialogues(['Hello', 'Bye'], 'Tiếng Việt', 'English');
    expect(out).toEqual(['Xin chào', 'Tạm biệt']);
    vi.unstubAllGlobals();
  });

  it('rescues zero-API-key configurations automatically via GoogleFreeProvider when enableFreeFallback is true', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(
        async () => new Response(JSON.stringify([[['Được cứu hộ', 'Rescued']]]), { status: 200 })
      )
    );
    const rotator = new MultiProviderRotator({
      ...DEFAULT_SETTINGS,
      enableFreeFallback: true
    });
    const out = await rotator.translateDialogues(['Rescued'], 'Tiếng Việt', 'English');
    expect(out).toEqual(['Được cứu hộ']);
    expect(rotator.lastActiveProviderType).toBe('google_free');
    vi.unstubAllGlobals();
  });
});
