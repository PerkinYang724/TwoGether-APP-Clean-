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

    // Ensure video background is always active
    useEffect(() => {
        document.body.classList.add('video-background-active')
        document.body.style.background = 'black'
        return () => {
            document.body.classList.remove('video-background-active')
        }
    }, [])

    // Debug logging
    console.log('App: currentPage:', currentPage)
    console.log('App: videoSrc:', currentPage === 'welcome' ? "/videos/intro welcome.mp4" : "/videos/cafe study.mp4")
    console.log('App: videoShouldPlay:', videoShouldPlay)
    console.log('App: VideoBackground component should render with videoSrc:', currentPage === 'welcome' ? "/videos/intro welcome.mp4" : "/videos/cafe study.mp4")



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
            {/* Welcome Page Video - Only shows on welcome page */}
            {currentPage === 'welcome' && (
                <VideoBackground
                    videoSrc="/videos/intro welcome.mp4"
                    overlay={true}
                    overlayOpacity={0.3}
                    shouldPlay={videoShouldPlay}
                    autoPlay={true}
                    muted={true}
                    loop={true}
                />
            )}

            {/* Persistent Cafe Study Video - Shows on all other pages */}
            {currentPage !== 'welcome' && (
                <VideoBackground
                    videoSrc="/videos/cafe study.mp4"
                    overlay={true}
                    overlayOpacity={0.3}
                    shouldPlay={true}
                    autoPlay={true}
                    muted={true}
                    loop={true}
                />
            )}

            {/* Main App Header - Fixed at top */}
            <div className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-b border-white/10" style={{ zIndex: 50 }}>
                <div className="px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-lg sm:text-xl font-semibold truncate">{t('appName')}</h1>
                            <p className="text-white/70 text-xs truncate">{t('tagline')}</p>
                            {/* Debug info - hidden on mobile */}
                            <p className="text-white/50 text-xs hidden sm:block">Page: {currentPage} | Video: {currentPage === 'welcome' ? 'intro welcome' : 'cafe study'}</p>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                            <LanguageToggle />
                            {user ? (
                                <div className="flex items-center gap-1 sm:gap-2">
                                    <div className="text-xs sm:text-sm text-white/70 truncate max-w-24 sm:max-w-none">
                                        {user.display_name || user.email}
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowAuthModal(true)}
                                    className="text-xs sm:text-sm text-white/70 hover:text-white underline touch-manipulation"
                                >
                                    {t('signIn')}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content with Swipe Navigation */}
            <div className="pt-20 relative" style={{ zIndex: 10 }}>
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
            <footer className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-white/10 text-center text-white/40 text-xs py-2" style={{ zIndex: 40 }}>
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
