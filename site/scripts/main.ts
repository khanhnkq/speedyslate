const I18N: Record<'vi' | 'en', Record<string, string>> = {
  vi: {
    navShowcase: 'Giao diện',
    navArch: 'Kiến trúc',
    navInstall: 'Cài đặt',
    navPrivacy: 'Quyền riêng tư',
    ctaPrimary: 'Add to Chrome',
    ctaFirefox: 'Firefox Add-on',
    heroEyebrow: 'WEBGPU MANGA & WEBTOON ENGINE',
    heroTitle: 'Dịch truyện RAW sang <span>Tiếng Việt</span> dưới 1 giây',
    heroSub:
      'Quét chữ cục bộ bằng PaddleOCR v6 trên GPU, xóa sạch chữ gốc không lem viền và dàn trang trực tiếp trong bóng thoại.',
    m1: 'Thời gian quét & xóa chữ mỗi trang trên WebGPU',
    m2: 'Độ chính xác nhận diện ký tự PaddleOCR v6 Hybrid',
    m3: 'Chi phí OCR cục bộ kèm dự phòng Google Dịch 0-Key',
    m4: 'Độ tràn viền nhờ phép đóng hình thái học & Telea FMM',
    showTitle: 'Trải nghiệm thực tế bên trong tiện ích',
    showLead:
      'Toàn bộ quá trình nhận diện, xóa chữ, xoay vòng khóa API và kiểm soát tên miền gói gọn trong một bảng điều khiển dưới 500 KB.',
    tab1: 'Đối chiếu Trước & Sau',
    tab2: 'WebGPU OCR & Vision AI',
    tab3: 'Xóa chữ Telea FMM',
    tab4: 'Xoay vòng Key & Keyed JSON',
    tab5: 'Kiểm soát Web & Chụp vùng',
    archEyebrow: 'CLEAN-ROOM ENGINEERING',
    archTitle: 'Giải quyết triệt để 4 bài toán khó nhất khi dịch truyện trực tiếp',
    b1Title: 'Xóa sạch chữ dính sát vách trong mà không lẹm 1 pixel viền bong bóng',
    b1Body:
      'Kết hợp phép đóng hình thái học đĩa tròn R=5px với phương trình đạo hàm riêng Eikonal của Telea để tái tạo nền giấy và dải chuyển sắc mượt mà, loại bỏ hoàn toàn các miếng vá chữ nhật thô kệch.',
    b2Title: 'Không bao giờ dịch trượt ô thoại',
    b2Body:
      'Mọi bóng thoại được khóa cứng bằng định danh b0..bN ở tầng JSON Schema và tự động sắp thứ tự đọc Phải-sang-Trái cho Manga Nhật hoặc Trái-sang-Phải cho Webtoon Hàn.',
    b3Title: 'Đa API Key kèm Cứu hộ 0-Key',
    b3Body:
      'Tự động luân phiên qua Gemini, Groq, DeepSeek, OpenRouter, Ollama cục bộ và tự chuyển sang Google Dịch miễn phí ngay khi chạm giới hạn HTTP 429.',
    b4Title: 'Co giãn cỡ chữ khớp dây cung elip & khoanh vùng dịch Alt+Shift+X',
    b4Body:
      'Đo độ rộng chữ thực tế bằng Canvas 2D theo đúng kích thước cột đọc trên màn hình, kết hợp ResizeObserver chống tràn chữ và công cụ chụp dịch trực tiếp các trình đọc vẽ bằng Canvas/WebGL.',
    instTitle: 'Cài đặt miễn phí trên Chrome & Firefox',
    instLead:
      'Mã nguồn mở giấy phép MIT, tuân thủ đầy đủ tiêu chuẩn kiểm duyệt Manifest V3 của Chrome Web Store và Mozilla Add-ons (AMO).',
    dlChromeSub: 'Hỗ trợ tăng tốc phần cứng WebGPU qua Offscreen Worker',
    dlFxSub: 'Tương thích Firefox 140+ Desktop và Firefox 142+ Android',
    privCardTitle: 'Mặc định riêng tư tuyệt đối',
    privCardBody:
      'SpeedySlate không thu thập dữ liệu duyệt web, không có máy chủ trung gian và mặc định tắt trên mọi trang web cho tới khi bạn chủ động bật.',
    privLink: 'Đọc Chính sách Quyền riêng tư ->'
  },
  en: {
    navShowcase: 'Interface',
    navArch: 'Architecture',
    navInstall: 'Install',
    navPrivacy: 'Privacy',
    ctaPrimary: 'Add to Chrome',
    ctaFirefox: 'Firefox Add-on',
    heroEyebrow: 'WEBGPU MANGA & WEBTOON ENGINE',
    heroTitle: 'Translate Raw Chapters <span>In Under 1 Second</span>',
    heroSub:
      'Local WebGPU PaddleOCR v6, zero-bleed Telea FMM text erasure, and crisp comic typesetting right inside every speech balloon.',
    m1: 'Average local WebGPU detection & clean erase latency',
    m2: 'Character recognition precision on PaddleOCR v6 Hybrid',
    m3: 'Local OCR cost with built-in 0-Key Google rescue',
    m4: 'Outer border bleed via disk closing & Telea FMM',
    showTitle: 'Inside the SpeedySlate Control Deck',
    showLead:
      'Local ONNX model management, multi-key API rotation, per-domain privacy rules, and live diagnostics in an ultra-lean bundle.',
    tab1: 'Before & After Split',
    tab2: 'WebGPU OCR & Vision AI',
    tab3: 'Telea FMM Clean Erase',
    tab4: 'Key Pool & Keyed JSON',
    tab5: 'Site Rules & Screen Crop',
    archEyebrow: 'CLEAN-ROOM ENGINEERING',
    archTitle: 'Built to solve the four hardest problems in real-time scanlation',
    b1Title: 'Erases wall-touching strokes with zero border bleed',
    b1Body:
      'Combines R=5px Euclidean disk morphological closing with Alexandru Telea Fast Marching Method (FMM) inpainting to reconstruct bubble interiors and gradients without rectangular stickers.',
    b2Title: 'Zero shifted or misaligned speech bubbles',
    b2Body:
      'Every dialogue block is locked to an explicit b0..bN JSON schema key with automatic RTL row-band sorting for Japanese Manga and LTR sorting for Korean Webtoons.',
    b3Title: 'Multi-Key Pool & Zero-Key Free Rescue',
    b3Body:
      'Rotates seamlessly across Gemini, Groq, DeepSeek, OpenRouter, and offline Ollama—automatically falling back to 0-key Google Translate on HTTP 429 quota limits.',
    b4Title: 'Responsive chord typesetting & Alt+Shift+X Screen Crop',
    b4Body:
      'Scales font sizes against actual rendered DOM width with ResizeObserver clamping, plus instant viewport region capture for protected Canvas and WebGL readers.',
    instTitle: 'Free & Open-Source for Chrome and Firefox',
    instLead:
      'MIT-licensed and engineered for full Manifest V3 compliance across Chrome Web Store and Mozilla Add-ons (AMO).',
    dlChromeSub: 'Full hardware-accelerated WebGPU inference via Offscreen Worker',
    dlFxSub: 'Supports Firefox 140+ Desktop and Firefox 142+ Android',
    privCardTitle: 'Private by Default',
    privCardBody:
      'Zero analytics, zero developer proxy servers, and zero active scripts until you explicitly enable a domain.',
    privLink: 'Read Full Privacy Policy ->'
  }
};

