import { useState, useEffect, useRef } from 'react'
import { Plus, X } from 'lucide-react'
import { useTasks } from '../hooks/useTasks'
import { t } from '../lib/i18n'

interface QuickAddTaskProps {
    className?: string
}

export default function QuickAddTask({ className = '' }: QuickAddTaskProps) {
    const { addTask } = useTasks()
    const [isOpen, setIsOpen] = useState(false)
    const [taskText, setTaskText] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)
    const modalRef = useRef<HTMLDivElement>(null)

    // Keyboard shortcut handler
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            // Only handle shortcuts when modal is not open or when it's open but not focused
            if (e.key === 'n' || e.key === 'N') {
                if (!isOpen && !document.activeElement?.closest('[data-modal]')) {
                    e.preventDefault()
                    setIsOpen(true)
                    setTimeout(() => inputRef.current?.focus(), 100)
                }
            }
            if (e.key === 'Escape' && isOpen) {
                e.preventDefault()
                setIsOpen(false)
                setTaskText('')
            }
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [isOpen])

    // Close modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setIsOpen(false)
                setTaskText('')
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            return () => document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (taskText.trim()) {
            addTask(taskText.trim())
            setIsOpen(false)
            setTaskText('')
        }
    }

    const handleInputKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleSubmit(e as any)
        }
    }

    return (
        <>
            {/* Floating Add Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 z-50 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 ${className}`}
                aria-label={t('addTask')}
            >
                <Plus className="size-6" />
            </button>

            {/* Quick Add Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" data-modal>
                    <div
                        ref={modalRef}
                        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 w-full max-w-md border border-white/20 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">{t('quickAddTask')}</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white/50 hover:text-white transition-colors"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={taskText}
                                    onChange={(e) => setTaskText(e.target.value)}
                                    onKeyDown={handleInputKeyDown}
                                    placeholder={t('addTaskPlaceholder')}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                    autoFocus
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={!taskText.trim()}
                                    className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl transition-colors font-medium"
                                >
                                    {t('addTask')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-3 text-white/70 hover:text-white transition-colors"
                                >
                                    {t('cancel')}
                                </button>
                            </div>
                        </form>

                        {/* Keyboard shortcut hint */}
                        <div className="mt-4 text-xs text-white/40 text-center">
                            {t('keyboardShortcut')}: <kbd className="bg-white/10 px-1 rounded">N</kbd>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}