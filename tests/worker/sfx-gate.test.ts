import { describe, it, expect } from 'vitest';
import { SfxGate } from '../../src/worker/sfx-gate';
import { PagePixelBuffer } from '../../src/worker/bubble-wall-detector';
import { BoundingBox, DialogueItem } from '../../src/shared/types';

function makeImg(w: number, h: number, r = 255, g = 255, b = 255): PagePixelBuffer {
  const data = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
    data[i + 3] = 255;
  }
  return { data, width: w, height: h };
}

function fillRect(
  img: PagePixelBuffer,
  x0: number,
  y0: number,
  w: number,
  h: number,
  r: number,
  g: number,
  b: number
): void {
  const x1 = Math.min(img.width, x0 + w);
  const y1 = Math.min(img.height, y0 + h);
  for (let y = Math.max(0, y0); y < y1; y++) {
    for (let x = Math.max(0, x0); x < x1; x++) {
      const i = (y * img.width + x) * 4;
      img.data[i] = r;
      img.data[i + 1] = g;
      img.data[i + 2] = b;
    }
  }
}

function paintVerticalGradient(
  img: PagePixelBuffer,
  x0: number,
  y0: number,
  w: number,
  h: number,
  topRgb: [number, number, number],
  botRgb: [number, number, number]
): void {
  for (let y = y0; y < y0 + h; y++) {
    const t = h > 1 ? (y - y0) / (h - 1) : 0;
    const r = Math.round(topRgb[0] * (1 - t) + botRgb[0] * t);
    const g = Math.round(topRgb[1] * (1 - t) + botRgb[1] * t);
    const b = Math.round(topRgb[2] * (1 - t) + botRgb[2] * t);
    fillRect(img, x0, y, w, 1, r, g, b);
  }
}

function paintNoisyFoliage(img: PagePixelBuffer, x0: number, y0: number, w: number, h: number): void {
  for (let y = Math.max(0, y0); y < Math.min(img.height, y0 + h); y++) {
    for (let x = Math.max(0, x0); x < Math.min(img.width, x0 + w); x++) {
      const hash = ((x * 73856093) ^ (y * 19349663)) >>> 0;
      const leaf = (hash % 5) === 0;
      const i = (y * img.width + x) * 4;
      img.data[i] = leaf ? 35 + (hash % 40) : 70 + (hash % 55);
      img.data[i + 1] = leaf ? 95 + (hash % 65) : 130 + (hash % 75);
      img.data[i + 2] = 28 + (hash % 35);
    }
  }
}

function paintFuchidoriBars(img: PagePixelBuffer, box: BoundingBox): void {
  const x0 = box.x + 12;
  const y0 = box.y + 8;
  const bw = Math.max(24, box.width - 24);
  const bh = Math.max(16, box.height - 16);
  // Outer dark outline (2px border) + bright white interior core
  for (let k = 0; k < 3; k++) {
    const gx = x0 + Math.round((bw * k) / 3);
    const gw = Math.max(10, Math.round(bw / 4));
    fillRect(img, gx, y0, gw, bh, 15, 15, 15);
    fillRect(img, gx + 2, y0 + 2, Math.max(4, gw - 4), Math.max(4, bh - 4), 252, 252, 252);
  }
}

function mkItem(originalText: string, box: BoundingBox): DialogueItem {
  return { id: `sfx-test-${originalText}`, originalText, box, confidence: 0.92 };
}

