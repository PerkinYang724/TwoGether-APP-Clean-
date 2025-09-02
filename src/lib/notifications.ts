export type NotificationSound = 'beep' | 'chime' | 'bell' | 'ding' | 'none'
export type NotificationTheme = 'classic' | 'nature' | 'electronic' | 'zen' | 'retro'

export interface NotificationSettings {
    enabled: boolean
    sound: NotificationSound
    theme: NotificationTheme
    volume: number
    showBrowserNotifications: boolean
    vibrate: boolean
}

const defaultSettings: NotificationSettings = {
    enabled: true,
    sound: 'beep',
    theme: 'classic',
    volume: 0.7,
    showBrowserNotifications: true,
    vibrate: true
}

export async function ensurePermission(): Promise<boolean> {
    if (!('Notification' in window)) return false
    if (Notification.permission === 'granted') return true
    if (Notification.permission === 'denied') return false
    const res = await Notification.requestPermission()
    return res === 'granted'
}

export function getNotificationSettings(): NotificationSettings {
    const saved = localStorage.getItem('notification-settings')
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings
}

export function saveNotificationSettings(settings: NotificationSettings): void {
    localStorage.setItem('notification-settings', JSON.stringify(settings))
}

export function notify(title: string, body?: string, options?: {
    icon?: string
    tag?: string
    requireInteraction?: boolean
}) {
    const settings = getNotificationSettings()
    if (!settings.enabled || !settings.showBrowserNotifications) return

    if (!('Notification' in window)) return
    if (Notification.permission !== 'granted') return

    const notification = new Notification(title, {
        body,
        icon: options?.icon || '/icons/icon-192x192.png',
        tag: options?.tag || 'pomodoro-notification',
        requireInteraction: options?.requireInteraction || false,
        silent: !settings.vibrate
    })

    notification.onclick = () => {
        window.focus()
        notification.close()
    }

    // Auto-close after 5 seconds
    setTimeout(() => notification.close(), 5000)
}

export function playNotificationSound(soundType: NotificationSound = 'beep'): void {
    console.log('🔊 playNotificationSound called with:', soundType)
    const settings = getNotificationSettings()
    console.log('🔊 Settings enabled:', settings.enabled, 'Sound type:', soundType)

    if (!settings.enabled || soundType === 'none') {
        console.log('🔊 Sound disabled or none, skipping')
        return
    }

    try {
        console.log('🔊 Creating AudioContext')
        const ctx = new AudioContext()
        const gainNode = ctx.createGain()
        gainNode.connect(ctx.destination)
        gainNode.gain.value = settings.volume
        console.log('🔊 Volume set to:', settings.volume)

        switch (soundType) {
            case 'beep':
                console.log('🔊 Playing beep')
                playBeep(ctx, gainNode)
                break
            case 'chime':
                console.log('🔊 Playing chime')
                playChime(ctx, gainNode)
                break
            case 'bell':
                console.log('🔊 Playing bell')
                playBell(ctx, gainNode)
                break
            case 'ding':
                console.log('🔊 Playing ding')
                playDing(ctx, gainNode)
                break
        }
        console.log('🔊 Sound should be playing now')
    } catch (error) {
        console.warn('🔊 Could not play notification sound:', error)
    }
}

function playBeep(ctx: AudioContext, gainNode: GainNode): void {
    const oscillator = ctx.createOscillator()
    oscillator.connect(gainNode)
    oscillator.type = 'sine'
    oscillator.frequency.value = 880

    gainNode.gain.setValueAtTime(0.001, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)

    oscillator.start()
    oscillator.stop(ctx.currentTime + 0.32)
}

function playChime(ctx: AudioContext, gainNode: GainNode): void {
    const frequencies = [523.25, 659.25, 783.99] // C5, E5, G5
    const duration = 0.5

    frequencies.forEach((freq, index) => {
        const oscillator = ctx.createOscillator()
        oscillator.connect(gainNode)
        oscillator.type = 'sine'
        oscillator.frequency.value = freq

        const startTime = ctx.currentTime + (index * 0.1)
        gainNode.gain.setValueAtTime(0.001, startTime)
        gainNode.gain.exponentialRampToValueAtTime(0.15, startTime + 0.01)
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration)

        oscillator.start(startTime)
        oscillator.stop(startTime + duration)
    })
}

function playBell(ctx: AudioContext, gainNode: GainNode): void {
    const oscillator = ctx.createOscillator()
    oscillator.connect(gainNode)
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(800, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.5)

    gainNode.gain.setValueAtTime(0.001, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)

    oscillator.start()
    oscillator.stop(ctx.currentTime + 0.5)
}

function playDing(ctx: AudioContext, gainNode: GainNode): void {
    const oscillator = ctx.createOscillator()
    oscillator.connect(gainNode)
    oscillator.type = 'triangle'
    oscillator.frequency.value = 1000

    gainNode.gain.setValueAtTime(0.001, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.1, ctx.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)

    oscillator.start()
    oscillator.stop(ctx.currentTime + 0.2)
}

export function vibrate(pattern: number | number[] = [200, 100, 200]): void {
    const settings = getNotificationSettings()
    if (!settings.enabled || !settings.vibrate) return

    if ('vibrate' in navigator) {
        navigator.vibrate(pattern)
    }
}

// Legacy function for backward compatibility
export function beep(): void {
    playNotificationSound('beep')
}

export function notifySessionComplete(phase: 'focus' | 'short_break' | 'long_break'): void {
    console.log('🔔 notifySessionComplete called for phase:', phase)
    const settings = getNotificationSettings()
    console.log('🔔 Notification settings:', settings)

    if (!settings.enabled) {
        console.log('🔔 Notifications disabled, skipping')
        return
    }

    const isBreak = phase !== 'focus'
    const title = isBreak ? 'Break Time!' : 'Focus Session Complete!'
    const body = isBreak
        ? 'Time to take a well-deserved break. Relax and recharge!'
        : 'Great job! Your focus session is complete. Time for a break.'

    console.log('🔔 Playing notification sound:', settings.sound)
    // Play sound
    playNotificationSound(settings.sound)

    // Show browser notification
    if (settings.showBrowserNotifications) {
        console.log('🔔 Showing browser notification')
        notify(title, body, {
            requireInteraction: true,
            tag: `session-${phase}`
        })
    } else {
        console.log('🔔 Browser notifications disabled')
    }

    // Vibrate on mobile
    console.log('🔔 Triggering vibration')
    vibrate([300, 100, 300])
}
