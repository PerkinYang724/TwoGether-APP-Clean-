import { useState } from 'react'
import { Target, Plus, Minus, RotateCcw, CheckCircle, TrendingUp } from 'lucide-react'
import { useGoalTracking } from '../hooks/useGoalTracking'
import { t } from '../lib/i18n'

export default function GoalTracker() {
    const {
        goalData,
        setDailyGoal,
        resetToday,
        getProgressPercentage,
        isGoalReached,
        getRemainingPomodoros
    } = useGoalTracking()

    const [isExpanded, setIsExpanded] = useState(false)
    // const [isEditing, setIsEditing] = useState(false)

    const progressPercentage = getProgressPercentage()
    const remaining = getRemainingPomodoros()
    const isReached = isGoalReached()

    const handleGoalChange = (delta: number) => {
        setDailyGoal(goalData.dailyGoal + delta)
    }

    const handleReset = () => {
        resetToday()
        setIsExpanded(false)
    }

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Target className="size-5 text-white/70" />
                    <h3 className="text-lg font-medium">{t('dailyGoal')}</h3>
                    {isReached && (
                        <CheckCircle className="size-4 text-green-400" />
                    )}
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-white/50 hover:text-white/70 transition-colors"
                >
                    {isExpanded ? <Minus className="size-4" /> : <Plus className="size-4" />}
                </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/70">
                        {goalData.completedToday} / {goalData.dailyGoal} {t('pomodoros')}
                    </span>
                    <span className="text-sm text-white/50">
                        {Math.round(progressPercentage)}%
                    </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full transition-all duration-500 ${isReached
                            ? 'bg-gradient-to-r from-green-400 to-green-500'
                            : 'bg-gradient-to-r from-blue-400 to-blue-500'
                            }`}
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </div>

            {/* Status Message */}
            <div className="mb-4">
                {isReached ? (
                    <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle className="size-4" />
                        <span className="text-sm font-medium">{t('goalReached')}</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-white/70">
                        <TrendingUp className="size-4" />
                        <span className="text-sm">
                            {remaining === 1
                                ? t('oneMorePomodoro')
                                : t('remainingPomodoros')
                            }
                        </span>
                    </div>
                )}
            </div>

            {isExpanded && (
                <div className="space-y-4">
                    {/* Goal Setting */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-white/70">{t('setDailyGoal')}</h4>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => handleGoalChange(-1)}
                                disabled={goalData.dailyGoal <= 1}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                            >
                                <Minus className="size-4" />
                            </button>
                            <div className="flex-1 text-center">
                                <span className="text-2xl font-bold">{goalData.dailyGoal}</span>
                                <span className="text-sm text-white/50 ml-1">{t('pomodoros')}</span>
                            </div>
                            <button
                                onClick={() => handleGoalChange(1)}
                                disabled={goalData.dailyGoal >= 20}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                            >
                                <Plus className="size-4" />
                            </button>
                        </div>
                        <p className="text-xs text-white/50 text-center">
                            {t('goalRange')}
                        </p>
                    </div>

                    {/* Reset Button */}
                    <div className="pt-2 border-t border-white/10">
                        <button
                            onClick={handleReset}
                            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-sm"
                        >
                            <RotateCcw className="size-4" />
                            {t('resetToday')}
                        </button>
                    </div>
                </div>
            )}

            {/* Collapsed view - show progress */}
            {!isExpanded && (
                <div className="text-sm text-white/70">
                    {isReached ? (
                        <span className="text-green-400">{t('goalCompleted')}</span>
                    ) : (
                        <span>{remaining} {t('remaining')}</span>
                    )}
                </div>
            )}
        </div>
    )
}
