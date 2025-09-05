import SessionStats from '../SessionStats'
import EnhancedStatsPanel from '../EnhancedStatsPanel'
import GoalTracker from '../GoalTracker'
import { t } from '../../lib/i18n'

interface StatsPageProps {
    className?: string
}

export default function StatsPage({ className = '' }: StatsPageProps) {
    return (
        <div className={`px-4 sm:px-6 py-10 pb-20 ${className}`}>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-xl sm:text-2xl font-semibold">{t('statsAndGoals')} - History</h1>
                    <p className="text-white/70 text-sm">View your historical progress and achievements</p>
                </div>

                {/* Stats Content */}
                <div className="space-y-4 sm:space-y-6">
                    {/* Session Stats */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/10">
                        <SessionStats />
                    </div>

                    {/* Enhanced Stats Panel */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/10">
                        <EnhancedStatsPanel />
                    </div>

                    {/* Goal Tracker */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/10">
                        <GoalTracker />
                    </div>
                </div>
            </div>

            {/* Swipe indicators - Mobile only */}
            <div className="md:hidden mt-8 flex items-center justify-center gap-4 text-white/40 text-sm">
                <div className="flex items-center gap-1">
                    <span>← →</span>
                    <span>Navigate</span>
                </div>
            </div>
        </div>
    )
}
