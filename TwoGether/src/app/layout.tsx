import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "TwoGether - Connect with Fellow Students",
    description: "Find events, make friends, and carpool with university students",
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "TwoGether",
    },
    icons: {
        apple: "/icons/icon-152x152.png",
        icon: "/icons/icon-192x192.png",
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    themeColor: "#6366f1",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                {/* Safari-specific meta tags */}
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-title" content="TwoGether" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
                <link rel="apple-touch-icon" sizes="72x72" href="/icons/icon-72x72.png" />
                <link rel="apple-touch-icon" sizes="96x96" href="/icons/icon-96x96.png" />
                <link rel="apple-touch-icon" sizes="128x128" href="/icons/icon-128x128.png" />
                <link rel="apple-touch-icon" sizes="144x144" href="/icons/icon-144x144.png" />
                <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
                <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png" />
                <link rel="apple-touch-icon" sizes="384x384" href="/icons/icon-384x384.png" />
                <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512x512.png" />
            </head>
            <body className={inter.className}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
