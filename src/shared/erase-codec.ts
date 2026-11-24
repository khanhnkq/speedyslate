import { DialogueItem, ErasePatch } from './types';

/**
 * TypedArrays do NOT survive browser.runtime.sendMessage on Chrome
 * (messages are JSON-serialized -> Uint8ClampedArray becomes {} and the
 * renderer's ImageData() throws "input data has zero elements").
 * Patch pixels are therefore base64-encoded before every sendMessage hop
 * and decoded once inside the content-script renderer.
 */

const B64_CHUNK = 0x8000;

function u8ToB64(u8: Uint8ClampedArray): string {
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

function encodePatch(p?: ErasePatch): void {
  if (p?.pixels instanceof Uint8ClampedArray) {
    (p as { pixels: unknown }).pixels = u8ToB64(p.pixels);
  }
}

/**
 * In-place encode all pixel patches on dialogue items so they survive
 * runtime.sendMessage JSON serialization. Idempotent: already-encoded
 * strings are skipped.
 */
export function encodeErasePatches(items: DialogueItem[]): void {
  for (const d of items) {
    encodePatch(d.erasePatch);
    encodePatch(d.bubblePatch);
    if (d.erasePatches) {
      for (const p of d.erasePatches) encodePatch(p);
    }
  }
}

/**
 * Normalize transported pixel data back to Uint8ClampedArray.
 * Handles base64 strings (Chrome hops), real typed arrays (worker
 * postMessage / harness), and plain number arrays (Firefox quirk paths).
 */
export function decodePixels(pixels: unknown): Uint8ClampedArray<ArrayBuffer> {
  if (pixels instanceof Uint8ClampedArray) return pixels as Uint8ClampedArray<ArrayBuffer>;
  if (typeof pixels === 'string') return b64ToU8(pixels);
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
