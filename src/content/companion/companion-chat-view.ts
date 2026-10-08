import {
  CompanionConnectionStatus,
  CompanionMessage,
  CompanionPersonaId,
  CompanionVoiceName,
  CompanionLanguage
} from './companion-types';
import { CompanionIcons } from './companion-icons';
import { CompanionStyles } from './companion-styles';

export interface ChatViewCallbacks {
  onSendMessage: (text: string) => void | Promise<void>;
  onToggleMic: () => void;
  onToggleVision: () => void;
  onSelectPersona?: (personaId: CompanionPersonaId) => void;
  onSelectVoice?: (voice: CompanionVoiceName) => void;
  onSelectLanguage?: (lang: CompanionLanguage) => void;
  onClose: () => void;
}

/**
 * Expanded Chat & Voice Companion Window
 * Aesthetic: Minimalist Glassmorphism Anime Editorial
 * Following Single Responsibility Principle (SRP)
 */
export class CompanionChatView {
  private el: HTMLElement;
  private messagesContainer: HTMLElement;
  private inputField: HTMLInputElement;
  private micBtn: HTMLButtonElement;
  private visionBtn: HTMLButtonElement;
  private settingsBtn: HTMLButtonElement;
  private settingsPopover: HTMLElement;
  private voiceSelect: HTMLSelectElement;
  private langSelect: HTMLSelectElement;
  private statusBadge: HTMLElement;
  private waveContainer: HTMLElement;
  private quickPromptsContainer: HTMLElement;
  private personaBar: HTMLElement;
  private callbacks: ChatViewCallbacks;
  private messages: CompanionMessage[] = [];
  private activePersona: CompanionPersonaId = 'roleplay';

  private personaChips: Record<CompanionPersonaId, Array<{ label: string; prompt: string }>> = {
    roleplay: [
      { label: 'Nàng nghĩ gì thế?', prompt: 'Nàng đang nghĩ gì trong đầu thế?' },
      { label: 'Cảm xúc của bạn?', prompt: 'Cảm xúc của bạn lúc này ra sao?' },
      { label: 'Bạn tính làm gì tiếp?', prompt: 'Bạn dự định sẽ làm gì tiếp theo?' },
      { label: 'Tóm tắt khung này', prompt: 'Khung tranh này đang diễn ra chuyện gì?' }
    ],
    waifu: [
      { label: 'Em thấy sao nè?', prompt: 'Em thấy đoạn này thế nào rồi?' },
      { label: 'Cảnh này nóng bỏng quá!', prompt: 'Cảnh này tình tứ và nóng bỏng quá em nhỉ!' },
      { label: 'Đoán tiếp đi em!', prompt: 'Em đoán xem chuyện gì sẽ xảy ra tiếp theo?' },
      { label: 'Tóm tắt khung này', prompt: 'Khung tranh này đang diễn ra chuyện gì?' }
    ],
    narrator: [
      { label: 'Tóm tắt khung này', prompt: 'Khung tranh này đang diễn ra chuyện gì?' },
      { label: 'Ai trong tranh?', prompt: 'Nhân vật trong tranh là ai thế?' },
      { label: 'Dự đoán tiếp', prompt: 'Dự đoán tình tiết tiếp theo đi bạn!' }
    ]
  };

