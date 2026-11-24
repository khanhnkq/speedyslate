import { BubbleAggregator } from '../src/worker/bubble-aggregator';
import { OverlayRenderer } from '../src/content/overlay/overlay-renderer';
import type { DialogueItem } from '../src/shared/types';
import { decodePixels } from '../src/shared/erase-codec';

/**
 * SpeedySlate OCR Test Harness — chạy worker.js build thật trên ảnh test-fixtures,
 * dùng đúng production code (BubbleAggregator + OverlayRenderer) để đo tốc độ & xem output.
 */

interface LocalModel { id: string; dir: string; note: string }
const MODELS: LocalModel[] = [
  { id: 'comic-manga-manhwa', dir: 'comic-manga-manhwa', note: 'RT-DETR comic det 11MB + en v4 rec' },
  { id: 'paddle-det-mobile', dir: 'paddle-det-mobile', note: 'PP-OCRv4 mobile det 4.7MB + en v4 rec' },
  { id: 'ppocr-v5-english-fast', dir: 'ppocr-v5-english-fast', note: 'PP-OCRv4 det + PP-OCRv5 en rec (~12.2MB)' },
  { id: 'ppocr-v6-multilingual', dir: 'ppocr-v6-multilingual', note: 'PP-OCRv4 det + PP-OCRv6 small rec (~25MB)' }
];

const FIXTURES_DIR = '/test-fixtures/yotogi-mura';
const WORKER_URL = '/dist/chrome/worker.js';

interface ImgResult {
  file: string;
  ok: boolean;
  detMs?: number; recMs?: number; totalMs?: number;
  boxCount?: number; dialogueCount?: number;
  dialogues?: DialogueItem[];
  error?: string;
}

const results: ImgResult[] = [];
let worker: Worker | null = null;
let reqCounter = 0;
let runTag: string | null = null;
const pending = new Map<string, { resolve: (v: any) => void; reject: (e: Error) => void }>();

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const status = (t: string) => { $('status').textContent = t; };

function nextReqId() { return `h_${++reqCounter}_${Date.now()}`; }

function sendToWorker(msg: any, transfer?: Transferable[]): Promise<any> {
  return new Promise((resolve, reject) => {
    pending.set(msg._reqId, { resolve, reject });
    worker!.postMessage(msg, transfer && transfer.length ? transfer : undefined);
  });
}

function ensureWorker(): Worker {
  if (worker) return worker;
  worker = new Worker(WORKER_URL, { type: 'module' });
  worker.onmessage = (e: MessageEvent) => {
    const { _reqId, ...msg } = e.data;
    if (_reqId && pending.has(_reqId)) {
      const cb = pending.get(_reqId)!;
      pending.delete(_reqId);
      if (msg.type === 'ERROR') cb.reject(new Error(msg.error));
      else cb.resolve(msg);
    }
  };
  worker.onerror = (e) => {
    for (const [, cb] of pending) cb.reject(new Error(`Worker crash: ${e.message}`));
    pending.clear();
    worker = null;
  };
  return worker;
}

let lastInitMs = 0;
let lastActualBackend = 'wasm';

async function loadModel(modelId: string, useWebGpu: boolean): Promise<void> {
  const m = MODELS.find((x) => x.id === modelId)!;
  const base = `/test-fixtures/models/${m.dir}`;
  status(`downloading model ${m.id}…`);
  const [detBuffer, recBuffer, keysText, det2Buffer] = await Promise.all([
    fetch(`${base}/det.onnx`).then((r) => r.arrayBuffer()),
    fetch(`${base}/rec.onnx`).then((r) => r.arrayBuffer()),
    fetch(`${base}/dict.txt`).then((r) => r.text()),
    fetch(`${base}/det2.onnx`).then((r) => (r.ok ? r.arrayBuffer() : undefined)).catch(() => undefined)
  ]);
  status(`init model ${m.id} (det ${(detBuffer.byteLength / 1e6).toFixed(1)}MB${det2Buffer ? ` + det2 ${(det2Buffer.byteLength / 1e6).toFixed(1)}MB` : ''})…`);
  const tInit = performance.now();
  const transfers = [detBuffer, recBuffer, ...(det2Buffer ? [det2Buffer] : [])];
  const res = await sendToWorker(
    { _reqId: nextReqId(), type: 'INIT_MODEL', modelId: m.id, detBuffer, det2Buffer, recBuffer, keysText, useWebGpu },
    transfers
  );
  if (!res.success) throw new Error(res.error || 'init failed');
  lastInitMs = Math.round(performance.now() - tInit);
  lastActualBackend = res.backend || 'wasm';
  status(`model ready: ${m.id} @ ${lastActualBackend} (${lastInitMs}ms)`);
}

