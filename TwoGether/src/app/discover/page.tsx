"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { EventCard } from "@/components/EventCard";
import { BottomNav } from "@/components/BottomNav";
import { cn } from "@/lib/utils";
import {
    Search,
    Filter,
    MapPin,
    Clock,
    Users,
    DollarSign,
    X,
    Calendar,
    Star
} from "lucide-react";
import { Event } from "@/lib/schemas";
import { useAnalytics } from "@/lib/analytics";
import { useHaptics } from "@/lib/haptics";
import { COPY } from "@/lib/copy";
import { useDemoState } from "@/lib/demo-states";

// Mock events data
const mockEvents: Event[] = [
    {
        id: "1",
        host_id: "user1",
        campus_id: "campus1",
        title: "Study Group for Midterm",
        description: "Let's study together for the upcoming midterm exam. Bring your notes and snacks!",
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
        tags: ["academic", "group-study"],
        cost: 0,
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
        description: "Pickup basketball game at the campus court. All skill levels welcome!",
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
        tags: ["sports", "fitness"],
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
        description: "Ordering pizza and watching movies. Come join us for a fun evening!",
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
        tags: ["food", "social"],
        cost: 500,
        auto_approve: true,
        is_public: true,
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
];

const QUICK_FILTERS = [
    { key: "today", label: "Today", icon: Calendar },
    { key: "weekend", label: "Weekend", icon: Calendar },
    { key: "free", label: "Free", icon: DollarSign },
    { key: "academic", label: "Academic", icon: Users },
    { key: "social", label: "Social", icon: Users },
    { key: "fitness", label: "Fitness", icon: Users },
    { key: "music", label: "Music", icon: Users },
    { key: "tech", label: "Tech", icon: Users },
];

export default function DiscoverPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [distance, setDistance] = useState([5]);
    const [minRating, setMinRating] = useState([0]);
    const [maxCost, setMaxCost] = useState([100]);
    const [onlyCarpools, setOnlyCarpools] = useState(false);
    const [onlyFree, setOnlyFree] = useState(false);

    const { track } = useAnalytics();
    const { selection } = useHaptics();
    const { isLoading, isEmpty, hasError, error, data: events } = useDemoState(mockEvents);

    const handleFilterToggle = (filter: string) => {
        selection(); // Haptic feedback
        setSelectedFilters(prev =>
            prev.includes(filter)
                ? prev.filter(f => f !== filter)
                : [...prev, filter]
        );

        track('apply_filters', { filter, active_filters: selectedFilters.length + 1 });
    };

    const handleClearFilters = () => {
        setSelectedFilters([]);
        setDistance([5]);
        setMinRating([0]);
        setMaxCost([100]);
        setOnlyCarpools(false);
        setOnlyFree(false);

        track('clear_filters');
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        track('search_events', { query });
    };

    const filteredEvents = events?.filter(event => {
        // Search filter
        if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !event.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }

        // Quick filters
        if (selectedFilters.includes("free") && event.cost && event.cost > 0) {
            return false;
        }
        if (selectedFilters.includes("academic") && event.category !== "study" && event.category !== "academic") {
            return false;
        }
        if (selectedFilters.includes("social") && event.category !== "social" && event.category !== "party") {
            return false;
        }
        if (selectedFilters.includes("fitness") && event.category !== "sport" && event.category !== "fitness") {
            return false;
        }
        if (selectedFilters.includes("music") && event.category !== "music") {
            return false;
        }
        if (selectedFilters.includes("tech") && event.category !== "tech") {
            return false;
        }

        // Advanced filters
        if (onlyCarpools && !event.is_carpool) {
            return false;
        }
        if (onlyFree && event.cost && event.cost > 0) {
            return false;
        }
        if (event.cost && event.cost > maxCost[0] * 100) {
            return false;
        }

        return true;
    }) || [];

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
                        <Button onClick={() => window.location.reload()}>
                            {COPY.ERRORS.GENERIC_CTA}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border safe-area-top">
                <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">{COPY.DISCOVER.TITLE}</h1>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                            {...useAnalytics().track('open_filters')}
                        >
                            <Filter className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search events..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Quick Filters */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {QUICK_FILTERS.map((filter) => (
                            <Badge
                                key={filter.key}
                                variant={selectedFilters.includes(filter.key) ? "default" : "outline"}
                                className={cn(
                                    "cursor-pointer whitespace-nowrap transition-all duration-200",
                                    selectedFilters.includes(filter.key) && "bg-primary text-primary-foreground"
                                )}
                                onClick={() => handleFilterToggle(filter.key)}
                            >
                                <filter.icon className="w-3 h-3 mr-1" />
                                {filter.label}
                            </Badge>
                        ))}
                    </div>

                    {/* Active Filters */}
                    {selectedFilters.length > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Active filters:</span>
                            <div className="flex gap-1">
                                {selectedFilters.map((filter) => (
                                    <Badge
                                        key={filter}
                                        variant="secondary"
                                        className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                                        onClick={() => handleFilterToggle(filter)}
                                    >
                                        {filter}
                                        <X className="w-3 h-3 ml-1" />
                                    </Badge>
                                ))}
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClearFilters}
                                className="text-xs"
                            >
                                Clear all
                            </Button>
                        </div>
                    )}
                </div>
            </header>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-b border-border bg-muted/20"
                >
                    <div className="p-4 space-y-4">
                        <h3 className="font-semibold">Advanced Filters</h3>

                        {/* Distance */}
                        <div className="space-y-2">
                            <Label>Distance: {distance[0]} miles</Label>
                            <Slider
                                value={distance}
                                onValueChange={setDistance}
                                max={50}
                                step={1}
                                className="w-full"
                            />
                        </div>

                        {/* Min Rating */}
                        <div className="space-y-2">
                            <Label>Minimum Rating: {minRating[0]} stars</Label>
                            <Slider
                                value={minRating}
                                onValueChange={setMinRating}
                                max={5}
                                step={0.5}
                                className="w-full"
                            />
                        </div>

                        {/* Max Cost */}
                        <div className="space-y-2">
                            <Label>Max Cost: ${maxCost[0]}</Label>
                            <Slider
                                value={maxCost}
                                onValueChange={setMaxCost}
                                max={100}
                                step={5}
                                className="w-full"
                            />
                        </div>

                        {/* Checkboxes */}
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="carpools"
                                    checked={onlyCarpools}
                                    onCheckedChange={setOnlyCarpools}
                                />
                                <Label htmlFor="carpools">Only Carpools</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="free"
                                    checked={onlyFree}
                                    onCheckedChange={setOnlyFree}
                                />
                                <Label htmlFor="free">Only Free Events</Label>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Results */}
            <main className="p-4">
                {/* Results Count */}
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-muted-foreground">
                        {COPY.DISCOVER.RESULTS_COUNT.replace('{count}', filteredEvents.length.toString())}
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    >
                        {showAdvancedFilters ? "Hide" : "Show"} Filters
                    </Button>
                </div>

                {/* Events List */}
                {isEmpty ? (
                    <div className="flex items-center justify-center h-96">
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                                <span className="text-2xl">🔍</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                                    {COPY.DISCOVER.NO_RESULTS_TITLE}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {COPY.DISCOVER.NO_RESULTS_SUBTITLE}
                                </p>
                            </div>
                            <Button onClick={handleClearFilters}>
                                {COPY.DISCOVER.NO_RESULTS_CTA}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredEvents.map((event) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                variant="compact"
                                showActions={true}
                                onJoin={(id) => {
                                    track('join_event', { event_id: id });
                                    alert(`${COPY.HOME.JOIN_SUCCESS}`);
                                }}
                                onShare={(id) => {
                                    track('share_event', { event_id: id });
                                    alert(COPY.HOME.SHARE_SUCCESS);
                                }}
                                onLike={(id) => {
                                    track('save_event', { event_id: id });
                                    alert(COPY.HOME.SAVE_SUCCESS);
                                }}
                                onDetails={(id) => {
                                    track('open_event_details', { event_id: id });
                                    alert(`Opening details for event ${id}`);
                                }}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
}