  constructor(callbacks: ChatViewCallbacks) {
    this.callbacks = callbacks;
    CompanionStyles.inject();

    this.el = document.createElement('div');
    this.el.id = 'speedyslate-companion-chat';

    this.el.innerHTML = `
      <div class="companion-chat-header">
        <div class="companion-header-title">
          <span class="companion-sparkle-icon">${CompanionIcons.sparkles}</span>
          <div class="companion-header-text">
            <strong>Speedy Companion</strong>
            <span class="companion-header-sub">Gemini 3.8 Live</span>
          </div>
        </div>
        <div class="companion-header-actions">
          <button class="companion-hdr-btn" id="comp-settings-btn" title="Cài đặt giọng đọc & ngôn ngữ">
            ${CompanionIcons.settings}
          </button>
          <button class="companion-hdr-btn" id="comp-vision-toggle" title="Bật/Tắt quan sát khung truyện">
            ${CompanionIcons.eyeOn}
          </button>
          <button class="companion-hdr-btn" id="comp-close-btn" title="Thu nhỏ về bong bóng">
            ${CompanionIcons.close}
          </button>
        </div>
      </div>

      <!-- Settings Dropdown Popover -->
      <div class="companion-settings-popover" id="comp-settings-popover">
        <div class="comp-setting-row">
          <span class="comp-setting-label">Giọng đọc (Voice)</span>
          <select class="comp-setting-select" id="comp-voice-select">
            <option value="Aoede">Aoede (Nữ • Quyến rũ, kiêu kỳ)</option>
            <option value="Kore">Kore (Nữ • Dịu dàng, đáng yêu)</option>
            <option value="Puck">Puck (Nam • Hoạt bát, lém lỉnh)</option>
            <option value="Fenrir">Fenrir (Nam • Trầm ấm, uy nghiêm)</option>
            <option value="Charon">Charon (Nam • Điềm đạm, trầm tĩnh)</option>
          </select>
        </div>
        <div class="comp-setting-row">
          <span class="comp-setting-label">Ngôn ngữ đàm thoại</span>
          <select class="comp-setting-select" id="comp-lang-select">
            <option value="vi">🇻🇳 Tiếng Việt</option>
            <option value="en">🇬🇧 English</option>
            <option value="ja">🇯🇵 日本語 (Anime)</option>
            <option value="ko">🇰🇷 한국어</option>
            <option value="zh">🇨🇳 中文</option>
          </select>
        </div>
      </div>

      <div class="companion-status-bar">
        <span class="companion-status-dot"></span>
        <span class="companion-status-text">Đang kết nối...</span>
      </div>

      <!-- Persona Selector Bar -->
      <div class="companion-persona-bar" id="comp-persona-bar">
        <button class="comp-persona-pill active" data-persona="roleplay">🎭 Nhập vai</button>
        <button class="comp-persona-pill" data-persona="waifu">💖 Waifu</button>
        <button class="comp-persona-pill" data-persona="narrator">🎙️ Dẫn truyện</button>
      </div>

      <div class="companion-messages-scroll" id="comp-messages-list"></div>

      <div class="companion-quick-prompts" id="comp-quick-chips"></div>

      <div class="companion-soundwave-bar" id="comp-wave-bar">
        <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
      </div>

      <div class="companion-input-bar">
        <button class="companion-mic-btn" id="comp-mic-btn" aria-label="Bật/Tắt Mic">
          ${CompanionIcons.micOn}
        </button>
        <input 
          type="text" 
          class="companion-text-input" 
          id="comp-text-input" 
          placeholder="Hỏi về cốt truyện, nhân vật... (Enter)"
        />
        <button class="companion-send-btn" id="comp-send-btn" aria-label="Gửi tin nhắn">
          ${CompanionIcons.send}
        </button>
      </div>
    `;

    this.messagesContainer = this.el.querySelector('#comp-messages-list')!;
    this.inputField = this.el.querySelector('#comp-text-input')!;
    this.micBtn = this.el.querySelector('#comp-mic-btn')!;
    this.visionBtn = this.el.querySelector('#comp-vision-toggle')!;
    this.settingsBtn = this.el.querySelector('#comp-settings-btn')!;
    this.settingsPopover = this.el.querySelector('#comp-settings-popover')!;
    this.voiceSelect = this.el.querySelector('#comp-voice-select')!;
    this.langSelect = this.el.querySelector('#comp-lang-select')!;
    this.statusBadge = this.el.querySelector('.companion-status-text')!;
    this.waveContainer = this.el.querySelector('#comp-wave-bar')!;
    this.quickPromptsContainer = this.el.querySelector('#comp-quick-chips')!;
    this.personaBar = this.el.querySelector('#comp-persona-bar')!;

    this.setupEvents();
    this.renderQuickChips();
    this.renderWelcome();
    document.body.appendChild(this.el);
  }

  public setVisible(visible: boolean): void {
    if (visible) {
      this.el.classList.add('visible');
      setTimeout(() => this.inputField.focus(), 150);
      this.scrollToBottom();
    } else {
      this.el.classList.remove('visible');
    }
  }

  public setStatus(status: CompanionConnectionStatus, customText?: string): void {
    const dot = this.el.querySelector('.companion-status-dot');
    dot?.classList.remove('idle', 'connecting', 'connected', 'listening', 'speaking', 'error');
    dot?.classList.add(status);

    const statusTexts: Record<CompanionConnectionStatus, string> = {
      idle: 'Sẵn sàng kết nối',
      connecting: 'Đang kết nối Live API...',
      connected: 'Trực tuyến • Sẵn sàng',
      listening: 'Đang lắng nghe bạn nói...',
      speaking: 'Speedy đang phản hồi...',
      error: 'Lỗi kết nối API'
    };
    this.statusBadge.textContent = customText || statusTexts[status] || status;

    if (status === 'speaking' || status === 'listening') {
      this.waveContainer.classList.add('active');
    } else {
      this.waveContainer.classList.remove('active');
    }
  }

  public setAudioVolume(volume: number): void {
    if (volume > 0.05) {
      this.waveContainer.classList.add('active');
    } else {
      this.waveContainer.classList.remove('active');
    }
  }

  public addMessage(msg: CompanionMessage): void {
    this.messages.push(msg);
    this.renderMessage(msg);
    this.scrollToBottom();
  }

