// Environment variable handling with fallbacks

interface EnvConfig {
    supabaseUrl: string | null
    supabaseAnonKey: string | null
    isSupabaseConfigured: boolean
    isDevelopment: boolean
    isProduction: boolean
}

// Safe environment variable access with fallbacks
function getEnvVar(key: string, fallback: string | null = null): string | null {
    try {
        const value = import.meta.env[key]
        return value || fallback
    } catch (error) {
        console.warn(`Failed to access environment variable ${key}:`, error)
        return fallback
    }
}

// Environment configuration
export const env: EnvConfig = {
    supabaseUrl: getEnvVar('VITE_SUPABASE_URL'),
    supabaseAnonKey: getEnvVar('VITE_SUPABASE_ANON_KEY'),
    isSupabaseConfigured: !!(getEnvVar('VITE_SUPABASE_URL') && getEnvVar('VITE_SUPABASE_ANON_KEY')),
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD
}

// Validation function
export function validateEnvironment(): { isValid: boolean; issues: string[] } {
    const issues: string[] = []

    if (!env.supabaseUrl) {
        issues.push('VITE_SUPABASE_URL is not configured - cloud sync will not work')
    }

    if (!env.supabaseAnonKey) {
        issues.push('VITE_SUPABASE_ANON_KEY is not configured - cloud sync will not work')
    }

    return {
        isValid: issues.length === 0,
        issues
    }
}

// Safe Supabase client creation
export async function createSupabaseClient() {
    if (!env.isSupabaseConfigured) {
        console.warn('Supabase not configured - returning null client')
        return null
    }

    try {
        // Dynamic import to avoid issues when Supabase is not configured
        const { createClient } = await import('@supabase/supabase-js')
        return createClient(env.supabaseUrl!, env.supabaseAnonKey!)
    } catch (error) {
        console.error('Failed to create Supabase client:', error)
        return null
    }
}

// Environment info for debugging
export function getEnvironmentInfo() {
    return {
        nodeEnv: import.meta.env.MODE,
        isDev: env.isDevelopment,
        isProd: env.isProduction,
        hasSupabase: env.isSupabaseConfigured,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
        platform: typeof navigator !== 'undefined' ? navigator.platform : 'Unknown',
        online: typeof navigator !== 'undefined' ? navigator.onLine : false
    }
}
