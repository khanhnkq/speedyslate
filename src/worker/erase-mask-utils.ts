/**
 * Erase-mask helpers for EraseMasker: mask filtering and texture
 * connectivity tests. Kept separate so the masker stays under the 500-line
 * project limit (SRP — these are pure mask algorithms).
 */

/**
 * Despeckle (dense masks only) + connected-component filtering: keeps
 * letter-size blobs, drops giant art regions, edge-to-edge hatching
 * streaks, and speck-size screentone dots. Returns null when nothing
 * glyph-like survives.
 */
export function filterMask(
  src: Uint8Array,
  w: number,
  h: number,
  total: number,
  guided = false
): Uint8Array | null {
  const mask = new Uint8Array(total);
  let rawCount = 0;
  for (let i = 0; i < total; i++) rawCount += src[i];
  if (rawCount === 0) return null;
  const busy = rawCount > total * 0.25;
  if (busy) {
    for (let yy = 0; yy < h; yy++) {
      for (let xx = 0; xx < w; xx++) {
        const i = yy * w + xx;
        if (!src[i]) continue;
        let n = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (!dx && !dy) continue;
            const nx = xx + dx;
            const ny = yy + dy;
            if (nx >= 0 && nx < w && ny >= 0 && ny < h && src[ny * w + nx]) n++;
          }
        }
        if (n >= 3) mask[i] = 1;
      }
    }
  } else {
    mask.set(src);
  }
  let maskCount = 0;
  for (let i = 0; i < total; i++) maskCount += mask[i];
  if (maskCount === 0) mask.set(src);

  const compId = new Int32Array(total).fill(-1);
  const compArea: number[] = [];
  const compSpanW: number[] = [];
  const compSpanH: number[] = [];
  const compQueue = new Int32Array(total);
  for (let seed = 0; seed < total; seed++) {
    if (!mask[seed] || compId[seed] >= 0) continue;
    const id = compArea.length;
    let qh = 0, qt = 0, area = 0;
    let minX = w, maxX = 0, minY = h, maxY = 0;
    compId[seed] = id;
    compQueue[qt++] = seed;
    while (qh < qt) {
      const j = compQueue[qh++];
      const jx = j % w;
      const jy = (j / w) | 0;
      area++;
      if (jx < minX) minX = jx;
      if (jx > maxX) maxX = jx;
      if (jy < minY) minY = jy;
      if (jy > maxY) maxY = jy;
      if (jx > 0 && mask[j - 1] && compId[j - 1] < 0) { compId[j - 1] = id; compQueue[qt++] = j - 1; }
      if (jx < w - 1 && mask[j + 1] && compId[j + 1] < 0) { compId[j + 1] = id; compQueue[qt++] = j + 1; }
      if (jy > 0 && mask[j - w] && compId[j - w] < 0) { compId[j - w] = id; compQueue[qt++] = j - w; }
      if (jy < h - 1 && mask[j + w] && compId[j + w] < 0) { compId[j + w] = id; compQueue[qt++] = j + w; }
    }
    compArea.push(area);
    compSpanW.push(maxX - minX + 1);
    compSpanH.push(maxY - minY + 1);
  }
  // Guided masks already sit inside the detector-confirmed text region, so
  // merged letter clusters must survive (a cap here was punching glyph
  // holes that then repainted as speckles). Unguided masks keep the strict
  // anti-art limits.
  const maxComp = guided ? total * 0.5 : Math.min(700, total * 0.25);
  let filteredCount = 0;
  for (let i = 0; i < total; i++) {
    const id = compId[i];
    if (id < 0) continue;
    const spanStreak = !guided && busy &&
      ((compSpanW[id] > w * 0.8 && compSpanH[id] < h * 0.5) ||
       (compSpanH[id] > h * 0.8 && compSpanW[id] < w * 0.5));
    if (compArea[id] > maxComp || spanStreak || (busy && !guided && compArea[id] < 5)) {
      mask[i] = 0;
    } else {
      filteredCount++;
    }
  }
  return filteredCount > 0 ? mask : null;
}

/**
 * Proximity mask of REAL texture fields for preserve decisions.
 *
 * Real texture — screentone dot fields, art strokes, bubble borders —
 * continues past the crop boundary through dark pixels OUTSIDE the erase
 * zone. Missed-ink specks sit inside the erase zone and only neighbour
 * glyph pixels, so they can never reach the edge this way.
 *
 * `blocked` pixels (the erase mask `dil`) never conduct — earlier versions
 * let non-core glyph pixels conduct, and since a text line spans the crop
 * width, its own erased strokes bridged every adjacent speck to the edge.
 *
 * Returned mask = edge-connected texture comps grown 4px, so interior
 * candidate pixels immediately adjacent to an outside field (screentone
 * dots inside the erase zone) still count as preserved.
 */
