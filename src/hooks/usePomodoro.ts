import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { settingsStore } from '../lib/settingsStore'

export type Phase = 'focus' | 'short_break' | 'long_break'
export interface PomodoroSettings {
    focusMinutes: number
    shortBreakMinutes: number
    longBreakMinutes: number
    sessionsUntilLongBreak: number
    autoStartNext: boolean
    sound: boolean
    notifications: boolean
}



export function usePomodoro() {
    const [settings, setSettings] = useState<PomodoroSettings>(() => settingsStore.getSettings())
    const [phase, setPhase] = useState<Phase>('focus')
    const [isRunning, setIsRunning] = useState(false)
    const [secondsLeft, setSecondsLeft] = useState(settings.focusMinutes * 60)
    const [completedFocusSessions, setCompletedFocusSessions] = useState<number>(() => Number(localStorage.getItem('focusCount') || 0))
    const tickRef = useRef<number | null>(null)

    useEffect(() => localStorage.setItem('focusCount', String(completedFocusSessions)), [completedFocusSessions])

    // Subscribe to global settings changes
    useEffect(() => {
        console.log('usePomodoro: Subscribing to settings store')
        const unsubscribe = settingsStore.subscribe((newSettings: PomodoroSettings) => {
            console.log('usePomodoro: Received settings update from store:', newSettings)
            setSettings(newSettings)
        })

        return () => {
            console.log('usePomodoro: Unsubscribing from settings store')
            unsubscribe()
        }
    }, [])

    const phaseSeconds = useMemo(() => ({
        focus: settings.focusMinutes * 60,
        short_break: settings.shortBreakMinutes * 60,
        long_break: settings.longBreakMinutes * 60,
    }), [settings])

    const prevPhaseSecondsRef = useRef(phaseSeconds)

    // Update secondsLeft when settings change (live update even when running)
    useEffect(() => {
        const prevPhaseSeconds = prevPhaseSecondsRef.current
        const currentPhaseSeconds = phaseSeconds[phase]

        console.log('usePomodoro: Settings change detected', {
            phase,
            prevDuration: prevPhaseSeconds[phase],
            newDuration: currentPhaseSeconds,
            isRunning,
            currentSecondsLeft: secondsLeft
        })

        // Check if the duration for current phase has changed
        if (prevPhaseSeconds[phase] !== currentPhaseSeconds) {
            console.log('usePomodoro: Duration changed, updating timer')
            if (!isRunning) {
                // If timer is stopped, set to full duration
                console.log('usePomodoro: Timer stopped, setting to full duration:', currentPhaseSeconds)
                setSecondsLeft(currentPhaseSeconds)
            } else {
                // If timer is running, maintain the same progress percentage
                console.log('usePomodoro: Timer running, maintaining progress percentage')
                setSecondsLeft(prevSeconds => {
                    const currentProgress = (prevPhaseSeconds[phase] - prevSeconds) / prevPhaseSeconds[phase]
                    const newSecondsLeft = Math.max(0, currentPhaseSeconds - (currentProgress * currentPhaseSeconds))
                    console.log('usePomodoro: Progress calculation', {
                        prevSeconds,
                        currentProgress,
                        newSecondsLeft
                    })
                    return Math.ceil(newSecondsLeft)
                })
            }
        }

        // Update the ref for next comparison
        prevPhaseSecondsRef.current = phaseSeconds
    }, [phaseSeconds, phase, isRunning])

    const stop = useCallback(() => {
        if (tickRef.current) cancelAnimationFrame(tickRef.current)
        tickRef.current = null
        setIsRunning(false)
    }, [])

    const start = useCallback(async () => {
        console.log('🎯 Pomodoro start called', { isRunning, phase })
        if (isRunning) return
        setIsRunning(true)

        let last = performance.now()
        const loop = (now: number) => {
            const delta = Math.floor((now - last) / 1000)
            if (delta >= 1) {
                setSecondsLeft(s => Math.max(0, s - delta))
                last = now
            }
            tickRef.current = requestAnimationFrame(loop)
        }
        tickRef.current = requestAnimationFrame(loop)
    }, [isRunning])

    const reset = useCallback((p: Phase = phase) => {
        stop() // Stop the timer first
        setSecondsLeft(phaseSeconds[p])
    }, [phase, phaseSeconds, stop])

    const nextPhase = useCallback(() => {
        if (phase === 'focus') {
            setCompletedFocusSessions(s => s + 1)
            const c = (completedFocusSessions + 1) % settings.sessionsUntilLongBreak
            const next: Phase = c === 0 ? 'long_break' : 'short_break'
            setPhase(next)
            setSecondsLeft(phaseSeconds[next])
            return next
        }
        setPhase('focus')
        setSecondsLeft(phaseSeconds.focus)
        return 'focus'
    }, [phase, phaseSeconds, settings.sessionsUntilLongBreak, completedFocusSessions])

    useEffect(() => {
        if (secondsLeft === 0) {
            stop()
            const p = nextPhase()
            if (settings.autoStartNext) start()
            window.dispatchEvent(new CustomEvent('pomodoro:phase-change', { detail: { phase: p } }))
        }
    }, [secondsLeft, nextPhase, settings.autoStartNext, start, stop])

    const setPhaseAndReset = useCallback((p: Phase) => {
        setPhase(p)
        setSecondsLeft(phaseSeconds[p])
    }, [phaseSeconds])

    const updateTimerDuration = useCallback((minutes: number) => {
        if (minutes < 1 || minutes > 60) return

        const newSettings = { ...settings }
        switch (phase) {
            case 'focus':
                newSettings.focusMinutes = minutes
                break
            case 'short_break':
                newSettings.shortBreakMinutes = minutes
                break
            case 'long_break':
                newSettings.longBreakMinutes = minutes
                break
        }

        // Update global settings store
        settingsStore.setSettings(newSettings)

        // Update local seconds left if timer is not running
        if (!isRunning) {
            setSecondsLeft(minutes * 60)
        }
    }, [phase, settings, isRunning])

    return {
        phase, isRunning, secondsLeft,
        settings, setSettings,
        start, stop, reset, setPhaseAndReset, updateTimerDuration
    }
}
