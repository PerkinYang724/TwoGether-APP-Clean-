import { useCallback, useEffect, useState } from 'react'
import { usePomodoro, type Phase } from './usePomodoro'
import { saveSession, updateSession, getTodaySessions, getTotalSessions } from '../lib/sessions'
import { getCurrentUser } from '../lib/auth'

export function usePomodoroWithSync() {
    const pomodoro = usePomodoro()
    const [user, setUser] = useState<any>(null)
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
    const [cloudStats, setCloudStats] = useState({ today: 0, total: 0 })
    const [isOnline, setIsOnline] = useState(navigator.onLine)

    // Check online status
    useEffect(() => {
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    // Get current user
    useEffect(() => {
        getCurrentUser().then(setUser)
    }, [])

    // Load cloud stats when user is available
    useEffect(() => {
        if (user && isOnline) {
            Promise.all([
                getTodaySessions(user.id),
                getTotalSessions(user.id)
            ]).then(([todaySessions, totalCount]) => {
                setCloudStats({
                    today: todaySessions.length,
                    total: totalCount
                })
            }).catch(console.error)
        }
    }, [user, isOnline])

    // Start session tracking
    const startWithSync = useCallback(async (tag?: string) => {
        pomodoro.start()

        if (user && isOnline) {
            try {
                const session = await saveSession({
                    user_id: user.id,
                    started_at: new Date().toISOString(),
                    phase: pomodoro.phase,
                    minutes: 0,
                    tag: tag
                })
                setCurrentSessionId(session.id)
            } catch (error) {
                console.error('Failed to save session:', error)
            }
        }
    }, [pomodoro.start, user, isOnline, pomodoro.phase])

    // Stop session tracking
    const stopWithSync = useCallback(async () => {
        pomodoro.stop()

        if (currentSessionId && user && isOnline) {
            try {
                await updateSession(currentSessionId, {
                    ended_at: new Date().toISOString(),
                    minutes: Math.floor((pomodoro.settings.focusMinutes * 60 - pomodoro.secondsLeft) / 60)
                })
                setCurrentSessionId(null)
            } catch (error) {
                console.error('Failed to update session:', error)
            }
        }
    }, [pomodoro.stop, currentSessionId, user, isOnline, pomodoro.settings.focusMinutes, pomodoro.secondsLeft])

    // Enhanced phase change handler
    useEffect(() => {
        const handlePhaseChange = async (e: any) => {
            const newPhase = e.detail.phase as Phase

            // Update cloud stats if user is online
            if (user && isOnline && newPhase === 'focus') {
                try {
                    const [todaySessions, totalCount] = await Promise.all([
                        getTodaySessions(user.id),
                        getTotalSessions(user.id)
                    ])
                    setCloudStats({
                        today: todaySessions.length + 1,
                        total: totalCount + 1
                    })
                } catch (error) {
                    console.error('Failed to update cloud stats:', error)
                }
            }
        }

        window.addEventListener('pomodoro:phase-change', handlePhaseChange)
        return () => window.removeEventListener('pomodoro:phase-change', handlePhaseChange)
    }, [user, isOnline])

    return {
        ...pomodoro,
        start: startWithSync,
        stop: stopWithSync,
        user,
        cloudStats,
        isOnline,
        syncStatus: user ? (isOnline ? 'synced' : 'offline') : 'not-signed-in'
    }
}
