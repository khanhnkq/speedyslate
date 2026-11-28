import { buildDarkProximityMask } from './erase-mask-utils';

export interface InnerTextRect { x0: number; y0: number; x1: number; y1: number; }

export interface BorderShieldResult {
  shield: Uint8Array;
  rowWallLeft: Int16Array;
  rowWallRight: Int16Array;
  colWallTop: Int16Array;
  colWallBot: Int16Array;
}

interface PerimeterComponent {
  pixels: number[];
  minX: number; maxX: number; minY: number; maxY: number;
  touchTop: boolean; touchBot: boolean; touchLeft: boolean; touchRight: boolean;
  hitsGapTop: boolean; hitsGapBot: boolean;
}

const medianSorted = (vals: number[]): number => {
  vals.sort((a, b) => a - b);
  return vals[vals.length >> 1];
};

function extractComponent(
  startIdx: number, w: number, h: number, y0: number, y1: number, dilMargin: number,
  visited: Uint8Array, queue: Int32Array, isCand: (idx: number) => boolean
): PerimeterComponent {
  let qh = 0, qt = 0;
  visited[startIdx] = 1;
  queue[qt++] = startIdx;
  const pixels: number[] = [];
  let minX = w, maxX = -1, minY = h, maxY = -1;
  let touchTop = false, touchBot = false, touchLeft = false, touchRight = false;
  let hitsGapTop = false, hitsGapBot = false;
  const topLo = Math.max(0, y0 - dilMargin), topHi = Math.min(h - 1, y0);
  const botLo = Math.max(0, y1 - 1), botHi = Math.min(h - 1, y1 + dilMargin - 1);

  while (qh < qt) {
    const idx = queue[qh++];
    pixels.push(idx);
    const x = idx % w, y = (idx / w) | 0;
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
    if (y === 0) touchTop = true; if (y === h - 1) touchBot = true;
    if (x === 0) touchLeft = true; if (x === w - 1) touchRight = true;
    if (y >= topLo && y <= topHi) hitsGapTop = true;
    if (y >= botLo && y <= botHi) hitsGapBot = true;

    for (let dy = -1; dy <= 1; dy++) {
      const ny = y + dy;
      if (ny < 0 || ny >= h) continue;
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        if (nx < 0 || nx >= w) continue;
        const nIdx = ny * w + nx;
        if (!visited[nIdx] && isCand(nIdx)) { visited[nIdx] = 1; queue[qt++] = nIdx; }
      }
    }
  }
  return { pixels, minX, maxX, minY, maxY, touchTop, touchBot, touchLeft, touchRight, hitsGapTop, hitsGapBot };
}

function windowMedian(vals: Int16Array, maxA: Int16Array, lo: number, hi: number): number | null {
  const win: number[] = [];
  const a = Math.max(0, lo), b = Math.min(vals.length - 1, hi);
  for (let i = a; i <= b; i++) if (maxA[i] >= 0) win.push(vals[i]);
  return win.length > 0 ? medianSorted(win) : null;
}

function shieldAxisRegion(
  pixels: number[], w: number, axisLen: number, useY: boolean,
  midVal: number, isLowSide: boolean, clampByMid: boolean,
  shield: Uint8Array, lowWall: Int16Array, highWall: Int16Array
): void {
  if (pixels.length === 0) return;
  const minA = new Int16Array(axisLen).fill(0x7fff);
  const maxA = new Int16Array(axisLen).fill(-1);
  for (let k = 0; k < pixels.length; k++) {
    const idx = pixels[k], x = idx % w, y = (idx / w) | 0;
    const key = useY ? y : x, val = useY ? x : y;
    if (val < minA[key]) minA[key] = val;
    if (val > maxA[key]) maxA[key] = val;
  }

  // Anchor strictly on the inner face (maxA for low side, minA for high side) and
  // carve out only narrow (<=10px) welded-glyph protrusions relative to [k-14..k-6] & [k+6..k+14].
  const cutoff = new Int16Array(axisLen);
  for (let k = 0; k < axisLen; k++) {
    if (maxA[k] < 0) continue;
    const inner = isLowSide ? maxA[k] : minA[k];
    const above = windowMedian(isLowSide ? maxA : minA, maxA, k - 14, k - 6);
    const below = windowMedian(isLowSide ? maxA : minA, maxA, k + 6, k + 14);
    if (above !== null && below !== null) {
      const isSpike = isLowSide ? inner > Math.max(above, below) + 3 : inner < Math.min(above, below) - 3;
      const interp = Math.round((above + below) * 0.5) + (isLowSide ? 1 : -1);
      cutoff[k] = isSpike ? interp : inner;
    } else {
      cutoff[k] = inner;
    }
  }

  for (let k = 0; k < pixels.length; k++) {
    const idx = pixels[k], x = idx % w, y = (idx / w) | 0;
    const key = useY ? y : x, val = useY ? x : y;
    if (maxA[key] < 0) continue;
    if (isLowSide && val <= cutoff[key]) {
      shield[idx] = 1;
      if ((!clampByMid || val < midVal) && val > lowWall[key]) lowWall[key] = val;
    } else if (!isLowSide && val >= cutoff[key]) {
      shield[idx] = 1;
      if ((!clampByMid || val > midVal) && val < highWall[key]) highWall[key] = val;
    }
  }
}

