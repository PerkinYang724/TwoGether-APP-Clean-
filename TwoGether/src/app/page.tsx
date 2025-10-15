"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SwipeDeck } from "@/components/SwipeDeck";
import { BottomNav } from "@/components/BottomNav";
import { InstallPWA } from "@/components/InstallPWA";
import { ConfettiBurst, ConfettiPatterns } from "@/components/ui/confetti-burst";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, Plus, MapPin, Calendar, LogIn, UserPlus, ArrowRight } from "lucide-react";
import { Event } from "@/lib/schemas";
import { useAnalytics } from "@/lib/analytics";
import { useHaptics } from "@/lib/haptics";
import { COPY } from "@/lib/copy";
import { useDemoState } from "@/lib/demo-states";
import { useAuth } from "@/lib/auth";
import { getConfigStatus } from "@/lib/env";

// Enhanced mock data with more realistic events
const mockEvents: Event[] = [
    {
        id: "1",
        host_id: "user1",
        campus_id: "campus1",
        title: "Study Group for Midterm",
        description: "Let's study together for the upcoming midterm exam. Bring your notes and snacks! We'll be covering chapters 5-8.",
        category: "study",
        is_carpool: false,
        location_text: "Library Study Room 3",
        latitude: 40.7128,
        longitude: -74.0060,
        start_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        end_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
        max_attendees: 8,
        current_attendees: 3,
        cover_url: "",
        tags: ["academic", "group-study", "midterm"],
        cost: 0,
        accessibility_notes: "Wheelchair accessible",
        safety_notes: "Study room is monitored by security",
        auto_approve: true,
        is_public: true,
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: "2",
        host_id: "user2",
        campus_id: "campus1",
        title: "Basketball Game",
        description: "Pickup basketball game at the campus court. All skill levels welcome! We'll play 3v3 games.",
        category: "sport",
        is_carpool: false,
        location_text: "Campus Basketball Court",
        latitude: 40.7128,
        longitude: -74.0060,
        start_time: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        end_time: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
        max_attendees: 10,
        current_attendees: 6,
        cover_url: "",
        tags: ["sports", "fitness", "basketball"],
        cost: 0,
        auto_approve: true,
        is_public: true,
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: "3",
        host_id: "user3",
        campus_id: "campus1",
        title: "Pizza Night",
        description: "Ordering pizza and watching movies. Come join us for a fun evening! We'll have vegetarian options too.",
        category: "food",
        is_carpool: false,
        location_text: "Student Center",
        latitude: 40.7128,
        longitude: -74.0060,
        start_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        end_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
        max_attendees: 12,
        current_attendees: 8,
        cover_url: "",
        tags: ["food", "social", "movies"],
        cost: 500, // $5.00
        auto_approve: true,
        is_public: true,
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: "4",
        host_id: "user4",
        campus_id: "campus1",
        title: "Campus to Airport",
        description: "Driving to the airport for spring break. Have 3 seats available. We'll leave at 6 AM sharp.",
        category: "carpool",
        is_carpool: true,
        location_text: "Airport",
        latitude: 40.7128,
        longitude: -74.0060,
        start_time: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        end_time: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
        max_attendees: 4,
        current_attendees: 1,
        cover_url: "",
        tags: ["travel", "carpool", "airport"],
        cost: 1500, // $15.00
        safety_notes: "Experienced driver, clean car",
        auto_approve: true,
        is_public: true,
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: "5",
        host_id: "user5",
        campus_id: "campus1",
        title: "Tech Meetup",
        description: "Discussing the latest in AI and machine learning. Open to all skill levels!",
        category: "tech",
        is_carpool: false,
        location_text: "Computer Science Building",
        latitude: 40.7128,
        longitude: -74.0060,
        start_time: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        end_time: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
        max_attendees: 15,
        current_attendees: 7,
        cover_url: "",
        tags: ["tech", "AI", "networking"],
        cost: 0,
        auto_approve: true,
        is_public: true,
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
];

export default function HomePage() {
    const router = useRouter();
    const { user, profile, loading: authLoading } = useAuth();
    const [events, setEvents] = useState<Event[]>(mockEvents);
    const [showConfetti, setShowConfetti] = useState(false);
    const [swipeHistory, setSwipeHistory] = useState<Array<{ event: Event; direction: 'left' | 'right' }>>([]);

    const { track } = useAnalytics();
    const { success } = useHaptics();
    const { isLoading, isEmpty, hasError, error } = useDemoState(events);

    // Get configuration status for debugging
    const configStatus = getConfigStatus();

    // Show loading while checking authentication
    if (authLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    // Show configuration status banner if Supabase is not configured
    const ConfigBanner = () => {
        if (configStatus.isConfigured) return null;

        return (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <span className="text-yellow-400">⚠️</span>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                            <strong>Demo Mode:</strong> Supabase is not configured.
                            User data is stored locally only.
                            <a href="/SUPABASE_SETUP.md" className="underline ml-1">Setup instructions</a>
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    // Show authentication screen if user is not logged in
    if (!user) {
        return (
            <div className="min-h-screen bg-background">
                <ConfigBanner />
                {/* Header */}
                <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border safe-area-top">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold">TwoGether</h1>
                            <Badge variant="outline" className="text-xs">
                                <MapPin className="w-3 h-3 mr-1" />
                                Stanford University
                            </Badge>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="p-4">
                    <div className="max-w-md mx-auto space-y-6">
                        {/* Welcome Card */}
                        <Card className="text-center">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold">Welcome to TwoGether! 🎓</CardTitle>
                                <CardDescription>
                                    Connect with fellow students, find events, and make new friends on campus
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                                        <span>Discover campus events</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                                        <span>Join study groups</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                                        <span>Find carpool partners</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                                        <span>Make lasting friendships</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Authentication Buttons */}
                        <div className="space-y-3">
                            <Button
                                className="w-full"
                                size="lg"
                                onClick={() => router.push('/auth/login')}
                            >
                                <LogIn className="w-4 h-4 mr-2" />
                                Sign In
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                size="lg"
                                onClick={() => router.push('/auth/signup')}
                            >
                                <UserPlus className="w-4 h-4 mr-2" />
                                Create Account
                            </Button>
                        </div>

                        {/* Demo Preview */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">See How It Works</CardTitle>
                                <CardDescription>
                                    Swipe through events like a dating app - but for campus activities!
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-semibold text-primary">→</span>
                                        </div>
                                        <span className="text-sm">Swipe right to join events</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-semibold text-primary">←</span>
                                        </div>
                                        <span className="text-sm">Swipe left to pass</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-semibold text-primary">↑</span>
                                        </div>
                                        <span className="text-sm">Swipe up for details</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-semibold text-primary">↓</span>
                                        </div>
                                        <span className="text-sm">Swipe down to share</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>

                {/* PWA Install Prompt */}
                <InstallPWA />
            </div>
        );
    }

    // Show profile setup if user doesn't have a profile or has incomplete profile
    if (user && (!profile || !profile.full_name || !profile.campus_name)) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <CardTitle className="text-xl">Complete Your Profile</CardTitle>
                        <CardDescription>
                            Let's set up your profile so other students can connect with you
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            className="w-full"
                            onClick={() => router.push('/auth/setup')}
                        >
                            <ArrowRight className="w-4 h-4 mr-2" />
                            Complete Setup
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Safari-compatible clipboard function
    const fallbackToClipboard = (text: string, url: string) => {
        const fullText = `${text}\n${url}`;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(fullText).then(() => {
                alert(COPY.HOME.SHARE_SUCCESS);
            }).catch(() => {
                // Final fallback for older browsers
                showFallbackShareDialog(fullText);
            });
        } else {
            // Fallback for browsers without clipboard API
            showFallbackShareDialog(fullText);
        }
    };

    // Fallback share dialog for browsers without clipboard API
    const showFallbackShareDialog = (text: string) => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();

        try {
            document.execCommand('copy');
            alert(COPY.HOME.SHARE_SUCCESS);
        } catch (err) {
            alert('Please copy this link manually:\n' + text);
        }

        document.body.removeChild(textarea);
    };

    const handleSwipeLeft = (event: Event) => {
        console.log("Passed on event:", event.title);
        setEvents(prev => prev.filter(e => e.id !== event.id));

        // Analytics tracking
        track('swipe_left', {
            event_id: event.id,
            category: event.category
        });
    };

    const handleSwipeRight = (event: Event) => {
        console.log("Liked event:", event.title);
        setEvents(prev => prev.filter(e => e.id !== event.id));

        // Show success feedback
        success(); // Haptic feedback
        setShowConfetti(true);

        // Analytics tracking
        track('swipe_right', {
            event_id: event.id,
            category: event.category
        });

        // Show success message
        setTimeout(() => {
            alert(`${COPY.HOME.JOIN_SUCCESS}`);
        }, 500);
    };

    const handleSwipeUp = (event: Event) => {
        console.log("Viewing details for event:", event.title);

        // Analytics tracking
        track('swipe_up', {
            event_id: event.id,
            category: event.category
        });

        // Show detailed event information
        const details = `
Event: ${event.title}
Description: ${event.description}
Category: ${event.category}
Location: ${event.location_text}
Time: ${new Date(event.start_time).toLocaleString()}
Attendees: ${event.current_attendees}/${event.max_attendees}
Cost: ${event.cost ? `$${(event.cost / 100).toFixed(2)}` : 'Free'}
Tags: ${event.tags?.join(', ') || 'None'}
        `.trim();

        alert(details);
    };

    const handleSwipeDown = (event: Event) => {
        console.log("Sharing event:", event.title);

        // Analytics tracking
        track('swipe_down', {
            event_id: event.id,
            category: event.category
        });

        // Share functionality with Safari compatibility
        const shareText = `Check out "${event.title}" on TwoGether! ${event.description?.substring(0, 100)}...`;
        const shareUrl = `${window.location.origin}/events/${event.id}`;

        // Check if Web Share API is supported (not available in Safari on desktop)
        if (navigator.share && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
            navigator.share({
                title: "Check out this event on TwoGether!",
                text: shareText,
                url: shareUrl,
            }).catch(() => {
                // Fallback to clipboard
                fallbackToClipboard(shareText, shareUrl);
            });
        } else {
            // Use clipboard fallback for Safari desktop and other browsers
            fallbackToClipboard(shareText, shareUrl);
        }
    };

    const handleUndo = () => {
        if (swipeHistory.length === 0) return;

        const lastSwipe = swipeHistory[swipeHistory.length - 1];
        setSwipeHistory(prev => prev.slice(0, -1));
        setEvents(prev => [lastSwipe.event, ...prev]);

        // Analytics tracking
        track('swipe_undo', {
            event_id: lastSwipe.event.id,
            direction: lastSwipe.direction
        });
    };

    const handleFilterClick = () => {
        track('open_filters');
        // For MVP, show a simple filter modal
        const filterOptions = ['Today', 'Weekend', 'Free', 'Academic', 'Social', 'Fitness', 'Music', 'Tech', 'Volunteer'];
        const selectedFilter = prompt(`Select a filter:\n${filterOptions.map((f, i) => `${i + 1}. ${f}`).join('\n')}`);
        if (selectedFilter) {
            const filterIndex = parseInt(selectedFilter) - 1;
            if (filterIndex >= 0 && filterIndex < filterOptions.length) {
                track('apply_filters', { filter: filterOptions[filterIndex].toLowerCase() });
                alert(`Filter applied: ${filterOptions[filterIndex]}`);
            }
        }
    };

    const handleCreateEvent = () => {
        track('navigate_to_create');
        // For MVP, show a simple event creation form
        const title = prompt("Event Title:");
        if (title) {
            const description = prompt("Event Description:");
            const category = prompt("Category (study/sport/food/social/tech):");
            if (title && description && category) {
                track('create_event', { category });
                alert(`Event "${title}" created successfully!`);
            }
        }
    };

    // Campus pill data (stub)
    const campusName = "Stanford University";
    const currentTime = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background pb-20">
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center space-y-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="text-muted-foreground">{COPY.LOADING.EVENTS}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (hasError) {
        return (
            <div className="min-h-screen bg-background pb-20">
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                            <span className="text-2xl">😅</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">{COPY.ERRORS.GENERIC_TITLE}</h3>
                            <p className="text-sm text-muted-foreground">{error}</p>
                        </div>
                        <Button onClick={() => typeof window !== 'undefined' && window.location.reload()}>
                            {COPY.ERRORS.GENERIC_CTA}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen mobile-viewport bg-background pb-20">
            <ConfigBanner />
            {/* Confetti Animation */}
            <ConfettiBurst
                trigger={showConfetti}
                onComplete={() => setShowConfetti(false)}
                {...ConfettiPatterns.join}
            />

            {/* Header */}
            <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border safe-area-top">
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold">TwoGether</h1>
                        <Badge variant="outline" className="text-xs">
                            <MapPin className="w-3 h-3 mr-1" />
                            {campusName}
                        </Badge>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleFilterClick}
                        >
                            <Filter className="w-4 h-4" />
                        </Button>
                        <Button
                            size="icon"
                            onClick={handleCreateEvent}
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Quick Filter Chips */}
                <div className="px-4 pb-3">
                    <div className="flex gap-2 overflow-x-auto">
                        {COPY.DISCOVER.QUICK_FILTERS && Object.entries(COPY.DISCOVER.QUICK_FILTERS).map(([key, label]) => (
                            <Badge
                                key={key}
                                variant="outline"
                                className="text-xs whitespace-nowrap cursor-pointer hover:bg-primary/10"
                                onClick={() => track('apply_filters', { filter: key })}
                            >
                                {label}
                            </Badge>
                        ))}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="p-4">
                {isEmpty ? (
                    <div className="flex items-center justify-center h-96">
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
                            <Button onClick={handleFilterClick}>
                                {COPY.HOME.EMPTY_DECK_CTA}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <SwipeDeck
                        events={events}
                        onSwipeLeft={handleSwipeLeft}
                        onSwipeRight={handleSwipeRight}
                        onSwipeUp={handleSwipeUp}
                        onSwipeDown={handleSwipeDown}
                        className="max-w-sm mx-auto"
                        showUndo={swipeHistory.length > 0}
                        onUndo={handleUndo}
                    />
                )}
            </main>

            {/* Bottom Navigation */}
            <BottomNav />

            {/* PWA Install Prompt */}
            <InstallPWA />

            {/* Demo State Controls (Development Only) */}
            {process.env.NODE_ENV === 'development' && typeof window !== 'undefined' && (
                <div className="fixed bottom-20 right-4 z-50 bg-background border rounded-lg p-4 shadow-lg">
                    <h4 className="font-semibold text-sm mb-2">Demo States</h4>
                    <div className="space-y-2">
                        {(['normal', 'loading', 'empty', 'error'] as const).map((state) => (
                            <Button
                                key={state}
                                onClick={() => {
                                    // This would trigger demo state changes
                                    console.log(`Demo state: ${state}`);
                                }}
                                variant="outline"
                                size="sm"
                                className="w-full text-xs"
                            >
                                {state}
                            </Button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}