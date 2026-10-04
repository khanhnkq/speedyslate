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
      const parts = dataUrl.split(',');
      const mimeMatch = parts[0].match(/:(.*?);/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      const base64Data = parts[1] || '';
      return { base64Data, mimeType };
    }

    if (imageUrl) {
      const res = await fetch(imageUrl);
      if (!res.ok) {
        throw new Error(`Không thể tải ảnh từ URL: ${res.status}`);
      }
      const blob = await res.blob();
      const mimeType = blob.type || 'image/jpeg';
      const buffer = await blob.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let binary = '';
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return { base64Data: btoa(binary), mimeType };
    }

    throw new Error('Không có dữ liệu ảnh (thiếu dataUrl hoặc imageUrl)');
  }
}
