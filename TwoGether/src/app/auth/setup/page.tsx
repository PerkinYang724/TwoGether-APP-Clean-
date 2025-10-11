"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { User, GraduationCap, Calendar, Hash, Upload } from "lucide-react";
import { CreateProfile } from "@/lib/schemas";

const INTERESTS = [
    "Sports", "Music", "Art", "Technology", "Science", "Literature",
    "Gaming", "Photography", "Cooking", "Travel", "Fitness", "Movies",
    "Dancing", "Volunteering", "Entrepreneurship", "Politics", "Environment",
    "Fashion", "Languages", "History"
];

const MAJORS = [
    "Computer Science", "Engineering", "Business", "Medicine", "Law",
    "Psychology", "Biology", "Chemistry", "Physics", "Mathematics",
    "Economics", "Political Science", "English", "History", "Art",
    "Music", "Theater", "Communications", "Education", "Other"
];

export default function ProfileSetupPage() {
    const [formData, setFormData] = useState<Partial<CreateProfile>>({
        full_name: "",
        bio: "",
        class_year: new Date().getFullYear(),
        major: "",
        interests: [],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        // Get current user
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/auth/login");
                return;
            }

            // Pre-fill with user data
            setFormData(prev => ({
                ...prev,
                full_name: user.user_metadata?.full_name || "",
            }));
        };

        getUser();
    }, [router, supabase]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No user found");

            const { error } = await supabase
                .from("profiles")
                .insert({
                    id: user.id,
                    ...formData,
                });

            if (error) throw error;

            router.push("/");
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleInterest = (interest: string) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests?.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...(prev.interests || []), interest].slice(0, 10), // Max 10 interests
        }));
    };

    return (
        <div className="min-h-screen bg-background p-4">
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
                        <CardDescription>
                            Tell us about yourself so others can connect with you
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md mb-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Profile Picture */}
                            <div className="space-y-2">
                                <Label>Profile Picture</Label>
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                                        <User className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                    <Button type="button" variant="outline" size="sm">
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload Photo
                                    </Button>
                                </div>
                            </div>

                            {/* Full Name */}
                            <div className="space-y-2">
                                <Label htmlFor="full_name">Full Name *</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="full_name"
                                        placeholder="Enter your full name"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Bio */}
                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    placeholder="Tell us about yourself..."
                                    value={formData.bio}
                                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                                    maxLength={500}
                                />
                                <p className="text-xs text-muted-foreground">
                                    {formData.bio?.length || 0}/500 characters
                                </p>
                            </div>

                            {/* Class Year */}
                            <div className="space-y-2">
                                <Label htmlFor="class_year">Class Year</Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="class_year"
                                        type="number"
                                        placeholder="2024"
                                        value={formData.class_year}
                                        onChange={(e) => setFormData(prev => ({ ...prev, class_year: parseInt(e.target.value) }))}
                                        className="pl-10"
                                        min="2020"
                                        max="2030"
                                    />
                                </div>
                            </div>

                            {/* Major */}
                            <div className="space-y-2">
                                <Label htmlFor="major">Major</Label>
                                <div className="relative">
                                    <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <select
                                        id="major"
                                        value={formData.major}
                                        onChange={(e) => setFormData(prev => ({ ...prev, major: e.target.value }))}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background pl-10"
                                    >
                                        <option value="">Select your major</option>
                                        {MAJORS.map(major => (
                                            <option key={major} value={major}>{major}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Interests */}
                            <div className="space-y-2">
                                <Label>Interests</Label>
                                <p className="text-sm text-muted-foreground">
                                    Select up to 10 interests that describe you
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {INTERESTS.map(interest => (
                                        <Badge
                                            key={interest}
                                            variant={formData.interests?.includes(interest) ? "default" : "outline"}
                                            className="cursor-pointer hover:bg-primary/10"
                                            onClick={() => toggleInterest(interest)}
                                        >
                                            {interest}
                                        </Badge>
                                    ))}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {formData.interests?.length || 0}/10 selected
                                </p>
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Creating Profile..." : "Complete Setup"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
