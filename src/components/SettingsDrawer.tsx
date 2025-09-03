import { useState } from 'react'
import { Settings, ChevronDown, ChevronUp, Clock, Play, Volume2, Bell } from 'lucide-react'
import type { PomodoroSettings } from '../hooks/usePomodoro'
import { t } from '../lib/i18n'
import { useLanguage } from '../hooks/useLanguage'

export default function SettingsDrawer({ settings, setSettings }: { settings: PomodoroSettings, setSettings: (s: PomodoroSettings) => void }) {
    useLanguage() // Make component reactive to language changes
    const [isExpanded, setIsExpanded] = useState(false)
    const update = (k: keyof PomodoroSettings, v: number | boolean) => {
        const newSettings = { ...settings, [k]: v as any }
        console.log('SettingsDrawer: Updating setting', { key: k, value: v, currentSettings: settings, newSettings })
        setSettings(newSettings)

        // Dispatch custom event to notify other components
        // Use setTimeout to ensure the state update completes first (important for mobile)
        setTimeout(() => {
            const event = new CustomEvent('pomodoro:settings-change', { detail: newSettings })
            console.log('SettingsDrawer: Dispatching settings change event:', event)
            
            // Dispatch on both window and document for better mobile compatibility
            window.dispatchEvent(event)
            document.dispatchEvent(event)
        }, 0)
    }

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            {/* Header with Toggle */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors rounded-2xl"
            >
                <div className="flex items-center gap-2">
                    <Settings className="size-5 text-white/70" />
                    <h3 className="text-lg font-medium">{t('pomodoroSettings')}</h3>
                </div>
                {isExpanded ? (
                    <ChevronUp className="size-5 text-white/70" />
                ) : (
                    <ChevronDown className="size-5 text-white/70" />
                )}
            </button>

            {/* Collapsible Content */}
            {isExpanded && (
                <div className="px-4 pb-4 space-y-4">
                    {/* Timer Duration Settings */}
                    <div className="space-y-3">
                        <div className="text-sm text-white/60 mb-3">
                            {t('timerDurations')}
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="size-4 text-white/60" />
                                    <div>
                                        <div className="font-medium">{t('focusMinutes')}</div>
                                        <div className="text-sm text-white/60">{t('focusMinutesDesc')}</div>
                                    </div>
                                </div>
                                <input
                                    type="number"
                                    min={1}
                                    max={60}
                                    className="w-16 bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-center text-white"
                                    value={settings.focusMinutes}
                                    onChange={e => update('focusMinutes', Number(e.target.value))}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="size-4 text-white/60" />
                                    <div>
                                        <div className="font-medium">{t('shortBreakMinutes')}</div>
                                        <div className="text-sm text-white/60">{t('shortBreakMinutesDesc')}</div>
                                    </div>
                                </div>
                                <input
                                    type="number"
                                    min={1}
                                    max={30}
                                    className="w-16 bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-center text-white"
                                    value={settings.shortBreakMinutes}
                                    onChange={e => update('shortBreakMinutes', Number(e.target.value))}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="size-4 text-white/60" />
                                    <div>
                                        <div className="font-medium">{t('longBreakMinutes')}</div>
                                        <div className="text-sm text-white/60">{t('longBreakMinutesDesc')}</div>
                                    </div>
                                </div>
                                <input
                                    type="number"
                                    min={1}
                                    max={60}
                                    className="w-16 bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-center text-white"
                                    value={settings.longBreakMinutes}
                                    onChange={e => update('longBreakMinutes', Number(e.target.value))}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="size-4 text-white/60" />
                                    <div>
                                        <div className="font-medium">{t('sessionsUntilLongBreak')}</div>
                                        <div className="text-sm text-white/60">{t('sessionsUntilLongBreakDesc')}</div>
                                    </div>
                                </div>
                                <input
                                    type="number"
                                    min={2}
                                    max={10}
                                    className="w-16 bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-center text-white"
                                    value={settings.sessionsUntilLongBreak}
                                    onChange={e => update('sessionsUntilLongBreak', Number(e.target.value))}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Toggle Settings */}
                    <div className="space-y-3">
                        <div className="text-sm text-white/60 mb-3">
                            {t('behaviorSettings')}
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Play className="size-4 text-white/60" />
                                <div>
                                    <div className="font-medium">{t('autoStartNext')}</div>
                                    <div className="text-sm text-white/60">{t('autoStartNextDesc')}</div>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.autoStartNext}
                                    onChange={(e) => update('autoStartNext', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky/50"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Volume2 className="size-4 text-white/60" />
                                <div>
                                    <div className="font-medium">{t('sound')}</div>
                                    <div className="text-sm text-white/60">{t('soundDesc')}</div>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.sound}
                                    onChange={(e) => update('sound', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky/50"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Bell className="size-4 text-white/60" />
                                <div>
                                    <div className="font-medium">{t('notifications')}</div>
                                    <div className="text-sm text-white/60">{t('notificationsDesc')}</div>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.notifications}
                                    onChange={(e) => update('notifications', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky/50"></div>
                            </label>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