function makeCard(file: string): { stage: HTMLElement; panel: HTMLElement; card: HTMLElement } {
  const card = document.createElement('div');
  card.className = 'img-card';
  card.innerHTML = `<div class="img-head"><b>${file}</b><span class="stat"></span><button class="secondary run-one">Run</button></div>
    <div class="img-body"><div class="stage"><img src="${FIXTURES_DIR}/${file}"/><canvas class="boxes"></canvas></div>
    <div class="panel">chưa chạy…</div></div>`;
  $('results').appendChild(card);
  return {
    stage: card.querySelector('.stage')!,
    panel: card.querySelector('.panel')!,
    card
  };
}

function drawBoxes(stage: HTMLElement, img: HTMLImageElement, dialogues: DialogueItem[]) {
  const canvas = stage.querySelector('canvas.boxes') as HTMLCanvasElement;
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d')!;
  ctx.lineWidth = 3;
  for (const d of dialogues) {
    ctx.strokeStyle = d.kind === 'sfx' ? '#a78bfa' : '#22c55e';
    ctx.strokeRect(d.box.x, d.box.y, d.box.width, d.box.height);
    if (d.lineBoxes) {
      ctx.strokeStyle = 'rgba(239,68,68,0.75)';
      ctx.lineWidth = 1.5;
      for (const lb of d.lineBoxes) ctx.strokeRect(lb.x, lb.y, lb.width, lb.height);
      ctx.lineWidth = 3;
    }
  }
}

function renderPanel(panel: HTMLElement, dialogues: DialogueItem[]) {
  if (!dialogues.length) { panel.innerHTML = '<i>không có dialogue</i>'; return; }
  panel.innerHTML = `<table>${dialogues.map((d, i) =>
    `<tr><td>${i + 1}</td><td>${escapeHtml(d.originalText)}</td>
     <td class="conf">${d.confidence !== undefined ? d.confidence.toFixed(2) : ''}</td>
     <td class="kind">${d.kind || ''}${d.isVertical ? ' ⤵' : ''}</td></tr>`).join('')}</table>`;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}

/** Vẽ ảnh + bubble boxes + text label rồi POST PNG annotated về server */
async function saveAnnotated(file: string, img: HTMLImageElement, dialogues: DialogueItem[]): Promise<void> {
  if (!runTag) return;
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  const c = cv.getContext('2d')!;
  c.drawImage(img, 0, 0, w, h);
  dialogues.forEach((d, i) => {
    c.strokeStyle = d.kind === 'sfx' ? '#a78bfa' : '#22c55e';
    c.lineWidth = 4;
    c.strokeRect(d.box.x, d.box.y, d.box.width, d.box.height);
    if (d.lineBoxes) {
      c.strokeStyle = 'rgba(239,68,68,0.8)';
      c.lineWidth = 2;
      for (const lb of d.lineBoxes) c.strokeRect(lb.x, lb.y, lb.width, lb.height);
    }
    const label = `#${i + 1} ${d.originalText}`.slice(0, 80);
    c.font = 'bold 22px sans-serif';
    const tw = c.measureText(label).width;
    c.fillStyle = 'rgba(0,0,0,0.78)';
    c.fillRect(d.box.x, Math.max(0, d.box.y - 32), tw + 12, 32);
    c.fillStyle = '#fbbf24';
    c.fillText(label, d.box.x + 6, Math.max(23, d.box.y - 9));
  });
  const blob = await new Promise<Blob | null>((r) => cv.toBlob(r, 'image/png'));
  if (blob) {
    await fetch(`/save-image?name=${encodeURIComponent(file)}&run=${runTag}`, { method: 'POST', body: blob }).catch(() => {});
  }
}

