/**
 * ApiKeyRotator: Manages multiple API keys with round-robin load balancing
 * and automatic failover/cooldown on HTTP 429 (Rate Limit).
 * Follows Single Responsibility Principle (SRP).
 */
export class ApiKeyRotator {
  private keys: string[] = [];
  private currentIndex: number = 0;
  private cooldowns: Map<string, number> = new Map();

  constructor(input: string | string[]) {
    this.setKeys(input);
  }

  /**
   * Parses keys from string (separated by newlines, commas, or semicolons) or array.
   */
  public static parseKeys(input: string | string[]): string[] {
    if (Array.isArray(input)) {
      return Array.from(
        new Set(input.map((k) => k.trim()).filter((k) => k.length > 0))
      );
    }
    if (!input || typeof input !== 'string') return [];

    const rawList = input
      .split(/[\n,;]+/)
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    return Array.from(new Set(rawList));
  }

  public setKeys(input: string | string[]): void {
    this.keys = ApiKeyRotator.parseKeys(input);
    this.currentIndex = 0;
  }

  public get count(): number {
    return this.keys.length;
  }

  public hasKeys(): boolean {
    return this.keys.length > 0;
  }

  /**
   * Retrieves the next available key that is not in cooldown.
   * If all keys are temporarily rate-limited, returns the one whose cooldown expires soonest.
   */
  public getNextKey(): string {
    if (this.keys.length === 0) return '';
    if (this.keys.length === 1) return this.keys[0];

    const now = Date.now();
    const total = this.keys.length;

    // 1. Try to find next key that is not in cooldown
    for (let i = 0; i < total; i++) {
      const idx = (this.currentIndex + i) % total;
      const candidate = this.keys[idx];
      const cooldownUntil = this.cooldowns.get(candidate) || 0;

      if (now >= cooldownUntil) {
        this.currentIndex = (idx + 1) % total;
        return candidate;
      }
    }

    // 2. All keys are in cooldown: pick the one expiring soonest
    let earliestKey = this.keys[0];
    let earliestTime = this.cooldowns.get(earliestKey) || Infinity;

    for (const key of this.keys) {
      const time = this.cooldowns.get(key) || 0;
      if (time < earliestTime) {
        earliestTime = time;
        earliestKey = key;
      }
    }

    return earliestKey;
  }

  /**
   * Marks a specific key as rate-limited with a cooldown period.
   */
  public markRateLimited(key: string, cooldownMs: number = 30000): void {
    if (!key) return;
    const until = Date.now() + Math.max(5000, cooldownMs);
    this.cooldowns.set(key, until);
    console.warn(`[ApiKeyRotator] Key ...${key.slice(-6)} bị giới hạn (429). Cooldown ${Math.round(cooldownMs / 1000)}s.`);
  }

  /**
   * Marks a specific key as invalid or denied (401/403) with a long cooldown (24h).
   */
  public markFailed(key: string, reason: string = 'Access denied or invalid'): void {
    if (!key) return;
    const cooldownMs = 24 * 60 * 60 * 1000;
    this.cooldowns.set(key, Date.now() + cooldownMs);
    console.error(`[ApiKeyRotator] Key ...${key.slice(-6)} bị loại bỏ (401/403: ${reason}). Tự động chuyển key.`);
  }

  /**
   * Clears cooldown when a request succeeds with this key.
   */
  public markSuccess(key: string): void {
    if (!key) return;
    this.cooldowns.delete(key);
  }

  /**
   * Computes effective throttling delay based on the number of available keys.
   * Multiple keys reduce required spacing proportionally (down to 200ms minimum).
   */
  public getEffectiveDelay(baseDelayMs: number): number {
    if (this.keys.length <= 1) return baseDelayMs;
    return Math.max(200, Math.round(baseDelayMs / this.keys.length));
  }
}
