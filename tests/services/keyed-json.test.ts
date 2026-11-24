import { describe, expect, it } from 'vitest';
import { KeyedJson, MAX_DIALOGUE_BATCH_SIZE } from '../../src/services/translation/keyed-json';
import { PromptBuilder } from '../../src/services/translation/prompt-builder';

describe('KeyedJson & PromptBuilder', () => {
  it('preserves exact positional alignment even when LLM drops a middle key', () => {
    const parsed = KeyedJson.parseKeyedResponse('{"b0": "Chào", "b2": "Tạm biệt"}', ['b0', 'b1', 'b2']);
    expect(parsed).toEqual(['Chào', undefined, 'Tạm biệt']);
    const remapped = PromptBuilder.remapResults(parsed, [0, 1, 2], ['Hello', 'Wait!', 'Bye']);
    expect(remapped).toEqual(['Chào', 'Wait!', 'Tạm biệt']);
  });

  it('marks punctuation-only strings as passthrough (-2) and emits zero LLM keys when all passthrough', () => {
    const built = PromptBuilder.buildDialogue(
      [{ text: '...' }, { text: '?!' }],
      'Tiếng Việt',
      'Japanese'
    );
    expect(built.keys).toEqual([]);
    expect(PromptBuilder.remapResults([], built.sendMap, ['...', '?!'])).toEqual(['...', '?!']);
  });

  it('builds non-empty Gemini OBJECT schema with required and propertyOrdering', () => {
    const schema = KeyedJson.buildGeminiObjectSchema(['b0', 'b1']);
    expect(schema).toEqual({
      type: 'OBJECT',
      properties: { b0: { type: 'STRING' }, b1: { type: 'STRING' } },
      required: ['b0', 'b1'],
      propertyOrdering: ['b0', 'b1']
    });
  });

  it('chunks large arrays into batches of MAX_DIALOGUE_BATCH_SIZE (20)', () => {
    const arr = Array.from({ length: 34 }, (_, i) => `line-${i}`);
    const chunks = KeyedJson.chunkArray(arr, MAX_DIALOGUE_BATCH_SIZE);
    expect(chunks.map((c) => c.length)).toEqual([20, 14]);
  });
});
