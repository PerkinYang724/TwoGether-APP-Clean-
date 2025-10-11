"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useGesture } from "@use-gesture/react";
import { Event } from "@/lib/schemas";
import { EventCard } from "./EventCard";
import { Button } from "./ui/button";
import { Undo2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/haptics";
import { useAnalytics } from "@/lib/analytics";
import { COPY } from "@/lib/copy";

interface SwipeDeckProps {
    events: Event[];
    onSwipeLeft: (event: Event) => void;
    onSwipeRight: (event: Event) => void;
    onSwipeUp: (event: Event) => void;
    onSwipeDown: (event: Event) => void;
    className?: string;
    showUndo?: boolean;
    onUndo?: () => void;
}

const SWIPE_THRESHOLD = 100;
const ROTATION_FACTOR = 0.1;
const SWIPE_VELOCITY_THRESHOLD = 0.3;

export function SwipeDeck({
    events,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    className,
    showUndo = true,
    onUndo
}: SwipeDeckProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [swipeHistory, setSwipeHistory] = useState<Array<{ event: Event; direction: 'left' | 'right' }>>([]);

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-30, 30]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

    const { light, success, selection, medium } = useHaptics();
    const { track } = useAnalytics();

    const currentEvent = events[currentIndex];
    const nextEvent = events[currentIndex + 1];
    const canUndo = swipeHistory.length > 0;

    // Gesture handling with haptic feedback
    const bind = useGesture({
        onDragStart: () => {
            setIsDragging(true);
            light(); // Light haptic feedback on drag start
        },
        onDrag: ({ active, movement: [mx, my], velocity: [vx, vy] }) => {
            if (!active) return;

            x.set(mx);
            y.set(my);

            // Haptic feedback based on swipe direction
            if (Math.abs(mx) > SWIPE_THRESHOLD) {
                if (mx > 0) {
                    // Swiping right - success haptic
                    success();
                } else {
                    // Swiping left - light haptic
                    light();
                }
            }
        },
        onDragEnd: ({ movement: [mx, my], velocity: [vx, vy], direction: [dx, dy] }) => {
            setIsDragging(false);

            const absX = Math.abs(mx);
            const absY = Math.abs(my);
            const absVx = Math.abs(vx);
            const absVy = Math.abs(vy);

            // Determine swipe direction based on movement and velocity
            if (absX > absY && (absX > SWIPE_THRESHOLD || absVx > SWIPE_VELOCITY_THRESHOLD)) {
                if (mx > 0) {
                    // Swipe right - Join event
                    handleSwipeRight();
                } else {
                    // Swipe left - Pass event
                    handleSwipeLeft();
                }
            } else if (absY > absX && (absY > SWIPE_THRESHOLD || absVy > SWIPE_VELOCITY_THRESHOLD)) {
                if (my < 0) {
                    // Swipe up - Show details
                    handleSwipeUp();
                } else {
                    // Swipe down - Share event
                    handleSwipeDown();
                }
            } else {
                // Return to center
                x.set(0);
                y.set(0);
            }
        }
    });

    const handleSwipeLeft = () => {
        if (!currentEvent) return;

        // Add to history for undo
        setSwipeHistory(prev => [...prev, { event: currentEvent, direction: 'left' }]);

        // Analytics tracking
        track('swipe_left', {
            event_id: currentEvent.id,
            category: currentEvent.category
        });

        // Animate out
        x.set(-300);
        y.set(0);

        setTimeout(() => {
            onSwipeLeft(currentEvent);
            setCurrentIndex(prev => prev + 1);
            x.set(0);
            y.set(0);
        }, 200);
    };

    const handleSwipeRight = () => {
        if (!currentEvent) return;

        // Add to history for undo
        setSwipeHistory(prev => [...prev, { event: currentEvent, direction: 'right' }]);

        // Analytics tracking
        track('swipe_right', {
            event_id: currentEvent.id,
            category: currentEvent.category
        });

        // Animate out
        x.set(300);
        y.set(0);

        setTimeout(() => {
            onSwipeRight(currentEvent);
            setCurrentIndex(prev => prev + 1);
            x.set(0);
            y.set(0);
        }, 200);
    };

    const handleSwipeUp = () => {
        if (!currentEvent) return;

        selection(); // Selection haptic feedback

        // Analytics tracking
        track('swipe_up', {
            event_id: currentEvent.id,
            category: currentEvent.category
        });

        onSwipeUp(currentEvent);
    };

    const handleSwipeDown = () => {
        if (!currentEvent) return;

        medium(); // Medium haptic feedback

        // Analytics tracking
        track('swipe_down', {
            event_id: currentEvent.id,
            category: currentEvent.category
        });

        onSwipeDown(currentEvent);
    };

    const handleUndo = () => {
        if (!canUndo) return;

        const lastSwipe = swipeHistory[swipeHistory.length - 1];
        setSwipeHistory(prev => prev.slice(0, -1));
        setCurrentIndex(prev => Math.max(0, prev - 1));

        // Analytics tracking
        track('swipe_undo', {
            event_id: lastSwipe.event.id,
            direction: lastSwipe.direction
        });

        onUndo?.();
    };

    const handlePass = () => {
        handleSwipeLeft();
    };

    const handleLike = () => {
        handleSwipeRight();
    };

    // Reset when events change
    useEffect(() => {
        setCurrentIndex(0);
        setSwipeHistory([]);
        x.set(0);
        y.set(0);
    }, [events]);

    if (!currentEvent) {
        return (
            <div className={cn("flex items-center justify-center h-96", className)}>
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                        <span className="text-2xl">😴</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                            {COPY.HOME.EMPTY_DECK_TITLE}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {COPY.HOME.EMPTY_DECK_SUBTITLE}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={cn("relative w-full h-96", className)}>
            <AnimatePresence>
                {/* Next card (background) */}
                {nextEvent && (
                    <motion.div
                        key={`next-${nextEvent.id}`}
                        initial={{ scale: 0.95, opacity: 0.5 }}
                        animate={{ scale: 0.95, opacity: 0.5 }}
                        className="absolute inset-0 z-10"
                    >
                        <EventCard event={nextEvent} className="h-full" />
                    </motion.div>
                )}

                {/* Current card (foreground) */}
                <motion.div
                    key={`current-${currentEvent.id}`}
                    className="absolute inset-0 z-20 cursor-grab active:cursor-grabbing"
                    style={{
                        x,
                        y,
                        rotate,
                        opacity
                    }}
                    animate={{
                        x: isDragging ? undefined : 0,
                        y: isDragging ? undefined : 0,
                        rotate: isDragging ? undefined : 0,
                        opacity: isDragging ? undefined : 1,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 360,
                        damping: 28,
                    }}
                    {...bind()}
                >
                    <EventCard
                        event={currentEvent}
                        className="h-full"
                        showActions={!isDragging}
                    />
                </motion.div>
            </AnimatePresence>

            {/* Swipe indicators */}
            <div className="absolute top-4 left-4 z-30">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                        opacity: x.get() > 50 ? 1 : 0,
                        scale: x.get() > 50 ? 1 : 0.8
                    }}
                    className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg"
                >
                    {COPY.HOME.SWIPE_HINTS.RIGHT}
                </motion.div>
            </div>

            <div className="absolute top-4 right-4 z-30">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                        opacity: x.get() < -50 ? 1 : 0,
                        scale: x.get() < -50 ? 1 : 0.8
                    }}
                    className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg"
                >
                    {COPY.HOME.SWIPE_HINTS.LEFT}
                </motion.div>
            </div>

            <div className="absolute top-1/2 left-4 z-30 transform -translate-y-1/2">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                        opacity: y.get() < -50 ? 1 : 0,
                        scale: y.get() < -50 ? 1 : 0.8
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg"
                >
                    {COPY.HOME.SWIPE_HINTS.UP}
                </motion.div>
            </div>

            <div className="absolute bottom-1/2 right-4 z-30 transform translate-y-1/2">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                        opacity: y.get() > 50 ? 1 : 0,
                        scale: y.get() > 50 ? 1 : 0.8
                    }}
                    className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg"
                >
                    {COPY.HOME.SWIPE_HINTS.DOWN}
                </motion.div>
            </div>

            {/* Action buttons */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex gap-4">
                <Button
                    onClick={handlePass}
                    disabled={isDragging}
                    className="w-12 h-12 rounded-full bg-white shadow-lg hover:scale-110 transition-transform border-2 border-red-200 hover:border-red-300"
                >
                    <span className="text-red-500 text-xl">✕</span>
                </Button>

                <Button
                    onClick={handleLike}
                    disabled={isDragging}
                    className="w-12 h-12 rounded-full bg-white shadow-lg hover:scale-110 transition-transform border-2 border-green-200 hover:border-green-300"
                >
                    <span className="text-green-500 text-xl">♥</span>
                </Button>
            </div>

            {/* Undo button */}
            {showUndo && canUndo && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute bottom-4 left-4 z-30"
                >
                    <Button
                        onClick={handleUndo}
                        size="icon"
                        variant="outline"
                        className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border-2 hover:scale-110 transition-transform"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </Button>
                </motion.div>
            )}

            {/* Keyboard navigation hints */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-30">
                <div className="text-xs text-muted-foreground text-center space-y-1">
                    <p>← Pass • → Join • ↑ Details • ↓ Share</p>
                    <p>Or swipe with your finger</p>
                </div>
            </div>
        </div>
    );
}