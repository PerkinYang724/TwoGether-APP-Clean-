import SettingsDrawer from '../SettingsDrawer'
import ThemeSelector from '../ThemeSelector'
import NotificationSettings from '../NotificationSettings'
import { usePomodoroWithSync } from '../../hooks/usePomodoroWithSync'
import { signOut } from '../../lib/auth'
import { t } from '../../lib/i18n'

interface SettingsPageProps {
    className?: string
}

export default function SettingsPage({ className = '' }: SettingsPageProps) {
    const { settings, setSettings, user } = usePomodoroWithSync()

    const handleSignOut = async () => {
        try {
            await signOut()
        } catch (error) {
            console.error('Sign out error:', error)
        }
    }

    return (
        <div className={`px-6 py-10 pb-20 ${className}`}>
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-semibold">{t('settings')}</h1>
                        <p className="text-white/70 text-sm">{t('customizeYourExperience')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {user ? (
                            <div className="flex items-center gap-2">
                                <div className="text-sm text-white/70">
                                    {user.display_name || user.email}
                                </div>
                                <button
                                    onClick={handleSignOut}
                                    className="text-xs text-white/50 hover:text-white/70 underline"
                                >
                                    {t('signOut')}
                                </button>
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* Settings Content */}
                <div className="space-y-6">
                    {/* Theme Settings */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                        <h2 className="text-lg font-medium mb-4">{t('theme')}</h2>
                        <ThemeSelector />
                    </div>

                    {/* Notification Settings */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                        <h2 className="text-lg font-medium mb-4">{t('notifications')}</h2>
                        <NotificationSettings />
                    </div>

                    {/* Pomodoro Settings */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                        <h2 className="text-lg font-medium mb-4">{t('pomodoroSettings')}</h2>
                        <SettingsDrawer settings={settings} setSettings={setSettings} />
                    </div>
                </div>
            </div>

            {/* Swipe indicators - Mobile only */}
            <div className="md:hidden mt-8 flex items-center justify-center gap-4 text-white/40 text-sm">
                <div className="flex items-center gap-1">
                    <span>← →</span>
                    <span>Navigate</span>
                </div>
            </div>
        </div>
    )
}
