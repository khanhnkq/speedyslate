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
   - `manifest.json` cho Firefox bắt buộc phải có `gecko.id` (ví dụ: `speedyslate@khanhnkq.dev`) và `gecko.strict_min_version: "109.0"`.
4. **Tương Thích MV3 Nền Tảng Kép**:
   - **Chrome**: Sử dụng `background.service_worker`.
   - **Firefox**: Sử dụng `background.scripts` (do Firefox MV3 hỗ trợ event pages nền ổn định).
   - Tự động tách 2 script build: `npm run build:chrome` và `npm run build:firefox` (kèm lệnh đóng gói `npm run package:firefox` tạo file `.zip` nộp AMO).

---

## 4. ⚡ Tối Ưu Hiệu Năng & Trải Nghiệm (Performance & UX)
- **DOM Overlay Siêu Nhẹ**: Dùng thẻ `div` nền đen/trắng phủ đè lên Bounding Box từ OCR, không inpainting canvas.
- **Web Worker Tách Biệt**: Toàn bộ ONNX Runtime và Canvas OCR chạy trong Web Worker ngầm, tuyệt đối không làm đơ main thread giao diện.
- **IndexedDB Model Cache**: Tải model on-demand từ CDN, hỗ trợ xóa giải phóng bộ nhớ. Dung lượng cài đặt ban đầu của extension `< 500 KB`.
- **Dropdown Presets Đầy Đủ**: Điền sẵn Base URL & Models cho Gemini 3.5 Flash-Lite, Gemini 3.8 Flash, Groq (GPT-OSS 20B/120B, Qwen 27B), DeepSeek, Ollama.
