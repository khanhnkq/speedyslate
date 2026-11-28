import { BoundingBox, DialogueItem } from '../shared/types';
import { PagePixelBuffer } from './bubble-wall-detector';

interface RegionStats {
  count: number;
  lumaStd: number;
  rgbStd: number;
  edgeRatio: number;
  medLuma: number;
  medSat: number;
  medR: number;
  medG: number;
  medB: number;
  bimodalBothNeutral: boolean;
  bimodalBothNeutralLight: boolean;
  bimodalSatNeutralMatch: boolean;
}

const DIALOGUE_ALLOWLIST = new Set(
  'NO YES YEAH YEP NAH NOPE WAIT WHAT WHY WHO HOW WHERE WHEN STOP DIE HUH AH OH OK OKAY HEY HI BYE RUN HELP PLEASE SORRY THANKS FINE GOOD WELL LOOK HERE THERE COME GO STAY NOT NOW THEN SIR MOM DAD BRO SIS HMM HM UH UM EH DONT DON\'T CANT CAN\'T IM I\'M YOU ME WE HE SHE IT THEY THIS THAT KILL STILL FALL COOL FULL CALL TELL HELL REAL SURE TRUE MINE YOURS DEAD DONE GONE BACK AWAY UP DOWN OUT IN ON OFF SO TOO VERY MORE LESS'.split(
    ' '
  )
);

const SFX_LEXICON = new Set(
  'KWAA KWAAA WAA WAAA SPLAT THWACK HUFF SHWIP FUU FUUU RUSTLE BAM BOOM CRACK WHOOSH SPLASH GASP SOB CREAK SLAM THUD BANG ZAP POP SWISH CLANK ROAR WHAM POW SMASH CRASH SNAP SLASH SWOOSH WOOSH THUMP BUMP CLASH CLANG DING BUZZ HISS GROWL SNARL HOWL PANT WHEEZE SNIFF GULP CHOMP CRUNCH SQUISH SPLURT DRIP PLOP POOF PUFF FWOOSH KABOOM KRACK KRAK SHING SCHWING SHRAK THWUMP BOING BONK THOCK CLICK CLACK SCREECH SHRIEK WAIL YELP ZING ZOOM VROOM RATTLE RUMBLE SIZZLE FIZZ SHATTER CRUMBLE FLINCH TWITCH GLARE SMIRK SIGH GROAN MOAN GRUNT SNORE SLURP SMACK SLAP WHIP SHRED SPARK FLASH SHIVER TREMBLE BEEP HONK GYAA KYAA AAAH GAAH UGHH GRR GRRR BZZ BZZZ TSS PSS SHH FSH KSH VSH WSH TSK SFX'.split(
    ' '
  )
);

const SFX_CLUSTER_RE = /^(?:KW|SHW|THW|FW|KSH|VSH|TSK|GRR|BZZ|ZRR|FUU|WAA|GYA|KYA)[A-Z]*$/;

const pxLuma = (d: Uint8ClampedArray, i: number): number =>
  0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];

const pxSat = (d: Uint8ClampedArray, i: number): number =>
  Math.max(d[i], d[i + 1], d[i + 2]) - Math.min(d[i], d[i + 1], d[i + 2]);

function medianSorted(arr: number[]): number {
  if (arr.length === 0) return 0;
  const s = arr.slice().sort((a, b) => a - b);
  return s[s.length >> 1];
}

function isEdgePair(d: Uint8ClampedArray, i: number, j: number, lumaI: number): boolean {
  const maxD = Math.max(Math.abs(d[i] - d[j]), Math.abs(d[i + 1] - d[j + 1]), Math.abs(d[i + 2] - d[j + 2]));
  return Math.abs(lumaI - pxLuma(d, j)) > 18 || maxD > 24;
}

/**
 * Pre-OCR & post-recognition SFX gating utilities (Phương án A).
 * Filters stylized/free-floating comic SFX while preserving clean dialogue & narration boxes.
 */
export class SfxGate {
  public static isTiltedQuad(box: BoundingBox, maxDeg = 12): boolean {
    if (box.quad && box.quad.length === 4) {
      const q = box.quad;
      const edges: [number, number][] = [
        [q[1][0] - q[0][0], q[1][1] - q[0][1]],
        [q[3][0] - q[0][0], q[3][1] - q[0][1]]
      ];
      for (const [dx, dy] of edges) {
        if (Math.hypot(dx, dy) < 4) continue;
        const deg = Math.abs((Math.atan2(dy, dx) * 180) / Math.PI) % 90;
        if (Math.min(deg, 90 - deg) > maxDeg) return true;
      }
      return false;
    }
    return typeof box.angleDeg === 'number' && Math.abs(box.angleDeg) > maxDeg;
  }

