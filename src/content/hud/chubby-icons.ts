/**
 * Chubby Cute Vector SVG Icon System for SpeedySlate
 * Completely replaces all text emojis with scalable, crisp, rounded SVGs
 * Designed with 2.5px/3px rounded strokes and cute anime-tech aesthetic
 */
export class ChubbyIcons {
  public static bolt(size = 18, color = 'currentColor'): string {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
        <path d="M13 2.5L5 13H12L11 21.5L19 11H12L13 2.5Z" 
          fill="${color}" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `.trim();
  }

  public static play(size = 16, color = 'currentColor'): string {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
        <path d="M7 5.5C7 4.5 8.1 3.9 8.9 4.4L18.4 10.4C19.2 10.9 19.2 12.1 18.4 12.6L8.9 18.6C8.1 19.1 7 18.5 7 17.5V5.5Z" 
          fill="${color}" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `.trim();
  }

  public static pause(size = 16, color = 'currentColor'): string {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
        <rect x="6" y="5" width="4" height="14" rx="2" fill="${color}"/>
        <rect x="14" y="5" width="4" height="14" rx="2" fill="${color}"/>
      </svg>
    `.trim();
  }

  public static checkCircle(size = 16, color = 'currentColor'): string {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
        <circle cx="12" cy="12" r="9" stroke="${color}" stroke-width="2.5"/>
        <path d="M8.5 12.5L10.8 14.8L15.5 9.5" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `.trim();
  }

  public static eye(size = 16, color = 'currentColor'): string {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
        <path d="M2.5 12C4.5 7.5 8 5 12 5C16 5 19.5 7.5 21.5 12C19.5 16.5 16 19 12 19C8 19 4.5 16.5 2.5 12Z" 
          stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="12" cy="12" r="3.2" fill="${color}"/>
      </svg>
    `.trim();
  }

  public static broom(size = 16, color = 'currentColor'): string {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
        <path d="M18 3L21 6L13.5 13.5L10.5 10.5L18 3Z" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M10.5 10.5L4 17C3.5 17.5 3.5 18.5 4 19L5 20C5.5 20.5 6.5 20.5 7 20L13.5 13.5" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M3 21L7 21" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
    `.trim();
  }

  public static document(size = 16, color = 'currentColor'): string {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
        <rect x="5" y="3.5" width="14" height="17" rx="3.5" stroke="${color}" stroke-width="2.5"/>
        <path d="M9 8.5H15M9 12H15M9 15.5H12.5" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
    `.trim();
  }

  public static book(size = 15, color = 'currentColor'): string {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
        <path d="M4 19.5C5.5 18.5 7.5 18 10 18C12 18 13.5 18.5 14.5 19.5V5.5C13.5 4.5 12 4 10 4C7.5 4 5.5 4.5 4 5.5V19.5Z" 
          stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M20 19.5C18.5 18.5 16.5 18 14 18C12 18 10.5 18.5 9.5 19.5V5.5C10.5 4.5 12 4 14 4C16.5 4 18.5 4.5 20 5.5V19.5Z" 
          stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `.trim();
  }

  public static close(size = 13, color = 'currentColor'): string {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
        <path d="M6 6L18 18M18 6L6 18" stroke="${color}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `.trim();
  }

  public static sparkles(size = 16, color = 'currentColor'): string {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
        <path d="M12 3C12 7.5 14.5 10 19 10C14.5 10 12 12.5 12 17C12 12.5 9.5 10 5 10C9.5 10 12 7.5 12 3Z" 
          fill="${color}" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="19" cy="18" r="1.5" fill="${color}"/>
        <circle cx="5" cy="4" r="1.5" fill="${color}"/>
      </svg>
    `.trim();
  }

  public static pulseDot(color = '#10b981'): string {
    return `
      <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background-color:${color}; box-shadow:0 0 8px ${color}; margin-right:6px; flex-shrink:0;"></span>
    `.trim();
  }
}
