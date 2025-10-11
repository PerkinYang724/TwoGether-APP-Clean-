"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/haptics";

interface RatingStarsProps {
    value: number;
    onChange?: (value: number) => void;
    max?: number;
    size?: "sm" | "md" | "lg";
    interactive?: boolean;
    showValue?: boolean;
    className?: string;
}

export function RatingStars({
    value,
    onChange,
    max = 5,
    size = "md",
    interactive = false,
    showValue = false,
    className
}: RatingStarsProps) {
    const [hoverValue, setHoverValue] = useState(0);
    const { selection, success } = useHaptics();

    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-6 h-6",
        lg: "w-8 h-8"
    };

    const handleClick = (rating: number) => {
        if (!interactive) return;

        selection(); // Haptic feedback
        onChange?.(rating);

        // Success haptic for 5-star rating
        if (rating === 5) {
            success();
        }
    };

    const handleMouseEnter = (rating: number) => {
        if (!interactive) return;
        setHoverValue(rating);
    };

    const handleMouseLeave = () => {
        if (!interactive) return;
        setHoverValue(0);
    };

    const displayValue = hoverValue || value;

    return (
        <div className={cn("flex items-center gap-1", className)}>
            <div className="flex items-center gap-0.5">
                {Array.from({ length: max }, (_, i) => {
                    const rating = i + 1;
                    const isFilled = rating <= displayValue;
                    const isHovered = interactive && hoverValue === rating;

                    return (
                        <motion.button
                            key={i}
                            type="button"
                            className={cn(
                                "transition-colors duration-150",
                                interactive && "cursor-pointer hover:scale-110",
                                !interactive && "cursor-default"
                            )}
                            onClick={() => handleClick(rating)}
                            onMouseEnter={() => handleMouseEnter(rating)}
                            onMouseLeave={handleMouseLeave}
                            whileHover={interactive ? { scale: 1.1 } : {}}
                            whileTap={interactive ? { scale: 0.95 } : {}}
                            disabled={!interactive}
                        >
                            <Star
                                className={cn(
                                    sizeClasses[size],
                                    isFilled
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-muted-foreground",
                                    isHovered && interactive && "text-yellow-300"
                                )}
                            />
                        </motion.button>
                    );
                })}
            </div>

            {showValue && (
                <span className="text-sm text-muted-foreground ml-2">
                    {value.toFixed(1)}
                </span>
            )}
        </div>
    );
}

// Quick rating component for forms
interface QuickRatingProps {
    value: number;
    onChange: (value: number) => void;
    className?: string;
}

export function QuickRating({ value, onChange, className }: QuickRatingProps) {
    const [selectedRating, setSelectedRating] = useState(value);
    const { selection } = useHaptics();

    const handleRatingChange = (rating: number) => {
        setSelectedRating(rating);
        selection();
        onChange(rating);
    };

    return (
        <div className={cn("space-y-3", className)}>
            <div className="flex justify-center">
                <RatingStars
                    value={selectedRating}
                    onChange={handleRatingChange}
                    interactive
                    size="lg"
                    showValue
                />
            </div>

            <div className="text-center">
                <p className="text-sm text-muted-foreground">
                    {selectedRating === 0 && "Tap a star to rate"}
                    {selectedRating === 1 && "Poor"}
                    {selectedRating === 2 && "Fair"}
                    {selectedRating === 3 && "Good"}
                    {selectedRating === 4 && "Very Good"}
                    {selectedRating === 5 && "Excellent"}
                </p>
            </div>
        </div>
    );
}

// Rating display component (read-only)
interface RatingDisplayProps {
    value: number;
    count?: number;
    size?: "sm" | "md" | "lg";
    showCount?: boolean;
    className?: string;
}

export function RatingDisplay({
    value,
    count,
    size = "sm",
    showCount = true,
    className
}: RatingDisplayProps) {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <RatingStars
                value={value}
                size={size}
                interactive={false}
            />

            {showCount && count !== undefined && (
                <span className="text-sm text-muted-foreground">
                    ({count})
                </span>
            )}
        </div>
    );
}
