"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, Calendar, MapPin, Users, Clock, Star, Share2, MessageCircle, Car, Navigation } from "lucide-react";
import { Event, Profile } from "@/lib/schemas";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface EventDetailProps {
    params: {
        id: string;
    };
}

export default function EventDetailPage({ params }: EventDetailProps) {
    const [event, setEvent] = useState<Event | null>(null);
    const [host, setHost] = useState<Profile | null>(null);
    const [attendees, setAttendees] = useState<Profile[]>([]);
    const [isJoined, setIsJoined] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        fetchEventDetails();
    }, [params.id]);

    const fetchEventDetails = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/auth/login");
                return;
            }

            // Fetch event with host info
            const { data: eventData, error: eventError } = await supabase
                .from("events")
                .select(`
          *,
          profiles!events_host_id_fkey (
            id,
            full_name,
            avatar_url,
            rating_avg,
            rating_count,
            class_year,
            major
          )
        `)
                .eq("id", params.id)
                .single();

            if (eventError) throw eventError;
            setEvent(eventData);
            setHost(eventData.profiles);

            // Fetch attendees
            const { data: attendeesData, error: attendeesError } = await supabase
                .from("event_members")
                .select(`
          profiles!event_members_user_id_fkey (
            id,
            full_name,
            avatar_url,
            class_year,
            major
          )
        `)
                .eq("event_id", params.id)
                .eq("status", "joined");

            if (attendeesError) throw attendeesError;
            setAttendees(attendeesData?.map(a => a.profiles).filter(Boolean) || []);

            // Check if current user is joined
            const { data: membership } = await supabase
                .from("event_members")
                .select("status")
                .eq("event_id", params.id)
                .eq("user_id", user.id)
                .single();

            setIsJoined(membership?.status === "joined");
        } catch (error) {
            console.error("Error fetching event details:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            if (isJoined) {
                // Leave event
                const { error } = await supabase
                    .from("event_members")
                    .delete()
                    .eq("event_id", params.id)
                    .eq("user_id", user.id);

                if (error) throw error;
                setIsJoined(false);
            } else {
                // Join event
                const { error } = await supabase
                    .from("event_members")
                    .insert({
                        event_id: params.id,
                        user_id: user.id,
                        status: event?.auto_approve ? "joined" : "requested",
                    });

                if (error) throw error;
                setIsJoined(true);
            }
        } catch (error) {
            console.error("Error joining/leaving event:", error);
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: event?.title,
                text: event?.description,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
        }
    };

    const handleGetDirections = () => {
        if (event?.location_text) {
            const mapsUrl = `https://maps.google.com/maps?q=${encodeURIComponent(event.location_text)}`;
            window.open(mapsUrl, "_blank");
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!event || !host) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">Event not found</h2>
                    <Button onClick={() => router.push("/")}>
                        Back to Home
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border safe-area-top">
                <div className="flex items-center gap-4 p-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <h1 className="text-lg font-semibold truncate">{event.title}</h1>
                    <div className="flex-1" />
                    <Button variant="ghost" size="icon" onClick={handleShare}>
                        <Share2 className="w-4 h-4" />
                    </Button>
                </div>
            </header>

            <div className="space-y-6">
                {/* Event Image */}
                <div className="relative h-64 bg-gradient-to-br from-primary/20 to-secondary/20">
                    {event.image_url ? (
                        <Image
                            src={event.image_url}
                            alt={event.title}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            <Calendar className="w-16 h-16" />
                        </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 text-black">
                            {event.category}
                        </Badge>
                    </div>

                    {/* Carpool Badge */}
                    {event.is_carpool && (
                        <div className="absolute top-4 right-4">
                            <Badge className="bg-yellow-500 text-white">
                                🚗 Carpool
                            </Badge>
                        </div>
                    )}
                </div>

                <div className="p-4 space-y-6">
                    {/* Event Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{event.title}</CardTitle>
                            <CardDescription>{event.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">{formatDate(event.start_time)}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Ends {formatDate(event.end_time)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">{event.location_text}</p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleGetDirections}
                                        className="mt-1"
                                    >
                                        <Navigation className="w-4 h-4 mr-2" />
                                        Get Directions
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Users className="w-5 h-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">
                                        {attendees.length} / {event.max_attendees} attendees
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {event.max_attendees - attendees.length} spots remaining
                                    </p>
                                </div>
                            </div>

                            {/* Tags */}
                            {event.tags && event.tags.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium mb-2">Tags</p>
                                    <div className="flex flex-wrap gap-2">
                                        {event.tags.map((tag, index) => (
                                            <Badge key={index} variant="outline">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Host Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Host</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                    {host.avatar_url ? (
                                        <Image
                                            src={host.avatar_url}
                                            alt={host.full_name}
                                            width={48}
                                            height={48}
                                            className="rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-lg font-semibold">
                                            {host.full_name?.charAt(0)}
                                        </span>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-semibold">{host.full_name}</h3>
                                    {host.class_year && (
                                        <p className="text-sm text-muted-foreground">
                                            Class of {host.class_year}
                                        </p>
                                    )}
                                    {host.major && (
                                        <p className="text-sm text-muted-foreground">{host.major}</p>
                                    )}

                                    <div className="flex items-center gap-1 mt-1">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="text-sm font-medium">{host.rating_avg.toFixed(1)}</span>
                                        <span className="text-xs text-muted-foreground">
                                            ({host.rating_count} ratings)
                                        </span>
                                    </div>
                                </div>

                                <Button variant="outline" size="sm">
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Message
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Attendees */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Attendees ({attendees.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {attendees.length === 0 ? (
                                <p className="text-muted-foreground">No attendees yet</p>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    {attendees.slice(0, 6).map(attendee => (
                                        <div key={attendee.id} className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                                {attendee.avatar_url ? (
                                                    <Image
                                                        src={attendee.avatar_url}
                                                        alt={attendee.full_name}
                                                        width={32}
                                                        height={32}
                                                        className="rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-sm font-semibold">
                                                        {attendee.full_name?.charAt(0)}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{attendee.full_name}</p>
                                                {attendee.class_year && (
                                                    <p className="text-xs text-muted-foreground">
                                                        Class of {attendee.class_year}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {attendees.length > 6 && (
                                        <div className="flex items-center justify-center">
                                            <Badge variant="outline">
                                                +{attendees.length - 6} more
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Button
                            className="flex-1"
                            onClick={handleJoin}
                            variant={isJoined ? "destructive" : "default"}
                        >
                            {isJoined ? "Leave Event" : "Join Event"}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => router.push(`/events/${params.id}/chat`)}
                        >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Chat
                        </Button>
                    </div>
                </div>
            </div>

            <BottomNav />
        </div>
    );
}
