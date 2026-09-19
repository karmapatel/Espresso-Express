import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 3000,
    open: false,
    host: '0.0.0.0',
    allowedHosts: true
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        landing: resolve(__dirname, 'landing/index.html'),
        game: resolve(__dirname, 'game.html')
      }
    }
  }
});
