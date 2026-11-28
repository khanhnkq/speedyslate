import { BubbleAggregator } from '/Users/nguyenkimquockhanh/Desktop/speedyslate/src/worker/bubble-aggregator';
import { encodeErasePatches, decodePixels } from '/Users/nguyenkimquockhanh/Desktop/speedyslate/src/shared/erase-codec';
import { OverlayRenderer } from '/Users/nguyenkimquockhanh/Desktop/speedyslate/src/content/overlay/overlay-renderer';
import { DialogueItem } from '/Users/nguyenkimquockhanh/Desktop/speedyslate/src/shared/types';
import { normalizeOcrForTranslation } from '/Users/nguyenkimquockhanh/Desktop/speedyslate/src/worker/ocr-text-normalizer';

// Provide minimal browser/chrome runtime shim so ComicFontLoader does not throw in plain web context
(window as any).browser = (window as any).browser || { runtime: { getURL: (p: string) => `/${p}` } };
(window as any).chrome = (window as any).chrome || { runtime: { getURL: (p: string) => `/${p}` } };

let worker: Worker | null = null;
let reqId = 0;
const pending = new Map<string, { resolve: (v: any) => void; reject: (e: Error) => void }>();

function ensureWorker(): Worker {
  if (worker) return worker;
  worker = new Worker('/worker.js', { type: 'module' });
  worker.onmessage = (e) => {
    const { _reqId, ...msg } = e.data || {};
    if (_reqId && pending.has(_reqId)) {
      const cb = pending.get(_reqId)!;
      pending.delete(_reqId);
      if (msg.type === 'ERROR') cb.reject(new Error(msg.error || 'Worker error'));
      else cb.resolve(msg);
    }
  };
  worker.onerror = (e) => {
    for (const cb of pending.values()) cb.reject(new Error(e.message || 'Worker crash'));
    pending.clear();
  };
  return worker;
}

function sendWorker(msg: any, transfer?: Transferable[]): Promise<any> {
  const id = `r_${++reqId}`;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    const w = ensureWorker();
    if (transfer?.length) w.postMessage({ ...msg, _reqId: id }, transfer);
    else w.postMessage({ ...msg, _reqId: id });
  });
}

