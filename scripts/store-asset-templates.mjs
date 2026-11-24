import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ICON_SVG = fs.readFileSync(path.join(ROOT, 'public/icons/icon.svg'), 'utf8');
export const ICON_B64 = `data:image/svg+xml;base64,${Buffer.from(ICON_SVG).toString('base64')}`;

const SVG_BOLT = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11"/></svg>`;
const SVG_CROP = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 5v10a1 1 0 0 0 1 1h10"/><path d="M5 8h10a1 1 0 0 1 1 1v10"/></svg>`;
const SVG_GLOBE = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#E52E3D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:5px;"><circle cx="12" cy="12" r="9"/><path d="M3.6 9h16.8"/><path d="M3.6 15h16.8"/><path d="M11.5 3a17 17 0 0 0 0 18"/><path d="M12.5 3a17 17 0 0 1 0 18"/></svg>`;

export const SHARED_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700;800&family=Patrick+Hand&family=Noto+Sans+JP:wght@700;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #090A0E; color: #F4F5F8; font-family: 'Inter', -apple-system, sans-serif; overflow: hidden; -webkit-font-smoothing: antialiased; }
  .canvas {
    position: relative; width: 100vw; height: 100vh; overflow: hidden;
    background: linear-gradient(155deg, #0E1017 0%, #08090D 100%);
  }
  .arch-grid {
    position: absolute; inset: 0; pointer-events: none; opacity: 0.24;
    background-image:
      linear-gradient(to right, #1B1E2A 1px, transparent 1px),
      linear-gradient(to bottom, #1B1E2A 1px, transparent 1px);
    background-size: 80px 80px;
  }
  .eyebrow { display: inline-flex; align-items: center; gap: 7px; background: rgba(229,46,61,0.12); border: 1px solid rgba(229,46,61,0.36); color: #FF6B77; padding: 6px 13px; border-radius: 6px; font-family: 'Space Grotesk', sans-serif; font-size: 11.5px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
  .h1 { font-family: 'Space Grotesk', sans-serif; font-size: 42px; line-height: 1.08; font-weight: 700; letter-spacing: -0.02em; color: #FFFFFF; }
  .h1 span.accent { color: #E52E3D; }
  .sub { font-size: 16px; line-height: 1.55; color: #9DA4BA; max-width: 470px; }
  .pill-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 20px; }
  .pill { background: #12141D; border: 1px solid #242838; border-left: 2px solid #E52E3D; border-radius: 4px; padding: 8px 13px; font-size: 12.5px; font-weight: 600; color: #E2E6F3; }
  .popup-mock { background: #FFFFFF; color: #111318; border-radius: 12px; border: 1px solid #2A2E3D; box-shadow: 0 24px 64px rgba(0,0,0,0.68); overflow: hidden; }
  .popup-hdr { background: #0D0D11; color: #FFF; padding: 14px 16px 10px; border-bottom: 1px solid #232530; }
  .brand-line { display: flex; justify-content: space-between; align-items: center; margin-bottom: 11px; }
  .brand-left { display: flex; align-items: center; gap: 9px; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px; letter-spacing: 0.04em; }
  .brand-left img { width: 24px; height: 24px; border-radius: 6px; }
  .ver-chip { background: #1A1114; border: 1px solid #591821; color: #FF7580; font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 4px; }
  .tabs-bar { display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; }
  .t-item { text-align: center; font-size: 10px; font-weight: 700; padding: 6px 0; border-radius: 5px; color: #8D93A8; font-family: 'Space Grotesk', sans-serif; }
  .t-item.active { background: #E52E3D; color: #FFFFFF; }
  .popup-body { padding: 15px 16px; background: #F8F9FC; }
  .sec-lbl { font-size: 10.5px; font-weight: 800; color: #61677C; letter-spacing: 0.06em; margin-bottom: 9px; display: flex; justify-content: space-between; align-items: center; }
  .m-card { background: #FFFFFF; border: 1.5px solid #E2E5EF; border-radius: 8px; padding: 11px 13px; margin-bottom: 9px; }
  .m-card.sel { border-color: #E52E3D; background: #FFF8F9; }
  .m-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
  .m-name { font-weight: 700; font-size: 13px; color: #11131A; }
  .m-tag { font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 4px; background: #FFE6E9; color: #D41C2C; }
  .m-tag.green { background: #DCFCE7; color: #15803D; }
  .m-desc { font-size: 11.5px; color: #596074; line-height: 1.4; }
`;

export function mangaArtworkSvg({ translated = false } = {}) {
  return `<svg viewBox="0 0 500 620" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="skyWash" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#DDE2EE"/><stop offset="100%" stop-color="#FFFFFF"/></linearGradient>
      <linearGradient id="nightWash" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#191C28"/><stop offset="100%" stop-color="#232838"/></linearGradient>
    </defs>
    <rect width="500" height="620" fill="#F4F4F6"/>
    <g>
      <rect x="16" y="16" width="468" height="292" fill="#FFFFFF" stroke="#111217" stroke-width="4.5"/>
      <rect x="19" y="19" width="462" height="175" fill="url(#skyWash)"/>
      <g stroke="#181A22" stroke-width="1.8" opacity="0.18">
        <line x1="20" y1="30" x2="210" y2="145"/><line x1="20" y1="65" x2="195" y2="155"/>
        <line x1="480" y1="25" x2="290" y2="140"/><line x1="480" y1="75" x2="305" y2="160"/>
      </g>
      <path d="M 155,306 L 178,218 L 222,198 L 278,198 L 326,218 L 348,306 Z" fill="#171923" stroke="#111217" stroke-width="3.5"/>
      <path d="M 212,200 L 250,248 L 288,200" fill="#F2F3F7" stroke="#111217" stroke-width="3"/>
      <path d="M 218,125 C 218,86 282,86 282,125 L 278,172 L 250,194 L 222,172 Z" fill="#FFFFFF" stroke="#111217" stroke-width="3.5"/>
      <path d="M 202,135 L 192,98 L 216,104 L 228,72 L 250,94 L 274,70 L 286,102 L 310,96 L 298,136 C 285,112 215,112 202,135 Z" fill="#14161F" stroke="#111217" stroke-width="3"/>
      <path d="M 227,138 L 243,141" stroke="#111217" stroke-width="3.2" stroke-linecap="round"/>
      <path d="M 273,138 L 257,141" stroke="#111217" stroke-width="3.2" stroke-linecap="round"/>
      <rect x="233" y="143" width="6" height="6" rx="2" fill="#111217"/><rect x="261" y="143" width="6" height="6" rx="2" fill="#111217"/>
      <path d="M 244,167 L 258,165" stroke="#111217" stroke-width="2.6" stroke-linecap="round"/>
      <ellipse cx="104" cy="112" rx="72" ry="68" fill="#FFFFFF" stroke="#111217" stroke-width="3.8"/>
      <polygon points="142,164 176,184 156,148" fill="#FFFFFF" stroke="#111217" stroke-width="3.5" stroke-linejoin="round"/>
      <ellipse cx="104" cy="112" rx="70" ry="66" fill="#FFFFFF"/>
      ${translated
        ? `<g font-family="'Patrick Hand', sans-serif" font-size="18.5" font-weight="700" fill="#111217" text-anchor="middle"><text x="104" y="92">Khoan đã!</text><text x="104" y="115">Phía trước có</text><text x="104" y="138">bẫy phục kích!</text></g>`
        : `<g font-family="'Noto Sans JP', sans-serif" font-size="19" font-weight="900" fill="#14161E" text-anchor="middle"><text x="124" y="84">待</text><text x="124" y="106">て</text><text x="124" y="128">！</text><text x="94" y="84">罠</text><text x="94" y="106">が</text><text x="94" y="128">あ</text><text x="94" y="150">る</text></g>`}
      <ellipse cx="394" cy="116" rx="74" ry="66" fill="#FFFFFF" stroke="#111217" stroke-width="3.8"/>
      <polygon points="344,160 314,182 332,144" fill="#FFFFFF" stroke="#111217" stroke-width="3.5" stroke-linejoin="round"/>
      <ellipse cx="394" cy="116" rx="72" ry="64" fill="#FFFFFF"/>
      ${translated
        ? `<g font-family="'Patrick Hand', sans-serif" font-size="18.5" font-weight="700" fill="#111217" text-anchor="middle"><text x="394" y="105">Mở khiên chắn</text><text x="394" y="128">ngay lập tức!</text></g>`
        : `<g font-family="'Noto Sans JP', sans-serif" font-size="18" font-weight="900" fill="#14161E" text-anchor="middle"><text x="412" y="88">今</text><text x="412" y="110">す</text><text x="412" y="132">ぐ</text><text x="380" y="88">盾</text><text x="380" y="110">を</text><text x="380" y="132">張</text><text x="380" y="154">れ</text></g>`}
    </g>
    <g>
      <rect x="16" y="322" width="468" height="282" fill="url(#nightWash)" stroke="#111217" stroke-width="4.5"/>
      <rect x="34" y="420" width="68" height="180" fill="#10121A" stroke="#2D3246" stroke-width="2"/>
      <rect x="114" y="388" width="84" height="212" fill="#131620" stroke="#2D3246" stroke-width="2"/>
      <rect x="320" y="405" width="92" height="195" fill="#10121A" stroke="#2D3246" stroke-width="2"/>
      <rect x="42" y="346" width="218" height="78" rx="4" fill="#FFFFFF" stroke="#111217" stroke-width="3.5"/>
      ${translated
        ? `<g font-family="'Patrick Hand', sans-serif" font-size="17.5" font-weight="700" fill="#111217" text-anchor="middle"><text x="151" y="379">Đêm thứ 7 tại Khu 09 —</text><text x="151" y="404">tín hiệu đã được giải mã.</text></g>`
        : `<g font-family="'Noto Sans JP', sans-serif" font-size="15.5" font-weight="900" fill="#14161E" text-anchor="middle"><text x="151" y="379">第０９区 — 七日目の夜</text><text x="151" y="404">暗号信号の解読が完了。</text></g>`}
      <ellipse cx="372" cy="496" rx="88" ry="72" fill="#FFFFFF" stroke="#111217" stroke-width="3.8"/>
      ${translated
        ? `<g font-family="'Patrick Hand', sans-serif" font-size="19.5" font-weight="700" fill="#111217" text-anchor="middle"><text x="372" y="486">Tốt lắm, chuẩn bị</text><text x="372" y="512">đột kích thôi!</text></g>`
        : `<g font-family="'Noto Sans JP', sans-serif" font-size="18" font-weight="900" fill="#14161E" text-anchor="middle"><text x="372" y="488">よし、準備完了</text><text x="372" y="514">突入するぞ！</text></g>`}
    </g>
  </svg>`;
}

export const PAGES = [
  {
    out: 'store-assets/screenshots/01-hero-before-after.png', w: 1280, h: 800,
    html: `<!doctype html><html><head><meta charset="utf-8"><style>${SHARED_CSS}
      .wrap { display: grid; grid-template-columns: 460px 1fr; height: 100%; padding: 56px 60px; gap: 44px; align-items: center; position: relative; z-index: 2; }
      .compare { position: relative; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; height: 660px; }
      .pane-card { position: relative; background: #12141D; border: 1px solid #262A3B; border-radius: 12px; padding: 12px; display: flex; flex-direction: column; box-shadow: 0 24px 60px rgba(0,0,0,0.6); }
      .pane-card.after { border-color: #E52E3D; }
      .pane-badge { position: absolute; top: 22px; left: 22px; z-index: 5; background: rgba(13,13,17,0.92); border: 1px solid #34384C; color: #CDD2E4; padding: 5px 12px; border-radius: 5px; font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 700; }
      .pane-card.after .pane-badge { background: #E52E3D; border-color: #FF6B75; color: #FFF; }
      .art-frame { flex: 1; border-radius: 8px; overflow: hidden; }
      .hud-float { position: absolute; bottom: 26px; right: 24px; z-index: 10; }
      .hud-pill { background: #0D0D11; border: 1px solid #E52E3D; color: #FFF; height: 36px; padding: 0 14px; border-radius: 6px; font-family: 'Space Grotesk', sans-serif; font-size: 11.5px; font-weight: 700; display: inline-flex; align-items: center; gap: 8px; }
      .brand-lockup { display: flex; align-items: center; gap: 14px; margin-bottom: 22px; }
      .brand-lockup img { width: 54px; height: 54px; border-radius: 12px; }
      .brand-lockup .b-name { font-family: 'Space Grotesk', sans-serif; font-size: 22px; font-weight: 700; letter-spacing: 0.04em; }
    </style></head><body><div class="canvas"><div class="arch-grid"></div>
      <div class="wrap">
        <div>
          <div class="brand-lockup"><img src="${ICON_B64}" /><div><div class="b-name">SPEEDYSLATE</div><div style="font-size:12px;color:#FF6470;font-weight:600;">WebGPU Local OCR &amp; AI Manga Translator</div></div></div>
          <div class="eyebrow" style="margin-bottom:16px;">${SVG_BOLT} UNDER 1.0S PER PAGE ON WEBGPU</div>
          <h1 class="h1">Seamless Manga &amp; Webtoon <span class="accent">Auto-Translation</span></h1>
          <p class="sub" style="margin-top:16px;">Erases raw Japanese, Korean, Chinese &amp; English lettering cleanly and typesets natural translations right inside every speech bubble.</p>
          <div class="pill-row">
            <div class="pill">Free Local PaddleOCR v6</div>
            <div class="pill">Spotless Telea FMM Inpainting</div>
            <div class="pill">Auto-Scroll HUD (1x–8x)</div>
            <div class="pill">Gemini / Groq / DeepSeek / Ollama</div>
          </div>
        </div>
        <div class="compare">
          <div class="pane-card"><div class="pane-badge">RAW ORIGINAL</div><div class="art-frame">${mangaArtworkSvg({ translated: false })}</div></div>
          <div class="pane-card after"><div class="pane-badge">SPEEDYSLATE TRANSLATED</div><div class="art-frame">${mangaArtworkSvg({ translated: true })}</div><div class="hud-float"><div class="hud-pill">${SVG_BOLT} Auto-Scroll 2x | 12/12 Done</div></div></div>
        </div>
      </div>
    </div></body></html>`
  },
  {
    out: 'store-assets/screenshots/02-hybrid-webgpu-engine.png', w: 1280, h: 800,
    html: `<!doctype html><html><head><meta charset="utf-8"><style>${SHARED_CSS}
      .wrap { display: grid; grid-template-columns: 1fr 380px 380px; height: 100%; padding: 52px 54px; gap: 26px; align-items: center; position: relative; z-index: 2; }
      .stat-box { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px; }
      .st { background: #101219; color: #FFF; padding: 10px; border-radius: 6px; }
      .st .k { font-size: 9.5px; color: #8B92A8; font-weight: 700; }
      .st .v { font-family: 'Space Grotesk', sans-serif; font-size: 13px; font-weight: 700; color: #4ADE80; margin-top: 3px; }
    </style></head><body><div class="canvas"><div class="arch-grid"></div>
      <div class="wrap">
        <div>
          <div class="eyebrow" style="margin-bottom:16px;">DUAL ENGINE ARCHITECTURE</div>
          <h1 class="h1" style="font-size:38px;">Local <span class="accent">WebGPU OCR</span> or Direct <span class="accent">Vision AI</span></h1>
          <p class="sub" style="margin-top:16px;">Run PaddleOCR v6 &amp; RT-DETR locally inside an isolated Web Worker with zero OCR cost—or switch to 1-step Multimodal Vision AI anytime.</p>
          <div class="pill-row">
            <div class="pill">95% API Token Savings</div>
            <div class="pill">RTL Manga &amp; LTR Webtoon Order</div>
            <div class="pill">4-Point Tilted Text Deskew</div>
          </div>
        </div>
        <div class="popup-mock">
          <div class="popup-hdr"><div class="brand-line"><div class="brand-left"><img src="${ICON_B64}"/>SPEEDYSLATE</div><span class="ver-chip">v2.0</span></div><div class="tabs-bar"><div class="t-item active">MODES</div><div class="t-item">ENGINE</div><div class="t-item">API</div><div class="t-item">SITES</div><div class="t-item">SYSTEM</div></div></div>
          <div class="popup-body">
            <div class="sec-lbl"><span>MODES</span></div>
            <div class="m-card sel"><div class="m-top"><span class="m-name">Hybrid Local OCR</span><span class="m-tag green">95% Token Saver</span></div><div class="m-desc">Local ONNX WebGPU text extraction. Fast, private, compatible with every LLM.</div></div>
            <div class="m-card"><div class="m-top"><span class="m-name">Multimodal Vision AI</span><span class="m-tag">Direct AI</span></div><div class="m-desc">Sends comic panels directly to Gemini Vision for scene-aware translation.</div></div>
            <div class="sec-lbl" style="margin-top:14px;"><span>LANGUAGES</span></div>
            <div class="m-card" style="margin-bottom:6px;padding:9px 12px;"><div style="font-size:10px;color:#6E758A;font-weight:700;">SOURCE (RAW)</div><div style="font-size:13px;font-weight:700;margin-top:2px;">Auto-Detect (Japanese / Korean / Chinese / EN)</div></div>
            <div class="m-card" style="margin-bottom:0;padding:9px 12px;"><div style="font-size:10px;color:#6E758A;font-weight:700;">TARGET LANGUAGE</div><div style="font-size:13px;font-weight:700;margin-top:2px;color:#E52E3D;">Vietnamese / English / Spanish / Any Language</div></div>
          </div>
        </div>
        <div class="popup-mock">
          <div class="popup-hdr"><div class="brand-line"><div class="brand-left"><img src="${ICON_B64}"/>SPEEDYSLATE</div><span class="ver-chip">WEBGPU</span></div><div class="tabs-bar"><div class="t-item">MODES</div><div class="t-item active">ENGINE</div><div class="t-item">API</div><div class="t-item">SITES</div><div class="t-item">SYSTEM</div></div></div>
          <div class="popup-body">
            <div class="sec-lbl"><span>OCR PRESETS</span><span style="color:#E52E3D;">25.0 MB cached</span></div>
            <div class="m-card sel"><div class="m-top"><span class="m-name">PaddleOCR v6 Hybrid WebGPU</span><span class="m-tag green">Active</span></div><div class="m-desc">Multilingual CJK + Latin / ~0.9s per page on GPU / 91.5% precision.</div></div>
            <div class="m-card"><div class="m-top"><span class="m-name">PaddleOCR v5 English Fast</span><span class="m-tag">12.2 MB</span></div><div class="m-desc">Ultra-lightweight model tuned for English comics (~0.8s/page).</div></div>
            <div class="m-card"><div class="m-top"><span class="m-name">Comic &amp; Manga RT-DETR AI</span><span class="m-tag">20.4 MB</span></div><div class="m-desc">Specialized spiky speech-bubble &amp; SFX detector.</div></div>
            <div class="stat-box"><div class="st"><div class="k">MODEL STATUS</div><div class="v">Ready Offline</div></div><div class="st"><div class="k">ACTIVE BACKEND</div><div class="v">WebGPU FP32</div></div></div>
          </div>
        </div>
      </div>
    </div></body></html>`
  },
  {
    out: 'store-assets/screenshots/03-clean-inpaint-typeset.png', w: 1280, h: 800,
    html: `<!doctype html><html><head><meta charset="utf-8"><style>${SHARED_CSS}
      .wrap { padding: 48px 58px; height: 100%; display: flex; flex-direction: column; justify-content: space-between; position: relative; z-index: 2; }
      .top-bar { display: flex; justify-content: space-between; align-items: flex-end; }
      .steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; height: 500px; }
      .s-card { background: #12141D; border: 1px solid #262A3B; border-radius: 12px; padding: 18px; display: flex; flex-direction: column; justify-content: space-between; }
      .s-card.hi { border-color: #E52E3D; }
      .s-num { font-family: 'Space Grotesk', sans-serif; font-size: 11.5px; font-weight: 700; color: #FF5964; margin-bottom: 6px; letter-spacing: 0.05em; }
      .s-title { font-family: 'Space Grotesk', sans-serif; font-size: 20px; font-weight: 700; margin-bottom: 6px; }
      .s-sub { font-size: 13px; color: #9BA2B8; line-height: 1.45; }
      .zoom-stage { height: 330px; background: #191C28; border-radius: 8px; border: 1px solid #282D40; display: flex; align-items: center; justify-content: center; overflow: hidden; }
    </style></head><body><div class="canvas"><div class="arch-grid"></div>
      <div class="wrap">
        <div class="top-bar">
          <div><div class="eyebrow" style="margin-bottom:12px;">ZERO-BLEED SCANLATION QUALITY</div><h1 class="h1" style="font-size:38px;">Porcelain-Clean <span class="accent">Text Erasure</span> &amp; Smart Bubble Fit</h1></div>
          <p class="sub" style="max-width:410px;text-align:right;">Preserves curved borders, spiky shout outlines, and shaded backgrounds while fitting dialogue naturally inside every balloon.</p>
        </div>
        <div class="steps">
          <div class="s-card">
            <div class="zoom-stage"><svg viewBox="0 0 320 260" width="100%" height="100%"><rect width="320" height="260" fill="#E9ECF2"/><ellipse cx="160" cy="130" rx="112" ry="92" fill="#FFFFFF" stroke="#14161F" stroke-width="4.5"/><rect x="86" y="72" width="148" height="116" fill="rgba(34,197,94,0.10)" stroke="#22C55E" stroke-width="2.5" stroke-dasharray="6 4" rx="6"/><g font-family="'Noto Sans JP', sans-serif" font-size="26" font-weight="900" fill="#14161F" text-anchor="middle"><text x="192" y="106">絶</text><text x="192" y="138">対</text><text x="192" y="170">に</text><text x="148" y="106">負</text><text x="148" y="138">け</text><text x="148" y="170">な</text><text x="108" y="122">い</text><text x="108" y="154">！</text></g></svg></div>
            <div><div class="s-num">STEP 01 / DETECT &amp; CHAMBER FIT</div><div class="s-title">1920px Native Detection</div><div class="s-sub">Detects vertical CJK &amp; tilted shouts, filters furigana noise, and maps the true interior bubble chamber.</div></div>
          </div>
          <div class="s-card hi">
            <div class="zoom-stage"><svg viewBox="0 0 320 260" width="100%" height="100%"><rect width="320" height="260" fill="#E9ECF2"/><ellipse cx="160" cy="130" rx="112" ry="92" fill="#FFFFFF" stroke="#14161F" stroke-width="4.5"/><rect x="222" y="46" width="34" height="34" rx="8" fill="#DCFCE7" stroke="#16A34A" stroke-width="2"/><path d="M 232,63 L 237,68 L 247,58" fill="none" stroke="#16A34A" stroke-width="3" stroke-linecap="round"/></svg></div>
            <div><div class="s-num">STEP 02 / TELEA FMM + DISK CLOSING</div><div class="s-title">0px Border-Bleed Inpainting</div><div class="s-sub">Removes strokes welded to inner walls and reconstructs gradients seamlessly without rectangular patches.</div></div>
          </div>
          <div class="s-card">
            <div class="zoom-stage"><svg viewBox="0 0 320 260" width="100%" height="100%"><rect width="320" height="260" fill="#E9ECF2"/><ellipse cx="160" cy="130" rx="112" ry="92" fill="#FFFFFF" stroke="#14161F" stroke-width="4.5"/><ellipse cx="160" cy="130" rx="96" ry="76" fill="none" stroke="#E52E3D" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.55"/><g font-family="'Patrick Hand', sans-serif" font-size="25" font-weight="700" fill="#111217" text-anchor="middle"><text x="160" y="108">Mình nhất định</text><text x="160" y="138">sẽ không chịu</text><text x="160" y="168">thua đâu!</text></g></svg></div>
            <div><div class="s-num">STEP 03 / CHORD-AWARE TYPESETTING</div><div class="s-title">Crisp Vector Comic Overlay</div><div class="s-sub">Bundled comic font fitted to actual rendered bubble dimensions. Hold <b>Alt + Hover</b> anytime to peek original text.</div></div>
          </div>
        </div>
      </div>
    </div></body></html>`
  },
  {
    out: 'store-assets/screenshots/04-multi-ai-keyed-json.png', w: 1280, h: 800,
    html: `<!doctype html><html><head><meta charset="utf-8"><style>${SHARED_CSS}
      .wrap { display: grid; grid-template-columns: 1fr 430px; height: 100%; padding: 54px 62px; gap: 52px; align-items: center; position: relative; z-index: 2; }
      .prov-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; margin-top: 26px; }
      .p-box { background: #12151F; border: 1px solid #252A3C; border-top: 2px solid #E52E3D; border-radius: 8px; padding: 15px 16px; }
      .p-box b { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 15px; color: #FFF; margin-bottom: 5px; }
      .p-box span { font-size: 12.5px; color: #949BB2; line-height: 1.45; display: block; }
      .inp-fake { background: #FFF; border: 1px solid #D5DAE6; border-radius: 6px; padding: 8px 10px; font-size: 12px; color: #1A1D26; margin-top: 4px; font-family: monospace; }
    </style></head><body><div class="canvas"><div class="arch-grid"></div>
      <div class="wrap">
        <div>
          <div class="eyebrow" style="margin-bottom:16px;">UNSTOPPABLE TRANSLATION PIPELINE</div>
          <h1 class="h1" style="font-size:40px;">Multi-Key Rotation, <span class="accent">Keyed JSON</span> &amp; Zero-Key Rescue</h1>
          <p class="sub" style="margin-top:16px;max-width:580px;">Never lose bubble alignment or get stuck on HTTP 429 rate limits. SpeedySlate rotates across your API keys and providers automatically—with instant 0-config Google fallback.</p>
          <div class="prov-grid">
            <div class="p-box"><b>01 / Round-Robin Key Pool</b><span>Paste multiple Gemini, Groq, or DeepSeek keys—auto-switches on 429 quota limits.</span></div>
            <div class="p-box"><b>02 / Keyed JSON (b0..bN)</b><span>Strict schema locks every translation to its exact bubble ID—zero shifted lines.</span></div>
            <div class="p-box"><b>03 / Rolling Chapter Memory</b><span>Carries character names, pronouns &amp; custom Glossary consistently across pages.</span></div>
            <div class="p-box"><b>04 / Zero-Key Free Rescue</b><span>Works out-of-the-box via Google Translate fallback even before adding API keys.</span></div>
          </div>
        </div>
        <div class="popup-mock">
          <div class="popup-hdr"><div class="brand-line"><div class="brand-left"><img src="${ICON_B64}"/>SPEEDYSLATE</div><span class="ver-chip">API POOL</span></div><div class="tabs-bar"><div class="t-item">MODES</div><div class="t-item">ENGINE</div><div class="t-item active">API</div><div class="t-item">SITES</div><div class="t-item">SYSTEM</div></div></div>
          <div class="popup-body">
            <div class="sec-lbl"><span>AI PROVIDER</span><span style="color:#15803D;">3 Keys Active</span></div>
            <div class="m-card sel" style="padding:9px 12px;"><div style="font-size:10px;color:#6E758A;font-weight:700;">PROVIDER &amp; MODEL</div><div style="font-size:13px;font-weight:700;margin-top:2px;">Google Gemini / gemini-2.5-flash</div></div>
            <div style="margin-bottom:10px;"><div style="font-size:10.5px;font-weight:700;color:#555C70;">API KEYS (ROUND-ROBIN)</div><div class="inp-fake">AIzaSyB9****************8kQ1<br/>AIzaSyD4****************2mP9<br/>gsk_7xR2****************9vL4</div></div>
            <div class="m-card" style="display:flex;justify-content:space-between;align-items:center;padding:9px 12px;"><div><div class="m-name" style="font-size:12px;">Multi-Provider Failover + 0-Key Rescue</div><div class="m-desc" style="font-size:11px;">Auto-switch Groq / DeepSeek / Google on 429</div></div><div style="width:36px;height:20px;background:#E52E3D;border-radius:99px;position:relative;"><div style="width:16px;height:16px;background:#FFF;border-radius:50%;position:absolute;right:2px;top:2px;"></div></div></div>
            <div><div style="font-size:10.5px;font-weight:700;color:#555C70;">GLOSSARY (CUSTOM TERMS)</div><div class="inp-fake" style="font-family:'Inter',sans-serif;">Narumi = Thành Hải<br/>Konoha = Làng Lá</div></div>
          </div>
        </div>
      </div>
    </div></body></html>`
  },
  {
    out: 'store-assets/screenshots/05-privacy-crop-autoscroll.png', w: 1280, h: 800,
    html: `<!doctype html><html><head><meta charset="utf-8"><style>${SHARED_CSS}
      .wrap { display: grid; grid-template-columns: 400px 1fr; height: 100%; padding: 54px 60px; gap: 46px; align-items: center; position: relative; z-index: 2; }
      .crop-demo { height: 640px; background: #12151F; border: 1px solid #282D42; border-radius: 14px; position: relative; overflow: hidden; padding: 26px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 26px 70px rgba(0,0,0,0.65); }
      .crop-box { position: relative; flex: 1; margin: 18px 0; background: #191D2B; border-radius: 10px; border: 1px solid #2C3248; display: flex; align-items: center; justify-content: center; overflow: hidden; }
      .selection-rect { width: 390px; height: 220px; border: 2px dashed #E52E3D; background: rgba(229,46,61,0.08); border-radius: 6px; position: relative; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 999px rgba(7,8,12,0.48); }
      .kbd { background: #0D0E14; border: 1px solid #E52E3D; color: #FFF; padding: 5px 11px; border-radius: 5px; font-family: 'Space Grotesk', sans-serif; font-size: 12px; font-weight: 700; position: absolute; top: -36px; left: 0; display: inline-flex; align-items: center; gap: 6px; }
    </style></head><body><div class="canvas"><div class="arch-grid"></div>
      <div class="wrap">
        <div class="popup-mock">
          <div class="popup-hdr"><div class="brand-line"><div class="brand-left"><img src="${ICON_B64}"/>SPEEDYSLATE</div><span class="ver-chip">PRIVACY</span></div><div class="tabs-bar"><div class="t-item">MODES</div><div class="t-item">ENGINE</div><div class="t-item">API</div><div class="t-item active">SITES</div><div class="t-item">SYSTEM</div></div></div>
          <div class="popup-body">
            <div class="sec-lbl"><span>SITE CONTROL</span></div>
            <div class="m-card sel" style="display:flex;justify-content:space-between;align-items:center;"><div><div style="font-size:10px;color:#6E758A;font-weight:700;">CURRENT TAB</div><div style="font-size:13px;font-weight:700;">mangadex.org</div></div><div style="background:#E52E3D;color:#FFF;font-size:11px;font-weight:700;padding:6px 11px;border-radius:5px;">Enabled</div></div>
            <div class="m-card" style="display:flex;justify-content:space-between;align-items:center;"><div><div class="m-name" style="font-size:12.5px;">Enable on all websites</div><div class="m-desc" style="font-size:11px;">Or activate strictly per domain</div></div><div style="width:36px;height:20px;background:#CBD2E1;border-radius:99px;position:relative;"><div style="width:16px;height:16px;background:#FFF;border-radius:50%;position:absolute;left:2px;top:2px;"></div></div></div>
            <div class="sec-lbl" style="margin-top:12px;"><span>ENABLED SITES</span><span>2 sites</span></div>
            <div class="m-card" style="padding:9px 12px;margin-bottom:6px;font-size:12.5px;font-weight:600;">${SVG_GLOBE}mangadex.org</div>
            <div class="m-card" style="padding:9px 12px;margin-bottom:0;font-size:12.5px;font-weight:600;">${SVG_GLOBE}webtoons.com</div>
          </div>
        </div>
        <div class="crop-demo">
          <div><div class="eyebrow" style="margin-bottom:12px;">UNIVERSAL MEDIA &amp; CANVAS SUPPORT</div><h2 class="h1" style="font-size:32px;">1-Click Site Control &amp; <span class="accent">Alt+Shift+X</span> Screen Crop</h2></div>
          <div class="crop-box"><div class="selection-rect"><div class="kbd">${SVG_CROP} Alt + Shift + X / Screen Crop</div><div style="background:#FFFFFF;color:#111217;padding:16px 24px;border-radius:50%;border:3px solid #111217;font-family:'Patrick Hand',sans-serif;font-size:21px;font-weight:700;text-align:center;box-shadow:0 10px 28px rgba(0,0,0,0.4);">Translate protected Canvas &amp;<br/>WebGL comic viewers instantly!</div></div></div>
          <div class="pill-row" style="margin-top:0;"><div class="pill">Zero Default Tracking</div><div class="pill">IndexedDB Chapter Cache</div><div class="pill">SPA Navigation Shield</div></div>
        </div>
      </div>
    </div></body></html>`
  },
  {
    out: 'store-assets/promo/promo-small-440x280.png', w: 440, h: 280,
    html: `<!doctype html><html><head><meta charset="utf-8"><style>${SHARED_CSS}
      .p-wrap { width: 100vw; height: 100vh; padding: 26px 28px; display: flex; flex-direction: column; justify-content: space-between; background: linear-gradient(135deg, #131520 0%, #090A0E 100%); border: 1px solid #262A3C; }
      .top { display: flex; align-items: center; gap: 14px; }
      .top img { width: 64px; height: 64px; border-radius: 14px; }
      .title { font-family: 'Space Grotesk', sans-serif; font-size: 25px; font-weight: 700; letter-spacing: 0.02em; color: #FFF; }
      .badge { display: inline-flex; align-items: center; gap: 5px; margin-top: 4px; background: rgba(229,46,61,0.16); border: 1px solid rgba(229,46,61,0.42); color: #FF7A85; font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 4px; font-family: 'Space Grotesk', sans-serif; }
      .headline { font-family: 'Space Grotesk', sans-serif; font-size: 21px; line-height: 1.22; font-weight: 700; color: #F4F6FB; }
      .headline span { color: #E52E3D; }
      .chips { display: flex; gap: 7px; }
      .c { background: #141722; border: 1px solid #2A2F44; border-left: 2px solid #E52E3D; border-radius: 4px; padding: 5px 9px; font-size: 10.5px; font-weight: 700; color: #D5DBE9; }
    </style></head><body><div class="p-wrap"><div class="top"><img src="${ICON_B64}" /><div><div class="title">SPEEDYSLATE</div><span class="badge">${SVG_BOLT} WEBGPU MANGA TRANSLATOR</span></div></div><div class="headline">Auto-Erase &amp; Translate <span>Manga, Manhwa &amp; Webtoons</span> in &lt;1s</div><div class="chips"><div class="c">Local OCR</div><div class="c">Clean Inpaint</div><div class="c">Multi-AI + Free</div></div></div></body></html>`
  },
  {
    out: 'store-assets/promo/promo-marquee-1400x560.png', w: 1400, h: 560,
    html: `<!doctype html><html><head><meta charset="utf-8"><style>${SHARED_CSS}
      .m-wrap { width: 100vw; height: 100vh; padding: 54px 72px; display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 48px; align-items: center; position: relative; z-index: 2; }
      .cards { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; height: 440px; }
      .c-panel { background: #141722; border: 1px solid #2A2F45; border-radius: 12px; padding: 10px; position: relative; overflow: hidden; box-shadow: 0 22px 55px rgba(0,0,0,0.65); }
      .c-panel.after { border-color: #E52E3D; }
      .lbl { position: absolute; top: 18px; left: 18px; background: #0D0E14; color: #FFF; font-family: 'Space Grotesk', sans-serif; font-size: 10.5px; font-weight: 700; padding: 4px 10px; border-radius: 4px; border: 1px solid #353A50; }
      .c-panel.after .lbl { background: #E52E3D; border-color: #FF7680; }
    </style></head><body><div class="canvas"><div class="arch-grid"></div>
      <div class="m-wrap">
        <div>
          <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px;"><img src="${ICON_B64}" style="width:68px;height:68px;border-radius:14px;" /><div><div style="font-family:'Space Grotesk',sans-serif;font-size:30px;font-weight:700;letter-spacing:0.03em;">SPEEDYSLATE</div><div style="color:#FF6470;font-size:14px;font-weight:600;">Next-Gen Manga, Manhwa &amp; Webtoon Auto-Translator</div></div></div>
          <h1 class="h1" style="font-size:44px;">Read Any Raw Chapter <span class="accent">Without Waiting</span></h1>
          <p class="sub" style="margin-top:14px;max-width:560px;font-size:17px;">Local WebGPU PaddleOCR v6, spotless Telea FMM text erasure, elliptical comic typesetting, and multi-provider AI translation.</p>
          <div class="pill-row"><div class="pill">WebGPU &lt;1s/Page</div><div class="pill">Zero-Bleed Inpainting</div><div class="pill">Auto-Scroll HUD</div><div class="pill">Alt+Shift+X Crop</div></div>
        </div>
        <div class="cards"><div class="c-panel"><div class="lbl">RAW</div>${mangaArtworkSvg({ translated: false })}</div><div class="c-panel after"><div class="lbl">TRANSLATED</div>${mangaArtworkSvg({ translated: true })}</div></div>
      </div>
    </div></body></html>`
  }
];
