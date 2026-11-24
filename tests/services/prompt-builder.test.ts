import { describe, it, expect } from 'vitest';
import { PromptBuilder } from '../../src/services/translation/prompt-builder';

describe('PromptBuilder.parseGlossary', () => {
  it('parses Term = Translation lines, skipping blanks and comments', () => {
    expect(PromptBuilder.parseGlossary('A = B\n#x\nC=D')).toEqual([
      ['A', 'B'],
      ['C', 'D']
    ]);
  });

  it('returns empty for missing/invalid input', () => {
    expect(PromptBuilder.parseGlossary(undefined)).toEqual([]);
    expect(PromptBuilder.parseGlossary('no equals here\n= bad')).toEqual([]);
  });
});

describe('PromptBuilder.buildDialogue (Keyed JSON)', () => {
  const items = [
    { text: 'HELLO', kind: 'dialogue' as const, confidence: 0.95 },
    { text: 'BOOM', kind: 'sfx' as const, confidence: 0.9 },
    { text: 'WHAR IS IT', kind: 'dialogue' as const, confidence: 0.4 }
  ];

  it('filters sfx out of keyed payload when translateSfx=false and marks sendMap -1', () => {
    const r = PromptBuilder.buildDialogue(items, 'Tiếng Việt', 'English', { translateSfx: false });
    const payload = JSON.parse(r.userPayload);
    expect(r.keys).toEqual(['b0', 'b1']);
    expect(r.sendMap).toEqual([0, -1, 1]);
    expect(payload.b0).toEqual({ t: 'HELLO' });
    expect(payload.b1).toEqual({ t: 'WHAR IS IT', c: 0.4 });
  });

  it('keeps sfx with k tag when translateSfx=true', () => {
    const r = PromptBuilder.buildDialogue(items, 'Tiếng Việt', 'English', { translateSfx: true });
    const payload = JSON.parse(r.userPayload);
    expect(r.keys).toEqual(['b0', 'b1', 'b2']);
    expect(payload.b1).toEqual({ t: 'BOOM', k: 'sfx' });
    expect(r.sendMap).toEqual([0, 1, 2]);
  });

  it('includes glossary + confidence note + chapter context in prompt', () => {
    const r = PromptBuilder.buildDialogue(items, 'Tiếng Việt', 'English', {
      translateSfx: false,
      glossaryPairs: [['Kai', 'Cai']],
      chapterContext: ['HELLO => XIN CHÀO']
    });
    expect(r.systemPrompt).toContain('"Kai" => "Cai"');
    expect(r.systemPrompt).toContain('OCR CONFIDENCE');
    expect(r.systemPrompt).toContain('HELLO => XIN CHÀO');
  });
});

describe('PromptBuilder.remapResults', () => {
  it('maps payload results back to original order, filtered slots become ""', () => {
    const out = PromptBuilder.remapResults(['XIN CHÀO', 'ĐÓ LÀ GÌ'], [0, -1, 1], 3);
    expect(out).toEqual(['XIN CHÀO', '', 'ĐÓ LÀ GÌ']);
  });
});
