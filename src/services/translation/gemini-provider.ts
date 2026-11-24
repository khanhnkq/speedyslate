import { DialogueItem, DialogueTranslateContext } from '../../shared/types';
import { ITranslationProvider } from './translation-provider.interface';
import { PromptBuilder } from './prompt-builder';
import { KeyedJson, MAX_DIALOGUE_BATCH_SIZE } from './keyed-json';
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

    const allPromptItems = PromptBuilder.itemsFrom(texts, ctx);
    const glossaryPairs = PromptBuilder.parseGlossary(ctx?.glossary);
    const itemChunks = KeyedJson.chunkArray(allPromptItems, MAX_DIALOGUE_BATCH_SIZE);
    const textChunks = KeyedJson.chunkArray(texts, MAX_DIALOGUE_BATCH_SIZE);
    const finalOutputs: string[] = [];

    for (let c = 0; c < itemChunks.length; c++) {
      const chunkTexts = textChunks[c];
      const built = PromptBuilder.buildDialogue(itemChunks[c], targetLang, sourceLang, {
        glossaryPairs,
        chapterContext: ctx?.chapterContext,
        translateSfx: ctx?.translateSfx
      });

      if (built.keys.length === 0) {
        finalOutputs.push(...PromptBuilder.remapResults([], built.sendMap, chunkTexts));
        continue;
      }

      const requestBody = {
        system_instruction: {
          parts: [{ text: built.systemPrompt }]
        },
        contents: [
          {
            parts: [{ text: built.userPayload }]
          }
        ],
        generationConfig: {
          response_mime_type: 'application/json',
          response_schema: KeyedJson.buildGeminiObjectSchema(built.keys),
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
        onSuccess: (idx) => {
          this.lastKeyIndex = idx;
        }
      });
      const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!candidateText) {
        throw new Error('Gemini API không trả về nội dung hợp lệ.');
      }

      const parsedValues = KeyedJson.parseKeyedResponse(candidateText, built.keys);
      finalOutputs.push(...PromptBuilder.remapResults(parsedValues, built.sendMap, chunkTexts));
    }

    return finalOutputs;
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
- Never translate scanlation credits, website URLs (e.g. manga-scans.org), group plugs, or chapter/page numbers.`;

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

    // Detect Vision API content filter block (e.g. intense action/battle artwork)
    if (finishReason === 'SAFETY' || blockReason === 'SAFETY') {
      const reason = finishReason || blockReason;
      DebugLogger.warn('Gemini Vision', `Ảnh bị bộ lọc Vision từ chối xử lý (${reason}).`);
      throw new Error(`Bộ lọc Vision từ chối xử lý khung tranh này (${reason}). Bạn có thể chuyển sang chế độ Hybrid OCR (quét chữ cục bộ bằng WebGPU) để dịch bình thường.`);
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
