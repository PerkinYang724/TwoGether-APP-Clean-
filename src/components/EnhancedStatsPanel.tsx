import { useEffect, useState } from 'react'
import { getCurrentUser } from '../lib/auth'
import { getTodaySessions, getTotalSessions } from '../lib/sessions'
import { t } from '../lib/i18n'
import { useLanguage } from '../hooks/useLanguage'

function startOfDay(d = new Date()) { const x = new Date(d); x.setHours(0, 0, 0, 0); return x }

interface CloudStats {
    today: number
    total: number
}

export default function EnhancedStatsPanel() {
    useLanguage() // Make component reactive to language changes
    const [localToday, setLocalToday] = useState(0)
    const [localTotal, setLocalTotal] = useState(0)
    const [cloudStats, setCloudStats] = useState<CloudStats | null>(null)
    const [user, setUser] = useState<any>(null)
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

    // Load local stats
    useEffect(() => {
        const raw = localStorage.getItem('stats')
        if (raw) {
            const s = JSON.parse(raw)
            setLocalToday(s.today || 0)
            setLocalTotal(s.total || 0)
        }
    }, [])

    // Load cloud stats when user is available and online
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

    // Handle local phase changes
    useEffect(() => {
        const handler = (e: any) => {
            const now = new Date()
            const key = startOfDay(now).toISOString()
            const raw = localStorage.getItem('stats')
            const s = raw ? JSON.parse(raw) : { today: 0, total: 0, key }
            if (s.key !== key) { s.key = key; s.today = 0 }
            s.today += 1; s.total += 1
            localStorage.setItem('stats', JSON.stringify(s))
            setLocalToday(s.today)
            setLocalTotal(s.total)
        }
        window.addEventListener('pomodoro:phase-change', handler as any)
        return () => window.removeEventListener('pomodoro:phase-change', handler as any)
    }, [])

    const displayToday = cloudStats?.today ?? localToday
    const displayTotal = cloudStats?.total ?? localTotal

    return (
        <div className="max-w-md mx-auto mt-6 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-white/70 text-sm">{t('focusSessionsToday')}</div>
                    <div className="text-3xl font-semibold">{displayToday}</div>
                </div>
                <div>
                    <div className="text-white/70 text-sm">{t('totalFocusSessions')}</div>
                    <div className="text-3xl font-semibold">{displayTotal}</div>
                </div>
            </div>

            {/* Sync status indicator */}
            <div className="mt-3 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-white/50">
                        {user ? (
                            isOnline ? (
                                cloudStats ? t('syncedWithCloud') : t('syncing')
                            ) : t('offlineMode')
                        ) : t('localOnly')
                        }
                    </span>
                    {user && (
                        <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-yellow-500'
                            }`} />
                    )}
                </div>
            </div>
        </div>
    )
}
