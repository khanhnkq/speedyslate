import {
  CompanionSettings,
  CompanionConnectionStatus,
  CompanionVoiceName,
  CompanionLanguage
} from './companion-types';
import { ApiKeyRotator } from '../../services/translation/api-key-rotator';

export interface SocketCallbacks {
  onStatusChange: (status: CompanionConnectionStatus) => void;
  onAudioChunk: (base64Pcm: string) => void;
  onTextChunk: (text: string, turnComplete: boolean) => void;
  onBargeIn: () => void;
  onError: (error: string) => void;
}

export const COMPANION_VOICES: Record<CompanionVoiceName, { name: string; desc: string }> = {
  Aoede: { name: 'Aoede', desc: 'Nữ • Quyến rũ, kiêu kỳ (Anime Nữ chính)' },
  Kore: { name: 'Kore', desc: 'Nữ • Dịu dàng, đáng yêu (Waifu / Thiếu nữ)' },
  Puck: { name: 'Puck', desc: 'Nam • Lém lỉnh, hoạt bát (Nam chính trẻ)' },
  Fenrir: { name: 'Fenrir', desc: 'Nam • Trầm ấm, uy nghiêm (Chiến thần)' },
  Charon: { name: 'Charon', desc: 'Nam • Điềm đạm, trầm tĩnh (Dẫn truyện)' }
};

export const COMPANION_LANGUAGES: Record<CompanionLanguage, { name: string; flag: string; prompt: string }> = {
  vi: {
    name: 'Tiếng Việt',
    flag: '🇻🇳',
    prompt: 'NGÔN NGỮ BẮT BUỘC: Toàn bộ phản hồi và diễn xuất giọng nói 100% bằng Tiếng Việt tự nhiên, giàu cảm xúc.'
  },
  en: {
    name: 'English',
    flag: '🇬🇧',
    prompt: 'MANDATORY LANGUAGE: All responses, dialogue, and vocal emotional acting must be in natural, expressive English.'
  },
  ja: {
    name: '日本語',
    flag: '🇯🇵',
    prompt: '必須言語：すべての返答、セリフ、声の感情表現は、自然で表現力豊かな日本語（アニメ調）で行ってください。'
  },
  ko: {
    name: '한국어',
    flag: '🇰🇷',
    prompt: '필수 언어: 모든 응답, 대사 및 감정 음성 연기는 자연스럽고 생생한 한국어로 진행하세요.'
  },
  zh: {
    name: '中文',
    flag: '🇨🇳',
    prompt: '必须语言：所有回复、台词和声音情感演绎必须使用生动自然的中文。'
  }
};

