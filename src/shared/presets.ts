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
      'gemini-2.0-flash'
    ],
    requiresApiKey: true,
    defaultDelayMs: 2600
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
    id: 'pp-ocrv4-server-heavy',
    name: 'PP-OCRv4 Server ResNet-50 Heavy (~121MB - Khuyên dùng Toonhey)',
    description: 'Bản Server ResNet-50 113MB chuyên sâu. Bắt trọn từng ô chữ, phông thoại uốn lượn, in hoa, in nghiêng, không bị sót hay nhầm ô.',
    totalSizeMb: 120.9,
    files: {
      detUrl: 'https://huggingface.co/deepghs/paddleocr/resolve/main/det/ch_PP-OCRv4_server_det/model.onnx',
      recUrl: 'https://huggingface.co/deepghs/paddleocr/resolve/main/rec/en_PP-OCRv4_rec/model.onnx',
      keysUrl: 'https://huggingface.co/deepghs/paddleocr/resolve/main/rec/en_PP-OCRv4_rec/dict.txt'
    }
  },
  {
    id: 'pp-ocrv4-server-cjk',
    name: 'PP-OCRv4 Server CJK Full Heavy (~204MB - Đỉnh cao Đa ngữ)',
    description: 'Bản Full Server ResNet-50 204MB với 6,600+ ký tự Hán tự, Latin, số và ký tự thoại cho các truyện tranh bản scan độ phân giải cao.',
    totalSizeMb: 203.8,
    files: {
      detUrl: 'https://huggingface.co/deepghs/paddleocr/resolve/main/det/ch_PP-OCRv4_server_det/model.onnx',
      recUrl: 'https://huggingface.co/deepghs/paddleocr/resolve/main/rec/ch_PP-OCRv4_server_rec/model.onnx',
      keysUrl: 'https://huggingface.co/deepghs/paddleocr/resolve/main/rec/ch_PP-OCRv4_server_rec/dict.txt'
    }
  },
  {
    id: 'pp-ocrv4-english',
    name: 'PP-OCRv4 English Mobile (~12MB - Tốc độ cao)',
    description: 'Thế hệ PP-OCRv4 nhẹ cho máy cấu hình tiết kiệm. Tốc độ nhận diện 15-25ms.',
    totalSizeMb: 12.4,
    files: {
      detUrl: 'https://huggingface.co/deepghs/paddleocr/resolve/main/det/ch_PP-OCRv4_det/model.onnx',
      recUrl: 'https://huggingface.co/deepghs/paddleocr/resolve/main/rec/en_PP-OCRv4_rec/model.onnx',
      keysUrl: 'https://huggingface.co/deepghs/paddleocr/resolve/main/rec/en_PP-OCRv4_rec/dict.txt'
    }
  },
  {
    id: 'pp-ocrv4-japanese',
    name: 'PP-OCR Japanese Manga (RAW Nhật Bản)',
    description: 'Chuyên biệt cho Manga Nhật Bản. Nhận diện Hiragana, Katakana, Kanji và số thoại truyện tranh.',
    totalSizeMb: 14.7,
    files: {
      detUrl: 'https://huggingface.co/deepghs/paddleocr/resolve/main/det/ch_PP-OCRv4_det/model.onnx',
      recUrl: 'https://huggingface.co/deepghs/paddleocr/resolve/main/rec/japan_PP-OCRv3_rec/model.onnx',
      keysUrl: 'https://huggingface.co/deepghs/paddleocr/resolve/main/rec/japan_PP-OCRv3_rec/dict.txt'
    }
  },
  {
    id: 'pp-ocrv4-korean',
    name: 'PP-OCR Korean Manhwa (RAW Hàn Quốc)',
    description: 'Chuyên biệt cho Manhwa Hàn Quốc. Nhận diện chuẩn xác toàn bộ bảng ký tự Hangul thoại.',
    totalSizeMb: 14.6,
    files: {
      detUrl: 'https://huggingface.co/deepghs/paddleocr/resolve/main/det/ch_PP-OCRv4_det/model.onnx',
      recUrl: 'https://huggingface.co/deepghs/paddleocr/resolve/main/rec/korean_PP-OCRv3_rec/model.onnx',
      keysUrl: 'https://huggingface.co/deepghs/paddleocr/resolve/main/rec/korean_PP-OCRv3_rec/dict.txt'
    }
  },
  {
    id: 'pp-ocrv4-chinese',
    name: 'PP-OCRv4 Chinese Manhua (RAW Trung Quốc)',
    description: 'PP-OCRv4 nhận diện 6,600+ Hán tự giản thể và phồn thể cho Manhua Trung Quốc.',
    totalSizeMb: 15.5,
    files: {
      detUrl: 'https://huggingface.co/deepghs/paddleocr/resolve/main/det/ch_PP-OCRv4_det/model.onnx',
      recUrl: 'https://huggingface.co/deepghs/paddleocr/resolve/main/rec/ch_PP-OCRv4_rec/model.onnx',
      keysUrl: 'https://huggingface.co/deepghs/paddleocr/resolve/main/rec/ch_PP-OCRv4_rec/dict.txt'
    }
  },
  {
    id: 'pp-ocrv4-latin',
    name: 'PP-OCR Latin Multilingual (Đa ngữ Châu Âu & Latin)',
    description: 'Bản đa ngữ cho chữ Latin mở rộng: Tiếng Việt, Pháp, Đức, Tây Ban Nha, Bồ Đào Nha, v.v.',
    totalSizeMb: 13.6,
    files: {
      detUrl: 'https://huggingface.co/deepghs/paddleocr/resolve/main/det/ch_PP-OCRv4_det/model.onnx',
      recUrl: 'https://huggingface.co/deepghs/paddleocr/resolve/main/rec/latin_PP-OCRv3_rec/model.onnx',
      keysUrl: 'https://huggingface.co/deepghs/paddleocr/resolve/main/rec/latin_PP-OCRv3_rec/dict.txt'
    }
  },
  {
    id: 'paddle-en-slim',
    name: 'PaddleOCR English Slim v3 (Bản tiết kiệm ~10MB)',
    description: 'Bản siêu nhẹ thế hệ v3. Tải nhanh nhất, tiết kiệm dữ liệu.',
    totalSizeMb: 10.2,
    files: {
      detUrl: 'https://huggingface.co/monkt/paddleocr-onnx/resolve/main/detection/v3/det.onnx',
      recUrl: 'https://huggingface.co/monkt/paddleocr-onnx/resolve/main/languages/english/rec.onnx',
      keysUrl: 'https://huggingface.co/monkt/paddleocr-onnx/resolve/main/languages/english/dict.txt'
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
  bubbleTheme: 'auto',
  autoScrollSpeed: 3,
  autoPrefetch: true,
  activeOcrModelId: 'pp-ocrv4-server-heavy',
  rateLimitDelayMs: 1200,
  useWebGpu: true
};
