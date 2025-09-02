import { useState, useEffect, useCallback } from 'react'
import { Theme, getTheme, getAllThemes, ThemeConfig } from '../lib/themes'

const THEME_STORAGE_KEY = 'pomodoro-theme'

export function useTheme() {
    const [currentTheme, setCurrentTheme] = useState<Theme>('study-zen')
    const [themeConfig, setThemeConfig] = useState<ThemeConfig>(getTheme('study-zen'))
    const [isLoading, setIsLoading] = useState(true)

    // Load theme from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme
        if (savedTheme && getTheme(savedTheme)) {
            setCurrentTheme(savedTheme)
            setThemeConfig(getTheme(savedTheme))
        }
        setIsLoading(false)
    }, [])

    // Apply theme to document
    useEffect(() => {
        if (isLoading) return

        try {
            const theme = getTheme(currentTheme)
            setThemeConfig(theme) // Update theme config state
            const root = document.documentElement

            // Apply CSS custom properties
            root.style.setProperty('--theme-primary', theme.colors.primary)
            root.style.setProperty('--theme-secondary', theme.colors.secondary)
            root.style.setProperty('--theme-accent', theme.colors.accent)
            root.style.setProperty('--theme-background', theme.colors.background)
            root.style.setProperty('--theme-surface', theme.colors.surface)
            root.style.setProperty('--theme-text', theme.colors.text)
            root.style.setProperty('--theme-text-secondary', theme.colors.textSecondary)
            root.style.setProperty('--theme-border', theme.colors.border)
            root.style.setProperty('--theme-success', theme.colors.success)
            root.style.setProperty('--theme-warning', theme.colors.warning)
            root.style.setProperty('--theme-error', theme.colors.error)

            // Set timer-specific CSS variables for each phase
            root.style.setProperty('--timer-focus-color', theme.colors.primary)
            root.style.setProperty('--timer-short-break-color', theme.colors.secondary)
            root.style.setProperty('--timer-long-break-color', theme.colors.accent)

            // Set timer card background and border colors
            root.style.setProperty('--timer-card-background', theme.colors.surface)
            root.style.setProperty('--timer-card-border', theme.colors.border)
            root.style.setProperty('--timer-label-color', theme.colors.textSecondary)

            // Apply background animation class to body
            document.body.className = document.body.className.replace(/bg-animation-\w+/g, '')
            document.body.classList.add(`bg-animation-${theme.animations.background}`)

            // Save to localStorage
            localStorage.setItem(THEME_STORAGE_KEY, currentTheme)
        } catch (error) {
            console.error('Error applying theme:', error)
            // Fallback to default theme if current theme is invalid
            if (currentTheme !== 'study-zen') {
                setCurrentTheme('study-zen')
                setThemeConfig(getTheme('study-zen'))
            }
        }
    }, [currentTheme, isLoading])

    const changeTheme = useCallback((theme: Theme) => {
        setCurrentTheme(theme)
    }, [])

    const getAllAvailableThemes = useCallback(() => {
        return getAllThemes()
    }, [])

    return {
        currentTheme,
        themeConfig,
        changeTheme,
        getAllThemes: getAllAvailableThemes,
        isLoading
    }
}
