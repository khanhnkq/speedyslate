import { DialogueItem } from '../../shared/types';

/**
 * Standard interface for all translation providers
 * Following SOLID: Interface Segregation and Dependency Inversion
 */
export interface ITranslationProvider {
  /**
   * Translates an array of comic dialogue strings into the target language
   * Preserves exact ordering
   */
  translateDialogues(texts: string[], targetLang: string, sourceLang?: string): Promise<string[]>;

  /**
   * Tests the connection with a lightweight probe
   * Returns true if successful, throws descriptive Error if failed
   */
  testConnection(): Promise<boolean>;

  /**
   * End-to-end Multimodal Vision AI translation:
   * Directly processes comic page image, detects character speech bubbles/narrators,
   * generates 2D bounding boxes, translations, and background color style (dark/light).
   * Strict rule: Never translates sound effects (SFX / onomatopoeia).
   */
  translateImage?(
    base64Data: string,
    mimeType: string,
    targetLang: string,
    naturalWidth: number,
    naturalHeight: number,
    sourceLang?: string
  ): Promise<DialogueItem[]>;
}
