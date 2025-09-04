import { useEffect, useState } from 'react'
import SwipeNavigator from './components/SwipeNavigator'
import InstallPrompt from './components/InstallPrompt'
import AuthModal from './components/AuthModal'
import LanguageToggle from './components/LanguageToggle'
import AnimatedFlakes from './components/AnimatedFlakes'
import { usePomodoroWithSync } from './hooks/usePomodoroWithSync'
import { ensurePermission, notifySessionComplete } from './lib/notifications'
import { t } from './lib/i18n'
import { useLanguage } from './hooks/useLanguage'
import { useGoalTracking } from './hooks/useGoalTracking'
import { useSessionStats } from './hooks/useSessionStats'
import { useTheme } from './hooks/useTheme'


export default function App() {
    useLanguage() // Make component reactive to language changes
    useTheme() // Initialize theme system
    const { settings, user, syncStatus } = usePomodoroWithSync()
    const { incrementCompleted } = useGoalTracking()
    const { addSession } = useSessionStats()
    const [showAuthModal, setShowAuthModal] = useState(false)



    useEffect(() => {
        const onChange = (e: any) => {
            console.log('⏰ Phase change event received:', e.detail)
            const p = e.detail.phase
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

    return (
        <div className="relative">
            {/* Animated Flakes Background */}
            <AnimatedFlakes />

            {/* Main App Header - Fixed at top */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-semibold">{t('appName')}</h1>
                            <p className="text-white/70 text-xs">{t('tagline')}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <LanguageToggle />
                            {user ? (
                                <div className="flex items-center gap-2">
                                    <div className="text-sm text-white/70">
                                        {user.display_name || user.email}
                                    </div>
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
                </div>
            </div>

            {/* Main Content with Swipe Navigation */}
            <div className="pt-20 relative z-10">
                <SwipeNavigator />
            </div>

            {/* Global Components */}
            <InstallPrompt />

            {/* Footer */}
            <footer className="fixed bottom-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-sm border-t border-white/10 text-center text-white/40 text-xs py-2">
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
