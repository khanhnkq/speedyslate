/**
 * Helper to extract or fetch base64 image data for Multimodal Vision AI
 * Follows Single Responsibility Principle (SRP)
 */
export class ImageFetcher {
  public static async getBase64Data(
    dataUrl?: string,
    imageUrl?: string
  ): Promise<{ base64Data: string; mimeType: string }> {
    if (dataUrl && dataUrl.startsWith('data:')) {
      const commaIdx = dataUrl.indexOf(',');
      const header = dataUrl.substring(0, commaIdx);
      const mimeMatch = header.match(/:(.*?);/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      const base64Data = commaIdx !== -1 ? dataUrl.substring(commaIdx + 1) : '';
      return { base64Data, mimeType };
    }

    if (imageUrl) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      let res: Response;
      try {
        res = await fetch(imageUrl, { signal: controller.signal });
      } catch (err: any) {
        clearTimeout(timeoutId);
        if (err.name === 'AbortError') {
          throw new Error(`Quá thời gian tải ảnh từ URL (timeout 15s): ${imageUrl}`);
        }
        throw err;
      }
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Không thể tải ảnh từ URL: HTTP ${res.status}`);
      }

      const blob = await res.blob();
      const mimeType = blob.type || 'image/jpeg';

      if (typeof FileReader !== 'undefined') {
        return new Promise<{ base64Data: string; mimeType: string }>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = (reader.result as string) || '';
            const commaIdx = result.indexOf(',');
            resolve({
              base64Data: commaIdx !== -1 ? result.substring(commaIdx + 1) : result,
              mimeType
            });
          };
          reader.onerror = () => reject(new Error('Lỗi FileReader khi đọc blob ảnh'));
          reader.readAsDataURL(blob);
        });
      }

      // Memory-efficient chunked base64 conversion (avoids 100% CPU freeze on large images)
      const buffer = await blob.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const chunkSize = 32768;
      const chunks: string[] = [];
      for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.subarray(i, i + chunkSize);
        chunks.push(String.fromCharCode.apply(null, chunk as unknown as number[]));
      }
      return { base64Data: btoa(chunks.join('')), mimeType };
    }

    throw new Error('Không có dữ liệu ảnh (thiếu dataUrl hoặc imageUrl)');
  }
}

