import { useState, useEffect } from 'react'
import { MessageSquare, Send, User } from 'lucide-react'
import { createPost, createComment, getPosts, getComments, subscribeToPosts, subscribeToComments, type Post, type Comment } from '../../lib/forum'
import { getCurrentUser } from '../../lib/auth'
import { t } from '../../lib/i18n'
import { supabase } from '../../lib/supabase'

export default function ForumPage() {
    const [posts, setPosts] = useState<Post[]>([])
    const [comments, setComments] = useState<Record<string, Comment[]>>({})
    const [newPostContent, setNewPostContent] = useState('')
    const [newCommentContent, setNewCommentContent] = useState<Record<string, string>>({})
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    console.log('ForumPage: Component rendered, loading:', loading, 'user:', user, 'posts:', posts.length)

    useEffect(() => {
        // Check if Supabase is configured first
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseKey) {
            console.log('ForumPage: Supabase not configured, skipping initialization')
            setLoading(false)
            return
        }

        // Get current user
        getCurrentUser()
            .then(setUser)
            .catch(() => setUser(null))

        // Load initial data
        loadPosts()

        // Set a timeout to prevent infinite loading
        const timeout = setTimeout(() => {
            if (loading) {
                console.log('ForumPage: Loading timeout reached, setting loading to false')
                setLoading(false)
            }
        }, 5000) // 5 second timeout

        return () => clearTimeout(timeout)
    }, [])

    useEffect(() => {
        // Check if Supabase is configured before setting up subscriptions
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseKey) {
            console.log('ForumPage: Supabase not configured, skipping subscriptions')
            return
        }

        // Set up realtime subscriptions
        const postsSubscription = subscribeToPosts(async (payload) => {
            console.log('Posts subscription:', payload)
            if (payload.eventType === 'INSERT') {
                // Get user info for display name
                const { data: { user } } = await supabase.auth.getUser()
                const displayName = user?.user_metadata?.display_name || user?.email || 'Anonymous'

                // Add new post with display name
                const newPost = {
                    ...payload.new,
                    display_name: displayName
                }
                setPosts(prev => [newPost, ...prev])
            }
        })

        const commentsSubscription = subscribeToComments(async (payload) => {
            console.log('Comments subscription:', payload)
            if (payload.eventType === 'INSERT') {
                // Get user info for display name
                const { data: { user } } = await supabase.auth.getUser()
                const displayName = user?.user_metadata?.display_name || user?.email || 'Anonymous'

                // Add new comment with display name
                const newComment = {
                    ...payload.new,
                    display_name: displayName
                }
                setComments(prev => ({
                    ...prev,
                    [payload.new.post_id]: [
                        ...(prev[payload.new.post_id] || []),
                        newComment
                    ]
                }))
            }
        })

        return () => {
            postsSubscription.unsubscribe()
            commentsSubscription.unsubscribe()
        }
    }, [])

    const loadPosts = async () => {
        try {
            setLoading(true)
            console.log('Loading posts...')

            // Check if Supabase is configured
            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
            const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

            if (!supabaseUrl || !supabaseKey) {
                console.log('Supabase not configured, showing empty forum')
                setPosts([])
                setComments({})
                setLoading(false)
                return
            }

            const postsData = await getPosts()
            console.log('Posts loaded:', postsData)
            setPosts(postsData)

            // Load comments for each post
            const commentsData: Record<string, Comment[]> = {}
            for (const post of postsData) {
                try {
                    const postComments = await getComments(post.id)
                    commentsData[post.id] = postComments
                } catch (commentError) {
                    console.error(`Error loading comments for post ${post.id}:`, commentError)
                    commentsData[post.id] = []
                }
            }
            setComments(commentsData)
        } catch (error) {
            console.error('Error loading posts:', error)
            // Set empty state on error
            setPosts([])
            setComments({})
        } finally {
            setLoading(false)
        }
    }

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newPostContent.trim() || !user) return

        try {
            console.log('Creating post:', newPostContent.trim(), 'for user:', user.id)
            const newPost = await createPost(newPostContent.trim(), user.id)
            console.log('Post created:', newPost)
            setNewPostContent('')
        } catch (error) {
            console.error('Error creating post:', error)
            alert('Failed to create post. Please try again.')
        }
    }

    const handleCreateComment = async (postId: string, e: React.FormEvent) => {
        e.preventDefault()
        const content = newCommentContent[postId]
        if (!content?.trim() || !user) return

        try {
            console.log('Creating comment:', content.trim(), 'for post:', postId, 'user:', user.id)
            const newComment = await createComment(postId, content.trim(), user.id)
            console.log('Comment created:', newComment)
            setNewCommentContent(prev => ({ ...prev, [postId]: '' }))
        } catch (error) {
            console.error('Error creating comment:', error)
            alert('Failed to create comment. Please try again.')
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

        if (diffInHours < 1) {
            const diffInMinutes = Math.floor(diffInHours * 60)
            return `${diffInMinutes}m ago`
        } else if (diffInHours < 24) {
            return `${Math.floor(diffInHours)}h ago`
        } else {
            return date.toLocaleDateString()
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/30 border-t-white/70 mx-auto mb-4"></div>
                    <p className="text-white/70">Loading forum...</p>
                    <p className="text-white/50 text-xs mt-2">If this takes too long, check the console for errors</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen px-4 sm:px-6 py-4">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">{t('communityForum')}</h1>
                    <p className="text-white/70 text-sm">{t('forumDescription')}</p>
                </div>

                {/* Supabase Configuration Check */}
                {!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY ? (
                    <div className="bg-yellow-500/10 backdrop-blur-md rounded-xl p-4 border border-yellow-500/20 text-center">
                        <h3 className="text-yellow-300 font-medium mb-2">Supabase Not Configured</h3>
                        <p className="text-white/70 text-sm">
                            To use the forum feature, you need to set up Supabase environment variables:
                        </p>
                        <div className="mt-2 text-xs text-white/50 font-mono">
                            VITE_SUPABASE_URL<br />
                            VITE_SUPABASE_ANON_KEY
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Create Post Form */}
                        {user ? (
                            <form onSubmit={handleCreatePost} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <textarea
                                            value={newPostContent}
                                            onChange={(e) => setNewPostContent(e.target.value)}
                                            placeholder={t('whatsOnYourMind')}
                                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
                                            rows={3}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={!newPostContent.trim()}
                                        className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors self-end"
                                    >
                                        <Send className="size-4" />
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center">
                                <p className="text-white/70">{t('signInToPost')}</p>
                            </div>
                        )}
                    </>
                )}

                {/* Posts List */}
                <div className="space-y-4">
                    {posts.length === 0 ? (
                        <div className="text-center py-8">
                            <MessageSquare className="size-12 text-white/30 mx-auto mb-4" />
                            <p className="text-white/70">{t('noPostsYet')}</p>
                        </div>
                    ) : (
                        posts.map((post) => (
                            <div key={post.id} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                                {/* Post Header */}
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="bg-blue-500/20 rounded-full p-2">
                                        <User className="size-4 text-blue-300" />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">
                                            {post.display_name || 'Anonymous'}
                                        </p>
                                        <p className="text-white/50 text-xs">
                                            {formatDate(post.created_at)}
                                        </p>
                                    </div>
                                </div>

                                {/* Post Content */}
                                <div className="mb-4">
                                    <p className="text-white/90 whitespace-pre-wrap">{post.content}</p>
                                </div>

                                {/* Comments Section */}
                                <div className="space-y-3">
                                    {/* Existing Comments */}
                                    {comments[post.id]?.map((comment) => (
                                        <div key={comment.id} className="bg-white/5 rounded-lg p-3 ml-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <User className="size-3 text-white/50" />
                                                <span className="text-white/70 text-sm font-medium">
                                                    {comment.display_name || 'Anonymous'}
                                                </span>
                                                <span className="text-white/50 text-xs">
                                                    {formatDate(comment.created_at)}
                                                </span>
                                            </div>
                                            <p className="text-white/80 text-sm whitespace-pre-wrap">{comment.content}</p>
                                        </div>
                                    ))}

                                    {/* Add Comment Form */}
                                    {user ? (
                                        <form onSubmit={(e) => handleCreateComment(post.id, e)} className="ml-4">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={newCommentContent[post.id] || ''}
                                                    onChange={(e) => setNewCommentContent(prev => ({ ...prev, [post.id]: e.target.value }))}
                                                    placeholder={t('addComment')}
                                                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={!newCommentContent[post.id]?.trim()}
                                                    className="bg-blue-500/20 hover:bg-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-blue-300 px-3 py-2 rounded-lg transition-colors"
                                                >
                                                    <Send className="size-3" />
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="ml-4 text-center py-2">
                                            <p className="text-white/50 text-sm">{t('signInToComment')}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