describe('SfxGate.isCleanFlatBackground', () => {
  it('keeps borderless #dadde6 cloud on #ffffff white panel with dark text', () => {
    const img = makeImg(320, 200, 255, 255, 255);
    // Borderless #dadde6 (218, 221, 230) cloud ending inside the outer ring
    fillRect(img, 54, 44, 192, 62, 0xda, 0xdd, 0xe6);
    const box: BoundingBox = { x: 60, y: 50, width: 180, height: 50 };
    fillRect(img, 70, 65, 120, 12, 18, 18, 18); // dark text inside box
    expect(SfxGate.isCleanFlatBackground(img, box)).toBe(true);
  });

  it('keeps flat white, cream, black, and pastel narration boxes', () => {
    const whitePage = makeImg(300, 220, 255, 255, 255);
    const whiteBox: BoundingBox = { x: 30, y: 20, width: 140, height: 32 };
    fillRect(whitePage, 40, 28, 90, 10, 16, 16, 16);
    expect(SfxGate.isCleanFlatBackground(whitePage, whiteBox)).toBe(true);

    // Cream narration box (#fff5dc) on white page
    fillRect(whitePage, 22, 72, 176, 56, 255, 245, 220);
    const creamBox: BoundingBox = { x: 30, y: 80, width: 160, height: 40 };
    fillRect(whitePage, 40, 92, 100, 10, 20, 20, 20);
    expect(SfxGate.isCleanFlatBackground(whitePage, creamBox)).toBe(true);

    // Flat black narration box (#141414) on white page
    fillRect(whitePage, 22, 142, 176, 56, 20, 20, 20);
    const blackBox: BoundingBox = { x: 30, y: 150, width: 160, height: 40 };
    fillRect(whitePage, 40, 162, 100, 10, 248, 248, 248);
    expect(SfxGate.isCleanFlatBackground(whitePage, blackBox)).toBe(true);

    // Flat pastel narration box (#d8e8f8) on white page
    const pastelPage = makeImg(300, 140, 255, 255, 255);
    fillRect(pastelPage, 20, 20, 220, 90, 216, 232, 248);
    const pastelBox: BoundingBox = { x: 30, y: 30, width: 200, height: 70 };
    fillRect(pastelPage, 45, 50, 120, 12, 20, 24, 30);
    expect(SfxGate.isCleanFlatBackground(pastelPage, pastelBox)).toBe(true);
  });

  it('rejects noisy foliage, trees/hoodie folds, noisy gradients, and >12deg tilted quads', () => {
    const foliage = makeImg(300, 200, 255, 255, 255);
    paintNoisyFoliage(foliage, 10, 10, 280, 180);
    const box: BoundingBox = { x: 60, y: 60, width: 150, height: 40 };
    expect(SfxGate.isCleanFlatBackground(foliage, box)).toBe(false);

    // Hoodie/cloth folds: continuous shaded grey/blue bands with edge steps
    const hoodie = makeImg(300, 200, 70, 82, 102);
    for (let y = 20; y < 180; y++) {
      const shade = Math.round(70 + 45 * Math.sin(y * 0.35));
      fillRect(hoodie, 20, y, 260, 1, shade, shade + 8, shade + 24);
    }
    expect(SfxGate.isCleanFlatBackground(hoodie, box)).toBe(false);

    // Strongly skewed quad (>12 deg) even on flat white paper
    const flat = makeImg(300, 200, 255, 255, 255);
    const tiltedBox: BoundingBox = {
      x: 60,
      y: 60,
      width: 140,
      height: 50,
      quad: [
        [60, 85],
        [190, 45],
        [202, 85],
        [72, 125]
      ]
    };
    expect(SfxGate.isCleanFlatBackground(flat, tiltedBox)).toBe(false);

    // Mild tilt (<=12 deg, ~5 deg) on flat white passes
    const mildTilt: BoundingBox = {
      x: 60,
      y: 60,
      width: 140,
      height: 40,
      quad: [
        [60, 60],
        [200, 68],
        [198, 108],
        [58, 100]
      ]
    };
    expect(SfxGate.isCleanFlatBackground(flat, mildTilt)).toBe(true);
  });

  it('keeps middle line of 3-line #dadde6 cloud narration and bordered cream box over foliage', () => {
    // 3-line #dadde6 cloud narration with 6px leading: outerRing hits adjacent lines above/below
    const cloud3 = makeImg(320, 220, 255, 255, 255);
    fillRect(cloud3, 40, 30, 220, 150, 0xda, 0xdd, 0xe6);
    fillRect(cloud3, 60, 44, 150, 18, 18, 18, 18); // line 1
    fillRect(cloud3, 60, 68, 150, 18, 18, 18, 18); // line 2 (middle)
    fillRect(cloud3, 60, 92, 150, 18, 18, 18, 18); // line 3
    expect(SfxGate.isCleanFlatBackground(cloud3, { x: 60, y: 68, width: 150, height: 18 })).toBe(true);

    // Bordered cream narration box with 6px margin over noisy foliage
    const creamOnFoliage = makeImg(320, 220, 255, 255, 255);
    paintNoisyFoliage(creamOnFoliage, 0, 0, 320, 220);
    fillRect(creamOnFoliage, 42, 42, 216, 66, 20, 20, 20); // 2px dark border
    fillRect(creamOnFoliage, 44, 44, 212, 62, 255, 245, 220); // cream interior (6px margin around box)
    const creamBox: BoundingBox = { x: 50, y: 50, width: 200, height: 50 };
    fillRect(creamOnFoliage, 60, 65, 130, 14, 20, 20, 20);
    expect(SfxGate.isCleanFlatBackground(creamOnFoliage, creamBox)).toBe(true);

    // Fuchidori glow SFX on foliage must still be rejected
    const glowOnFoliage = makeImg(320, 220, 255, 255, 255);
    paintNoisyFoliage(glowOnFoliage, 0, 0, 320, 220);
    const sfxBox: BoundingBox = { x: 60, y: 60, width: 180, height: 48 };
    paintFuchidoriBars(glowOnFoliage, sfxBox);
    expect(SfxGate.isCleanFlatBackground(glowOnFoliage, sfxBox)).toBe(false);
  });
});

