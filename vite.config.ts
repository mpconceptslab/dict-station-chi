import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon-32.png', 'apple-touch-icon.png'],
      manifest: {
        name: '默書伙伴 · Dictation Buddy',
        short_name: '默書伙伴',
        description: '小朋友嘅中文英文默書溫習同聽寫練習 App · A bilingual (Chinese / English) dictation practice app for kids',
        theme_color: '#6C63FF',
        background_color: '#F5F7FF',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        lang: 'zh-HK',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/maskable-icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: '/maskable-icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Precache the built app shell so it loads offline.
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        // Never let a heavy asset (hanzi-writer data, worker chunks) blow the cache limit.
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        navigateFallback: '/index.html',
        // Don't try to cache API/function calls or cross-origin CDNs blindly.
        navigateFallbackDenylist: [/^\/\.netlify\//],
        runtimeCaching: [
          {
            // Fonts + the hanzi-writer CDN used for stroke-order guides.
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'cdn-cache',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Vision OCR proxy — never cache (network only, falls through to app on error).
            urlPattern: /\/\.netlify\/functions\/vision-ocr/i,
            handler: 'NetworkOnly',
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  optimizeDeps: {
    include: ['idb'],
  },
})
