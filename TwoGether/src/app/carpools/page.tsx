"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BottomNav } from "@/components/BottomNav";
import {
    Car,
    MapPin,
    Clock,
    Users,
    Star,
    Shield,
    Navigation,
    Calendar,
    DollarSign,
    CheckCircle
} from "lucide-react";
import { useAnalytics } from "@/lib/analytics";
import { useHaptics } from "@/lib/haptics";
import { COPY } from "@/lib/copy";
import { useDemoState } from "@/lib/demo-states";

type CarpoolTab = "find" | "offer";

interface CarpoolMatch {
    id: string;
    driver_id: string;
    driver_name: string;
    driver_avatar: string;
    driver_rating: number;
    driver_rating_count: number;
    event_title: string;
    event_id: string;
    origin: string;
    destination: string;
    depart_time: string;
    seats_available: number;
    cost_per_person: number;
    vehicle_info: string;
    meeting_spot: string;
    safety_notes: string;
    verified: boolean;
}

const mockCarpoolMatches: CarpoolMatch[] = [
    {
        id: "1",
        driver_id: "driver1",
        driver_name: "Alex Chen",
        driver_avatar: "/avatars/alex.jpg",
        driver_rating: 4.8,
        driver_rating_count: 24,
        event_title: "Study Group for Midterm",
        event_id: "event1",
        origin: "Main Campus",
        destination: "Library",
        depart_time: "2024-01-15T18:00:00Z",
        seats_available: 3,
        cost_per_person: 0,
        vehicle_info: "Honda Civic - Clean & comfortable",
        meeting_spot: "Student Center parking lot",
        safety_notes: "Experienced driver, clean car, masks required",
        verified: true,
    },
    {
        id: "2",
        driver_id: "driver2",
        driver_name: "Sarah Johnson",
        driver_avatar: "/avatars/sarah.jpg",
        driver_rating: 4.9,
        driver_rating_count: 31,
        event_title: "Basketball Game",
        event_id: "event2",
        origin: "North Campus",
        destination: "Sports Complex",
        depart_time: "2024-01-16T16:30:00Z",
        seats_available: 2,
        cost_per_person: 500, // $5.00
        vehicle_info: "Toyota Camry - Spacious",
        meeting_spot: "North parking garage",
        safety_notes: "Non-smoking vehicle, sanitized regularly",
        verified: true,
    },
];