  public updateLastModelMessage(chunk: string, turnComplete: boolean): void {
    const lastMsg = this.messages[this.messages.length - 1];
    if (lastMsg && lastMsg.role === 'model' && lastMsg.isPartial) {
      lastMsg.text += chunk;
      lastMsg.isPartial = !turnComplete;
      
      const lastEl = this.messagesContainer.lastElementChild?.querySelector('.msg-bubble');
      if (lastEl) {
        lastEl.textContent = lastMsg.text;
      }
    } else {
      this.addMessage({
        id: `msg-${Date.now()}`,
        role: 'model',
        text: chunk,
        isPartial: !turnComplete,
        timestamp: Date.now()
      });
    }
    this.scrollToBottom();
  }

  public setMicActive(active: boolean): void {
    this.micBtn.innerHTML = active ? CompanionIcons.micOn : CompanionIcons.micOff;
    this.micBtn.classList.toggle('muted', !active);
  }

  public setVisionActive(active: boolean): void {
    this.visionBtn.innerHTML = active ? CompanionIcons.eyeOn : CompanionIcons.eyeOff;
    this.visionBtn.classList.toggle('off', !active);
    this.visionBtn.title = active ? 'AI đang quan sát khung truyện (Bật)' : 'AI không quan sát khung truyện (Tắt)';
  }

  public setPersona(personaId: CompanionPersonaId): void {
    this.activePersona = personaId;
    const pills = this.personaBar.querySelectorAll('.comp-persona-pill');
    pills.forEach((p) => {
      p.classList.toggle('active', p.getAttribute('data-persona') === personaId);
    });
    this.renderQuickChips();
  }

  public setVoice(voice: CompanionVoiceName): void {
    this.voiceSelect.value = voice;
  }

  public setLanguage(lang: CompanionLanguage): void {
    this.langSelect.value = lang;
  }

  public destroy(): void {
    this.el.remove();
  }

  private renderQuickChips(): void {
    const chips = this.personaChips[this.activePersona] || this.personaChips.roleplay;
    this.quickPromptsContainer.innerHTML = chips
      .map((c) => `<button class="comp-chip" data-prompt="${this.escapeHtml(c.prompt)}">${this.escapeHtml(c.label)}</button>`)
      .join('');

    const btnElements = this.quickPromptsContainer.querySelectorAll('.comp-chip');
    btnElements.forEach((btn) => {
      btn.addEventListener('click', () => {
        const prompt = btn.getAttribute('data-prompt');
        if (prompt) {
          this.callbacks.onSendMessage(prompt);
        }
      });
    });
  }

  private renderWelcome(): void {
    this.addMessage({
      id: 'welcome',
      role: 'model',
      text: 'Chào bạn! Mình đã sẵn sàng nhập vai và đồng hành cùng bạn trên từng trang truyện tranh. Hãy chọn vai diễn, bật mic hoặc gõ tin nhắn để bắt đầu nhé!',
      timestamp: Date.now()
    });
  }

  private renderMessage(msg: CompanionMessage): void {
    const wrapper = document.createElement('div');
    wrapper.className = `companion-msg-row ${msg.role}`;

    let thumbHtml = '';
    if (msg.imageThumbnail) {
      thumbHtml = `<div class="msg-thumb-box"><img src="${msg.imageThumbnail}" class="msg-thumb" /></div>`;
    }

    wrapper.innerHTML = `
      ${thumbHtml}
      <div class="msg-bubble">${this.escapeHtml(msg.text)}</div>
    `;
    this.messagesContainer.appendChild(wrapper);
  }

  private setupEvents(): void {
    const closeBtn = this.el.querySelector('#comp-close-btn');
    closeBtn?.addEventListener('click', () => this.callbacks.onClose());

    this.visionBtn.addEventListener('click', () => this.callbacks.onToggleVision());
    this.micBtn.addEventListener('click', () => this.callbacks.onToggleMic());

    // Settings popover toggle
    this.settingsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.settingsPopover.classList.toggle('open');
    });

    this.messagesContainer.addEventListener('click', () => {
      this.settingsPopover.classList.remove('open');
    });

    // Voice & Language selection
    this.voiceSelect.addEventListener('change', () => {
      const voice = this.voiceSelect.value as CompanionVoiceName;
      this.callbacks.onSelectVoice?.(voice);
    });

    this.langSelect.addEventListener('change', () => {
      const lang = this.langSelect.value as CompanionLanguage;
      this.callbacks.onSelectLanguage?.(lang);
    });

    // Persona Pills selection
    const personaPills = this.personaBar.querySelectorAll('.comp-persona-pill');
    personaPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        const id = pill.getAttribute('data-persona') as CompanionPersonaId;
        if (id && id !== this.activePersona) {
          this.setPersona(id);
          this.callbacks.onSelectPersona?.(id);
        }
      });
    });

    const sendBtn = this.el.querySelector('#comp-send-btn');
    sendBtn?.addEventListener('click', () => this.handleSend());

    this.inputField.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.handleSend();
      }
    });
  }

  private handleSend(): void {
    const text = this.inputField.value.trim();
    if (!text) return;
    this.inputField.value = '';
    this.callbacks.onSendMessage(text);
  }

  private scrollToBottom(): void {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
