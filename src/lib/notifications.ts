export async function ensurePermission() {
    if (!('Notification' in window)) return false
    if (Notification.permission === 'granted') return true
    if (Notification.permission === 'denied') return false
    const res = await Notification.requestPermission()
    return res === 'granted'
}

export function notify(title: string, body?: string) {
    if (!('Notification' in window)) return
    if (Notification.permission !== 'granted') return
    const n = new Notification(title, { body })
    n.onclick = () => window.focus()
}

export function beep() {
    const ctx = new AudioContext()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.connect(g); g.connect(ctx.destination)
    o.type = 'sine'; o.frequency.value = 880
    g.gain.setValueAtTime(0.001, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
    o.start(); o.stop(ctx.currentTime + 0.32)
}
