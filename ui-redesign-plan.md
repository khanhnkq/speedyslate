# Kế Hoạch Tái Cấu Trúc Giao Diện SpeedySlate (Dark & Crimson Brutalism)

> **Mục tiêu**: Nâng cấp toàn diện giao diện Popup & Dashboard cài đặt của SpeedySlate theo ngôn ngữ thiết kế từ ảnh mẫu (Phong cách Streamer/Manga Brutalism: Nền Dark Obsidian, điểm nhấn Đỏ Crimson `#E52E3D`, chữ Trắng tối giản, thẻ Panel/Tab sắc nét, sử dụng Tabler Icons, không rườm rà chữ nghĩa và không lặp lại nội dung).

---

## 1. Nguyên Tắc Thiết Kế Cốt Lõi

1. **Bảng màu tinh gọn (Strict 3-Tone Palette)**:
   - **Nền chính (Deep Obsidian)**: `#0D0D11`
   - **Khối bề mặt (Card Surface)**: `#16161C`
   - **Đường nét viền (Border Line)**: `#26262E`
   - **Màu điểm nhấn (Crimson Red)**: `#E52E3D` / Hover: `#FF3B47` (chuẩn màu từ ảnh mẫu)
   - **Màu chữ chính**: `#FFFFFF` (Heading/Text), `#8E8E9A` (Muted/Sub-label)
   - *Tuyệt đối không dùng nhiều màu loang lổ (bỏ màu tím cũ, bỏ màu xanh lá/xanh dương lộn xộn).*

2. **Thư viện Icon (Tabler Icons)**:
   - Tích hợp package chính thức `@tabler/icons-webfont` được bundle cục bộ qua Vite (tuân thủ 100% chính sách duyệt Mozilla AMO, không tải CDN từ xa).
   - Sử dụng thẻ `<i class="ti ti-...">` chuẩn mực, không tự viết các thẻ SVG thủ công.

3. **Cấu trúc Tab / Panel chuyên nghiệp (Tránh cuộn dài vô tận)**:
   - Thay vì kéo một trang popup dài 1500px, chia thành 4 Tab định danh theo phong cách từ ảnh mẫu (`PAINÉIS | PANELS`):
     - **`CHẾ ĐỘ | MODES`**: Lựa chọn 2 phương thức dịch (⚡ Hybrid OCR vs 👁️ Multimodal Vision AI).
     - **`MÔ HÌNH | ENGINE`**: Quản lý Model OCR On-demand, công tắc WebGPU, bộ nhớ lưu trữ.
     - **`DỊCH THUẬT | AI API`**: Cấu hình Nhà cung cấp, Model AI, Vòng xoay đa API Key, nút Test kết nối.
     - **`HỆ THỐNG | SYSTEM`**: Dọn Cache IndexedDB, Tốc độ cuộn & Giao diện bong bóng, Nhật ký Debug.

4. **Nói không với chữ rườm rà & Không lặp lại nội dung**:
   - Loại bỏ các đoạn văn bản giải thích dài dòng chiếm diện tích.
   - Thay thế bằng các huy hiệu (tag/pill) súc tích: `ONNX 14MB`, `WebGPU`, `Auto-Rotate`, `429 Shield`.
   - Tiêu đề song ngữ ngắn gọn, khỏe khoắn: `CHẾ ĐỘ | MODES`, `MÔ HÌNH | OCR ENGINE`, `DỊCH THUẬT | API SETUP`.

---

## 2. Danh Sách Công Việc (Task Breakdown)

### Task 1: Cài đặt thư viện Tabler Icons
- Cài đặt `@tabler/icons-webfont` qua npm.
- Cấu hình import font trong CSS và kiểm tra Vite build để font `.woff2` được copy cục bộ vào `dist/chrome` và `dist/firefox`.
- **Xác minh**: Chạy `npm run build:chrome` kiểm tra font có trong bundle.

### Task 2: Tái cấu trúc lại khung HTML `src/popup/popup.html`
- Header: Logo SpeedySlate với phong cách Typography đậm chất Manga/Brutalism + huy hiệu phiên bản đỏ.
- Thanh chuyển Tab kiểu "PANELS" (Modes, Engine, API, System) có icon Tabler tương ứng.
- Rút gọn toàn bộ nhãn form, bỏ các đoạn text giải thích thừa thãi.
- Giữ nguyên toàn bộ các `id` DOM quan trọng (`radio-mode-hybrid`, `provider-select`, `input-api-key`, `btn-save-settings`, v.v.) để giữ tính toàn vẹn 100% logic JavaScript.
- **Xác minh**: Các ID cần thiết cho `popup.ts` vẫn hiện diện đầy đủ.

### Task 3: Viết lại toàn bộ hệ thống Style `src/popup/popup.css`
- Áp dụng bộ biến CSS (Design Tokens) chuẩn tông Dark & Crimson Red:
  - `--bg-root: #0D0D11`, `--bg-card: #16161C`, `--accent-red: #E52E3D`, `--border-color: #26262E`.
- Thiết kế các Card & Tab theo phong cách phẳng, góc bo tinh tế (`6px`), hiệu ứng viền sáng nhẹ khi hover/active.
- Nút bấm `btn-primary` đỏ nổi bật với hiệu ứng nhấn vật lý.
- Input, Select, Textarea nền đen nhung, viền tinh giản, focus viền đỏ Crimson.
- **Xác minh**: Giao diện hiển thị sắc nét, đúng tỷ lệ popup extension tiêu chuẩn (380px x 560px).

### Task 4: Cập nhật `src/popup/popup.ts` và `src/popup/model-hub-controller.ts`
- Bổ sung logic chuyển tab mượt mà (chỉ hiển thị tab đang chọn).
- Cập nhật icon render động trong Model Hub Card sang Tabler Icons (`ti ti-download`, `ti ti-check`, `ti ti-trash`).
- Đảm bảo các file không vượt quá **500 dòng** theo quy tắc [AGENTS.md](file:///Users/nguyenkimquockhanh/Desktop/speedyslate/AGENTS.md).
- **Xác minh**: Chuyển tab hoạt động tốt, tải/chọn model hoạt động bình thường, lưu cài đặt mượt mà.

### Task 5: Kiểm tra và Đóng gói (Verification & Final Package)
- Chạy `npm run type-check` (đảm bảo TypeScript không có lỗi).
- Kiểm tra số dòng code của từng file trong dự án (`wc -l`), cam kết < 500 dòng/file.
- Chạy `npm run build:chrome` và `npm run build:firefox` + `npm run package:firefox`.
- Kiểm tra trực quan kết quả trên trình duyệt.
