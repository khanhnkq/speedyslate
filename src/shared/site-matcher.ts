import { ExtensionSettings } from './types';

/**
 * Hardcoded default supported webtoon & manga platforms
 */
export const DEFAULT_ALLOWED_SITES = [
  'toonhey.com',
  'toonily.com',
  'toonily.net',
  'toonily.me',
  'nhentai.net'
];

/**
 * SiteMatcher: Handles URL & hostname normalization and matching logic.
 * Follows Single Responsibility Principle (SRP) and strictly < 500 lines.
 */
export class SiteMatcher {
  /**
   * Normalizes arbitrary input string (URL, path, wildcard) into clean domain
   * Examples:
   * "https://asuracomic.net/chapter/1" -> "asuracomic.net"
   * "*.mangadex.org/*" -> "mangadex.org"
   * "  http://nettruyenmax.com/  " -> "nettruyenmax.com"
   */
  public static normalizeDomain(input: string): string {
    if (!input) return '';
    let clean = input.trim().toLowerCase();

    // Strip scheme
    clean = clean.replace(/^[a-z]+:\/\//, '');

    // Strip paths and query params
    const slashIdx = clean.indexOf('/');
    if (slashIdx !== -1) {
      clean = clean.substring(0, slashIdx);
    }
    const qIdx = clean.indexOf('?');
    if (qIdx !== -1) {
      clean = clean.substring(0, qIdx);
    }

    // Strip port
    const colonIdx = clean.indexOf(':');
    if (colonIdx !== -1) {
      clean = clean.substring(0, colonIdx);
    }

    // Strip wildcards
    clean = clean.replace(/^\*\.?/, '');

    return clean;
  }

  /**
   * Checks if a given hostname is permitted based on current extension settings
   */
  public static isSiteAllowed(hostname: string, settings?: ExtensionSettings): boolean {
    if (!hostname) return false;
    const cleanHost = this.normalizeDomain(hostname);
    if (!cleanHost) return false;

    // 1. If global toggle "Allow all websites" is ON
    if (settings?.allowAllSites) {
      return true;
    }

    // 2. Aggregate default and custom websites
    const customList = (settings?.customSites || []).map((s) => this.normalizeDomain(s)).filter(Boolean);
    const allAllowed = [...DEFAULT_ALLOWED_SITES, ...customList];

    // 3. Match exact host or subdomain
    return allAllowed.some((site) => {
      if (cleanHost === site) return true;
      if (cleanHost.endsWith('.' + site)) return true;
      return false;
    });
  }
}
