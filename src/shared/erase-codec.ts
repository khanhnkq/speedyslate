import { DialogueItem, ErasePatch } from './types';

/**
 * TypedArrays do NOT survive browser.runtime.sendMessage on Chrome
 * (messages are JSON-serialized -> Uint8ClampedArray becomes {}).
 * `rle1:` synchronously PackBits-compresses 4-byte RGBA pixels before base64
 * encoding (~85-95% smaller IndexedDB footprint) while remaining backward
 * compatible with legacy unprefixed raw base64 strings.
 */

const B64_CHUNK = 0x8000;
const RLE_PREFIX = 'rle1:';

function u8ToB64(u8: Uint8Array | Uint8ClampedArray): string {
  let bin = '';
  for (let i = 0; i < u8.length; i += B64_CHUNK) {
    bin += String.fromCharCode.apply(null, u8.subarray(i, i + B64_CHUNK) as unknown as number[]);
  }
  return btoa(bin);
}

function b64ToU8(s: string): Uint8ClampedArray<ArrayBuffer> {
  const bin = atob(s);
  const u8 = new Uint8ClampedArray(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  return u8;
}

function samePixel(u8: Uint8ClampedArray, a: number, b: number): boolean {
  return (
    u8[a] === u8[b] &&
    u8[a + 1] === u8[b + 1] &&
    u8[a + 2] === u8[b + 2] &&
    u8[a + 3] === u8[b + 3]
  );
}

export function encodePixelsRle(u8: Uint8ClampedArray): string {
  const pixelCount = u8.length >>> 2;
  const out: number[] = [
    pixelCount & 0xff,
    (pixelCount >>> 8) & 0xff,
    (pixelCount >>> 16) & 0xff,
    (pixelCount >>> 24) & 0xff
  ];

  let p = 0;
  while (p < pixelCount) {
    let runLen = 1;
    const base = p << 2;
    while (p + runLen < pixelCount && runLen < 129 && samePixel(u8, base, (p + runLen) << 2)) {
      runLen++;
    }

    if (runLen >= 2) {
      out.push(128 + (runLen - 2), u8[base], u8[base + 1], u8[base + 2], u8[base + 3]);
      p += runLen;
    } else {
      const litStart = p;
      p++;
      while (p < pixelCount && p - litStart < 128) {
        if (p + 1 < pixelCount && samePixel(u8, p << 2, (p + 1) << 2)) break;
        p++;
      }
      const litCount = p - litStart;
      out.push(litCount - 1);
      for (let k = litStart; k < p; k++) {
        const idx = k << 2;
        out.push(u8[idx], u8[idx + 1], u8[idx + 2], u8[idx + 3]);
      }
    }
  }

  return RLE_PREFIX + u8ToB64(new Uint8Array(out));
}

function decodePixelsRle(encoded: string): Uint8ClampedArray<ArrayBuffer> {
  const bytes = b64ToU8(encoded.slice(RLE_PREFIX.length));
  if (bytes.length < 4) return new Uint8ClampedArray(0);
  const pixelCount =
    (bytes[0] | (bytes[1] << 8) | (bytes[2] << 16) | (bytes[3] << 24)) >>> 0;
  const out = new Uint8ClampedArray(pixelCount * 4);

  let pos = 4;
  let dst = 0;
  while (pos < bytes.length && dst < out.length) {
    const header = bytes[pos++];
    if (header >= 128) {
      const count = header - 128 + 2;
      const r = bytes[pos++] ?? 0;
      const g = bytes[pos++] ?? 0;
      const b = bytes[pos++] ?? 0;
      const a = bytes[pos++] ?? 0;
      for (let k = 0; k < count && dst < out.length; k++) {
        out[dst++] = r;
        out[dst++] = g;
        out[dst++] = b;
        out[dst++] = a;
      }
    } else {
      const count = header + 1;
      const byteLen = count * 4;
      const end = Math.min(bytes.length, pos + byteLen);
      while (pos < end && dst < out.length) {
        out[dst++] = bytes[pos++];
      }
    }
  }
  return out;
}

function encodePatch(p?: ErasePatch): void {
  if (p?.pixels instanceof Uint8ClampedArray) {
    (p as { pixels: unknown }).pixels = encodePixelsRle(p.pixels);
  }
}

export function encodeErasePatches(items: DialogueItem[]): void {
  for (const d of items) {
    encodePatch(d.erasePatch);
    encodePatch(d.bubblePatch);
    if (d.erasePatches) {
      for (const p of d.erasePatches) encodePatch(p);
    }
  }
}

export function decodePixels(pixels: unknown): Uint8ClampedArray<ArrayBuffer> {
  if (pixels instanceof Uint8ClampedArray) return pixels as Uint8ClampedArray<ArrayBuffer>;
  if (typeof pixels === 'string') {
    return pixels.startsWith(RLE_PREFIX) ? decodePixelsRle(pixels) : b64ToU8(pixels);
  }
  if (Array.isArray(pixels)) {
    return new Uint8ClampedArray(pixels as number[]) as Uint8ClampedArray<ArrayBuffer>;
  }
  if (pixels && typeof pixels === 'object') {
    const vals = Object.values(pixels as Record<string, number>);
    if (vals.length && typeof vals[0] === 'number') {
      return new Uint8ClampedArray(vals as number[]);
    }
  }
  return new Uint8ClampedArray(0);
}
