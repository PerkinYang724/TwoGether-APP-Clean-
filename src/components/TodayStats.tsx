import { useState, useEffect, useCallback } from 'react'
import { Clock, Target, TrendingUp } from 'lucide-react'
import { t } from '../lib/i18n'
import { getSessions, type Session } from '../lib/sessions'
import { usePomodoroWithSync } from '../hooks/usePomodoroWithSync'

export default function TodayStats() {
    const { user } = usePomodoroWithSync()
    const [sessions, setSessions] = useState<Session[]>([])
    const [loading, setLoading] = useState(true)

    const loadTodaySessions = useCallback(async () => {
        try {
            setLoading(true)

            if (user) {
                // Load from cloud database
                const allSessions = await getSessions(user.id, 50) // Get more sessions to filter today's

                // Filter sessions for today only
                const today = new Date()
                today.setHours(0, 0, 0, 0)

                const todaySessions = allSessions.filter((session: any) => {
                    const sessionDate = new Date(session.started_at)
                    sessionDate.setHours(0, 0, 0, 0)
                    return sessionDate.getTime() === today.getTime()
                })

                setSessions(todaySessions)
            } else {
                // Load from local storage for unauthenticated users
                const localSessions = localStorage.getItem('pomodoro-sessions')
                if (localSessions) {
                    const allSessions = JSON.parse(localSessions)

                    // Filter sessions for today only
                    const today = new Date()
                    today.setHours(0, 0, 0, 0)

                    const todaySessions = allSessions.filter((session: Session) => {
                        const sessionDate = new Date(session.started_at)
                        sessionDate.setHours(0, 0, 0, 0)
                        return sessionDate.getTime() === today.getTime()
                    })

                    setSessions(todaySessions)
                } else {
                    setSessions([])
                }
            }
        } catch (error) {
            console.error('Error loading today sessions:', error)
            setSessions([])
        } finally {
            setLoading(false)
        }
    }, [user])

    useEffect(() => {
        loadTodaySessions()
    }, [loadTodaySessions])

    // Listen for session completion events to refresh the list
    useEffect(() => {
        const handleSessionComplete = () => {
            loadTodaySessions()
        }

        window.addEventListener('pomodoro:phase-change', handleSessionComplete)
        return () => window.removeEventListener('pomodoro:phase-change', handleSessionComplete)
    }, [loadTodaySessions])

    const formatTime = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const getTodayStats = () => {
        const focusSessions = sessions.filter(s => s.phase === 'focus')
        const totalFocusTime = focusSessions.reduce((total, session) => {
            const duration = session.minutes * 60 // Convert minutes to seconds
            return total + duration
        }, 0)

        const totalFocusMinutes = Math.floor(totalFocusTime / 60)
        const totalFocusHours = Math.floor(totalFocusMinutes / 60)
        const remainingMinutes = totalFocusMinutes % 60

        // Calculate time spent per tag
        const tagStats = focusSessions.reduce((acc, session) => {
            const tag = session.tag || 'General'
            const duration = session.minutes

            if (!acc[tag]) {
                acc[tag] = {
                    totalMinutes: 0,
                    sessionCount: 0,
                    sessions: []
                }
            }

            acc[tag].totalMinutes += duration
            acc[tag].sessionCount += 1
            acc[tag].sessions.push(session)

            return acc
        }, {} as Record<string, { totalMinutes: number; sessionCount: number; sessions: Session[] }>)

        // Sort tags by total time spent
        const sortedTags = Object.entries(tagStats).sort(([, a], [, b]) => b.totalMinutes - a.totalMinutes)

        return {
            totalSessions: focusSessions.length,
            totalFocusTime: totalFocusTime,
            totalFocusMinutes,
            totalFocusHours,
            remainingMinutes,
            focusSessions,
            tagStats: sortedTags
        }
    }

    const stats = getTodayStats()

    if (loading) {
        return (
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="size-5 text-white/70" />
                    <h3 className="text-lg font-medium">{t('sessionStats')} - {t('today')}</h3>
                </div>
                <div className="text-center py-4">
                    <div className="text-white/50 text-sm">Loading...</div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="size-5 text-white/70" />
                <h3 className="text-lg font-medium">{t('sessionStats')} - {t('today')}</h3>
            </div>

            {stats.totalSessions > 0 ? (
                <div className="space-y-4">
                    {/* Stats Summary */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-white">{stats.totalSessions}</div>
                            <div className="text-xs text-white/60">{t('sessionsCompleted')}</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-white">
                                {stats.totalFocusHours > 0 ? `${stats.totalFocusHours}h ${stats.remainingMinutes}m` : `${stats.remainingMinutes}m`}
                            </div>
                            <div className="text-xs text-white/60">{t('focusTime')}</div>
                        </div>
                    </div>

                    {/* Time per Tag Statistics */}
                    {stats.tagStats.length > 0 && (
                        <div className="space-y-3">
                            <div className="text-sm text-white/70 mb-2">Time by Task/Subject:</div>
                            {stats.tagStats.map(([tag, tagData]) => {
                                const hours = Math.floor(tagData.totalMinutes / 60)
                                const minutes = tagData.totalMinutes % 60
                                const timeDisplay = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`

                                return (
                                    <div
                                        key={tag}
                                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                                                <Target className="size-4 text-blue-400" />
                                            </div>
                                            <div>
                                                <div className="text-white/90 text-sm font-medium">{tag}</div>
                                                <div className="text-white/60 text-xs">
                                                    {tagData.sessionCount} session{tagData.sessionCount !== 1 ? 's' : ''}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-white/90 text-sm font-medium">{timeDisplay}</div>
                                            <div className="text-white/60 text-xs">
                                                {Math.round((tagData.totalMinutes / stats.totalFocusMinutes) * 100)}%
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {/* Today's Sessions List */}
                    <div className="space-y-2">
                        <div className="text-sm text-white/70 mb-2">Recent Sessions:</div>
                        {stats.focusSessions.slice(0, 3).map((session) => (
                            <div
                                key={session.id}
                                className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10"
                            >
                                <div className="flex-shrink-0 w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                                    <Target className="size-4 text-red-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-white/90 text-sm font-medium">
                                            {session.tag || t('focus')}
                                        </span>
                                        <span className="text-white/50 text-xs">
                                            {formatTime(session.started_at)}
                                        </span>
                                    </div>
                                    <div className="text-white/60 text-xs">
                                        {session.minutes} min
                                    </div>
                                </div>
                            </div>
                        ))}
                        {stats.focusSessions.length > 3 && (
                            <div className="text-center text-white/50 text-xs py-2">
                                +{stats.focusSessions.length - 3} more sessions
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="text-center py-6">
                    <Clock className="size-8 text-white/30 mx-auto mb-2" />
                    <p className="text-white/50 text-sm">{t('noStatsYet')}</p>
                    <p className="text-white/30 text-xs mt-1">{t('completeFirstSession')}</p>
                </div>
            )}
        </div>
    )
}
