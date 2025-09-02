import { useState, useEffect } from 'react'

export interface Task {
    id: string
    text: string
    completed: boolean
    createdAt: Date
    completedAt?: Date
}

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [newTaskText, setNewTaskText] = useState('')

    // Load tasks from localStorage on mount
    useEffect(() => {
        const savedTasks = localStorage.getItem('pomodoro-tasks')
        if (savedTasks) {
            try {
                const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
                    ...task,
                    createdAt: new Date(task.createdAt),
                    completedAt: task.completedAt ? new Date(task.completedAt) : undefined
                }))
                setTasks(parsedTasks)
            } catch (error) {
                console.error('Error loading tasks:', error)
            }
        }
    }, [])

    // Save tasks to localStorage whenever tasks change
    useEffect(() => {
        localStorage.setItem('pomodoro-tasks', JSON.stringify(tasks))
    }, [tasks])

    const addTask = (text: string) => {
        if (text.trim()) {
            const newTask: Task = {
                id: Date.now().toString(),
                text: text.trim(),
                completed: false,
                createdAt: new Date()
            }
            setTasks(prev => [newTask, ...prev])
            setNewTaskText('')
        }
    }

    const toggleTask = (id: string) => {
        setTasks(prev => prev.map(task =>
            task.id === id
                ? {
                    ...task,
                    completed: !task.completed,
                    completedAt: !task.completed ? new Date() : undefined
                }
                : task
        ))
    }

    const deleteTask = (id: string) => {
        setTasks(prev => prev.filter(task => task.id !== id))
    }

    const clearCompleted = () => {
        setTasks(prev => prev.filter(task => !task.completed))
    }

    const activeTasks = tasks.filter(task => !task.completed)
    const completedTasks = tasks.filter(task => task.completed)

    return {
        tasks,
        activeTasks,
        completedTasks,
        newTaskText,
        setNewTaskText,
        addTask,
        toggleTask,
        deleteTask,
        clearCompleted
    }
}
