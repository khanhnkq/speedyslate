# SpeedySlate GitHub Pages Landing Page — Implementation Plan

> **Target URL:** `https://khanhnkq.github.io/speedyslate/` (kèm `https://khanhnkq.github.io/speedyslate/privacy.html` dùng làm Privacy Policy URL chính thức nộp Chrome Web Store & Mozilla AMO)

## Design Read & Aesthetic Direction (`design-taste-frontend`)

**Reading this as:** Developer-grade consumer extension landing page for manga/webtoon readers, with a Swiss-architectural dark monochrome + single crimson accent language (`#090A0E` obsidian, `#F4F5F8` chalk, `#E52E3D` crimson, `1px` structural hairlines), leaning toward precision editorial grid + interactive Before/After comparison slider.

- **Dials:** `DESIGN_VARIANCE: 7` | `MOTION_INTENSITY: 5` | `VISUAL_DENSITY: 4`
- **Hard Bans (Strict Pre-Flight Gate):**
  1. **Zero Emojis:** Không có bất kỳ ký tự emoji nào trong HTML, CSS, JS hay nội dung văn bản (kể cả bên trong các ảnh screenshot nhúng trên trang — sẽ cập nhật lại `store-asset-templates.mjs` thay toàn bộ emoji `⚡/🔑/🎯/🧠/🛡/✂/🌐` bằng vector SVG chuẩn Tabler Icons).
  2. **Zero Dots:** Tuyệt đối không dùng nền chấm bi (`radial-gradient` dot grid / halftone), không dùng chấm tròn trạng thái (`status dot`), không dùng ký tự `•` hay `·`. Mọi phân tách thị giác dùng đường kẻ mảnh kiến trúc (`1px solid #1E212B`), vạch đứng `|` hoặc khoảng trắng.
  3. **Zero AI-Slop:**
     - Không gradient tím/xanh, không hiệu ứng glow lòe loẹt, không serif chêm giữa câu sans-serif.
     - Không căn giữa Hero đơn điệu: dùng bố cục **Split Asymmetric Grid (5/7)** vừa khít khung nhìn đầu tiên (`min-h-[100dvh]`, tối đa 4 thành phần chữ ở Hero).
     - Tối đa **2 nhãn chữ in hoa nhỏ (eyebrow)** trên toàn bộ 6 phân khu của trang (tuân thủ quy tắc `<= ceil(sections / 3)`).
     - Không lặp lại cùng một kiểu bố cục giữa 2 phân khu liên tiếp.
     - Một nhãn CTA duy nhất cho mỗi hành động (`Add to Chrome` và `Firefox Add-on`).

---

## 1. Cấu trúc Thư mục & Hạ tầng Build (`site/`)

Giữ repo Extension gốc hoàn toàn sạch nhẹ (không cài thêm React/Next.js làm phình `node_modules`), xây dựng bằng **Semantic HTML5 + Modular CSS Grid + Vanilla TypeScript** và đóng gói qua Vite config riêng:

- `site/index.html` — Trang chủ Landing Page (Song ngữ Anh / Việt chuyển đổi tức thì không tải lại trang, mặc định tự nhận theo `navigator.language`).
- `site/privacy.html` — Trang Chính sách Quyền riêng tư (Privacy Policy) chuẩn yêu cầu bắt buộc của Chrome Web Store & Mozilla Add-ons.
- `site/styles/tokens.css` — Hệ thống biến thiết kế (Màu `#090A0E` / `#11131A` / `#1E212B` / `#E52E3D`, thang bo góc đồng nhất `12px` cho khung lớn và `6px` cho nút/nhãn, font tự host `Space Grotesk` + `Patrick Hand`).
- `site/styles/layout.css` — Lưới kiến trúc từng phân khu + responsive tường minh dưới `768px`.
- `site/scripts/compare-slider.ts` — Thanh kéo đối chiếu trực tiếp **Before (RAW) / After (Translated)** mượt 60fps bằng `transform: translate3d` & `clip-path` (không re-render DOM).
- `site/scripts/gallery-tabs.ts` — Bộ chuyển tab xem 5 ảnh thực tế từ `store-assets/screenshots/01..05-*.png` + công tắc chuyển ngôn ngữ `VI / EN`.
- `vite.site.config.ts` — Build thư mục `site/` + copy các file cần thiết từ `store-assets/` & `public/icons/` ra `dist-site/` với `base: '/speedyslate/'`.
- `.github/workflows/deploy-pages.yml` — GitHub Actions tự động build `dist-site/` và publish thẳng lên **GitHub Pages** qua `actions/deploy-pages@v4` mỗi khi push nhánh `master` (không sinh nhánh `gh-pages` rác).

---

## 2. Cấu trúc 6 Phân khu trên Trang (6 Distinct Layout Families)

