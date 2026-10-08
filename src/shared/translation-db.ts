import { DialogueItem } from './types';

const CACHE_DB_NAME = 'SpeedySlate_Translation_Cache_DB';
const CACHE_DB_VERSION = 2;
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
          if (e.oldVersion < 2 && db.objectStoreNames.contains(STORE_NAME)) {
            db.deleteObjectStore(STORE_NAME);
          }
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
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(imageUrl);
        req.onsuccess = () => {
          const rec: CachedImageTranslation = req.result;
          if (rec && Array.isArray(rec.dialogues) && rec.dialogues.length > 0) {
            resolve(rec);
          } else {
            if (rec) store.delete(imageUrl); // purge empty record
            resolve(null);
          }
        };
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
    if (!dialogues || !Array.isArray(dialogues) || dialogues.length === 0) {
      return; // Never store empty dialogue sets to cache
    }
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
    const targetNorm = (chapterUrl || '').split('#')[0].split('?')[0].replace(/\/+$/, '');

    return new Promise((resolve, reject) => {
      let deleted = 0;
      tx.oncomplete = () => resolve(deleted);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error || new Error('Transaction aborted'));

      const req = store.getAll();
      req.onsuccess = () => {
        const records: CachedImageTranslation[] = req.result || [];
        for (const r of records) {
          const recNorm = (r.chapterUrl || '').split('#')[0].split('?')[0].replace(/\/+$/, '');
          if (!targetNorm || recNorm === targetNorm || r.chapterUrl === chapterUrl) {
            store.delete(r.imageUrl);
            deleted++;
          }
        }
      };
      req.onerror = () => reject(req.error);
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
    return new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error || new Error('Transaction aborted'));
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
