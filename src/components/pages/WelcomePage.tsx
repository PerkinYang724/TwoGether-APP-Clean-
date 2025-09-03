import * as React from 'react'
import TimerCard from '../TimerCard'
import { usePomodoroWithSync } from '../../hooks/usePomodoroWithSync'
import { t } from '../../lib/i18n'

interface WelcomePageProps {
    className?: string
    onStart: () => void
    hasStarted: boolean
}

export default function WelcomePage({ className = '', onStart, hasStarted }: WelcomePageProps) {
    const { phase, isRunning, secondsLeft, start, stop, reset, setPhaseAndReset } = usePomodoroWithSync()

    if (hasStarted) {
        // Show timer page when started
        return (
            <div className={`flex flex-col min-h-screen px-6 ${className}`}>
                {/* Header Section - Compact */}
                <div className="flex-shrink-0 pt-8 pb-4">
                    <div className="text-center">
                        <h1 className="text-2xl md:text-3xl font-bold mb-1 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                            {t('appName')}
                        </h1>
                        <p className="text-white/50 text-sm md:text-base font-light">
                            {t('tagline')}
                        </p>
                    </div>
                </div>

                {/* Timer Section - Main Content */}
                <div className="flex-1 flex flex-col justify-center items-center">
                    <div className="w-full max-w-md">
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
                </div>

                {/* Navigation Hints - Bottom */}
                <div className="flex-shrink-0 pb-8">
                    <div className="text-center">
                        {/* Swipe indicators - Mobile only */}
                        <div className="md:hidden flex items-center justify-center gap-4 text-white/40 text-sm mb-4">
                            <div className="flex items-center gap-1">
                                <span>←</span>
                                <span>Settings</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span>↓</span>
                                <span>Tasks</span>
                            </div>
                        </div>

                        {/* Features Preview */}
                        <div className="grid grid-cols-1 gap-2 text-xs text-white/40">
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-1.5 h-1.5 bg-white/30 rounded-full"></div>
                                <span>{t('feature1')}</span>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-1.5 h-1.5 bg-white/30 rounded-full"></div>
                                <span>{t('feature2')}</span>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-1.5 h-1.5 bg-white/30 rounded-full"></div>
                                <span>{t('feature3')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Show welcome page when not started
    return (
        <div className={`flex flex-col min-h-screen px-6 ${className}`}>
            {/* Header Section - Top 1/3 */}
            <div className="flex-1 flex flex-col justify-center items-center text-center">
                <div className="max-w-lg">
                    {/* App Logo/Title */}
                    <div className="mb-6">
                        <h1 className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                            {t('appName')}
                        </h1>
                        <p className="text-white/60 text-lg md:text-xl font-light">
                            {t('tagline')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content Section - Middle 1/3 */}
            <div className="flex-1 flex flex-col justify-center items-center">
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
                        onClick={onStart}
                        className="w-full max-w-xs bg-white text-black font-semibold py-4 px-8 rounded-2xl text-lg hover:bg-white/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                    >
                        {t('startFocusing')}
                    </button>
                </div>
            </div>

            {/* Features Section - Bottom 1/3 */}
            <div className="flex-1 flex flex-col justify-end items-center pb-8">
                <div className="text-center max-w-md">
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
                            <span>→</span>
                            <span>{t('swipeToNavigate')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
