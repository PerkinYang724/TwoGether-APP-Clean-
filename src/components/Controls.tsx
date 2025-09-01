import { t } from '../lib/i18n'
import { useLanguage } from '../hooks/useLanguage'

export default function Controls({ onSetPhase }: { onSetPhase: (p: 'focus' | 'short_break' | 'long_break') => void }) {
    useLanguage() // Make component reactive to language changes
    return (
        <div className="flex items-center justify-center gap-2 my-3">
            <button onClick={() => onSetPhase('focus')} className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20">{t('focus')}</button>
            <button onClick={() => onSetPhase('short_break')} className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20">{t('shortBreak')}</button>
            <button onClick={() => onSetPhase('long_break')} className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20">{t('longBreak')}</button>
        </div>
    )
}
