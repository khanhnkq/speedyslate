import { afterEach, describe, expect, it } from 'vitest';
import { ChamberGapScanner } from '../../src/worker/chamber-gap-scanner';
import { BubbleAggregator } from '../../src/worker/bubble-aggregator';
import { EraseMasker } from '../../src/worker/erase-masker';
import { OverlayRenderer } from '../../src/content/overlay/overlay-renderer';
import { BoundingBox, DialogueItem } from '../../src/shared/types';

function makeBuffer(w: number, h: number, fill = 252): Uint8ClampedArray {
  const data = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    const p = i * 4;
    data[p] = fill;
    data[p + 1] = fill;
    data[p + 2] = fill;
    data[p + 3] = 255;
  }
  return data;
}

function setPixel(data: Uint8ClampedArray, w: number, x: number, y: number, v: number): void {
  const p = (y * w + x) * 4;
  data[p] = v;
  data[p + 1] = v;
  data[p + 2] = v;
  data[p + 3] = 255;
}

function paintRect(data: Uint8ClampedArray, w: number, h: number, x0: number, y0: number, rw: number, rh: number, v: number): void {
  const xEnd = Math.min(w, x0 + rw);
  const yEnd = Math.min(h, y0 + rh);
  for (let y = Math.max(0, y0); y < yEnd; y++) {
    for (let x = Math.max(0, x0); x < xEnd; x++) {
      setPixel(data, w, x, y, v);
    }
  }
}

function lumaAt(px: Uint8ClampedArray, w: number, x: number, y: number): number {
  const p = (y * w + x) * 4;
  return (px[p] * 299 + px[p + 1] * 587 + px[p + 2] * 114) / 1000;
}

describe('ChamberGapScanner — wide white bubbles & open backgrounds', () => {
  it('recovers a missed middle line inside a wide 500x360 white bubble with 3.2x top-to-bottom gap', () => {
    const w = 600;
    const h = 440;
    const data = makeBuffer(w, h, 185);

    // 500x360 enclosed white bubble: x=50..550, y=40..400, 3px black border
    paintRect(data, w, h, 50, 40, 500, 360, 15);
    paintRect(data, w, h, 53, 43, 494, 354, 252);

    const drawTextBand = (y0: number, y1: number, x0: number, x1: number) => {
      for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x += 6) {
          setPixel(data, w, x, y, 14);
          setPixel(data, w, x + 1, y, 14);
        }
      }
    };

    // Top line: y=100..125 (h=26), middle (missed): y=156..181 (h=26), bottom: y=210..235 (h=26)
    // Gap between top & bottom = 210 - 126 = 84px (~3.23 * 26)
    drawTextBand(100, 125, 150, 450);
    drawTextBand(156, 181, 175, 425);
    drawTextBand(210, 235, 150, 450);

    const existing: BoundingBox[] = [
      { x: 148, y: 99, width: 304, height: 28, kind: 'dialogue' },
      { x: 148, y: 209, width: 304, height: 28, kind: 'dialogue' }
    ];

    const recovered = ChamberGapScanner.recoverMissedLines({ data, width: w, height: h }, existing);
    expect(recovered.length).toBe(1);
    expect(recovered[0].y).toBeLessThanOrEqual(158);
    expect(recovered[0].y + recovered[0].height).toBeGreaterThanOrEqual(180);
  });

  it('rejects open white background (returns 0 recovered boxes)', () => {
    const w = 600;
    const h = 400;
    const data = makeBuffer(w, h, 252);

    for (let y = 156; y <= 181; y++) {
      for (let x = 180; x <= 420; x += 6) {
        setPixel(data, w, x, y, 14);
        setPixel(data, w, x + 1, y, 14);
      }
    }

    const existing: BoundingBox[] = [
      { x: 150, y: 100, width: 300, height: 26, kind: 'dialogue' },
      { x: 150, y: 210, width: 300, height: 26, kind: 'dialogue' }
    ];

    const recovered = ChamberGapScanner.recoverMissedLines({ data, width: w, height: h }, existing);
    expect(recovered).toHaveLength(0);
  });
});

