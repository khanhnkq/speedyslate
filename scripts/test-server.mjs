#!/usr/bin/env node
/**
 * Test harness server: static files + POST /save-result -> test-harness/results/<ts>.json
 * Usage: node scripts/test-server.mjs [port]
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RESULTS_DIR = path.join(ROOT, 'test-harness', 'results');
const PORT = Number(process.argv[2]) || 8642;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.wasm': 'application/wasm',
  '.onnx': 'application/octet-stream',
  '.txt': 'text/plain; charset=utf-8',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.css': 'text/css; charset=utf-8'
};

fs.mkdirSync(RESULTS_DIR, { recursive: true });

function listResults(res) {
  const files = fs.readdirSync(RESULTS_DIR).filter((f) => f.endsWith('.json')).sort();
  res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify(files));
}

function lastResult(res) {
  const files = fs.readdirSync(RESULTS_DIR).filter((f) => f.endsWith('.json')).sort();
  if (!files.length) return res.writeHead(404).end('none');
  res.writeHead(200, { 'Content-Type': 'application/json' }).end(fs.readFileSync(path.join(RESULTS_DIR, files[files.length - 1])));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  let pathname = decodeURIComponent(url.pathname);

  // Devin browser-preview proxy nối path request vào target path:
  // /x -> /test-harness/index.html/x. Strip prefix để phục vụ đúng file.
  const PROXY_PFX = '/test-harness/index.html/';
  if (pathname.startsWith(PROXY_PFX)) {
    pathname = '/' + pathname.slice(PROXY_PFX.length);
  }

  if (req.method === 'POST' && pathname === '/save-result') {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        const name = `${Date.now()}-${(parsed.model || 'run').replace(/[^\w-]/g, '_')}.json`;
        fs.writeFileSync(path.join(RESULTS_DIR, name), JSON.stringify(parsed, null, 2));
        res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ saved: name }));
      } catch (e) {
        res.writeHead(400).end(String(e));
      }
    });
    return;
  }

  // POST /save-image?name=<img>&run=<tag> — lưu PNG annotated
  if (req.method === 'POST' && pathname === '/save-image') {
    const imgName = (url.searchParams.get('name') || 'img').replace(/[^\w.-]/g, '_');
    const runTag = (url.searchParams.get('run') || 'run').replace(/[^\w-]/g, '_');
    const dir = path.join(RESULTS_DIR, 'annotated');
    fs.mkdirSync(dir, { recursive: true });
    const out = fs.createWriteStream(path.join(dir, `${runTag}-${imgName}.png`));
    req.pipe(out);
    req.on('end', () => res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ saved: imgName })));
    return;
  }

  if (pathname === '/list-results') return listResults(res);
  if (pathname === '/last-result') return lastResult(res);

  // Static
  const rel = pathname === '/' ? '/test-harness/index.html' : pathname;
  const file = path.normalize(path.join(ROOT, rel));
  if (!file.startsWith(ROOT)) return res.writeHead(403).end('forbidden');
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) return res.writeHead(404).end('not found: ' + rel);
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Content-Length': st.size,
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    });
    fs.createReadStream(file).pipe(res);
  });
});

server.listen(PORT, '127.0.0.1', () => console.log(`[test-server] http://127.0.0.1:${PORT}/ (root=${ROOT})`));
