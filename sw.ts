/// <reference lib="webworker" />
import { clientsClaim } from 'workbox-core'
import { precacheAndRoute } from 'workbox-precaching'

declare const self: ServiceWorkerGlobalScope
clientsClaim()
precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener('notificationclick', (event: any) => {
    event.notification.close()
    event.waitUntil(self.clients.matchAll({ type: 'window' }).then((clients) => {
        const c = clients.find((c: any) => 'focus' in c)
        if (c) return (c as any).focus()
        return self.clients.openWindow('/')
    }))
})
