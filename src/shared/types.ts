/**
 * Core type definitions for SpeedySlate
 * Following SOLID principles: Segregated, focused interfaces
 */

export type DialogueKind = 'dialogue' | 'sfx' | 'free';

export interface BoundingBox {
  x: number;      // Pixel coordinate X (left)
  y: number;      // Pixel coordinate Y (top)
  width: number;  // Pixel width
  height: number; // Pixel height
  confidence?: number;
  kind?: DialogueKind;
  quad?: [number, number][]; // Optional 4-point rotated polygon [TL, TR, BR, BL]
  angleDeg?: number;         // Detected baseline tilt angle in degrees (-45..45)
}

/** Pixel-level erase patch: RGBA data where alpha>0 marks repainted ink pixels. */
export interface ErasePatch {
  x: number;
  y: number;
  width: number;
  height: number;
  pixels: Uint8ClampedArray | string; // base64 string after sendMessage transport
}

export interface DialogueItem {
  id: string;
  box: BoundingBox;
  normBox?: {
    ymin: number;
    xmin: number;
    ymax: number;
    xmax: number;
  };
  originalText: string;
  translatedText?: string;
  isDarkBackground?: boolean;
  confidence?: number;      // Mean CTC score from recognizer
  kind?: DialogueKind;
  bgColor?: string;         // Sampled bubble background '#RRGGBB'
  isVertical?: boolean;     // True when crop was rotated from a vertical CJK column
  lineBoxes?: BoundingBox[]; // Member line boxes merged into this bubble
  bubbleClusterId?: number; // Wall-verified bubble cluster id stamped inside OCR worker so downstream re-aggregation never merges across bubble walls
  chamberBox?: BoundingBox;  // Detected speech-bubble interior chamber (tail severed)
  isOvalChamber?: boolean;   // True when chamber silhouette is elliptical/rounded
  erasePatch?: ErasePatch;   // Per-line inpainted region (raw item)
  bubblePatch?: ErasePatch;  // Whole-interior repaint from BubbleFiller
  erasePatches?: ErasePatch[]; // All member patches on an aggregated bubble
}

export interface DialogueTranslateContext {
  items?: DialogueItem[];
  glossary?: string;
  chapterContext?: string[];
  translateSfx?: boolean;
}

export interface ImageSliceData {
  elementId: string;
  imageUrl: string;
  naturalWidth: number;
  naturalHeight: number;
  dialogues: DialogueItem[];
  status: 'idle' | 'detecting' | 'translating' | 'done' | 'error';
  errorMessage?: string;
}

export type ProviderType = 
  | 'gemini' 
  | 'antigravity'
  | 'groq' 
  | 'deepseek' 
  | 'openrouter' 
  | 'openai' 
  | 'ollama' 
  | 'google_free'
  | 'custom';

export interface ProviderConfig {
  type: ProviderType;
  name: string;
  baseUrl: string;
  apiKey: string;
  model: string;
}

export type BubbleTheme = 'light' | 'dark' | 'auto';

export type OcrBackend = 'webgpu' | 'wasm';

export type TranslationMode = 'hybrid_ocr' | 'vision_ai';

export interface ExtensionSettings {
  translationMode: TranslationMode;
  activeProvider: ProviderType;
  providers: Record<ProviderType, ProviderConfig>;
  sourceLanguage: string;   // e.g. 'auto', 'English', 'Japanese', 'Korean', 'Chinese', etc.
  targetLanguage: string;   // Any language name e.g. 'Tiếng Việt', 'English', etc.
  customSites: string[];    // User-added custom domains e.g. ['asuracomic.net', 'mangadex.org']
  allowAllSites: boolean;   // Allow translation on all websites
  bubbleTheme: BubbleTheme;
  autoScrollSpeed: number; // pixels per step (1 to 10)
  autoPrefetch: boolean;
  activeOcrModelId: string;
  rateLimitDelayMs?: number; // Minimum spacing between API translation requests in ms
  useWebGpu: boolean;       // Use WebGPU backend for ONNX (default: true, falls back to WASM)
  rotateProviders: boolean; // Auto-rotate across configured providers with failover on 429
  enableFreeFallback?: boolean; // Automatically rescue via GoogleFreeProvider when all LLM providers fail
  glossary?: string;        // "Term = Translation" lines applied verbatim to prompts
  translateSfx?: boolean;   // When false, kind==='sfx' items are filtered before translation
}

export interface OcrModelPreset {
  id: string;
  name: string;
  description: string;
  totalSizeMb: number;
  files: {
    detUrl: string;
    recUrl: string;
    keysUrl: string;
    det2Url?: string;
  };
}

export type ModelDownloadStatus = 'not_downloaded' | 'downloading' | 'ready' | 'error';

export interface ModelStatus {
  id: string;
  status: ModelDownloadStatus;
  progressPercent: number;
  errorMessage?: string;
  sizeBytes?: number;
}
