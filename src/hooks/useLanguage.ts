import { useState, useEffect } from 'react'
import { getCurrentLanguage, type Language } from '../lib/i18n'

export function useLanguage() {
    const [language, setLanguage] = useState<Language>(getCurrentLanguage())

    useEffect(() => {
        const handleLanguageChange = (e: any) => {
            setLanguage(e.detail.language)
        }

        window.addEventListener('language-change', handleLanguageChange)
        return () => window.removeEventListener('language-change', handleLanguageChange)
    }, [])

    return language
}
