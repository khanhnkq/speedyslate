# Plan: Cải thiện chất lượng OCR → Xóa text → Dịch

## Goal
Nâng độ chính xác nhận diện, làm sạch vùng xóa text (màu nền thật thay vì trắng/đen cứng), và tăng chất lượng bản dịch nhờ context phong phú hơn — không phá SRP, mỗi file < 500 dòng, tuân thủ AMO.

## Phân tích hiện trạng (đã đọc code)
- **Det**: `paddle-det.ts` (DBNet, thresh 0.10/0.15, unclip 1.65, merge ngang) + `comic-det.ts` (RT-DETR-v2, squash 640×640).
- **Rec**: `paddle-rec.ts` — chạy `session.run` **tuần tự từng box** (n box = n lần inference), crop 48px cao, không xử lý text nền tối (chữ trắng nền đen → rec yếu), không hỗ trợ text dọc CJK.
- **Xóa text**: `overlay-renderer.ts` vẽ 1 `div` màu `#fff`/`#111` phủ box aggregate → lệch màu với bubble kem/xám, và che luôn khoảng art giữa các dòng.
- **Dịch**: `translateDialogues(texts[])` batch theo ảnh, prompt tốt nhưng **không có** confidence/loại box (SFX vs dialogue), không glossary, không context chương.
- Docs context7: PP-OCRv4 rec input `[3,48,W]` dynamic, `det_db_unclip_ratio 1.6`, `rec_image_height 48`; ORT-Web hỗ trợ batched feeds + `preferredOutputLocation`.

## Tasks

### Phase 1 — Chất lượng OCR (`src/worker/`)
- [ ] **T1. Batch inference cho Rec**: gom crops theo bucket width (ví dụ 64/128/256/512/960), pad phải bằng px nền, 1 `session.run` mỗi batch (batch ≤ 8). `paddle-rec.ts` + `image-utils.ts` (`imageToRecTensorBatch`). → Verify: log thời gian rec toàn trang trước/sau, `npm run type-check`.
- [ ] **T2. Đảo màu crop nền tối**: khi `detectDarkBackground()` = true → invert RGB trước khi build tensor (rec model train trên chữ đen/nền sáng). `paddle-rec.ts`. → Verify: bubble nền đen manhwa đọc đúng text.
- [ ] **T3. Text dọc CJK**: box có `height/width > 1.6` → rotate crop 90°, chạy rec, giữ thứ tự đọc cột phải→trái. File mới `src/worker/vertical-text.ts` (SRP). → Verify: trang manga RAW cột dọc ra chữ.
- [ ] **T4. Tile ComicDet gần vuông**: slice cao tối đa ≈ `width * 1.6` thay vì squash 800×2000→640² (méo 3.1×). `strip-slicer.ts` (tham số `maxSliceHeight` động theo engine). → Verify: ít sót bubble ở strip dài.
- [ ] **T5. WASM threads theo CPU**: `ort.env.wasm.numThreads = min(4, hardwareConcurrency - 1)`. `ocr.worker.ts`. → Verify: fallback WASM nhanh hơn ~2×.
- [ ] **T6. Lưu `confidence` + `kind` (bubble/sfx/free) vào `DialogueItem`**: ComicDet label 1→`dialogue`, 2→`sfx`; PaddleDet → `dialogue`. `types.ts`, `paddle-rec.ts`, `comic-det.ts`. → Verify: type-check, debug log có field mới.

### Phase 2 — Xóa text & Overlay (`src/content/overlay/`)
- [ ] **T7. Sample màu nền thật**: trong `paddle-rec.ts` mở rộng `detectDarkBackground` → trả về `bgColor` (median RGB quanh viền box, file mới `src/worker/color-sampler.ts`); `DialogueItem.bgColor?: string`; `overlay-styler.ts` dùng `bgColor` khi `theme=auto`. → Verify: bubble kem hiển thị nền kem thay vì trắng.
- [ ] **T8. Xóa theo từng dòng**: `BubbleAggregator` lưu `lineBoxes: BoundingBox[]`; renderer vẽ patch xóa per-line (rounded rect, màu `bgColor`) + 1 lớp text → không che art giữa các dòng. `types.ts`, `bubble-aggregator.ts`, `overlay-renderer.ts`. → Verify: SFX/bubble trên nền vẽ không còn khối trắng lớn.

### Phase 3 — Dịch (`src/services/translation/`)
- [ ] **T9. Prompt giàu context**: method mới `translateDialoguesRich(items: DialogueItem[], ...)` truyền `{text, confidence, kind}`; LLM tự sửa low-confidence + bỏ qua `sfx` tùy setting `translateSfx`. File mới `prompt-builder.ts` (SRP, dùng chung Gemini/OpenAI). → Verify: SFX không bị dịch khi tắt; text low-conf được tự sửa.
- [ ] **T10. Glossary + rolling context**: `settings.glossary` (tên→cách dịch) + 5 cặp thoại gần nhất của chương làm context đại từ nhân xưng. `types.ts`, `storage.ts`, `prompt-builder.ts`, `translation-db.ts`. → Verify: tên nhân vật nhất quán giữa các trang.

### Phase 4 — Verify
- [ ] **T11.** `npm run type-check` + `npm run build:chrome` + `npm run build:firefox`; test tay 1 trang webtoon strip dài + 1 trang manga RAW.

## Done When
- Rec batch chạy ≥ 3× nhanh hơn; chữ nền đen & text dọc nhận diện đúng; overlay trùng màu bubble thật; SFX/glossary hoạt động theo setting; build 2 nền tảng pass.

## Notes / Rủi ro
- Kiểm tra dynamic batch dim của rec ONNX trước T1 (`session.inputNames` + probe run); nếu cố định → fallback bucket-crop concat không được, giữ sequential nhưng vẫn làm T2/T3.
- AMO: không fetch model/code từ xa lúc runtime (model đã qua ModelDB); PP-OCRv5 preset có thể thêm sau (độc lập plan này).
- Giữ `paddle-rec.ts` < 500 dòng: tách `color-sampler.ts`, `vertical-text.ts`, `batch-prep.ts` nếu cần.
