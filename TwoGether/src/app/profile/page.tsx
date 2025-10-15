"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, Edit, Star, Users, Calendar, Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useEffect } from "react";

export const dynamic = 'force-dynamic';

export default function ProfilePage() {
    const router = useRouter();
    const { user, profile, signOut } = useAuth();

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    // If no user, redirect to login
    useEffect(() => {
        if (!user) {
            router.push('/auth/login');
        }
    }, [user, router]);

    // If no profile or incomplete profile, redirect to setup
    useEffect(() => {
        if (user && (!profile || !profile.full_name || !profile.campus_name)) {
            router.push('/auth/setup');
        }
    }, [user, profile, router]);

    // Show loading or placeholder while checking auth
    if (!user || !profile || !profile.full_name || !profile.campus_name) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border safe-area-top">
                <div className="flex items-center gap-4 p-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <h1 className="text-xl font-semibold">My Profile</h1>
                </div>
            </header>

            <div className="p-4 space-y-6">
                {/* Profile Card */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-2xl font-semibold text-primary">
                                    {profile.full_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U'}
                                </span>
                            </div>

                            <div className="flex-1">
                                <h2 className="text-xl font-semibold">{profile.full_name}</h2>
                                <p className="text-muted-foreground">
                                    {profile.class_year && `Class of ${profile.class_year}`}
                                </p>
                                <p className="text-muted-foreground">{profile.major}</p>
                                <p className="text-muted-foreground">{profile.campus_name}</p>

                                {/* Rating */}
                                <div className="flex items-center gap-1 mt-2">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <span className="font-medium">{profile.rating_avg.toFixed(1)}</span>
                                    <span className="text-sm text-muted-foreground">
                                        ({profile.rating_count} ratings)
                                    </span>
                                </div>
                            </div>

                            <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                            </Button>
                        </div>

                        {/* Bio */}
                        {profile.bio && (
                            <p className="mt-4 text-muted-foreground">
                                {profile.bio}
                            </p>
                        )}

                        {/* Interests */}
                        {profile.interests && profile.interests.length > 0 && (
                            <div className="mt-4">
                                <h3 className="text-sm font-medium mb-2">Interests</h3>
                                <div className="flex flex-wrap gap-2">
                                    {profile.interests.map((interest, index) => (
                                        <Badge key={index} variant="secondary">{interest}</Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="flex items-center justify-center mb-2">
                                <Calendar className="w-5 h-5 text-primary" />
                            </div>
                            <p className="text-2xl font-bold">5</p>
                            <p className="text-sm text-muted-foreground">Hosted</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="flex items-center justify-center mb-2">
                                <Users className="w-5 h-5 text-primary" />
                            </div>
                            <p className="text-2xl font-bold">12</p>
                            <p className="text-sm text-muted-foreground">Attended</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="flex items-center justify-center mb-2">
                                <Star className="w-5 h-5 text-primary" />
                            </div>
                            <p className="text-2xl font-bold">{profile.rating_count}</p>
                            <p className="text-sm text-muted-foreground">Rated</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button variant="outline" className="w-full justify-start">
                            <Settings className="w-4 h-4 mr-2" />
                            Account Settings
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                            <Users className="w-4 h-4 mr-2" />
                            Privacy Settings
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                            <Star className="w-4 h-4 mr-2" />
                            Rating History
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-start text-destructive hover:text-destructive"
                            onClick={handleSignOut}
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <BottomNav />
        </div>
    );
}