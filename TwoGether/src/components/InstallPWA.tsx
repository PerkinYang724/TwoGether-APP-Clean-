"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: "accepted" | "dismissed";
        platform: string;
    }>;
    prompt(): Promise<void>;
}

export function InstallPWA() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showInstallPrompt, setShowInstallPrompt] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setShowInstallPrompt(true);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
            setShowInstallPrompt(false);
        }

        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setShowInstallPrompt(false);
        setDeferredPrompt(null);
    };

    if (!showInstallPrompt) return null;

    return (
        <div className="fixed bottom-20 left-4 right-4 z-50">
            <Card className="bg-primary text-primary-foreground border-primary">
                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                        <Download className="w-6 h-6" />
                        <div className="flex-1">
                            <h3 className="font-semibold">Install TwoGether</h3>
                            <p className="text-sm opacity-90">
                                Add to your home screen for quick access
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={handleInstallClick}
                            >
                                Install
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleDismiss}
                                className="text-primary-foreground hover:bg-primary-foreground/20"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