function fillSinglePixelGaps(arr: Int16Array, emptyVal: number, takeMin: boolean): void {
  const orig = arr.slice();
  for (let i = 1; i < arr.length - 1; i++) {
    if (orig[i] === emptyVal && orig[i - 1] !== emptyVal && orig[i + 1] !== emptyVal) {
      arr[i] = takeMin ? Math.min(orig[i - 1], orig[i + 1]) : Math.max(orig[i - 1], orig[i + 1]);
    }
  }
}

/**
 * Computes a curvature-aware border shield and per-row/per-column inner wall bounds
 * by tracing 8-connected perimeter stroke components anchored on their inner faces.
 */
export function computeCurvedBorderShield(
  lumas: Uint8Array, tm: Float32Array, localBg: number, w: number, h: number,
  innerRect?: InnerTextRect, nearDark?: Uint8Array
): BorderShieldResult {
  const total = w * h;
  const shield = new Uint8Array(total);
  const rowWallLeft = new Int16Array(h).fill(-1);
  const rowWallRight = new Int16Array(h).fill(w);
  const colWallTop = new Int16Array(w).fill(-1);
  const colWallBot = new Int16Array(w).fill(h);

  const darkNear = innerRect && localBg > 127 ? (nearDark ?? buildDarkProximityMask(lumas, w, h, 75, 5)) : null;
  const isCand = (i: number): boolean => {
    const l = lumas[i];
    if (Math.abs(l - localBg) <= (innerRect ? 38 : 50)) return false;
    if (darkNear && l > localBg && darkNear[i]) return false;
    return innerRect ? true : tm[i] < 0.25;
  };
  const visited = new Uint8Array(total), queue = new Int32Array(total);
  const dilMargin = 5;
  const rY0 = innerRect ? Math.max(0, Math.min(h - 1, innerRect.y0)) : 0;
  const rY1 = innerRect ? Math.max(rY0 + 1, Math.min(h, innerRect.y1)) : h;

  const components: PerimeterComponent[] = [];
  const trySeed = (idx: number) => {
    if (!visited[idx] && isCand(idx)) components.push(extractComponent(idx, w, h, rY0, rY1, dilMargin, visited, queue, isCand));
  };
  for (let x = 0; x < w; x++) { trySeed(x); trySeed((h - 1) * w + x); }
  for (let y = 0; y < h; y++) { trySeed(y * w); trySeed(y * w + w - 1); }

  if (!innerRect) {
    for (const comp of components) for (let k = 0; k < comp.pixels.length; k++) shield[comp.pixels[k]] = 1;
    return { shield, rowWallLeft, rowWallRight, colWallTop, colWallBot };
  }

  const midX = (innerRect.x0 + innerRect.x1) * 0.5, midY = (innerRect.y0 + innerRect.y1) * 0.5;
  const gapTopY = Math.max(0, innerRect.y0 - 2), gapBotY = Math.min(h - 1, innerRect.y1 + 1);
  const rectH = innerRect.y1 - innerRect.y0;

  for (const c of components) {
    const spanX = c.maxX - c.minX + 1, spanY = c.maxY - c.minY + 1;
    const isSideWall = (c.minY <= gapTopY && c.maxY >= gapBotY) || ((c.touchLeft || c.touchRight) && spanY >= Math.max(10, rectH * 0.45));
    const isCornerBridge = spanX >= 8 && spanY >= 8 && ((c.touchTop && (c.touchLeft || c.touchRight) && c.hitsGapTop && c.maxY >= innerRect.y0 - dilMargin) || (c.touchBot && (c.touchLeft || c.touchRight) && c.hitsGapBot && c.minY <= innerRect.y1 + dilMargin - 1));
    const isArchWall = (c.touchLeft && c.touchRight) || ((c.touchTop || c.touchBot) && spanX >= Math.max(24, w * 0.48) && ((c.hitsGapTop && c.maxY >= innerRect.y0 - dilMargin) || (c.hitsGapBot && c.minY <= innerRect.y1 + dilMargin - 1)));
    if (!isSideWall && !isCornerBridge && !isArchWall) continue;

    let sumX = 0, sumY = 0;
    for (let k = 0; k < c.pixels.length; k++) { sumX += c.pixels[k] % w; sumY += (c.pixels[k] / w) | 0; }
    const meanX = sumX / c.pixels.length, meanY = sumY / c.pixels.length;

    if (isSideWall || spanY >= spanX * 0.8) {
      const lMax = new Int16Array(h).fill(-1), rMin = new Int16Array(h).fill(w);
      for (let k = 0; k < c.pixels.length; k++) {
        const x = c.pixels[k] % w, y = (c.pixels[k] / w) | 0;
        if (x < midX - 8 && x > lMax[y]) lMax[y] = x;
        if (x > midX + 8 && x < rMin[y]) rMin[y] = x;
      }
      let dualRows = 0;
      for (let y = 0; y < h; y++) if (lMax[y] >= 0 && rMin[y] < w && rMin[y] - lMax[y] > 8) dualRows++;

      if (!c.touchLeft && !c.touchRight && spanX > 16 && dualRows < 4 && c.minX < innerRect.x1 - 12 && c.maxX > innerRect.x0 + 12) {
        continue;
      }

      if ((c.touchLeft && c.touchRight) || dualRows >= 4) {
        const leftPx: number[] = [], rightPx: number[] = [];
        const hasPx = new Uint8Array(total);
        for (let k = 0; k < c.pixels.length; k++) {
          const idx = c.pixels[k], x = idx % w;
          hasPx[idx] = 1;
          if (x < midX) leftPx.push(idx); else rightPx.push(idx);
        }
        const topPx: number[] = [], botPx: number[] = [];
        let topMid = false, botMid = false;
        for (let x = c.minX; x <= c.maxX; x++) {
          for (let y = c.minY; y < midY && hasPx[y * w + x]; y++) {
            topPx.push(y * w + x);
            if (y < innerRect.y0 && Math.abs(x - midX) <= 6) topMid = true;
          }
          for (let y = c.maxY; y >= midY && hasPx[y * w + x]; y--) {
            botPx.push(y * w + x);
            if (y >= innerRect.y1 && Math.abs(x - midX) <= 6) botMid = true;
          }
        }
        shieldAxisRegion(leftPx, w, h, true, midX, true, true, shield, rowWallLeft, rowWallRight);
        shieldAxisRegion(rightPx, w, h, true, midX, false, true, shield, rowWallLeft, rowWallRight);
        if (topMid) shieldAxisRegion(topPx, w, w, false, midY, true, true, shield, colWallTop, colWallBot);
        if (botMid) shieldAxisRegion(botPx, w, w, false, midY, false, true, shield, colWallTop, colWallBot);
      } else {
        shieldAxisRegion(c.pixels, w, h, true, midX, meanX < midX, false, shield, rowWallLeft, rowWallRight);
      }
    } else {
      shieldAxisRegion(c.pixels, w, w, false, midY, meanY < midY, false, shield, colWallTop, colWallBot);
    }
  }

  fillSinglePixelGaps(rowWallLeft, -1, true);
  fillSinglePixelGaps(rowWallRight, w, false);
  fillSinglePixelGaps(colWallTop, -1, true);
  fillSinglePixelGaps(colWallBot, h, false);
  return { shield, rowWallLeft, rowWallRight, colWallTop, colWallBot };
}
