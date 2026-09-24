import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import wasm from 'vite-plugin-wasm';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    wasm(),
    tailwindcss(),
    react(),
  ],
  build: {
    target: 'esnext',
  },
  server: {
    port: 3000,
    host: true,
  },
});
