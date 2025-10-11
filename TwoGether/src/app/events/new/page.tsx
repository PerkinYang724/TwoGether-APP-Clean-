"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, Calendar, MapPin, Users, Clock, Car, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

const CATEGORIES = [
    "study", "sport", "party", "food", "volunteer", "carpool", "social", "academic", "other"
];

const CATEGORY_LABELS: Record<string, string> = {
    study: "Study Group",
    sport: "Sports & Fitness",
    party: "Party & Social",
    food: "Food & Dining",
    volunteer: "Volunteering",
    carpool: "Carpool",
    social: "Social Event",
    academic: "Academic",
    other: "Other",
};

export default function CreateEventPage() {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "social",
        location_text: "",
        start_time: "",
        end_time: "",
        max_attendees: 20,
        tags: [] as string[],
        auto_approve: true,
        is_carpool: false,
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        alert("Event created successfully! 🎉");
        router.push("/");
        setLoading(false);
    };

    const toggleTag = (tag: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.includes(tag)
                ? prev.tags.filter(t => t !== tag)
                : [...prev.tags, tag].slice(0, 5), // Max 5 tags
        }));
    };

    const addCustomTag = (tag: string) => {
        if (tag && !formData.tags.includes(tag)) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tag].slice(0, 5),
            }));
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border safe-area-top">
                <div className="flex items-center gap-4 p-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <h1 className="text-xl font-semibold">Create Event</h1>
                </div>
            </header>

            <div className="p-4 pb-24">
                <Card>
                    <CardHeader>
                        <CardTitle>Event Details</CardTitle>
                        <CardDescription>
                            Fill in the details for your event
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Event Image */}
                            <div className="space-y-2">
                                <Label>Event Image</Label>
                                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">
                                        Upload an image for your event
                                    </p>
                                    <Button type="button" variant="outline" size="sm" className="mt-2">
                                        Choose File
                                    </Button>
                                </div>
                            </div>

                            {/* Title */}
                            <div className="space-y-2">
                                <Label htmlFor="title">Event Title *</Label>
                                <Input
                                    id="title"
                                    placeholder="What's your event about?"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe your event..."
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    maxLength={1000}
                                />
                                <p className="text-xs text-muted-foreground">
                                    {formData.description.length}/1000 characters
                                </p>
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <Label>Category *</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {CATEGORIES.map(category => (
                                        <Button
                                            key={category}
                                            type="button"
                                            variant={formData.category === category ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setFormData(prev => ({ ...prev, category }))}
                                        >
                                            {CATEGORY_LABELS[category]}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <Label htmlFor="location">Location *</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="location"
                                        placeholder="Where is your event?"
                                        value={formData.location_text}
                                        onChange={(e) => setFormData(prev => ({ ...prev, location_text: e.target.value }))}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Date and Time */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="start_time">Start Time *</Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="start_time"
                                            type="datetime-local"
                                            value={formData.start_time}
                                            onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="end_time">End Time *</Label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="end_time"
                                            type="datetime-local"
                                            value={formData.end_time}
                                            onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Max Attendees */}
                            <div className="space-y-2">
                                <Label htmlFor="max_attendees">Max Attendees</Label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="max_attendees"
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={formData.max_attendees}
                                        onChange={(e) => setFormData(prev => ({ ...prev, max_attendees: parseInt(e.target.value) }))}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="space-y-2">
                                <Label>Tags</Label>
                                <div className="flex flex-wrap gap-2">
                                    {formData.tags.map(tag => (
                                        <Badge key={tag} variant="secondary" className="cursor-pointer">
                                            {tag} ×
                                        </Badge>
                                    ))}
                                </div>
                                <Input
                                    placeholder="Add a tag and press Enter"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addCustomTag(e.currentTarget.value);
                                            e.currentTarget.value = "";
                                        }
                                    }}
                                />
                                <p className="text-xs text-muted-foreground">
                                    {formData.tags.length}/5 tags
                                </p>
                            </div>

                            {/* Carpool Toggle */}
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="is_carpool"
                                        checked={formData.is_carpool}
                                        onChange={(e) => setFormData(prev => ({ ...prev, is_carpool: e.target.checked }))}
                                        className="rounded"
                                    />
                                    <Label htmlFor="is_carpool" className="flex items-center gap-2">
                                        <Car className="w-4 h-4" />
                                        This is a carpool event
                                    </Label>
                                </div>
                            </div>

                            {/* Auto Approve */}
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="auto_approve"
                                        checked={formData.auto_approve}
                                        onChange={(e) => setFormData(prev => ({ ...prev, auto_approve: e.target.checked }))}
                                        className="rounded"
                                    />
                                    <Label htmlFor="auto_approve">
                                        Auto-approve join requests
                                    </Label>
                                </div>
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Creating Event..." : "Create Event"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <BottomNav />
        </div>
    );
}