/**
 * ApiKeyRotator: Manages multiple API keys with round-robin load balancing
 * and automatic failover/cooldown on HTTP 429 (Rate Limit).
 * Follows Single Responsibility Principle (SRP).
 */
export class ApiKeyRotator {
  private static globalKeyIndices: Map<string, number> = new Map();
  private static globalCooldowns: Map<string, number> = new Map();

  private keys: string[] = [];
  private groupKey: string = '';

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
    this.groupKey = this.keys.join('|');
  }

  public get count(): number {
    return this.keys.length;
  }

  public hasKeys(): boolean {
    return this.keys.length > 0;
  }

  public get hasMultipleKeys(): boolean {
    return this.keys.length > 1;
  }

  public getRawKeys(): string[] {
    return [...this.keys];
  }

  /**
   * Returns 1-based index of key (e.g. 1, 2, 3...)
   */
  public getKeyIndex(key: string): number {
    const idx = this.keys.indexOf(key);
    return idx >= 0 ? idx + 1 : 1;
  }

  /**
   * Checks if all registered keys are currently in cooldown due to HTTP 429
   */
  public areAllKeysRateLimited(): { allLimited: boolean; minRemainingMs: number } {
    if (this.keys.length === 0) return { allLimited: false, minRemainingMs: 0 };
    const now = Date.now();
    let minRemaining = Infinity;
    let inCooldownCount = 0;

    for (const key of this.keys) {
      const cooldownUntil = ApiKeyRotator.globalCooldowns.get(key) || 0;
      if (now < cooldownUntil) {
        inCooldownCount++;
        const rem = cooldownUntil - now;
        if (rem < minRemaining) minRemaining = rem;
      }
    }

    return {
      allLimited: inCooldownCount === this.keys.length,
      minRemainingMs: minRemaining === Infinity ? 0 : minRemaining
    };
  }

  /**
   * Masks key for secure logging (e.g. AIza...e3f4).
   */
  public static maskKey(key: string): string {
    if (!key) return '(trống)';
    const clean = key.trim();
    if (clean.length <= 8) return '***' + clean.slice(-3);
    return clean.slice(0, 4) + '...' + clean.slice(-4);
  }

  /**
   * Retrieves the next available key that is not in cooldown.
   * Advances the global rotation index across requests so each request uses a different key.
   * If all keys are temporarily rate-limited, returns the one whose cooldown expires soonest.
   */
  public getNextKey(): string {
    if (this.keys.length === 0) return '';
    if (this.keys.length === 1) return this.keys[0];

    const now = Date.now();
    const total = this.keys.length;
    const currentIndex = ApiKeyRotator.globalKeyIndices.get(this.groupKey) || 0;

    // 1. Try to find next key that is not in cooldown starting from global currentIndex
    for (let i = 0; i < total; i++) {
      const idx = (currentIndex + i) % total;
      const candidate = this.keys[idx];
      const cooldownUntil = ApiKeyRotator.globalCooldowns.get(candidate) || 0;

      if (now >= cooldownUntil) {
        // Advance global index for the next request in round-robin fashion!
        ApiKeyRotator.globalKeyIndices.set(this.groupKey, (idx + 1) % total);
        return candidate;
      }
    }

    // 2. All keys are in cooldown: pick the one expiring soonest
    let earliestKey = this.keys[0];
    let earliestTime = ApiKeyRotator.globalCooldowns.get(earliestKey) || Infinity;

    for (const key of this.keys) {
      const time = ApiKeyRotator.globalCooldowns.get(key) || 0;
      if (time < earliestTime) {
        earliestTime = time;
        earliestKey = key;
      }
    }

    return earliestKey;
  }

  /**
   * Marks a specific key as rate-limited with a cooldown period.
   * Persists across all requests in the extension.
   */
  public markRateLimited(key: string, cooldownMs: number = 30000): void {
    if (!key) return;
    const until = Date.now() + Math.max(5000, cooldownMs);
    ApiKeyRotator.globalCooldowns.set(key, until);
    console.warn(`[ApiKeyRotator] Key ...${key.slice(-6)} bị giới hạn (429). Cooldown ${Math.round(cooldownMs / 1000)}s.`);
  }

  /**
   * Marks a specific key as invalid or denied (401/403) with a long cooldown (24h).
   * Persists across all requests in the extension.
   */
  public markFailed(key: string, reason: string = 'Access denied or invalid'): void {
    if (!key) return;
    const cooldownMs = 24 * 60 * 60 * 1000;
    ApiKeyRotator.globalCooldowns.set(key, Date.now() + cooldownMs);
    console.error(`[ApiKeyRotator] Key ...${key.slice(-6)} bị loại bỏ (401/403: ${reason}). Tự động chuyển key.`);
  }

  /**
   * Clears cooldown when a request succeeds with this key.
   */
  public markSuccess(key: string): void {
    if (!key) return;
    ApiKeyRotator.globalCooldowns.delete(key);
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
