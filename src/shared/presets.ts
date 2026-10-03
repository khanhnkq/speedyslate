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
}> = {
  gemini: {
    name: 'Google Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    defaultModel: 'gemini-3.5-flash-lite',
    suggestedModels: [
      'gemini-3.5-flash-lite',
      'gemini-3.8-flash',
      'gemini-2.5-flash',
      'gemini-2.0-flash'
    ],
    requiresApiKey: true
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
    requiresApiKey: true
  },
  deepseek: {
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    defaultModel: 'deepseek-chat',
    suggestedModels: [
      'deepseek-chat',
      'deepseek-reasoner'
    ],
    requiresApiKey: true
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
    requiresApiKey: true
  },
  openai: {
    name: 'OpenAI Official',
    baseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o-mini',
    suggestedModels: [
      'gpt-4o-mini',
      'gpt-4o'
    ],
    requiresApiKey: true
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
    requiresApiKey: false
  },
  custom: {
    name: 'Tùy chỉnh (Custom Endpoint)',
    baseUrl: 'http://localhost:8000/v1',
    defaultModel: 'custom-model',
    suggestedModels: ['custom-model'],
    requiresApiKey: false
  }
};

/**
 * Pre-configured presets for PaddleOCR ONNX models
 * Direct high-speed CDN links from HuggingFace
 */
export const OCR_MODEL_PRESETS: OcrModelPreset[] = [
  {
    id: 'paddle-en-slim',
    name: 'PaddleOCR English Slim (Khuyên dùng Toonhey)',
    description: 'Chuyên biệt cho thoại tiếng Anh trên Toonhey.com. Cực nhẹ (~7MB), nhận diện nhanh và chuẩn xác.',
    totalSizeMb: 7.0,
    files: {
      detUrl: 'https://huggingface.co/monkt/paddleocr-onnx/resolve/main/ch_PP-OCRv4_det.onnx',
      recUrl: 'https://huggingface.co/monkt/paddleocr-onnx/resolve/main/en_PP-OCRv3_rec.onnx',
      keysUrl: 'https://huggingface.co/monkt/paddleocr-onnx/resolve/main/en_dict.txt'
    }
  },
  {
    id: 'paddle-multilingual',
    name: 'PaddleOCR Multilingual (Hàn / Nhật / Trung / Anh)',
    description: 'Dành cho độc giả đọc bản RAW tiếng Hàn, tiếng Nhật, tiếng Trung. Dung lượng ~13MB.',
    totalSizeMb: 13.0,
    files: {
      detUrl: 'https://huggingface.co/monkt/paddleocr-onnx/resolve/main/ch_PP-OCRv4_det.onnx',
      recUrl: 'https://huggingface.co/monkt/paddleocr-onnx/resolve/main/ch_PP-OCRv4_rec.onnx',
      keysUrl: 'https://huggingface.co/monkt/paddleocr-onnx/resolve/main/ppocr_keys_v1.txt'
    }
  }
];

export const DEFAULT_SETTINGS: ExtensionSettings = {
  activeProvider: 'gemini',
  providers: {
    gemini: {
      type: 'gemini',
      name: API_PRESETS.gemini.name,
      baseUrl: API_PRESETS.gemini.baseUrl,
      apiKey: '',
      model: API_PRESETS.gemini.defaultModel
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
    custom: {
      type: 'custom',
      name: API_PRESETS.custom.name,
      baseUrl: API_PRESETS.custom.baseUrl,
      apiKey: '',
      model: API_PRESETS.custom.defaultModel
    }
  },
  targetLanguage: 'Tiếng Việt',
  bubbleTheme: 'light',
  autoScrollSpeed: 3,
  autoPrefetch: true,
  activeOcrModelId: 'paddle-en-slim'
};
