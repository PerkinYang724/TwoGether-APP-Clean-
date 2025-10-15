"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { createClientSupabase } from "@/lib/supabase";
import { Profile } from "@/lib/schemas";

interface AuthContextType {
    user: User | null;
    profile: Profile | null;
    session: Session | null;
    loading: boolean;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    const supabase = createClientSupabase();

    const refreshProfile = async () => {
        if (!user) {
            setProfile(null);
            return;
        }

        try {
            console.log('🔄 Refreshing profile for user:', user.id);
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (error) {
                console.error("Error fetching profile:", error);
                setProfile(null);
            } else {
                console.log("✅ Profile fetched successfully:", data);
                setProfile(data);
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            setProfile(null);
        }
    };

    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            setUser(null);
            setProfile(null);
            setSession(null);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    useEffect(() => {
        // Get initial session
        const getInitialSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) {
                    console.error("Error getting session:", error);
                } else {
                    setSession(session);
                    setUser(session?.user ?? null);
                }
            } catch (error) {
                console.error("Error getting session:", error);
            }
            setLoading(false);
        };

        getInitialSession();

        // Listen for auth changes
        try {
            const { data: { subscription } } = supabase.auth.onAuthStateChange(
                async (event, session) => {
                    setSession(session);
                    setUser(session?.user ?? null);
                    setLoading(false);

                    if (session?.user) {
                        await refreshProfile();
                    } else {
                        setProfile(null);
                    }
                }
            );

            return () => subscription.unsubscribe();
        } catch (error) {
            console.error("Error setting up auth listener:", error);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) {
            refreshProfile();
        }
    }, [user]);

    const value = {
        user,
        profile,
        session,
        loading,
        signOut,
        refreshProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
