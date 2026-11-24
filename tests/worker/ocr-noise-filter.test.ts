import { describe, expect, it } from 'vitest';
import { OcrNoiseFilter } from '../../src/worker/ocr-noise-filter';
import { DialogueItem } from '../../src/shared/types';

const mk = (id: string, text: string, x: number, y: number, w: number, h: number, vert = false): DialogueItem => ({
  id,
  originalText: text,
  box: { x, y, width: w, height: h },
  confidence: 0.85,
  isVertical: vert
});

describe('OcrNoiseFilter', () => {
  it('drops thought-bubble circle tails, speedlines, and scanlator watermark lines while stripping trailing URLs', () => {
    const items = [
      mk('1', 'o O ○', 100, 100, 30, 40),
      mk('2', '一丨─', 120, 200, 40, 20),
      mk('3', 'Read first at toonhey.com', 50, 10, 400, 28),
      mk('4', 'やめろ！ colamanga.com', 200, 300, 180, 32)
    ];
    const kept = OcrNoiseFilter.filterRawLines(items, 800, 1200);
    expect(kept.map((k) => k.originalText)).toEqual(['やめろ！']);
    expect(kept[0].box.width).toBeLessThan(180);
  });

  it('suppresses tiny kana furigana alongside a Kanji parent but keeps standalone kana dialogue', () => {
    const kanjiParent = mk('p', '約束の場所', 500, 100, 36, 220, true);
    const furigana = mk('f', 'やくそく', 538, 105, 14, 95, true);
    const realKanaShout = mk('s', 'えっ', 200, 400, 34, 68, true);
    const kept = OcrNoiseFilter.filterRawLines([kanjiParent, furigana, realKanaShout], 800, 1200);
    expect(kept.map((k) => k.id)).toEqual(['p', 's']);
  });
});
