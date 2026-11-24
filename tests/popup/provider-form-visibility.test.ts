import { describe, expect, it } from 'vitest';
import { computeProviderFieldVisibility } from '../../src/popup/provider-form-controller';

describe('computeProviderFieldVisibility', () => {
  it('hides Base URL, Model, and API Key inputs when google_free is selected', () => {
    expect(computeProviderFieldVisibility('google_free')).toEqual({
      showBaseUrl: false,
      showModel: false,
      showApiKey: false,
      showFreeNotice: true
    });
  });

  it('hides only API Key for local ollama and shows all fields for cloud LLM providers', () => {
    expect(computeProviderFieldVisibility('ollama')).toEqual({
      showBaseUrl: true,
      showModel: true,
      showApiKey: false,
      showFreeNotice: false
    });
    expect(computeProviderFieldVisibility('gemini')).toEqual({
      showBaseUrl: true,
      showModel: true,
      showApiKey: true,
      showFreeNotice: false
    });
  });
});
