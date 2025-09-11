import { useEffect, useState } from 'react'
import SwipeNavigator from './components/SwipeNavigator'
import InstallPrompt from './components/InstallPrompt'
import AuthModal from './components/AuthModal'
import LanguageToggle from './components/LanguageToggle'
import VideoBackground from './components/VideoBackground'
import { usePomodoroWithSync } from './hooks/usePomodoroWithSync'
import { notifySessionComplete } from './lib/notifications'
import { t } from './lib/i18n'
import { useLanguage } from './hooks/useLanguage'
import { useGoalTracking } from './hooks/useGoalTracking'
import { useSessionStats } from './hooks/useSessionStats'


export default function App() {
    useLanguage() // Make component reactive to language changes
    const { settings, user, syncStatus } = usePomodoroWithSync()
    const { incrementCompleted } = useGoalTracking()
    const { addSession } = useSessionStats()
    const [showAuthModal, setShowAuthModal] = useState(false)
    const [videoShouldPlay, setVideoShouldPlay] = useState(true)
    const [currentPage, setCurrentPage] = useState('welcome')

    // Ensure video plays when page changes
    useEffect(() => {
        console.log('App: Page changed to:', currentPage, 'Starting video playback')
        setVideoShouldPlay(true)
    }, [currentPage])

    // Debug logging
    console.log('App: currentPage:', currentPage)
    console.log('App: videoSrc:', currentPage === 'welcome' ? "/videos/opening.mp4" : "/videos/cafe intro.mp4")
    console.log('App: videoShouldPlay:', videoShouldPlay)



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
        // Don't request notification permission on app load - wait for user gesture
        window.addEventListener('pomodoro:phase-change', onChange as any)
        return () => window.removeEventListener('pomodoro:phase-change', onChange as any)
    }, [settings, incrementCompleted, addSession])

    return (
        <div className="relative">
            {/* Global Video Background */}
            <VideoBackground
                videoSrc={currentPage === 'welcome' ? "/videos/opening.mp4" : "/videos/cafe intro.mp4"}
                overlay={true}
                overlayOpacity={0.2}
                shouldPlay={videoShouldPlay}
                autoPlay={true}
                muted={true}
                loop={true}
            />

            {/* Main App Header - Fixed at top */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-semibold">{t('appName')}</h1>
                            <p className="text-white/70 text-xs">{t('tagline')}</p>
                            {/* Debug info */}
                            <p className="text-white/50 text-xs">Page: {currentPage} | Video: {currentPage === 'welcome' ? 'opening' : 'cafe'}</p>
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
                <SwipeNavigator
                    onPageChange={setCurrentPage}
                    onVideoStart={() => {
                        setVideoShouldPlay(true)
                    }}
                />
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
