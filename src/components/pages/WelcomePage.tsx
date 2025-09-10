
import { useState, useEffect } from 'react'
import { t } from '../../lib/i18n'
import { useMusic } from '../../context/MusicContext'

interface WelcomePageProps {
    className?: string
    onStart: () => void
    hasStarted: boolean
}

export default function WelcomePage({ className = '', onStart }: WelcomePageProps) {
    const [showTitle, setShowTitle] = useState(true)
    const [showWelcome, setShowWelcome] = useState(false)
    const { playIntroMusic } = useMusic()

    const handleStart = async () => {
        console.log('🎯 Welcome page: Start Focus button clicked')
        console.log('🎯 Welcome page: playIntroMusic function available:', typeof playIntroMusic)

        try {
            console.log('🎯 Calling playIntroMusic...')
            await playIntroMusic()
            console.log('🎯 Intro music triggered successfully')
        } catch (error) {
            console.error('🎯 Failed to play intro music:', error)
        }

        console.log('🎯 Welcome page: Calling onStart...')
        onStart()
    }

    useEffect(() => {
        // Show title first, then fade it out and show welcome content
        const timer1 = setTimeout(() => {
            setShowTitle(false)
        }, 3000) // Show title for 3 seconds

        const timer2 = setTimeout(() => {
            setShowWelcome(true)
        }, 4000) // Show welcome content after 4 seconds

        return () => {
            clearTimeout(timer1)
            clearTimeout(timer2)
        }
    }, [])

    return (
        <div className={`flex flex-col min-h-screen px-6 ${className}`}>
            {/* Centered Animation Container */}
            <div className="flex-1 flex flex-col justify-center items-center text-center relative">
                {/* Animated Title Section - Responsive positioning */}
                <div
                    className={`absolute left-1/2 transition-all duration-1000 ease-in-out ${showTitle
                        ? 'opacity-100 transform -translate-x-1/2 translate-y-0'
                        : 'opacity-0 transform -translate-x-1/2 -translate-y-4'
                        }`}
                    style={{
                        top: '35%', // Move down from center
                    }}
                >
                    <div className="max-w-lg">
                        <h1 className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                            {t('appName')}
                        </h1>
                        <p className="text-white/60 text-2xl md:text-3xl font-light">
                            {t('tagline')}
                        </p>
                    </div>
                </div>

                {/* Animated Welcome Content - Centered positioning */}
                <div
                    className={`absolute left-1/2 transition-all duration-1000 ease-in-out ${showWelcome
                        ? 'opacity-100 transform -translate-x-1/2 translate-y-0'
                        : 'opacity-0 transform -translate-x-1/2 translate-y-4'
                        }`}
                    style={{
                        top: '50%', // Center for welcome content
                    }}
                >
                    <div className="text-center max-w-md">
                        {/* Welcome Message */}
                        <div className="mb-8">
                            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-white/90">
                                {t('welcomeToFlowFocus')}
                            </h2>
                            <p className="text-white/60 text-base md:text-lg leading-relaxed">
                                {t('welcomeDescription')}
                            </p>
                        </div>

                        {/* Start Button */}
                        <button
                            onClick={handleStart}
                            className="w-full max-w-xs bg-white text-black font-semibold py-4 px-8 rounded-2xl text-lg hover:bg-white/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                        >
                            {t('startFocusing')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Features Section - Bottom 1/3 */}
            <div className="flex-1 flex flex-col justify-end items-center pb-8">
                <div
                    className={`text-center max-w-md transition-all duration-1000 ease-in-out delay-500 ${showWelcome
                        ? 'opacity-100 transform translate-y-0'
                        : 'opacity-0 transform translate-y-4'
                        }`}
                >
                    {/* Features Preview */}
                    <div className="grid grid-cols-1 gap-3 text-sm text-white/50 mb-6">
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                            <span>{t('feature1')}</span>
                        </div>
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                            <span>{t('feature2')}</span>
                        </div>
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                            <span>{t('feature3')}</span>
                        </div>
                    </div>

                    {/* Swipe indicators - Mobile only */}
                    <div className="md:hidden flex items-center justify-center gap-4 text-white/40 text-sm">
                        <div className="flex items-center gap-1">
                            <span>← →</span>
                            <span>{t('swipeToNavigate')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
