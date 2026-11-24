/**
 * Tabler Icons SVG System for SpeedySlate Floating HUD & Content UI
 * Uses official Tabler Icons SVG geometries with 2px stroke and clean Brutalist aesthetic
 */
export class ChubbyIcons {
  public static bolt(size = 15, color = '#E52E3D'): string {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
        <path d="M13 3l0 7l6 0l-8 11l0 -7l-6 0z" fill="${color}" fill-opacity="0.15"/>
      </svg>
    `.trim();
  }

  public static play(size = 14, color = '#FFFFFF'): string {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
        <path d="M7 4v16l13 -8z" fill="${color}" fill-opacity="0.2"/>
      </svg>
    `.trim();
  }

  public static pause(size = 14, color = '#FFFFFF'): string {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
        <path d="M6 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z"/>
        <path d="M14 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z"/>
      </svg>
    `.trim();
  }

  public static checkCircle(size = 15, color = '#E52E3D'): string {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
        <circle cx="12" cy="12" r="9"/>
        <path d="M9 12l2 2l4 -4"/>
      </svg>
    `.trim();
  }

  public static eye(size = 15, color = '#E52E3D'): string {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
        <circle cx="12" cy="12" r="2"/>
        <path d="M22 12c-2.4 4 -5.4 6 -10 6c-4.6 0 -7.6 -2 -10 -6c2.4 -4 5.4 -6 10 -6c4.6 0 7.6 2 10 6"/>
      </svg>
    `.trim();
  }

  public static broom(size = 15, color = '#E52E3D'): string {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
        <path d="M14 12l-8.5 8.5a2.12 2.12 0 0 1 -3 -3l8.5 -8.5"/>
        <path d="M12 10l-1 -1a1 1 0 0 1 0 -1.41l5.59 -5.59a1 1 0 0 1 1.41 0l3.59 3.59a1 1 0 0 1 0 1.41l-5.59 5.59a1 1 0 0 1 -1.41 0l-1 -1"/>
      </svg>
    `.trim();
  }

  public static trash(size = 15, color = '#FF3B47'): string {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
        <path d="M4 7l16 0"/>
        <path d="M10 11l0 6"/>
        <path d="M14 11l0 6"/>
        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"/>
        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"/>
      </svg>
    `.trim();
  }

  public static alert(size = 15, color = '#FF3B47'): string {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
        <path d="M12 9v4"/>
        <path d="M12 17h.01"/>
        <path d="M5 19h14a2 2 0 0 0 1.84 -2.75l-7.1 -12.25a2 2 0 0 0 -3.5 0l-7.1 12.25a2 2 0 0 0 1.75 2.75"/>
      </svg>
    `.trim();
  }

  public static dots(size = 15, color = '#FFFFFF'): string {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
        <path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/>
        <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/>
        <path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/>
      </svg>
    `.trim();
  }

  public static spinner(size = 15, color = '#E52E3D'): string {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle; animation: speedyslateSpin 0.75s linear infinite;">
        <path d="M12 3a9 9 0 1 0 9 9"/>
      </svg>
    `.trim();
  }
}
