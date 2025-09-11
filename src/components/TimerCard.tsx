import React, { useState, useCallback, useMemo } from 'react';
import { t } from '../lib/i18n';
import { ensurePermission } from '../lib/notifications';

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

    const handleStartClick = useCallback((e?: React.MouseEvent) => {
        e?.preventDefault()
        e?.stopPropagation()

        console.log('TimerCard: handleStartClick called, phase:', phase)

        // Request notification permission on user gesture
        ensurePermission()

        if (phase === 'focus') {
            console.log('TimerCard: Showing inline tag input')
            setShowTagInput(true)
        } else {
            console.log('TimerCard: Starting timer directly')
            onStart()
        }
    }, [phase, onStart])

    const handleTagSubmit = useCallback(() => {
        if (tagInputValue.trim()) {
            console.log('TimerCard: Submitting tag:', tagInputValue.trim())
            setCurrentTag(tagInputValue.trim())
            setShowTagInput(false)
            setTagInputValue('')
            onStart(tagInputValue.trim())
        }
    }, [tagInputValue, onStart])

    const handleTagCancel = useCallback(() => {
        setShowTagInput(false)
        setTagInputValue('')
    }, [])

    const formatMMSS = useCallback((seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, []);

    const getLabel = useCallback(() => {
        switch (phase) {
            case 'focus': return t('focus');
            case 'short_break': return t('shortBreak');
            case 'long_break': return t('longBreak');
            default: return '';
        }
    }, [phase]);

    // Memoized formatted time to prevent unnecessary re-renders
    const formattedTime = useMemo(() => formatMMSS(secondsLeft), [secondsLeft, formatMMSS])
    const label = useMemo(() => getLabel(), [getLabel])

    return (
        <>
            <div
                className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 md:p-8 text-center border border-white/10 overflow-hidden w-full"
            >

                {/* Timer content */}
                <div className="text-sm uppercase tracking-widest text-white/70 mb-4">
                    {label}
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
                <div
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-light text-white mb-8 whitespace-nowrap overflow-hidden tracking-wider"
                    key={secondsLeft}
                >
                    {formattedTime}
                </div>

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
                                className="px-4 py-2 bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:text-white/30 text-white font-medium rounded-lg text-sm"
                            >
                                {t('start')}
                            </button>
                            <button
                                onClick={handleTagCancel}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 rounded-lg text-sm"
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
                        className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium"
                    >
                        {isRunning ? t('pause') : t('start')}
                    </button>
                    <button
                        onClick={onReset}
                        onTouchStart={(e) => e.stopPropagation()}
                        onTouchEnd={(e) => e.stopPropagation()}
                        onTouchMove={(e) => e.stopPropagation()}
                        className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 font-medium"
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
                            className={`px-3 py-1 rounded text-xs font-medium ${phase === p
                                ? 'bg-white/20 text-white'
                                : 'bg-white/5 text-white/50 hover:bg-white/10'
                                }`}
                        >
                            {p === 'focus' ? t('focus') : p === 'short_break' ? t('shortBreak') : t('longBreak')}
                        </button>
                    ))}
                </div>


            </div>
        </>
    );
};

export default TimerCard;