  public static isCleanFlatBackground(pageImg: PagePixelBuffer, box: BoundingBox): boolean {
    if (this.isTiltedQuad(box, 12)) return false;
    const { width: w, height: h } = pageImg;
    if (w < 8 || h < 8) return true;

    const bx0 = Math.max(0, Math.floor(box.x));
    const by0 = Math.max(0, Math.floor(box.y));
    const bx1 = Math.min(w - 1, Math.ceil(box.x + box.width) - 1);
    const by1 = Math.min(h - 1, Math.ceil(box.y + box.height) - 1);
    if (bx1 - bx0 < 4 || by1 - by0 < 4) return true;

    const exp = 4;
    const ix0 = Math.max(0, bx0 - exp), iy0 = Math.max(0, by0 - exp);
    const ix1 = Math.min(w - 1, bx1 + exp), iy1 = Math.min(h - 1, by1 + exp);
    let inner = this.collectStats(pageImg, ix0, iy0, ix1, iy1, { x0: bx0, y0: by0, x1: bx1, y1: by1 });
    if (inner.count < 16) {
      inner = this.collectStats(pageImg, bx0, by0, bx1, by1);
      if (inner.count < 8) return true;
    }

    const innerFlat = inner.lumaStd <= 16 && inner.rgbStd <= 18 && inner.edgeRatio <= 0.08;
    const innerTwoToneNeutral =
      inner.edgeRatio <= 0.08 && (inner.bimodalBothNeutralLight || inner.bimodalBothNeutral);
    if (!innerFlat && !innerTwoToneNeutral) return false;

    const pad = 12;
    const ox0 = Math.max(0, bx0 - pad), oy0 = Math.max(0, by0 - pad);
    const ox1 = Math.min(w - 1, bx1 + pad), oy1 = Math.min(h - 1, by1 + pad);
    const outer = this.collectStats(pageImg, ox0, oy0, ox1, oy1, { x0: ix0, y0: iy0, x1: ix1, y1: iy1 });
    if (outer.count < 16) return true;
    if (outer.lumaStd <= 16 && outer.rgbStd <= 18 && outer.edgeRatio <= 0.08) return true;

    if (outer.edgeRatio <= 0.08) {
      if (outer.bimodalBothNeutralLight) return true;
      if (innerFlat && inner.medSat <= 25 && inner.lumaStd <= 10 && outer.bimodalBothNeutral) return true;
      if (innerFlat && inner.lumaStd <= 8 && inner.rgbStd <= 10 && outer.bimodalSatNeutralMatch) return true;
    }
    return false;
  }

  public static isStylizedVisualSfx(pageImg: PagePixelBuffer, box: BoundingBox): boolean {
    const { data, width: w, height: h } = pageImg;
    const bx0 = Math.max(0, Math.floor(box.x)), by0 = Math.max(0, Math.floor(box.y));
    const bx1 = Math.min(w - 1, Math.ceil(box.x + box.width) - 1);
    const by1 = Math.min(h - 1, Math.ceil(box.y + box.height) - 1);
    if (bx1 - bx0 < 6 || by1 - by0 < 6) return false;

    const bg = this.sampleBgSummary(pageImg, bx0, by0, bx1, by1);
    // Critical guard: never reject normal white or normal dark speech bubbles
    if (bg.sat < 25 && (bg.luma >= 215 || bg.luma <= 55) && bg.chromFrac < 0.15) return false;

    if (box.height >= 52 && bg.sat >= 35 && (bg.topBotDiff >= 20 || bg.std >= 16)) return true;
    if (bg.sat >= 28 || (bg.luma >= 60 && bg.luma <= 205)) {
      return this.hasFuchidoriStrokes(data, w, bx0, by0, bx1, by1, bg.luma);
    }
    return false;
  }

