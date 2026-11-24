# SpeedySlate — Chrome Web Store Submission Kit

Toàn bộ tài nguyên cần thiết để tải lên [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) đã được chuẩn hóa đúng kích thước pixel và hệ màu `24-bit RGB` (không kênh Alpha cho Screenshots & Promo Tiles):

---

## 1. Danh sách File Upload theo từng mục trên Dashboard

| Mục trên Chrome Web Store | Đường dẫn File tải lên | Thông số kỹ thuật |
| :--- | :--- | :--- |
| **1. Package (`.zip` Upload)** | `store-assets/speedyslate-chrome-store.zip` | Bản build Chrome MV3 mới nhất kèm bộ icon mới |
| **2. Store Icon** | `store-assets/icons/store-icon-128x128.png` | `128 × 128 px` RGBA (chuẩn 104px biểu tượng + viền trong suốt CWS) |
| **3. Screenshot #1 (Hero)** | `store-assets/screenshots/01-hero-before-after.png` | `1280 × 800 px` · 24-bit RGB PNG |
| **4. Screenshot #2 (Engine)** | `store-assets/screenshots/02-hybrid-webgpu-engine.png` | `1280 × 800 px` · 24-bit RGB PNG |
| **5. Screenshot #3 (Inpaint)** | `store-assets/screenshots/03-clean-inpaint-typeset.png` | `1280 × 800 px` · 24-bit RGB PNG |
| **6. Screenshot #4 (AI Pool)** | `store-assets/screenshots/04-multi-ai-keyed-json.png` | `1280 × 800 px` · 24-bit RGB PNG |
| **7. Screenshot #5 (Privacy & Crop)** | `store-assets/screenshots/05-privacy-crop-autoscroll.png` | `1280 × 800 px` · 24-bit RGB PNG |
| **8. Small Promo Tile** *(Bắt buộc)* | `store-assets/promo/promo-small-440x280.png` | `440 × 280 px` · 24-bit RGB PNG |
| **9. Marquee Promo Tile** | `store-assets/promo/promo-marquee-1400x560.png` | `1400 × 560 px` · 24-bit RGB PNG |

---

## 2. Nội dung Store Listing (Copy-Paste)

### Title (Name)
`SpeedySlate - Manga & Webtoon Auto-Translator`

### Summary (Short Description — ≤ 132 ký tự)
- **English (127 chars):**
  `Instant Manga, Manhwa & Webtoon translator with local WebGPU PaddleOCR, clean text erasure, comic typesetting & multi-AI APIs.`
- **Tiếng Việt (126 ký tự):**
  `Dịch truyện tranh, Manga & Webtoon tự động siêu tốc bằng PaddleOCR WebGPU cục bộ, xóa chữ sạch và hỗ trợ đa AI API (0đ OCR).`

### Category & Language
- **Category:** `Productivity` → `Tools` (hoặc `Workflow & Planning`)
- **Primary Language:** `Vietnamese` (có thể thêm bản dịch `English` ngay trong tab Store Listing)

### Detailed Description (English)
```text
Read raw Japanese Manga, Korean Manhwa, Chinese Manhua, and English Comics effortlessly in any language—without waiting for scanlations.

SpeedySlate combines blazing-fast 100% local WebGPU PaddleOCR with porcelain-clean mathematical text erasure and crisp vector comic typesetting right inside your browser.

⚡ KEY FEATURES

• Ultra-Fast Local WebGPU OCR (0 Cost, 95% Token Savings)
Runs next-generation PaddleOCR v6 & RT-DETR comic detection directly on your device via WebGPU/WASM inside a background Web Worker (< 1.0s per page, zero UI lag). Your comic images stay private on your machine.

• Porcelain-Clean Text Erasure & Smart Bubble Fit
Cleanly erases raw vertical and horizontal text inside curved speech balloons, spiky shout bubbles, and halftone screentones using morphological chamber extraction and Telea Fast Marching Method (FMM) inpainting—with zero rectangular patches or border bleed. Hold Alt + Hover anytime to peek at the original lettering.

• Unstoppable Multi-AI Translation Pipeline
Connect your own API keys for Google Gemini, Groq, DeepSeek, OpenRouter, OpenAI, or 100% offline Local Ollama:
  – Strict Keyed JSON schema prevents shifted or misaligned speech bubbles.
  – Automatic Round-Robin multi-key & multi-provider failover on HTTP 429 rate limits.
  – Rolling Chapter Memory + Custom Glossary keeps character names consistent across pages.
  – Built-in Zero-Key Fallback lets you start translating immediately out of the box.

• Built for Binge-Reading
  – Smooth hands-free Auto-Scroll HUD (1x–8x speed + Spacebar toggle) with smart viewport prefetching.
  – Alt + Shift + X Screen Crop tool translates protected Canvas / WebGL comic viewers on demand.
  – 1-Click Per-Site Activation: inactive by default everywhere until you enable the websites you read.
```

