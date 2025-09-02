import { useState, useEffect } from 'react'

export interface SessionRecord {
    id: string
    date: string
    duration: number // in seconds
    phase: 'focus' | 'short_break' | 'long_break'
    completed: boolean
    timestamp: number
}

export interface DailyStats {
    date: string
    focusSessions: number
    totalFocusTime: number // in seconds
    totalBreakTime: number // in seconds
    averageSessionLength: number // in seconds
    longestSession: number // in seconds
    completionRate: number // percentage
}

export interface WeeklyStats {
    weekStart: string
    totalSessions: number
    totalFocusTime: number
    averageDailySessions: number
    averageDailyFocusTime: number
    streak: number // consecutive days with at least 1 session
}

export function useSessionStats() {
    const [sessions, setSessions] = useState<SessionRecord[]>([])

    // Load sessions from localStorage on mount
    useEffect(() => {
        const savedSessions = localStorage.getItem('pomodoro-sessions')
        if (savedSessions) {
            try {
                const parsed = JSON.parse(savedSessions)
                setSessions(parsed)
            } catch (error) {
                console.error('Error loading sessions:', error)
            }
        }
    }, [])

    // Save sessions to localStorage whenever sessions change
    useEffect(() => {
        localStorage.setItem('pomodoro-sessions', JSON.stringify(sessions))
    }, [sessions])

    const addSession = (duration: number, phase: 'focus' | 'short_break' | 'long_break', completed: boolean = true) => {
        const newSession: SessionRecord = {
            id: Date.now().toString(),
            date: new Date().toDateString(),
            duration,
            phase,
            completed,
            timestamp: Date.now()
        }
        setSessions(prev => [newSession, ...prev])
    }

    const getTodayStats = (): DailyStats => {
        const today = new Date().toDateString()
        const todaySessions = sessions.filter(s => s.date === today && s.phase === 'focus')

        const totalFocusTime = todaySessions.reduce((sum, s) => sum + s.duration, 0)
        const completedSessions = todaySessions.filter(s => s.completed)
        const longestSession = todaySessions.length > 0 ? Math.max(...todaySessions.map(s => s.duration)) : 0
        const averageSessionLength = todaySessions.length > 0 ? totalFocusTime / todaySessions.length : 0
        const completionRate = todaySessions.length > 0 ? (completedSessions.length / todaySessions.length) * 100 : 0

        // Calculate break time for today
        const todayBreaks = sessions.filter(s => s.date === today && (s.phase === 'short_break' || s.phase === 'long_break'))
        const totalBreakTime = todayBreaks.reduce((sum, s) => sum + s.duration, 0)

        return {
            date: today,
            focusSessions: todaySessions.length,
            totalFocusTime,
            totalBreakTime,
            averageSessionLength,
            longestSession,
            completionRate
        }
    }

    const getWeeklyStats = (): WeeklyStats => {
        const today = new Date()
        const weekStart = new Date(today.setDate(today.getDate() - today.getDay())).toDateString()

        // Get sessions from the last 7 days
        const weekSessions = sessions.filter(s => {
            const sessionDate = new Date(s.date)
            const weekStartDate = new Date(weekStart)
            return sessionDate >= weekStartDate
        })

        const focusSessions = weekSessions.filter(s => s.phase === 'focus')
        const totalFocusTime = focusSessions.reduce((sum, s) => sum + s.duration, 0)

        // Calculate unique days with sessions
        const daysWithSessions = new Set(focusSessions.map(s => s.date)).size
        const averageDailySessions = daysWithSessions > 0 ? focusSessions.length / daysWithSessions : 0
        const averageDailyFocusTime = daysWithSessions > 0 ? totalFocusTime / daysWithSessions : 0

        // Calculate streak (consecutive days with at least 1 focus session)
        const streak = calculateStreak(focusSessions)

        return {
            weekStart,
            totalSessions: focusSessions.length,
            totalFocusTime,
            averageDailySessions,
            averageDailyFocusTime,
            streak
        }
    }

    const calculateStreak = (focusSessions: SessionRecord[]): number => {
        if (focusSessions.length === 0) return 0

        const today = new Date()
        let streak = 0
        let currentDate = new Date(today)

        // Get unique dates with focus sessions, sorted by date
        const sessionDates = [...new Set(focusSessions.map(s => s.date))].sort((a, b) =>
            new Date(b).getTime() - new Date(a).getTime()
        )

        for (const sessionDate of sessionDates) {
            const sessionDateObj = new Date(sessionDate)
            const daysDiff = Math.floor((currentDate.getTime() - sessionDateObj.getTime()) / (1000 * 60 * 60 * 24))

            if (daysDiff === streak) {
                streak++
                currentDate = new Date(sessionDateObj.getTime() - 24 * 60 * 60 * 1000)
            } else {
                break
            }
        }

        return streak
    }

    const getTotalStats = () => {
        const focusSessions = sessions.filter(s => s.phase === 'focus')
        const totalFocusTime = focusSessions.reduce((sum, s) => sum + s.duration, 0)
        const totalSessions = focusSessions.length
        const completedSessions = focusSessions.filter(s => s.completed).length
        const completionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0

        return {
            totalSessions,
            totalFocusTime,
            completedSessions,
            completionRate,
            averageSessionLength: totalSessions > 0 ? totalFocusTime / totalSessions : 0
        }
    }

    const clearOldSessions = (daysToKeep: number = 30) => {
        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

        setSessions(prev => prev.filter(s => new Date(s.date) >= cutoffDate))
    }

    const formatDuration = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)

        if (hours > 0) {
            return `${hours}h ${minutes}m`
        }
        return `${minutes}m`
    }

    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}`
        }
        return `${minutes}m`
    }

    return {
        sessions,
        addSession,
        getTodayStats,
        getWeeklyStats,
        getTotalStats,
        clearOldSessions,
        formatDuration,
        formatTime
    }
}