  public static isBurstOnomatopoeia(pageImg: PagePixelBuffer, item: DialogueItem): boolean {
    if (!this.looksLikeSfxText(item.originalText)) return false;
    const { data, width: w, height: h } = pageImg;
    const bx0 = Math.max(0, Math.floor(item.box.x)), by0 = Math.max(0, Math.floor(item.box.y));
    const bx1 = Math.min(w - 1, Math.ceil(item.box.x + item.box.width) - 1);
    const by1 = Math.min(h - 1, Math.ceil(item.box.y + item.box.height) - 1);
    if (bx1 - bx0 < 4 || by1 - by0 < 4) return false;

    const bg = this.sampleBgSummary(pageImg, bx0, by0, bx1, by1);
    if (bg.sat >= 28 || bg.topBotDiff >= 20 || bg.std >= 16) return true;
    if (!this.isCleanFlatBackground(pageImg, item.box)) return true;
    return this.hasFuchidoriStrokes(data, w, bx0, by0, bx1, by1, bg.luma);
  }

  private static looksLikeSfxText(rawText: string): boolean {
    const trimmed = rawText.trim();
    if (!trimmed) return false;
    const tokens = trimmed.split(/\s+/);
    if (tokens.length < 1 || tokens.length > 2) return false;

    let anySfx = false;
    let allAllowlisted = true;
    for (const rawTok of tokens) {
      const alpha = rawTok.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9]+$/g, '').replace(/[^A-Za-z]/g, '');
      if (alpha.length < 2 || alpha.length > 16 || alpha !== alpha.toUpperCase()) return false;
      const hasRepeat3 = /(.)\1{2,}/.test(alpha);
      const inAllow = DIALOGUE_ALLOWLIST.has(alpha);
      if (!inAllow || hasRepeat3) allAllowlisted = false;
      if (hasRepeat3 || SFX_LEXICON.has(alpha) || (!inAllow && SFX_CLUSTER_RE.test(alpha))) anySfx = true;
    }
    return anySfx && !allAllowlisted;
  }

  private static hasFuchidoriStrokes(
    data: Uint8ClampedArray, w: number, bx0: number, by0: number, bx1: number, by1: number, bgLuma: number
  ): boolean {
    const bw = bx1 - bx0 + 1, bh = by1 - by0 + 1, total = bw * bh;
    if (total < 24) return false;

    const brightThresh = bgLuma > 190 ? Math.min(248, Math.max(215, bgLuma + 25)) : Math.min(215, bgLuma + 45);
    const darkThresh = bgLuma < 95 ? Math.max(12, Math.min(75, bgLuma - 25)) : Math.max(75, bgLuma - 45);
    const cls = new Uint8Array(total);
    let brightCount = 0, darkCount = 0;

    for (let y = by0; y <= by1; y++) {
      const rowOff = (y - by0) * bw;
      for (let x = bx0; x <= bx1; x++) {
        const l = pxLuma(data, (y * w + x) * 4);
        if (l >= brightThresh) { cls[rowOff + x - bx0] = 1; brightCount++; }
        else if (l <= darkThresh) { cls[rowOff + x - bx0] = 2; darkCount++; }
      }
    }
    if (brightCount / total < 0.035 || darkCount / total < 0.035) return false;

    let adjacent = 0;
    const minAdj = Math.max(4, Math.round(total * 0.004));
    for (let ly = 0; ly < bh; ly++) {
      for (let lx = 0; lx < bw; lx++) {
        if (cls[ly * bw + lx] !== 1) continue;
        let hit = false;
        for (let ny = Math.max(0, ly - 2); ny <= Math.min(bh - 1, ly + 2) && !hit; ny++) {
          for (let nx = Math.max(0, lx - 2); nx <= Math.min(bw - 1, lx + 2); nx++) {
            if (cls[ny * bw + nx] === 2) { hit = true; break; }
          }
        }
        if (hit && ++adjacent >= minAdj) return true;
      }
    }
    return false;
  }

  private static sampleBgSummary(
    img: PagePixelBuffer, bx0: number, by0: number, bx1: number, by1: number
  ): { luma: number; sat: number; std: number; topBotDiff: number; chromFrac: number } {
    const { data, width: w, height: h } = img;
    const exp = 4;
    const collar = this.collectStats(
      img, Math.max(0, bx0 - exp), Math.max(0, by0 - exp), Math.min(w - 1, bx1 + exp), Math.min(h - 1, by1 + exp),
      { x0: bx0, y0: by0, x1: bx1, y1: by1 }
    );

    let chromCount = 0, totalBox = 0;
    const chromLumas: number[] = [], chromSats: number[] = [];
    const step = (bx1 - bx0 + 1) * (by1 - by0 + 1) > 4000 ? 2 : 1;
    for (let y = by0; y <= by1; y += step) {
      for (let x = bx0; x <= bx1; x += step) {
        const idx = (y * w + x) * 4;
        const s = pxSat(data, idx);
        totalBox++;
        if (s >= 28) { chromCount++; chromLumas.push(pxLuma(data, idx)); chromSats.push(s); }
      }
    }

    const pad = 8, gx0 = Math.max(0, bx0 - pad), gx1 = Math.min(w - 1, bx1 + pad);
    const topB = this.collectStats(img, gx0, Math.max(0, by0 - pad), gx1, Math.min(h - 1, by0 + 2));
    const botB = this.collectStats(img, gx0, Math.max(0, by1 - 2), gx1, Math.min(h - 1, by1 + pad));
    const topBotDiff = topB.count > 0 && botB.count > 0
      ? Math.max(Math.abs(topB.medLuma - botB.medLuma), Math.abs(topB.medR - botB.medR), Math.abs(topB.medG - botB.medG), Math.abs(topB.medB - botB.medB))
      : 0;
    const full = this.collectStats(img, gx0, Math.max(0, by0 - pad), gx1, Math.min(h - 1, by1 + pad), {
      x0: bx0, y0: by0, x1: bx1, y1: by1
    });

    const base = collar.count >= 16 ? collar : full;
    const chromFrac = totalBox > 0 ? chromCount / totalBox : 0;
    const useChrom = chromFrac >= 0.15 && base.medSat < 25;
    return {
      luma: useChrom ? medianSorted(chromLumas) : base.medLuma,
      sat: Math.max(base.medSat, useChrom ? medianSorted(chromSats) : 0),
      std: Math.max(base.lumaStd, base.rgbStd, full.lumaStd, full.rgbStd),
      topBotDiff,
      chromFrac
    };
  }

  private static collectStats(
    img: PagePixelBuffer, x0: number, y0: number, x1: number, y1: number,
    hole?: { x0: number; y0: number; x1: number; y1: number }
  ): RegionStats {
    const { data, width: w } = img;
    const holeArea = hole ? Math.max(0, hole.x1 - hole.x0 + 1) * Math.max(0, hole.y1 - hole.y0 + 1) : 0;
    const step = Math.max(0, (x1 - x0 + 1) * (y1 - y0 + 1) - holeArea) > 32000 ? 2 : 1;
    const inMask = (x: number, y: number): boolean =>
      x >= x0 && x <= x1 && y >= y0 && y <= y1 && (!hole || x < hole.x0 || x > hole.x1 || y < hole.y0 || y > hole.y1);

    const rs: number[] = [], gs: number[] = [], bs: number[] = [], lumas: number[] = [], sats: number[] = [];
    let sumR = 0, sumG = 0, sumB = 0, sumL = 0, sumS = 0, edgeCount = 0, pairCount = 0;

    for (let y = y0; y <= y1; y += step) {
      for (let x = x0; x <= x1; x += step) {
        if (!inMask(x, y)) continue;
        const i = (y * w + x) * 4, r = data[i], g = data[i + 1], b = data[i + 2];
        const l = 0.299 * r + 0.587 * g + 0.114 * b, s = Math.max(r, g, b) - Math.min(r, g, b);
        rs.push(r); gs.push(g); bs.push(b); lumas.push(l); sats.push(s);
        sumR += r; sumG += g; sumB += b; sumL += l; sumS += s;
        if (inMask(x + step, y)) { if (isEdgePair(data, i, (y * w + x + step) * 4, l)) edgeCount++; pairCount++; }
        if (inMask(x, y + step)) { if (isEdgePair(data, i, ((y + step) * w + x) * 4, l)) edgeCount++; pairCount++; }
      }
    }

    const n = lumas.length;
    if (n === 0) {
      return {
        count: 0, lumaStd: 0, rgbStd: 0, edgeRatio: 0, medLuma: 255, medSat: 0, medR: 255, medG: 255, medB: 255,
        bimodalBothNeutral: false, bimodalBothNeutralLight: false, bimodalSatNeutralMatch: false
      };
    }

    const mR = sumR / n, mG = sumG / n, mB = sumB / n, mL = sumL / n, mS = sumS / n;
    let vR = 0, vG = 0, vB = 0, vL = 0, vS = 0;
    for (let k = 0; k < n; k++) {
      vR += (rs[k] - mR) ** 2; vG += (gs[k] - mG) ** 2; vB += (bs[k] - mB) ** 2;
      vL += (lumas[k] - mL) ** 2; vS += (sats[k] - mS) ** 2;
    }

    return {
      count: n,
      lumaStd: Math.sqrt(vL / n),
      rgbStd: Math.sqrt(Math.max(vR, vG, vB, vS) / n),
      edgeRatio: pairCount > 0 ? edgeCount / pairCount : 0,
      medLuma: medianSorted(lumas), medSat: medianSorted(sats),
      medR: medianSorted(rs), medG: medianSorted(gs), medB: medianSorted(bs),
      ...this.evaluateBimodal(rs, gs, bs, lumas)
    };
  }

  private static evaluateBimodal(rs: number[], gs: number[], bs: number[], lumas: number[]) {
    const n = lumas.length;
    if (n < 8) return { bimodalBothNeutral: false, bimodalBothNeutralLight: false, bimodalSatNeutralMatch: false };
    const order = lumas.map((l, idx) => ({ l, idx })).sort((a, b) => a.l - b.l);
    const i1 = order[Math.floor(n * 0.1)].idx, i2 = order[Math.min(n - 1, Math.floor(n * 0.9))].idx;
    const c1 = [rs[i1], gs[i1], bs[i1]], c2 = [rs[i2], gs[i2], bs[i2]];
    const assign = new Uint8Array(n);

    for (let iter = 0; iter < 3; iter++) {
      let r1 = 0, g1 = 0, b1 = 0, k1 = 0, r2 = 0, g2 = 0, b2 = 0, k2 = 0;
      for (let i = 0; i < n; i++) {
        const d1 = (rs[i] - c1[0]) ** 2 + (gs[i] - c1[1]) ** 2 + (bs[i] - c1[2]) ** 2;
        const d2 = (rs[i] - c2[0]) ** 2 + (gs[i] - c2[1]) ** 2 + (bs[i] - c2[2]) ** 2;
        if (d1 <= d2) { assign[i] = 0; r1 += rs[i]; g1 += gs[i]; b1 += bs[i]; k1++; }
        else { assign[i] = 1; r2 += rs[i]; g2 += gs[i]; b2 += bs[i]; k2++; }
      }
      if (k1 > 0) { c1[0] = r1 / k1; c1[1] = g1 / k1; c1[2] = b1 / k1; }
      if (k2 > 0) { c2[0] = r2 / k2; c2[1] = g2 / k2; c2[2] = b2 / k2; }
    }

    const l1 = 0.299 * c1[0] + 0.587 * c1[1] + 0.114 * c1[2], l2 = 0.299 * c2[0] + 0.587 * c2[1] + 0.114 * c2[2];
    const s1 = Math.max(...c1) - Math.min(...c1), s2 = Math.max(...c2) - Math.min(...c2);
    let inBand = 0, v1L = 0, v2L = 0, v1Rgb = 0, v2Rgb = 0, k1 = 0, k2 = 0;
    for (let i = 0; i < n; i++) {
      const c = assign[i] === 0 ? c1 : c2, cl = assign[i] === 0 ? l1 : l2;
      const dl = Math.abs(lumas[i] - cl);
      if (dl <= 12 && Math.max(Math.abs(rs[i] - c[0]), Math.abs(gs[i] - c[1]), Math.abs(bs[i] - c[2])) <= 16) inBand++;
      const rgbE2 = ((rs[i] - c[0]) ** 2 + (gs[i] - c[1]) ** 2 + (bs[i] - c[2]) ** 2) / 3;
      if (assign[i] === 0) { v1L += dl * dl; v1Rgb += rgbE2; k1++; } else { v2L += dl * dl; v2Rgb += rgbE2; k2++; }
    }

    const maxLStd = Math.max(k1 ? Math.sqrt(v1L / k1) : 0, k2 ? Math.sqrt(v2L / k2) : 0);
    const maxRStd = Math.max(k1 ? Math.sqrt(v1Rgb / k1) : 0, k2 ? Math.sqrt(v2Rgb / k2) : 0);
    const bimodalFlat = inBand / n >= 0.90 && maxLStd <= 8 && maxRStd <= 10;
    const bothNeutral = s1 <= 25 && s2 <= 25;
    return {
      bimodalBothNeutral: bimodalFlat && bothNeutral,
      bimodalBothNeutralLight: bimodalFlat && bothNeutral && l1 >= 185 && l2 >= 185,
      bimodalSatNeutralMatch: bimodalFlat && (s1 <= 25 || s2 <= 25)
    };
  }
}
