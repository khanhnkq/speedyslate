import { ErasePatch } from '../shared/types';
import { filterMask, edgeFieldMask } from './erase-mask-utils';
import { InpaintSolver } from './inpaint-solver';
import { PolygonDeskew } from './polygon-deskew';

export interface ErasePatchDbg extends ErasePatch {
  dbg?: { path: string; risky?: number; std?: number; guided?: boolean; tmMax?: number };
}

/**
 * EraseMasker: Builds a pixel-level erase patch for one text-line crop.
 * Otsu separates glyph pixels (minority class), the mask is dilated 1px to
 * cover anti-aliased edges, then masked pixels are refilled by iterative
 * neighbour diffusion — artwork and bubble shape stay completely untouched.
 * When Otsu is unreliable the patch falls back to a flat sampled-bg fill so
 * every line still gets covered. SRP & strictly < 500 lines.
 */
export class EraseMasker {
  /**
   * Returns an RGBA patch positioned at (x,y) on the source image, or null
   * for degenerate crops. `img` must be the exact crop of (x,y,w,h).
   */
  public static buildPatch(
    img: ImageData,
    x: number,
    y: number,
    bgHex?: string,
    textMap?: Float32Array,
    textMapW?: number,
    localQuad?: [number, number][]
  ): ErasePatchDbg | null {
    const w = img.width;
    const h = img.height;
    const total = w * h;
    if (total < 16) return null;
    const data = img.data;

    // 1. Otsu threshold on luma
    const lumas = new Uint8Array(total);
    const hist = new Int32Array(256);
    for (let i = 0; i < total; i++) {
      const p = i * 4;
      const l = (data[p] * 299 + data[p + 1] * 587 + data[p + 2] * 114) / 1000;
      lumas[i] = l | 0;
      hist[l | 0]++;
    }
    let sumAll = 0;
    for (let t = 0; t < 256; t++) sumAll += t * hist[t];
    let sumB = 0;
    let wB = 0;
    let maxVar = -1;
    let otsuT = 128;
    for (let t = 0; t < 256; t++) {
      wB += hist[t];
      if (wB === 0) continue;
      const wF = total - wB;
      if (wF === 0) break;
      sumB += t * hist[t];
      const mB = sumB / wB;
      const mF = (sumAll - sumB) / wF;
      const v = wB * wF * (mB - mF) * (mB - mF);
      if (v > maxVar) { maxVar = v; otsuT = t; }
    }
    let below = 0;
    for (let t = 0; t <= otsuT; t++) below += hist[t];

    const out = new Uint8ClampedArray(total * 4);
    const flatFill = (pixels: Uint8Array, hex?: string): ErasePatchDbg | null => {
      const rgb = EraseMasker.hexToRgb(hex);
      if (!rgb) return null;
      for (let i = 0; i < total; i++) {
        if (!pixels[i]) continue;
        const p = i * 4;
        out[p] = rgb[0]; out[p + 1] = rgb[1]; out[p + 2] = rgb[2]; out[p + 3] = 255;
      }
      return { x, y, width: w, height: h, pixels: out, dbg: { path: 'rawflat', guided: guidedActive } };
    };
    // No whole-crop flat fallback: a solid rect over artwork is exactly the
    // "sticker" artefact to avoid. Borderline Otsu still goes through the
    // mask pipeline below.

    // 2. Text mask = pixels far from the sampled background colour. Minority
    //    class is wrong on textured crops (art fills the minority side, we
    //    would erase art and paint it light); bgColour anchors real polarity.
    const bgRgbForMask = EraseMasker.hexToRgb(bgHex);
    const raw = new Uint8Array(total);
    if (bgRgbForMask) {
      const bgL = (bgRgbForMask[0] * 299 + bgRgbForMask[1] * 587 + bgRgbForMask[2] * 114) / 1000;
      for (let i = 0; i < total; i++) {
        raw[i] = Math.abs(lumas[i] - bgL) > 60 ? 1 : 0;
      }
    } else {
      const textIsDark = below <= total / 2;
      for (let i = 0; i < total; i++) {
        raw[i] = (textIsDark ? lumas[i] <= otsuT : lumas[i] > otsuT) ? 1 : 0;
      }
    }
    // Same-polarity case (dark ink on dark-ish bg): distance-to-bg finds
    // nothing, so keep an Otsu-minority candidate as a second pass.
    const otsuRaw = new Uint8Array(total);
    if (bgRgbForMask) {
      const textIsDark = below <= total / 2;
      for (let i = 0; i < total; i++) {
        otsuRaw[i] = (textIsDark ? lumas[i] <= otsuT : lumas[i] > otsuT) ? 1 : 0;
      }
    }
    // Detector-guided masking: the DB prob map says where text actually lives.
    // Use a loose map cutoff (soft polygon edge) so glyphs stay fully inside —
    // a tight cutoff slices glyph edges, leaving unmasked ink as donors that
    // rebuild the text as speckles. Then relax the bg-distance threshold since
    // the region is already confirmed text.
    let guidedActive = false;
    const inside = new Uint8Array(total);
    const tm = new Float32Array(total);
    let localBg = 128;
    let tmMax = 0;
    if (textMap && textMapW) {
      let coverage = 0;
      for (let i = 0; i < total; i++) {
        const gy = y + ((i / w) | 0);
        const gx = x + (i % w);
        tm[i] = textMap[gy * textMapW + gx] || 0;
        if (tm[i] > tmMax) tmMax = tm[i];
        if (tm[i] > 0.3) coverage++;
      }
      if (coverage > total * 0.01) {
        guidedActive = true;
        // DBNet prob map is a shrunk centerline polygon (~60% of stroke span);
        // dilate proportionally to crop height so word-end letters inside the
        // unclipped box are covered without reaching outer crop corners.
        const mapExpand = Math.max(4, Math.min(10, Math.round(h * 0.16)));
        for (let i = 0; i < total; i++) inside[i] = tm[i] > 0.10 ? 1 : 0;
        for (let it = 0; it < mapExpand; it++) {
          const prev = inside.slice();
          for (let yy = 0; yy < h; yy++) {
            for (let xx = 0; xx < w; xx++) {
              const i = yy * w + xx;
              if (prev[i]) continue;
              if ((xx > 0 && prev[i - 1]) || (xx < w - 1 && prev[i + 1]) ||
                  (yy > 0 && prev[i - w]) || (yy < h - 1 && prev[i + w])) {
                inside[i] = 1;
              }
            }
          }
        }
        // Mask = pixels inside the (dilated) text region that deviate from the
        // crop's dominant tone. The dominant tone is measured over non-text
        // pixels, so anti-aliased glyph edges still land in the mask.
        const bgSamples: number[] = [];
        for (let i = 0; i < total; i++) {
          if (!inside[i]) bgSamples.push(lumas[i]);
        }
        bgSamples.sort((a, b) => a - b);
        localBg = bgSamples.length > total * 0.05
          ? bgSamples[(bgSamples.length / 2) | 0]
          : bgRgbForMask
            ? (bgRgbForMask[0] * 299 + bgRgbForMask[1] * 587 + bgRgbForMask[2] * 114) / 1000
            : 128;
        for (let i = 0; i < total; i++) {
          raw[i] = inside[i] && Math.abs(lumas[i] - localBg) > 25 ? 1 : 0;
          if (!inside[i]) otsuRaw[i] = 0;
        }
      }
    }
    if (localQuad && localQuad.length === 4) {
      for (let i = 0; i < total; i++) {
        if (!PolygonDeskew.pointInQuad(i % w, (i / w) | 0, localQuad)) {
          raw[i] = 0;
          otsuRaw[i] = 0;
        }
      }
    }
    let mask = filterMask(raw, w, h, total, guidedActive);
    if (!mask && bgRgbForMask) {
      // bg-distance found no glyphs — maybe ink shares the bg polarity
      // (dark text on dark art). Second chance via the Otsu minority class.
      mask = filterMask(otsuRaw, w, h, total, guidedActive);
    }
    if (!mask) {
      // No glyph-like structure — paint just the candidate area (never the
      // whole crop) so art damage stays bounded; skip when nothing at all.
      let anyRaw = false;
      for (let i = 0; i < total; i++) if (raw[i] || otsuRaw[i]) { anyRaw = true; break; }
      if (!anyRaw) return null;
      const merged = new Uint8Array(total);
      for (let i = 0; i < total; i++) merged[i] = raw[i] | otsuRaw[i];
      const rawDil = new Uint8Array(total);
      for (let yy = 0; yy < h; yy++) {
        for (let xx = 0; xx < w; xx++) {
          const i = yy * w + xx;
          if (!merged[i]) continue;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const nx = xx + dx;
              const ny = yy + dy;
              if (nx >= 0 && nx < w && ny >= 0 && ny < h) rawDil[ny * w + nx] = 1;
            }
          }
        }
      }
      return flatFill(rawDil, bgHex);
    }

    // 4. Dynamic halo dilation (2..5px scaled by line height) so fill donors
    // sit beyond anti-aliased glyph rings and artist white halos (fuchidori).
    const dilRadius = InpaintSolver.computeDilationRadius(h);
    const dil = new Uint8Array(total);
    dil.set(mask);
    for (let it = 0; it < dilRadius; it++) {
      const prev = dil.slice();
      for (let yy = 0; yy < h; yy++) {
        for (let xx = 0; xx < w; xx++) {
          const i = yy * w + xx;
          if (!prev[i]) continue;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const nx = xx + dx;
              const ny = yy + dy;
              if (nx >= 0 && nx < w && ny >= 0 && ny < h) dil[ny * w + nx] = 1;
            }
          }
        }
      }
    }

    // Glyph+AA zone: tight map cores (tm>0.3 && strong deviation) dilated
    // 4px. Dark pixels inside it are ink/AA; dark pixels OUTSIDE it with a
    // weak map value are real texture — that distinction drives both the
    // flat-fill gate and the donor-path pixel preservation below.
    const coreZone = new Uint8Array(total);
    if (guidedActive) {
      const tight = new Uint8Array(total);
      for (let i = 0; i < total; i++) {
        tight[i] = tm[i] > 0.3 && Math.abs(lumas[i] - localBg) > 40 ? 1 : 0;
      }
      const tmask = filterMask(tight, w, h, total, true);
      if (tmask) {
        coreZone.set(tmask);
        for (let it = 0; it < 4; it++) {
          const prev = coreZone.slice();
          for (let yy = 0; yy < h; yy++) {
            for (let xx = 0; xx < w; xx++) {
              const i = yy * w + xx;
              if (!prev[i]) continue;
              for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                  const nx = xx + dx;
                  const ny = yy + dy;
                  if (nx >= 0 && nx < w && ny >= 0 && ny < h) coreZone[ny * w + nx] = 1;
                }
              }
            }
          }
        }
      }
    }

    // 4a. Background estimate = the ring just around the final mask (3-5px
    // out): the true local surround of the glyphs. Uniform ring => flat fill
    // is perfectly invisible; donor-copy there would pull AA-tinted pixels
    // back in as grey ghosts.
    // `zone` = text region dilated 4px: a dark pixel only counts as
    // preservable texture when it sits fully outside it — otherwise dark
    // specks the map missed (ink) would survive inside clean bubbles.
    const zone = new Uint8Array(total);
    zone.set(inside);
    for (let it = 0; it < 4; it++) {
      const prev = zone.slice();
      for (let yy = 0; yy < h; yy++) {
        for (let xx = 0; xx < w; xx++) {
          const i = yy * w + xx;
          if (!prev[i]) continue;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const nx = xx + dx;
              const ny = yy + dy;
              if (nx >= 0 && nx < w && ny >= 0 && ny < h) zone[ny * w + nx] = 1;
            }
          }
        }
      }
    }
    const ring = new Uint8Array(total);
    const wide = dil.slice();
    for (let it = 0; it < 4; it++) {
      const p2 = wide.slice();
      for (let yy = 0; yy < h; yy++) {
        for (let xx = 0; xx < w; xx++) {
          const i = yy * w + xx;
          if (!p2[i]) continue;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const nx = xx + dx;
              const ny = yy + dy;
              if (nx >= 0 && nx < w && ny >= 0 && ny < h) wide[ny * w + nx] = 1;
            }
          }
        }
      }
    }
    for (let i = 0; i < total; i++) ring[i] = wide[i] && !dil[i] ? 1 : 0;
    let lastRisky = -1;
    let lastStd = -1;
    // Ring pixels may include INK from a neighbouring text line (line gaps
    // are ~10px, the ring reaches 2-6px out). Take the ring median first,
    // then stats over inliers only — otherwise the ink contamination pushes
    // stddev up and clean bubbles never reach the flat-fill path.
    const ringL: number[] = [];
    for (let i = 0; i < total; i++) if (ring[i]) ringL.push(lumas[i]);
    if (ringL.length > 20) {
      ringL.sort((a, b) => a - b);
      const med = ringL[(ringL.length / 2) | 0];
      let nS = 0, accR = 0, accG = 0, accB = 0, sumL = 0, sumSq = 0;
      for (let i = 0; i < total; i++) {
        if (!ring[i] || Math.abs(lumas[i] - med) > 40) continue;
        const p = i * 4;
        accR += data[p]; accG += data[p + 1]; accB += data[p + 2];
        sumL += lumas[i]; sumSq += lumas[i] * lumas[i];
        nS++;
      }
      if (nS > 20) {
        const mean = sumL / nS;
        const stddev = Math.sqrt(Math.max(0, sumSq / nS - mean * mean));
        // Collateral check: dark features inside `wide` that are NOT glyph
        // ink are real texture — screentone dots, art strokes. For guided
        // crops ink = map support (tm>0.15) or the glyph+AA zone; AA-edge
        // pixels fail tm alone, so coreZone must shield them from the count.
        let risky = 0, wideCount = 0;
        for (let i = 0; i < total; i++) {
          if (!wide[i]) continue;
          wideCount++;
          const ink = guidedActive ? !!coreZone[i] : !!dil[i];
          if (!ink && Math.abs(lumas[i] - med) > 40) risky++;
        }
        const riskyPct = wideCount ? risky / wideCount : 0;
        lastRisky = riskyPct;
        lastStd = stddev;
        if (stddev < 20 && riskyPct < 0.08) {
        // Uniform surround (inside a clean bubble): repaint the whole `wide`
        // zone, not just `dil`. The overshoot is invisible on flat bg and it
        // swallows the outer AA halo a tight mask leaves as a grey ghost.
        // BUT preserve dark collateral pixels that form REAL texture —
        // edge-connected dots/strokes (screentone, borders, art). Isolated
        // interior specks (map-missed ink) fail the connectivity test and
        // get painted over — that's what killed the dust-speck look.
        // blocked=`wide`: the glyph-adjacent ring (AA fringe) cannot
        // conduct, so its edge-connected band no longer preserves fringe
        // dashes. Only dark fields beyond the ring (borders, texture)
        // conduct to the crop edge and survive.
        const edgeTex = edgeFieldMask(lumas, med, wide, w, h, 0);
        for (let i = 0; i < total; i++) {
          // Strictly paint ONLY the dilated glyph+AA halo (`wide`), NEVER the
          // full rectangular crop — rectangular corners poke outside curved or
          // spiky speech-bubble outlines onto grey screentones!
          if (!wide[i]) continue;
          if (edgeTex[i] && Math.abs(lumas[i] - med) > 45) continue;
          const p = i * 4;
          out[p] = accR / nS; out[p + 1] = accG / nS; out[p + 2] = accB / nS; out[p + 3] = 255;
        }
        return { x, y, width: w, height: h, pixels: out,
                 dbg: { path: 'flat', risky: riskyPct, std: stddev, guided: guidedActive } };
        }
      }
    }
    const donorDbg = { path: guidedActive ? 'donor-tex' : 'donor', guided: guidedActive, risky: lastRisky, std: lastStd, tmMax };

    // 4b. Textured surround → donor fill over `dil` (glyphs + AA fully
    // covered), but PRESERVE dark pixels outside the glyph+AA zone: real
    // screentone/art strokes stay untouched (alpha 0) instead of being
    // repainted. They're excluded from BFS seeds too — seeding from `dil`'s
    // complement keeps their colour from streaking into the fill.
    let emit = dil;
    if (guidedActive) {
      let hasCore = false;
      for (let i = 0; i < total; i++) if (coreZone[i]) { hasCore = true; break; }
      if (hasCore) {
        const edgeTex = edgeFieldMask(lumas, localBg, dil, w, h);
        // AA fringe hugs glyph cores; real texture stands further out.
        const nearCore = coreZone.slice();
        for (let it = 0; it < 2; it++) {
          const prev = nearCore.slice();
          for (let yy = 0; yy < h; yy++) {
            for (let xx = 0; xx < w; xx++) {
              const i = yy * w + xx;
              if (prev[i]) continue;
              if ((xx > 0 && prev[i - 1]) || (xx < w - 1 && prev[i + 1]) ||
                  (yy > 0 && prev[i - w]) || (yy < h - 1 && prev[i + w])) {
                nearCore[i] = 1;
              }
            }
          }
        }
        emit = new Uint8Array(total);
        for (let i = 0; i < total; i++) {
          const texture = dil[i] && !coreZone[i] && tm[i] < 0.12 &&
            Math.abs(lumas[i] - localBg) > 40;
          emit[i] = texture && edgeTex[i] && !nearCore[i] ? 0 : dil[i];
        }
      }
    }
    const inpainted = InpaintSolver.teleaInpaint(data, dil, emit, w, h, 3);
    return { x, y, width: w, height: h, pixels: inpainted, dbg: donorDbg };
  }

  private static hexToRgb(hex?: string): [number, number, number] | null {
    if (!hex || !/^#[0-9a-fA-F]{6}$/.test(hex)) return null;
    return [
      parseInt(hex.slice(1, 3), 16),
      parseInt(hex.slice(3, 5), 16),
      parseInt(hex.slice(5, 7), 16)
    ];
  }
}
