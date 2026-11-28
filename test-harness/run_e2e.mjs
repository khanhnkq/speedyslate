import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import esbuild from '/Users/nguyenkimquockhanh/Desktop/speedyslate/node_modules/esbuild/lib/main.js';

const args = process.argv.slice(2);
const getArg = (prefix) => args.find((a) => a.startsWith(prefix))?.slice(prefix.length) || '';
const PRESET_ID = getArg('--preset=') || 'comic-manga-manhwa';
const FILES_ARG = getArg('--files=');
const LIMIT_ARG = parseInt(getArg('--limit=') || '0', 10);
const NO_TRANSLATE = args.includes('--no-translate');
const OUT_JSON_NAME = getArg('--out=') || (PRESET_ID === 'comic-manga-manhwa' ? 'results.json' : `results_${PRESET_ID}.json`);
const OUT_DIR_NAME = getArg('--out-dir=') || (PRESET_ID === 'comic-manga-manhwa' ? 'results' : `results_${PRESET_ID}`);

const REPO = '/Users/nguyenkimquockhanh/Desktop/speedyslate';
const HARNESS = path.join(REPO, 'test-harness');
const DIST_CHROME = path.join(REPO, 'dist/chrome');
const RENDERED_DIR = path.join(HARNESS, OUT_DIR_NAME);
const PROFILE_DIR = path.join(HARNESS, 'chrome_profile');
fs.mkdirSync(RENDERED_DIR, { recursive: true });
fs.mkdirSync(PROFILE_DIR, { recursive: true });

// 1. Bundle browser harness & GoogleFreeProvider
const appRes = esbuild.buildSync({
  entryPoints: [path.join(HARNESS, 'app_src.ts')],
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'browser',
  nodePaths: [path.join(REPO, 'node_modules')]
});
const appJs = appRes.outputFiles[0].text;

const gtxRes = esbuild.buildSync({
  entryPoints: [path.join(REPO, 'src/services/translation/google-translate-provider.ts')],
  bundle: true,
  write: false,
  format: 'cjs',
  platform: 'node'
});
const gtxMod = { exports: {} };
new Function('exports', 'require', 'module', gtxRes.outputFiles[0].text)(gtxMod.exports, (id) => { throw new Error(id); }, gtxMod);
const translator = new gtxMod.exports.GoogleFreeProvider();

// MIME helper
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.wasm': 'application/wasm',
  '.woff2': 'font/woff2',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.txt': 'text/plain; charset=utf-8',
  '.onnx': 'application/octet-stream'
};

function createServer() {
  return new Promise((resolve) => {
    const server = http.createServer(async (req, res) => {
      const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
      if (req.method === 'POST' && urlPath === '/translate') {
        let body = '';
        req.on('data', (c) => (body += c));
        req.on('end', async () => {
          try {
            const parsed = JSON.parse(body);
            const texts = parsed.texts || [];
            const kinds = parsed.kinds || [];
            const items = texts.map((t, i) => ({ text: t, kind: kinds[i] || 'dialogue' }));
            const translations = await translator.translateDialogues(texts, 'Tiếng Việt', 'English', {
              items,
              translateSfx: Boolean(parsed.translateSfx)
            });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ translations }));
          } catch (e) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ translations: [], error: e?.message }));
          }
        });
        return;
      }

      if (urlPath === '/' || urlPath === '/index.html') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(fs.readFileSync(path.join(HARNESS, 'index.html')));
        return;
      }
      if (urlPath === '/app.js') {
        res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
        res.end(appJs);
        return;
      }

      let filePath = null;
      if (urlPath.startsWith('/models/')) {
        filePath = path.join(HARNESS, urlPath.slice(1));
      } else if (urlPath.startsWith('/images/')) {
        filePath = path.join(HARNESS, urlPath.slice(1));
      } else {
        filePath = path.join(DIST_CHROME, urlPath.slice(1));
      }

      if (!filePath || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    });
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      resolve({ server, port: addr.port });
    });
  });
}

class CdpClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 0;
    this.pending = new Map();
  }

  async connect() {
    await new Promise((resolve, reject) => {
      this.ws.onopen = () => resolve();
      this.ws.onerror = () => reject(new Error('CDP WS error'));
    });
    this.ws.onmessage = (ev) => {
      const msg = JSON.parse(String(ev.data));
      if (msg.id && this.pending.has(msg.id)) {
        const cb = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) cb.reject(new Error(msg.error.message || JSON.stringify(msg.error)));
        else cb.resolve(msg.result);
      }
    };
  }

  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expr) {
    const res = await this.send('Runtime.evaluate', {
      expression: expr,
      awaitPromise: true,
      returnByValue: true
    });
    if (res.exceptionDetails) {
      throw new Error(res.exceptionDetails.exception?.description || JSON.stringify(res.exceptionDetails));
    }
    return res.result?.value;
  }

  close() {
    this.ws.close();
  }
}

