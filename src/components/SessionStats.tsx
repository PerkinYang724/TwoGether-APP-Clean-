import { useState } from 'react'
import { BarChart3, Calendar, Clock, Target, TrendingUp, Award, Zap } from 'lucide-react'
import { useSessionStats } from '../hooks/useSessionStats'
import { t } from '../lib/i18n'

export default function SessionStats() {
    const {
        getTodayStats,
        getWeeklyStats,
        getTotalStats,
        formatDuration,
        formatTime
    } = useSessionStats()

    const [activeTab, setActiveTab] = useState<'today' | 'week' | 'total'>('today')

    const todayStats = getTodayStats()
    const weeklyStats = getWeeklyStats()
    const totalStats = getTotalStats()

    const tabs = [
        { id: 'today' as const, label: t('today'), icon: Calendar },
        { id: 'week' as const, label: t('thisWeek'), icon: BarChart3 },
        { id: 'total' as const, label: t('allTime'), icon: Award }
    ]

    const renderTodayStats = () => (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                        <Target className="size-4 text-blue-400" />
                        <span className="text-sm text-white/70">{t('sessionsCompleted')}</span>
                    </div>
                    <div className="text-2xl font-bold">{todayStats.focusSessions}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="size-4 text-green-400" />
                        <span className="text-sm text-white/70">{t('focusTime')}</span>
                    </div>
                    <div className="text-2xl font-bold">{formatDuration(todayStats.totalFocusTime)}</div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="size-4 text-purple-400" />
                        <span className="text-sm text-white/70">{t('avgSession')}</span>
                    </div>
                    <div className="text-2xl font-bold">{formatTime(todayStats.averageSessionLength)}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                        <Zap className="size-4 text-yellow-400" />
                        <span className="text-sm text-white/70">{t('longestSession')}</span>
                    </div>
                    <div className="text-2xl font-bold">{formatTime(todayStats.longestSession)}</div>
                </div>
            </div>

            {todayStats.focusSessions > 0 && (
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-white/70">{t('completionRate')}</span>
                        <span className="text-sm font-medium">{Math.round(todayStats.completionRate)}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                            className="h-2 rounded-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500"
                            style={{ width: `${todayStats.completionRate}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    )

    const renderWeeklyStats = () => (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                        <Target className="size-4 text-blue-400" />
                        <span className="text-sm text-white/70">{t('totalSessions')}</span>
                    </div>
                    <div className="text-2xl font-bold">{weeklyStats.totalSessions}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="size-4 text-green-400" />
                        <span className="text-sm text-white/70">{t('totalFocusTime')}</span>
                    </div>
                    <div className="text-2xl font-bold">{formatDuration(weeklyStats.totalFocusTime)}</div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="size-4 text-purple-400" />
                        <span className="text-sm text-white/70">{t('avgDailySessions')}</span>
                    </div>
                    <div className="text-2xl font-bold">{Math.round(weeklyStats.averageDailySessions * 10) / 10}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                        <Award className="size-4 text-yellow-400" />
                        <span className="text-sm text-white/70">{t('streak')}</span>
                    </div>
                    <div className="text-2xl font-bold">{weeklyStats.streak}</div>
                </div>
            </div>

            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                    <Clock className="size-4 text-blue-400" />
                    <span className="text-sm text-white/70">{t('avgDailyFocusTime')}</span>
                </div>
                <div className="text-2xl font-bold">{formatDuration(weeklyStats.averageDailyFocusTime)}</div>
            </div>
        </div>
    )

    const renderTotalStats = () => (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                        <Target className="size-4 text-blue-400" />
                        <span className="text-sm text-white/70">{t('totalSessions')}</span>
                    </div>
                    <div className="text-2xl font-bold">{totalStats.totalSessions}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="size-4 text-green-400" />
                        <span className="text-sm text-white/70">{t('totalFocusTime')}</span>
                    </div>
                    <div className="text-2xl font-bold">{formatDuration(totalStats.totalFocusTime)}</div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="size-4 text-purple-400" />
                        <span className="text-sm text-white/70">{t('avgSession')}</span>
                    </div>
                    <div className="text-2xl font-bold">{formatTime(totalStats.averageSessionLength)}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                        <Award className="size-4 text-yellow-400" />
                        <span className="text-sm text-white/70">{t('completedSessions')}</span>
                    </div>
                    <div className="text-2xl font-bold">{totalStats.completedSessions}</div>
                </div>
            </div>

            {totalStats.totalSessions > 0 && (
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-white/70">{t('completionRate')}</span>
                        <span className="text-sm font-medium">{Math.round(totalStats.completionRate)}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                            className="h-2 rounded-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500"
                            style={{ width: `${totalStats.completionRate}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    )

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="size-5 text-white/70" />
                <h3 className="text-lg font-medium">{t('sessionStats')}</h3>
            </div>

            {/* Tab Navigation */}
            <div className="flex bg-white/5 rounded-xl p-1 mb-4 overflow-x-auto">
                {tabs.map(tab => {
                    const Icon = tab.icon
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-shrink-0 flex items-center justify-center gap-1 sm:gap-2 py-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-colors min-w-0 ${activeTab === tab.id
                                ? 'bg-white/10 text-white'
                                : 'text-white/70 hover:text-white/90'
                                }`}
                        >
                            <Icon className="size-3 sm:size-4" />
                            <span className="truncate">{tab.label}</span>
                        </button>
                    )
                })}
            </div>

            {/* Tab Content */}
            <div className="min-h-[200px]">
                {activeTab === 'today' && renderTodayStats()}
                {activeTab === 'week' && renderWeeklyStats()}
                {activeTab === 'total' && renderTotalStats()}
            </div>

            {/* Empty State */}
            {totalStats.totalSessions === 0 && (
                <div className="text-center py-8 text-white/50">
                    <BarChart3 className="size-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">{t('noStatsYet')}</p>
                    <p className="text-xs mt-1">{t('completeFirstSession')}</p>
                </div>
            )}
        </div>
    )
}