describe('BubbleAggregator — wide-gap merge vs border wall split', () => {
  it('merges cleanly-aligned dialogue lines 2.2x apart inside one uniform bubble when pageImg is provided', () => {
    const w = 500;
    const h = 400;
    const data = makeBuffer(w, h, 255);
    // Outer bubble side rims well outside text boxes
    paintRect(data, w, h, 40, 40, 6, 260, 12);
    paintRect(data, w, h, 440, 40, 6, 260, 12);

    // Draw ~20% dark text pixels inside each line box so classifyPaper sees light paper
    paintRect(data, w, h, 130, 82, 40, 26, 15);
    paintRect(data, w, h, 140, 178, 40, 26, 15);

    const items: DialogueItem[] = [
      {
        id: 'top',
        kind: 'dialogue',
        originalText: 'TOP LINE',
        box: { x: 120, y: 80, width: 200, height: 30 } // bottom = 110
      },
      {
        id: 'bot',
        kind: 'dialogue',
        originalText: 'BOTTOM LINE',
        box: { x: 130, y: 176, width: 180, height: 30 } // gap = 66 = 2.2 * 30
      }
    ];

    const out = BubbleAggregator.aggregateDialogues(items, w, h, undefined, { data, width: w, height: h });
    expect(out).toHaveLength(1);
    expect(out[0].originalText).toBe('TOP LINE BOTTOM LINE');
    expect(out[0].lineBoxes).toHaveLength(2);
  });

  it('splits lines 2.2x apart when a black border wall exists between them', () => {
    const w = 500;
    const h = 400;
    const data = makeBuffer(w, h, 255);
    paintRect(data, w, h, 130, 82, 40, 26, 15);
    paintRect(data, w, h, 140, 178, 40, 26, 15);
    // 3px black border wall separating top and bottom bubbles across the gap
    paintRect(data, w, h, 80, 142, 300, 3, 12);

    const items: DialogueItem[] = [
      {
        id: 'top-w',
        kind: 'dialogue',
        originalText: 'UPPER BUBBLE',
        box: { x: 120, y: 80, width: 200, height: 30 }
      },
      {
        id: 'bot-w',
        kind: 'dialogue',
        originalText: 'LOWER BUBBLE',
        box: { x: 130, y: 176, width: 180, height: 30 }
      }
    ];

    const out = BubbleAggregator.aggregateDialogues(items, w, h, undefined, { data, width: w, height: h });
    expect(out).toHaveLength(2);
    expect(out.map((b) => b.originalText)).toEqual(['UPPER BUBBLE', 'LOWER BUBBLE']);
  });
});

describe('EraseMasker — clipped stroke completion without touching curved walls', () => {
  it('completes ascender/descender strokes clipped at ry0 and ry1-1 while keeping curved bubble walls intact', () => {
    const w = 140;
    const h = 130;
    const data = makeBuffer(w, h, 190);

    const borderPixels: Array<[number, number]> = [];
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const d = Math.hypot((x - 70) / 56, (y - 65) / 52);
        if (d < 0.91) {
          setPixel(data, w, x, y, 252);
        } else if (d <= 1.0) {
          setPixel(data, w, x, y, 16);
          borderPixels.push([x, y]);
        }
      }
    }

    const innerRect = { x0: 36, y0: 46, x1: 104, y1: 74 };

    // Clipped ascender stem extending above ry0=46 up to y=35 (11px above ry0)
    const clippedTop: Array<[number, number]> = [];
    for (let y = 35; y <= 66; y++) {
      for (let x = 52; x <= 55; x++) {
        setPixel(data, w, x, y, 16);
        if (y < innerRect.y0) clippedTop.push([x, y]);
      }
    }

    // Clipped descender stem extending below ry1-1=73 down to y=84 (11px below ry1-1)
    const clippedBot: Array<[number, number]> = [];
    for (let y = 56; y <= 84; y++) {
      for (let x = 80; x <= 83; x++) {
        setPixel(data, w, x, y, 16);
        if (y >= innerRect.y1) clippedBot.push([x, y]);
      }
    }

    const patch = EraseMasker.buildPatch(
      { data, width: w, height: h } as ImageData,
      0,
      0,
      '#fcfcfc',
      undefined,
      undefined,
      undefined,
      innerRect
    );

    expect(patch).not.toBeNull();
    const out = patch!.pixels as Uint8ClampedArray;

    for (const [gx, gy] of [...clippedTop, ...clippedBot]) {
      const idx = (gy * w + gx) * 4;
      expect(out[idx + 3]).toBe(255);
      expect(lumaAt(out, w, gx, gy)).toBeGreaterThan(240);
    }

    for (const [bx, by] of borderPixels) {
      expect(out[(by * w + bx) * 4 + 3]).toBe(0);
    }
  });
});