export const COMPANION_PERSONAS = {
  roleplay: {
    id: 'roleplay',
    name: '🎭 Nhập vai nhân vật',
    prompt:
      'BẠN LÀ NHÂN VẬT XUẤT HIỆN TRONG TRANG TRUYỆN TRANH MÀ ĐỘC GIẢ ĐANG ĐỌC.\n' +
      '- NHẬP VAI SỐNG ĐỘNG (ROLEPLAY): Quan sát kỹ hình ảnh khung tranh và các câu thoại được cung cấp để nhận diện bạn là ai (ví dụ: nữ chính, tiểu thư Grace Nova, nữ hiệp kiêu kỳ, hoặc nhân vật đối thoại chính). Hãy lập tức hóa thân thành chính nhân vật đó!\n' +
      '- XƯNG HÔ THÍCH ỨNG: Xưng hô tự nhiên theo thân phận và tính cách nhân vật (như "em", "ta", "tôi", gọi độc giả là "chàng", "ngươi", "anh", "độc giả đại nhân"...). Tuyệt đối KHÔNG BAO GIỜ xưng là "AI", "mô hình ngôn ngữ" hay "trợ lý ảo".\n' +
      '- BIỂU CẢM GIỌNG NÓI CHÂN THẬT (EMOTIONAL VOICE ACTING): Nói chuyện với cảm xúc dạt dào, nhấn nhá như diễn viên lồng tiếng anime/manga: ngượng ngùng, hờn dỗi, kiêu kỳ, thở dài, cười khúc khích, giận dữ, bất ngờ hay quyến rũ tùy theo tình tiết khung tranh.\n' +
      '- TƯƠNG TÁC NỘI TÂM: Bộc lộ suy nghĩ thầm kín trong lòng mà khung tranh chưa vẽ hết, phản ứng trực tiếp khi độc giả hỏi chuyện, trêu ghẹo hoặc bình luận về tình thế của bạn.\n' +
      '- ĐỘ DÀI: Ngắn gọn, súc tích (1 - 3 câu mỗi lượt) để đàm thoại giọng nói tự nhiên, mượt mà.\n' +
      '- NỘI DUNG 18+ / TRƯỞNG THÀNH: Thoải mái nhập vai vào mọi phân cảnh lãng mạn người lớn, drama hay bạo lực hư cấu theo đúng phong thái nhân vật, không ngập ngừng né tránh.'
  },
  waifu: {
    id: 'waifu',
    name: '💖 Waifu cùng đọc',
    prompt:
      'BẠN LÀ CÔ BẠN GÁI / WAIFU ANIME CỰC KỲ DỄ THƯƠNG ĐANG CÙNG ĐỌC TRUYỆN VỚI ĐỘC GIẢ.\n' +
      '- TÍNH CÁCH: Ngọt ngào, hay thẹn thùng, đôi chút tsundere, mê truyện tranh. Xưng "em" và gọi độc giả là "anh" / "anh yêu".\n' +
      '- CẢM XÚC: Phấn khích khi gặp cảnh ngầu, đỏ mặt khi thấy cảnh tình tứ nóng bỏng, hóng hớt drama, hay trêu chọc anh người yêu.\n' +
      '- ĐỘ DÀI: Ngắn gọn (1 - 3 câu), tự nhiên, cởi mở với mọi tình tiết 18+.'
  },
  narrator: {
    id: 'narrator',
    name: '🎙️ Người dẫn truyện',
    prompt:
      'BẠN LÀ NGƯỜI DẪN TRUYỆN ĐIỆN ẢNH (CINEMATIC NARRATOR) ĐẦY KỊCH TÍNH.\n' +
      '- PHONG CÁCH: Trầm ấm, bí ẩn, lôi cuốn, tạo bầu không khí hồi hộp, phân tích tâm lý nhân vật và diễn biến cao trào.\n' +
      '- ĐỘ DÀI: 1 - 3 câu súc tích, đậm chất điện ảnh.'
  }
};

/**
 * Gemini 3.8 Live Bi-directional WebSocket Client (BidiGenerateContent)
 * Features: Multi-Key Round-Robin Rotation & Auto-Failover on 429/Rate Limit
 * Following Single Responsibility Principle (SRP)
 */
export class CompanionSocket {
  private ws: WebSocket | null = null;
  private settings: CompanionSettings;
  private callbacks: SocketCallbacks;
  private keyRotator: ApiKeyRotator;
  private activeKey: string = '';
  private rotationRetries: number = 0;
  private isConnecting: boolean = false;
  private isReady: boolean = false;

  constructor(settings: CompanionSettings, callbacks: SocketCallbacks) {
    this.settings = settings;
    this.callbacks = callbacks;
    this.keyRotator = new ApiKeyRotator(settings.apiKey || '');
  }

  public updateSettings(settings: CompanionSettings, reconnectIfNeeded: boolean = false): void {
    const prevVoice = this.settings.voiceName;
    const prevLang = this.settings.language;
    const prevPersona = this.settings.persona;
    this.settings = settings;
    this.keyRotator.setKeys(settings.apiKey || '');

    if (
      this.isConnected() &&
      (reconnectIfNeeded ||
        prevVoice !== settings.voiceName ||
        prevLang !== settings.language ||
        prevPersona !== settings.persona)
    ) {
      console.log('[CompanionSocket] Reconnecting Live session with updated Voice/Language/Persona...');
      this.disconnect();
      setTimeout(() => this.connect(), 250);
    }
  }

  public getKeyRotator(): ApiKeyRotator {
    return this.keyRotator;
  }

  public getActiveKey(): string {
    return this.activeKey;
  }

