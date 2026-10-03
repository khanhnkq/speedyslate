/**
 * Standard interface for all translation providers
 * Following SOLID: Interface Segregation and Dependency Inversion
 */
export interface ITranslationProvider {
  /**
   * Translates an array of comic dialogue strings into the target language
   * Preserves exact ordering
   */
  translateDialogues(texts: string[], targetLang: string): Promise<string[]>;

  /**
   * Tests the connection with a lightweight probe
   * Returns true if successful, throws descriptive Error if failed
   */
  testConnection(): Promise<boolean>;
}
