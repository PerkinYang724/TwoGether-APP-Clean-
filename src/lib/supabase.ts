import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// Only create Supabase client if environment variables are available
export const supabase = url && key ? createClient(url, key) : null
