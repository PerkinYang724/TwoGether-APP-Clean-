"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ConfettiBurstProps {
    trigger: boolean;
    onComplete?: () => void;
    className?: string;
    colors?: string[];
    particleCount?: number;
    duration?: number;
}

export function ConfettiBurst({
    trigger,
    onComplete,
    className,
    colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57", "#ff9ff3"],
    particleCount = 50,
    duration = 2000
}: ConfettiBurstProps) {
    const [particles, setParticles] = useState<Array<{
        id: number;
        x: number;
        y: number;
        color: string;
        rotation: number;
        scale: number;
    }>>([]);

    useEffect(() => {
        if (trigger) {
            // Generate random particles
            const newParticles = Array.from({ length: particleCount }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                scale: Math.random() * 0.5 + 0.5,
            }));

            setParticles(newParticles);

            // Clean up after animation
            const timer = setTimeout(() => {
                setParticles([]);
                onComplete?.();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [trigger, particleCount, colors, duration, onComplete]);

    return (
        <AnimatePresence>
            {trigger && particles.length > 0 && (
                <div className={cn("fixed inset-0 pointer-events-none z-50", className)}>
                    {particles.map((particle) => (
                        <motion.div
                            key={particle.id}
                            className="absolute w-2 h-2 rounded-full"
                            style={{
                                backgroundColor: particle.color,
                                left: `${particle.x}%`,
                                top: `${particle.y}%`,
                            }}
                            initial={{
                                scale: 0,
                                rotate: 0,
                                y: 0,
                            }}
                            animate={{
                                scale: particle.scale,
                                rotate: particle.rotation + 360,
                                y: [0, -100, -200],
                                x: [0, (Math.random() - 0.5) * 100],
                            }}
                            exit={{
                                scale: 0,
                                opacity: 0,
                            }}
                            transition={{
                                duration: duration / 1000,
                                ease: "easeOut",
                                delay: Math.random() * 0.2,
                            }}
                        />
                    ))}
                </div>
            )}
        </AnimatePresence>
    );
}

// Predefined confetti patterns
export const ConfettiPatterns = {
    // Success celebration
    success: {
        colors: ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0"],
        particleCount: 60,
        duration: 2500,
    },

    // Join event celebration
    join: {
        colors: ["#3b82f6", "#60a5fa", "#93c5fd", "#dbeafe"],
        particleCount: 80,
        duration: 3000,
    },

    // Carpool match celebration
    carpool: {
        colors: ["#f59e0b", "#fbbf24", "#fcd34d", "#fef3c7"],
        particleCount: 70,
        duration: 2800,
    },

    // Rating celebration
    rating: {
        colors: ["#f59e0b", "#fbbf24", "#fcd34d", "#fef3c7", "#ffffff"],
        particleCount: 50,
        duration: 2000,
    },

    // General celebration
    celebration: {
        colors: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57", "#ff9ff3"],
        particleCount: 100,
        duration: 3500,
    }
};

// Hook for easy confetti usage
export function useConfetti() {
    const [trigger, setTrigger] = useState(false);

    const burst = (pattern?: keyof typeof ConfettiPatterns) => {
        setTrigger(true);
    };

    const stop = () => {
        setTrigger(false);
    };

    return {
        trigger,
        burst,
        stop,
        ConfettiBurst: (props: Omit<ConfettiBurstProps, 'trigger'>) => (
            <ConfettiBurst
                {...props}
                trigger={trigger}
                onComplete={() => setTrigger(false)}
            />
        )
    };
}
