import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), VitePWA({
    injectRegister: 'auto',
    includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
    manifest: {
      name: 'Immich Slides',
      short_name: 'Slides',
      description: 'Immich-powered slideshow display',
      theme_color: '#000000',
      background_color: '#000000',
      display: 'standalone',
      orientation: 'landscape',
      start_url: '/',
      scope: '/',
      "icons": [
        {
          "src": "/web-app-manifest-192x192.png",
          "sizes": "192x192",
          "type": "image/png",
          "purpose": "maskable"
        },
        {
          "src": "/web-app-manifest-512x512.png",
          "sizes": "512x512",
          "type": "image/png",
          "purpose": "maskable"
        }
      ],
    },
    workbox: {
      runtimeCaching: [
        {
          urlPattern: ({ url }) => {
            return url.pathname.startsWith('/api/')
          },
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            networkTimeoutSeconds: 5,
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 5, // 5 minutes
            },
          },
        },
      ],
    },
  }),],
  server: {
    proxy: {
      // Forward all API calls to Express BFF server
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
})