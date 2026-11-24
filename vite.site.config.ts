import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import fs from 'node:fs';

function copyDirRecursive(src: string, dest: string): void {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = resolve(src, entry.name);
    const d = resolve(dest, entry.name);
    if (entry.isDirectory()) copyDirRecursive(s, d);
    else fs.copyFileSync(s, d);
  }
}

export default defineConfig({
  root: resolve(__dirname, 'site'),
  base: './',
  build: {
    outDir: resolve(__dirname, 'dist-site'),
    emptyOutDir: true,
    target: 'es2022',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'site/index.html'),
        privacy: resolve(__dirname, 'site/privacy.html')
      }
    }
  },
  plugins: [
    {
      name: 'copy-landing-static-assets',
      closeBundle() {
        const out = resolve(__dirname, 'dist-site');
        copyDirRecursive(resolve(__dirname, 'public/fonts'), resolve(out, 'fonts'));
        copyDirRecursive(resolve(__dirname, 'public/fonts'), resolve(out, 'assets/fonts'));
        copyDirRecursive(resolve(__dirname, 'store-assets/icons'), resolve(out, 'assets/icons'));
        copyDirRecursive(resolve(__dirname, 'store-assets/screenshots'), resolve(out, 'assets/screenshots'));
        copyDirRecursive(resolve(__dirname, 'store-assets/promo'), resolve(out, 'assets/promo'));
        fs.writeFileSync(resolve(out, '.nojekyll'), '');
      }
    }
  ]
});
