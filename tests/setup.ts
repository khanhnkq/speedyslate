if (!(globalThis as any).chrome) {
  (globalThis as any).chrome = {
    runtime: { id: 'speedyslate-test-env', getURL: (p: string) => `chrome-extension://test/${p}` },
    storage: { local: { get: async () => ({}), set: async () => {} } }
  };
}
