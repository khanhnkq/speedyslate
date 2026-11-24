export interface PixelRegion {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

export interface RegionSample {
  isDark: boolean;
  bgHex: string;
  luma: number;
  lumaStdDev: number;
}

/**
 * Samples the outer ring of a crop region (where bubble background lives,
 * not glyph strokes) and returns median background color + luma stats.
 * Structural type: real ImageData satisfies PixelRegion, so workers can
 * pass getImageData() results directly while tests use plain objects.
 */
export class ColorSampler {
  static analyzeRegion(r: PixelRegion, ringFrac: number = 0.18): RegionSample {
    const w = r.width;
    const h = r.height;
    if (w <= 0 || h <= 0 || r.data.length < w * h * 4) {
      return { isDark: false, bgHex: '#ffffff', luma: 255, lumaStdDev: 0 };
    }

    const ring = Math.max(1, Math.round(Math.min(w, h) * ringFrac));
    const rs: number[] = [];
    const gs: number[] = [];
    const bs: number[] = [];
    const lumas: number[] = [];

    const push = (x: number, y: number) => {
      const i = (y * w + x) * 4;
      const R = r.data[i];
      const G = r.data[i + 1];
      const B = r.data[i + 2];
      rs.push(R);
      gs.push(G);
      bs.push(B);
      lumas.push(0.299 * R + 0.587 * G + 0.114 * B);
    };

    for (let x = 0; x < w; x += 3) {
      for (let k = 0; k < ring; k++) {
        push(x, k);
        push(x, h - 1 - k);
      }
    }
    for (let y = ring; y < h - ring; y += 3) {
      for (let k = 0; k < ring; k++) {
        push(k, y);
        push(w - 1 - k, y);
      }
    }

    if (lumas.length === 0) {
      return { isDark: false, bgHex: '#ffffff', luma: 255, lumaStdDev: 0 };
    }

    const medR = median(rs);
    const medG = median(gs);
    const medB = median(bs);
    const luma = lumas.reduce((a, b) => a + b, 0) / lumas.length;
    const variance = lumas.reduce((a, b) => a + (b - luma) * (b - luma), 0) / lumas.length;

    return {
      isDark: luma < 105,
      bgHex: `#${hex(medR)}${hex(medG)}${hex(medB)}`,
      luma,
      lumaStdDev: Math.sqrt(variance)
    };
  }
}

function median(values: number[]): number {
  const sorted = values.slice().sort((a, b) => a - b);
  const mid = sorted.length >> 1;
  return sorted.length % 2 === 0
    ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
    : sorted[mid];
}

function hex(v: number): string {
  return Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0');
}
