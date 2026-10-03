# 🚀 SpeedySlate - Manga/Webtoon Auto-Translate Extension (Chrome & Firefox)
*(Cập Nhật Presets: Gemini 3.5 Flash-Lite, Groq GPT-OSS 20B/120B & Qwen 27B)*

Tài liệu kế hoạch chi tiết, kiến trúc và lộ trình triển khai đã được cập nhật tại:
👉 [Xem file PLAN.md trong Artifact](/home/khanhnkq/.gemini/antigravity-cli/brain/225a5220-e7ca-40df-85d8-4633c3ccb35a/PLAN.md)

## Danh Mục Presets Cập Nhật Mới Nhất

### 1. Google Gemini:
- **`gemini-3.5-flash-lite`** *(Khuyên dùng)*: Tối ưu chi phí cực hạn, độ trễ cực thấp, chuyên biệt cho dịch hội thoại nhanh.
- **`gemini-3.8-flash`**: Model cờ đầu xử lý ngữ cảnh sâu và suy luận mạnh.
- `gemini-2.5-flash` / `gemini-2.0-flash`.

### 2. Groq (`https://api.groq.com/openai/v1`):
- **`openai/gpt-oss-20b`**: Model 20B mã nguồn mở thế hệ mới của OpenAI trên hạ tầng siêu tốc Groq, siêu nhanh và chi phí thấp.
- **`openai/gpt-oss-120b`**: Model 120B mạnh mẽ cho dịch thuật chuẩn văn phong và biểu cảm.
- **`qwen/qwen3.8-27b`**: Dòng Qwen hỗ trợ đa ngôn ngữ và suy luận vượt trội.
- `llama-3.3-70b-versatile`.

### 3. Các Nhà Cung Cấp Khác:
- DeepSeek: `deepseek-chat` (V3), `deepseek-reasoner`
- OpenRouter: `openai/gpt-oss-120b`, `google/gemini-2.0-flash-001`, `deepseek/deepseek-chat`
- Ollama Local: `openai/gpt-oss-20b`, `qwen2.5:7b`
- Custom: Tự do nhập URL và Model.

### 4. PaddleOCR Presets:
- **PaddleOCR English Slim** (~7MB): HuggingFace CDN trực tiếp (`ch_PP-OCRv4_det.onnx` + `en_PP-OCRv3_rec.onnx`).
- **PaddleOCR Multilingual** (~13MB): Hỗ trợ bản RAW đa ngôn ngữ.
