
import { useEffect } from 'react'
import { t } from '../../lib/i18n'
import { useMusic } from '../../context/MusicContext'

interface WelcomePageProps {
    className?: string
    onStart: () => void
    hasStarted: boolean
    onVideoStart?: () => void
}

export default function WelcomePage({ className = '', onStart, onVideoStart }: WelcomePageProps) {
    const { playIntroMusic } = useMusic()

    const handleStart = async () => {
        console.log('WelcomePage: Start button clicked')

        // Start the video background
        if (onVideoStart) {
            console.log('WelcomePage: Calling onVideoStart')
            onVideoStart()
        }

        try {
            console.log('WelcomePage: Playing intro music')
            await playIntroMusic()
            console.log('WelcomePage: Intro music played successfully')
        } catch (error) {
            console.error('Failed to play intro music:', error)
        }

        // Navigate immediately
        if (onStart) {
            onStart()
            console.log('WelcomePage: onStart() called successfully')
        } else {
            console.error('WelcomePage: onStart function is not available!')
        }
    }

    useEffect(() => {
        // Add class to body to override background
        document.body.classList.add('video-background-active')

        return () => {
            // Remove class when component unmounts
            document.body.classList.remove('video-background-active')
        }
    }, [])

    return (
        <div className={`flex flex-col h-screen relative overflow-hidden ${className}`}>
            {/* Centered Content - No scrolling needed */}
            <div className="flex flex-col justify-center items-center text-center h-full relative z-10 px-6">
                {/* App Title */}
                <div className="max-w-lg mb-8 px-4">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent drop-shadow-2xl">
                        {t('appName')}
                    </h1>
                    <p className="text-white/80 text-xl sm:text-2xl md:text-3xl font-light drop-shadow-lg">
                        {t('tagline')}
                    </p>
                </div>

                {/* Welcome Message */}
                <div className="max-w-lg mb-8 px-4">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 text-white/90 drop-shadow-lg">
                        {t('welcomeToFlowFocus')}
                    </h2>
                    <p className="text-white/70 text-lg sm:text-xl md:text-2xl font-light drop-shadow-lg">
                        {t('welcomeDescription')}
                    </p>
                </div>

                {/* Start Button */}
                <div className="text-center max-w-md px-4">
                    <button
                        onClick={handleStart}
                        className="w-full max-w-xs bg-white text-black font-semibold py-4 px-8 rounded-2xl text-base sm:text-lg hover:bg-white/90 shadow-lg hover:shadow-xl touch-manipulation"
                    >
                        {t('startFocusing')}
                    </button>
                </div>
            </div>
        </div>
    )
}
