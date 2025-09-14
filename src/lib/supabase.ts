import { createSupabaseClient, env } from './env'

// Create Supabase client safely with fallback handling
let supabase: any = null

// Initialize Supabase client asynchronously
createSupabaseClient().then(client => {
    supabase = client
})

export { supabase }

// Export environment info for debugging
export { env }
