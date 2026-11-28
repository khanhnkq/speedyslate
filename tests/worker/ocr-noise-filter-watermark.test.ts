import { describe, expect, it } from 'vitest';
import { OcrNoiseFilter } from '../../src/worker/ocr-noise-filter';
import { DialogueItem } from '../../src/shared/types';

const mk = (id: string, text: string, x = 100, y = 100, w = 300, h = 24): DialogueItem => ({
  id,
  originalText: text,
  box: { x, y, width: w, height: h },
  confidence: 0.96
});

describe('OcrNoiseFilter watermark & site banner filtering', () => {
  it('filters Read Manga Online / Free site watermarks (with or without spaces)', () => {
    const banners = [
      mk('1', 'MANGA18FX.COM', 51, 69, 500, 71),
      mk('2', 'GA18FX.COM', 209, 84, 323, 39),
      mk('3', 'Read Manga Online in English Free', 220, 149, 418, 47),
      mk('4', 'ReadMangaOnlineinEnglishFree', 232, 161, 389, 20),
      mk('5', 'Read Manhwa Free Online', 100, 200, 320, 24),
      mk('6', 'Read Comics Online Free', 100, 250, 320, 24),
      mk('7', 'Read Solo Leveling Manga Online Free', 100, 300, 380, 24),
      mk('8', 'ReadMangaOnlineFree', 100, 350, 280, 24),
      mk('9', 'Read latest chapters at asurascans.com', 100, 400, 350, 24),
      mk('10', 'Read Webtoon Online', 100, 450, 260, 24)
    ];

    const kept = OcrNoiseFilter.filterRawLines(banners, 800, 1600);
    expect(kept).toEqual([]);
  });

  it('preserves genuine comic dialogue containing words like read, manga, or free', () => {
    const dialogue = [
      mk('d1', 'I read manga at home.'),
      mk('d2', 'Read this book free'),
      mk('d3', "Let's read manga online together"),
      mk('d4', 'Read that carefully!'),
      mk('d5', 'Did you read it at school?')
    ];

    const kept = OcrNoiseFilter.filterRawLines(dialogue, 800, 1600);
    expect(kept.map((item) => item.originalText)).toEqual(dialogue.map((item) => item.originalText));
  });

  it('strips trailing domain or read-online banner suffixes from genuine dialogue', () => {
    const items = [
      mk('t1', 'RUN FOR YOUR LIFE! manga18fx.com', 50, 100, 320, 24),
      mk('t2', 'WAIT FOR ME! Read Manga Online in English Free', 50, 200, 420, 24)
    ];

    const kept = OcrNoiseFilter.filterRawLines(items, 800, 1600);
    expect(kept.map((item) => item.originalText)).toEqual([
      'RUN FOR YOUR LIFE!',
      'WAIT FOR ME!'
    ]);
    expect(kept[0].box.width).toBeLessThan(320);
    expect(kept[1].box.width).toBeLessThan(420);
  });
});
