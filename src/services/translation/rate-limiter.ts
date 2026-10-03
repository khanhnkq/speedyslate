/**
 * Centralized API Rate Limiter
 * Serializes and throttles requests across concurrent workers
 * Prevents HTTP 429 Too Many Requests on Gemini (15 RPM) and Groq (30-60 RPM)
 * Following Single Responsibility Principle (SRP)
 */
export class ApiRateLimiter {
  private static lastRequestStartTime: number = 0;
  private static queuePromise: Promise<void> = Promise.resolve();

  /**
   * Executes a task only after the required minimum spacing has elapsed
   */
  public static async throttle<T>(
    minIntervalMs: number,
    task: () => Promise<T>
  ): Promise<T> {
    if (minIntervalMs <= 0) {
      return await task();
    }

    // Chain the task onto the queue promise so calls are serialized cleanly
    const resultPromise = this.queuePromise.then(async () => {
      const now = Date.now();
      const elapsed = now - this.lastRequestStartTime;
      const waitTime = Math.max(0, minIntervalMs - elapsed);

      if (waitTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }

      this.lastRequestStartTime = Date.now();
      return await task();
    });

    // Update queuePromise so subsequent calls wait for this slot
    this.queuePromise = resultPromise.then(
      () => {},
      () => {} // Don't block subsequent requests if a task failed
    );

    return await resultPromise;
  }
}
