/**
 * Core type definitions for SpeedySlate
 * Following SOLID principles: Segregated, focused interfaces
 */

export interface BoundingBox {
  x: number;      // Pixel coordinate X (left)
  y: number;      // Pixel coordinate Y (top)
  width: number;  // Pixel width
  height: number; // Pixel height
  confidence?: number;
}

export interface DialogueItem {
  id: string;
  box: BoundingBox;
  originalText: string;
  translatedText?: string;
  isDarkBackground?: boolean;
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
  | 'groq' 
  | 'deepseek' 
  | 'openrouter' 
  | 'openai' 
  | 'ollama' 
  | 'custom';

export interface ProviderConfig {
  type: ProviderType;
  name: string;
  baseUrl: string;
  apiKey: string;
  model: string;
}

export type BubbleTheme = 'light' | 'dark' | 'auto';

export interface ExtensionSettings {
  activeProvider: ProviderType;
  providers: Record<ProviderType, ProviderConfig>;
  targetLanguage: string;
  bubbleTheme: BubbleTheme;
  autoScrollSpeed: number; // pixels per step (1 to 10)
  autoPrefetch: boolean;
  activeOcrModelId: string;
  rateLimitDelayMs?: number; // Minimum spacing between API translation requests in ms
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
