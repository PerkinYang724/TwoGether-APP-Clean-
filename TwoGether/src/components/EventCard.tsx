"use client";

import React from "react";
import { Event } from "@/lib/schemas";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
    Calendar,
    MapPin,
    Users,
    Star,
    Clock,
    Share2,
    Heart,
    DollarSign,
    Accessibility,
    Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { COPY } from "@/lib/copy";
import { useAnalytics } from "@/lib/analytics";

interface EventCardProps {
    event: Event;
    className?: string;
    showActions?: boolean;
    variant?: "compact" | "expanded";
    onJoin?: (eventId: string) => void;
    onShare?: (eventId: string) => void;
    onLike?: (eventId: string) => void;
    onDetails?: (eventId: string) => void;
}

export function EventCard({
    event,
    className,
    showActions = true,
    variant = "compact",
    onJoin,
    onShare,
    onLike,
    onDetails
}: EventCardProps) {
    const { track } = useAnalytics();

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = date.getTime() - now.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Tomorrow";
        if (diffDays < 7) return date.toLocaleDateString("en-US", { weekday: "short" });

        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getTimeUntilEvent = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = date.getTime() - now.getTime();

        if (diffMs < 0) return "Started";

        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        if (diffHours > 24) {
            const diffDays = Math.floor(diffHours / 24);
            return `in ${diffDays}d`;
        } else if (diffHours > 0) {
            return `in ${diffHours}h`;
        } else {
            return `in ${diffMinutes}m`;
        }
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            study: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
            sport: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
            party: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
            food: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
            volunteer: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
            carpool: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
            social: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
            academic: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
            fitness: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
            music: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200",
            tech: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
            other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
        };
        return colors[category] || colors.other;
    };

    const getCategoryIcon = (category: string) => {
        const icons: Record<string, React.ReactNode> = {
            study: "📚",
            sport: "⚽",
            party: "🎉",
            food: "🍕",
            volunteer: "🤝",
            carpool: "🚗",
            social: "👥",
            academic: "🎓",
            fitness: "💪",
            music: "🎵",
            tech: "💻",
            other: "📅",
        };
        return icons[category] || icons.other;
    };

    const handleJoin = () => {
        track('join_event', { event_id: event.id, category: event.category });
        onJoin?.(event.id);

        // For MVP, show confirmation
        alert(`You've joined "${event.title}"! You'll receive updates about this event.`);
    };

    const handleShare = () => {
        track('share_event', { event_id: event.id, category: event.category });
        onShare?.(event.id);

        // Safari-compatible share functionality
        const shareText = `Check out "${event.title}" on TwoGether! ${event.description?.substring(0, 100)}...`;
        const shareUrl = `${window.location.origin}/events/${event.id}`;
        const fullText = `${shareText}\n${shareUrl}`;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(fullText).then(() => {
                alert("Event link copied to clipboard!");
            }).catch(() => {
                // Fallback for older browsers
                const textarea = document.createElement('textarea');
                textarea.value = fullText;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();

                try {
                    document.execCommand('copy');
                    alert("Event link copied to clipboard!");
                } catch (err) {
                    alert('Please copy this link manually:\n' + fullText);
                }

                document.body.removeChild(textarea);
            });
        } else {
            alert('Please copy this link manually:\n' + fullText);
        }
    };

    const handleLike = () => {
        track('save_event', { event_id: event.id, category: event.category });
        onLike?.(event.id);

        // For MVP, show confirmation
        alert(`"${event.title}" saved to your favorites!`);
    };

    const handleDetails = () => {
        track('open_event_details', { event_id: event.id, category: event.category });
        onDetails?.(event.id);

        // For MVP, show detailed information
        const details = `
Event: ${event.title}
Description: ${event.description}
Category: ${event.category}
Location: ${event.location_text}
Time: ${new Date(event.start_time).toLocaleString()}
Attendees: ${event.current_attendees}/${event.max_attendees}
Cost: ${event.cost ? `$${(event.cost / 100).toFixed(2)}` : 'Free'}
Tags: ${event.tags?.join(', ') || 'None'}
${event.accessibility_notes ? `Accessibility: ${event.accessibility_notes}` : ''}
${event.safety_notes ? `Safety Notes: ${event.safety_notes}` : ''}
        `.trim();

        alert(details);
    };

    return (
        <Card className={cn("w-full h-full overflow-hidden group hover:shadow-lg transition-all duration-200", className)}>
            {/* Event Cover Image */}
            <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
                {event.cover_url ? (
                    <img
                        src={event.cover_url}
                        alt={event.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        <div className="text-center space-y-2">
                            <div className="text-4xl">{getCategoryIcon(event.category)}</div>
                            <div className="text-sm font-medium">{event.category}</div>
                        </div>
                    </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                    <Badge className={cn("backdrop-blur-sm", getCategoryColor(event.category))}>
                        {event.category}
                    </Badge>
                </div>

                {/* Carpool Badge */}
                {event.is_carpool && (
                    <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="backdrop-blur-sm">
                            🚗 Carpool
                        </Badge>
                    </div>
                )}

                {/* Cost Badge */}
                {event.cost && event.cost > 0 && (
                    <div className="absolute bottom-3 right-3">
                        <Badge variant="secondary" className="backdrop-blur-sm">
                            <DollarSign className="w-3 h-3 mr-1" />
                            ${(event.cost / 100).toFixed(0)}
                        </Badge>
                    </div>
                )}

                {/* Accessibility Badge */}
                {event.accessibility_notes && (
                    <div className="absolute bottom-3 left-3">
                        <Badge variant="secondary" className="backdrop-blur-sm">
                            <Accessibility className="w-3 h-3 mr-1" />
                            Accessible
                        </Badge>
                    </div>
                )}

                {/* Time Countdown */}
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2">
                    <Badge variant="secondary" className="backdrop-blur-sm">
                        <Clock className="w-3 h-3 mr-1" />
                        {getTimeUntilEvent(event.start_time)}
                    </Badge>
                </div>

                {/* Host Rating */}
                <div className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">4.8</span>
                </div>
            </div>

            <CardContent className="p-4 space-y-3">
                {/* Title */}
                <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                    {event.title}
                </h3>

                {/* Description */}
                {event.description && variant === "expanded" && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                        {event.description}
                    </p>
                )}

                {/* Event Details */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(event.start_time)} • {formatTime(event.start_time)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span className="line-clamp-1">{event.location_text}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{event.current_attendees}/{event.max_attendees} attending</span>
                    </div>
                </div>

                {/* Attendee Avatars */}
                {event.current_attendees > 0 && (
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                            {Array.from({ length: Math.min(event.current_attendees, 4) }).map((_, i) => (
                                <div key={i} className="w-6 h-6 border-2 border-background rounded-full bg-muted flex items-center justify-center text-xs">
                                    {String.fromCharCode(65 + i)}
                                </div>
                            ))}
                        </div>
                        {event.current_attendees > 4 && (
                            <span className="text-xs text-muted-foreground">
                                +{event.current_attendees - 4} more
                            </span>
                        )}
                    </div>
                )}

                {/* Tags */}
                {event.tags && event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {event.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                            </Badge>
                        ))}
                        {event.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                                +{event.tags.length - 3} more
                            </Badge>
                        )}
                    </div>
                )}

                {/* Safety Notes */}
                {event.safety_notes && variant === "expanded" && (
                    <div className="flex items-start gap-2 p-2 bg-muted/50 rounded-lg">
                        <Shield className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <p className="text-xs text-muted-foreground">{event.safety_notes}</p>
                    </div>
                )}

                {/* Action Buttons */}
                {showActions && (
                    <div className="flex gap-2 pt-2">
                        <Button
                            className="flex-1"
                            onClick={handleJoin}
                        >
                            {COPY.EVENT.JOIN_BUTTON}
                        </Button>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleShare}
                        >
                            <Share2 className="w-4 h-4" />
                        </Button>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleLike}
                        >
                            <Heart className="w-4 h-4" />
                        </Button>
                    </div>
                )}

                {/* Quick Details Button */}
                {variant === "compact" && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDetails}
                        className="w-full text-xs"
                    >
                        View Details
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}