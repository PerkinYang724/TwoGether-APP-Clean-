import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { t } from '../lib/i18n'
import { useLanguage } from '../hooks/useLanguage'

export function formatMMSS(total: number) {
    const m = Math.floor(total / 60).toString().padStart(2, '0')
    const s = Math.floor(total % 60).toString().padStart(2, '0')
    return `${m}:${s}`
}

export default function TimerCard({
    phase, isRunning, secondsLeft,
    onStart, onStop, onReset
}: {
    phase: 'focus' | 'short_break' | 'long_break'
    isRunning: boolean
    secondsLeft: number
    onStart: () => void
    onStop: () => void
    onReset: () => void
}) {
    useLanguage() // Make component reactive to language changes
    const label = phase === 'focus' ? t('focus') : phase === 'short_break' ? t('shortBreak') : t('longBreak')
    return (
        <motion.div layout className="max-w-md mx-auto p-6 rounded-2xl shadow-lg bg-white/5 border border-white/10 text-center">
            <div className="text-sm uppercase tracking-widest text-white/70">{label}</div>
            <div className="text-7xl font-semibold my-6 tabular-nums">{formatMMSS(secondsLeft)}</div>
            <div className="flex items-center justify-center gap-3">
                {!isRunning ? (
                    <button onClick={onStart} className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20">
                        <Play className="inline size-5 mr-2" /> {t('start')}
                    </button>
                ) : (
                    <button onClick={onStop} className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20">
                        <Pause className="inline size-5 mr-2" /> {t('pause')}
                    </button>
                )}
                <button onClick={onReset} className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20">
                    <RotateCcw className="inline size-5 mr-2" /> {t('reset')}
                </button>
            </div>
        </motion.div>
    )
}
