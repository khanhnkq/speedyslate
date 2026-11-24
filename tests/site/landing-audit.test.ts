import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = path.resolve(__dirname, '../..');

function walkTextFiles(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkTextFiles(full, out);
    else if (/\.(html|css|ts|mjs|svg)$/.test(entry.name)) out.push(full);
  }
  return out;
}

// Matches pictographic Unicode emojis (excludes standard ASCII/Latin/Vietnamese letters & box lines)
const EMOJI_RE = /\p{Extended_Pictographic}/u;
// Matches middle-dot, bullet-dot, radial-gradient dot grids, or status-dot classes
const FORBIDDEN_DOT_PATTERNS = [
  /[•·●○]/,
  /radial-gradient\([^)]*1(?:\.\d+)?px/i,
  /halftone/i,
  /class=["'][^"']*\bdot\b/i
];

describe('GitHub Pages Landing Page anti-slop, zero-emoji & zero-dot audit', () => {
  it('includes site/index.html, site/privacy.html, vite.site.config.ts, and deploy-pages workflow', () => {
    expect(fs.existsSync(path.join(ROOT, 'site/index.html'))).toBe(true);
    expect(fs.existsSync(path.join(ROOT, 'site/privacy.html'))).toBe(true);
    expect(fs.existsSync(path.join(ROOT, 'vite.site.config.ts'))).toBe(true);
    expect(fs.existsSync(path.join(ROOT, '.github/workflows/deploy-pages.yml'))).toBe(true);
  });

  it('enforces zero emojis and zero dot-grids/bullets across site/ and store-asset-templates.mjs', () => {
    const files = [
      ...walkTextFiles(path.join(ROOT, 'site')),
      path.join(ROOT, 'scripts/store-asset-templates.mjs'),
      path.join(ROOT, 'public/icons/icon.svg')
    ].filter((f) => fs.existsSync(f));

    expect(files.length).toBeGreaterThanOrEqual(5);

    const violations: string[] = [];
    for (const file of files) {
      const rel = path.relative(ROOT, file);
      const txt = fs.readFileSync(file, 'utf8');
      if (EMOJI_RE.test(txt)) {
        violations.push(`${rel}: contains emoji`);
      }
      for (const re of FORBIDDEN_DOT_PATTERNS) {
        if (re.test(txt)) {
          violations.push(`${rel}: matches forbidden dot pattern ${re}`);
        }
      }
    }
    expect(violations).toEqual([]);
  });
});
