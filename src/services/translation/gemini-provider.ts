import { DialogueItem, DialogueTranslateContext } from '../../shared/types';
import { ITranslationProvider } from './translation-provider.interface';
import { PromptBuilder } from './prompt-builder';
import { ApiKeyRotator } from './api-key-rotator';
import { DebugLogger } from '../../shared/debug-logger';
import { JsonExtractor } from './json-extractor';
import { VisionBoxParser } from './vision-box-parser';
import { AntigravityProvider } from './antigravity-provider';
import { GeminiApiClient } from './gemini-api-client';

export class GeminiProvider implements ITranslationProvider {
  private keyRotator: ApiKeyRotator;
  private model: string;
  private baseUrl: string;
  public lastKeyIndex: number = 1;

  constructor(apiKey: string | string[], model: string = 'gemini-3.5-flash-lite', baseUrl?: string) {
    this.keyRotator = new ApiKeyRotator(apiKey);
    this.model = model.trim() || 'gemini-3.5-flash-lite';
    this.baseUrl = (baseUrl || 'https://generativelanguage.googleapis.com/v1beta').replace(/\/+$/, '');
  }

  public get keyCount(): number {
    return this.keyRotator.count;
  }

  public async translateDialogues(
    texts: string[],
    targetLang: string,
    sourceLang?: string,
    ctx?: DialogueTranslateContext
  ): Promise<string[]> {
    if (!texts.length) return [];
    if (!this.keyRotator.hasKeys()) {
      throw new Error('Chưa cấu hình Gemini API Key. Vui lòng mở cài đặt extension.');
    }
    if (this.model.includes('antigravity')) {
      const antigravity = new AntigravityProvider(this.keyRotator.getRawKeys(), this.model, this.baseUrl);
      return antigravity.translateDialogues(texts, targetLang, sourceLang, ctx);
    }
    const rich = ctx?.items
      ? PromptBuilder.buildDialogue(
          PromptBuilder.itemsFrom(texts, ctx),
          targetLang,
          sourceLang,
          {
            glossaryPairs: PromptBuilder.parseGlossary(ctx.glossary),
            chapterContext: ctx.chapterContext,
            translateSfx: ctx.translateSfx
          }
        )
      : null;
    const systemPrompt =
      rich?.systemPrompt ??
      `You are an expert manga, manhwa, and comic translator.
Translate the provided JSON array of OCR-extracted dialogue lines from ${sourceLang && sourceLang !== 'auto' ? sourceLang : 'original comic language (auto-detect)'} into natural, contextual, expressive ${targetLang}.

RULES FOR COMIC TRANSLATION:
1. Translate dialogue, speech bubbles, inner monologues, and story narrations naturally, matching character emotion and comic context.
   - If an OCR text line has minor typos or missing spaces (e.g. "WHAT'S GONC" -> "WHAT'S GOING", "ON IN THEREP" -> "ON IN THERE?"), automatically correct it using context and translate accurately.
   - NEVER discard or omit valid character speech bubbles!
2. Brevity & Bubble Formatting:
   - Keep translations concise to fit inside comic bubbles.
   - For longer sentences, you may insert a single newline character (\\n) at natural phrasing pauses to balance text across lines.
3. FILTERING - ONLY OMIT TRUE JUNK & WATERMARKS:
   - Scanlation credits, website URLs (e.g. "toonhey.com", "asura"), chapter numbers, or non-dialogue graphic noise: return empty string (""). Do NOT omit real character dialogue.`;

    const requestBody = {
      system_instruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: [
        {
          parts: [{ text: rich ? rich.userPayload : JSON.stringify(texts) }]
        }
      ],
      generationConfig: {
        response_mime_type: 'application/json',
        response_schema: {
          type: 'ARRAY',
          items: { type: 'STRING' }
        },
        temperature: 0.2
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_CIVIC_INTEGRITY', threshold: 'BLOCK_NONE' }
      ]
    };

    const data = await GeminiApiClient.postGenerate({
      baseUrl: this.baseUrl,
      model: this.model,
      requestBody,
      keyRotator: this.keyRotator,
      timeoutMs: 12000,
      tag: 'Gemini API',
      onSuccess: (idx) => { this.lastKeyIndex = idx; }
    });
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error('Gemini API không trả về nội dung hợp lệ.');
    }

    const toStrings = (arr: any[]): string[] => {
      const strs = arr.map((item: any) => String(item ?? ''));
      return rich ? PromptBuilder.remapResults(strs, rich.sendMap, texts.length) : strs;
    };
    const parsed = JsonExtractor.safeParse<any>(candidateText, null);
    if (Array.isArray(parsed)) {
      return toStrings(parsed);
    }
    if (parsed && typeof parsed === 'object') {
      const expected = rich ? rich.sendMap.filter((i) => i >= 0).length : texts.length;
      const found = Object.values(parsed).find((v) => Array.isArray(v)) || Object.values(parsed);
      if (Array.isArray(found) && found.length === expected) {
        return toStrings(found as any[]);
      }
    }

    // Fallback: line-by-line parsing if json was completely broken
    const lines = candidateText.split('\n').filter((l: string) => l.trim().length > 0);
    if (lines.length === texts.length) {
      return lines;
    }

