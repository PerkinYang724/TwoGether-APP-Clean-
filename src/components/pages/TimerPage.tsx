import TimerCard from '../TimerCard'
import { usePomodoroWithSync } from '../../hooks/usePomodoroWithSync'

interface TimerPageProps {
    className?: string
}

export default function TimerPage({ className = '' }: TimerPageProps) {
    const { phase, isRunning, secondsLeft, start, stop, reset, setPhaseAndReset } = usePomodoroWithSync()

    return (
        <div className={`flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 ${className}`}>
            <div className="w-full max-w-sm sm:max-w-md md:max-w-lg">
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

            {/* Swipe indicators - Mobile only */}
            <div className="md:hidden mt-8 flex items-center gap-4 text-white/40 text-sm">
                <div className="flex items-center gap-1">
                    <span>← →</span>
                    <span>Navigate</span>
                </div>
            </div>
        </div>
    )
}
