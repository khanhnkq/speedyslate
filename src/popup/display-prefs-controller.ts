import { BubbleTheme, ExtensionSettings } from '../shared/types';

/**
 * Binds the display/translation preference controls (theme, scroll speed,
 * provider rotation, glossary, SFX toggle) to ExtensionSettings.
 * SRP: keeps popup.ts focused on provider/API wiring.
 */
export class DisplayPrefsController {
  private themeSelect = document.getElementById('select-theme') as HTMLSelectElement;
  private speedInput = document.getElementById('input-speed') as HTMLInputElement;
  public readonly rotateToggle = document.getElementById('toggle-rotate-providers') as HTMLInputElement;
  private glossaryInput = document.getElementById('input-glossary') as HTMLTextAreaElement;
  private sfxToggle = document.getElementById('toggle-translate-sfx') as HTMLInputElement;

  public load(settings: ExtensionSettings): void {
    this.themeSelect.value = settings.bubbleTheme;
    this.speedInput.value = String(settings.autoScrollSpeed);
    if (this.rotateToggle) {
      this.rotateToggle.checked = settings.rotateProviders ?? true;
    }
    if (this.glossaryInput) {
      this.glossaryInput.value = settings.glossary || '';
    }
    if (this.sfxToggle) {
      this.sfxToggle.checked = settings.translateSfx ?? false;
    }
  }

  public applyTo(settings: ExtensionSettings): void {
    settings.bubbleTheme = this.themeSelect.value as BubbleTheme;
    settings.autoScrollSpeed = Number(this.speedInput.value) || 3;
    if (this.rotateToggle) {
      settings.rotateProviders = this.rotateToggle.checked;
    }
    if (this.glossaryInput) {
      settings.glossary = this.glossaryInput.value;
    }
    if (this.sfxToggle) {
      settings.translateSfx = this.sfxToggle.checked;
    }
  }
}
