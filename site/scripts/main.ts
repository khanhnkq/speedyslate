type Lang = 'vi' | 'en';

const I18N: Record<Lang, Record<string, string>> = {
  vi: {
    navShowcase: 'Giao diện',
    navArch: 'Kiến trúc',
    navInstall: 'Cài đặt',
    navPrivacy: 'Quyền riêng tư',
    ctaPrimary: 'Thêm vào Chrome',
    ctaFirefox: 'Bản cho Firefox',
    heroEyebrow: 'WEBGPU MANGA & WEBTOON ENGINE',
    heroTitle: 'Dịch truyện RAW sang <span>Tiếng Việt</span> dưới 1 giây',
    heroSub:
      'Quét chữ cục bộ bằng PaddleOCR v6 trên GPU, xóa sạch chữ gốc không lem viền và dàn trang trực tiếp trong bóng thoại.',
    stepDetect: '01 QUÉT OCR',
    stepInpaint: '02 XÓA CHỮ',
    stepTypeset: '03 DÀN TRANG',
    modeAuto: 'CHẠY TỰ ĐỘNG',
    modeSplit: 'KÉO SO SÁNH',
    comicB1L1: 'Khoan đã!',
    comicB1L2: 'Phía trước có',
    comicB1L3: 'bẫy phục kích!',
    comicB2L1: 'Mở khiên chắn',
    comicB2L2: 'ngay lập tức!',
    comicB3L1: 'Đêm thứ 7 tại Khu 09 —',
    comicB3L2: 'tín hiệu đã được giải mã.',
    comicB4L1: 'Tốt lắm, chuẩn bị',
    comicB4L2: 'đột kích thôi!',
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
    archEyebrow: 'KỸ THUẬT CLEAN-ROOM',
    archTitle: 'Giải quyết triệt để 4 bài toán khó nhất khi dịch truyện trực tiếp',
    b1Title: 'Xóa sạch chữ dính sát vách trong mà không lẹm 1 pixel viền bong bóng',
    b1Body:
      'Kết hợp phép đóng hình thái học đĩa tròn R=5px với phương trình đạo hàm riêng Eikonal của Telea để tái tạo nền giấy và dải chuyển sắc mượt mà, loại bỏ hoàn toàn các miếng vá chữ nhật thô kệch.',
    b2Title: 'Không bao giờ dịch trượt ô thoại',
    b2Body:
      'Mọi bóng thoại được khóa cứng bằng định danh b0-bN ở tầng JSON Schema và tự động sắp thứ tự đọc Phải-sang-Trái cho Manga Nhật hoặc Trái-sang-Phải cho Webtoon Hàn.',
    b2Code: '{"b0": "Khoan đã!", "b1": "Mở khiên chắn ngay!"}',
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
    privLink: 'Đọc Chính sách Quyền riêng tư ->',
    footerCopy: 'Dự án mã nguồn mở SpeedySlate (Giấy phép MIT)',
    footerRepo: 'Mã nguồn GitHub',
    privBack: 'Về trang chủ',
    privBadge: 'CHÍNH SÁCH QUYỀN RIÊNG TƯ',
    privPageTitle: 'Chính sách Quyền riêng tư của Tiện ích SpeedySlate',
    privUpdated: 'Cập nhật lần cuối: 24/11/2026',
    p1Head: '1. Không thu thập dữ liệu người dùng',
    p1Body:
      'SpeedySlate vận hành hoàn toàn phía trình duyệt của bạn. Nhà phát triển không sử dụng công cụ theo dõi, không lưu tài khoản và không vận hành máy chủ trung gian. Lịch sử đọc, danh sách tên miền đã bật và khóa API không bao giờ rời khỏi thiết bị của bạn ngoài việc gửi trực tiếp tới nhà cung cấp AI mà bạn tự cấu hình.',
    p2Head: '2. Nhận diện chữ quang học cục bộ (Local OCR)',
    p2Body:
      'Ở chế độ Hybrid OCR, hình ảnh truyện tranh trên các trang web bạn chủ động bật được xử lý ngay trên máy bằng ONNX Runtime WebGPU/WASM lưu trong IndexedDB. Hình ảnh gốc không bao giờ bị tải lên máy chủ của nhà phát triển.',
    p3Head: '3. Kết nối trực tiếp tới API Dịch thuật bên thứ ba',
    p3Body:
      'Văn bản thoại trích xuất (hoặc ảnh nén khi bạn chủ động chọn chế độ Multimodal Vision) được gửi thẳng từ trình duyệt tới dịch vụ bạn chọn như Google Gemini, Groq, DeepSeek, OpenRouter, OpenAI, Google Translate hoặc máy chủ Ollama nội bộ của riêng bạn.',
    p4Head: '4. Bộ nhớ cục bộ và Quyền truy cập',
    p4Body:
      'Tiện ích chỉ dùng bộ nhớ cục bộ của trình duyệt để lưu cấu hình, danh sách trang web riêng, từ điển Glossary, bộ nhớ đệm bản dịch và trọng số mô hình OCR. Bạn có thể xóa toàn bộ bộ nhớ đệm bất cứ lúc nào trong thẻ Hệ thống hoặc gỡ cài đặt tiện ích.',
    p5Head: '5. Cam kết Chính sách Sử dụng Giới hạn của Chrome Web Store',
    p5Body:
      'Việc sử dụng quyền nội dung trang web tuân thủ nghiêm ngặt Chính sách Dữ liệu Người dùng của Chrome Web Store, bao gồm đầy đủ các yêu cầu về Sử dụng Giới hạn (Limited Use).'
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
    stepDetect: '01 DETECT',
    stepInpaint: '02 INPAINT',
    stepTypeset: '03 TYPESET',
    modeAuto: 'AUTO MOTION',
    modeSplit: 'SPLIT SCRUB',
    comicB1L1: 'Hold up!',
    comicB1L2: 'There is an ambush',
    comicB1L3: 'waiting ahead!',
    comicB2L1: 'Raise the shield',
    comicB2L2: 'right now!',
    comicB3L1: 'Night 7 in Sector 09 —',
    comicB3L2: 'cipher signal decoded.',
    comicB4L1: 'All set, get ready',
    comicB4L2: 'to breach in!',
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
      'Every dialogue block is locked to an explicit b0-bN JSON schema key with automatic RTL row-band sorting for Japanese Manga and LTR sorting for Korean Webtoons.',
    b2Code: '{"b0": "Hold up!", "b1": "Raise the shield now!"}',
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
    privLink: 'Read Full Privacy Policy ->',
    footerCopy: 'SpeedySlate Open-Source Project (MIT License)',
    footerRepo: 'GitHub Repository',
    privBack: 'Back to Home',
    privBadge: 'PRIVACY POLICY',
    privPageTitle: 'SpeedySlate Browser Extension Privacy Policy',
    privUpdated: 'Last updated: November 24, 2026',
    p1Head: '1. Zero Developer Data Collection',
    p1Body:
      'SpeedySlate operates entirely client-side inside your web browser. The developer does not operate any analytics, telemetry, tracking pixels, user accounts, or proxy servers. Your browsing history, enabled website list, and API keys never leave your device except to communicate directly with the translation API provider you explicitly configure.',
    p2Head: '2. Local Optical Character Recognition (OCR)',
    p2Body:
      'In Hybrid OCR mode, comic and webtoon images on websites you explicitly enable are processed locally on your device using WebGPU or WebAssembly ONNX Runtime models cached in your browser IndexedDB. Raw images are never uploaded to any developer server.',
    p3Head: '3. Direct Third-Party Translation API Requests',
    p3Body:
      'Extracted dialogue text (or compressed panel slices when Multimodal Vision mode is selected by the user) is sent directly from your browser to the translation endpoint you choose—such as Google Gemini, Groq, DeepSeek, OpenRouter, OpenAI, Google Translate, or your own local Ollama instance.',
    p4Head: '4. Local Browser Storage & Permissions',
    p4Body:
      'SpeedySlate uses local browser storage solely to save your extension settings, user-added domain list, custom glossary, cached translations, and downloaded ONNX OCR weights. You can clear all cached data at any time inside the System tab or by uninstalling the extension.',
    p5Head: '5. Chrome Web Store Limited Use Disclosure',
    p5Body:
      'The use of information received from website content permissions adheres strictly to the Chrome Web Store User Data Policy, including all Limited Use requirements.'
  }
};

