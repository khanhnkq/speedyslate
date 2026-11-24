import { ExtensionSettings, OcrModelPreset, ProviderType } from './types';

/**
 * Pre-configured presets for all Translation API Providers
 * Up-to-date with 2026 flagship models (Gemini 3.5 Flash-Lite, Groq GPT-OSS, Qwen)
 */
export const API_PRESETS: Record<ProviderType, {
  name: string;
  baseUrl: string;
  defaultModel: string;
  suggestedModels: string[];
  requiresApiKey: boolean;
  defaultDelayMs: number;
}> = {
  gemini: {
    name: 'Google Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    defaultModel: 'gemini-3.5-flash-lite',
    suggestedModels: [
      'gemini-3.5-flash-lite',
      'gemini-3.8-flash',
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'antigravity-preview-09-2026'
    ],
    requiresApiKey: true,
    defaultDelayMs: 2600
  },
  antigravity: {
    name: 'Google Antigravity Agent',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    defaultModel: 'antigravity-preview-09-2026',
    suggestedModels: [
      'antigravity-preview-09-2026',
      'antigravity-preview-09-2026 (gemini-3.8-flash)',
      'antigravity-preview-09-2026 (gemini-3.5-flash-lite)',
      'antigravity-preview-09-2026 (gemini-3.7-flash)',
      'antigravity-preview-09-2026 (gemini-3.5-flash)'
    ],
    requiresApiKey: true,
    defaultDelayMs: 2500
  },
  groq: {
    name: 'Groq (Ultra-Fast LPU)',
    baseUrl: 'https://api.groq.com/openai/v1',
    defaultModel: 'openai/gpt-oss-20b',
    suggestedModels: [
      'openai/gpt-oss-20b',
      'openai/gpt-oss-120b',
      'qwen/qwen3.8-27b',
      'llama-3.3-70b-versatile'
    ],
    requiresApiKey: true,
    defaultDelayMs: 1200
  },
  deepseek: {
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    defaultModel: 'deepseek-chat',
    suggestedModels: [
      'deepseek-chat',
      'deepseek-reasoner'
    ],
    requiresApiKey: true,
    defaultDelayMs: 1000
  },
  openrouter: {
    name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    defaultModel: 'google/gemini-2.0-flash-001',
    suggestedModels: [
      'google/gemini-2.0-flash-001',
      'openai/gpt-oss-120b',
      'meta-llama/llama-3.3-70b-instruct',
      'deepseek/deepseek-chat'
    ],
    requiresApiKey: true,
    defaultDelayMs: 1200
  },
  openai: {
    name: 'OpenAI Official',
    baseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o-mini',
    suggestedModels: [
      'gpt-4o-mini',
      'gpt-4o'
    ],
    requiresApiKey: true,
    defaultDelayMs: 1000
  },
  ollama: {
    name: 'Local Ollama (Offline)',
    baseUrl: 'http://localhost:11434/v1',
    defaultModel: 'openai/gpt-oss-20b',
    suggestedModels: [
      'openai/gpt-oss-20b',
      'qwen2.5:7b',
      'llama3.2:3b'
    ],
    requiresApiKey: false,
    defaultDelayMs: 0
  },
  google_free: {
    name: 'Google Translate (Free 0-Key)',
    baseUrl: 'https://translate.googleapis.com',
    defaultModel: 'gtx-free',
    suggestedModels: ['gtx-free'],
    requiresApiKey: false,
    defaultDelayMs: 300
  },
  custom: {
    name: 'Tùy chỉnh (Custom Endpoint)',
    baseUrl: 'http://localhost:8000/v1',
    defaultModel: 'custom-model',
    suggestedModels: ['custom-model'],
    requiresApiKey: false,
    defaultDelayMs: 1000
  }
};

/**
 * Pre-configured presets for PaddleOCR ONNX models
 * Direct high-speed CDN links from HuggingFace
 */
export const OCR_MODEL_PRESETS: OcrModelPreset[] = [
  {
    id: 'comic-manga-manhwa',
    name: 'Comic & Manga AI Detector (~16MB - Chuyên Manga/Manhwa)',
    description: 'Model RT-DETR-v2 11MB chuyên sâu được huấn luyện trên 11.000+ trang Manga & Manhwa. Bắt trọn mọi bong bóng gai nhọn, thoại la hét, SFX phức tạp.',
    totalSizeMb: 15.9,
    files: {
      detUrl: 'https://huggingface.co/ogkalu/comic-text-and-bubble-detector/resolve/main/detector-v4-s_int8.onnx',
      recUrl: 'https://huggingface.co/deepghs/paddleocr/resolve/main/rec/en_PP-OCRv4_rec/model.onnx',
      keysUrl: 'https://huggingface.co/deepghs/paddleocr/resolve/main/rec/en_PP-OCRv4_rec/dict.txt'
    }
  },
  {
    id: 'comic-manga-cjk',
    name: 'Comic & Manga CJK Raw (~27MB - Nhật/Hàn/Trung)',
    description: 'Detector RT-DETR-v2 chuyên Manga kết hợp bộ nhận diện CJK 6.600+ ký tự Hán tự, Hiragana, Katakana, Hangul cho bản RAW gốc.',
    totalSizeMb: 26.6,
    files: {
      detUrl: 'https://huggingface.co/ogkalu/comic-text-and-bubble-detector/resolve/main/detector-v4-s_int8.onnx',
      recUrl: 'https://huggingface.co/deepghs/paddleocr/resolve/main/rec/ch_PP-OCRv4_rec/model.onnx',
      keysUrl: 'https://huggingface.co/deepghs/paddleocr/resolve/main/rec/ch_PP-OCRv4_rec/dict.txt'
    }
  }
];

