import { ModelStatus, OcrModelPreset } from './types';

const DB_NAME = 'SpeedySlate_OCR_Models';
const DB_VERSION = 1;
const STORE_NAME = 'models_store';

export interface StoredModelRecord {
  id: string; // key e.g. 'paddle-en-slim:det', 'paddle-en-slim:rec', 'paddle-en-slim:keys'
  modelId: string;
  type: 'det' | 'rec' | 'keys';
  data: ArrayBuffer | string;
  sizeBytes: number;
  updatedAt: number;
}

/**
 * IndexedDB Service for ONNX models
 * Handles local caching, streaming downloads, and deletion to free memory
 */
export class ModelDbService {
  private static dbPromise: Promise<IDBDatabase> | null = null;

  private static getDb(): Promise<IDBDatabase> {
    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (e) => {
          const db = (e.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            store.createIndex('modelId', 'modelId', { unique: false });
          }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
    return this.dbPromise;
  }

  /**
   * Checks if all required components for a model are stored locally
   */
  public static async getModelStatus(modelId: string): Promise<ModelStatus> {
    try {
      const db = await this.getDb();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const index = store.index('modelId');
        const req = index.getAll(modelId);

        req.onsuccess = () => {
          const records: StoredModelRecord[] = req.result || [];
          const hasDet = records.some((r) => r.type === 'det');
          const hasRec = records.some((r) => r.type === 'rec');
          const hasKeys = records.some((r) => r.type === 'keys');

          if (hasDet && hasRec && hasKeys) {
            const totalBytes = records.reduce((sum, r) => sum + (r.sizeBytes || 0), 0);
            resolve({
              id: modelId,
              status: 'ready',
              progressPercent: 100,
              sizeBytes: totalBytes
            });
          } else {
            resolve({
              id: modelId,
              status: 'not_downloaded',
              progressPercent: 0
            });
          }
        };

        req.onerror = () => {
          resolve({
            id: modelId,
            status: 'not_downloaded',
            progressPercent: 0,
            errorMessage: 'Lỗi truy vấn IndexedDB'
          });
        };
      });
    } catch (err: any) {
      return {
        id: modelId,
        status: 'error',
        progressPercent: 0,
        errorMessage: err?.message || 'Không thể mở IndexedDB'
      };
    }
  }

  /**
   * Downloads model components from CDN with progress tracking
   */
  public static async downloadModel(
    preset: OcrModelPreset,
    onProgress?: (percent: number, stepName: string) => void
  ): Promise<void> {
    const fetchWithProgress = async (
      url: string,
      stepName: string,
      weight: number,
      baseOffset: number
    ): Promise<ArrayBuffer> => {
      const resp = await fetch(url);
      if (!resp.ok) {
        throw new Error(`Tải ${stepName} thất bại (HTTP ${resp.status})`);
      }
      const contentLength = Number(resp.headers.get('Content-Length')) || 0;
      const reader = resp.body?.getReader();

      if (!reader || contentLength === 0) {
        // Fallback if content-length is missing
        onProgress?.(baseOffset + weight * 0.5, `Đang tải ${stepName}...`);
        const buffer = await resp.arrayBuffer();
        onProgress?.(baseOffset + weight, `Hoàn tất ${stepName}`);
        return buffer;
      }

      const chunks: Uint8Array[] = [];
      let receivedBytes = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          chunks.push(value);
          receivedBytes += value.length;
          const ratio = Math.min(1, receivedBytes / contentLength);
          onProgress?.(Math.round(baseOffset + ratio * weight), `Đang tải ${stepName} (${Math.round(ratio * 100)}%)...`);
        }
      }

      const all = new Uint8Array(receivedBytes);
      let pos = 0;
      for (const chunk of chunks) {
        all.set(chunk, pos);
        pos += chunk.length;
      }
      return all.buffer;
    };

    // Det model (weight 35%)
    const detBuffer = await fetchWithProgress(preset.files.detUrl, 'Model Phát hiện chữ (Det)', 35, 0);

    // Rec model (weight 60%)
    const recBuffer = await fetchWithProgress(preset.files.recUrl, 'Model Nhận diện chữ (Rec)', 60, 35);

    // Keys dictionary (weight 5%)
    onProgress?.(95, 'Đang tải từ điển ký tự...');
    const keysResp = await fetch(preset.files.keysUrl);
    if (!keysResp.ok) throw new Error('Không thể tải file từ điển keys');
    const keysText = await keysResp.text();

    // Save to IndexedDB
    onProgress?.(98, 'Đang lưu vào bộ nhớ trình duyệt...');
    const db = await this.getDb();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    const now = Date.now();
    const records: StoredModelRecord[] = [
      {
        id: `${preset.id}:det`,
        modelId: preset.id,
        type: 'det',
        data: detBuffer,
        sizeBytes: detBuffer.byteLength,
        updatedAt: now
      },
      {
        id: `${preset.id}:rec`,
        modelId: preset.id,
        type: 'rec',
        data: recBuffer,
        sizeBytes: recBuffer.byteLength,
        updatedAt: now
      },
      {
        id: `${preset.id}:keys`,
        modelId: preset.id,
        type: 'keys',
        data: keysText,
        sizeBytes: new Blob([keysText]).size,
        updatedAt: now
      }
    ];

    for (const record of records) {
      store.put(record);
    }

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });

    onProgress?.(100, 'Model đã sẵn sàng!');
  }

  /**
   * Deletes model components from IndexedDB to free disk space
   */
  public static async deleteModel(modelId: string): Promise<void> {
    const db = await this.getDb();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    // 1. Explicitly delete known component primary keys
    store.delete(`${modelId}:det`);
    store.delete(`${modelId}:rec`);
    store.delete(`${modelId}:keys`);

    // 2. Also delete via secondary index to clean up any orphaned records
    try {
      const index = store.index('modelId');
      const req = index.getAllKeys(IDBKeyRange.only(modelId));
      req.onsuccess = () => {
        if (Array.isArray(req.result)) {
          for (const key of req.result) {
            store.delete(key);
          }
        }
      };
    } catch {
      // index query fallback
    }

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  /**
   * Queries status and disk footprint for all models in a single fast read transaction
   */
  public static async getAllDownloadedModels(): Promise<Map<string, { ready: boolean; sizeBytes: number }>> {
    try {
      const db = await this.getDb();
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      return new Promise((resolve) => {
        req.onsuccess = () => {
          const records: StoredModelRecord[] = req.result || [];
          const modelMap = new Map<string, { det: boolean; rec: boolean; keys: boolean; sizeBytes: number }>();
          for (const r of records) {
            if (!modelMap.has(r.modelId)) {
              modelMap.set(r.modelId, { det: false, rec: false, keys: false, sizeBytes: 0 });
            }
            const item = modelMap.get(r.modelId)!;
            if (r.type === 'det') item.det = true;
            if (r.type === 'rec') item.rec = true;
            if (r.type === 'keys') item.keys = true;
            item.sizeBytes += r.sizeBytes || 0;
          }

          const result = new Map<string, { ready: boolean; sizeBytes: number }>();
          for (const [mid, item] of modelMap.entries()) {
            result.set(mid, {
              ready: item.det && item.rec && item.keys,
              sizeBytes: item.sizeBytes
            });
          }
          resolve(result);
        };
        req.onerror = () => resolve(new Map());
      });
    } catch {
      return new Map();
    }
  }

  /**
   * Loads buffers and keys text into memory for ONNX inference
   */
  public static async getModelBuffers(modelId: string): Promise<{
    detBuffer: ArrayBuffer;
    recBuffer: ArrayBuffer;
    keysText: string;
  }> {
    const db = await this.getDb();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('modelId');
    const req = index.getAll(modelId);

    return new Promise((resolve, reject) => {
      req.onsuccess = () => {
        const records: StoredModelRecord[] = req.result || [];
        const detRecord = records.find((r) => r.type === 'det');
        const recRecord = records.find((r) => r.type === 'rec');
        const keysRecord = records.find((r) => r.type === 'keys');

        if (!detRecord || !recRecord || !keysRecord) {
          reject(new Error(`Model ${modelId} chưa được tải đủ vào IndexedDB`));
          return;
        }

        resolve({
          detBuffer: detRecord.data as ArrayBuffer,
          recBuffer: recRecord.data as ArrayBuffer,
          keysText: keysRecord.data as string
        });
      };
      req.onerror = () => reject(req.error);
    });
  }
}
