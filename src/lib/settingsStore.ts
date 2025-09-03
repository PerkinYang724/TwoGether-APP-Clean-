import { PomodoroSettings } from '../hooks/usePomodoro'

const defaultSettings: PomodoroSettings = {
    focusMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    sessionsUntilLongBreak: 4,
    autoStartNext: true,
    sound: true,
    notifications: true,
}

// Global settings store
let currentSettings: PomodoroSettings = (() => {
    const raw = localStorage.getItem('settings')
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings
})()

// Listeners for settings changes
const listeners = new Set<(settings: PomodoroSettings) => void>()

export const settingsStore = {
    getSettings: (): PomodoroSettings => currentSettings,
    
    setSettings: (newSettings: PomodoroSettings) => {
        console.log('settingsStore: Updating settings', { old: currentSettings, new: newSettings })
        currentSettings = newSettings
        localStorage.setItem('settings', JSON.stringify(newSettings))
        
        // Notify all listeners
        listeners.forEach(listener => {
            try {
                listener(newSettings)
            } catch (error) {
                console.error('Error in settings listener:', error)
            }
        })
    },
    
    subscribe: (listener: (settings: PomodoroSettings) => void) => {
        listeners.add(listener)
        console.log('settingsStore: Added listener, total listeners:', listeners.size)
        
        // Return unsubscribe function
        return () => {
            listeners.delete(listener)
            console.log('settingsStore: Removed listener, total listeners:', listeners.size)
        }
    }
}
