import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, ChevronDown, ChevronUp } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { Theme, themes } from '../lib/themes'
import { useLanguage } from '../hooks/useLanguage'
import { t, getTranslatedTheme } from '../lib/i18n'

export default function ThemeSelector() {
    useLanguage()
    const { currentTheme, themeConfig, changeTheme } = useTheme()
    const [isExpanded, setIsExpanded] = useState(false)

    const handleThemeChange = (themeKey: Theme) => {
        try {
            changeTheme(themeKey)
        } catch (error) {
            console.error('Error changing theme:', error)
        }
    }

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            {/* Header with Toggle */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors rounded-2xl"
            >
                <div className="flex items-center gap-2">
                    <Palette className="size-5 text-white/70" />
                    <h3 className="text-lg font-medium">{t('themeSettings')}</h3>
                </div>
                {isExpanded ? (
                    <ChevronUp className="size-5 text-white/70" />
                ) : (
                    <ChevronDown className="size-5 text-white/70" />
                )}
            </button>

            {/* Collapsible Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 space-y-4">
                            <div className="text-sm text-white/60 mb-3">
                                {t('chooseTheme')}
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                {Object.entries(themes).map(([themeKey, theme], index: number) => {
                                    const isSelected = currentTheme === themeKey
                                    const translatedTheme = getTranslatedTheme(themeKey)

                                    return (
                                        <motion.button
                                            key={theme.name}
                                            onClick={() => handleThemeChange(themeKey as Theme)}
                                            className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${isSelected
                                                ? 'border-white/50 bg-white/10'
                                                : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30'
                                                }`}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="text-2xl">{theme.icon}</div>
                                                <div className="flex-1 text-left">
                                                    <div className="font-medium text-white">
                                                        {translatedTheme.name}
                                                    </div>
                                                    <div className="text-sm text-white/60">
                                                        {translatedTheme.description}
                                                    </div>
                                                    <div className="text-xs text-white/50 mt-1">
                                                        {translatedTheme.mood}
                                                    </div>
                                                </div>
                                                {isSelected && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="w-3 h-3 bg-white rounded-full"
                                                    />
                                                )}
                                            </div>

                                            {/* Theme Color Palette Preview */}
                                            <div className="mt-3 flex gap-2">
                                                <div
                                                    className="w-5 h-5 rounded-full border border-white/20"
                                                    style={{ backgroundColor: theme.colors.primary }}
                                                    title="Primary"
                                                />
                                                <div
                                                    className="w-5 h-5 rounded-full border border-white/20"
                                                    style={{ backgroundColor: theme.colors.secondary }}
                                                    title="Secondary"
                                                />
                                                <div
                                                    className="w-5 h-5 rounded-full border border-white/20"
                                                    style={{ backgroundColor: theme.colors.accent }}
                                                    title="Accent"
                                                />
                                                <div
                                                    className="w-5 h-5 rounded-full border border-white/20"
                                                    style={{ backgroundColor: theme.colors.success }}
                                                    title="Success"
                                                />
                                            </div>
                                        </motion.button>
                                    )
                                })}
                            </div>

                            {/* Current Theme Info */}
                            <div className="mt-4 p-3 bg-white/5 rounded-lg">
                                <div className="text-sm font-medium text-white mb-1">
                                    {t('currentTheme')}: {getTranslatedTheme(currentTheme).name}
                                </div>
                                <div className="text-xs text-white/60">
                                    {getTranslatedTheme(currentTheme).mood}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
