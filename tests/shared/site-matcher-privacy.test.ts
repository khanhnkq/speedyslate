import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { DEFAULT_ALLOWED_SITES, SiteMatcher } from '../../src/shared/site-matcher';

// Irreversible SHA-256 digests of forbidden brand stems (keeps even test source 100% clean)
const FORBIDDEN_STEM_DIGESTS = new Set([
  'a6a3d28a9012600195ad55972baf45775d0c7a1e87110f159413f68fb7d62146',
  '7a44ec3561726ab78eaee080d5c7577771b31732593c152cae77194160826bf3',
  '8e591aeeec320a64c28863eb77a5d3939b36e429d4d083edf3bc248b30dea735',
  '0491d49897298f1a07adda5bb71e5b7ea8509571d1c7bbff1b7ac9310f2b21a4',
  'cb0dd6c00e73bbc1366963a4ba8f641245ce1b50a2db85101d0a5d7632b5510b'
]);

function stemDigest(word: string): string {
  return crypto.createHash('sha256').update('stem-audit:' + word.toLowerCase()).digest('hex');
}

function walkFiles(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, out);
    else if (/\.(ts|js|html|css|json|md)$/.test(entry.name)) out.push(full);
  }
  return out;
}

describe('SiteMatcher clean zero-default allowlist & privacy audit', () => {
  it('ships with an empty DEFAULT_ALLOWED_SITES array and only activates user-added sites', () => {
    expect(DEFAULT_ALLOWED_SITES).toEqual([]);
    expect(SiteMatcher.isSiteAllowed('reader.example.org', { customSites: [], allowAllSites: false } as any)).toBe(false);
    expect(
      SiteMatcher.isSiteAllowed('sub.reader.example.org', {
        customSites: ['https://reader.example.org/chapter-1'],
        allowAllSites: false
      } as any)
    ).toBe(true);
  });

  it('contains zero sensitive domain/title stems across src/, manifests, and package.json', () => {
    const root = path.resolve(__dirname, '../..');
    const files = [
      ...walkFiles(path.join(root, 'src')),
      ...(fs.existsSync(path.join(root, 'docs')) ? walkFiles(path.join(root, 'docs')) : []),
      ...(fs.existsSync(path.join(root, 'dist/chrome')) ? walkFiles(path.join(root, 'dist/chrome')) : []),
      ...(fs.existsSync(path.join(root, 'dist/firefox')) ? walkFiles(path.join(root, 'dist/firefox')) : []),
      path.join(root, 'AGENTS.md'),
      path.join(root, 'manifest.chrome.json'),
      path.join(root, 'manifest.firefox.json'),
      path.join(root, 'package.json')
    ];

    const flagged: string[] = [];
    for (const file of files) {
      const rel = path.relative(root, file);
      const rawContent = fs.readFileSync(file, 'utf8');
      if (rawContent.includes('18+')) {
        flagged.push(`${rel} (contains 18+)`);
        continue;
      }
      const baseWords = path.basename(file).split(/[^a-z0-9]+/i).filter(Boolean);
      const textWords = rawContent.match(/[a-z0-9]{5,}/gi) || [];
      for (const w of [...baseWords, ...textWords]) {
        if (FORBIDDEN_STEM_DIGESTS.has(stemDigest(w))) {
          flagged.push(rel);
          break;
        }
      }
    }
    expect(flagged).toEqual([]);
  });
});
