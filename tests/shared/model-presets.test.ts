import { describe, expect, it } from 'vitest';
import { OCR_MODEL_PRESETS } from '../../src/shared/presets';

describe('OCR_MODEL_PRESETS', () => {
  it('includes WebGPU-compatible .onnx presets for PP-OCRv6 Multilingual and PP-OCRv5 English', () => {
    const ids = OCR_MODEL_PRESETS.map((p) => p.id);
    expect(ids).toContain('ppocr-v6-multilingual');
    expect(ids).toContain('ppocr-v5-english-fast');
    for (const preset of OCR_MODEL_PRESETS) {
      expect(preset.files.detUrl.endsWith('.onnx')).toBe(true);
      expect(preset.files.recUrl.endsWith('.onnx')).toBe(true);
      expect(preset.files.detUrl.includes('.ort')).toBe(false);
    }
  });
});
