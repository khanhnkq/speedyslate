import { ErasePatchDbg } from './erase-masker';

/**
 * Dialogue-level bubble interior repaint.
 *
 * Line-level glyph masking leaves residue — AA fringes at the mask edge and
 * ink specks sitting in the gaps between line crops, outside every patch.
 * This filler repaints the WHOLE enclosed interior instead:
 *
 *   1. `ink`   = pixels decisively darker/lighter than the crop median —
 *                glyph strokes, border lines, art texture all count.
 *   2. `interior` = flood fill from seeds in the crop's centre through
 *                non-ink pixels — it flows around glyphs without touching
 *                them and is stopped cold by border strokes.
 *   3. `outside`  = flood fill from the crop boundary through non-interior
 *                pixels — everything the boundary can see.
 *   4. Paint zone = !outside = interior ∪ enclosed holes. Glyph bodies and
 *                dust specks are holes inside the interior, so they are
 *                repainted too; borders and outside art stay untouched.
 *
 * The patch is only emitted when the interior is provably uniform
 * (low luma variance, sane area, ink share inside the paint zone below
 * the leak threshold). Otherwise the caller falls back to per-line
 * patches — textured narration and free text on art are not bubbles.
 */
export class BubbleFiller {
  /**
   * Build a whole-interior repaint patch, or null when not a clean bubble.
   * `lineBoxes` (page coords of member text lines) bounds the paint zone:
   * only interior within ~25px of real text is repainted, so a flood that
   * leaks through a border gap into open art (white clothes touching the
   * bubble, panel margins) gets clipped instead of bleeding outward.
   */
  static buildBubblePatch(
    img: ImageData,
    pageX: number,
    pageY: number,
    lineBoxes?: { x: number; y: number; width: number; height: number }[],
    chamberBox?: { x: number; y: number; width: number; height: number }
  ): ErasePatchDbg | null {
    const w = img.width;
    const h = img.height;
    const total = w * h;
    const data = img.data;

    const lumas = new Uint8Array(total);
    for (let i = 0; i < total; i++) {
      const p = i * 4;
      lumas[i] = (data[p] * 77 + data[p + 1] * 150 + data[p + 2] * 29) >> 8;
    }
    // Compute paper median strictly inside the inner 50% core (never polluted
    // by dark hair/screentone in the outer safety margin around narrow bubbles).
    const coreSamples: number[] = [];
    const mx0 = Math.floor(w * 0.25), mx1 = Math.ceil(w * 0.75);
    const my0 = Math.floor(h * 0.25), my1 = Math.ceil(h * 0.75);
    for (let yy = my0; yy < my1; yy++) {
      for (let xx = mx0; xx < mx1; xx++) {
        coreSamples.push(lumas[yy * w + xx]);
      }
    }
    coreSamples.sort((a, b) => a - b);
    const med = coreSamples.length > 0 ? coreSamples[coreSamples.length >> 1] : 240;

    // Ink = decisive deviation from the dominant interior tone.
    const ink = new Uint8Array(total);
    for (let i = 0; i < total; i++) {
      if (Math.abs(lumas[i] - med) > 45) ink[i] = 1;
    }

    // 1px morphological barrier dilation welds 2-3px halftone screentone dots
    // into an impenetrable wall so flood-fill cannot weave between dots outside
    // a broken/dashed speech-bubble outline!
    const barrier = new Uint8Array(total);
    for (let yy = 0; yy < h; yy++) {
      for (let xx = 0; xx < w; xx++) {
        const i = yy * w + xx;
        if (!ink[i]) continue;
        for (let dy = -1; dy <= 1; dy++) {
          const ny = yy + dy;
          if (ny < 0 || ny >= h) continue;
          for (let dx = -1; dx <= 1; dx++) {
            const nx = xx + dx;
            if (nx >= 0 && nx < w) barrier[ny * w + nx] = 1;
          }
        }
      }
    }

    // Interior flood — seeds are the non-barrier pixels of the centre band.
    const interior = new Uint8Array(total);
    const queue = new Int32Array(total);
    let qh = 0;
    let qt = 0;
    const ix0 = Math.floor(w * 0.3);
    const ix1 = Math.ceil(w * 0.7);
    const iy0 = Math.floor(h * 0.3);
    const iy1 = Math.ceil(h * 0.7);
    for (let yy = iy0; yy < iy1; yy++) {
      for (let xx = ix0; xx < ix1; xx++) {
        const i = yy * w + xx;
        if (!barrier[i] && !interior[i]) {
          interior[i] = 1;
          queue[qt++] = i;
        }
      }
    }
    let touchesCropEdge = 0;
    while (qh < qt) {
      const i = queue[qh++];
      const xx = i % w;
      const yy = (i / w) | 0;
      if (xx === 0 || xx === w - 1 || yy === 0 || yy === h - 1) touchesCropEdge++;
      if (xx > 0 && !barrier[i - 1] && !interior[i - 1]) { interior[i - 1] = 1; queue[qt++] = i - 1; }
      if (xx < w - 1 && !barrier[i + 1] && !interior[i + 1]) { interior[i + 1] = 1; queue[qt++] = i + 1; }
      if (yy > 0 && !barrier[i - w] && !interior[i - w]) { interior[i - w] = 1; queue[qt++] = i - w; }
      if (yy < h - 1 && !barrier[i + w] && !interior[i + w]) { interior[i + w] = 1; queue[qt++] = i + w; }
    }
    const interiorArea = qt;
    // Open/broken border guard: a closed bubble never floods out to the crop boundary
    if (interiorArea < total * 0.08 || touchesCropEdge > 2) return null;

    // Expand 1px from barrier-stopped `interior` up to the true non-ink paper edge
    const baseInterior = interior.slice();
    for (let yy = 0; yy < h; yy++) {
      for (let xx = 0; xx < w; xx++) {
        const i = yy * w + xx;
        if (baseInterior[i] || ink[i]) continue;
        if (
          (xx > 0 && interior[i - 1]) ||
          (xx < w - 1 && interior[i + 1]) ||
          (yy > 0 && interior[i - w]) ||
          (yy < h - 1 && interior[i + w])
        ) {
          baseInterior[i] = 1;
        }
      }
    }

    // Euclidean Disk Morphological Closing (R = 5px) on `baseInterior`:
    // Swallows 2-5px glyph strokes welded directly onto the inner bubble wall
    // ('D' in DECIDED, 'T' in HONEST, 'Y'/'S' in YES) while moving the smooth
    // outer convex bubble border by 0.0 pixels!
    const closeR = 5;
    const closeR2 = closeR * closeR;
    const pw = w + closeR * 2;
    const ph = h + closeR * 2;
    const dilated = new Uint8Array(pw * ph);
    for (let yy = 0; yy < h; yy++) {
      for (let xx = 0; xx < w; xx++) {
        if (!baseInterior[yy * w + xx]) continue;
        const cy = yy + closeR;
        const cx = xx + closeR;
        for (let dy = -closeR; dy <= closeR; dy++) {
          const rOff = (cy + dy) * pw + cx;
          for (let dx = -closeR; dx <= closeR; dx++) {
            if (dx * dx + dy * dy <= closeR2) dilated[rOff + dx] = 1;
          }
        }
      }
    }
    const closedInterior = new Uint8Array(total);
    for (let yy = 0; yy < h; yy++) {
      const cy = yy + closeR;
      for (let xx = 0; xx < w; xx++) {
        const cx = xx + closeR;
        let allSet = 1;
        for (let dy = -closeR; dy <= closeR && allSet; dy++) {
          const rOff = (cy + dy) * pw + cx;
          for (let dx = -closeR; dx <= closeR; dx++) {
            if (dx * dx + dy * dy <= closeR2 && !dilated[rOff + dx]) {
              allSet = 0;
              break;
            }
          }
        }
        closedInterior[yy * w + xx] = allSet;
      }
    }

    // Outside flood — boundary seeds over non-closedInterior pixels. Whatever
    // stays unmarked is closedInterior or an enclosed glyph counter -> paint zone.
    const outside = new Uint8Array(total);
    const oq = new Int32Array(total);
    let oqh = 0;
    let oqt = 0;
    const seedEdge = (i: number) => {
      if (!closedInterior[i] && !outside[i]) { outside[i] = 1; oq[oqt++] = i; }
    };
    for (let xx = 0; xx < w; xx++) { seedEdge(xx); seedEdge((h - 1) * w + xx); }
    for (let yy = 0; yy < h; yy++) { seedEdge(yy * w); seedEdge(yy * w + w - 1); }
    while (oqh < oqt) {
      const i = oq[oqh++];
      const xx = i % w;
      const yy = (i / w) | 0;
      if (xx > 0 && !closedInterior[i - 1] && !outside[i - 1]) { outside[i - 1] = 1; oq[oqt++] = i - 1; }
      if (xx < w - 1 && !closedInterior[i + 1] && !outside[i + 1]) { outside[i + 1] = 1; oq[oqt++] = i + 1; }
      if (yy > 0 && !closedInterior[i - w] && !outside[i - w]) { outside[i - w] = 1; oq[oqt++] = i - w; }
      if (yy < h - 1 && !closedInterior[i + w] && !outside[i + w]) { outside[i + w] = 1; oq[oqt++] = i + w; }
    }

    // Interior statistics over non-ink pixels: uniformity + mean colour.
    let n = 0;
    let sum = 0;
    let sumSq = 0;
    let accR = 0;
    let accG = 0;
    let accB = 0;
    for (let i = 0; i < total; i++) {
      if (!interior[i] || ink[i]) continue;
      const l = lumas[i];
      sum += l;
      sumSq += l * l;
      const p = i * 4;
      accR += data[p];
      accG += data[p + 1];
      accB += data[p + 2];
      n++;
    }
    if (n === 0) return null;
    const mean = sum / n;
    const stddev = Math.sqrt(Math.max(0, sumSq / n - mean * mean));
    if (stddev > 25) return null;

    // Paint zone = interior ∪ enclosed holes, then clipped to ~25px around
    // the member text lines: a leak into open art (white clothes, margins)
    // lands far from text and is cut. No lines → clip against the crop.
    const clip = new Uint8Array(total);
    if (lineBoxes && lineBoxes.length > 0) {
      for (const lb of lineBoxes) {
        const x0 = Math.max(0, Math.floor(lb.x - pageX - 25));
        const y0 = Math.max(0, Math.floor(lb.y - pageY - 25));
        const x1 = Math.min(w, Math.ceil(lb.x - pageX + lb.width + 25));
        const y1 = Math.min(h, Math.ceil(lb.y - pageY + lb.height + 25));
        for (let yy = y0; yy < y1; yy++) {
          clip.fill(1, yy * w + x0, yy * w + x1);
        }
      }
      if (chamberBox && touchesCropEdge === 0) {
        const cx0 = Math.max(0, Math.floor(chamberBox.x - pageX));
        const cy0 = Math.max(0, Math.floor(chamberBox.y - pageY));
        const cx1 = Math.min(w, Math.ceil(chamberBox.x - pageX + chamberBox.width));
        const cy1 = Math.min(h, Math.ceil(chamberBox.y - pageY + chamberBox.height));
        for (let yy = cy0; yy < cy1; yy++) {
          clip.fill(1, yy * w + cx0, yy * w + cx1);
        }
      }
    } else {
      clip.fill(1);
    }

    // Leak check: ink share inside the paint zone. A clean bubble interior
    // is glyphs (≈10-30%); a flood leaking through a border gap drags whole
    // art fields in and the share explodes.
    let paintArea = 0;
    let paintInk = 0;
    let openClipContacts = 0;
    for (let i = 0; i < total; i++) {
      if (outside[i] || !clip[i]) continue;
      paintArea++;
      if (ink[i]) paintInk++;
      const xx = i % w;
      const yy = (i / w) | 0;
      if (
        (xx > 0 && !clip[i - 1] && !outside[i - 1]) ||
        (xx < w - 1 && !clip[i + 1] && !outside[i + 1]) ||
        (yy > 0 && !clip[i - w] && !outside[i - w]) ||
        (yy < h - 1 && !clip[i + w] && !outside[i + w])
      ) {
        openClipContacts++;
      }
    }
    // If interior hit the artificial clip wall (>4px), the bubble border had an open gap -> abort!
    if (paintArea < total * 0.05 || paintInk > paintArea * 0.4 || openClipContacts > 4) return null;

    const out = new Uint8ClampedArray(total * 4);
    const r = accR / n;
    const g = accG / n;
    const b = accB / n;
    for (let i = 0; i < total; i++) {
      if (outside[i] || !clip[i]) continue;
      // Retreat 1px only on non-welded paper touching outside ink so border AA stays crisp
      if (baseInterior[i]) {
        const xx = i % w;
        const yy = (i / w) | 0;
        if ((xx > 0 && ink[i - 1] && outside[i - 1]) ||
            (xx < w - 1 && ink[i + 1] && outside[i + 1]) ||
            (yy > 0 && ink[i - w] && outside[i - w]) ||
            (yy < h - 1 && ink[i + w] && outside[i + w])) {
          continue;
        }
      }
      const p = i * 4;
      out[p] = r;
      out[p + 1] = g;
      out[p + 2] = b;
      out[p + 3] = 255;
    }
    let coversLineInk = true;
    if (lineBoxes && lineBoxes.length > 0) {
      let totalLineInk = 0;
      let missedLineInk = 0;
      for (const lb of lineBoxes) {
        const lx0 = Math.max(0, Math.floor(lb.x - pageX) + 1);
        const ly0 = Math.max(0, Math.floor(lb.y - pageY) + 1);
        const lx1 = Math.min(w, Math.ceil(lb.x - pageX + lb.width) - 1);
        const ly1 = Math.min(h, Math.ceil(lb.y - pageY + lb.height) - 1);
        for (let yy = ly0; yy < ly1; yy++) {
          for (let xx = lx0; xx < lx1; xx++) {
            const idx = yy * w + xx;
            if (!ink[idx]) continue;
            totalLineInk++;
            if (out[idx * 4 + 3] === 0) missedLineInk++;
          }
        }
      }
      if (missedLineInk > 4 || (totalLineInk > 0 && missedLineInk > totalLineInk * 0.05)) {
        coversLineInk = false;
      }
    }
    return {
      x: pageX,
      y: pageY,
      width: w,
      height: h,
      pixels: out,
      dbg: { path: 'bubble', guided: true, risky: paintInk / paintArea, std: stddev, tmMax: 0, coversLineInk }
    };
  }
}
