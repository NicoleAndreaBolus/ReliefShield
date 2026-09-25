import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import wasm from 'vite-plugin-wasm';

import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    wasm(),
    tailwindcss(),
    react(),
  ],
  resolve: {
    dedupe: [
      '@midnight-ntwrk/onchain-runtime-v3',
      '@midnight-ntwrk/ledger-v8',
      '@midnight-ntwrk/compact-runtime',
      '@midnight-ntwrk/midnight-js-protocol',
    ],
    alias: {
      '@midnight-ntwrk/onchain-runtime-v3': path.resolve(__dirname, 'node_modules/@midnight-ntwrk/onchain-runtime-v3'),
    },
  },
  build: {
    target: 'esnext',
  },
  server: {
    port: 3000,
    host: true,
  },
});
