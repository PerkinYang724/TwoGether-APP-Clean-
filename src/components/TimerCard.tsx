import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BallFill from './BallFill';
import SessionHistory from './SessionHistory';
import { t } from '../lib/i18n';

interface TimerCardProps {
    phase: 'focus' | 'short_break' | 'long_break';
    isRunning: boolean;
    secondsLeft: number;
    onStart: (tag?: string) => void;
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
    const [showTagInput, setShowTagInput] = useState(false)
    const [currentTag, setCurrentTag] = useState<string>('')
    const [tagInputValue, setTagInputValue] = useState<string>('')

    const handleStartClick = (e?: React.MouseEvent) => {
        e?.preventDefault()
        e?.stopPropagation()

        console.log('TimerCard: handleStartClick called, phase:', phase)

        if (phase === 'focus') {
            console.log('TimerCard: Showing inline tag input')
            setShowTagInput(true)
        } else {
            console.log('TimerCard: Starting timer directly')
            onStart()
        }
    }

    const handleTagSubmit = () => {
        if (tagInputValue.trim()) {
            console.log('TimerCard: Submitting tag:', tagInputValue.trim())
            setCurrentTag(tagInputValue.trim())
            setShowTagInput(false)
            setTagInputValue('')
            onStart(tagInputValue.trim())
        }
    }

    const handleTagCancel = () => {
        setShowTagInput(false)
        setTagInputValue('')
    }
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
        <>
            <motion.div
                className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 md:p-8 text-center border border-white/10 overflow-hidden"
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
                    {getLabel()} v2.0
                </div>

                {/* Current tag display */}
                {currentTag && phase === 'focus' && (
                    <div className="mb-4">
                        <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-sm text-white/80">
                            <span className="text-xs text-white/50">Tag:</span>
                            <span>{currentTag}</span>
                        </div>
                    </div>
                )}
                <motion.div
                    className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-mono font-bold text-white mb-8 break-all"
                    key={secondsLeft}
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                >
                    {formatMMSS(secondsLeft)}
                </motion.div>

                {/* Tag Input - Inline */}
                {showTagInput && (
                    <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="text-sm text-white/70 mb-3 text-center">
                            {t('enterSubjectTag')}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={tagInputValue}
                                onChange={(e) => setTagInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                        handleTagSubmit()
                                    } else if (e.key === 'Escape') {
                                        e.preventDefault()
                                        handleTagCancel()
                                    }
                                }}
                                placeholder={t('subjectTagPlaceholder')}
                                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent text-sm"
                                autoFocus
                                maxLength={30}
                            />
                            <button
                                onClick={handleTagSubmit}
                                disabled={!tagInputValue.trim()}
                                className="px-4 py-2 bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:text-white/30 text-white font-medium rounded-lg transition-colors text-sm"
                            >
                                {t('start')}
                            </button>
                            <button
                                onClick={handleTagCancel}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 rounded-lg transition-colors text-sm"
                            >
                                {t('cancel')}
                            </button>
                        </div>
                    </div>
                )}

                {/* Controls */}
                <div className="flex justify-center gap-4">
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            console.log('TimerCard: Start/Pause button clicked')
                            if (isRunning) {
                                onStop()
                            } else {
                                handleStartClick(e)
                            }
                        }}
                        onMouseDown={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                        }}
                        onMouseUp={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                        }}
                        onTouchStart={(e) => e.stopPropagation()}
                        onTouchEnd={(e) => e.stopPropagation()}
                        onTouchMove={(e) => e.stopPropagation()}
                        className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-colors"
                    >
                        {isRunning ? t('pause') : t('start')}
                    </button>
                    <button
                        onClick={onReset}
                        onTouchStart={(e) => e.stopPropagation()}
                        onTouchEnd={(e) => e.stopPropagation()}
                        onTouchMove={(e) => e.stopPropagation()}
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
                            onTouchStart={(e) => e.stopPropagation()}
                            onTouchEnd={(e) => e.stopPropagation()}
                            onTouchMove={(e) => e.stopPropagation()}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${phase === p
                                ? 'bg-white/20 text-white'
                                : 'bg-white/5 text-white/50 hover:bg-white/10'
                                }`}
                        >
                            {p === 'focus' ? t('focus') : p === 'short_break' ? t('shortBreak') : t('longBreak')}
                        </button>
                    ))}
                </div>

                {/* Session History */}
                <div className="mt-8">
                    <SessionHistory />
                </div>
            </motion.div>
        </>
    );
};

export default TimerCard;