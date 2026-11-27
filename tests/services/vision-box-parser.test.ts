import { describe, it, expect } from 'vitest';
import { VisionBoxParser } from '../../src/services/translation/vision-box-parser';

describe('VisionBoxParser — mergeAdjacentBubbles', () => {
  it('keeps two stacked speech bubbles 30 normalized units apart on a 2500px strip separate', () => {
    const raw = [
      {
        original_text: 'Top bubble text',
        translation: 'Lời thoại trên',
        box_2d: [100, 200, 180, 600],
        background: 'light'
      },
      {
        original_text: 'Bottom bubble text',
        translation: 'Lời thoại dưới',
        box_2d: [210, 200, 290, 600], // 30 normalized units = 75px gap on 2500px strip
        background: 'light'
      }
    ];

    const out = VisionBoxParser.parseItems(raw, 1000, 2500);
    expect(out).toHaveLength(2);
    expect(out[0].translatedText).toBe('Lời thoại trên');
    expect(out[1].translatedText).toBe('Lời thoại dưới');
  });

  it('merges two overlapping/touching fragments inside the same speech bubble', () => {
    const raw = [
      {
        original_text: 'First sentence',
        translation: 'Câu đầu tiên',
        box_2d: [100, 200, 150, 600],
        background: 'light'
      },
      {
        original_text: 'Second sentence',
        translation: 'Câu thứ hai',
        box_2d: [148, 220, 198, 580], // yGap <= 0, aligned centers & strong xOverlap
        background: 'light'
      }
    ];

    const out = VisionBoxParser.parseItems(raw, 1000, 2500);
    expect(out).toHaveLength(1);
    expect(out[0].originalText).toBe('First sentence Second sentence');
    expect(out[0].translatedText).toBe('Câu đầu tiên\nCâu thứ hai');
    expect(out[0].normBox).toEqual({ ymin: 100, xmin: 200, ymax: 198, xmax: 600 });
  });
});
