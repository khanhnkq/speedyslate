import { afterEach, describe, expect, it } from 'vitest';
import { BubbleGeometry } from '../../src/content/overlay/bubble-geometry';
import { ImageBoxSync } from '../../src/content/overlay/image-box-sync';
import { OverlayRenderer } from '../../src/content/overlay/overlay-renderer';
import { OverlayStyler } from '../../src/content/overlay/overlay-styler';
import { TextAutoFitter } from '../../src/content/overlay/text-auto-fitter';
import { DialogueItem } from '../../src/shared/types';

interface MockElement {
  tagName: string;
  id: string;
  className: string;
  title: string;
  textContent: string;
  dataset: Record<string, string>;
  children: MockElement[];
  parentElement: MockElement | null;
  clientWidth: number;
  clientHeight: number;
  scrollWidth: number;
  scrollHeight: number;
  offsetWidth: number;
  offsetHeight: number;
  complete?: boolean;
  style: Record<string, any> & {
    setProperty: (k: string, v: string, priority?: string) => void;
    getPropertyValue: (k: string) => string;
    removeProperty: (k: string) => void;
  };
  _rect: { left: number; top: number; width: number; height: number };
  _computedStyle: Record<string, string>;
  appendChild: (child: MockElement) => MockElement;
  remove: () => void;
  addEventListener: (ev: string, fn: (...args: any[]) => void, opts?: any) => void;
  getBoundingClientRect: () => { left: number; top: number; width: number; height: number };
  querySelector: (selector: string) => MockElement | null;
  querySelectorAll: (selector: string) => MockElement[];
}

