import { useEffect, useState } from 'react'
import { t } from '../lib/i18n'
import { useLanguage } from '../hooks/useLanguage'

export default function InstallPrompt() {
    useLanguage() // Make component reactive to language changes
    const [deferred, setDeferred] = useState<any>(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const onBeforeInstall = (e: any) => {
            e.preventDefault()
            setDeferred(e)
            setVisible(true)
        }
        window.addEventListener('beforeinstallprompt', onBeforeInstall)
        return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall)
    }, [])

    if (!visible) return null
    return (
        <div className="fixed bottom-4 inset-x-0 flex justify-center">
            <button className="px-4 py-2 rounded-2xl bg-white/10 border border-white/10 backdrop-blur" onClick={async () => { await deferred.prompt(); setVisible(false) }}>{t('installApp')}</button>
        </div>
    )
}
