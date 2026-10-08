import {
  CompanionSettings,
  CompanionConnectionStatus,
  CompanionPersonaId,
  CompanionVoiceName,
  CompanionLanguage
} from './companion-types';
import { CompanionBubble } from './companion-bubble';
import { CompanionChatView } from './companion-chat-view';
import { CompanionSocket } from './companion-socket';
import { CompanionAudioInput } from './companion-audio-input';
import { CompanionAudioOutput } from './companion-audio-output';
import { CompanionContextTracker } from './companion-context-tracker';
import { StorageService } from '../../shared/storage';

/**
 * Story Companion Master Controller
 * Orchestrates Bubble, Chat View, Audio Engine, Context Tracker, and Gemini Live WebSocket
 * Following SOLID principles: Facade & Dependency Inversion (DIP)
 */
export class CompanionController {
  private settings: CompanionSettings;
  private bubble: CompanionBubble;
  private chatView: CompanionChatView;
  private socket: CompanionSocket;
  private audioInput: CompanionAudioInput;
  private audioOutput: CompanionAudioOutput;
  private contextTracker: CompanionContextTracker;

  private isExpanded: boolean = false;
  private status: CompanionConnectionStatus = 'idle';
  private scrollDebounceTimer: any = null;

  constructor(settings: CompanionSettings) {
    this.settings = settings;

    // Restore persistent persona, voice and language
    try {
      const savedPersona = localStorage.getItem('speedyslate_companion_persona') as CompanionPersonaId;
      if (savedPersona) this.settings.persona = savedPersona;
      const savedVoice = localStorage.getItem('speedyslate_companion_voice') as CompanionVoiceName;
      if (savedVoice) this.settings.voiceName = savedVoice;
      const savedLang = localStorage.getItem('speedyslate_companion_lang') as CompanionLanguage;
      if (savedLang) this.settings.language = savedLang;
    } catch {}

    // 1. Audio Engine
    this.audioOutput = new CompanionAudioOutput({
      onPlaybackStarted: () => {
        this.setStatus('speaking');
      },
      onPlaybackEnded: () => {
        if (this.socket.isConnected()) {
          this.setStatus(this.audioInput.getIsRecording() && !this.audioInput.getIsMuted() ? 'listening' : 'connected');
        }
      },
      onVolumeChange: (vol) => {
        this.chatView.setAudioVolume(vol);
      }
    });

    this.audioInput = new CompanionAudioInput({
      onAudioChunk: (base64Pcm, volume) => {
        if (this.socket.isConnected()) {
          // If user starts speaking while model is speaking -> Trigger Instant Barge-in!
          if (this.audioOutput.getIsPlaying() && volume > 0.15) {
            this.handleBargeIn();
          }
          this.socket.sendAudioChunk(base64Pcm);
        }
      },
      onVolumeChange: (vol) => {
        if (!this.audioOutput.getIsPlaying()) {
          this.chatView.setAudioVolume(vol);
        }
      },
      onError: (err) => {
        console.warn('[CompanionController] Mic error:', err);
      }
    });

    // 2. Vision & Context Tracker
    this.contextTracker = new CompanionContextTracker();

    // 3. WebSocket Client
    this.socket = new CompanionSocket(this.settings, {
      onStatusChange: (newStatus) => {
        this.setStatus(newStatus);
        if (newStatus === 'connected' && this.settings.visionEnabled) {
          this.captureAndSendPanelContext();
        }
      },
      onAudioChunk: (base64Pcm) => {
        this.audioOutput.enqueueBase64Chunk(base64Pcm);
      },
      onTextChunk: (text, turnComplete) => {
        this.chatView.updateLastModelMessage(text, turnComplete);
      },
      onBargeIn: () => {
        this.handleBargeIn();
      },
      onError: (errorMsg) => {
        this.chatView.addMessage({
          id: `err-${Date.now()}`,
          role: 'system',
          text: `⚠️ ${errorMsg}`,
          timestamp: Date.now()
        });
      }
    });

    // 4. UI Elements: Bubble & Chat View
    this.bubble = new CompanionBubble({
      onToggleExpand: () => this.toggleExpand()
    });

    this.chatView = new CompanionChatView({
      onSendMessage: (text) => this.handleSendTextMessage(text),
      onToggleMic: () => this.toggleMic(),
      onToggleVision: () => this.toggleVision(),
      onSelectPersona: (personaId) => this.handleSelectPersona(personaId),
      onSelectVoice: (voice) => this.handleSelectVoice(voice),
      onSelectLanguage: (lang) => this.handleSelectLanguage(lang),
      onClose: () => this.setExpanded(false)
    });

    this.chatView.setVisionActive(this.settings.visionEnabled);
    if (this.settings.persona) this.chatView.setPersona(this.settings.persona);
    if (this.settings.voiceName) this.chatView.setVoice(this.settings.voiceName);
    if (this.settings.language) this.chatView.setLanguage(this.settings.language);
    this.setupScrollListener();
  }

