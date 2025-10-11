"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, Search, Filter, MapPin, Calendar, Users } from "lucide-react";
import { useRouter } from "next/navigation";

// Mock events for search
const mockEvents = [
    {
        id: "1",
        title: "Study Group for Midterm",
        category: "study",
        location: "Library Study Room 3",
        startTime: "Tomorrow 2:00 PM",
        attendees: "5/8",
        isCarpool: false,
    },
    {
        id: "2",
        title: "Basketball Game",
        category: "sport",
        location: "Campus Basketball Court",
        startTime: "Today 6:00 PM",
        attendees: "8/10",
        isCarpool: false,
    },
    {
        id: "3",
        title: "Pizza Night",
        category: "food",
        location: "Student Center",
        startTime: "Friday 7:00 PM",
        attendees: "9/12",
        isCarpool: false,
    },
    {
        id: "4",
        title: "Campus to Airport",
        category: "carpool",
        location: "Airport",
        startTime: "Saturday 8:00 AM",
        attendees: "2/4",
        isCarpool: true,
    },
];

export default function SearchPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const router = useRouter();

    const filteredEvents = mockEvents.filter(event => {
        if (!searchQuery) return true;
        return event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.location.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            study: "bg-blue-100 text-blue-800",
            sport: "bg-green-100 text-green-800",
            party: "bg-purple-100 text-purple-800",
            food: "bg-orange-100 text-orange-800",
            volunteer: "bg-pink-100 text-pink-800",
            carpool: "bg-yellow-100 text-yellow-800",
            social: "bg-indigo-100 text-indigo-800",
            academic: "bg-gray-100 text-gray-800",
            other: "bg-gray-100 text-gray-800",
        };
        return colors[category] || colors.other;
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border safe-area-top">
                <div className="flex items-center gap-4 p-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search events..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter className="w-4 h-4" />
                    </Button>
                </div>
            </header>

            {/* Results */}
            <div className="p-4">
                {filteredEvents.length === 0 ? (
                    <div className="text-center py-8">
                        <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <h3 className="text-lg font-semibold mb-2">No events found</h3>
                        <p className="text-muted-foreground mb-4">
                            Try adjusting your search or filters
                        </p>
                        <Button onClick={() => setShowFilters(true)}>
                            <Filter className="w-4 h-4 mr-2" />
                            Adjust Filters
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            {filteredEvents.length} events found
                        </p>

                        <div className="grid gap-4">
                            {filteredEvents.map(event => (
                                <Card key={event.id} className="overflow-hidden">
                                    <div className="flex">
                                        {/* Event Image */}
                                        <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                            <Calendar className="w-8 h-8 text-muted-foreground" />
                                        </div>

                                        {/* Event Details */}
                                        <CardContent className="flex-1 p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="font-semibold line-clamp-1">{event.title}</h3>
                                                <Badge className={getCategoryColor(event.category)}>
                                                    {event.category}
                                                </Badge>
                                            </div>

                                            <div className="space-y-1 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{event.startTime}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-3 h-3" />
                                                    <span className="line-clamp-1">{event.location}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-3 h-3" />
                                                    <span>{event.attendees} attendees</span>
                                                </div>
                                            </div>

                                            {event.isCarpool && (
                                                <Badge variant="outline" className="mt-2">
                                                    🚗 Carpool
                                                </Badge>
                                            )}
                                        </CardContent>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <BottomNav />
        </div>
    );
}