import React from 'react';
import { motion } from 'framer-motion';
import BallFill from './BallFill';
import { t } from '../lib/i18n';

interface TimerCardProps {
    phase: 'focus' | 'short_break' | 'long_break';
    isRunning: boolean;
    secondsLeft: number;
    onStart: () => void;
    onStop: () => void;
    onReset: () => void;
    onSetPhase: (phase: 'focus' | 'short_break' | 'long_break') => void;
}

const TimerCard: React.FC<TimerCardProps> = ({
    phase,
    isRunning,
    secondsLeft,
    onStart,
    onStop,
    onReset,
    onSetPhase
}) => {
    const formatMMSS = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getProgress = () => {
        const totalSeconds = phase === 'focus' ? 25 * 60 : phase === 'short_break' ? 5 * 60 : 15 * 60;
        return (totalSeconds - secondsLeft) / totalSeconds;
    };

    const getAccent = () => {
        switch (phase) {
            case 'focus': return '#EF4444';
            case 'short_break': return '#10B981';
            case 'long_break': return '#3B82F6';
            default: return '#A855F7';
        }
    };

    const getLabel = () => {
        switch (phase) {
            case 'focus': return t('focus');
            case 'short_break': return t('shortBreak');
            case 'long_break': return t('longBreak');
            default: return '';
        }
    };

    return (
        <motion.div
            className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 text-center border border-white/10"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {/* background animation */}
            <div className="absolute inset-0 -z-10 overflow-hidden rounded-2xl">
                <BallFill progress={getProgress()} accent={getAccent()} bgBlur={10} isRunning={isRunning} />
            </div>

            {/* Timer content */}
            <div className="text-sm uppercase tracking-widest text-white/70 mb-4">
                {getLabel()}
            </div>
            <motion.div
                className="text-9xl font-mono font-bold text-white mb-8"
                key={secondsLeft}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
            >
                {formatMMSS(secondsLeft)}
            </motion.div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
                <button
                    onClick={isRunning ? onStop : onStart}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-colors"
                >
                    {isRunning ? t('pause') : t('start')}
                </button>
                <button
                    onClick={onReset}
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 font-medium transition-colors"
                >
                    {t('reset')}
                </button>
            </div>

            {/* Phase selector */}
            <div className="flex justify-center gap-2 mt-6">
                {(['focus', 'short_break', 'long_break'] as const).map((p) => (
                    <button
                        key={p}
                        onClick={() => onSetPhase(p)}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${phase === p
                            ? 'bg-white/20 text-white'
                            : 'bg-white/5 text-white/50 hover:bg-white/10'
                            }`}
                    >
                        {p === 'focus' ? t('focus') : p === 'short_break' ? t('shortBreak') : t('longBreak')}
                    </button>
                ))}
            </div>
        </motion.div>
    );
};

export default TimerCard;