function createMockElement(tag: string, rect?: { left: number; top: number; width: number; height: number }): MockElement {
  const customProps: Record<string, string> = {};
  const style: any = {
    setProperty(k: string, v: string) {
      customProps[k] = v;
      style[k] = v;
    },
    getPropertyValue(k: string) {
      return customProps[k] ?? style[k] ?? '';
    },
    removeProperty(k: string) {
      delete customProps[k];
      delete style[k];
    }
  };

  const el: MockElement = {
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
    style,
    _rect: rect ?? { left: 0, top: 0, width: 0, height: 0 },
    _computedStyle: {},
    appendChild(child: MockElement) {
      child.parentElement = el;
      el.children.push(child);
      return child;
    },
    remove() {
      if (!el.parentElement) return;
      el.parentElement.children = el.parentElement.children.filter((c) => c !== el);
      el.parentElement = null;
    },
    addEventListener() {},
    getBoundingClientRect() {
      return { ...el._rect };
    },
    querySelector(selector: string) {
      return el.querySelectorAll(selector)[0] ?? null;
    },
    querySelectorAll(selector: string) {
      const parts = selector.split(',').map((s) => s.trim()).filter(Boolean);
      const out: MockElement[] = [];
      const matchesPart = (node: MockElement, part: string): boolean => {
        if (part.startsWith('.')) {
          const attrMatch = part.match(/^\.([^\[]+)\[data-for="([^"]+)"\]$/);
          if (attrMatch) {
            return (
              node.className.split(/\s+/).includes(attrMatch[1]) &&
              node.dataset.for === attrMatch[2]
            );
          }
          return node.className.split(/\s+/).includes(part.slice(1));
        }
        return node.tagName.toLowerCase() === part.toLowerCase();
      };
      const walk = (node: MockElement) => {
        for (const child of node.children) {
          if (parts.some((p) => matchesPart(child, p))) out.push(child);
          walk(child);
        }
      };
      walk(el);
      return out;
    }
  };
  return el;
}

const origDocument = (globalThis as any).document;
const origGetComputedStyle = (globalThis as any).getComputedStyle;
const origResizeObserver = (globalThis as any).ResizeObserver;

afterEach(() => {
  (globalThis as any).document = origDocument;
  (globalThis as any).getComputedStyle = origGetComputedStyle;
  (globalThis as any).ResizeObserver = origResizeObserver;
});

describe('OverlayStyler CSS px padding & host resets', () => {
  it('applies px padding (never %), resets inherited host CSS, and respects pre-line when hasManualLineBreaks is true', () => {
    const bubble = createMockElement('div');
    const coords = {
      topPct: 20,
      leftPct: 30,
      widthPct: 25,
      heightPct: 12,
      pixelWidth: 200,
      pixelHeight: 144,
      aspectRatio: 0.72
    };

    OverlayStyler.applyStyles(
      bubble as unknown as HTMLElement,
      coords,
      13,
      false,
      '#ffffff',
      false,
      'dialogue',
      { padX: 18, padY: 9 },
      true
    );

    expect(bubble.style.padding).toBe('9px 18px');
    expect(bubble.style.padding).not.toContain('%');
    expect(bubble.style.pointerEvents).toBe('auto');
    expect(bubble.style.margin).toBe('0');
    expect(bubble.style.textIndent).toBe('0px');
    expect(bubble.style.wordSpacing).toBe('0px');
    expect(bubble.style.direction).toBe('ltr');
    expect(bubble.style.writingMode).toBe('horizontal-tb');
    expect(bubble.style.whiteSpace).toBe('pre-line');
    expect(bubble.style.getPropertyValue('text-wrap')).toBe('normal');

    const rectBubble = createMockElement('div');
    OverlayStyler.applyStyles(
      rectBubble as unknown as HTMLElement,
      coords,
      14,
      false,
      '#ffffff',
      false,
      'free'
    );
    expect(rectBubble.style.padding).toBe('3px 6px');
    expect(rectBubble.style.whiteSpace).toBe('normal');
    expect(rectBubble.style.getPropertyValue('text-wrap')).toBe('balance');
  });
});

describe('TextAutoFitter.fitScaledDialogue consistency', () => {
  const monoMeasure = (s: string, px: number) => s.length * px * 0.58;

  it('produces padX/padY matching OverlayStyler.computePaddingPx and wraps elliptical lines cleanly', () => {
    const natBoxW = 240;
    const natBoxH = 180;
    const natImgW = 1200;
    const renImgW = 600;
    const scale = renImgW / natImgW;
    const expectedPad = OverlayStyler.computePaddingPx(natBoxW * scale, natBoxH * scale, true);

    const fitted = TextAutoFitter.fitScaledDialogue(
      natBoxW,
      natBoxH,
      'CHÚNG TA PHẢI RỜI KHỎI ĐÂY NGAY LẬP TỨC TRƯỚC KHI TRỜI TỐI!',
      {
        naturalWidth: natImgW,
        renderedWidth: renImgW,
        elliptical: true,
        measureWidth: monoMeasure
      }
    );

    expect(fitted.padX).toBe(expectedPad.padX);
    expect(fitted.padY).toBe(expectedPad.padY);
    expect(fitted.lines.length).toBeGreaterThanOrEqual(2);
    expect(fitted.fontSize).toBeGreaterThanOrEqual(7.5);
    expect(
      TextAutoFitter.computeScaledFontSize(
        natBoxW,
        natBoxH,
        'CHÚNG TA PHẢI RỜI KHỎI ĐÂY NGAY LẬP TỨC TRƯỚC KHI TRỜI TỐI!',
        {
          naturalWidth: natImgW,
          renderedWidth: renImgW,
          elliptical: true,
          measureWidth: monoMeasure
        }
      )
    ).toBe(fitted.fontSize);
  });
});

describe('BubbleGeometry.computeCoordinates chamber, webtoon slice, normBox, and edge clamping', () => {
  it('centers horizontal chamberBox dialogues properly inside the bubble interior', () => {
    const item: DialogueItem = {
      id: 'd-horiz',
      box: { x: 220, y: 310, width: 140, height: 60 },
      chamberBox: { x: 200, y: 280, width: 180, height: 120 },
      originalText: 'WHAT ARE YOU DOING?',
      translatedText: 'CẬU ĐANG LÀM GÌ VẬY?',
      kind: 'dialogue',
      erasePatches: [{ x: 220, y: 310, width: 10, height: 10, pixels: '' }]
    };

    const coords = BubbleGeometry.computeCoordinates(item, 800, 1200);
    const centerX = coords.leftPct + coords.widthPct / 2;
    const centerY = coords.topPct + coords.heightPct / 2;
    expect(centerX).toBeCloseTo(((200 + 90) / 800) * 100, 1);
    expect(centerY).toBeCloseTo(((280 + 60) / 1200) * 100, 1);
  });

  it('does NOT clip a 55%-tall bubble in an 800x400 webtoon slice to 28%', () => {
    const item: DialogueItem = {
      id: 'd-slice',
      box: { x: 300, y: 90, width: 200, height: 220 }, // 220 / 400 = 55%
      originalText: 'LONG VERTICAL SLICE SPEECH',
      translatedText: 'ĐOẠN THOẠI CAO NẰM TRONG KHUNG CẮT WEBTOON',
      kind: 'dialogue'
    };

    const coords = BubbleGeometry.computeCoordinates(item, 800, 400);
    expect(coords.heightPct).toBeGreaterThan(50);
  });

  it('does NOT widen narrow Vision AI normBox bubbles', () => {
    const item: DialogueItem = {
      id: 'd-norm-narrow',
      box: { x: 0, y: 0, width: 0, height: 0 },
      normBox: { ymin: 200, xmin: 480, ymax: 450, xmax: 510 }, // 3% wide (24px on 800px), 25% tall
      originalText: 'おい',
      translatedText: 'Này!',
      kind: 'dialogue'
    };

    const coords = BubbleGeometry.computeCoordinates(item, 800, 1200);
    // Only the subtle 3*1.6*2=9.6px (1.2%) normBox ink-cover pad, NOT widened to 58px (7.25%)
    expect(coords.widthPct).toBeCloseTo(3 + (9.6 / 800) * 100, 2);
  });

  it('preserves true center when clamping edge bubbles inside [0.5, 99.5]', () => {
    const rightEdgeItem: DialogueItem = {
      id: 'd-edge-right',
      box: { x: 880, y: 400, width: 100, height: 80 }, // 88%..98%, centerX = 93%
      originalText: 'EDGE',
      translatedText: 'MÉP PHẢI',
      kind: 'dialogue'
    };

    const coords = BubbleGeometry.computeCoordinates(rightEdgeItem, 1000, 1000);
    expect(coords.leftPct + coords.widthPct).toBeLessThanOrEqual(99.5001);
    expect(coords.leftPct + coords.widthPct / 2).toBeCloseTo(93, 2);
  });

  it('never exceeds 99.5% right/bottom bound even for extreme corner bubbles (cx = 99.4, cy = 99.4)', () => {
    const extremeCornerItem: DialogueItem = {
      id: 'd-corner-extreme',
      box: { x: 984, y: 984, width: 20, height: 20 }, // cx = 99.4%, cy = 99.4%
      originalText: '!',
      translatedText: '!',
      kind: 'dialogue'
    };

    const coords = BubbleGeometry.computeCoordinates(extremeCornerItem, 1000, 1000);
    expect(coords.leftPct).toBeGreaterThanOrEqual(0.5);
    expect(coords.topPct).toBeGreaterThanOrEqual(0.5);
    expect(coords.leftPct + coords.widthPct).toBeLessThanOrEqual(99.5001);
    expect(coords.topPct + coords.heightPct).toBeLessThanOrEqual(99.5001);
  });
});

describe('ImageBoxSync.computePaintedImageRect DOM-to-bitmap alignment', () => {
  it('maps a centered 700px img inside a 1000px wrapper', () => {
    const wrapper = createMockElement('div', { left: 0, top: 0, width: 1000, height: 1400 });
    const img = createMockElement('img', { left: 150, top: 0, width: 700, height: 1400 });
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

    const rect = ImageBoxSync.computePaintedImageRect(
      wrapper as unknown as HTMLElement,
      img as unknown as HTMLImageElement,
      700,
      1400
    );
    expect(rect.leftPct).toBeCloseTo(15, 2);
    expect(rect.widthPct).toBeCloseTo(70, 2);
    expect(rect.renderedWidth).toBeCloseTo(700, 2);
  });

  it('subtracts img padding and border offsets', () => {
    const wrapper = createMockElement('div', { left: 0, top: 0, width: 840, height: 1240 });
    const img = createMockElement('img', { left: 0, top: 0, width: 840, height: 1240 });
    (globalThis as any).getComputedStyle = () => ({
      paddingLeft: '15px',
      paddingRight: '15px',
      paddingTop: '10px',
      paddingBottom: '10px',
      borderLeftWidth: '5px',
      borderRightWidth: '5px',
      borderTopWidth: '10px',
      borderBottomWidth: '10px',
      objectFit: 'fill'
    });

    const rect = ImageBoxSync.computePaintedImageRect(
      wrapper as unknown as HTMLElement,
      img as unknown as HTMLImageElement,
      800,
      1200
    );
    expect(rect.renderedWidth).toBeCloseTo(800, 2);
    expect(rect.renderedHeight).toBeCloseTo(1200, 2);
    expect(rect.leftPct).toBeCloseTo((20 / 840) * 100, 2);
    expect(rect.topPct).toBeCloseTo((20 / 1240) * 100, 2);
  });

  it('accounts for object-fit: contain letterboxing (1440x900 container with 600x900 comic page)', () => {
    const wrapper = createMockElement('div', { left: 0, top: 0, width: 1440, height: 900 });
    const img = createMockElement('img', { left: 0, top: 0, width: 1440, height: 900 });
    (globalThis as any).getComputedStyle = () => ({
      paddingLeft: '0px',
      paddingRight: '0px',
      paddingTop: '0px',
      paddingBottom: '0px',
      borderLeftWidth: '0px',
      borderRightWidth: '0px',
      borderTopWidth: '0px',
      borderBottomWidth: '0px',
      objectFit: 'contain'
    });

    const rect = ImageBoxSync.computePaintedImageRect(
      wrapper as unknown as HTMLElement,
      img as unknown as HTMLImageElement,
      600,
      900
    );
    expect(rect.renderedWidth).toBeCloseTo(600, 2);
    expect(rect.renderedHeight).toBeCloseTo(900, 2);
    expect(rect.leftPct).toBeCloseTo((420 / 1440) * 100, 2);
    expect(rect.widthPct).toBeCloseTo((600 / 1440) * 100, 2);
  });

  it('evaluates object-fit: scale-down against true img.naturalWidth rather than compressed OCR naturalWidth', () => {
    const wrapper = createMockElement('div', { left: 0, top: 0, width: 1400, height: 2100 });
    const img: any = createMockElement('img', { left: 0, top: 0, width: 1400, height: 2100 });
    img.naturalWidth = 1600;
    img.naturalHeight = 2400;
    (globalThis as any).getComputedStyle = () => ({
      paddingLeft: '0px',
      paddingRight: '0px',
      paddingTop: '0px',
      paddingBottom: '0px',
      borderLeftWidth: '0px',
      borderRightWidth: '0px',
      borderTopWidth: '0px',
      borderBottomWidth: '0px',
      objectFit: 'scale-down'
    });

    const rect = ImageBoxSync.computePaintedImageRect(
      wrapper as unknown as HTMLElement,
      img as unknown as HTMLImageElement,
      1280,
      1920
    );
    expect(rect.renderedWidth).toBeCloseTo(1400, 2);
    expect(rect.renderedHeight).toBeCloseTo(2100, 2);
    expect(rect.leftPct).toBeCloseTo(0, 2);
    expect(rect.widthPct).toBeCloseTo(100, 2);
  });
});

describe('OverlayRenderer.renderDialogues layer & bubble-text DOM contract', () => {
  it('mounts .speedyslate-overlay-layer, .speedyslate-bubble-text with \\n breaks, and padding/raw-text datasets', () => {
    (globalThis as any).document = {
      getElementById: () => null,
      createElement: (tag: string) => createMockElement(tag),
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

    const wrapper = createMockElement('div', { left: 0, top: 0, width: 800, height: 1200 });
    const img = createMockElement('img', { left: 100, top: 0, width: 600, height: 1200 });
    img.complete = true;
    wrapper.appendChild(img);

    const dialogues: DialogueItem[] = [
      {
        id: 'b-multi',
        box: { x: 180, y: 200, width: 180, height: 140 },
        chamberBox: { x: 170, y: 190, width: 200, height: 160 },
        originalText: 'WAIT FOR ME RIGHT HERE!',
        translatedText: 'ĐỢI TÔI Ở ĐÂY NHÉ ĐỪNG ĐI ĐÂU CẢ!',
        kind: 'dialogue',
        isOvalChamber: true
      }
    ];

    OverlayRenderer.renderDialogues(
      wrapper as unknown as HTMLElement,
      dialogues,
      800,
      1200,
      'light'
    );

    const layer = wrapper.querySelector('.speedyslate-overlay-layer');
    expect(layer).not.toBeNull();
    expect(layer!.style.left).toBe('12.5%'); // 100 / 800
    expect(layer!.style.width).toBe('75%'); // 600 / 800
    expect(layer!.style.pointerEvents).toBe('none');

    const bubble = layer!.querySelector('.speedyslate-bubble');
    expect(bubble).not.toBeNull();
    expect(bubble!.dataset.rawText).toBe('ĐỢI TÔI Ở ĐÂY NHÉ ĐỪNG ĐI ĐÂU CẢ!');
    expect(Number(bubble!.dataset.padX)).toBeGreaterThanOrEqual(3);
    expect(Number(bubble!.dataset.padY)).toBeGreaterThanOrEqual(2);
    expect(bubble!.style.padding).toBe(`${bubble!.dataset.padY}px ${bubble!.dataset.padX}px`);
    expect(bubble!.style.whiteSpace).toBe('pre-line');

    const textSpan = bubble!.querySelector('.speedyslate-bubble-text');
    expect(textSpan).not.toBeNull();
    expect(textSpan!.textContent).toContain('\n');
    expect(textSpan!.style.display).toBe('block');
    expect(textSpan!.style.pointerEvents).toBe('none');
  });

  it('clamps mounted bubbles down to 6.5px when textSpan.scrollWidth overflows availClientW from 22px', () => {
    (globalThis as any).document = {
      getElementById: () => null,
      createElement: (tag: string) => {
        const el = createMockElement(tag);
        if (tag === 'div') {
          el.clientWidth = 80;
          el.clientHeight = 50;
        } else if (tag === 'span') {
          Object.defineProperty(el, 'offsetWidth', { get: () => 70 });
          Object.defineProperty(el, 'offsetHeight', { get: () => 20 });
          Object.defineProperty(el, 'scrollWidth', {
            get: () => {
              const fs = parseFloat(el.parentElement?.style.fontSize || '22');
              return fs > 7 ? 120 : 60;
            }
          });
        }
        return el;
      },
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

    const wrapper = createMockElement('div', { left: 0, top: 0, width: 800, height: 1200 });
    const img = createMockElement('img', { left: 0, top: 0, width: 800, height: 1200 });
    img.complete = true;
    wrapper.appendChild(img);

    const dialogues: DialogueItem[] = [
      {
        id: 'b-clamp',
        box: { x: 100, y: 100, width: 160, height: 120 },
        originalText: 'HI',
        translatedText: 'SUPERLONGUNBREAKABLEWORD',
        kind: 'free'
      }
    ];

    OverlayRenderer.renderDialogues(
      wrapper as unknown as HTMLElement,
      dialogues,
      800,
      1200,
      'light'
    );

    const bubble = wrapper.querySelector('.speedyslate-bubble');
    expect(bubble).not.toBeNull();
    expect(parseFloat(bubble!.style.fontSize)).toBeLessThanOrEqual(7);
  });
});
