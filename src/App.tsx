import { useEffect, useState } from 'react'
import TimerCard from './components/TimerCard'
import SettingsDrawer from './components/SettingsDrawer'
import EnhancedStatsPanel from './components/EnhancedStatsPanel'
import InstallPrompt from './components/InstallPrompt'
import AuthModal from './components/AuthModal'
import LanguageToggle from './components/LanguageToggle'
import TaskList from './components/TaskList'
import GoalTracker from './components/GoalTracker'
import SessionStats from './components/SessionStats'
import NotificationSettings from './components/NotificationSettings'
import ThemeSelector from './components/ThemeSelector'
import { usePomodoroWithSync } from './hooks/usePomodoroWithSync'
import { ensurePermission, notifySessionComplete } from './lib/notifications'
import { signOut } from './lib/auth'
import { t } from './lib/i18n'
import { useLanguage } from './hooks/useLanguage'
import { useGoalTracking } from './hooks/useGoalTracking'
import { useSessionStats } from './hooks/useSessionStats'
import { useTheme } from './hooks/useTheme'


export default function App() {
    useLanguage() // Make component reactive to language changes
    useTheme() // Initialize theme system
    const { phase, isRunning, secondsLeft, start, stop, reset, setPhaseAndReset, settings, setSettings, user, syncStatus } = usePomodoroWithSync()
    const { incrementCompleted } = useGoalTracking()
    const { addSession } = useSessionStats()
    const [showAuthModal, setShowAuthModal] = useState(false)



    useEffect(() => {
        const onChange = (e: any) => {
            console.log('⏰ Phase change event received:', e.detail)
            const p = e.detail.phase as typeof phase
            document.title = p === 'focus' ? `${t('focus')} — ${t('appName')}` : `${t('timeToRest')} — ${t('appName')}`
            console.log('⏰ Calling notifySessionComplete for phase:', p)
            notifySessionComplete(p)

            if (p === 'short_break' || p === 'long_break') {
                incrementCompleted()
                const focusDuration = settings.focusMinutes * 60
                addSession(focusDuration, 'focus', true)
            }
        }
        console.log('⏰ Setting up phase change listener')
        ensurePermission()
        window.addEventListener('pomodoro:phase-change', onChange as any)
        return () => window.removeEventListener('pomodoro:phase-change', onChange as any)
    }, [settings, incrementCompleted, addSession])

    const handleSignOut = async () => {
        try {
            await signOut()
        } catch (error) {
            console.error('Sign out error:', error)
        }
    }

    return (
        <div className="px-6 py-10">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-semibold">{t('appName')}</h1>
                    <p className="text-white/70 text-sm">{t('tagline')}</p>
                </div>
                <div className="flex items-center gap-2">
                    <LanguageToggle />
                    {user ? (
                        <div className="flex items-center gap-2">
                            <div className="text-sm text-white/70">
                                {user.display_name || user.email}
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="text-xs text-white/50 hover:text-white/70 underline"
                            >
                                {t('signOut')}
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowAuthModal(true)}
                            className="text-sm text-white/70 hover:text-white underline"
                        >
                            {t('signIn')}
                        </button>
                    )}
                </div>
            </div>

            {/* Top Section - Timer in center, stats on left, theme on right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
                {/* Left Column - Session Stats and Notifications */}
                <div className="lg:col-span-3 space-y-6">
                    <SessionStats />
                    <NotificationSettings />
                </div>

                {/* Center Column - Timer */}
                <div className="lg:col-span-6 flex justify-center">
                    <TimerCard
                        phase={phase}
                        isRunning={isRunning}
                        secondsLeft={secondsLeft}
                        onStart={start}
                        onStop={stop}
                        onReset={() => reset()}
                        onSetPhase={(p) => setPhaseAndReset(p)}
                    />
                </div>

                {/* Right Column - Theme Settings */}
                <div className="lg:col-span-3 flex justify-center lg:justify-end">
                    <div className="w-full max-w-md">
                        <ThemeSelector />
                    </div>
                </div>
            </div>

            {/* Bottom Section - Tasks and Daily Goal */}
            <div className="space-y-6">
                <TaskList />
                <GoalTracker />
            </div>

            <SettingsDrawer settings={settings} setSettings={setSettings} />
            <EnhancedStatsPanel />
            <InstallPrompt />

            <footer className="mt-10 text-center text-white/40 text-xs">
                {t('madeWithLove')} — {t('offlineReady')}
                {syncStatus === 'synced' && ` • ${t('synced')}`}
                {syncStatus === 'offline' && ` • ${t('offline')}`}
            </footer>

            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onSuccess={() => setShowAuthModal(false)}
            />
        </div>
    )
}
