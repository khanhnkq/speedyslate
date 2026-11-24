import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';
import * as esbuild from 'esbuild';

export default defineConfig(({ mode }) => {
  const target = mode === 'firefox' ? 'firefox' : 'chrome';
  const outDir = resolve(__dirname, `dist/${target}`);

  const input: Record<string, string> = {
    popup: resolve(__dirname, 'src/popup/popup.html'),
    background: resolve(__dirname, 'src/background/index.ts'),
    worker: resolve(__dirname, 'src/worker/ocr.worker.ts')
  };

  if (target === 'chrome') {
    input.offscreen = resolve(__dirname, 'src/offscreen/offscreen.html');
  }

  return {
    build: {
      outDir,
      emptyOutDir: true,
      target: 'es2022',
      rollupOptions: {
        input,
        output: {
          entryFileNames: (chunkInfo) => {
            if (['background', 'worker'].includes(chunkInfo.name)) {
              return '[name].js';
            }
            return 'assets/[name].js';
          },
          chunkFileNames: 'assets/[name].js',
          assetFileNames: 'assets/[name].[ext]'
        }
      }
    },
    plugins: [
      {
        name: 'bundle-content-script-iife',
        closeBundle() {
          // 1. Bundle content script as self-contained IIFE (NO external imports! Crucial for WebExtension content_scripts)
          const contentSrc = resolve(__dirname, 'src/content/index.ts');
          const contentOut = resolve(outDir, 'content.js');
          esbuild.buildSync({
            entryPoints: [contentSrc],
            bundle: true,
            outfile: contentOut,
            format: 'iife',
            target: 'es2022',
            minify: false,
            sourcemap: false
          });
          console.log(`[Vite/esbuild] Bundled self-contained IIFE content.js -> dist/${target}/content.js`);

          // 2. Copy manifest
          const manifestSrc = resolve(__dirname, `manifest.${target}.json`);
          const manifestDest = resolve(outDir, 'manifest.json');
          if (fs.existsSync(manifestSrc)) {
            fs.copyFileSync(manifestSrc, manifestDest);
            console.log(`[Vite] Copied manifest.${target}.json -> dist/${target}/manifest.json`);
          }

          // 3. Copy icons
          const iconsSrcDir = resolve(__dirname, 'public/icons');
          const iconsDestDir = resolve(outDir, 'icons');
          if (fs.existsSync(iconsSrcDir)) {
            fs.mkdirSync(iconsDestDir, { recursive: true });
            const files = fs.readdirSync(iconsSrcDir);
            for (const file of files) {
              fs.copyFileSync(resolve(iconsSrcDir, file), resolve(iconsDestDir, file));
            }
            console.log(`[Vite] Copied icons -> dist/${target}/icons`);
          }

          // 4. Copy ONNX Runtime WebAssembly and glue script files (AMO compliance: local wasm only)
          const onnxDist = resolve(__dirname, 'node_modules/onnxruntime-web/dist');
          if (fs.existsSync(onnxDist)) {
            const files = fs.readdirSync(onnxDist).filter(
              (f) => f.startsWith('ort-wasm') && (f.endsWith('.wasm') || f.endsWith('.mjs'))
            );
            for (const file of files) {
              fs.copyFileSync(resolve(onnxDist, file), resolve(outDir, file));
            }
            console.log(`[Vite] Copied ${files.length} ONNX wasm & mjs files -> dist/${target}/`);
          }
        }
      }
    ]
  };
});
