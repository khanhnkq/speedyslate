import { DialogueItem } from './types';

const CACHE_DB_NAME = 'SpeedySlate_Translation_Cache_DB';
const CACHE_DB_VERSION = 1;
const STORE_NAME = 'chapter_translations';

export interface CachedImageTranslation {
  imageUrl: string; // Primary key: URL của ảnh
  chapterUrl: string; // URL của chương truyện
  dialogues: DialogueItem[];
  naturalWidth: number;
  naturalHeight: number;
  timestamp: number;
}

/**
 * IndexedDB Service for storing translated comic images by URL
 * Allows instant re-reading without re-translating, and quick cache clearing
 * Following Single Responsibility Principle (SRP)
 */
export class TranslationCacheDb {
  private static dbPromise: Promise<IDBDatabase> | null = null;

  private static getDb(): Promise<IDBDatabase> {
    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(CACHE_DB_NAME, CACHE_DB_VERSION);
        request.onupgradeneeded = (e) => {
          const db = (e.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            const store = db.createObjectStore(STORE_NAME, { keyPath: 'imageUrl' });
            store.createIndex('chapterUrl', 'chapterUrl', { unique: false });
            store.createIndex('timestamp', 'timestamp', { unique: false });
          }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
    return this.dbPromise;
  }

  /**
   * Retrieves cached translation for an image URL
   */
  public static async getTranslation(imageUrl: string): Promise<CachedImageTranslation | null> {
    try {
      const db = await this.getDb();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(imageUrl);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  }

  /**
   * Saves translation result for an image URL
   */
  public static async saveTranslation(
    imageUrl: string,
    chapterUrl: string,
    dialogues: DialogueItem[],
    naturalWidth: number,
    naturalHeight: number
  ): Promise<void> {
    try {
      const db = await this.getDb();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const record: CachedImageTranslation = {
        imageUrl,
        chapterUrl,
        dialogues,
        naturalWidth,
        naturalHeight,
        timestamp: Date.now()
      };
      store.put(record);
      await new Promise<void>((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch (err) {
      console.warn('[SpeedySlate Cache] Failed to save translation cache:', err);
    }
  }

  /**
   * Clears translations for the current chapter
   */
  public static async clearChapterCache(chapterUrl: string): Promise<number> {
    const db = await this.getDb();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('chapterUrl');
    const req = index.getAllKeys(chapterUrl);

    return new Promise((resolve, reject) => {
      req.onsuccess = () => {
        const keys = req.result;
        for (const k of keys) {
          store.delete(k);
        }
        tx.oncomplete = () => resolve(keys.length);
      };
      req.onerror = () => reject(req.error);
      tx.onerror = () => reject(tx.error);
    });
  }

  /**
   * Clears ALL cached comic translations quickly
   */
  public static async clearAllCache(): Promise<void> {
    const db = await this.getDb();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.clear();
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  /**
   * Returns cache stats (total cached images count)
   */
  public static async getCacheStats(): Promise<{ count: number }> {
    try {
      const db = await this.getDb();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.count();
        req.onsuccess = () => resolve({ count: req.result || 0 });
        req.onerror = () => resolve({ count: 0 });
      });
    } catch {
      return { count: 0 };
    }
  }
}
