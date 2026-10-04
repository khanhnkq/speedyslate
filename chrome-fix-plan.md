# Kế Hoạch Sửa Lỗi Chrome Extension (SpeedySlate)

## 1. Mục Tiêu (Goal)
Khắc phục triệt để lỗi `[Content:OCR] Trang #1: Lỗi không xác định` và cảnh báo `VerifyEachNodeIsAssignedToAnEp` trên Chrome MV3 bằng cách chuẩn hóa Message Passing đa luồng (Service Worker ↔ Offscreen Document ↔ Content Script) theo quy chuẩn của skill `chrome-extensions`.

---

## 2. Nguyên Nhân Gốc Rễ (Root Cause Analysis)

### 🔴 Nguyên Nhân 1: Xung Đột Nhiều Listener `runtime.onMessage` (Message Collision)
- **Vấn đề**: Cả `src/offscreen/offscreen.ts` và `src/background/index.ts` đều đăng ký listener với `async (msg) => { ... }`.
- **Cơ chế lỗi**:
  - Trong Chrome MV3 và thư viện `webextension-polyfill`, một hàm `async` luôn trả về một `Promise` ngay lập tức (dù hàm chỉ chạy `if (notMe) return;` thì kết quả vẫn là `Promise.resolve(undefined)`).
  - Khi `content.js` gửi message `{ action: 'OCR_IMAGE' }`:
    - Cả Service Worker và Offscreen Document đều nhận được sự kiện.
    - Tại `offscreen.ts`, kiểm tra `msg?.target !== 'OFFSCREEN_OCR'` thấy không phải của mình nên thoát, nhưng do hàm là `async` nên nó trả về `Promise.resolve(undefined)`.
    - `webextension-polyfill` nhận thấy có Promise trả về liền báo với Chrome rằng "Listener này sẽ trả lời", và lập tức gọi `sendResponse(undefined)`.
    - Chrome đóng kênh message và gửi `undefined` về `content.js` chỉ sau <10ms!
    - Service Worker đang xử lý OCR chưa kịp xong thì kênh đã bị Offscreen đóng mất, dẫn đến `resp` ở `content.js` là `undefined` -> hiển thị lỗi `"Trang #1: Lỗi không xác định"`.
  - Tương tự, khi Background gửi `{ target: 'OFFSCREEN_OCR' }` sang Offscreen, Background listener cũng trả về `Promise.resolve(undefined)` gây nhiễu luồng.
- **Tiêu chuẩn `chrome-extensions` (Rule 5 & Message Passing)**:
  - Hàm listener `onMessage` phải là hàm **đồng bộ (synchronous)**:
    `chrome.runtime.onMessage.addListener((msg) => { if (!isMine) return; return handleAsync(msg); })`
  - Nếu message không thuộc về ngữ cảnh hiện tại, **BẮT BUỘC trả về `undefined` đồng bộ** (không trả về Promise) để Chrome bỏ qua listener này và chuyển quyền trả lời cho listener thực sự đang chờ.

---

### 🟡 Nguyên Nhân 2: ONNX Runtime C++ Verbose Warnings
- **Vấn đề**: `[W:onnxruntime:, session_state.cc:1397 VerifyEachNodeIsAssignedToAnEp] Some nodes were not assigned to the preferred execution providers...`
- **Cơ chế**: Đây là cảnh báo nội bộ bình thường của WebGPU khi ONNX chuyển các toán tử Shape sang CPU để tối ưu. Tuy nhiên `offscreen.html` in cảnh báo này ra console khiến Chrome Extensions Dashboard đánh dấu thành lỗi đỏ.
- **Giải pháp**: Thiết lập `ort.env.logLevel = 'error'` trong `src/worker/ocr.worker.ts` để chặn các thông báo verbose không cần thiết.

---

### 🟡 Nguyên Nhân 3: Thông Điệp Lỗi Trống ở Content Script
- **Vấn đề**: Khi `resp` trả về `undefined`, `resp?.error` là undefined khiến content script chỉ hiện chữ "Lỗi không xác định" chung chung.
- **Giải pháp**: Bổ sung fallback mô tả chính xác trạng thái kết nối nếu `resp` bị rỗng.

---

## 3. Các Nhiệm Vụ Cụ Thể (Actionable Tasks)

- [x] **Task 1: Chuẩn hóa Message Listener trong `src/offscreen/offscreen.ts`**
  - Đổi listener thành hàm đồng bộ `(msg) => { if (msg?.target !== 'OFFSCREEN_OCR') return; return handleOffscreenMessage(msg); }`.
  - Đảm bảo khi message không dành cho Offscreen, trả về `undefined` đồng bộ ngay lập tức (không trả về Promise).
  - *Kiểm tra*: File `< 500` dòng (216 dòng), không còn trả về Promise giả khi nhận message từ Content Script.

- [x] **Task 2: Chuẩn hóa Message Listener trong `src/background/index.ts`**
  - Tách logic xử lý sang `async function handleBackgroundMessage(msg)`.
  - Listener chính chuyển thành: `(rawMsg) => { if (rawMsg?.target === 'OFFSCREEN_OCR') return; return handleBackgroundMessage(rawMsg); }`.
  - *Kiểm tra*: File `< 500` dòng (269 dòng), Background không còn ngắt kênh của Offscreen.

- [x] **Task 3: Cấu hình `ort.env.logLevel` trong `src/worker/ocr.worker.ts`**
  - Đặt `ort.env.logLevel = 'error'` và `logSeverityLevel: 3` trong session options.
  - *Kiểm tra*: File 214 dòng. Chrome không còn bắt các log cảnh báo `VerifyEachNodeIsAssignedToAnEp` vào danh sách lỗi đỏ.

- [x] **Task 4: Tinh chỉnh Bắt Lỗi và Báo Cáo tại `src/content/index.ts`**
  - Bổ sung kiểm tra nếu `resp === undefined` thì báo `"Không nhận được phản hồi từ tiện ích nền (kênh đóng sớm hoặc Worker đang khởi tạo)"`.
  - *Kiểm tra*: File `< 500` dòng (457 dòng), thông điệp lỗi luôn chi tiết, không còn "Lỗi không xác định".

- [x] **Task 5: Biên dịch và Xác Minh (Build & Verify)**
  - Chạy `npm run build:chrome` và `npm run build:firefox` thành công 100%.
  - Kiểm tra `wc -l` toàn bộ file sửa đổi tuân thủ nghiêm ngặt quy tắc `< 500 dòng/file`.

---

## 4. Tiêu Chí Hoàn Thành (Done When)
- [x] Không còn lỗi `[Content:OCR] Trang #1: Lỗi không xác định` khi bấm dịch truyện trên trang web do đóng sớm kênh message.
- [x] Kênh message giữa Content Script và Background Service Worker hoạt động thông suốt, trả về đầy đủ mảng bounding boxes & bản dịch.
- [x] Cấu hình `ort.env.logLevel = 'error'` giúp giảm thiểu cảnh báo verbose C++ gán EP.
- [x] Cả 2 target `dist/chrome` và `dist/firefox` đều build thành công không lỗi TypeScript.