export const SOURCE_LANGUAGE_PRESETS = [
  { value: 'auto', label: '✨ Tự động nhận diện (Auto Detect)' },
  { value: 'English', label: 'Tiếng Anh (English)' },
  { value: 'Japanese', label: 'Tiếng Nhật (Japanese - RAW)' },
  { value: 'Korean', label: 'Tiếng Hàn (Korean - RAW)' },
  { value: 'Chinese', label: 'Tiếng Trung (Chinese - RAW)' },
  { value: 'French', label: 'Tiếng Pháp (French)' },
  { value: 'Spanish', label: 'Tiếng Tây Ban Nha (Spanish)' },
  { value: 'Russian', label: 'Tiếng Nga (Russian)' },
  { value: 'custom', label: 'Khác (Tự nhập tay)...' }
];

export const TARGET_LANGUAGE_PRESETS = [
  { value: 'Tiếng Việt', label: 'Tiếng Việt (Vietnamese)' },
  { value: 'English', label: 'English (Tiếng Anh)' },
  { value: 'Japanese', label: 'Tiếng Nhật (Japanese)' },
  { value: 'Korean', label: 'Tiếng Hàn (Korean)' },
  { value: 'Chinese Simplified', label: 'Tiếng Trung Giản thể' },
  { value: 'Chinese Traditional', label: 'Tiếng Trung Phồn thể' },
  { value: 'French', label: 'Tiếng Pháp (French)' },
  { value: 'German', label: 'Tiếng Đức (German)' },
  { value: 'Spanish', label: 'Tiếng Tây Ban Nha (Spanish)' },
  { value: 'Portuguese', label: 'Tiếng Bồ Đào Nha (Portuguese)' },
  { value: 'Russian', label: 'Tiếng Nga (Russian)' },
  { value: 'Thai', label: 'Tiếng Thái (Thai)' },
  { value: 'Indonesian', label: 'Tiếng Indonesia' },
  { value: 'custom', label: 'Khác (Bất kì ngôn ngữ nào)...' }
];

export const DEFAULT_SETTINGS: ExtensionSettings = {
  translationMode: 'hybrid_ocr',
  activeProvider: 'gemini',
  providers: {
    gemini: {
      type: 'gemini',
      name: API_PRESETS.gemini.name,
      baseUrl: API_PRESETS.gemini.baseUrl,
      apiKey: '',
      model: API_PRESETS.gemini.defaultModel
    },
    antigravity: {
      type: 'antigravity',
      name: API_PRESETS.antigravity.name,
      baseUrl: API_PRESETS.antigravity.baseUrl,
      apiKey: '',
      model: API_PRESETS.antigravity.defaultModel
    },
    groq: {
      type: 'groq',
      name: API_PRESETS.groq.name,
      baseUrl: API_PRESETS.groq.baseUrl,
      apiKey: '',
      model: API_PRESETS.groq.defaultModel
    },
    deepseek: {
      type: 'deepseek',
      name: API_PRESETS.deepseek.name,
      baseUrl: API_PRESETS.deepseek.baseUrl,
      apiKey: '',
      model: API_PRESETS.deepseek.defaultModel
    },
    openrouter: {
      type: 'openrouter',
      name: API_PRESETS.openrouter.name,
      baseUrl: API_PRESETS.openrouter.baseUrl,
      apiKey: '',
      model: API_PRESETS.openrouter.defaultModel
    },
    openai: {
      type: 'openai',
      name: API_PRESETS.openai.name,
      baseUrl: API_PRESETS.openai.baseUrl,
      apiKey: '',
      model: API_PRESETS.openai.defaultModel
    },
    ollama: {
      type: 'ollama',
      name: API_PRESETS.ollama.name,
      baseUrl: API_PRESETS.ollama.baseUrl,
      apiKey: '',
      model: API_PRESETS.ollama.defaultModel
    },
    google_free: {
      type: 'google_free',
      name: API_PRESETS.google_free.name,
      baseUrl: API_PRESETS.google_free.baseUrl,
      apiKey: '',
      model: API_PRESETS.google_free.defaultModel
    },
    custom: {
      type: 'custom',
      name: API_PRESETS.custom.name,
      baseUrl: API_PRESETS.custom.baseUrl,
      apiKey: '',
      model: API_PRESETS.custom.defaultModel
    }
  },
  sourceLanguage: 'auto',
  targetLanguage: 'Tiếng Việt',
  customSites: [],
  allowAllSites: false,
  bubbleTheme: 'auto',
  autoScrollSpeed: 3,
  autoPrefetch: true,
  activeOcrModelId: 'comic-manga-manhwa',
  rateLimitDelayMs: 1200,
  useWebGpu: true,
  rotateProviders: true,
  enableFreeFallback: true,
  glossary: '',
  translateSfx: false
};
