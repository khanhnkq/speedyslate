# SpeedySlate Project Guidelines

This file mirrors the rules in `AGENTS.md`:
- Clean Code & SOLID principles strictly applied.
- Maximum 500 lines per file (modular design).
- Dual build targets:
  - `dist/chrome`: MV3 with `service_worker`.
  - `dist/firefox`: MV3 with `background.scripts`, `browser_specific_settings.gecko.id`, no remote code, AMO compliant for store review.
- In-browser PaddleOCR ONNX running in Web Worker.
- Text translation API with presets (Gemini 3.5 Flash-Lite, Groq GPT-OSS 20B/120B, Qwen 27B, DeepSeek).
- Black/White DOM Overlay without inpainting.
