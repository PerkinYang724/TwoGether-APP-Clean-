// Simple demo authentication system for development
// This replaces the complex Supabase setup with a working demo

interface DemoUser {
    id: string;
    email: string;
    user_metadata: {
        full_name: string;
    };
}

interface DemoProfile {
    id: string;
    email: string;
    full_name: string;
    bio?: string;
    class_year?: number;
    major?: string;
    interests?: string[];
    campus_name: string;
    rating_avg: number;
    rating_count: number;
    created_at: string;
    updated_at: string;
}

// Demo state management with localStorage persistence
const DEMO_USER_KEY = 'demo_user';
const DEMO_PROFILE_KEY = 'demo_profile';

// Server-side demo data storage (in-memory for API routes)
let serverDemoUser: DemoUser | null = null;
let serverDemoProfile: DemoProfile | null = null;
let serverDemoEvents: any[] = [];

// Helper functions for localStorage (client-side)
const getStoredUser = (): DemoUser | null => {
    if (typeof window === 'undefined') return serverDemoUser;
    try {
        const stored = localStorage.getItem(DEMO_USER_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
};

const getStoredProfile = (): DemoProfile | null => {
    if (typeof window === 'undefined') return serverDemoProfile;
    try {
        const stored = localStorage.getItem(DEMO_PROFILE_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
};

const storeUser = (user: DemoUser | null) => {
    if (typeof window === 'undefined') {
        serverDemoUser = user;
        return;
    }
    try {
        if (user) {
            localStorage.setItem(DEMO_USER_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(DEMO_USER_KEY);
        }
    } catch (error) {
        console.error('Failed to store user:', error);
    }
};

const storeProfile = (profile: DemoProfile | null) => {
    if (typeof window === 'undefined') {
        serverDemoProfile = profile;
        return;
    }
    try {
        if (profile) {
            localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(profile));
        } else {
            localStorage.removeItem(DEMO_PROFILE_KEY);
        }
    } catch (error) {
        console.error('Failed to store profile:', error);
    }
};

// Initialize demo state from localStorage
let demoUser: DemoUser | null = getStoredUser();
let demoProfile: DemoProfile | null = getStoredProfile();

export const createClient = () => {
    return {
        auth: {
            getUser: async () => {
                const currentUser = getStoredUser();
                console.log('🔍 Demo getUser:', currentUser ? 'user found' : 'no user');
                return { data: { user: currentUser }, error: null };
            },
            getSession: async () => {
                const currentUser = getStoredUser();
                return { data: { session: currentUser ? { user: currentUser } : null }, error: null };
            },
            signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
                console.log('🔐 Demo sign in attempt:', email);
                if (email && password) {
                    demoUser = {
                        id: 'demo-user-' + Date.now(),
                        email: email,
                        user_metadata: { full_name: email.split('@')[0] }
                    };

                    // Check if we already have a profile for this user
                    const existingProfile = getStoredProfile();
                    if (existingProfile && existingProfile.email === email) {
                        demoProfile = existingProfile;
                        console.log('✅ Using existing demo profile:', demoProfile);
                    } else {
                        // Create a minimal profile - user will complete setup
                        demoProfile = {
                            id: demoUser.id,
                            email: email,
                            full_name: demoUser.user_metadata.full_name,
                            bio: '',
                            class_year: undefined,
                            major: '',
                            interests: [],
                            campus_name: '',
                            rating_avg: 0,
                            rating_count: 0,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        };
                        console.log('✅ Demo profile created for sign in (needs setup):', demoProfile);
                    }

                    // Store in localStorage
                    storeUser(demoUser);
                    storeProfile(demoProfile);

                    console.log('✅ Demo sign in successful:', demoUser);
                    console.log('📦 Stored user in localStorage:', getStoredUser());
                    return { data: { user: demoUser }, error: null };
                }
                console.log('❌ Demo sign in failed: missing credentials');
                return { data: null, error: { message: 'Invalid credentials' } };
            },
            signUp: async ({ email, password, options }: { email: string; password: string; options?: any }) => {
                console.log('Demo sign up:', email);
                if (email && password) {
                    demoUser = {
                        id: 'demo-user-' + Date.now(),
                        email: email,
                        user_metadata: { full_name: options?.data?.full_name || email.split('@')[0] }
                    };

                    // Create a demo profile for the new user
                    demoProfile = {
                        id: demoUser.id,
                        email: email,
                        full_name: demoUser.user_metadata.full_name,
                        bio: '',
                        class_year: 2025,
                        major: 'Computer Science',
                        interests: ['tech', 'social'],
                        campus_name: 'Stanford University',
                        rating_avg: 0,
                        rating_count: 0,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    };

                    // Store in localStorage
                    storeUser(demoUser);
                    storeProfile(demoProfile);

                    console.log('✅ Demo sign up successful:', demoUser);
                    console.log('✅ Demo profile created:', demoProfile);
                    return { data: { user: demoUser }, error: null };
                }
                console.log('❌ Demo sign up failed: missing credentials');
                return { data: null, error: { message: 'Invalid credentials' } };
            },
            signInWithOAuth: async ({ provider }: { provider: string }) => {
                console.log('🔗 Demo OAuth attempt:', provider);
                if (provider === 'google') {
                    demoUser = {
                        id: 'demo-user-google-' + Date.now(),
                        email: 'demo@google.com',
                        user_metadata: { full_name: 'Demo User' }
                    };

                    // Create a demo profile for OAuth user
                    demoProfile = {
                        id: demoUser.id,
                        email: demoUser.email,
                        full_name: demoUser.user_metadata.full_name,
                        bio: '',
                        class_year: 2025,
                        major: 'Computer Science',
                        interests: ['tech', 'social'],
                        campus_name: 'Stanford University',
                        rating_avg: 0,
                        rating_count: 0,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    };

                    // Store in localStorage
                    storeUser(demoUser);
                    storeProfile(demoProfile);

                    console.log('✅ Demo Google OAuth successful:', demoUser);
                    return { data: { user: demoUser }, error: null };
                }
                console.log('❌ Demo OAuth failed: unsupported provider');
                return { data: null, error: { message: 'Unsupported provider' } };
            },
            signOut: async () => {
                console.log('Demo sign out');
                demoUser = null;
                demoProfile = null;

                // Clear localStorage
                storeUser(null);
                storeProfile(null);

                return { error: null };
            },
            onAuthStateChange: (callback: (event: string, session: any) => void) => {
                console.log('Demo auth state change listener');

                // Simulate initial auth state with current stored data
                setTimeout(() => {
                    const currentUser = getStoredUser();
                    if (currentUser) {
                        console.log('🔄 Demo auth state: SIGNED_IN', currentUser);
                        callback('SIGNED_IN', { user: currentUser });
                    } else {
                        console.log('🔄 Demo auth state: SIGNED_OUT');
                        callback('SIGNED_OUT', null);
                    }
                }, 100);

                return {
                    data: {
                        subscription: {
                            unsubscribe: () => { }
                        }
                    }
                };
            }
        },
        from: (table: string) => ({
            select: (columns?: string) => ({
                eq: (column: string, value: any) => ({
                    single: async () => {
                        console.log(`🔍 Demo query: ${table}.${column} = ${value}`);
                        if (table === 'profiles' && column === 'id') {
                            const currentProfile = getStoredProfile();
                            console.log('📋 Demo profile query result:', currentProfile ? 'found' : 'not found');
                            return { data: currentProfile, error: null };
                        }
                        if (table === 'events') {
                            console.log('📅 Demo events query - returning empty for now');
                            return { data: null, error: null };
                        }
                        return { data: null, error: null };
                    },
                    data: getStoredProfile() ? [getStoredProfile()!] : [],
                    error: null
                }),
                order: (column: string, options?: any) => ({
                    range: (start: number, end: number) => ({
                        data: [],
                        error: null
                    }),
                    data: [],
                    error: null
                }),
                data: getStoredProfile() ? [getStoredProfile()!] : [],
                error: null
            }),
            insert: (data: any) => {
                console.log('Demo profile insert:', data);
                if (table === 'profiles' && data) {
                    demoProfile = data as DemoProfile;
                    storeProfile(demoProfile);
                }
                return { data: data, error: null };
            },
            update: (data: any) => ({
                eq: (column: string, value: any) => ({
                    select: (columns?: string) => ({
                        single: async () => {
                            console.log(`🔄 Demo update: ${table}.${column} = ${value}`, data);
                            if (table === 'profiles' && column === 'id') {
                                demoProfile = { ...demoProfile, ...data } as DemoProfile;
                                storeProfile(demoProfile);
                                return { data: demoProfile, error: null };
                            }
                            if (table === 'events' && column === 'id') {
                                console.log('📅 Demo event update - no-op for now');
                                return { data: null, error: null };
                            }
                            return { data: null, error: null };
                        },
                        data: null,
                        error: null
                    }),
                    data: null,
                    error: null
                }),
                data: data,
                error: null
            }),
            delete: () => {
                console.log('Demo profile delete');
                if (table === 'profiles') {
                    demoProfile = null;
                    storeProfile(null);
                }
                return { data: null, error: null };
            }
        })
    };
};