describe('OverlayRenderer & OverlayStyler — no opaque fallback for free/sfx', () => {
  const origDocument = (globalThis as any).document;
  const origGetComputedStyle = (globalThis as any).getComputedStyle;

  afterEach(() => {
    (globalThis as any).document = origDocument;
    (globalThis as any).getComputedStyle = origGetComputedStyle;
  });

  function createMockEl(tag: string, rect?: { left: number; top: number; width: number; height: number }): any {
    const customProps: Record<string, string> = {};
    const style: any = {
      setProperty(k: string, v: string) {
        customProps[k] = v;
        style[k] = v;
      },
      getPropertyValue(k: string) {
        return customProps[k] ?? style[k] ?? '';
      }
    };
    const el: any = {
      tagName: tag.toUpperCase(),
      id: '',
      className: '',
      title: '',
      textContent: '',
      dataset: {},
      children: [],
      parentElement: null,
      clientWidth: rect?.width ?? 0,
      clientHeight: rect?.height ?? 0,
      scrollWidth: rect?.width ?? 0,
      scrollHeight: rect?.height ?? 0,
      offsetWidth: 0,
      offsetHeight: 0,
      complete: true,
      style,
      _rect: rect ?? { left: 0, top: 0, width: 0, height: 0 },
      appendChild(child: any) {
        child.parentElement = el;
        el.children.push(child);
        return child;
      },
      remove() {
        if (!el.parentElement) return;
        el.parentElement.children = el.parentElement.children.filter((c: any) => c !== el);
        el.parentElement = null;
      },
      addEventListener() {},
      getBoundingClientRect() {
        return { ...el._rect };
      },
      querySelector(sel: string) {
        return el.querySelectorAll(sel)[0] ?? null;
      },
      querySelectorAll(sel: string) {
        const parts = sel.split(',').map((s) => s.trim()).filter(Boolean);
        const out: any[] = [];
        const walk = (node: any) => {
          for (const child of node.children) {
            const matched = parts.some((p) => {
              if (p.startsWith('.')) {
                return child.className.split(/\s+/).includes(p.slice(1));
              }
              return child.tagName.toLowerCase() === p.toLowerCase();
            });
            if (matched) out.push(child);
            walk(child);
          }
        };
        walk(el);
        return out;
      }
    };
    return el;
  }

  it('emits ZERO .speedyslate-erase-patch divs, transparent bg, and stroke+shadow halo for unpatched free/sfx', () => {
    (globalThis as any).document = {
      getElementById: () => null,
      createElement: (tag: string) => createMockEl(tag),
      querySelectorAll: () => []
    };
    (globalThis as any).getComputedStyle = () => ({
      paddingLeft: '0px',
      paddingRight: '0px',
      paddingTop: '0px',
      paddingBottom: '0px',
      borderLeftWidth: '0px',
      borderRightWidth: '0px',
      borderTopWidth: '0px',
      borderBottomWidth: '0px',
      objectFit: 'fill'
    });

    const wrapper = createMockEl('div', { left: 0, top: 0, width: 800, height: 1200 });
    const img = createMockEl('img', { left: 0, top: 0, width: 800, height: 1200 });
    wrapper.appendChild(img);

    const dialogues: DialogueItem[] = [
      {
        id: 'free-1',
        kind: 'free',
        box: { x: 80, y: 120, width: 180, height: 50 },
        lineBoxes: [{ x: 80, y: 120, width: 180, height: 50 }],
        originalText: 'OUTSIDE ART',
        translatedText: 'NGOÀI KHUNG TRANH'
      },
      {
        id: 'sfx-1',
        kind: 'sfx',
        box: { x: 300, y: 300, width: 140, height: 60 },
        lineBoxes: [{ x: 300, y: 300, width: 140, height: 60 }],
        originalText: 'BAM!',
        translatedText: 'RẦM!'
      }
    ];

    OverlayRenderer.renderDialogues(wrapper, dialogues, 800, 1200, 'auto');

    const patches = wrapper.querySelectorAll('.speedyslate-erase-patch');
    expect(patches).toHaveLength(0);

    const bubbles = wrapper.querySelectorAll('.speedyslate-bubble');
    expect(bubbles).toHaveLength(2);
    for (const b of bubbles) {
      expect(b.style.backgroundColor).toBe('transparent');
      expect(b.style.getPropertyValue('-webkit-text-stroke')).toContain('3px');
      expect(b.style.getPropertyValue('paint-order')).toBe('stroke fill');
      expect(b.style.textShadow).toContain('-1px -1px 0');
    }
  });
});
