# ⚡ SpeedySlate - Manga & Webtoon Auto-Translator

Extension dịch truyện tranh siêu nhẹ, tối ưu triệt để dành cho **Chrome** và **Firefox** (tuân thủ 100% chuẩn kiểm duyệt **Mozilla Add-on Store - AMO**).

---

## 🌟 Tính Năng Nổi Bật

1. **0đ Chi Phí OCR (Chạy PaddleOCR Cục Bộ Bằng WebAssembly)**:
   - Mô hình PaddleOCR ONNX siêu nhẹ (~7MB cho tiếng Anh, ~13MB đa ngôn ngữ).
   - Quản lý tải / xóa mô hình tùy ý qua **IndexedDB**, giúp kích thước extension khi cài đặt ban đầu **< 500 KB**.
   - Chạy 100% ngầm trong **Web Worker**, giao diện cuộn truyện mượt mà 60fps, không gây đơ lag tab trình duyệt.

2. **Chỉ Gọi API Dịch Văn Bản (Tiết Kiệm Tối Đa & Siêu Tốc)**:
   - Tích hợp sẵn Presets dropdown cho các model mới nhất:
     - **Google Gemini**: `gemini-3.5-flash-lite`, `gemini-3.8-flash`, `gemini-2.5-flash`, `gemini-2.0-flash`.
     - **Groq**: `openai/gpt-oss-20b`, `openai/gpt-oss-120b`, `qwen/qwen3.8-27b`, `llama-3.3-70b-versatile` (tốc độ >500 token/s).
     - **DeepSeek**: `deepseek-chat` (V3), `deepseek-reasoner`.
     - **OpenRouter**, **OpenAI Official**, và **Local Ollama** (offline 100%).
   - Nút **[Kiểm Tra Kết Nối]** trực tiếp trong cài đặt.

3. **Phủ Hộp Thoại (DOM Overlay Nền Đen / Trắng - Không Inpainting)**:
   - Không chạy thuật toán tẩy xóa canvas nặng máy.
   - Phủ trực tiếp thẻ `div` nền trắng (chữ đen) hoặc nền đen (chữ trắng) có viền truyện tranh.
   - **Hover-to-peek**: Rê chuột vào hộp thoại để làm mờ xem chữ gốc bên dưới.

4. **Tự Động Cuộn Mượt Mà & Nạp Trước (Auto-Scroll & Prefetch)**:
   - Thanh công cụ nổi **HUD** ghim góc màn hình: Nút Play/Pause, thanh trượt tốc độ (1x - 8x), phím tắt `Spacebar`.
   - `IntersectionObserver` tự động dịch trước các ảnh phía dưới màn hình 1.5 khung nhìn.

---

## 🛠️ Hướng Dẫn Cài Đặt & Phát Triển

### 1. Cài đặt thư viện:
```bash
npm install
```

### 2. Kiểm tra type-check:
```bash
npm run type-check
```

### 3. Build cho Chrome:
```bash
npm run build:chrome
```
Thư mục xuất ra: `dist/chrome/`
- Mở Chrome -> truy cập `chrome://extensions`
- Bật **Developer mode** (Chế độ dành cho nhà phát triển)
- Chọn **Load unpacked** (Tải tiện ích đã giải nén) -> chọn thư mục `dist/chrome`.

### 4. Build & Đóng gói nộp Mozilla Firefox Add-ons (AMO):
```bash
# Build mã nguồn
npm run build:firefox

# Hoặc đóng gói thành file zip nộp ngay lên AMO:
npm run package:firefox
```
- File đóng gói sẵn sàng nộp lên AMO: `dist/speedyslate-firefox-amo.zip`.
- Thử nghiệm trên Firefox: Truy cập `about:debugging#/runtime/this-firefox` -> chọn **Load Temporary Add-on...** -> trỏ vào file `dist/firefox/manifest.json`.

---

## 📜 Tuân Thủ Tiêu Chuẩn Clean Code & AMO

- ✅ **Clean Code & SOLID**: Tách module độc lập (SRP, OCP, LSP, ISP, DIP).
- ✅ **Giới hạn 500 dòng/file**: Toàn bộ các file trong dự án đều < 300 dòng.
- ✅ **Tuân thủ Mozilla AMO**: Không eval, không tải script từ xa, file WASM được đóng gói cục bộ, khai báo `browser_specific_settings.gecko.id: "speedyslate@khanhnkq.dev"`.
