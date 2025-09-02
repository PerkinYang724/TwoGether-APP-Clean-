import { useState, useEffect } from 'react'

export interface GoalData {
    dailyGoal: number
    completedToday: number
    lastResetDate: string
}

export function useGoalTracking() {
    const [goalData, setGoalData] = useState<GoalData>({
        dailyGoal: 8,
        completedToday: 0,
        lastResetDate: new Date().toDateString()
    })

    // Load goal data from localStorage on mount
    useEffect(() => {
        const savedGoalData = localStorage.getItem('pomodoro-goal-data')
        if (savedGoalData) {
            try {
                const parsed = JSON.parse(savedGoalData)
                const today = new Date().toDateString()

                // Reset completed count if it's a new day
                if (parsed.lastResetDate !== today) {
                    setGoalData({
                        dailyGoal: parsed.dailyGoal || 8,
                        completedToday: 0,
                        lastResetDate: today
                    })
                } else {
                    setGoalData(parsed)
                }
            } catch (error) {
                console.error('Error loading goal data:', error)
            }
        }
    }, [])

    // Save goal data to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('pomodoro-goal-data', JSON.stringify(goalData))
    }, [goalData])

    const setDailyGoal = (goal: number) => {
        setGoalData(prev => ({
            ...prev,
            dailyGoal: Math.max(1, Math.min(20, goal)) // Limit between 1-20
        }))
    }

    const incrementCompleted = () => {
        setGoalData(prev => ({
            ...prev,
            completedToday: prev.completedToday + 1
        }))
    }

    const resetToday = () => {
        setGoalData(prev => ({
            ...prev,
            completedToday: 0,
            lastResetDate: new Date().toDateString()
        }))
    }

    const getProgressPercentage = () => {
        if (goalData.dailyGoal === 0) return 0
        return Math.min(100, (goalData.completedToday / goalData.dailyGoal) * 100)
    }

    const isGoalReached = () => {
        return goalData.completedToday >= goalData.dailyGoal
    }

    const getRemainingPomodoros = () => {
        return Math.max(0, goalData.dailyGoal - goalData.completedToday)
    }

    return {
        goalData,
        setDailyGoal,
        incrementCompleted,
        resetToday,
        getProgressPercentage,
        isGoalReached,
        getRemainingPomodoros
    }
}
