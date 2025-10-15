"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";

export default function AuthCallback() {
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                const { data, error } = await supabase.auth.getSession();

                if (error) {
                    console.error("Auth error:", error);
                    router.push("/auth/login");
                    return;
                }

                if (data.session) {
                    // Check if user has a profile
                    const { data: profile } = await supabase
                        .from("profiles")
                        .select("id")
                        .eq("id", data.session.user.id)
                        .single();

                    if (!profile) {
                        // Try to create a basic profile automatically
                        const { error: insertError } = await supabase
                            .from("profiles")
                            .insert({
                                id: data.session.user.id,
                                email: data.session.user.email!,
                                full_name: data.session.user.user_metadata?.full_name || data.session.user.email!.split('@')[0],
                                campus_name: "Stanford University", // Default campus
                                rating_avg: 0,
                                rating_count: 0,
                            });

                        if (insertError) {
                            console.error("Failed to create profile:", insertError);
                            // If auto-creation fails, redirect to setup
                            router.push("/auth/setup");
                        } else {
                            // Profile created successfully, redirect to home
                            router.push("/");
                        }
                    } else {
                        // Profile exists, redirect to home
                        router.push("/");
                    }
                } else {
                    router.push("/auth/login");
                }
            } catch (error) {
                console.error("Callback error:", error);
                router.push("/auth/login");
            }
        };

        handleAuthCallback();
    }, [router, supabase]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Completing sign in...</p>
            </div>
        </div>
    );
}
