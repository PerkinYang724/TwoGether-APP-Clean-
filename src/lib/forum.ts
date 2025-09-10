import { supabase } from './supabase'

export interface Post {
    id: string
    user_id: string
    content: string
    created_at: string
    display_name?: string
}

export interface Comment {
    id: string
    post_id: string
    user_id: string
    content: string
    created_at: string
    display_name?: string
}

export async function createPost(content: string, userId: string) {
    const { data, error } = await supabase
        .from('posts')
        .insert([{ content, user_id: userId }])
        .select('*')
        .single()

    if (error) throw error

    // Add display name from user metadata
    const { data: { user } } = await supabase.auth.getUser()
    const displayName = user?.user_metadata?.display_name || user?.email || 'Anonymous'

    return {
        ...data,
        display_name: displayName
    }
}

export async function createComment(postId: string, content: string, userId: string) {
    const { data, error } = await supabase
        .from('comments')
        .insert([{ post_id: postId, content, user_id: userId }])
        .select('*')
        .single()

    if (error) throw error

    // Add display name from user metadata
    const { data: { user } } = await supabase.auth.getUser()
    const displayName = user?.user_metadata?.display_name || user?.email || 'Anonymous'

    return {
        ...data,
        display_name: displayName
    }
}

export async function getPosts() {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw error

    // Add display names for all posts
    const { data: { user } } = await supabase.auth.getUser()
    const displayName = user?.user_metadata?.display_name || user?.email || 'Anonymous'

    return data.map(post => ({
        ...post,
        display_name: displayName
    }))
}

export async function getComments(postId: string) {
    const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true })

    if (error) throw error

    // Add display names for all comments
    const { data: { user } } = await supabase.auth.getUser()
    const displayName = user?.user_metadata?.display_name || user?.email || 'Anonymous'

    return data.map(comment => ({
        ...comment,
        display_name: displayName
    }))
}

export function subscribeToPosts(callback: (payload: any) => void) {
    return supabase
        .channel('posts')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, callback)
        .subscribe()
}

export function subscribeToComments(callback: (payload: any) => void) {
    return supabase
        .channel('comments')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, callback)
        .subscribe()
}
