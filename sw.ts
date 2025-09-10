/// <reference lib="webworker" />
import { clientsClaim } from 'workbox-core'
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies'

declare const self: ServiceWorkerGlobalScope

// Take control of all clients immediately
clientsClaim()

// Clean up outdated caches
cleanupOutdatedCaches()

// Precache and route all static assets
precacheAndRoute(self.__WB_MANIFEST)

// Handle navigation requests
registerRoute(new NavigationRoute(
    async ({ request }) => {
        try {
            return await fetch(request)
        } catch (error) {
            // Return cached version if network fails
            const cache = await caches.open('app-cache')
            return await cache.match('/index.html') || new Response('Offline', { status: 200 })
        }
    }
))

// Handle notification clicks
self.addEventListener('notificationclick', (event: any) => {
    event.notification.close()
    event.waitUntil(
        self.clients.matchAll({ type: 'window' }).then((clients) => {
            // If app is already open, focus it
            const existingClient = clients.find((client: any) => 'focus' in client)
            if (existingClient) {
                return (existingClient as any).focus()
            }
            // Otherwise, open new window
            return self.clients.openWindow('/')
        })
    )
})

// Handle app installation
self.addEventListener('install', (event: any) => {
    console.log('PWA: Service worker installed')
    self.skipWaiting()
})

// Handle app activation
self.addEventListener('activate', (event: any) => {
    console.log('PWA: Service worker activated')
    event.waitUntil(self.clients.claim())
})
