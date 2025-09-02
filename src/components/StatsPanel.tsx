import { useEffect, useState } from 'react'

function startOfDay(d = new Date()) { const x = new Date(d); x.setHours(0, 0, 0, 0); return x }

export default function StatsPanel() {
    const [today, setToday] = useState(0)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        const raw = localStorage.getItem('stats')
        if (raw) { const s = JSON.parse(raw); setToday(s.today || 0); setTotal(s.total || 0) }
        const handler = (_e: any) => {
            const now = new Date()
            const key = startOfDay(now).toISOString()
            const raw = localStorage.getItem('stats')
            const s = raw ? JSON.parse(raw) : { today: 0, total: 0, key }
            if (s.key !== key) { s.key = key; s.today = 0 }
            s.today += 1; s.total += 1
            localStorage.setItem('stats', JSON.stringify(s))
            setToday(s.today); setTotal(s.total)
        }
        window.addEventListener('pomodoro:phase-change', handler as any)
        return () => window.removeEventListener('pomodoro:phase-change', handler as any)
    }, [])

    return (
        <div className="max-w-md mx-auto mt-6 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-white/70 text-sm">Focus Sessions Today</div>
                    <div className="text-3xl font-semibold">{today}</div>
                </div>
                <div>
                    <div className="text-white/70 text-sm">Total Focus Sessions</div>
                    <div className="text-3xl font-semibold">{total}</div>
                </div>
            </div>
        </div>
    )
}
