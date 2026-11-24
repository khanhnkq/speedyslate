import { DialogueItem, DialogueTranslateContext } from '../../shared/types';
import { DebugLogger } from '../../shared/debug-logger';
import { ITranslationProvider } from './translation-provider.interface';
import { ApiKeyRotator } from './api-key-rotator';
import { JsonExtractor } from './json-extractor';
import { VisionBoxParser } from './vision-box-parser';
import { PromptBuilder } from './prompt-builder';
import { KeyedJson, MAX_DIALOGUE_BATCH_SIZE } from './keyed-json';
import { OpenAIApiClient } from './openai-api-client';

export class OpenAIProvider implements ITranslationProvider {
  private baseUrl: string;
  private keyRotator: ApiKeyRotator;
  private model: string;
  public lastKeyIndex: number = 1;

  constructor(baseUrl: string, apiKey: string | string[], model: string) {
    this.baseUrl = baseUrl.trim().replace(/\/+$/, '');
    this.keyRotator = new ApiKeyRotator(apiKey);
    this.model = model.trim();
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

      const data = await OpenAIApiClient.postChatCompletion({
        baseUrl: this.baseUrl,
        model: this.model,
        messages: [
          { role: 'system', content: built.systemPrompt },
          { role: 'user', content: built.userPayload }
        ],
        keyRotator: this.keyRotator,
        jsonObjectMode: true,
        timeoutMs: 14000,
        temperature: 0.3,
        tag: 'OpenAI/Groq API',
        onSuccess: (idx) => {
          this.lastKeyIndex = idx;
        }
      });

      const content = data?.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('API không trả về kết quả choices[0].message.content.');
      }

      const parsedValues = KeyedJson.parseKeyedResponse(content, built.keys);
      finalOutputs.push(...PromptBuilder.remapResults(parsedValues, built.sendMap, chunkTexts));
    }

    return finalOutputs;
  }

  public async translateImage(
    base64Data: string,
    mimeType: string,
    targetLang: string,
    naturalWidth: number,
    naturalHeight: number,
    sourceLang?: string
  ): Promise<DialogueItem[]> {
    const srcDesc = (!sourceLang || sourceLang === 'auto') ? 'original language (auto-detect)' : sourceLang;
    const systemPrompt = `You are an expert manga, manhwa, and comic visual localization specialist.
Analyze the comic page image. Translate dialogues from ${srcDesc} into natural, expressive, emotionally fitting ${targetLang}.

TASK:
1. Detect all character speech bubbles, inner thought bubbles, and narrator text boxes.
2. For each detected dialogue:
   - Provide a 2D bounding box normalized to 0-1000 scale: [ymin, xmin, ymax, xmax] covering the speech bubble interior area (excluding tails). For vertical Asian text manga, ensure the bounding box covers the natural horizontal width of the bubble so horizontal translated text fits.
   - Transcribe original text and translate concisely into ${targetLang}.
   - Classify bubble background color style as "dark" or "light".

CRITICAL NEGATIVE CONSTRAINTS (STRICTLY FORBIDDEN):
- DO NOT TRANSLATE SOUND EFFECTS (SFX / onomatopoeia).
- DO NOT translate scanlation credits, website URLs, group plugs, or chapter/page numbers.

OUTPUT FORMAT:
Return ONLY a valid JSON object containing a "dialogues" array:
{"dialogues": [{"box_2d": [ymin, xmin, ymax, xmax], "original_text": "...", "translation": "...", "background": "light"}]}`;

    const data = await OpenAIApiClient.postChatCompletion({
      baseUrl: this.baseUrl,
      model: this.model,
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Detect all character speech bubbles and narrator boxes in this comic image. Translate into ${targetLang}. Never translate sound effects (SFX). Return JSON object.`
            },
            {
              type: 'image_url',
              image_url: { url: `data:${mimeType || 'image/jpeg'};base64,${base64Data}` }
            }
          ]
        }
      ],
      keyRotator: this.keyRotator,
      jsonObjectMode: true,
      timeoutMs: 24000,
      temperature: 0.2,
      tag: 'OpenAI/Vision API',
      onSuccess: (idx) => {
        this.lastKeyIndex = idx;
      }
    });

    const choice = data?.choices?.[0];
    const finishReason = choice?.finish_reason;

    if (finishReason === 'content_filter') {
      DebugLogger.warn('OpenAI/Vision API', 'Ảnh bị bộ lọc Vision từ chối xử lý.');
      throw new Error(
        'Bộ lọc Vision từ chối xử lý khung tranh này. Bạn có thể chuyển sang chế độ Hybrid OCR (quét chữ cục bộ bằng WebGPU) để dịch bình thường.'
      );
    }

    const content = choice?.message?.content;
    if (!content) {
      if (finishReason && finishReason !== 'stop') {
        throw new Error(`AI Vision không trả về nội dung (finish_reason: ${finishReason}).`);
      }
      return [];
    }

    try {
      const rawList = JsonExtractor.extractDialogueItems(content);
      return VisionBoxParser.parseItems(rawList, naturalWidth, naturalHeight);
    } catch (e: any) {
      DebugLogger.error('OpenAI Vision', `Lỗi parse JSON. Raw AI text: ${content.substring(0, 300)}`, e);
      throw new Error('Không thể phân tích dữ liệu tọa độ hộp thoại từ Vision API.');
    }
  }

  public async testConnection(): Promise<boolean> {
    const res = await this.translateDialogues(['Hello world'], 'Tiếng Việt');
    return Array.isArray(res) && res.length > 0;
  }
}
