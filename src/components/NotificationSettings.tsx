import { useState, useEffect } from 'react'
import { Bell, Volume2, VolumeX, Smartphone, Monitor, ChevronDown, ChevronUp } from 'lucide-react'
import {
    NotificationSettings as NotificationSettingsType,
    getNotificationSettings,
    saveNotificationSettings,
    playNotificationSound,
    ensurePermission
} from '../lib/notifications'
import { t } from '../lib/i18n'
import { useLanguage } from '../hooks/useLanguage'

export default function NotificationSettings() {
    useLanguage()
    const [settings, setSettings] = useState<NotificationSettingsType>(getNotificationSettings())
    const [permissionGranted, setPermissionGranted] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)

    useEffect(() => {
        checkPermission()
    }, [])

    const checkPermission = async () => {
        const granted = await ensurePermission()
        setPermissionGranted(granted)
    }

    const updateSettings = (newSettings: Partial<NotificationSettingsType>) => {
        const updated = { ...settings, ...newSettings }
        setSettings(updated)
        saveNotificationSettings(updated)
    }

    const testSound = () => {
        playNotificationSound(settings.sound)
    }

    const requestPermission = async () => {
        const granted = await ensurePermission()
        setPermissionGranted(granted)
        if (granted) {
            updateSettings({ showBrowserNotifications: true })
        }
    }

    const soundOptions = [
        { value: 'beep' as const, label: t('beep'), description: t('beepDescription') },
        { value: 'chime' as const, label: t('chime'), description: t('chimeDescription') },
        { value: 'bell' as const, label: t('bell'), description: t('bellDescription') },
        { value: 'ding' as const, label: t('ding'), description: t('dingDescription') },
        { value: 'none' as const, label: t('none'), description: t('noneDescription') }
    ]

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            {/* Header with Toggle */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors rounded-2xl"
            >
                <div className="flex items-center gap-2">
                    <Bell className="size-5 text-white/70" />
                    <h3 className="text-lg font-medium">{t('notificationSettings')}</h3>
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
                    {/* Enable Notifications */}
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-medium">{t('enableNotifications')}</div>
                            <div className="text-sm text-white/60">{t('enableNotificationsDesc')}</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.enabled}
                                onChange={(e) => updateSettings({ enabled: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky/50"></div>
                        </label>
                    </div>

                    {/* Browser Notifications */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Monitor className="size-4 text-white/60" />
                            <div>
                                <div className="font-medium">{t('browserNotifications')}</div>
                                <div className="text-sm text-white/60">{t('browserNotificationsDesc')}</div>
                            </div>
                        </div>
                        {!permissionGranted ? (
                            <button
                                onClick={requestPermission}
                                className="px-3 py-1.5 bg-sky/30 hover:bg-sky/40 text-sky rounded-lg text-sm transition-colors"
                            >
                                {t('enable')}
                            </button>
                        ) : (
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.showBrowserNotifications}
                                    onChange={(e) => updateSettings({ showBrowserNotifications: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky/50"></div>
                            </label>
                        )}
                    </div>

                    {/* Sound Settings */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {settings.sound === 'none' ? (
                                    <VolumeX className="size-4 text-white/60" />
                                ) : (
                                    <Volume2 className="size-4 text-white/60" />
                                )}
                                <div>
                                    <div className="font-medium">{t('notificationSound')}</div>
                                    <div className="text-sm text-white/60">{t('notificationSoundDesc')}</div>
                                </div>
                            </div>
                            {settings.sound !== 'none' && (
                                <button
                                    onClick={testSound}
                                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors"
                                >
                                    {t('test')}
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                            {soundOptions.map((option) => (
                                <label key={option.value} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="sound"
                                        value={option.value}
                                        checked={settings.sound === option.value}
                                        onChange={(e) => updateSettings({ sound: e.target.value as any })}
                                        className="text-sky focus:ring-sky/50"
                                    />
                                    <div className="flex-1">
                                        <div className="font-medium text-sm">{option.label}</div>
                                        <div className="text-xs text-white/60">{option.description}</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Volume Control */}
                    {settings.sound !== 'none' && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">{t('volume')}</span>
                                <span className="text-sm text-white/60">{Math.round(settings.volume * 100)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={settings.volume}
                                onChange={(e) => updateSettings({ volume: parseFloat(e.target.value) })}
                                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>
                    )}

                    {/* Vibration */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Smartphone className="size-4 text-white/60" />
                            <div>
                                <div className="font-medium">{t('vibration')}</div>
                                <div className="text-sm text-white/60">{t('vibrationDesc')}</div>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.vibrate}
                                onChange={(e) => updateSettings({ vibrate: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky/50"></div>
                        </label>
                    </div>
                </div>
            )}
        </div>
    )
}