  public handleSelectPersona(personaId: CompanionPersonaId): void {
    this.settings.persona = personaId;
    this.socket.updateSettings(this.settings, true);
    try {
      localStorage.setItem('speedyslate_companion_persona', personaId);
    } catch {}

    const names: Record<CompanionPersonaId, string> = {
      roleplay: '🎭 Nhập vai nhân vật trong truyện',
      waifu: '💖 Waifu cùng đọc',
      narrator: '🎙️ Người dẫn truyện điện ảnh'
    };
    this.chatView.addMessage({
      id: `persona-${Date.now()}`,
      role: 'system',
      text: `Đã kích hoạt chế độ: ${names[personaId] || personaId}!`,
      timestamp: Date.now()
    });
  }

  public handleSelectVoice(voice: CompanionVoiceName): void {
    this.settings.voiceName = voice;
    this.socket.updateSettings(this.settings, true);
    try {
      localStorage.setItem('speedyslate_companion_voice', voice);
    } catch {}
    this.chatView.addMessage({
      id: `voice-${Date.now()}`,
      role: 'system',
      text: `Đã đổi giọng đọc sang: ${voice}!`,
      timestamp: Date.now()
    });
  }

  public handleSelectLanguage(lang: CompanionLanguage): void {
    this.settings.language = lang;
    this.socket.updateSettings(this.settings, true);
    try {
      localStorage.setItem('speedyslate_companion_lang', lang);
    } catch {}
    const flags: Record<CompanionLanguage, string> = {
      vi: '🇻🇳 Tiếng Việt',
      en: '🇬🇧 English',
      ja: '🇯🇵 日本語 (Anime)',
      ko: '🇰🇷 한국어',
      zh: '🇨🇳 中文'
    };
    this.chatView.addMessage({
      id: `lang-${Date.now()}`,
      role: 'system',
      text: `Đã đổi ngôn ngữ thoại sang: ${flags[lang] || lang}!`,
      timestamp: Date.now()
    });
  }

  public updateSettings(settings: CompanionSettings): void {
    this.settings = settings;
    this.socket.updateSettings(settings);
    this.chatView.setVisionActive(settings.visionEnabled);
    if (settings.persona) this.chatView.setPersona(settings.persona);
    if (settings.voiceName) this.chatView.setVoice(settings.voiceName);
    if (settings.language) this.chatView.setLanguage(settings.language);
  }

  public toggleExpand(): void {
    this.setExpanded(!this.isExpanded);
  }

  public setExpanded(expanded: boolean): void {
    this.isExpanded = expanded;
    this.chatView.setVisible(expanded);

    // Auto connect when user opens the chat panel for the first time
    if (expanded && !this.socket.isConnected() && this.settings.apiKey) {
      this.connect();
    }
  }

  public async connect(): Promise<void> {
    this.socket.connect();
    try {
      await this.audioInput.start();
      this.chatView.setMicActive(true);
    } catch {
      // User may deny mic; text chat still works
      this.chatView.setMicActive(false);
    }
  }

  public disconnect(): void {
    this.audioOutput.flush();
    this.audioInput.stop();
    this.socket.disconnect();
    this.setStatus('idle');
  }

  public toggleMic(): void {
    const isMuted = this.audioInput.getIsMuted();
    const newMuted = !isMuted;
    this.audioInput.setMuted(newMuted);
    this.chatView.setMicActive(!newMuted);

    if (newMuted) {
      if (this.status === 'listening') {
        this.setStatus('connected');
      }
    } else {
      if (this.status === 'connected') {
        this.setStatus('listening');
      }
    }
  }

  public toggleVision(): void {
    this.settings.visionEnabled = !this.settings.visionEnabled;
    this.chatView.setVisionActive(this.settings.visionEnabled);

    if (this.settings.visionEnabled) {
      this.captureAndSendPanelContext();
    }
  }

