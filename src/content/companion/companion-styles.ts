/**
 * Styles for Story Companion (Bubble & Chat Window)
 * Aesthetic: Minimalist Anime Glassmorphism & High-contrast Editorial
 * Strict Isolation: Enforces !important on critical layout and button styles to avoid host page CSS pollution.
 */
export class CompanionStyles {
  private static isInjected: boolean = false;

  public static inject(): void {
    if (this.isInjected || document.getElementById('speedyslate-companion-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'speedyslate-companion-styles';
    style.textContent = `
      /* --- Global Isolation Reset for Companion --- */
      #speedyslate-companion-chat,
      #speedyslate-companion-chat *,
      #speedyslate-companion-bubble,
      #speedyslate-companion-bubble * {
        box-sizing: border-box !important;
        -webkit-font-smoothing: antialiased;
        text-shadow: none !important;
      }

      #speedyslate-companion-chat button,
      #speedyslate-companion-bubble button {
        all: unset; box-sizing: border-box !important; cursor: pointer !important; user-select: none !important;
        margin: 0 !important; padding: 0 !important; line-height: 1 !important; font-family: inherit !important;
        text-transform: none !important; letter-spacing: normal !important; display: inline-flex !important;
        align-items: center !important; justify-content: center !important;
      }

      #speedyslate-companion-chat svg,
      #speedyslate-companion-bubble svg {
        display: block !important; visibility: visible !important; opacity: 1 !important; fill: none !important;
        stroke: currentColor !important; stroke-width: 2 !important; stroke-linecap: round !important;
        stroke-linejoin: round !important; flex-shrink: 0 !important; pointer-events: none !important;
      }

      /* --- Floating Bubble --- */
      #speedyslate-companion-bubble {
        position: fixed !important; width: 52px !important; height: 52px !important; min-width: 52px !important;
        min-height: 52px !important; border-radius: 50% !important; background: #0D0D11 !important;
        border: 1.5px solid #26262E !important;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.75), 0 0 16px rgba(168, 85, 247, 0.25) !important;
        z-index: 2147483646 !important; cursor: grab !important; user-select: none !important;
        display: flex !important; align-items: center !important; justify-content: center !important;
        touch-action: none !important;
        transition: transform 0.15s ease, box-shadow 0.2s ease, border-color 0.2s ease !important;
        padding: 0 !important; margin: 0 !important;
      }
      #speedyslate-companion-bubble:hover {
        transform: scale(1.08) !important; border-color: #A855F7 !important;
        box-shadow: 0 10px 36px rgba(0, 0, 0, 0.85), 0 0 24px rgba(168, 85, 247, 0.5) !important;
      }
      #speedyslate-companion-bubble:active { cursor: grabbing !important; transform: scale(0.96) !important; }
      .companion-bubble-icon {
        color: #F5F5F4 !important; display: flex !important; align-items: center !important;
        justify-content: center !important; pointer-events: none !important; width: 28px !important; height: 28px !important;
      }
      .companion-bubble-ring {
        position: absolute !important; inset: -4px !important; border-radius: 50% !important;
        border: 1.5px dashed transparent !important; pointer-events: none !important;
      }
      #speedyslate-companion-bubble.status-connected .companion-bubble-ring { border-color: #22C55E !important; animation: speedyslatePulse 3s infinite linear !important; }
      #speedyslate-companion-bubble.status-listening .companion-bubble-ring { border-color: #A855F7 !important; animation: speedyslateSpin 4s infinite linear !important; }
      #speedyslate-companion-bubble.status-speaking .companion-bubble-ring { border-color: #EC4899 !important; animation: speedyslateSpin 1.5s infinite linear !important; }
      #speedyslate-companion-bubble.status-connecting .companion-bubble-ring { border-color: #EAB308 !important; animation: speedyslateSpin 2s infinite linear !important; }
      #speedyslate-companion-bubble.status-error .companion-bubble-ring { border-color: #EF4444 !important; }

      /* --- Expanded Chat Window --- */
      #speedyslate-companion-chat {
        position: fixed !important;
        bottom: 84px !important;
        right: 24px !important;
        width: 350px !important;
        height: 480px !important;
        max-width: calc(100vw - 32px) !important;
        max-height: calc(100vh - 120px) !important;
        background: rgba(13, 13, 17, 0.95) !important;
        backdrop-filter: blur(20px) !important;
        -webkit-backdrop-filter: blur(20px) !important;
        border: 1px solid rgba(255, 255, 255, 0.12) !important;
        border-radius: 18px !important;
        box-shadow: 0 16px 48px rgba(0, 0, 0, 0.85), 0 0 24px rgba(168, 85, 247, 0.2) !important;
        z-index: 2147483647 !important;
        display: flex !important;
        flex-direction: column !important;
        overflow: hidden !important;
        font-family: 'Space Grotesk', 'Inter', system-ui, -apple-system, sans-serif !important;
        opacity: 0 !important;
        pointer-events: none !important;
        transform: translateY(12px) scale(0.96) !important;
        transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      #speedyslate-companion-chat.visible {
        opacity: 1 !important;
        pointer-events: auto !important;
        transform: translateY(0) scale(1) !important;
      }

      /* Header */
      .companion-chat-header {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        padding: 12px 14px !important;
        background: rgba(255, 255, 255, 0.03) !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06) !important;
        flex-shrink: 0 !important;
      }
      .companion-header-title {
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
      }
      .companion-sparkle-icon {
        color: #A855F7 !important;
        display: flex !important;
      }
      .companion-header-text strong {
        color: #FFFFFF !important;
        font-size: 13px !important;
        font-weight: 700 !important;
        display: block !important;
      }
      .companion-header-sub {
        color: #A1A1AA !important;
        font-size: 10px !important;
        font-weight: 500 !important;
      }
      .companion-header-actions {
        display: flex !important;
        align-items: center !important;
        gap: 6px !important;
      }
      .companion-hdr-btn {
        color: #A1A1AA !important;
        cursor: pointer !important;
        padding: 6px !important;
        border-radius: 6px !important;
        transition: color 0.15s, background 0.15s !important;
      }
      .companion-hdr-btn:hover {
        color: #FFFFFF !important;
        background: rgba(255, 255, 255, 0.08) !important;
      }
      .companion-hdr-btn.off {
        color: #71717A !important;
      }

      /* Status Bar */
      .companion-status-bar {
        display: flex !important;
        align-items: center !important;
        gap: 6px !important;
        padding: 6px 14px !important;
        background: rgba(0, 0, 0, 0.3) !important;
        font-size: 11px !important;
        color: #A1A1AA !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.04) !important;
        flex-shrink: 0 !important;
      }
      .companion-status-dot {
        width: 7px !important;
        height: 7px !important;
        border-radius: 50% !important;
        background: #71717A !important;
        flex-shrink: 0 !important;
      }
      .companion-status-dot.connected { background: #22C55E !important; }
      .companion-status-dot.connecting { background: #EAB308 !important; }
      .companion-status-dot.listening { background: #A855F7 !important; }
      .companion-status-dot.speaking { background: #EC4899 !important; }
      .companion-status-dot.error { background: #EF4444 !important; }

      /* Messages List */
      .companion-messages-scroll {
        flex: 1 1 0% !important;
        min-height: 0 !important;
        overflow-y: auto !important;
        padding: 12px !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 10px !important;
      }
      .companion-messages-scroll::-webkit-scrollbar {
        width: 4px !important;
      }
      .companion-messages-scroll::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.15) !important;
        border-radius: 4px !important;
      }
      .companion-msg-row {
        display: flex !important;
        flex-direction: column !important;
        max-width: 86% !important;
      }
      .companion-msg-row.user {
        align-self: flex-end !important;
      }
      .companion-msg-row.model {
        align-self: flex-start !important;
      }
      .msg-bubble {
        padding: 8px 12px !important;
        border-radius: 12px !important;
        font-size: 12px !important;
        line-height: 1.45 !important;
        word-break: break-word !important;
      }
      .companion-msg-row.user .msg-bubble {
        background: #27272A !important;
        color: #FFFFFF !important;
        border-bottom-right-radius: 2px !important;
      }
      .companion-msg-row.model .msg-bubble {
        background: rgba(168, 85, 247, 0.14) !important;
        border: 1px solid rgba(168, 85, 247, 0.28) !important;
        color: #F4F4F5 !important;
        border-bottom-left-radius: 2px !important;
      }
      .msg-thumb-box {
        margin-bottom: 4px !important;
        border-radius: 8px !important;
        overflow: hidden !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
      }
      .msg-thumb {
        width: 100% !important;
        max-height: 120px !important;
        object-fit: cover !important;
        display: block !important;
      }

      /* Persona Selector Bar */
      .companion-persona-bar {
        display: flex !important;
        gap: 4px !important;
        padding: 4px 12px 6px !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06) !important;
        flex-shrink: 0 !important;
      }
      .comp-persona-pill {
        flex: 1 !important;
        padding: 4px 6px !important;
        border-radius: 8px !important;
        font-size: 10px !important;
        font-weight: 600 !important;
        color: #A1A1AA !important;
        background: rgba(255, 255, 255, 0.04) !important;
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        cursor: pointer !important;
        transition: all 0.15s !important;
        text-align: center !important;
        white-space: nowrap !important;
      }
      .comp-persona-pill:hover { color: #FFFFFF !important; border-color: rgba(168, 85, 247, 0.4) !important; }
      .comp-persona-pill.active {
        color: #FFFFFF !important;
        background: rgba(168, 85, 247, 0.22) !important;
        border-color: #A855F7 !important;
        box-shadow: 0 0 8px rgba(168, 85, 247, 0.3) !important;
      }

      /* Settings Popover Dropdown */
      .companion-settings-popover {
        position: absolute !important;
        top: 48px !important;
        right: 12px !important;
        width: 250px !important;
        background: #18181B !important;
        border: 1px solid rgba(255, 255, 255, 0.15) !important;
        border-radius: 12px !important;
        padding: 12px !important;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8) !important;
        z-index: 100 !important;
        display: none !important;
        flex-direction: column !important;
        gap: 10px !important;
      }
      .companion-settings-popover.open { display: flex !important; }
      .comp-setting-row { display: flex !important; flex-direction: column !important; gap: 4px !important; }
      .comp-setting-label { font-size: 10px !important; font-weight: 600 !important; color: #A1A1AA !important; text-transform: uppercase !important; letter-spacing: 0.5px !important; }
      .comp-setting-select {
        background: #27272A !important;
        border: 1px solid rgba(255, 255, 255, 0.15) !important;
        color: #FFFFFF !important;
        padding: 6px 8px !important;
        border-radius: 6px !important;
        font-size: 11px !important;
        outline: none !important;
        cursor: pointer !important;
      }

      /* Quick Prompts Chips */
      .companion-quick-prompts {
        display: flex !important;
        gap: 6px !important;
        padding: 6px 12px !important;
        overflow-x: auto !important;
        scrollbar-width: none !important;
        flex-shrink: 0 !important;
      }
      .companion-quick-prompts::-webkit-scrollbar { display: none !important; }
      .comp-chip {
        white-space: nowrap !important;
        background: rgba(255, 255, 255, 0.06) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        color: #D4D4D8 !important;
        font-size: 11px !important;
        padding: 5px 10px !important;
        border-radius: 12px !important;
        cursor: pointer !important;
        transition: background 0.15s, border-color 0.15s !important;
      }
      .comp-chip:hover {
        background: rgba(168, 85, 247, 0.2) !important;
        border-color: #A855F7 !important;
        color: #FFFFFF !important;
      }

      /* Soundwave Visualizer Bar */
      .companion-soundwave-bar {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 4px !important;
        height: 14px !important;
        padding: 0 12px !important;
        opacity: 0.3 !important;
        transition: opacity 0.2s !important;
        flex-shrink: 0 !important;
      }
      .companion-soundwave-bar.active {
        opacity: 1 !important;
      }
      .companion-soundwave-bar span {
        width: 3px !important;
        height: 4px !important;
        background: #A855F7 !important;
        border-radius: 2px !important;
        transition: height 0.1s !important;
        display: block !important;
      }
      .companion-soundwave-bar.active span:nth-child(1) { animation: waveAnim 0.6s infinite 0.1s !important; }
      .companion-soundwave-bar.active span:nth-child(2) { animation: waveAnim 0.5s infinite 0.2s !important; }
      .companion-soundwave-bar.active span:nth-child(3) { animation: waveAnim 0.7s infinite 0.3s !important; }
      .companion-soundwave-bar.active span:nth-child(4) { animation: waveAnim 0.6s infinite 0.15s !important; }
      .companion-soundwave-bar.active span:nth-child(5) { animation: waveAnim 0.8s infinite 0.25s !important; }
      .companion-soundwave-bar.active span:nth-child(6) { animation: waveAnim 0.5s infinite 0.05s !important; }
      .companion-soundwave-bar.active span:nth-child(7) { animation: waveAnim 0.6s infinite 0.2s !important; }

      /* Input Bar (Fixed bottom layout) */
      .companion-input-bar {
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        padding: 8px 12px !important;
        background: rgba(255, 255, 255, 0.04) !important;
        border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
        flex-shrink: 0 !important;
        height: 52px !important;
        min-height: 52px !important;
        box-sizing: border-box !important;
      }

      /* Mic Button */
      .companion-mic-btn {
        width: 34px !important;
        height: 34px !important;
        min-width: 34px !important;
        min-height: 34px !important;
        max-width: 34px !important;
        max-height: 34px !important;
        border-radius: 50% !important;
        background: #27272A !important;
        border: 1px solid #3F3F46 !important;
        color: #A855F7 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
        flex-shrink: 0 !important;
        padding: 0 !important;
        margin: 0 !important;
        transition: background 0.15s, border-color 0.15s, color 0.15s !important;
      }
      .companion-mic-btn:hover {
        background: #3F3F46 !important;
        border-color: #A855F7 !important;
      }
      .companion-mic-btn.muted {
        color: #71717A !important;
        background: rgba(255, 255, 255, 0.05) !important;
        border-color: rgba(255, 255, 255, 0.1) !important;
      }

      /* Text Input */
      .companion-text-input {
        flex: 1 1 auto !important;
        width: 100% !important;
        height: 34px !important;
        min-height: 34px !important;
        max-height: 34px !important;
        background: rgba(0, 0, 0, 0.45) !important;
        border: 1px solid rgba(255, 255, 255, 0.14) !important;
        border-radius: 8px !important;
        padding: 0 10px !important;
        margin: 0 !important;
        color: #FFFFFF !important;
        font-size: 11px !important;
        line-height: 34px !important;
        outline: none !important;
        box-sizing: border-box !important;
        font-family: inherit !important;
        transition: border-color 0.15s !important;
      }
      .companion-text-input:focus {
        border-color: #A855F7 !important;
      }

      /* Send Button */
      .companion-send-btn {
        width: 34px !important;
        height: 34px !important;
        min-width: 34px !important;
        min-height: 34px !important;
        max-width: 34px !important;
        max-height: 34px !important;
        border-radius: 8px !important;
        background: #A855F7 !important;
        color: #FFFFFF !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
        flex-shrink: 0 !important;
        padding: 0 !important;
        margin: 0 !important;
        transition: background 0.15s, transform 0.1s !important;
      }
      .companion-send-btn:hover {
        background: #9333EA !important;
        transform: scale(1.04) !important;
      }
      .companion-send-btn:active {
        transform: scale(0.96) !important;
      }

      /* Animations */
      @keyframes waveAnim {
        0%, 100% { height: 4px; }
        50% { height: 14px; }
      }
      @keyframes speedyslateSpin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes speedyslatePulse {
        0%, 100% { opacity: 0.4; transform: scale(1); }
        50% { opacity: 0.9; transform: scale(1.06); }
      }
    `;
    (document.head || document.documentElement).appendChild(style);
    this.isInjected = true;
  }
}