async function main() {
  const { server, port } = await createServer();
  const cdpPort = 9333 + (port % 400);
  const chromeBin = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const chrome = spawn(chromeBin, [
    '--headless=new',
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${PROFILE_DIR}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-background-networking',
    '--enable-unsafe-webgpu',
    `http://127.0.0.1:${port}/index.html`
  ], { stdio: ['ignore', 'pipe', 'pipe'] });

  let wsUrl = '';
  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 250));
    try {
      const targets = await (await fetch(`http://127.0.0.1:${cdpPort}/json/list`)).json();
      const page = targets.find((t) => t.type === 'page' && t.url.includes(`127.0.0.1:${port}`));
      if (page?.webSocketDebuggerUrl) {
        wsUrl = page.webSocketDebuggerUrl;
        break;
      }
    } catch {}
  }
  if (!wsUrl) throw new Error('Failed to attach Chrome CDP');

  const cdp = new CdpClient(wsUrl);
  try {
    await cdp.connect();
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1000,
      height: 1400,
      deviceScaleFactor: 1,
      mobile: false
    });

    // Wait for __e2e helper ready
    for (let i = 0; i < 40; i++) {
      if (await cdp.eval('Boolean(window.__e2e)')) break;
      await new Promise((r) => setTimeout(r, 150));
    }

    console.log(`Initializing ${PRESET_ID} ONNX models in Chrome Worker...`);
    const initRes = await cdp.eval(`window.__e2e.initModels(${JSON.stringify(PRESET_ID)})`);
    console.log('Worker initialized:', JSON.stringify(initRes));

    let imageFiles = fs.readdirSync(path.join(HARNESS, 'images')).filter((f) => /\.(webp|png|jpg)$/i.test(f)).sort();
    if (FILES_ARG) {
      const wanted = new Set(FILES_ARG.split(',').map((s) => s.trim()).filter(Boolean));
      imageFiles = imageFiles.filter((f) => wanted.has(f));
    }
    if (LIMIT_ARG > 0) {
      imageFiles = imageFiles.slice(0, LIMIT_ARG);
    }
    const results = [];

    for (const file of imageFiles) {
      const t0 = Date.now();
      const res = await cdp.eval(`window.__e2e.processOne(${JSON.stringify(file)}, false, ${NO_TRANSLATE})`);
      // Resize viewport to exact image dimensions & capture final rendered PNG
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: Math.max(200, Math.min(2000, res.width)),
        height: Math.max(200, Math.min(8000, res.height)),
        deviceScaleFactor: 1,
        mobile: false
      });
      const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
      const outName = file.replace(/\.(webp|jpg|jpeg)$/i, '.png');
      fs.writeFileSync(path.join(RENDERED_DIR, outName), Buffer.from(shot.data, 'base64'));
      res.renderedPng = path.join(RENDERED_DIR, outName);
      res.wallMs = Date.now() - t0;
      results.push(res);

      const overflowCount = res.bubbles.filter((b) => b.dom && (b.dom.overflowW > 2 || b.dom.overflowH > 2)).length;
      const smallFontCount = res.bubbles.filter((b) => b.dom && b.dom.fontSize <= 8.5).length;
      console.log(
        `[${file}] ${res.width}x${res.height} | raw=${res.rawLineCount} -> bubbles=${res.bubbleCount} | fallbackRect=${res.fallbackRectCount} | ovf=${overflowCount} | tinyFont=${smallFontCount} | det=${res.timings?.detMs}ms rec=${res.timings?.recMs}ms`
      );
    }

    const outJsonPath = path.join(HARNESS, OUT_JSON_NAME);
    fs.writeFileSync(outJsonPath, JSON.stringify(results, null, 2));
    console.log(`ALL ${imageFiles.length} IMAGES PROCESSED (${PRESET_ID}). Results written to:`, outJsonPath);
  } finally {
    cdp.close();
    chrome.kill('SIGKILL');
    server.close();
  }
}

main().catch((err) => {
  console.error('E2E FATAL:', err);
  process.exit(1);
});