export default function CarpoolsPage() {
    const [activeTab, setActiveTab] = useState<CarpoolTab>("find");
    const [pickupRadius, setPickupRadius] = useState([2]);
    const [seatsNeeded, setSeatsNeeded] = useState([1]);
    const [departureTime, setDepartureTime] = useState("");
    const [seatsOffered, setSeatsOffered] = useState([3]);
    const [costPerPerson, setCostPerPerson] = useState([0]);

    const { track } = useAnalytics();
    const { selection, success } = useHaptics();
    const { isLoading, isEmpty, hasError, error, data: matches } = useDemoState(mockCarpoolMatches);

    const handleTabChange = (tab: CarpoolTab) => {
        selection(); // Haptic feedback
        setActiveTab(tab);
        track('open_carpools', { tab });
    };

    const handleRequestRide = (match: CarpoolMatch) => {
        success(); // Haptic feedback
        track('request_ride', {
            carpool_id: match.id,
            driver_id: match.driver_id,
            event_id: match.event_id
        });
        alert(`Ride request sent to ${match.driver_name}! 🚗`);
    };

    const handleCreateOffer = () => {
        success(); // Haptic feedback
        track('create_carpool_offer', {
            seats_offered: seatsOffered[0],
            cost_per_person: costPerPerson[0]
        });
        alert("Carpool offer created! Other students can now request rides. 🚗");
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background pb-20">
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center space-y-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="text-muted-foreground">{COPY.LOADING.CARPOOLS}</p>
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
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border safe-area-top">
                <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold">{COPY.CARPOOLS.TITLE}</h1>
                        <Car className="w-6 h-6 text-primary" />
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex bg-muted rounded-lg p-1">
                        <button
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === "find"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                            onClick={() => handleTabChange("find")}
                        >
                            {COPY.CARPOOLS.FIND_TAB}
                        </button>
                        <button
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === "offer"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                            onClick={() => handleTabChange("offer")}
                        >
                            {COPY.CARPOOLS.OFFER_TAB}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="p-4 space-y-6">
                {activeTab === "find" ? (
                    <>
                        {/* Find a Ride */}
                        <div className="space-y-4">
                            <div className="text-center space-y-2">
                                <h2 className="text-xl font-semibold">{COPY.CARPOOLS.FIND_TITLE}</h2>
                                <p className="text-muted-foreground">{COPY.CARPOOLS.FIND_SUBTITLE}</p>
                            </div>

                            {/* Search Filters */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Search Filters</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>{COPY.CARPOOLS.PICKUP_RADIUS}: {pickupRadius[0]} miles</Label>
                                        <Slider
                                            value={pickupRadius}
                                            onValueChange={setPickupRadius}
                                            max={10}
                                            step={0.5}
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>{COPY.CARPOOLS.SEATS_NEEDED}: {seatsNeeded[0]}</Label>
                                        <Slider
                                            value={seatsNeeded}
                                            onValueChange={setSeatsNeeded}
                                            max={4}
                                            step={1}
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="departure-time">Departure Time</Label>
                                        <Input
                                            id="departure-time"
                                            type="datetime-local"
                                            value={departureTime}
                                            onChange={(e) => setDepartureTime(e.target.value)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Carpool Matches */}
                            <div className="space-y-4">
                                <h3 className="font-semibold">Available Rides</h3>

                                {isEmpty ? (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                                            <Car className="w-8 h-8 text-muted-foreground" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                                            No rides available
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Check back later or try adjusting your filters
                                        </p>
                                    </div>
                                ) : (
                                    matches?.map((match: CarpoolMatch) => (
                                        <motion.div
                                            key={match.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Card className="hover:shadow-md transition-shadow">
                                                <CardContent className="p-4">
                                                    <div className="space-y-4">
                                                        {/* Driver Info */}
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                                                <span className="text-lg font-semibold">
                                                                    {/* @ts-ignore - TypeScript inference issue with map parameter */}
                                                                    {match.driver_name.split(' ').map((n: string) => n[0]).join('')}
                                                                </span>
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    <h4 className="font-semibold">{match.driver_name}</h4>
                                                                    {match.verified && (
                                                                        <Badge variant="secondary" className="text-xs">
                                                                            <CheckCircle className="w-3 h-3 mr-1" />
                                                                            {COPY.CARPOOLS.VERIFIED_BADGE}
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                                    <span>{match.driver_rating.toFixed(1)}</span>
                                                                    <span>({match.driver_rating_count})</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Event Info */}
                                                        <div className="bg-muted/50 rounded-lg p-3">
                                                            <h5 className="font-medium text-sm mb-1">{match.event_title}</h5>
                                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                                <div className="flex items-center gap-1">
                                                                    <Calendar className="w-3 h-3" />
                                                                    <span>{formatDate(match.depart_time)}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <Clock className="w-3 h-3" />
                                                                    <span>{formatTime(match.depart_time)}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Route Info */}
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <Navigation className="w-4 h-4 text-primary" />
                                                                <span>{match.origin} → {match.destination}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                <MapPin className="w-4 h-4" />
                                                                <span>{match.meeting_spot}</span>
                                                            </div>
                                                        </div>

                                                        {/* Vehicle & Cost */}
                                                        <div className="flex items-center justify-between">
                                                            <div className="text-sm">
                                                                <p className="font-medium">{match.vehicle_info}</p>
                                                                <div className="flex items-center gap-4 text-muted-foreground">
                                                                    <div className="flex items-center gap-1">
                                                                        <Users className="w-3 h-3" />
                                                                        <span>{match.seats_available} seats</span>
                                                                    </div>
                                                                    {match.cost_per_person > 0 && (
                                                                        <div className="flex items-center gap-1">
                                                                            <DollarSign className="w-3 h-3" />
                                                                            <span>${(match.cost_per_person / 100).toFixed(0)}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Safety Notes */}
                                                        {match.safety_notes && (
                                                            <div className="flex items-start gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                                                <Shield className="w-4 h-4 text-green-600 mt-0.5" />
                                                                <p className="text-xs text-green-700 dark:text-green-300">
                                                                    {match.safety_notes}
                                                                </p>
                                                            </div>
                                                        )}

                                                        {/* Action Button */}
                                                        <Button
                                                            className="w-full"
                                                            onClick={() => handleRequestRide(match)}
                                                            {...useAnalytics().track('request_ride', { carpool_id: match.id })}
                                                        >
                                                            Request Ride
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Offer a Ride */}
                        <div className="space-y-4">
                            <div className="text-center space-y-2">
                                <h2 className="text-xl font-semibold">{COPY.CARPOOLS.OFFER_TITLE}</h2>
                                <p className="text-muted-foreground">{COPY.CARPOOLS.OFFER_SUBTITLE}</p>
                            </div>

                            {/* Offer Form */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Create Carpool Offer</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>{COPY.CARPOOLS.SEATS_AVAILABLE}: {seatsOffered[0]}</Label>
                                        <Slider
                                            value={seatsOffered}
                                            onValueChange={setSeatsOffered}
                                            max={6}
                                            step={1}
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Cost per person: ${costPerPerson[0]}</Label>
                                        <Slider
                                            value={costPerPerson}
                                            onValueChange={setCostPerPerson}
                                            max={20}
                                            step={1}
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="vehicle-info">Vehicle Info</Label>
                                        <Input
                                            id="vehicle-info"
                                            placeholder="e.g., Honda Civic - Clean & comfortable"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="meeting-spot">Meeting Spot</Label>
                                        <Input
                                            id="meeting-spot"
                                            placeholder="e.g., Student Center parking lot"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="safety-notes">Safety Notes</Label>
                                        <Input
                                            id="safety-notes"
                                            placeholder="e.g., Masks required, sanitized regularly"
                                        />
                                    </div>

                                    <Button
                                        className="w-full"
                                        onClick={handleCreateOffer}
                                        {...useAnalytics().track('create_carpool_offer')}
                                    >
                                        Create Offer
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </>
                )}
            </main>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
}
