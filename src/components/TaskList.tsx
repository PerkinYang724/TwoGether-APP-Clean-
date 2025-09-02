import { useState } from 'react'
import { Plus, Check, Trash2, X, ListTodo } from 'lucide-react'
import { useTasks } from '../hooks/useTasks'
import { t } from '../lib/i18n'

export default function TaskList() {
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        addTask(newTaskText)
    }

    const totalTasks = activeTasks.length + completedTasks.length

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <ListTodo className="size-5 text-white/70" />
                    <h3 className="text-lg font-medium">{t('tasks')}</h3>
                    {totalTasks > 0 && (
                        <span className="bg-white/10 text-xs px-2 py-1 rounded-full">
                            {activeTasks.length} {t('active')}
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
                            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent"
                        />
                        <button
                            type="submit"
                            disabled={!newTaskText.trim()}
                            className="bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl px-3 py-2 transition-colors"
                        >
                            <Plus className="size-4" />
                        </button>
                    </form>

                    {/* Active tasks */}
                    {activeTasks.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium text-white/70">{t('activeTasks')}</h4>
                            {activeTasks.map(task => (
                                <div
                                    key={task.id}
                                    className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
                                >
                                    <button
                                        onClick={() => toggleTask(task.id)}
                                        className="w-5 h-5 rounded border-2 border-white/30 hover:border-white/50 transition-colors flex items-center justify-center"
                                    >
                                        <Check className="size-3 opacity-0" />
                                    </button>
                                    <span className="flex-1 text-sm">{task.text}</span>
                                    <button
                                        onClick={() => deleteTask(task.id)}
                                        className="text-white/30 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 className="size-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Completed tasks */}
                    {completedTasks.length > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium text-white/70">{t('completedTasks')}</h4>
                                <button
                                    onClick={clearCompleted}
                                    className="text-xs text-white/50 hover:text-white/70 underline"
                                >
                                    {t('clearCompleted')}
                                </button>
                            </div>
                            {completedTasks.map(task => (
                                <div
                                    key={task.id}
                                    className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 opacity-60"
                                >
                                    <button
                                        onClick={() => toggleTask(task.id)}
                                        className="w-5 h-5 rounded border-2 border-green-400 bg-green-400 flex items-center justify-center"
                                    >
                                        <Check className="size-3 text-white" />
                                    </button>
                                    <span className="flex-1 text-sm line-through text-white/70">{task.text}</span>
                                    <button
                                        onClick={() => deleteTask(task.id)}
                                        className="text-white/30 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 className="size-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Empty state */}
                    {totalTasks === 0 && (
                        <div className="text-center py-8 text-white/50">
                            <ListTodo className="size-12 mx-auto mb-3 opacity-50" />
                            <p className="text-sm">{t('noTasksYet')}</p>
                            <p className="text-xs mt-1">{t('addFirstTask')}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Collapsed view - show task count */}
            {!isExpanded && totalTasks > 0 && (
                <div className="text-sm text-white/70">
                    {activeTasks.length} {t('activeTasks')} • {completedTasks.length} {t('completed')}
                </div>
            )}
        </div>
    )
}
