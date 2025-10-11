import { defineConfig } from "next-pwa";

const withPWA = defineConfig({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
    runtimeCaching: [
        {
            urlPattern: /^https?.*/,
            handler: "NetworkFirst",
            options: {
                cacheName: "offlineCache",
                expiration: {
                    maxEntries: 200,
                },
            },
        },
    ],
});

export default withPWA;
