import { useEffect, useState } from 'react'
import TimerCard from './components/TimerCard'
import Controls from './components/Controls'
import SettingsDrawer from './components/SettingsDrawer'
import EnhancedStatsPanel from './components/EnhancedStatsPanel'
import InstallPrompt from './components/InstallPrompt'
import AuthModal from './components/AuthModal'
import LanguageToggle from './components/LanguageToggle'
import { usePomodoroWithSync } from './hooks/usePomodoroWithSync'
import { ensurePermission, notify, beep } from './lib/notifications'
import { getCurrentUser, signOut } from './lib/auth'
import { t } from './lib/i18n'
import { useLanguage } from './hooks/useLanguage'

export default function App() {
    useLanguage() // Make component reactive to language changes
    const { phase, isRunning, secondsLeft, start, stop, reset, setPhaseAndReset, settings, setSettings, user, syncStatus } = usePomodoroWithSync()
    const [showAuthModal, setShowAuthModal] = useState(false)

    useEffect(() => {
        const onChange = (e: any) => {
            const p = e.detail.phase as typeof phase
            if (settings.sound) beep()
            if (settings.notifications) notify(t('timeToFocus') + ' ' + (p === 'focus' ? t('focus') : t('timeToRest')), p === 'focus' ? t('letsGetBackToWork') : t('takeABreak'))
            document.title = p === 'focus' ? `${t('focus')} — ${t('appName')}` : `${t('timeToRest')} — ${t('appName')}`
        }
        ensurePermission()
        window.addEventListener('pomodoro:phase-change', onChange as any)
        return () => window.removeEventListener('pomodoro:phase-change', onChange as any)
    }, [settings])

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

            <TimerCard phase={phase} isRunning={isRunning} secondsLeft={secondsLeft} onStart={start} onStop={stop} onReset={() => reset()} />
            <Controls onSetPhase={(p) => setPhaseAndReset(p)} />
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