describe('SfxGate.isStylizedVisualSfx', () => {
  it('catches KWAAA!!! on red-orange gradient spiky burst (height >= 52)', () => {
    const img = makeImg(320, 220, 255, 255, 255);
    paintVerticalGradient(img, 30, 30, 240, 120, [248, 165, 35], [185, 35, 18]);
    const box: BoundingBox = { x: 40, y: 40, width: 220, height: 80 };
    fillRect(img, 60, 58, 160, 36, 25, 12, 10);
    expect(SfxGate.isStylizedVisualSfx(img, box)).toBe(true);
  });

  it('catches SPLAT hollow white-fill black-outline fuchidori text on light-blue burst', () => {
    const img = makeImg(320, 200, 255, 255, 255);
    fillRect(img, 30, 30, 220, 110, 150, 210, 245); // light-blue burst (sat=95)
    const box: BoundingBox = { x: 45, y: 45, width: 180, height: 48 };
    paintFuchidoriBars(img, box);
    expect(SfxGate.isStylizedVisualSfx(img, box)).toBe(true);
  });

  it('NEVER rejects normal white or dark flat speech bubbles or flat pastel narration', () => {
    // Normal white speech bubble with black text
    const white = makeImg(300, 200, 255, 255, 255);
    const wBox: BoundingBox = { x: 50, y: 50, width: 160, height: 60 };
    fillRect(white, 70, 65, 110, 24, 15, 15, 15);
    expect(SfxGate.isStylizedVisualSfx(white, wBox)).toBe(false);

    // Normal dark/black speech bubble with white text
    const dark = makeImg(300, 200, 22, 22, 24);
    const dBox: BoundingBox = { x: 50, y: 50, width: 160, height: 60 };
    fillRect(dark, 70, 65, 110, 24, 248, 248, 248);
    expect(SfxGate.isStylizedVisualSfx(dark, dBox)).toBe(false);

    // Tall flat pastel narration box (#d8e8f8) with regular dark text
    const pastel = makeImg(300, 200, 216, 232, 248);
    const pBox: BoundingBox = { x: 40, y: 40, width: 180, height: 64 };
    fillRect(pastel, 60, 56, 130, 20, 20, 20, 25);
    expect(SfxGate.isStylizedVisualSfx(pastel, pBox)).toBe(false);

    // Tight white speech bubble (2px black border, black text "WAIT!") over blue sky
    const sky = makeImg(300, 200, 60, 150, 235);
    fillRect(sky, 48, 48, 144, 44, 15, 15, 15);
    fillRect(sky, 50, 50, 140, 40, 255, 255, 255);
    const tightBox: BoundingBox = { x: 52, y: 52, width: 136, height: 36 };
    fillRect(sky, 70, 62, 80, 14, 15, 15, 15);
    expect(SfxGate.isStylizedVisualSfx(sky, tightBox)).toBe(false);
    expect(SfxGate.hasFlatNeutralInterior(sky, tightBox)).toBe(true);

    // Middle line h=30 of 3-line white speech bubble on pure DBNet (!isComicDet) over art
    const dbImg = makeImg(300, 220, 70, 120, 60);
    fillRect(dbImg, 46, 36, 188, 128, 18, 18, 18);
    fillRect(dbImg, 50, 40, 180, 120, 255, 255, 255);
    fillRect(dbImg, 64, 52, 130, 26, 18, 18, 18); // line 1
    fillRect(dbImg, 64, 84, 130, 30, 18, 18, 18); // line 2 (h=30)
    fillRect(dbImg, 64, 120, 130, 26, 18, 18, 18); // line 3
    const midLine: BoundingBox = { x: 64, y: 84, width: 130, height: 30 };
    expect(SfxGate.isStylizedVisualSfx(dbImg, midLine)).toBe(false);
    expect(SfxGate.hasFlatNeutralInterior(dbImg, midLine)).toBe(true);
  });
});

