import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const createClient = () => {
    try {
        return createClientComponentClient();
    } catch (error) {
        console.warn("Supabase client initialization failed:", error);
        // Return a mock client for development
        return {
            auth: {
                getUser: () => Promise.resolve({ data: { user: null }, error: null }),
                signIn: () => Promise.resolve({ data: null, error: null }),
                signUp: () => Promise.resolve({ data: null, error: null }),
                signOut: () => Promise.resolve({ error: null }),
            },
            from: () => ({
                select: () => ({ data: [], error: null }),
                insert: () => ({ data: null, error: null }),
                update: () => ({ data: null, error: null }),
                delete: () => ({ data: null, error: null }),
            }),
        } as any;
    }
};
