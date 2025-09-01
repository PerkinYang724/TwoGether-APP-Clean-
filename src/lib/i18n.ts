export type Language = 'en' | 'zh'

export interface Translations {
    appName: string
    tagline: string
    focus: string
    shortBreak: string
    longBreak: string
    start: string
    pause: string
    reset: string
    settings: string
    close: string
    focusMinutes: string
    shortBreakMinutes: string
    longBreakMinutes: string
    sessionsUntilLongBreak: string
    autoStartNext: string
    sound: string
    notifications: string
    focusSessionsToday: string
    totalFocusSessions: string
    signIn: string
    signOut: string
    signUp: string
    email: string
    password: string
    displayName: string
    continueWithGoogle: string
    alreadyHaveAccount: string
    dontHaveAccount: string
    madeWithLove: string
    offlineReady: string
    synced: string
    offline: string
    localOnly: string
    syncedWithCloud: string
    syncing: string
    offlineMode: string
    timeToFocus: string
    timeToRest: string
    letsGetBackToWork: string
    takeABreak: string
    installApp: string
}

const translations: Record<Language, Translations> = {
    en: {
        appName: 'Flow Focus',
        tagline: 'Minimal Pomodoro PWA for deep work',
        focus: 'Focus',
        shortBreak: 'Short Break',
        longBreak: 'Long Break',
        start: 'Start',
        pause: 'Pause',
        reset: 'Reset',
        settings: 'Settings',
        close: 'Close',
        focusMinutes: 'Focus (min)',
        shortBreakMinutes: 'Short Break',
        longBreakMinutes: 'Long Break',
        sessionsUntilLongBreak: 'Sessions/Long',
        autoStartNext: 'Auto start next phase',
        sound: 'Sound',
        notifications: 'Notifications',
        focusSessionsToday: 'Focus Sessions Today',
        totalFocusSessions: 'Total Focus Sessions',
        signIn: 'Sign in',
        signOut: 'Sign out',
        signUp: 'Sign Up',
        email: 'Email',
        password: 'Password',
        displayName: 'Display Name',
        continueWithGoogle: 'Continue with Google',
        alreadyHaveAccount: 'Already have an account? Sign in',
        dontHaveAccount: "Don't have an account? Sign up",
        madeWithLove: 'Made with ♥',
        offlineReady: 'offline ready',
        synced: 'synced',
        offline: 'offline',
        localOnly: 'Local only',
        syncedWithCloud: 'Synced with cloud',
        syncing: 'Syncing...',
        offlineMode: 'Offline mode',
        timeToFocus: 'Time to focus',
        timeToRest: 'Time to rest',
        letsGetBackToWork: "Let's get back to work.",
        takeABreak: 'Take a break — you earned it.',
        installApp: 'Install App'
    },
    zh: {
        appName: '專注流',
        tagline: '簡約番茄工作法 PWA 應用',
        focus: '專注',
        shortBreak: '短休息',
        longBreak: '長休息',
        start: '開始',
        pause: '暫停',
        reset: '重置',
        settings: '設定',
        close: '關閉',
        focusMinutes: '專注時間（分鐘）',
        shortBreakMinutes: '短休息',
        longBreakMinutes: '長休息',
        sessionsUntilLongBreak: '長休息間隔',
        autoStartNext: '自動開始下一階段',
        sound: '聲音',
        notifications: '通知',
        focusSessionsToday: '今日專注次數',
        totalFocusSessions: '總專注次數',
        signIn: '登入',
        signOut: '登出',
        signUp: '註冊',
        email: '電子郵件',
        password: '密碼',
        displayName: '顯示名稱',
        continueWithGoogle: '使用 Google 繼續',
        alreadyHaveAccount: '已有帳戶？登入',
        dontHaveAccount: '沒有帳戶？註冊',
        madeWithLove: '用 ♥ 製作',
        offlineReady: '離線可用',
        synced: '已同步',
        offline: '離線',
        localOnly: '僅本地',
        syncedWithCloud: '已與雲端同步',
        syncing: '同步中...',
        offlineMode: '離線模式',
        timeToFocus: '該專注了',
        timeToRest: '該休息了',
        letsGetBackToWork: '讓我們重新開始工作。',
        takeABreak: '休息一下——你值得擁有。',
        installApp: '安裝應用'
    }
}

let currentLanguage: Language = (localStorage.getItem('language') as Language) || 'en'

export function getCurrentLanguage(): Language {
    return currentLanguage
}

export function setLanguage(language: Language) {
    currentLanguage = language
    localStorage.setItem('language', language)
    window.dispatchEvent(new CustomEvent('language-change', { detail: { language } }))
}

export function t(key: keyof Translations): string {
    return translations[currentLanguage][key]
}

export function getTranslations(): Translations {
    return translations[currentLanguage]
}
