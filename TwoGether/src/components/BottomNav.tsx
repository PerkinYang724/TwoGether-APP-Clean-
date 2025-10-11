"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
    Home,
    Search,
    Car,
    MessageCircle,
    User,
    Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAnalytics } from "@/lib/analytics";
import { useHaptics } from "@/lib/haptics";

const navItems = [
    {
        href: "/",
        icon: Home,
        label: "Home",
        analyticsEvent: "navigate_to_home" as const
    },
    {
        href: "/discover",
        icon: Search,
        label: "Discover",
        analyticsEvent: "navigate_to_discover" as const
    },
    {
        href: "/events/new",
        icon: Plus,
        label: "Create",
        analyticsEvent: "navigate_to_create" as const
    },
    {
        href: "/carpools",
        icon: Car,
        label: "Carpools",
        analyticsEvent: "navigate_to_carpools" as const
    },
    {
        href: "/inbox",
        icon: MessageCircle,
        label: "Inbox",
        analyticsEvent: "navigate_to_inbox" as const
    },
    {
        href: "/profile",
        icon: User,
        label: "Profile",
        analyticsEvent: "navigate_to_profile" as const
    },
];

export function BottomNav() {
    const pathname = usePathname();
    const { track } = useAnalytics();
    const { selection } = useHaptics();

    const handleNavClick = (item: typeof navItems[0]) => {
        selection(); // Haptic feedback
        track(item.analyticsEvent, { destination: item.href });
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border safe-area-bottom z-50">
            <div className="flex items-center justify-around py-2 px-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== "/" && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => handleNavClick(item)}
                            className={cn(
                                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 min-w-[44px] min-h-[44px] justify-center",
                                isActive
                                    ? "text-primary bg-primary/10"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                        >
                            <motion.div
                                animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            >
                                <item.icon className="w-5 h-5" />
                            </motion.div>

                            <span className="text-xs font-medium leading-none">
                                {item.label}
                            </span>

                            {/* Active indicator */}
                            {isActive && (
                                <motion.div
                                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                                    layoutId="activeIndicator"
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

// Compact version for smaller screens
export function BottomNavCompact() {
    const pathname = usePathname();
    const { track } = useAnalytics();
    const { selection } = useHaptics();

    const handleNavClick = (item: typeof navItems[0]) => {
        selection();
        track(item.analyticsEvent, { destination: item.href });
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border safe-area-bottom z-50">
            <div className="flex items-center justify-around py-1 px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== "/" && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => handleNavClick(item)}
                            className={cn(
                                "flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all duration-200 min-w-[40px] min-h-[40px] justify-center",
                                isActive
                                    ? "text-primary bg-primary/10"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                        >
                            <motion.div
                                animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            >
                                <item.icon className="w-4 h-4" />
                            </motion.div>

                            <span className="text-[10px] font-medium leading-none">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

// Floating action button variant
export function BottomNavWithFAB() {
    const pathname = usePathname();
    const { track } = useAnalytics();
    const { selection } = useHaptics();

    const handleNavClick = (item: typeof navItems[0]) => {
        selection();
        track(item.analyticsEvent, { destination: item.href });
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border safe-area-bottom z-50">
            <div className="flex items-center justify-around py-2 px-4 relative">
                {/* Floating Action Button */}
                <motion.div
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Link
                        href="/events/new"
                        onClick={() => handleNavClick(navItems[2])}
                        className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
                    >
                        <Plus className="w-6 h-6" />
                    </Link>
                </motion.div>

                {/* Navigation Items */}
                {navItems.filter(item => item.href !== "/events/new").map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== "/" && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => handleNavClick(item)}
                            className={cn(
                                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 min-w-[44px] min-h-[44px] justify-center",
                                isActive
                                    ? "text-primary bg-primary/10"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                        >
                            <motion.div
                                animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            >
                                <item.icon className="w-5 h-5" />
                            </motion.div>

                            <span className="text-xs font-medium leading-none">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}