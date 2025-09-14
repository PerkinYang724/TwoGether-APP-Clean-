import { supabase } from './supabase'

export interface User {
    id: string
    email?: string
    display_name?: string
}

export async function signInWithGoogle() {
    if (!supabase) throw new Error('Supabase not configured')

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin
        }
    })
    if (error) throw error
    return data
}

export async function signInWithEmail(email: string, password: string) {
    if (!supabase) throw new Error('Supabase not configured')

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })
    if (error) throw error
    return data
}

export async function signUpWithEmail(email: string, password: string, displayName?: string) {
    if (!supabase) throw new Error('Supabase not configured')

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                display_name: displayName
            }
        }
    })
    if (error) throw error
    return data
}

export async function signOut() {
    if (!supabase) return

    const { error } = await supabase.auth.signOut()
    if (error) throw error
}

export async function getCurrentUser(): Promise<User | null> {
    if (!supabase) return null

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    return {
        id: user.id,
        email: user.email,
        display_name: user.user_metadata?.display_name
    }
}

export function onAuthStateChange(callback: (user: User | null) => void) {
    if (!supabase) {
        callback(null)
        return { data: { subscription: { unsubscribe: () => { } } } }
    }

    return supabase.auth.onAuthStateChange((_event: any, session: any) => {
        if (session?.user) {
            callback({
                id: session.user.id,
                email: session.user.email,
                display_name: session.user.user_metadata?.display_name
            })
        } else {
            callback(null)
        }
    })
}