export function edgeFieldMask(
  lumas: Uint8Array,
  bgRef: number,
  blocked: Uint8Array,
  w: number,
  h: number,
  growOut = 4
): Uint8Array {
  const total = w * h;
  const fused = new Uint8Array(total);
  // Conductors must be decisively dark (dev>60): the grey AA fringe band
  // (dev 40-60) around erased glyphs otherwise bridges every nearby speck
  // to the crop edge and it gets preserved as dust. Real texture —
  // near-black dots and strokes — conducts fine at this level.
  for (let i = 0; i < total; i++) {
    fused[i] = !blocked[i] && Math.abs(lumas[i] - bgRef) > 60 ? 1 : 0;
  }
  // 5px growth merges nearby dots/strokes into one field per component —
  // a dot grid is sparse, its members are only ~5-8px apart.
  for (let it = 0; it < 5; it++) {
    const prev = fused.slice();
    for (let yy = 0; yy < h; yy++) {
      for (let xx = 0; xx < w; xx++) {
        const i = yy * w + xx;
        if (prev[i]) continue;
        if ((xx > 0 && prev[i - 1]) || (xx < w - 1 && prev[i + 1]) ||
            (yy > 0 && prev[i - w]) || (yy < h - 1 && prev[i + w])) {
          fused[i] = 1;
        }
      }
    }
  }
  const edge = new Uint8Array(total);
  const queue = new Int32Array(total);
  let qh = 0, qt = 0;
  const seed = (i: number) => {
    if (fused[i] && !edge[i]) { edge[i] = 1; queue[qt++] = i; }
  };
  for (let xx = 0; xx < w; xx++) { seed(xx); seed((h - 1) * w + xx); }
  for (let yy = 0; yy < h; yy++) { seed(yy * w); seed(yy * w + w - 1); }
  while (qh < qt) {
    const i = queue[qh++];
    const xx = i % w;
    const yy = (i / w) | 0;
    if (xx > 0) seed(i - 1);
    if (xx < w - 1) seed(i + 1);
    if (yy > 0) seed(i - w);
    if (yy < h - 1) seed(i + w);
  }
  // Optionally grow so pixels adjacent to a real field are covered (donor
  // path preserves interior dots next to outside texture). Flat-fill uses
  // growOut=0 — grown coverage there would swallow glyph cores sitting
  // within 4px of their own AA fringe ring.
  const near = edge.slice();
  for (let it = 0; it < growOut; it++) {
    const prev = near.slice();
    for (let yy = 0; yy < h; yy++) {
      for (let xx = 0; xx < w; xx++) {
        const i = yy * w + xx;
        if (prev[i]) continue;
        if ((xx > 0 && prev[i - 1]) || (xx < w - 1 && prev[i + 1]) ||
            (yy > 0 && prev[i - w]) || (yy < h - 1 && prev[i + w])) {
          near[i] = 1;
        }
      }
    }
  }
  return near;
}

/**
 * O(w*h) 2D prefix-sum check marking every pixel within Chebyshev `radius`
 * of any dark pixel (`lumas[i] <= darkThresh`).
 */
export function buildDarkProximityMask(
  lumas: Uint8Array,
  w: number,
  h: number,
  darkThresh = 75,
  radius = 5
): Uint8Array {
  const pw = w + 1;
  const pref = new Int32Array(pw * (h + 1));
  for (let y = 0; y < h; y++) {
    let rowSum = 0;
    const rOff = y * w;
    const pOff = (y + 1) * pw;
    const prevOff = y * pw;
    for (let x = 0; x < w; x++) {
      if (lumas[rOff + x] <= darkThresh) rowSum++;
      pref[pOff + x + 1] = pref[prevOff + x + 1] + rowSum;
    }
  }
  const out = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    const y0 = Math.max(0, y - radius);
    const y1 = Math.min(h - 1, y + radius) + 1;
    for (let x = 0; x < w; x++) {
      const x0 = Math.max(0, x - radius);
      const x1 = Math.min(w - 1, x + radius) + 1;
      const cnt = pref[y1 * pw + x1] - pref[y0 * pw + x1] - pref[y1 * pw + x0] + pref[y0 * pw + x0];
      if (cnt > 0) out[y * w + x] = 1;
    }
  }
  return out;
}

/**
 * Resolves local background luminance inside `innerRect`, guarding against
 * `fuchidori` (bright white halo / bright fill + dark outline) hijacking the
 * histogram mode over a mid/light sky or artwork background.
 */
