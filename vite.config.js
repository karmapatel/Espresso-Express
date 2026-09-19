import { defineConfig } from 'vite';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  server: {
    port: 3000,
    open: false,
    host: '0.0.0.0',
    allowedHosts: true
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'apple-touch-icon.png', 'icon.svg', 'manifest.json'],
      manifest: {
        id: '/',
        name: 'Espresso Express',
        short_name: 'Espresso',
        description: '2D Mobile Arcade Coffee Simulator - Subway Rush Hour Barista Game',
        theme_color: '#1a162b',
        background_color: '#0f0c1f',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/game.html',
        scope: '/',
        categories: ['games', 'arcade'],
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,jpg,jpeg}'],
        navigateFallbackDenylist: [/^\/downloads/, /\.apk$/]
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ],
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
