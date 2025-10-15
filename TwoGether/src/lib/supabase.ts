import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { env, isSupabaseConfigured } from './env';
import { createClient as createDemoClient } from './supabase-client';

// Singleton pattern to prevent multiple client instances
let supabaseClientInstance: any = null;
let demoClientInstance: any = null;

// Create the Supabase client with proper configuration
export const createClientSupabase = () => {
    // Check if Supabase is properly configured
    if (!isSupabaseConfigured()) {
        console.warn('⚠️ Supabase not configured, falling back to demo mode');
        console.warn('Please set up your Supabase credentials in .env.local');
        console.warn('Required: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');

        // Return singleton demo client
        if (!demoClientInstance) {
            demoClientInstance = createDemoClient();
        }
        return demoClientInstance;
    }

    // Return singleton Supabase client
    if (!supabaseClientInstance) {
        console.log('✅ Creating real Supabase client instance');
        supabaseClientInstance = createSupabaseClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
            auth: {
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: true,
                flowType: 'pkce'
            }
        });
    }

    return supabaseClientInstance;
};

// Create a server-side client for API routes
export const createServerClient = () => {
    if (!isSupabaseConfigured()) {
        console.warn('⚠️ Supabase not configured, using demo mode for server client');
        return createDemoClient();
    }

    return createSupabaseClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
};