import { supabase } from './supabase'
import type { Phase } from '../hooks/usePomodoro'

export interface Session {
    id: string
    user_id: string
    started_at: string
    ended_at?: string
    phase: Phase
    minutes: number
    tag?: string
}

export async function saveSession(session: Omit<Session, 'id'>) {
    if (!supabase) throw new Error('Supabase not configured')

    const { data, error } = await supabase
        .from('sessions')
        .insert([session])
        .select()
        .single()

    if (error) throw error
    return data
}

export async function updateSession(id: string, updates: Partial<Session>) {
    if (!supabase) throw new Error('Supabase not configured')

    const { data, error } = await supabase
        .from('sessions')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data
}

export async function getSessions(userId: string, limit = 50) {
    if (!supabase) return []

    const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', userId)
        .order('started_at', { ascending: false })
        .limit(limit)

    if (error) throw error
    return data
}

export async function getTodaySessions(userId: string) {
    if (!supabase) return []

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('phase', 'focus')
        .gte('started_at', today.toISOString())

    if (error) throw error
    return data
}

export async function getTotalSessions(userId: string) {
    if (!supabase) return 0

    const { count, error } = await supabase
        .from('sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('phase', 'focus')

    if (error) throw error
    return count || 0
}
