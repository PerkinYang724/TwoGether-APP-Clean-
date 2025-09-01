import { useState, useEffect } from 'react'
import { getCurrentLanguage, setLanguage, type Language } from '../lib/i18n'

export default function LanguageToggle() {
    const [currentLang, setCurrentLang] = useState<Language>(getCurrentLanguage())

    useEffect(() => {
        const handleLanguageChange = (e: any) => {
            setCurrentLang(e.detail.language)
        }

        window.addEventListener('language-change', handleLanguageChange)
        return () => window.removeEventListener('language-change', handleLanguageChange)
    }, [])

    const toggleLanguage = () => {
        const newLang = currentLang === 'en' ? 'zh' : 'en'
        setLanguage(newLang)
    }

    return (
        <button
            onClick={toggleLanguage}
            className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium transition-colors"
            title={currentLang === 'en' ? 'Switch to 中文' : 'Switch to English'}
        >
            {currentLang === 'en' ? '中文' : 'EN'}
        </button>
    )
}