### Detailed Description (Tiếng Việt)
```text
Đọc mượt mọi bộ Manga Nhật, Manhwa Hàn, Manhua Trung và Comic tiếng Anh bản RAW sang Tiếng Việt (hoặc bất kỳ ngôn ngữ nào) ngay tức thì.

SpeedySlate kết hợp nhận diện chữ PaddleOCR v6 chạy cục bộ trên GPU (WebGPU) với thuật toán xóa chữ toán học Telea FMM không lem viền và dàn trang font truyện tranh tiếng Việt sắc nét ngay trên trình duyệt.

⚡ TÍNH NĂNG NỔI BẬT

• 0đ Chi Phí OCR Cục Bộ trên WebGPU (Tiết kiệm 95% Token)
Quét chữ trực tiếp trên máy bằng ONNX Runtime WebGPU/WASM trong Web Worker ngầm (< 1 giây/trang, cuộn 60fps không giật lag). Tự động nhận diện chiều đọc phải-sang-trái (Manga) và trái-sang-phải (Webtoon).

• Xóa Chữ Sạch Tinh & Canh Chữ Khớp Lòng Bóng Thoại
Xóa gọn chữ gốc bằng phép đóng hình thái học và thuật toán Telea Fast Marching Method (FMM) giữ nguyên nét viền cong, viền gai nhọn và hạt screentone. Tự động co giãn cỡ chữ theo khung hiển thị thực tế; nhấn giữ Alt + Di chuột để soi nhanh chữ gốc bất cứ lúc nào.

• Xoay Vòng Đa AI API + Cứu Hộ Miễn Phí Không Cần Key
Hỗ trợ đầy đủ Google Gemini, Groq, DeepSeek, OpenRouter, OpenAI và Local Ollama (offline 100%):
  – Giao thức Keyed JSON khóa chặt từng câu dịch đúng vị trí bóng thoại, không bao giờ lệch ô.
  – Tự động xoay vòng nhiều API Key & chuyển đổi nhà cung cấp khi chạm giới hạn 429.
  – Bộ nhớ ngữ cảnh chương + Glossary giữ đồng nhất tên nhân vật và xưng hô.
  – Tích hợp sẵn chế độ dịch dự phòng miễn phí không cần nhập API Key.

• Tối Ưu Trọn Vẹn Trải Nghiệm Đọc Truyện
  – Thanh HUD Tự Động Cuộn mượt mà (tốc độ 1x–8x, phím tắt Spacebar) và dịch đón đầu khung nhìn.
  – Phím tắt Alt + Shift + X khoanh vùng dịch trực tiếp trên màn hình cho cả các trang khóa chuột phải hoặc vẽ bằng Canvas/WebGL.
  – Kiểm soát riêng tư từng trang: Mặc định tắt hoàn toàn cho tới khi bạn bấm bật trên trang web muốn đọc.
```

---

## 3. Nội dung Tab "Privacy Practices" (Bắt buộc điền khi Submit CWS)

### Single Purpose Description
`Automatically detects, erases, and translates text inside comic, manga, and webtoon images on user-enabled webpages into the user's chosen language.`

### Permission Justifications (Copy-paste vào từng ô giải trình quyền)

- **`storage`:**
  `Stores the user's local preferences, enabled website domains, custom glossary terms, translation cache, and downloaded ONNX OCR model weights locally in the browser.`
- **`offscreen`:**
  `Creates an offscreen document in Manifest V3 to host the WebAssembly / WebGPU ONNX Runtime Web Worker and OffscreenCanvas required for local optical character recognition (OCR) without blocking webpage rendering.`
- **`declarativeNetRequest`:**
  `Dynamically attaches matching Referer and CORS headers when fetching comic panel images on user-enabled reader sites so cross-origin CDN panels can be processed by the local OCR canvas without HTTP 403 hotlink errors.`
- **`activeTab`:**
  `Allows the user to toggle translation on the currently open tab from the popup and capture a user-selected viewport region when invoking the Alt+Shift+X Screen Crop translation shortcut.`
- **`Host Permissions (http://*/*, https://*/*)`:**
  `Required so the user can enable comic panel detection, cross-origin CDN image loading, and requests to their chosen translation API endpoints (such as Gemini, Groq, DeepSeek, OpenRouter, or local Ollama) on any comic reader domain they choose to add.`

### Data Usage Checkboxes
- Chọn **"Website content"** (văn bản thoại trích xuất từ ảnh truyện được gửi tới API dịch thuật do người dùng chọn; không thu thập về máy chủ của nhà phát triển).
- Tick chọn cả **3 cam kết tuân thủ Limited Use Policy** ở cuối trang Privacy Practices.
- Chọn **"No, I am not using remote code"** ở mục Remote Code (toàn bộ mã JS, font `.woff2` và runtime `.wasm` đều đã được đóng gói cục bộ 100%).
