import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    publicDir: 'public',
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.svg', 'robots.txt', 'music/**/*.mp3'],
            manifest: {
                name: 'Flow Focus — Pomodoro',
                short_name: 'Flow Focus',
                description: 'A sleek Pomodoro PWA for deep work.',
                theme_color: '#0ea5e9',
                background_color: '#0b1220',
                display: 'standalone',
                start_url: '/',
                icons: [
                    { src: '/icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
                    { src: '/icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml' },
                    { src: '/icons/maskable-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'maskable' }
                ]
            },
            workbox: {
                navigateFallback: '/index.html',
                runtimeCaching: [
                    {
                        urlPattern: ({ request }) => request.destination === 'document' || request.destination === 'script' || request.destination === 'style',
                        handler: 'StaleWhileRevalidate'
                    },
                    {
                        urlPattern: ({ request }) => request.destination === 'image',
                        handler: 'CacheFirst',
                        options: { cacheName: 'images', expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 } }
                    },
                    {
                        urlPattern: ({ url }) => url.pathname.startsWith('/music/'),
                        handler: 'CacheFirst',
                        options: { cacheName: 'music', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 7 } }
                    }
                ]
            }
        })
    ],
})
