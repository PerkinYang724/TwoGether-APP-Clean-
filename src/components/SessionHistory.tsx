import React, { useState, useEffect } from 'react'
import { Clock, Tag } from 'lucide-react'
import { t } from '../lib/i18n'
import { getSessions, type Session } from '../lib/sessions'
import { usePomodoroWithSync } from '../hooks/usePomodoroWithSync'

export default function SessionHistory() {
    const { user } = usePomodoroWithSync()
    const [sessions, setSessions] = useState<Session[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (user) {
            loadSessions()
        }
    }, [user])

    // Listen for session completion events to refresh the list
    useEffect(() => {
        const handleSessionComplete = () => {
            loadSessions()
        }

        window.addEventListener('pomodoro:phase-change', handleSessionComplete)
        return () => window.removeEventListener('pomodoro:phase-change', handleSessionComplete)
    }, [])

    const loadSessions = async () => {
        if (!user) return

        try {
            setLoading(true)
            const recentSessions = await getSessions(user.id, 10)
            setSessions(recentSessions)
        } catch (error) {
            console.error('Error loading sessions:', error)
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

        if (diffInHours < 1) {
            return 'Just now'
        } else if (diffInHours < 24) {
            return `${Math.floor(diffInHours)}h ago`
        } else {
            return date.toLocaleDateString()
        }
    }

    const getPhaseLabel = (phase: string) => {
        switch (phase) {
            case 'focus': return t('focus')
            case 'short_break': return t('shortBreak')
            case 'long_break': return t('longBreak')
            default: return phase
        }
    }

    if (!user) {
        return null
    }

    if (loading) {
        return (
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <Clock className="size-5 text-white/70" />
                    {t('sessionHistory')}
                </h3>
                <div className="text-center text-white/50 py-8">
                    Loading...
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Clock className="size-5 text-white/70" />
                {t('recentSessions')}
            </h3>

            {sessions.length === 0 ? (
                <div className="text-center text-white/50 py-8">
                    <div className="text-sm mb-2">{t('noSessionsYet')}</div>
                    <div className="text-xs">{t('startFirstSession')}</div>
                </div>
            ) : (
                <div className="space-y-3">
                    {sessions.map((session) => (
                        <div
                            key={session.id}
                            className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${session.phase === 'focus' ? 'bg-red-500' :
                                        session.phase === 'short_break' ? 'bg-green-500' :
                                            'bg-blue-500'
                                        }`} />
                                    <span className="text-sm font-medium text-white">
                                        {getPhaseLabel(session.phase)}
                                    </span>
                                </div>

                                {session.tag && (
                                    <div className="flex items-center gap-1">
                                        <Tag className="size-3 text-white/50" />
                                        <span className="text-sm text-white/70 bg-white/10 px-2 py-1 rounded">
                                            {session.tag}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="text-right">
                                <div className="text-sm font-medium text-white">
                                    {session.minutes} min
                                </div>
                                <div className="text-xs text-white/50">
                                    {formatDate(session.started_at)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
