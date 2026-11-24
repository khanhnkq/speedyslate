import { describe, expect, it, vi } from 'vitest';
import { OpenAIApiClient } from '../../src/services/translation/openai-api-client';
import { ApiKeyRotator } from '../../src/services/translation/api-key-rotator';
import { InpaintSolver } from '../../src/worker/inpaint-solver';

describe('OpenAIApiClient HTTP 400 json_object downgrade', () => {
  it('retries without response_format when endpoint rejects json_object with HTTP 400', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ error: { message: 'response_format is not supported' } }), { status: 400 })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ choices: [{ message: { content: '{"b0":"ok"}' } }] }), { status: 200 })
      );
    vi.stubGlobal('fetch', fetchMock);

    const res = await OpenAIApiClient.postChatCompletion({
      baseUrl: 'http://localhost:11434/v1',
      model: 'qwen2.5:7b',
      messages: [{ role: 'user', content: 'hi' }],
      keyRotator: new ApiKeyRotator(''),
      jsonObjectMode: true
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).response_format).toEqual({ type: 'json_object' });
    expect(JSON.parse(fetchMock.mock.calls[1][1].body).response_format).toBeUndefined();
    expect(res.choices[0].message.content).toBe('{"b0":"ok"}');
    vi.unstubAllGlobals();
  });
});

describe('InpaintSolver.diffuseMaskedRegion', () => {
  it('repaints masked center pixels from surrounding background donors', () => {
    const w = 8, h = 8;
    const data = new Uint8ClampedArray(w * h * 4);
    const dil = new Uint8Array(w * h);
    for (let i = 0; i < w * h; i++) {
      const x = i % w, y = (i / w) | 0;
      const isInk = x >= 3 && x <= 4 && y >= 3 && y <= 4;
      dil[i] = isInk ? 1 : 0;
      data.set(isInk ? [10, 10, 10, 255] : [240, 240, 240, 255], i * 4);
    }
    const out = InpaintSolver.diffuseMaskedRegion(data, dil, dil, w, h);
    const mid = (3 * w + 3) * 4;
    expect(out[mid + 3]).toBe(255);
    expect(out[mid]).toBeCloseTo(240, 0);
  });
});
