
import { useState, useEffect } from 'react'
import { t } from '../../lib/i18n'
import { useMusic } from '../../context/MusicContext'

interface WelcomePageProps {
    className?: string
    onStart: () => void
    hasStarted: boolean
    onVideoStart?: () => void
}

export default function WelcomePage({ className = '', onStart, onVideoStart }: WelcomePageProps) {
    const [showTitle, setShowTitle] = useState(true)
    const [showWelcome, setShowWelcome] = useState(false)
    const { playIntroMusic } = useMusic()

    const handleStart = async () => {
        // Start the video background
        if (onVideoStart) {
            onVideoStart()
        }

        try {
            await playIntroMusic()
        } catch (error) {
            console.error('Failed to play intro music:', error)
        }

        onStart()
    }

    useEffect(() => {
        // Add class to body to override background
        document.body.classList.add('video-background-active')

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
            // Remove class when component unmounts
            document.body.classList.remove('video-background-active')
        }
    }, [])

    return (
        <div className={`flex flex-col h-screen relative overflow-hidden ${className}`}>
            {/* Centered Content - No scrolling needed */}
            <div className="flex flex-col justify-center items-center text-center h-full relative z-10 px-6">
                {/* Animated Title Section */}
                <div
                    className={`transition-all duration-1000 ease-in-out ${showTitle
                        ? 'opacity-100 transform translate-y-0'
                        : 'opacity-0 transform -translate-y-4'
                        }`}
                >
                    <div className="max-w-lg mb-8 px-4">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                            {t('appName')}
                        </h1>
                        <p className="text-white/60 text-xl sm:text-2xl md:text-3xl font-light">
                            {t('tagline')}
                        </p>
                    </div>
                </div>

                {/* Animated Welcome Content */}
                <div
                    className={`transition-all duration-1000 ease-in-out ${showWelcome
                        ? 'opacity-100 transform translate-y-0'
                        : 'opacity-0 transform translate-y-4'
                        }`}
                >
                    <div className="text-center max-w-md px-4">
                        {/* Welcome Message */}
                        <div className="mb-8">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 text-white/90">
                                {t('welcomeToFlowFocus')}
                            </h2>
                            <p className="text-white/60 text-sm sm:text-base md:text-lg leading-relaxed">
                                {t('welcomeDescription')}
                            </p>
                        </div>

                        {/* Start Button */}
                        <button
                            onClick={handleStart}
                            className="w-full max-w-xs bg-white text-black font-semibold py-4 px-8 rounded-2xl text-base sm:text-lg hover:bg-white/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 touch-manipulation"
                        >
                            {t('startFocusing')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