let activeLang: Lang = 'vi';

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
          ? activeLang === 'vi'
            ? 'CHẾ ĐỘ KÉO SO SÁNH | KÉO THANH TRƯỢT TRÁI / PHẢI'
            : 'INTERACTIVE SPLIT | DRAG HANDLE LEFT OR RIGHT'
          : 'PP-OCRv6 FP32 | TELEA FMM | 0px BLEED';
    }
  };

  modeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      setMode((btn.dataset.setMode as 'motion' | 'split') || 'motion');
    });
  });

  const CYCLE_MS = 7600;
  const t0 = performance.now();
  const tick = (now: number) => {
    if (stage.getAttribute('data-mode') === 'motion') {
      const p = ((now - t0) % CYCLE_MS) / CYCLE_MS;
      const activeIdx = p < 0.34 ? 0 : p < 0.52 ? 1 : 2;
      pills.forEach((el, idx) => el.classList.toggle('is-active', idx === activeIdx));
      if (telemetry) {
        if (activeLang === 'vi') {
          telemetry.textContent =
            activeIdx === 0
              ? '01 QUÉT OCR | PP-OCRv6 1920px | ĐÃ KHÓA 4 KHUNG'
              : activeIdx === 1
                ? '02 XÓA CHỮ | ĐÓNG HÌNH THÁI + TELEA FMM | 0px TRÀN VIỀN'
                : '03 DÀN TRANG | KEYED JSON b0-b3 | TỰ CUỘN 2X';
        } else {
          telemetry.textContent =
            activeIdx === 0
              ? '01 DETECT | PP-OCRv6 1920px | 4 BOXES LOCKED'
              : activeIdx === 1
                ? '02 INPAINT | DISK CLOSING + TELEA FMM | 0px BLEED'
                : '03 TYPESET | KEYED JSON b0-b3 | AUTO-SCROLL 2X';
        }
      }
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

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

function initLanguageSwitch(): void {
  const btns = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-set-lang]'));
  const saved = (() => {
    try {
      return localStorage.getItem('speedyslate_site_lang') as Lang | null;
    } catch {
      return null;
    }
  })();

  const initial: Lang =
    saved === 'vi' || saved === 'en'
      ? saved
      : navigator.language?.toLowerCase().startsWith('vi')
        ? 'vi'
        : 'en';

  const applyLang = (l: Lang) => {
    activeLang = l;
    document.documentElement.lang = l;
    try {
      localStorage.setItem('speedyslate_site_lang', l);
    } catch {}

    const dict = I18N[l];
    document.querySelectorAll<Element>('[data-i18n]').forEach((el) => {
      const k = el.getAttribute('data-i18n');
      if (k && dict[k]) el.textContent = dict[k];
    });
    document.querySelectorAll<HTMLElement>('[data-i18n-html]').forEach((el) => {
      const k = el.dataset.i18nHtml;
      if (k && dict[k]) el.innerHTML = dict[k];
    });
    btns.forEach((b) => {
      const on = b.dataset.setLang === l;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  };

  btns.forEach((b) => {
    b.addEventListener('click', () => {
      const target = b.dataset.setLang as Lang;
      if (target === 'vi' || target === 'en') applyLang(target);
    });
  });

  applyLang(initial);
}

initLanguageSwitch();
initHeroMotionAndSplit();
initScreenshotTabs();