(window as any).__e2e = {
  async initModels(presetId = 'comic-manga-manhwa'): Promise<any> {
    const [detRes, det2Res, recRes, keysRes] = await Promise.all([
      fetch(`/models/${presetId}/det.onnx`),
      fetch(`/models/${presetId}/det2.onnx`),
      fetch(`/models/${presetId}/rec.onnx`),
      fetch(`/models/${presetId}/dict.txt`)
    ]);
    if (!detRes.ok || !recRes.ok || !keysRes.ok) {
      throw new Error(`Missing model files for preset "${presetId}"`);
    }
    const [detBuffer, recBuffer, keysText] = await Promise.all([
      detRes.arrayBuffer(),
      recRes.arrayBuffer(),
      keysRes.text()
    ]);
    const det2Buffer = det2Res.ok ? await det2Res.arrayBuffer() : undefined;
    const transfer: Transferable[] = [detBuffer, recBuffer];
    if (det2Buffer) transfer.push(det2Buffer);
    return await sendWorker({
      type: 'INIT_MODEL',
      modelId: presetId,
      detBuffer,
      det2Buffer,
      recBuffer,
      keysText,
      useWebGpu: true
    }, transfer);
  },

  async processOne(fileName: string, translateSfx = false, noTranslate = false): Promise<any> {
    const stage = document.getElementById('stage')!;
    stage.innerHTML = '';

    const imgUrl = `/images/${encodeURIComponent(fileName)}`;
    const blob = await (await fetch(imgUrl)).blob();
    const bitmap = await createImageBitmap(blob);
    const width = bitmap.width;
    const height = bitmap.height;

    const workerRes = await sendWorker(
      { type: 'PROCESS_IMAGE', imageBitmap: bitmap, translateSfx },
      [bitmap]
    );
    const rawLines: DialogueItem[] = workerRes.dialogues || [];
    // Exact mirror of offscreen.ts: aggregateDialogues(rawLines) -> encodeErasePatches(dialogues)
    const bubbles = BubbleAggregator.aggregateDialogues(rawLines, width, height, 'en');
    const summarySnapshot = bubbles.map((b: any) => ({
      id: b.id,
      kind: b.kind,
      originalText: b.originalText,
      confidence: b.confidence !== undefined ? Number(b.confidence.toFixed(3)) : null,
      lineCount: b.lineBoxes?.length ?? 0,
      hasChamber: Boolean(b.chamberBox),
      isOval: b.isOvalChamber ?? null,
      isDark: Boolean(b.isDarkBackground),
      bgHex: b.bgColor ?? null,
      box: b.box,
      chamberBox: b.chamberBox ?? null,
      patchKinds: (b.erasePatches || []).map((p: any) => p.dbg?.path || 'unknown'),
      patchCoversInk: (b.erasePatches || []).map((p: any) => p.dbg?.coversLineInk ?? true)
    }));
    encodeErasePatches(bubbles);
    const pass2Bubbles = bubbles;

    let translated: DialogueItem[] = pass2Bubbles;
    if (pass2Bubbles.length > 0 && !noTranslate) {
      const trResp = await fetch('/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          texts: pass2Bubbles.map((d) => d.originalText),
          kinds: pass2Bubbles.map((d) => d.kind ?? 'dialogue'),
          translateSfx
        })
      });
      const trData = await trResp.json();
      const trTexts: string[] = trData.translations || [];
      translated = pass2Bubbles.map((d, i) => ({
        ...d,
        translatedText: (trTexts[i] || d.originalText).trim()
      })).filter((d) => (d.translatedText || '').length > 0);
    } else if (pass2Bubbles.length > 0 && noTranslate) {
      translated = pass2Bubbles.map((d) => ({
        ...d,
        translatedText: normalizeOcrForTranslation(d.originalText)
      }));
    }

    // Mount real DOM wrapper & render OverlayRenderer at natural width (capped at 960px for crisp capture)
    const wrapper = document.createElement('div');
    wrapper.className = 'speedyslate-wrapper';
    wrapper.style.width = `${width}px`;
    const imgEl = document.createElement('img');
    imgEl.src = imgUrl;
    imgEl.width = width;
    imgEl.height = height;
    wrapper.appendChild(imgEl);
    stage.appendChild(wrapper);

    await new Promise<void>((resolve) => {
      if (imgEl.complete) resolve();
      else imgEl.onload = () => resolve();
    });

    OverlayRenderer.renderDialogues(wrapper, translated, width, height, 'auto');
    try { await (document as any).fonts?.ready; } catch {}
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

    // Inspect rendered DOM bubbles for clipping, overflow, font size, fallback patches
    const fallbackRectCount = wrapper.querySelectorAll('.speedyslate-erase-patch').length;
    const cleanCanvas = wrapper.querySelector('.speedyslate-clean-canvas') as HTMLCanvasElement | null;
    const domBubbles = [...wrapper.querySelectorAll<HTMLElement>('.speedyslate-bubble')].map((el) => {
      const bRect = el.getBoundingClientRect();
      const span = el.querySelector<HTMLElement>('.speedyslate-bubble-text');
      const sRect = span?.getBoundingClientRect();
      const overflowW = span ? Math.max(span.offsetWidth, span.scrollWidth) - el.clientWidth : el.scrollWidth - el.clientWidth;
      const overflowH = span ? span.offsetHeight - el.clientHeight : el.scrollHeight - el.clientHeight;
      return {
        id: el.id,
        text: el.dataset.rawText || '',
        fontSize: parseFloat(el.style.fontSize || '0'),
        bgColor: el.style.backgroundColor,
        boxW: Math.round(bRect.width),
        boxH: Math.round(bRect.height),
        spanW: sRect ? Math.round(sRect.width) : 0,
        spanH: sRect ? Math.round(sRect.height) : 0,
        overflowW: Math.round(overflowW),
        overflowH: Math.round(overflowH),
        rect: {
          x: Math.round(bRect.left),
          y: Math.round(bRect.top),
          w: Math.round(bRect.width),
          h: Math.round(bRect.height)
        }
      };
    });

    return {
      fileName,
      width,
      height,
      timings: workerRes.timings,
      rawLineCount: rawLines.length,
      bubbleCount: translated.length,
      fallbackRectCount,
      hasCleanCanvas: Boolean(cleanCanvas),
      bubbles: summarySnapshot.map((p: any, idx: number) => ({
        ...p,
        normalizedText: normalizeOcrForTranslation(p.originalText || ''),
        translatedText: translated[idx]?.translatedText || '',
        dom: domBubbles[idx] || null
      })),
      rawLines: rawLines.map((l) => ({
        kind: l.kind,
        text: l.originalText,
        conf: l.confidence !== undefined ? Number(l.confidence.toFixed(3)) : null,
        box: l.box,
        clusterId: l.bubbleClusterId,
        patchPath: (l.erasePatch as any)?.dbg?.path || null
      }))
    };
  }
};
