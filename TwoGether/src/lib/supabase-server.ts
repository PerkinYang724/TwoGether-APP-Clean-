import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { env } from "./env";
import { createClient } from "@supabase/supabase-js";

// Server component client
export const createServerSupabase = () => createServerComponentClient({ cookies });

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