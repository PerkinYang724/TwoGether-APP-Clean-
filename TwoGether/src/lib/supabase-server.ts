import { createServerClient } from "@/lib/supabase";

// Server component client - use real Supabase server client
export const createServerSupabase = () => createServerClient();

// Server-side Supabase client - use real Supabase server client
export const supabaseAdmin = createServerClient();