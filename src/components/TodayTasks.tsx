import { useState } from 'react'
import { Plus, Check, Trash2, X, ListTodo } from 'lucide-react'
import { useTasks } from '../hooks/useTasks'
import { t } from '../lib/i18n'

export default function TodayTasks() {
    const {
        activeTasks,
        completedTasks,
        newTaskText,
        setNewTaskText,
        addTask,
        toggleTask,
        deleteTask,
        clearCompleted
    } = useTasks()

    const [isExpanded, setIsExpanded] = useState(false)

    // Filter tasks for today only
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todayActiveTasks = activeTasks.filter(task => {
        const taskDate = new Date(task.createdAt)
        taskDate.setHours(0, 0, 0, 0)
        return taskDate.getTime() === today.getTime()
    })
    
    const todayCompletedTasks = completedTasks.filter(task => {
        const taskDate = new Date(task.createdAt)
        taskDate.setHours(0, 0, 0, 0)
        return taskDate.getTime() === today.getTime()
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        addTask(newTaskText)
    }

    const totalTodayTasks = todayActiveTasks.length + todayCompletedTasks.length

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <ListTodo className="size-5 text-white/70" />
                    <h3 className="text-lg font-medium">{t('tasks')} - {t('today')}</h3>
                    {totalTodayTasks > 0 && (
                        <span className="bg-white/10 text-xs px-2 py-1 rounded-full">
                            {todayActiveTasks.length} {t('active')}
                        </span>
                    )}
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-white/50 hover:text-white/70 transition-colors"
                >
                    {isExpanded ? <X className="size-4" /> : <Plus className="size-4" />}
                </button>
            </div>

            {isExpanded && (
                <div className="space-y-4">
                    {/* Add new task form */}
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input
                            type="text"
                            value={newTaskText}
                            onChange={(e) => setNewTaskText(e.target.value)}
                            placeholder={t('addTaskPlaceholder')}
                            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent text-sm"
                        />
                        <button
                            type="submit"
                            disabled={!newTaskText.trim()}
                            className="px-4 py-2 bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:text-white/30 text-white font-medium rounded-lg transition-colors text-sm"
                        >
                            <Plus className="size-4" />
                        </button>
                    </form>
                </div>
            )}

            {/* Today's tasks list */}
            {totalTodayTasks > 0 ? (
                <div className="space-y-2">
                    {/* Active tasks */}
                    {todayActiveTasks.map((task) => (
                        <div
                            key={task.id}
                            className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10"
                        >
                            <button
                                onClick={() => toggleTask(task.id)}
                                className="flex-shrink-0 w-5 h-5 border border-white/30 rounded hover:border-white/50 transition-colors"
                            >
                                <Check className="size-3 text-white/50" />
                            </button>
                            <span className="flex-1 text-white/90 text-sm">{task.text}</span>
                            <button
                                onClick={() => deleteTask(task.id)}
                                className="flex-shrink-0 text-white/30 hover:text-red-400 transition-colors"
                            >
                                <Trash2 className="size-4" />
                            </button>
                        </div>
                    ))}

                    {/* Completed tasks */}
                    {todayCompletedTasks.map((task) => (
                        <div
                            key={task.id}
                            className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 opacity-60"
                        >
                            <button
                                onClick={() => toggleTask(task.id)}
                                className="flex-shrink-0 w-5 h-5 bg-white/20 border border-white/30 rounded flex items-center justify-center"
                            >
                                <Check className="size-3 text-white" />
                            </button>
                            <span className="flex-1 text-white/70 text-sm line-through">{task.text}</span>
                            <button
                                onClick={() => deleteTask(task.id)}
                                className="flex-shrink-0 text-white/30 hover:text-red-400 transition-colors"
                            >
                                <Trash2 className="size-4" />
                            </button>
                        </div>
                    ))}

                    {/* Clear completed button */}
                    {todayCompletedTasks.length > 0 && (
                        <button
                            onClick={clearCompleted}
                            className="w-full mt-3 py-2 text-white/50 hover:text-white/70 text-sm transition-colors"
                        >
                            {t('clearCompleted')}
                        </button>
                    )}
                </div>
            ) : (
                <div className="text-center py-6">
                    <ListTodo className="size-8 text-white/30 mx-auto mb-2" />
                    <p className="text-white/50 text-sm">{t('noTasksYet')}</p>
                    <p className="text-white/30 text-xs mt-1">{t('addFirstTask')}</p>
                </div>
            )}
        </div>
    )
}