  public async handleSendTextMessage(text: string): Promise<void> {
    // 1. Instant Barge-in: Stop playing previous audio
    this.handleBargeIn();

    // Check if user is configuring their API Key directly in chat
    const trimmed = text.trim();
    if (trimmed.startsWith('/key ') || (trimmed.startsWith('AIza') && trimmed.length > 30)) {
      const apiKey = trimmed.startsWith('/key ') ? trimmed.replace('/key ', '').trim() : trimmed;
      this.settings.apiKey = apiKey;
      this.socket.updateSettings(this.settings);
      try {
        StorageService.updateProviderConfig('gemini', { apiKey });
      } catch {}
      const rotator = this.socket.getKeyRotator();
      const countMsg = rotator.hasMultipleKeys ? ` (Đã nạp ${rotator.count} API Keys, kích hoạt Round-Robin Rotate)` : '';
      this.chatView.addMessage({
        id: `key-${Date.now()}`,
        role: 'system',
        text: `✅ Đã lưu Gemini API Key thành công!${countMsg} Đang kết nối tới Gemini 3.8 Live API...`,
        timestamp: Date.now()
      });
      this.connect();
      return;
    }

    // 2. Capture comic panel if vision enabled
    let snapshotThumb: string | undefined;
    if (this.settings.visionEnabled) {
      try {
        const capture = await this.contextTracker.captureActivePanelSnapshot(true);
        if (capture) {
          snapshotThumb = capture.dataUrl;
          this.socket.sendImageFrame(capture.base64Jpeg);
        }
      } catch (err) {
        console.warn('[CompanionController] Vision snapshot error:', err);
      }
    }

    // 3. Add to UI
    this.chatView.addMessage({
      id: `usr-${Date.now()}`,
      role: 'user',
      text,
      imageThumbnail: snapshotThumb,
      timestamp: Date.now()
    });

    // 4. Attach dialogue context if available on page
    const visibleDialogue = this.contextTracker.getVisibleTranslatedText();
    let promptToSend = text;
    if (visibleDialogue) {
      promptToSend = `[Lời thoại trang truyện đang xem:\n${visibleDialogue}]\nĐộc giả: ${text}`;
    }

    // 5. Send to WebSocket
    if (!this.socket.isConnected()) {
      await this.connect();
      // Retry sending after brief connection establishment
      setTimeout(() => {
        this.socket.sendTextMessage(promptToSend);
      }, 1200);
    } else {
      this.socket.sendTextMessage(promptToSend);
    }
  }

  public destroy(): void {
    this.disconnect();
    this.bubble.destroy();
    this.chatView.destroy();
    this.audioOutput.destroy();
    if (this.scrollDebounceTimer) {
      clearTimeout(this.scrollDebounceTimer);
    }
  }

  private handleBargeIn(): void {
    this.audioOutput.flush();
    if (this.status === 'speaking') {
      this.setStatus('listening');
    }
  }

  private setStatus(status: CompanionConnectionStatus): void {
    this.status = status;
    this.bubble.setStatus(status);

    const rotator = this.socket.getKeyRotator();
    let detailStatus: string | undefined;
    if (status === 'connected' && rotator.hasMultipleKeys) {
      const activeKey = this.socket.getActiveKey();
      const keyIdx = rotator.getKeyIndex(activeKey);
      detailStatus = `Trực tuyến • Key ${keyIdx}/${rotator.count}`;
    }

    this.chatView.setStatus(status, detailStatus);
  }

  private async captureAndSendPanelContext(): Promise<void> {
    if (!this.settings.visionEnabled || !this.socket.isConnected()) return;

    try {
      const capture = await this.contextTracker.captureActivePanelSnapshot(false);
      if (capture) {
        this.socket.sendImageFrame(capture.base64Jpeg);
        console.log('[CompanionController] Sent visible comic panel snapshot to Gemini Live');
      }
    } catch (err) {
      console.warn('[CompanionController] Failed to send panel context:', err);
    }
  }

  private setupScrollListener(): void {
    window.addEventListener('scroll', () => {
      if (!this.settings.visionEnabled || !this.settings.autoVisionOnScroll || !this.socket.isConnected()) {
        return;
      }

      if (this.scrollDebounceTimer) {
        clearTimeout(this.scrollDebounceTimer);
      }

      // Debounce: Capture new panel only after user settles on a page (1.8s)
      this.scrollDebounceTimer = setTimeout(() => {
        this.captureAndSendPanelContext();
      }, 1800);
    }, { passive: true });
  }
}
