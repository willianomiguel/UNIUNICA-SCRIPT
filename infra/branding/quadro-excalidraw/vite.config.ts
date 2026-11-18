import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Script clássico (IIFE), não módulo: a página roda num iframe de origem isolada (sandbox sem
// allow-same-origin), e módulo exigiria CORS para carregar o próprio JS.
export default defineConfig({
  plugins: [react()],
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: {
      entry: 'src/main.tsx',
      formats: ['iife'],
      name: 'QuadroExcalidraw',
      fileName: () => 'editor.js',
      cssFileName: 'editor',
    },
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
});
