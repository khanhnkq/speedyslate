# SpeedySlate - Quy Tắc & Tiêu Chuẩn Phát Triển Dự Án

## 1. 📐 Nguyên Tắc Thiết Kế (Clean Code & SOLID)
- **Single Responsibility Principle (SRP)**: Mỗi file, class, hoặc function chỉ đảm nhận một trách nhiệm duy nhất:
  - `scroller.ts`: Chỉ quản lý vòng lặp cuộn và tính toán tốc độ.
  - `observer.ts`: Chỉ lắng nghe IntersectionObserver trên DOM ảnh.
  - `overlay.ts`: Chỉ tạo và cập nhật các thẻ `div` hộp thoại.
  - `paddle-det.ts`: Chỉ tiền xử lý & hậu xử lý Text Detection.
  - `paddle-rec.ts`: Chỉ nhận diện text & giải mã CTC.
  - `model-db.ts`: Chỉ quản lý lưu trữ IndexedDB cho ONNX models.
- **Open/Closed Principle (OCP)**: Mở rộng qua interface. Thêm provider mới (như Claude, Cohere) hoặc model OCR mới chỉ cần implements interface mà không sửa đổi core engine.
- **Liskov Substitution Principle (LSP)**: Mọi Translation Provider phải tuân thủ nghiêm ngặt `ITranslationProvider`.
- **Interface Segregation Principle (ISP)**: Tách nhỏ các interfaces, không tạo interface "khổng lồ" chứa các hàm không cần thiết.
- **Dependency Inversion Principle (DIP)**: Các module cấp cao (Scroller, Content Script) phụ thuộc vào abstraction, không phụ thuộc trực tiếp vào API cụ thể.

---

## 2. 📏 Giới Hạn Dung Lượng File (File Size Limit)
- **TUYỆT ĐỐI KHÔNG QUÁ 500 DÒNG TRÊN MỖI FILE**:
  - Nếu file tiệm cận 400 dòng, phải chủ động tách nhỏ logic thành các file phụ trợ (helpers, utils, types, adapters).
  - Khuyến khích cấu trúc modular theo thư mục: ví dụ `src/content/overlay/` gồm `overlay-renderer.ts`, `overlay-styler.ts`, `overlay-events.ts`.

---

## 3. 🦊 Tiêu Chuẩn Nộp Mozilla Firefox Add-ons (AMO Review Compliance)
Tuân thủ nghiêm ngặt quy định duyệt extension của Mozilla Add-ons (AMO):
1. **Không Dùng Mã Từ Xa (No Remote Code Execution)**:
   - Nghiêm cấm dùng `eval()`, `new Function()`, hoặc nhúng script từ xa qua `<script src="...">`.
   - Toàn bộ logic và dependencies phải được bundle cục bộ.
2. **Không Che Giấu Mã Nguồn (No Obfuscation)**:
   - Giữ mã nguồn sau build sáng sủa, dễ đọc, biến rõ nghĩa để kiểm duyệt viên AMO có thể đọc hiểu.
3. **Khai Báo Chuẩn `browser_specific_settings`**:
   - `manifest.json` cho Firefox bắt buộc phải có `gecko.id` (ví dụ: `speedyslate@khanhnkq.dev`) và `gecko.strict_min_version: "140.0"` (kèm `gecko_android.strict_min_version: "142.0"`).
   - Bắt buộc khai báo `data_collection_permissions` (quy định từ 11/2025 cho mọi add-on mới trên AMO), ví dụ: `"data_collection_permissions": { "required": ["websiteContent"] }` khi dịch nội dung văn bản từ trang web.
4. **Tương Thích MV3 Nền Tảng Kép**:
   - **Chrome**: Sử dụng `background.service_worker`.
   - **Firefox**: Sử dụng `background.scripts` (do Firefox MV3 hỗ trợ event pages nền ổn định).
   - Tự động tách 2 script build: `npm run build:chrome` và `npm run build:firefox` (kèm lệnh đóng gói `npm run package:firefox` tạo file `.zip` nộp AMO).

---

## 4. 🧪 Local OCR Test Harness (Quy trình test sau mỗi thay đổi)
- **Fixtures**: `test-fixtures/yotogi-mura/` (22 ảnh 1128×1600, gitignored) + `test-fixtures/models/<preset>/{det.onnx,rec.onnx,dict.txt}`.
- **Server**: `node scripts/test-server.mjs 8642` — static + `POST /save-result` + `POST /save-image?name=&run=` → `test-harness/results/`.
- **Chạy test thật** (headless Chrome, không cần extension):
  `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --user-data-dir=/tmp/chrome-ocr-test "http://127.0.0.1:8642/test-harness/index.html?auto=1&model=<modelId>&backend=wasm|webgpu&images=all|0,3,5"`
- **Kết quả**: JSON `test-harness/results/*.json` (detMs/recMs/totalMs/boxCount/bubbles/dialogues) + PNG annotated `test-harness/results/annotated/` — đọc ảnh để review chất lượng trực quan.
- **UI tay**: `http://127.0.0.1:8642/test-harness/` (chọn model → Run).
- **Sau khi sửa code worker**: `npm run build:chrome && npm run build:harness` rồi chạy lại lệnh Chrome headless → so sánh JSON/annotated với baseline trước đó.

---

## 5. ⚡ Tối Ưu Hiệu Năng & Trải Nghiệm (Performance & UX)
- **DOM Overlay Siêu Nhẹ**: Dùng thẻ `div` nền đen/trắng phủ đè lên Bounding Box từ OCR, không inpainting canvas.
- **Web Worker Tách Biệt**: Toàn bộ ONNX Runtime và Canvas OCR chạy trong Web Worker ngầm, tuyệt đối không làm đơ main thread giao diện.
- **Dropdown Presets & Xoay Vòng Đa Provider**: Điền sẵn Base URL & Models cho Gemini 3.5 Flash-Lite, Gemini 3.8 Flash, Google Antigravity Agent (`antigravity-preview-09-2026`), Groq (GPT-OSS 20B/120B, Qwen 27B), DeepSeek, Ollama. Hỗ trợ lưu cấu hình độc lập cho từng nhà cung cấp, xoay vòng nhiều key (round-robin) và tự động chuyển đổi luân phiên / dự phòng đa provider khi gặp 429 Rate Limit.
