import * as React from 'react'
import TaskList from '../TaskList'
import { t } from '../../lib/i18n'

interface TasksPageProps {
    className?: string
}

export default function TasksPage({ className = '' }: TasksPageProps) {
    return (
        <div className={`min-h-screen px-6 py-10 ${className}`}>
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold">{t('tasks')}</h1>
                    <p className="text-white/70 text-sm">{t('manageYourTasks')}</p>
                </div>

                {/* Tasks Content */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <TaskList />
                </div>
            </div>

            {/* Swipe indicators - Mobile only */}
            <div className="md:hidden mt-8 flex items-center justify-center gap-4 text-white/40 text-sm">
                <div className="flex items-center gap-1">
                    <span>↑</span>
                    <span>Back to Timer</span>
                </div>
            </div>
        </div>
    )
}