function initHeroMotionAndSplit(): void {
  const stage = document.getElementById('hero-stage');
  const viewport = document.getElementById('hero-viewport');
  const handle = document.getElementById('split-handle');
  const telemetry = document.getElementById('demo-telemetry');
  const pills = Array.from(document.querySelectorAll<HTMLElement>('#stage-steps .step-pill'));
  const modeBtns = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-set-mode]'));
  if (!stage || !viewport || !handle) return;

  const setMode = (mode: 'motion' | 'split') => {
    stage.setAttribute('data-mode', mode);
    modeBtns.forEach((b) => b.classList.toggle('is-active', b.dataset.setMode === mode));
    if (telemetry) {
      telemetry.textContent =
        mode === 'split'
          ? 'INTERACTIVE SPLIT | DRAG HANDLE LEFT OR RIGHT'
          : 'PP-OCRv6 FP32 | TELEA FMM | 0px BLEED';
    }
  };

  modeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      setMode((btn.dataset.setMode as 'motion' | 'split') || 'motion');
    });
  });

  // Sync step indicator pills with 7.6s CSS keyframe cycle
  const CYCLE_MS = 7600;
  const t0 = performance.now();
  const tick = (now: number) => {
    if (stage.getAttribute('data-mode') === 'motion') {
      const p = ((now - t0) % CYCLE_MS) / CYCLE_MS;
      const activeIdx = p < 0.34 ? 0 : p < 0.52 ? 1 : 2;
      pills.forEach((el, idx) => el.classList.toggle('is-active', idx === activeIdx));
      if (telemetry) {
        telemetry.textContent =
          activeIdx === 0
            ? '01 DETECT | PP-OCRv6 1920px | 4 BOXES LOCKED'
            : activeIdx === 1
              ? '02 INPAINT | DISK CLOSING + TELEA FMM | 0px BLEED'
              : '03 TYPESET | KEYED JSON b0-b3 | AUTO-SCROLL 2X';
      }
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  // Smooth 60fps pointer scrubbing for SPLIT SCRUB mode
  let dragging = false;
  const updateSplit = (clientX: number) => {
    const rect = viewport.getBoundingClientRect();
    const pct = Math.max(6, Math.min(94, ((clientX - rect.left) / Math.max(1, rect.width)) * 100));
    stage.style.setProperty('--split-pct', `${pct.toFixed(1)}%`);
    handle.setAttribute('aria-valuenow', String(Math.round(pct)));
  };

  viewport.addEventListener('pointerdown', (e) => {
    if (stage.getAttribute('data-mode') !== 'split') return;
    dragging = true;
    viewport.setPointerCapture(e.pointerId);
    updateSplit(e.clientX);
  });
  viewport.addEventListener('pointermove', (e) => {
    if (dragging) updateSplit(e.clientX);
  });
  viewport.addEventListener('pointerup', () => {
    dragging = false;
  });
}

function initScreenshotTabs(): void {
  const img = document.getElementById('active-screenshot') as HTMLImageElement | null;
  const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>('#screenshot-tabs .stage-tab'));
  if (!img || tabs.length === 0) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const nextSrc = tab.dataset.shot;
      if (!nextSrc) return;
      img.src = nextSrc;
      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
      });
    });
  });
}

function initLanguageToggle(): void {
  let lang: 'vi' | 'en' = navigator.language?.toLowerCase().startsWith('vi') ? 'vi' : 'en';
  const btn = document.getElementById('btn-lang');

  const applyLang = (l: 'vi' | 'en') => {
    lang = l;
    document.documentElement.lang = l;
    const dict = I18N[l];
    document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
      const k = el.dataset.i18n!;
      if (dict[k]) el.textContent = dict[k];
    });
    document.querySelectorAll<HTMLElement>('[data-i18n-html]').forEach((el) => {
      const k = el.dataset.i18nHtml!;
      if (dict[k]) el.innerHTML = dict[k];
    });
    if (btn) btn.textContent = l === 'vi' ? 'VI / EN' : 'EN / VI';
  };

  btn?.addEventListener('click', () => applyLang(lang === 'vi' ? 'en' : 'vi'));
  applyLang(lang);
}

initHeroMotionAndSplit();
initScreenshotTabs();
initLanguageToggle();
