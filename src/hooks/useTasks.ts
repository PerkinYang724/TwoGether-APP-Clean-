import { useState, useEffect, useCallback, useMemo } from 'react'

export interface Task {
    id: string
    text: string
    completed: boolean
    createdAt: Date
    completedAt?: Date
    estimatedMinutes?: number
}

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [newTaskText, setNewTaskText] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    // Load tasks from localStorage on mount with performance optimization
    useEffect(() => {
        const loadTasks = () => {
            try {
                const savedTasks = localStorage.getItem('pomodoro-tasks')
                if (savedTasks) {
                    const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
                        ...task,
                        createdAt: new Date(task.createdAt),
                        completedAt: task.completedAt ? new Date(task.completedAt) : undefined
                    }))
                    setTasks(parsedTasks)
                }
            } catch (error) {
                console.error('Error loading tasks:', error)
            } finally {
                setIsLoading(false)
            }
        }

        // Use requestIdleCallback for better performance
        if ('requestIdleCallback' in window) {
            requestIdleCallback(loadTasks)
        } else {
            setTimeout(loadTasks, 0)
        }
    }, [])

    // Debounced save to localStorage for better performance
    useEffect(() => {
        if (isLoading) return

        const timeoutId = setTimeout(() => {
            try {
                localStorage.setItem('pomodoro-tasks', JSON.stringify(tasks))
            } catch (error) {
                console.error('Error saving tasks:', error)
            }
        }, 300) // 300ms debounce

        return () => clearTimeout(timeoutId)
    }, [tasks, isLoading])

    const addTask = useCallback((text: string, estimatedMinutes?: number) => {
        if (text.trim()) {
            const newTask: Task = {
                id: Date.now().toString(),
                text: text.trim(),
                completed: false,
                createdAt: new Date(),
                estimatedMinutes
            }
            setTasks(prev => [newTask, ...prev])
            setNewTaskText('')
        }
    }, [])

    const toggleTask = useCallback((id: string) => {
        setTasks(prev => prev.map(task =>
            task.id === id
                ? {
                    ...task,
                    completed: !task.completed,
                    completedAt: !task.completed ? new Date() : undefined
                }
                : task
        ))
    }, [])

    const deleteTask = useCallback((id: string) => {
        setTasks(prev => prev.filter(task => task.id !== id))
    }, [])

    const clearCompleted = useCallback(() => {
        setTasks(prev => prev.filter(task => !task.completed))
    }, [])

    // Memoized computed values for better performance
    const activeTasks = useMemo(() => tasks.filter(task => !task.completed), [tasks])
    const completedTasks = useMemo(() => tasks.filter(task => task.completed), [tasks])

    return {
        tasks,
        activeTasks,
        completedTasks,
        newTaskText,
        setNewTaskText,
        addTask,
        toggleTask,
        deleteTask,
        clearCompleted,
        isLoading
    }
}
