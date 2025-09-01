import { useState } from 'react'
import type { PomodoroSettings } from '../hooks/usePomodoro'
import { t } from '../lib/i18n'
import { useLanguage } from '../hooks/useLanguage'

export default function SettingsDrawer({ settings, setSettings }: { settings: PomodoroSettings, setSettings: (s: PomodoroSettings) => void }) {
    useLanguage() // Make component reactive to language changes
    const [open, setOpen] = useState(false)
    const update = (k: keyof PomodoroSettings, v: number | boolean) => setSettings({ ...settings, [k]: v as any })
    return (
        <div className="max-w-md mx-auto">
            <button onClick={() => setOpen(o => !o)} className="text-white/70 underline">{open ? t('close') : t('settings')}</button>
            {open && (
                <div className="mt-3 p-4 rounded-2xl bg-white/5 border border-white/10 grid grid-cols-2 gap-3">
                    <label className="flex items-center justify-between">{t('focusMinutes')}
                        <input type="number" min={1} className="ml-2 bg-transparent border rounded px-2 py-1 w-20" value={settings.focusMinutes} onChange={e => update('focusMinutes', Number(e.target.value))} />
                    </label>
                    <label className="flex items-center justify-between">{t('shortBreakMinutes')}
                        <input type="number" min={1} className="ml-2 bg-transparent border rounded px-2 py-1 w-20" value={settings.shortBreakMinutes} onChange={e => update('shortBreakMinutes', Number(e.target.value))} />
                    </label>
                    <label className="flex items-center justify-between">{t('longBreakMinutes')}
                        <input type="number" min={1} className="ml-2 bg-transparent border rounded px-2 py-1 w-20" value={settings.longBreakMinutes} onChange={e => update('longBreakMinutes', Number(e.target.value))} />
                    </label>
                    <label className="flex items-center justify-between">{t('sessionsUntilLongBreak')}
                        <input type="number" min={2} className="ml-2 bg-transparent border rounded px-2 py-1 w-20" value={settings.sessionsUntilLongBreak} onChange={e => update('sessionsUntilLongBreak', Number(e.target.value))} />
                    </label>
                    <label className="col-span-2 flex items-center gap-2">
                        <input type="checkbox" checked={settings.autoStartNext} onChange={e => update('autoStartNext', e.target.checked)} /> {t('autoStartNext')}
                    </label>
                    <label className="col-span-2 flex items-center gap-2">
                        <input type="checkbox" checked={settings.sound} onChange={e => update('sound', e.target.checked)} /> {t('sound')}
                    </label>
                    <label className="col-span-2 flex items-center gap-2">
                        <input type="checkbox" checked={settings.notifications} onChange={e => update('notifications', e.target.checked)} /> {t('notifications')}
                    </label>
                </div>
            )}
        </div>
    )
}