    throw new Error('Không thể phân tích định dạng JSON kết quả từ Gemini.');
  }

  /**
   * End-to-end Multimodal Vision AI translation:
   * Sends comic page image directly to Gemini Vision, detects speech bubbles + 2D bounding boxes,
   * translates dialogues with full visual context, and identifies background color (dark/light).
   * STRICT: Never translates sound effects (SFX / onomatopoeia).
   */
  public async translateImage(
    base64Data: string,
    mimeType: string,
    targetLang: string,
    naturalWidth: number,
    naturalHeight: number,
    sourceLang?: string
  ): Promise<DialogueItem[]> {
    if (!this.keyRotator.hasKeys()) {
      throw new Error('Chưa cấu hình Gemini API Key. Vui lòng mở cài đặt extension.');
    }
    if (this.model.includes('antigravity')) {
      const antigravity = new AntigravityProvider(this.keyRotator.getRawKeys(), this.model, this.baseUrl);
      return antigravity.translateImage(base64Data, mimeType, targetLang, naturalWidth, naturalHeight, sourceLang);
    }
    const systemPrompt = `You are an expert manga, manhwa, and comic visual localization specialist.
Analyze the comic page image.

TASK:
1. Detect all character speech dialogues, inner thoughts, and narrator text boxes.
   CRITICAL: Group all text sentences inside the SAME speech bubble into ONE single dialogue item. Never split a bubble into multiple items!
2. For each detected dialogue:
   - Provide a 2D bounding box normalized to 0-1000 scale: [ymin, xmin, ymax, xmax] encompassing all text lines of that dialogue inside the speech bubble (from top of first line to bottom of last line, spanning full width of all lines).
     STRICT BOUNDARIES: Must stay strictly INSIDE the speech bubble's drawn outline. NEVER extend into surrounding panels, drawing art, or white gutters below!
     For narrow vertical Asian text columns, you may widen horizontally to the bubble's inner borders so horizontal text fits, but NEVER cross the bubble border.
   - Transcribe original text.
   - Translate into natural, expressive, emotionally fitting ${targetLang}. Understand character gender, relationship, tone, and comic atmosphere from the visual drawings to pick proper pronouns.
     BREVITY: Keep translations concise and punchy to fit naturally inside comic speech bubbles. Avoid runaway phrasing.
   - Classify the bubble background color style:
     * "dark": speech bubble has black or dark background with white/light text.
     * "light": speech bubble has white or light background with dark/black text.

CRITICAL NEGATIVE CONSTRAINTS:
- NEVER translate sound effects (SFX / onomatopoeia like "BOOM", "SWOOSH", "RUSTLE", "HAAA..."). Ignore them completely!
- Never translate scanlation credits, website URLs (e.g. toonhey.com), group plugs, or chapter/page numbers.`;

    const requestBody = {
      system_instruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: [
        {
          parts: [
            {
              inline_data: {
                mime_type: mimeType || 'image/jpeg',
                data: base64Data
              }
            },
            {
              text: `Detect all character dialogue text in this comic image. Bounding box [ymin, xmin, ymax, xmax] must encompass all text lines of that bubble while staying strictly inside the speech bubble's drawn borders (normalized 0-1000, excluding tails and panel gutters). Translate concisely into ${targetLang}. Never translate sound effects (SFX). Return JSON array.`
            }
          ]
        }
      ],
      generationConfig: {
        response_mime_type: 'application/json',
        response_schema: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              box_2d: {
                type: 'ARRAY',
                items: { type: 'INTEGER' },
                description: '[ymin, xmin, ymax, xmax] bounding box covering all lines of text inside the speech bubble, normalized 0-1000'
              },
              original_text: { type: 'STRING' },
              translation: { type: 'STRING' },
              background: {
                type: 'STRING',
                enum: ['light', 'dark']
              }
            },
            required: ['box_2d', 'translation']
          }
        },
        temperature: 0.2
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_CIVIC_INTEGRITY', threshold: 'BLOCK_NONE' }
      ]
    };

    const data = await GeminiApiClient.postGenerate({
      baseUrl: this.baseUrl,
      model: this.model,
      requestBody,
      keyRotator: this.keyRotator,
      timeoutMs: 24000,
      tag: 'Gemini Vision API',
      onSuccess: (idx) => { this.lastKeyIndex = idx; }
    });
    const candidate = data?.candidates?.[0];
    const finishReason = candidate?.finishReason;
    const blockReason = data?.promptFeedback?.blockReason;

    // Detect Google Safety Filter block on sensitive/18+ content
    if (finishReason === 'SAFETY' || blockReason === 'SAFETY') {
      const reason = finishReason || blockReason;
      DebugLogger.warn('Gemini Vision', `Ảnh bị Google Safety Filter chặn (${reason}: nội dung nhạy cảm/18+).`);
      throw new Error(`Google Safety Filter chặn ảnh này (${reason}: ảnh nhạy cảm/18+). Bạn có thể đổi sang chế độ OCR Hybrid (quét cục bộ bằng WebGPU) để dịch không bị kiểm duyệt.`);
    }

    const candidateText = candidate?.content?.parts?.[0]?.text;
    if (!candidateText) {
      if (finishReason && finishReason !== 'STOP') {
        DebugLogger.warn('Gemini Vision', `Phản hồi rỗng với finishReason: ${finishReason}`);
        throw new Error(`Gemini không trả về văn bản (finishReason: ${finishReason}).`);
      }
      return [];
    }

    try {
      const rawList = JsonExtractor.extractDialogueItems(candidateText);
      return VisionBoxParser.parseItems(rawList, naturalWidth, naturalHeight);
    } catch (e: any) {
      DebugLogger.error('Gemini Vision', `Lỗi parse JSON. Raw AI text: ${candidateText.substring(0, 300)}`, e);
      throw new Error('Không thể phân tích dữ liệu tọa độ hộp thoại từ Gemini Vision.');
    }
  }

  public async testConnection(): Promise<boolean> {
    const testResult = await this.translateDialogues(['Hello, world!'], 'Tiếng Việt');
    return Array.isArray(testResult) && testResult.length > 0;
  }
}
