"use client";

import { useState } from "react";
import { createClientSupabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Lock, User, GraduationCap } from "lucide-react";

interface AuthFormProps {
    onSuccess?: () => void;
}

export function AuthForm({ onSuccess }: AuthFormProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [campusName, setCampusName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const supabase = createClientSupabase();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (isLogin) {
                // Sign in
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) throw error;

                setMessage("Successfully signed in!");
                onSuccess?.();
            } else {
                // Sign up
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                            campus_name: campusName,
                        },
                    },
                });

                if (error) throw error;

                if (data.user && !data.user.email_confirmed_at) {
                    setMessage("Check your email for the confirmation link!");
                } else {
                    setMessage("Successfully signed up!");
                    onSuccess?.();
                }
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            setMessage("Successfully signed out!");
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">
                        {isLogin ? "Welcome Back" : "Join TwoGether"}
                    </CardTitle>
                    <p className="text-muted-foreground">
                        {isLogin
                            ? "Sign in to discover events and connect with fellow students"
                            : "Create your account to start discovering events"
                        }
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAuth} className="space-y-4">
                        {!isLogin && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="fullName"
                                            type="text"
                                            placeholder="Enter your full name"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="pl-10"
                                            required={!isLogin}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="campusName">Campus</Label>
                                    <div className="relative">
                                        <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="campusName"
                                            type="text"
                                            placeholder="e.g., Stanford University"
                                            value={campusName}
                                            onChange={(e) => setCampusName(e.target.value)}
                                            className="pl-10"
                                            required={!isLogin}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {message && (
                            <Alert>
                                <AlertDescription>{message}</AlertDescription>
                            </Alert>
                        )}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLogin ? "Sign In" : "Sign Up"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                        </p>
                        <Button
                            variant="link"
                            onClick={() => setIsLogin(!isLogin)}
                            className="p-0 h-auto"
                        >
                            {isLogin ? "Sign up" : "Sign in"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
