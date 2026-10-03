# 🚀 Kế Hoạch & Tài Liệu Kỹ Thuật: SpeedySlate
*(Phiên Bản: Đa Luồng Tuần Tự Từ Trên Xuống Dưới + Cache URL Không Dịch Lại + Dọn DB Nhanh)*

> **Mục tiêu**: Extension dịch truyện siêu nhẹ (Ultra-lightweight) trên **Chrome** và **Firefox**, chuyên biệt cho webtoon dạng cuộn như **toonhey.com**.
> **Tuân thủ quy chuẩn**:
> - Clean Code & SOLID principles.
> - **1 file không quá 500 dòng** (Hiện tại tối đa 279 dòng).
> - Chuẩn duyệt **Mozilla Add-ons (AMO)**: Đóng gói wasm cục bộ, `gecko.id`, không remote code, `package:firefox` ra file `.zip`.

---

## 1. ⚡ Các Tính Năng Cốt Lõi Vừa Được Bổ Sung

### 1.1. Chức Năng "Dịch" & "Ngưng Dịch" Độc Lập
- Trên bảng điều khiển nổi HUD bổ sung nút bấm:
  - `[⚡ Đang dịch]` (màu xanh): Kích hoạt hàng đợi tự động quét ảnh và gọi dịch.
  - `[⏸ Ngưng dịch]` (màu xám): Tạm ngưng điều phối hàng đợi ngay lập tức khi người đọc muốn đọc chữ gốc hoặc tạm dừng gọi API.
- Tách biệt hoàn toàn với nút `[▶ Tự cuộn] / [⏸ Dừng cuộn]`.

### 1.2. Đính Kèm URL Ảnh Để Không Bao Giờ Dịch Lại (Translation Cache DB)
- **Cơ chế lưu trữ**: Sử dụng IndexedDB độc lập `SpeedySlate_Translation_Cache_DB` (riêng biệt với model OCR).
- **Khóa chính**: `imageUrl` + `chapterUrl`.
- **Luồng hoạt động**:
  - Khi một ảnh chuẩn bị được xử lý, extension kiểm tra URL ảnh trong IndexedDB trước.
  - **Nếu đã có cache**: Render hộp thoại đè lên DOM **ngay tức thì (0ms)**, hoàn toàn không tốn CPU chạy OCR và không gọi API.
  - **Nếu chưa có**: Chạy OCR trong Web Worker ➡️ Gọi API ➡️ Render hộp thoại ➡️ Tự động lưu bản dịch theo URL ảnh vào IndexedDB.

### 1.3. Dọn Dẹp DB Truyện Nhanh (Quick DB Clean)
- **Trên Popup cài đặt**: Bổ sung khu vực `Bộ Nhớ Cache Truyện (URL-Based)`:
  - Hiển thị số lượng trang truyện đã lưu cache (ví dụ: `48 ảnh trang truyện`).
  - Nút **[🧹 Dọn Dẹp Sạch Cache Truyện]**: 1-click xóa sạch toàn bộ bản dịch đã lưu để giải phóng bộ nhớ mà **hoàn toàn không ảnh hưởng đến Model OCR đã tải**.
- **Trên Thanh HUD nổi**: Nút `[🧹]` cho phép xóa nhanh cache của riêng chương truyện đang mở để dịch lại từ đầu.

### 1.4. Đa Luồng Đồng Thời Nhưng Đảm Bảo Đọc Từ Trên Xuống Dưới
- **Hàng đợi ưu tiên ([`OrderedTranslationQueue`](file:///home/khanhnkq/Codes/speedyslate/src/content/priority-queue.ts))**:
  - Gán chỉ số index (`0, 1, 2... N`) cho từng ảnh dựa vào thứ tự vị trí thực tế trên DOM từ trên xuống dưới.
  - Hàng đợi luôn sắp xếp ưu tiên theo `index ASC` (ảnh trên cùng luôn có độ ưu tiên cao nhất).
  - Cho phép chạy **2 luồng song song (Concurrency 2)** để tối ưu tốc độ mạng và Web Worker, nhưng các luồng luôn được cấp phát cho các ảnh trên cùng trước.

---

## 2. 📁 Cấu Trúc Mã Nguồn & Giới Hạn Dòng (Tối Đa 279 Dòng)

```
speedyslate/
├── AGENTS.md                  # Quy tắc Clean Code, SOLID & AMO (58 dòng)
├── GEMINI.md                  # Nạp rule tự động
├── manifest.chrome.json       # Manifest Chrome MV3
├── manifest.firefox.json      # Manifest Firefox MV3 (gecko.id: "speedyslate@khanhnkq.dev")
├── package.json
├── vite.config.ts             # Build song song Chrome/Firefox & bundle wasm
├── scripts/
│   ├── make-icons.cjs         # Tạo icons 16, 48, 128
│   └── package-firefox.py     # Đóng gói zip chuẩn nộp AMO
├── src/
│   ├── shared/
│   │   ├── types.ts           # 81 dòng
│   │   ├── presets.ts         # 177 dòng (Gemini 3.5, Groq GPT-OSS, Qwen, CDN OCR)
│   │   ├── storage.ts         # 67 dòng
│   │   ├── model-db.ts        # 261 dòng (IndexedDB OCR model on-demand)
│   │   └── translation-db.ts  # 147 dòng (IndexedDB lưu cache dịch theo URL)
│   ├── services/translation/
│   │   ├── translation-provider.interface.ts # 17 dòng
│   │   ├── gemini-provider.ts # 95 dòng
│   │   ├── openai-provider.ts # 103 dòng
│   │   └── provider-factory.ts# 30 dòng
│   ├── worker/
│   │   ├── image-utils.ts     # 111 dòng
│   │   ├── paddle-det.ts      # 207 dòng
│   │   ├── paddle-rec.ts      # 173 dòng
│   │   └── ocr.worker.ts      # 120 dòng (Web Worker ngầm)
│   ├── content/
│   │   ├── toonhey-adapter.ts # 59 dòng
│   │   ├── priority-queue.ts  # 86 dòng (Hàng đợi tuần tự đa luồng)
│   │   ├── scroller.ts        # 103 dòng (Auto-scroll & Spacebar)
│   │   ├── observer.ts        # 75 dòng (IntersectionObserver prefetch)
│   │   ├── overlay/
│   │   │   └── overlay-renderer.ts # 105 dòng (DOM Overlay & hover-peek)
│   │   ├── hud/
│   │   │   └── hud.ts         # 133 dòng (Floating HUD)
│   │   └── index.ts           # 279 dòng (Content orchestrator)
│   └── popup/
│       ├── popup.html         # 123 dòng
│       ├── popup.css          # 265 dòng
│       └── popup.ts           # 259 dòng
```

---

## 3. 🛠️ Lệnh Kiểm Thử & Đóng Gói Nộp AMO

```bash
# 1. Type-check (Đảm bảo 0 lỗi TypeScript):
npm run type-check

# 2. Build Chrome:
npm run build:chrome

# 3. Build Firefox & Đóng gói zip nộp Mozilla AMO:
npm run package:firefox
```
👉 File xuất ra sẵn sàng nộp trực tiếp lên Mozilla Add-ons: [`dist/speedyslate-firefox-amo.zip`](file:///home/khanhnkq/Codes/speedyslate/dist/speedyslate-firefox-amo.zip).