| Thứ tự | Phân khu | Kiểu bố cục (Layout Family) | Tài nguyên (`store-assets`) sử dụng |
| :--- | :--- | :--- | :--- |
| **0. Nav** | Thanh điều hướng đơn dòng (`64px` cố định) | Kẻ chân `1px`, bên trái là `icon.svg` + `SPEEDYSLATE`, bên phải là liên kết neo (`Pipeline`, `Architecture`, `Privacy`, nút chuyển `VI / EN`, nút chính `Add to Chrome`) | `public/icons/icon.svg` *(đã lược bỏ chi tiết halftone tròn nhỏ nếu cần hoặc giữ logo chuẩn)* |
| **1. Hero** | Khung nhìn đầu tiên (`min-h-[100dvh]`, tối đa `pt-20`) | **5/7 Split Screen:** Cột trái căn lề trái gồm tiêu đề 2 dòng, mô tả <= 20 từ, 2 nút cài đặt (`Add to Chrome` + `Firefox Add-on`). Cột phải là **Khung Kéo Tương Tác Trực Tiếp (Interactive Drag Handle)** trượt mượt giữa trang truyện RAW và trang đã xóa chữ + dàn trang | Tranh truyện vector gốc tách làm 2 lớp `RAW` và `TRANSLATED` kéo qua lại trực tiếp bằng chuột / cảm ứng |
| **2. Metrics Bar** | Dải thông số kỹ thuật đo thực tế | **4-Cell Architectural Hairline Strip** (`border-y` và `divide-x`, không dùng card nổi): `< 1.0s` quét WebGPU mỗi trang / `0 VND` chi phí OCR cục bộ / `91.5%` độ chính xác PP-OCRv6 / `25 MB` lưu đệm ngoại tuyến | Số liệu thực đo từ bộ benchmark Apple Silicon WebGPU |
| **3. Visual Tour** | Trình diễn giao diện thật của Extension | **Interactive Tabbed Stage (1 khung lớn + 5 thanh chọn ngang):** Bấm từng mục để chuyển mượt giữa 5 ảnh chụp màn hình chuẩn `1280x800` đã tạo | `store-assets/screenshots/01..05-*.png` *(được render lại bản sạch 0 emoji, 0 dot-grid trước khi đóng gói)* |
| **4. Asymmetric Bento** | Kiến trúc lõi 4 ô bất đối xứng | **4-Cell Asymmetric Bento Grid (2+1 / 1+2):** Ô 1 (rộng 8 cột): Thuật toán xóa chữ hình thái học & Telea FMM không lem viền; Ô 2 (4 cột): Keyed JSON `b0..bN` chống lệch bóng thoại; Ô 3 (4 cột): Xoay vòng đa API Key & Cứu hộ Google Dịch 0-Key; Ô 4 (8 cột): Phím tắt `Alt+Shift+X` chụp dịch vùng Canvas/WebGL & Tự động cuộn | Ảnh cắt chi tiết từ `03-clean-inpaint-typeset.png`, `04-multi-ai-keyed-json.png`, `05-privacy-crop-autoscroll.png` |
| **5. Install & Open Source** | Bảng tải về & Cam kết quyền riêng tư | **2-Column Editorial Split (`border-t`):** Cột trái hướng dẫn cài đặt Chrome Web Store / Firefox AMO / Bản `.zip` GitHub Releases; Cột phải tóm tắt nguyên tắc bảo mật cục bộ + liên kết tới `privacy.html` và mã nguồn GitHub MIT | `store-assets/promo/promo-small-440x280.png` & `store-assets/icons/icon128.png` |

---

## 3. Các bước Thực thi & Kiểm chứng (Execution Tasks)

- **Task 1 — Làm sạch bộ ảnh `store-assets/` theo chuẩn Zero-Emoji & Zero-Dot:**
  - Cập nhật `scripts/store-asset-templates.mjs`: gỡ lớp `.halftone-bg` chấm tròn, gỡ thẻ `<span class="dot">`, thay toàn bộ ký tự emoji (`⚡`, `👁`, `🔑`, `🎯`, `🧠`, `🛡`, `✂`, `🌐`) bằng icon SVG nét mảnh chuẩn Tabler.
  - Chạy lại `node scripts/render-store-assets.mjs` để cả 5 ảnh `1280x800` và 2 banner promo đều đồng bộ tuyệt đối với quy tắc không emoji, không dots (vẫn giữ chuẩn `24-bit RGB` cho Chrome Web Store).
- **Task 2 — Xây dựng `site/index.html`, `site/privacy.html`, CSS kiến trúc & Interactive Slider:**
  - Cài đặt giao diện `site/` với đầy đủ trạng thái hover, focus-visible đạt chuẩn tương phản WCAG AA, hỗ trợ song ngữ `VI / EN` và responsive trên di động (`375px`), máy tính bảng (`768px`), màn hình rộng (`1440px`).
- **Task 3 — Cấu hình `vite.site.config.ts` & GitHub Actions `.github/workflows/deploy-pages.yml`:**
  - Thêm script `"build:site": "vite build --config vite.site.config.ts"` vào `package.json`.
  - Tạo workflow tự động deploy `dist-site/` lên GitHub Pages khi có commit mới trên `master`.
- **Task 4 — Kiểm định Tự động & Duyệt Trực Quan trên Trình Duyệt:**
  - Viết test kiểm định tự động (`tests/site/landing-audit.test.ts`): quét toàn bộ `site/` và `dist-site/` đảm bảo **0 ký tự Emoji Unicode**, **0 class/style dot-grid**, **0 rò rỉ tên miền nhạy cảm**, mọi thẻ `<img>` đều trỏ tới file tồn tại thật và có `width`/`height` chống giật bố cục.
  - Chạy server preview cục bộ + mở `browser_preview` chụp kiểm tra trên cả màn hình Desktop `1440x900` và Mobile `390x844`.
