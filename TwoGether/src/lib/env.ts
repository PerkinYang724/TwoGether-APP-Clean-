// Environment configuration with validation
export const env = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    NODE_ENV: process.env.NODE_ENV || "development",
};

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
    return !!(
        env.NEXT_PUBLIC_SUPABASE_URL &&
        env.NEXT_PUBLIC_SUPABASE_URL !== "" &&
        env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
        env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== ""
    );
};

// Get configuration status for debugging
export const getConfigStatus = () => {
    return {
        hasUrl: !!env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasServiceKey: !!env.SUPABASE_SERVICE_ROLE_KEY,
        isConfigured: isSupabaseConfigured(),
        url: env.NEXT_PUBLIC_SUPABASE_URL,
        appUrl: env.NEXT_PUBLIC_APP_URL
    };
};