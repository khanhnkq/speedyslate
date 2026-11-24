import { describe, expect, it } from 'vitest';
import { TextAutoFitter } from '../../src/content/overlay/text-auto-fitter';

describe('TextAutoFitter.fitDialogue elliptical chord wrapping', () => {
  const monoMeasure = (s: string, px: number) => s.length * px * 0.6;

  it('wraps top and bottom lines narrower than middle lines inside an elliptical bubble', () => {
    const res = TextAutoFitter.fitDialogue(
      140,
      130,
      'ANH KHÔNG THỂ NÀO TIN ĐƯỢC CHUYỆN NÀY ĐANG XẢY RA NGAY LÚC NÀY',
      { elliptical: true, measureWidth: monoMeasure }
    );
    expect(res.lines.length).toBeGreaterThanOrEqual(3);
    const firstW = monoMeasure(res.lines[0], res.fontSize);
    const midW = monoMeasure(res.lines[Math.floor(res.lines.length / 2)], res.fontSize);
    expect(firstW).toBeLessThanOrEqual(midW + 4);
    expect(res.fontSize).toBeGreaterThanOrEqual(9);
  });

  it('scales short exclamations up in large shout bubbles', () => {
    const shout = TextAutoFitter.fitDialogue(180, 140, 'DỪNG LẠI!', {
      elliptical: true,
      measureWidth: monoMeasure
    });
    expect(shout.fontSize).toBeGreaterThanOrEqual(18);
    expect(shout.lines).toEqual(['DỪNG LẠI!']);
  });
});
