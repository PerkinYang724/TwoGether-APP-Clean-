import { createClient } from "@supabase/supabase-js";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { env } from "./env";

// Client-side Supabase client
export const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Server-side Supabase client with service role
export const supabaseAdmin = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);

// Client component client
export const createClientSupabase = () => createClientComponentClient();