/** Vẽ erase patches lên ảnh gốc — dùng chung cho preview và clean test */
function drawErasePatches(c: CanvasRenderingContext2D, d: DialogueItem, bg: string): void {
  if (d.erasePatches?.length) {
    for (const p of d.erasePatches) {
      const tmp = document.createElement('canvas');
      tmp.width = p.width;
      tmp.height = p.height;
      tmp.getContext('2d')!.putImageData(new ImageData(decodePixels(p.pixels), p.width, p.height), 0, 0);
      c.drawImage(tmp, p.x, p.y);
    }
  } else if (d.kind !== undefined && d.kind !== 'dialogue' && d.lineBoxes?.length) {
    c.fillStyle = bg;
    for (const lb of d.lineBoxes) {
      c.beginPath();
      c.roundRect(lb.x - 4, lb.y - 4, lb.width + 8, lb.height + 8, 6);
      c.fill();
    }
  } else {
    c.fillStyle = bg;
    c.beginPath();
    c.roundRect(d.box.x - 3, d.box.y - 3, d.box.width + 6, d.box.height + 6, 8);
    c.fill();
  }
}

const lumaOf = (hex?: string): number => {
  if (!hex || !/^#[0-9a-fA-F]{6}$/.test(hex)) return 255;
  return 0.299 * parseInt(hex.slice(1, 3), 16) + 0.587 * parseInt(hex.slice(3, 5), 16) + 0.114 * parseInt(hex.slice(5, 7), 16);
};

/** Clean test: chỉ ảnh + vùng xóa, KHÔNG vẽ text — đánh giá riêng chất lượng inpaint */
async function saveClean(file: string, img: HTMLImageElement, dialogues: DialogueItem[]): Promise<void> {
  if (!runTag) return;
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  const c = cv.getContext('2d')!;
  c.drawImage(img, 0, 0, w, h);
  for (const d of dialogues) {
    const bg = d.bgColor && /^#[0-9a-fA-F]{6}$/.test(d.bgColor)
      ? d.bgColor
      : d.isDarkBackground ? '#111111' : '#ffffff';
    drawErasePatches(c, d, bg);
  }
  const blob = await new Promise<Blob | null>((r) => cv.toBlob(r, 'image/png'));
  if (blob) {
    await fetch(`/save-image?name=${encodeURIComponent(file + '-clean')}&run=${runTag}`, { method: 'POST', body: blob }).catch(() => {});
  }
}

/** Preview overlay thật: erase patch per-line + bubble rect theo bgColor + text */
async function savePreview(file: string, img: HTMLImageElement, dialogues: DialogueItem[]): Promise<void> {
  if (!runTag) return;
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  const c = cv.getContext('2d')!;
  c.drawImage(img, 0, 0, w, h);

  for (const d of dialogues) {
    const bg = d.bgColor && /^#[0-9a-fA-F]{6}$/.test(d.bgColor)
      ? d.bgColor
      : d.isDarkBackground ? '#111111' : '#ffffff';
    drawErasePatches(c, d, bg);
    // Text preview: wrap theo chiều rộng box, co font tới khi nằm gọn trong
    // vùng đã xóa — text tràn ra art trông như lớp đè.
    c.fillStyle = lumaOf(bg) < 140 ? '#ffffff' : '#000000';
    c.textAlign = 'center';
    const words = d.originalText.split(/\s+/);
    let fontPx = Math.max(12, Math.min(26, d.box.height / 6));
    let lines: string[] = [];
    for (let tries = 0; tries < 10; tries++) {
      c.font = `bold ${fontPx}px sans-serif`;
      lines = [];
      let cur = '';
      for (const wd of words) {
        const trial = cur ? cur + ' ' + wd : wd;
        if (c.measureText(trial).width > d.box.width - 8 && cur) { lines.push(cur); cur = wd; }
        else cur = trial;
      }
      if (cur) lines.push(cur);
      if (lines.length * fontPx * 1.25 <= d.box.height + 4 || fontPx <= 12) break;
      fontPx *= 0.88;
    }
    const lineH = fontPx * 1.25;
    const startY = d.box.y + d.box.height / 2 - ((lines.length - 1) * lineH) / 2 + fontPx * 0.35;
    lines.slice(0, 8).forEach((ln, i) => c.fillText(ln, d.box.x + d.box.width / 2, startY + i * lineH));
  }

  const blob = await new Promise<Blob | null>((r) => cv.toBlob(r, 'image/png'));
  if (blob) {
    await fetch(`/save-image?name=${encodeURIComponent(file + '-preview')}&run=${runTag}`, { method: 'POST', body: blob }).catch(() => {});
  }
}

async function runOne(file: string, stage: HTMLElement, panel: HTMLElement): Promise<ImgResult> {
  const t0 = performance.now();
  const res: ImgResult = { file, ok: false };
  try {
    const blob = await fetch(`${FIXTURES_DIR}/${file}`).then((r) => r.blob());
    const bitmap = await createImageBitmap(blob);
    const img = stage.querySelector('img') as HTMLImageElement;
    const w = img.naturalWidth || bitmap.width;
    const h = img.naturalHeight || bitmap.height;

    const out = await sendToWorker({ _reqId: nextReqId(), type: 'PROCESS_IMAGE', imageBitmap: bitmap }, [bitmap]);
    const raw: DialogueItem[] = out.dialogues || [];
    const dialogues = BubbleAggregator.aggregateDialogues(raw, w, h);

    // Preview overlay: dùng originalText làm translatedText để xem render thật
    dialogues.forEach((d) => (d.translatedText = d.originalText));
    drawBoxes(stage, img, dialogues);
    stage.querySelectorAll('.speedyslate-bubble, .speedyslate-erase-patch').forEach((el) => el.remove());
    OverlayRenderer.renderDialogues(stage, dialogues, w, h, 'auto');
    renderPanel(panel, dialogues);

    res.ok = true;
    res.detMs = out.timings?.detMs;
    res.recMs = out.timings?.recMs;
    res.totalMs = Math.round(performance.now() - t0);
    res.boxCount = out.timings?.boxCount;
    res.dialogueCount = dialogues.length;
    res.dialogues = dialogues.map((d) => ({
      ...d,
      translatedText: undefined,
      erasePatch: undefined,
      erasePatches: d.erasePatches?.map((p) => {
        let opaque = 0;
        const u8 = decodePixels(p.pixels);
        for (let i = 3; i < u8.length; i += 4) if (u8[i] > 0) opaque++;
        return { x: p.x, y: p.y, width: p.width, height: p.height, opaqueRatio: +(opaque / (p.width * p.height)).toFixed(2), dbg: (p as { dbg?: unknown }).dbg };
      })
    }));
    await saveAnnotated(file, img, dialogues);
    await saveClean(file, img, dialogues);
    await savePreview(file, img, dialogues);
  } catch (e: any) {
    res.error = e?.message || String(e);
    panel.innerHTML = `<span class="err">${escapeHtml(res.error!)}</span>`;
  }
  const stat = stage.closest('.img-card')!.querySelector('.stat')!;
  stat.textContent = res.ok
    ? `det ${res.detMs}ms · rec ${res.recMs}ms · total ${res.totalMs}ms · ${res.boxCount} boxes → ${res.dialogueCount} bubbles`
    : `ERR: ${res.error}`;
  return res;
}

function updateSummary() {
  const ok = results.filter((r) => r.ok);
  if (!ok.length) return;
  const sum = (k: 'detMs' | 'recMs' | 'totalMs') => Math.round(ok.reduce((a, r) => a + (r[k] || 0), 0));
  $('summary').textContent =
    `DONE ${ok.length}/${results.length} ảnh — Σ det ${sum('detMs')}ms · Σ rec ${sum('recMs')}ms · Σ total ${sum('totalMs')}ms` +
    ` · TB det ${Math.round(sum('detMs') / ok.length)}ms · TB rec ${Math.round(sum('recMs') / ok.length)}ms`;
  ($('btn-export') as HTMLButtonElement).disabled = false;
}

async function main() {
  const sel = $('model-select') as HTMLSelectElement;
  sel.innerHTML = MODELS.map((m) => `<option value="${m.id}">${m.id} — ${m.note}</option>`).join('');

  const manifest = await fetch(`${FIXTURES_DIR}/manifest.json`).then((r) => r.json());
  const files: string[] = manifest.files;
  const cards = new Map<string, { stage: HTMLElement; panel: HTMLElement }>();
  files.forEach((f) => cards.set(f, makeCard(f)));

  $('btn-load-model').addEventListener('click', async () => {
    ($('btn-load-model') as HTMLButtonElement).disabled = true;
    try {
      await loadModel(sel.value, ($('use-webgpu') as HTMLInputElement).checked);
      ($('btn-run-all') as HTMLButtonElement).disabled = false;
      for (const f of files) {
        const c = cards.get(f)!;
        (c.card.querySelector('.run-one') as HTMLButtonElement).onclick = async () => {
          const r = await runOne(f, c.stage, c.panel);
          results.splice(results.findIndex((x) => x.file === f), results.findIndex((x) => x.file === f) >= 0 ? 1 : 0, r);
          if (results.findIndex((x) => x.file === f) < 0) results.push(r);
          updateSummary();
        };
      }
    } catch (e: any) {
      status(`LOAD FAILED: ${e.message}`);
    }
    ($('btn-load-model') as HTMLButtonElement).disabled = false;
  });

  $('btn-run-all').addEventListener('click', async () => {
    ($('btn-run-all') as HTMLButtonElement).disabled = true;
    results.length = 0;
    for (const f of files) {
      const c = cards.get(f)!;
      status(`OCR ${f}…`);
      results.push(await runOne(f, c.stage, c.panel));
      updateSummary();
    }
    status(`xong ${results.length} ảnh`);
    ($('btn-run-all') as HTMLButtonElement).disabled = false;
  });

  $('btn-export').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify({ at: new Date().toISOString(), model: sel.value, results }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `ocr-results-${sel.value}-${Date.now()}.json`;
    a.click();
  });

  ensureWorker();

  // Auto mode: ?auto=1&model=<id>&backend=webgpu|wasm&images=all|0,3,5
  const params = new URLSearchParams(location.search);
  if (params.get('auto') === '1') {
    const modelId = params.get('model') || MODELS[0].id;
    const backend = params.get('backend') || 'webgpu';
    const imgParam = params.get('images') || 'all';
    const selected = imgParam === 'all' ? files : imgParam.split(',').map((i) => `${i.trim()}.jpeg`).filter((f) => files.includes(f));
    sel.value = modelId;
    ($('use-webgpu') as HTMLInputElement).checked = backend !== 'wasm';
    runTag = `${modelId}-${backend}-${Date.now().toString(36)}`;
    try {
      await loadModel(modelId, backend !== 'wasm');
      results.length = 0;
      for (const f of selected) {
        const c = cards.get(f)!;
        status(`auto OCR ${f}…`);
        results.push(await runOne(f, c.stage, c.panel));
        updateSummary();
      }
      const payload = {
        at: new Date().toISOString(),
        model: modelId,
        backend,
        actualBackend: lastActualBackend,
        initMs: lastInitMs,
        results
      };
      const saved = await fetch('/save-result', { method: 'POST', body: JSON.stringify(payload) }).then((r) => r.json());
      status(`AUTO DONE — saved ${saved.saved}`);
    } catch (e: any) {
      status(`AUTO FAILED: ${e.message}`);
      await fetch('/save-result', { method: 'POST', body: JSON.stringify({ at: new Date().toISOString(), model: modelId, backend, error: e.message, results }) }).catch(() => {});
    }
  } else {
    status('sẵn sàng — chọn model rồi bấm Load Model');
  }
}

main();