describe('SfxGate.isBurstOnomatopoeia', () => {
  it('drops burst & foliage SFX (KWAAA!!!, WAAA!!!, SPLAT, HUFF, SHWIP, FUU, RUSTLE)', () => {
    const gradImg = makeImg(320, 200, 255, 255, 255);
    paintVerticalGradient(gradImg, 20, 20, 260, 120, [245, 140, 30], [190, 30, 20]);
    const burstBox: BoundingBox = { x: 40, y: 40, width: 200, height: 64 };
    expect(SfxGate.isBurstOnomatopoeia(gradImg, mkItem('KWAAA!!!', burstBox))).toBe(true);
    expect(SfxGate.isBurstOnomatopoeia(gradImg, mkItem('WAAA!!!', burstBox))).toBe(true);

    const blueBurst = makeImg(320, 200, 255, 255, 255);
    fillRect(blueBurst, 20, 20, 240, 120, 150, 210, 245);
    const splatBox: BoundingBox = { x: 45, y: 45, width: 180, height: 48 };
    paintFuchidoriBars(blueBurst, splatBox);
    expect(SfxGate.isBurstOnomatopoeia(blueBurst, mkItem('SPLAT', splatBox))).toBe(true);

    const foliage = makeImg(300, 200, 255, 255, 255);
    paintNoisyFoliage(foliage, 0, 0, 300, 200);
    const fBox: BoundingBox = { x: 60, y: 60, width: 120, height: 30 };
    for (const sfx of ['HUFF', 'SHWIP', 'FUU', 'RUSTLE', 'THWACK', 'BOOM', 'CRACK']) {
      expect(SfxGate.isBurstOnomatopoeia(foliage, mkItem(sfx, fBox))).toBe(true);
    }
  });

  it('NEVER drops normal short dialogue inside white or dark flat bubbles or flat narration', () => {
    const white = makeImg(300, 200, 255, 255, 255);
    const dark = makeImg(300, 200, 20, 20, 22);
    const box: BoundingBox = { x: 60, y: 60, width: 120, height: 32 };

    const shortDialogue = ['NO!', 'YES', 'WAIT!', 'WHAT?!', 'STOP!', 'DIE!', 'HUH?', 'AH!', 'OH!', 'OK'];
    for (const line of shortDialogue) {
      expect(SfxGate.isBurstOnomatopoeia(white, mkItem(line, box))).toBe(false);
      expect(SfxGate.isBurstOnomatopoeia(dark, mkItem(line, box))).toBe(false);
    }

    // Pastel flat narration & #dadde6 cloud prose
    const cloud = makeImg(300, 200, 255, 255, 255);
    fillRect(cloud, 40, 40, 220, 80, 0xda, 0xdd, 0xe6);
    expect(SfxGate.isBurstOnomatopoeia(cloud, mkItem('Meanwhile, back home', box))).toBe(false);

    // Shouted dialogue ("NOOO!", "GASP!", "SHH!", "SIGH...") inside tight white bubble (border 4px away)
    const tightBubble = makeImg(300, 200, 80, 130, 70);
    fillRect(tightBubble, 54, 54, 132, 44, 15, 15, 15);
    fillRect(tightBubble, 56, 56, 128, 40, 255, 255, 255);
    const tightDlgBox: BoundingBox = { x: 60, y: 60, width: 120, height: 32 };
    fillRect(tightBubble, 76, 68, 70, 14, 15, 15, 15);
    for (const shouted of ['NOOO!', 'GASP!', 'SHH!', 'SIGH...']) {
      expect(SfxGate.isBurstOnomatopoeia(tightBubble, mkItem(shouted, tightDlgBox))).toBe(false);
    }
  });

  it('bypasses all SFX gates when translateSfx=true and keeps non-SFX when translateSfx=false', () => {
    const gradImg = makeImg(320, 200, 255, 255, 255);
    paintVerticalGradient(gradImg, 20, 20, 260, 120, [245, 140, 30], [190, 30, 20]);
    const sfxBox: BoundingBox = { x: 40, y: 40, width: 200, height: 64, kind: 'sfx' };
    const dlgBox: BoundingBox = { x: 10, y: 155, width: 100, height: 30, kind: 'dialogue' };

    const gateBoxes = (boxes: BoundingBox[], translateSfx: boolean) =>
      translateSfx
        ? boxes
        : boxes.filter((b) => b.kind !== 'sfx' && !SfxGate.isStylizedVisualSfx(gradImg, b));

    expect(gateBoxes([sfxBox, dlgBox], false)).toEqual([dlgBox]);
    expect(gateBoxes([sfxBox, dlgBox], true)).toEqual([sfxBox, dlgBox]);
  });
});