export function resolveInnerLocalBg(
  lumas: Uint8Array,
  nearDark: Uint8Array,
  w: number,
  h: number,
  rx0: number,
  ry0: number,
  rx1: number,
  ry1: number
): number {
  const bins = new Int32Array(16);
  for (let yy = ry0; yy < ry1; yy++) {
    for (let xx = rx0; xx < rx1; xx++) bins[lumas[yy * w + xx] >> 4]++;
  }
  let peakBin = 0;
  for (let b = 1; b < 16; b++) if (bins[b] > bins[peakBin]) peakBin = b;
  const modeSamples: number[] = [];
  for (let yy = ry0; yy < ry1; yy++) {
    for (let xx = rx0; xx < rx1; xx++) {
      const l = lumas[yy * w + xx];
      if (Math.abs((l >> 4) - peakBin) <= 1) modeSamples.push(l);
    }
  }
  modeSamples.sort((a, b) => a - b);
  const innerMode = modeSamples.length > 0 ? modeSamples[modeSamples.length >> 1] : 240;
  if (innerMode < 232) return innerMode;

  const boxTotal = (rx1 - rx0) * (ry1 - ry0);
  const brightLo = innerMode - 14;
  let brightTotal = 0;
  let brightNear = 0;
  const innerMidNonAA: number[] = [];

  for (let yy = ry0; yy < ry1; yy++) {
    for (let xx = rx0; xx < rx1; xx++) {
      const i = yy * w + xx;
      const l = lumas[i];
      if (l >= brightLo) {
        brightTotal++;
        if (nearDark[i]) brightNear++;
      } else if (l > 75) {
        let adjDark = false;
        for (let dy = -1; dy <= 1 && !adjDark; dy++) {
          const ny = yy + dy;
          if (ny < 0 || ny >= h) continue;
          for (let dx = -1; dx <= 1; dx++) {
            const nx = xx + dx;
            if (nx >= 0 && nx < w && lumas[ny * w + nx] <= 75) { adjDark = true; break; }
          }
        }
        if (!adjDark) innerMidNonAA.push(l);
      }
    }
  }

  if (brightTotal < 16 || brightNear / brightTotal < 0.80) return innerMode;
  if (innerMidNonAA.length < Math.max(8, boxTotal * 0.02)) return innerMode;

  const outerMidClean: number[] = [];
  let outerBrightClean = 0;
  for (let yy = 0; yy < h; yy++) {
    for (let xx = 0; xx < w; xx++) {
      const inOuter = yy < ry0 - 4 || yy >= ry1 + 4 || xx < rx0 - 4 || xx >= rx1 + 4;
      if (!inOuter) continue;
      const i = yy * w + xx;
      if (nearDark[i]) continue;
      const l = lumas[i];
      if (l >= innerMode - 10) outerBrightClean++;
      else if (l > 75 && l <= brightLo) outerMidClean.push(l);
    }
  }

  if (outerMidClean.length < 24 || outerMidClean.length <= outerBrightClean * 1.5) return innerMode;
  const combined = outerMidClean.concat(innerMidNonAA).sort((a, b) => a - b);
  return combined[combined.length >> 1];
}

/**
 * Adds bright glyph cores enclosed by dark glyph outlines (dual-polarity
 * `fuchidori` text on bright/mid paper) into `raw` without touching background.
 */
export function fillEnclosedBrightCores(
  raw: Uint8Array,
  lumas: Uint8Array,
  localBg: number,
  otsuT: number,
  inside: Uint8Array,
  borderShield: Uint8Array,
  w: number,
  h: number
): void {
  if (localBg <= 127 || localBg >= 246) return;
  const total = w * h;
  const outlineThresh = Math.min(localBg - 12, Math.max(otsuT, localBg - 24));
  const brightCoreThresh = localBg + 10;
  const bgReachable = new Uint8Array(total);
  const q = new Int32Array(total);
  let qh = 0, qt = 0;

  const trySeed = (i: number) => {
    if (!bgReachable[i] && !borderShield[i] && lumas[i] > outlineThresh && lumas[i] <= localBg + 8) {
      bgReachable[i] = 1;
      q[qt++] = i;
    }
  };
  for (let xx = 0; xx < w; xx++) { trySeed(xx); trySeed((h - 1) * w + xx); }
  for (let yy = 0; yy < h; yy++) { trySeed(yy * w); trySeed(yy * w + w - 1); }
  for (let i = 0; i < total; i++) {
    if (!inside[i]) trySeed(i);
  }

  while (qh < qt) {
    const i = q[qh++];
    const x = i % w, y = (i / w) | 0;
    const step = (ni: number) => {
      if (!bgReachable[ni] && !borderShield[ni] && lumas[ni] > outlineThresh) {
        bgReachable[ni] = 1;
        q[qt++] = ni;
      }
    };
    if (x > 0) step(i - 1);
    if (x < w - 1) step(i + 1);
    if (y > 0) step(i - w);
    if (y < h - 1) step(i + w);
  }

  for (let i = 0; i < total; i++) {
    if (inside[i] && !borderShield[i] && !bgReachable[i] && lumas[i] >= brightCoreThresh) {
      raw[i] = 1;
    }
  }
}
