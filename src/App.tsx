import { useEffect, useState } from 'react'
import SwipeNavigator from './components/SwipeNavigator'
import InstallPrompt from './components/InstallPrompt'
import AuthModal from './components/AuthModal'
import LanguageToggle from './components/LanguageToggle'
import VideoBackground from './components/VideoBackground'
import { ErrorBoundary } from './components/ErrorBoundary'
import { HealthStatus, HealthDebugPanel } from './components/HealthStatus'
import { AppMonitor, MonitoringDashboard } from './components/AppMonitor'
import { usePomodoroWithSync } from './hooks/usePomodoroWithSync'
import { notifySessionComplete } from './lib/notifications'
import { t } from './lib/i18n'
import { useLanguage } from './hooks/useLanguage'
import { useGoalTracking } from './hooks/useGoalTracking'
import { useSessionStats } from './hooks/useSessionStats'
import { initializeApp, type AppHealth } from './lib/initialization'
// import { errorHandler } from './lib/errorHandler'


export default function App() {
    useLanguage() // Make component reactive to language changes
    const { settings, user, syncStatus } = usePomodoroWithSync()
    const { incrementCompleted } = useGoalTracking()
    const { addSession } = useSessionStats()
    const [showAuthModal, setShowAuthModal] = useState(false)
    const [videoShouldPlay, setVideoShouldPlay] = useState(true)
    const [currentPage, setCurrentPage] = useState('welcome')
    const [, setAppHealth] = useState<AppHealth | null>(null)
    const [isInitializing, setIsInitializing] = useState(true)
    const [initializationError, setInitializationError] = useState<string | null>(null)

    // Initialize app on mount
    useEffect(() => {
        const initApp = async () => {
            try {
                console.log('🚀 Initializing app...')
                const health = await initializeApp()
                setAppHealth(health)

                if (!health.isHealthy) {
                    console.error('❌ App initialization failed:', health.issues)
                    setInitializationError(health.issues.join(', '))
                } else {
                    console.log('✅ App initialized successfully')
                    if (health.warnings.length > 0) {
                        console.warn('⚠️ App warnings:', health.warnings)
                    }
                }
            } catch (error) {
                console.error('❌ App initialization error:', error)
                setInitializationError(error instanceof Error ? error.message : 'Unknown initialization error')
            } finally {
                setIsInitializing(false)
            }
        }

        initApp()
    }, [])

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
    // Cloudinary video URLs - Direct access format
    const welcomeVideoUrl = 'https://res.cloudinary.com/dblubqmip/video/upload/v1757593126/intro_h7yxev.mp4'
    const cafeVideoUrl = 'https://res.cloudinary.com/dblubqmip/video/upload/v1757593138/cafe_vptuhf.mov'

    console.log('App: videoSrc:', currentPage === 'welcome' ? welcomeVideoUrl : cafeVideoUrl)
    console.log('App: videoShouldPlay:', videoShouldPlay)
    console.log('App: VideoBackground component should render with videoSrc:', currentPage === 'welcome' ? welcomeVideoUrl : cafeVideoUrl)



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

    // Show loading screen during initialization
    if (isInitializing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold mb-2">Initializing Flow Focus</h2>
                    <p className="text-gray-300">Setting up your productivity environment...</p>
                </div>
            </div>
        )
    }

    // Show error screen if initialization failed
    if (initializationError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
                <div className="text-center max-w-md">
                    <h1 className="text-2xl font-bold mb-4 text-red-400">Initialization Failed</h1>
                    <p className="text-gray-300 mb-6">{initializationError}</p>
                    <div className="space-y-3">
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors block w-full"
                        >
                            Retry
                        </button>
                        <button
                            onClick={() => {
                                localStorage.clear()
                                window.location.reload()
                            }}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors block w-full"
                        >
                            Reset App Data
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <ErrorBoundary>
            <div className="relative">
                {/* Global Video Background */}
                {/* Welcome Page Video - Only shows on welcome page */}
                {currentPage === 'welcome' && (
                    <VideoBackground
                        videoSrc={welcomeVideoUrl}
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
                        videoSrc={cafeVideoUrl}
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
                    <div className="flex items-center justify-between px-4">
                        <div className="flex-1 text-center">
                            {t('madeWithLove')} — {t('offlineReady')}
                            {syncStatus === 'synced' && ` • ${t('synced')}`}
                            {syncStatus === 'offline' && ` • ${t('offline')}`}
                        </div>
                        <div className="flex-shrink-0">
                            <HealthStatus />
                        </div>
                    </div>
                </footer>

                {/* Monitoring Systems */}
                <AppMonitor position="bottom-right" />
                <MonitoringDashboard />
                <HealthDebugPanel />

                <AuthModal
                    isOpen={showAuthModal}
                    onClose={() => setShowAuthModal(false)}
                    onSuccess={() => setShowAuthModal(false)}
                />
            </div>
        </ErrorBoundary>
    )
}
