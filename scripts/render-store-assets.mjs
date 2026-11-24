import { spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';
import { PAGES } from './store-asset-templates.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

// Pure RFC-2083 24-bit Truecolor RGB PNG encoder (colorType = 2, strictly NO alpha channel for Chrome Web Store!)
const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[n] = c >>> 0;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function encodeRgb24Png(width, height, rgbaBytes) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8-bit depth
  ihdr[9] = 2; // colorType 2 = 24-bit Truecolor RGB (NO alpha!)
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const stride = width * 3 + 1;
  const raw = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y++) {
    const rowOff = y * stride;
    raw[rowOff] = 1; // Sub filter for crisp compression
    for (let x = 0; x < width; x++) {
      const si = (y * width + x) * 4;
      const prevSi = x > 0 ? si - 4 : -1;
      const di = rowOff + 1 + x * 3;
      raw[di] = (rgbaBytes[si] - (prevSi >= 0 ? rgbaBytes[prevSi] : 0)) & 0xff;
      raw[di + 1] = (rgbaBytes[si + 1] - (prevSi >= 0 ? rgbaBytes[prevSi + 1] : 0)) & 0xff;
      raw[di + 2] = (rgbaBytes[si + 2] - (prevSi >= 0 ? rgbaBytes[prevSi + 2] : 0)) & 0xff;
    }
  }

  const idat = zlib.deflateSync(raw, { level: 9 });
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([sig, pngChunk('IHDR', ihdr), pngChunk('IDAT', idat), pngChunk('IEND', Buffer.alloc(0))]);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const server = http.createServer((req, res) => {
    const idx = Number(new URL(req.url, 'http://127.0.0.1').searchParams.get('i') || '0');
    const page = PAGES[idx] || PAGES[0];
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(page.html);
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const srvPort = server.address().port;

  const cdpPort = 9287;
  const userDir = `/tmp/chrome-cws-rgb-${Date.now()}`;
  const proc = spawn(
    CHROME,
    [
      '--headless=new',
      '--no-first-run',
      '--no-default-browser-check',
      '--hide-scrollbars',
      `--user-data-dir=${userDir}`,
      `--remote-debugging-port=${cdpPort}`,
      'about:blank'
    ],
    { stdio: 'ignore' }
  );

  try {
    let target;
    for (let i = 0; i < 30; i++) {
      await sleep(300);
      try {
        const list = await fetch(`http://127.0.0.1:${cdpPort}/json`).then((r) => r.json());
        target = list.find((t) => t.type === 'page');
        if (target) break;
      } catch {}
    }

    const ws = new WebSocket(target.webSocketDebuggerUrl);
    let id = 0;
    const pending = new Map();
    await new Promise((r) => (ws.onopen = r));
    ws.onmessage = (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id && pending.has(m.id)) {
        pending.get(m.id)(m.result);
        pending.delete(m.id);
      }
    };
    const send = (method, params = {}) =>
      new Promise((r) => {
        pending.set(++id, r);
        ws.send(JSON.stringify({ id, method, params }));
      });
    await send('Page.enable');
    await send('Runtime.enable');

    for (let i = 0; i < PAGES.length; i++) {
      const p = PAGES[i];
      await send('Emulation.setDeviceMetricsOverride', {
        width: p.w,
        height: p.h,
        deviceScaleFactor: 2,
        mobile: false
      });
      await send('Page.navigate', { url: `http://127.0.0.1:${srvPort}/?i=${i}` });
      await sleep(1400);
      await send('Runtime.evaluate', {
        expression: 'document.fonts ? document.fonts.ready : Promise.resolve()',
        awaitPromise: true
      });
      await sleep(250);

      const shot = await send('Page.captureScreenshot', { format: 'png' });

      // Downsample 2x -> exact 1x (p.w x p.h) in Chrome Skia & extract raw RGBA bytes
      const b64Rgba = (
        await send('Runtime.evaluate', {
          awaitPromise: true,
          returnByValue: true,
          expression: `(async () => {
            const img = new Image();
            await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = "data:image/png;base64,${shot.data}"; });
            const c = document.createElement("canvas");
            c.width = ${p.w}; c.height = ${p.h};
            const ctx = c.getContext("2d", { alpha: false });
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(img, 0, 0, ${p.w}, ${p.h});
            const u8 = ctx.getImageData(0, 0, ${p.w}, ${p.h}).data;
            let bin = "";
            const chunk = 32768;
            for (let off = 0; off < u8.length; off += chunk) {
              bin += String.fromCharCode.apply(null, u8.subarray(off, off + chunk));
            }
            return btoa(bin);
          })()`
        })
      ).result.value;

      const rgba = Buffer.from(b64Rgba, 'base64');
      const png24 = encodeRgb24Png(p.w, p.h, rgba);
      const outPath = path.join(ROOT, p.out);
      fs.writeFileSync(outPath, png24);
      console.log(`✓ Saved 24-bit RGB PNG: ${p.out} (${p.w}x${p.h}, colorType=${png24[25]}, ${(png24.length / 1024).toFixed(1)} KB)`);
    }
    ws.close();
  } finally {
    proc.kill('SIGKILL');
    server.close();
    await sleep(300);
    try {
      fs.rmSync(userDir, { recursive: true, force: true });
    } catch {}
  }
}

main();