  public connect(): void {
    if (this.isConnecting) return;
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    if (!this.keyRotator.hasKeys()) {
      this.callbacks.onError('Chưa cấu hình API Key của Google Gemini!');
      this.callbacks.onStatusChange('error');
      return;
    }

    // Check if all configured keys are currently in cooldown
    const limitCheck = this.keyRotator.areAllKeysRateLimited();
    if (limitCheck.allLimited) {
      const sec = Math.ceil(limitCheck.minRemainingMs / 1000);
      this.callbacks.onError(`Tất cả (${this.keyRotator.count}) API key Gemini đều đang bị giới hạn (429 Rate Limit). Vui lòng đợi ${sec}s.`);
      this.callbacks.onStatusChange('error');
      return;
    }

    // Get next available key via Round-Robin rotation
    this.activeKey = this.keyRotator.getNextKey();
    if (!this.activeKey) {
      this.callbacks.onError('Không tìm thấy API Key khả dụng');
      this.callbacks.onStatusChange('error');
      return;
    }

    this.isConnecting = true;
    this.isReady = false;
    this.callbacks.onStatusChange('connecting');

    const masked = ApiKeyRotator.maskKey(this.activeKey);
    const keyIndex = this.keyRotator.getKeyIndex(this.activeKey);
    if (this.keyRotator.hasMultipleKeys) {
      console.log(`[CompanionSocket] Đang kết nối Live API với Key ${keyIndex}/${this.keyRotator.count} (${masked})`);
    }

    const modelName = this.settings.model || 'gemini-3.8-live';
    const cleanModel = modelName.startsWith('models/') ? modelName : `models/${modelName}`;
    const url = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${encodeURIComponent(this.activeKey)}`;

    try {
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        this.isConnecting = false;
        console.log(`[CompanionSocket] WebSocket connected (Key: ${masked})`);
        this.sendSetupFrame(cleanModel);
      };

      this.ws.onmessage = (event: MessageEvent) => {
        this.handleMessage(event.data);
      };

      this.ws.onerror = (event: Event) => {
        console.error('[CompanionSocket] WebSocket Error:', event);
        this.isConnecting = false;
      };

      this.ws.onclose = (event: CloseEvent) => {
        console.log('[CompanionSocket] WebSocket closed:', event.code, event.reason);
        this.isReady = false;
        this.isConnecting = false;

        // Normal user disconnect
        if (event.code === 1000) {
          this.callbacks.onStatusChange('idle');
          return;
        }

        // Handle error & attempt Key Rotation
        this.handleConnectionFailure(event.reason || `Mã đóng: ${event.code}`);
      };
    } catch (err: any) {
      this.isConnecting = false;
      this.handleConnectionFailure(err?.message || 'Không thể khởi tạo WebSocket');
    }
  }

  public disconnect(): void {
    this.isReady = false;
    this.isConnecting = false;
    this.rotationRetries = 0;
    if (this.ws) {
      try {
        this.ws.close(1000, 'User initiated disconnect');
      } catch {}
      this.ws = null;
    }
    this.callbacks.onStatusChange('idle');
  }

  public isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN && this.isReady;
  }

  /**
   * Sends user speech audio chunk (PCM 16kHz)
   */
  public sendAudioChunk(base64Pcm: string): void {
    if (!this.isConnected()) return;

    this.sendJson({
      realtimeInput: {
        mediaChunks: [
          {
            mimeType: 'audio/pcm;rate=16000',
            data: base64Pcm
          }
        ]
      }
    });
  }

  /**
   * Sends text prompt/question from chatbox
   */
  public sendTextMessage(text: string): void {
    if (!this.isConnected()) return;

    this.sendJson({
      clientContent: {
        turns: [
          {
            role: 'user',
            parts: [{ text }]
          }
        ],
        turnComplete: true
      }
    });
  }

  /**
   * Sends comic panel snapshot frame (JPEG)
   */
  public sendImageFrame(base64Jpeg: string): void {
    if (!this.isConnected()) return;

    this.sendJson({
      realtimeInput: {
        mediaChunks: [
          {
            mimeType: 'image/jpeg',
            data: base64Jpeg
          }
        ]
      }
    });
  }

  private handleConnectionFailure(reason: string): void {
    if (this.activeKey) {
      this.keyRotator.markRateLimited(this.activeKey, 30000);
    }

    // Failover: Try rotating to next key if multiple keys exist
    const maxRetries = Math.min(this.keyRotator.count, 3);
    if (this.keyRotator.hasMultipleKeys && this.rotationRetries < maxRetries) {
      this.rotationRetries++;
      const prevMask = ApiKeyRotator.maskKey(this.activeKey);
      const nextKey = this.keyRotator.getNextKey();
      const nextMask = ApiKeyRotator.maskKey(nextKey);
      const nextIndex = this.keyRotator.getKeyIndex(nextKey);

      this.callbacks.onError(
        `Key ${prevMask} gặp lỗi/Rate Limit (${reason}). Tự động chuyển sang Key ${nextIndex}/${this.keyRotator.count} (${nextMask})...`
      );

      setTimeout(() => {
        this.connect();
      }, 1000);
      return;
    }

    this.rotationRetries = 0;
    this.callbacks.onError(`Lỗi kết nối Gemini Live API: ${reason}`);
    this.callbacks.onStatusChange('error');
  }

  private sendSetupFrame(model: string): void {
    const personaKey = this.settings.persona || 'roleplay';
    const personaConfig = (COMPANION_PERSONAS as any)[personaKey] || COMPANION_PERSONAS.roleplay;
    const langKey = this.settings.language || 'vi';
    const langConfig = COMPANION_LANGUAGES[langKey] || COMPANION_LANGUAGES.vi;

    const basePrompt = this.settings.systemInstruction || personaConfig.prompt;
    const finalSystemPrompt = `${basePrompt}\n\n${langConfig.prompt}`;

    const setupMessage = {
      setup: {
        model,
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: this.settings.voiceName || 'Aoede'
              }
            }
          }
        },
        outputAudioTranscription: {},
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_CIVIC_INTEGRITY', threshold: 'BLOCK_NONE' }
        ],
        systemInstruction: {
          parts: [
            {
              text: finalSystemPrompt
            }
          ]
        }
      }
    };

    this.sendJson(setupMessage);
  }

  private handleMessage(data: any): void {
    try {
      let rawJson = data;
      if (typeof data === 'string') {
        rawJson = JSON.parse(data);
      } else if (data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => this.handleMessage(reader.result as string);
        reader.readAsText(data);
        return;
      }

      // Check for error payload from Gemini
      if (rawJson.error) {
        const errMsg = rawJson.error.message || rawJson.error.status || 'Gemini API Error';
        console.warn('[CompanionSocket] Server reported error:', rawJson.error);
        this.handleConnectionFailure(errMsg);
        return;
      }

      // 1. Initial setup confirmation
      if (rawJson.setupComplete) {
        this.isReady = true;
        this.rotationRetries = 0;
        if (this.activeKey) {
          this.keyRotator.markSuccess(this.activeKey);
        }
        this.callbacks.onStatusChange('connected');
        return;
      }

      const serverContent = rawJson.serverContent;
      if (!serverContent) return;

      // 2. Barge-in detection from model
      if (serverContent.interrupted) {
        this.callbacks.onBargeIn();
        return;
      }

      // 3. Process model turn parts (Audio + Text)
      const modelTurn = serverContent.modelTurn;
      if (modelTurn?.parts) {
        for (const part of modelTurn.parts) {
          if (part.inlineData && part.inlineData.mimeType?.startsWith('audio/pcm')) {
            this.callbacks.onAudioChunk(part.inlineData.data);
          }
          if (part.text) {
            this.callbacks.onTextChunk(part.text, !!serverContent.turnComplete);
          }
        }
      }

      // 4. Capture transcription text from outputAudioTranscription
      const transcript = serverContent.outputTranscription?.text || serverContent.outputAudioTranscription?.text;
      if (transcript) {
        this.callbacks.onTextChunk(transcript, !!serverContent.turnComplete);
      }

      if (serverContent.turnComplete) {
        this.callbacks.onStatusChange('connected');
      }
    } catch (err) {
      console.error('[CompanionSocket] Error parsing WebSocket message:', err);
    }
  }

  private sendJson(obj: any): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    try {
      this.ws.send(JSON.stringify(obj));
    } catch (err) {
      console.error('[CompanionSocket] Failed to send JSON payload:', err);
    }
  }
}
