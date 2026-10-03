import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

export default defineConfig(({ mode }) => {
  const target = mode === 'firefox' ? 'firefox' : 'chrome';
  const outDir = resolve(__dirname, `dist/${target}`);

  return {
    build: {
      outDir,
      emptyOutDir: true,
      target: 'es2022',
      rollupOptions: {
        input: {
          popup: resolve(__dirname, 'src/popup/popup.html'),
          background: resolve(__dirname, 'src/background/index.ts'),
          content: resolve(__dirname, 'src/content/index.ts'),
          worker: resolve(__dirname, 'src/worker/ocr.worker.ts')
        },
        output: {
          entryFileNames: (chunkInfo) => {
            if (['background', 'content', 'worker'].includes(chunkInfo.name)) {
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
        name: 'copy-extension-assets',
        closeBundle() {
          // 1. Copy manifest
          const manifestSrc = resolve(__dirname, `manifest.${target}.json`);
          const manifestDest = resolve(outDir, 'manifest.json');
          if (fs.existsSync(manifestSrc)) {
            fs.copyFileSync(manifestSrc, manifestDest);
            console.log(`[Vite] Copied manifest.${target}.json -> dist/${target}/manifest.json`);
          }

          // 2. Copy icons
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

          // 3. Copy ONNX Runtime WebAssembly files (AMO compliance: local wasm only)
          const onnxDist = resolve(__dirname, 'node_modules/onnxruntime-web/dist');
          if (fs.existsSync(onnxDist)) {
            const wasmFiles = fs.readdirSync(onnxDist).filter((f) => f.endsWith('.wasm'));
            for (const wasm of wasmFiles) {
              fs.copyFileSync(resolve(onnxDist, wasm), resolve(outDir, wasm));
            }
            console.log(`[Vite] Copied ${wasmFiles.length} ONNX wasm files -> dist/${target}/`);
          }
        }
      }
    ]
  };
});
