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
    tasks: string
    active: string
    completed: string
    addTaskPlaceholder: string
    activeTasks: string
    completedTasks: string
    clearCompleted: string
    noTasksYet: string
    addFirstTask: string
    dailyGoal: string
    pomodoros: string
    goalReached: string
    oneMorePomodoro: string
    remainingPomodoros: string
    setDailyGoal: string
    goalRange: string
    resetToday: string
    goalCompleted: string
    remaining: string
    sessionStats: string
    today: string
    thisWeek: string
    allTime: string
    sessionsCompleted: string
    focusTime: string
    avgSession: string
    longestSession: string
    completionRate: string
    totalSessions: string
    totalFocusTime: string
    avgDailySessions: string
    streak: string
    avgDailyFocusTime: string
    completedSessions: string
    noStatsYet: string
    completeFirstSession: string
    notificationSettings: string
    enableNotifications: string
    enableNotificationsDesc: string
    browserNotifications: string
    browserNotificationsDesc: string
    enable: string
    notificationSound: string
    notificationSoundDesc: string
    test: string
    volume: string
    vibration: string
    vibrationDesc: string
    beep: string
    beepDescription: string
    chime: string
    chimeDescription: string
    bell: string
    bellDescription: string
    ding: string
    dingDescription: string
    none: string
    noneDescription: string
    themeSettings: string
    chooseTheme: string
    currentTheme: string
    // Theme names
    studyZen: string
    forestFocus: string
    nightOwl: string
    oceanBreeze: string
    goldenHour: string
    // Theme descriptions
    studyZenDesc: string
    forestFocusDesc: string
    nightOwlDesc: string
    oceanBreezeDesc: string
    goldenHourDesc: string
    // Theme moods
    studyZenMood: string
    forestFocusMood: string
    nightOwlMood: string
    oceanBreezeMood: string
    goldenHourMood: string
    // New navigation translations
    customizeYourExperience: string
    pomodoroSettings: string
    statsAndGoals: string
    trackYourProgress: string
    manageYourTasks: string
    theme: string
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
        installApp: 'Install App',
        tasks: 'Tasks',
        active: 'active',
        completed: 'completed',
        addTaskPlaceholder: 'What will you work on?',
        activeTasks: 'Active Tasks',
        completedTasks: 'Completed Tasks',
        clearCompleted: 'Clear completed',
        noTasksYet: 'No tasks yet',
        addFirstTask: 'Add your first task to get started',
        dailyGoal: 'Daily Goal',
        pomodoros: 'Pomodoros',
        goalReached: 'Goal reached! 🎉',
        oneMorePomodoro: 'One more Pomodoro to go!',
        remainingPomodoros: '{count} Pomodoros remaining',
        setDailyGoal: 'Set Daily Goal',
        goalRange: '1-20 Pomodoros per day',
        resetToday: 'Reset Today',
        goalCompleted: 'Goal completed!',
        remaining: 'remaining',
        sessionStats: 'Session Stats',
        today: 'Today',
        thisWeek: 'This Week',
        allTime: 'All Time',
        sessionsCompleted: 'Sessions',
        focusTime: 'Focus Time',
        avgSession: 'Avg Session',
        longestSession: 'Longest',
        completionRate: 'Completion Rate',
        totalSessions: 'Total Sessions',
        totalFocusTime: 'Total Focus Time',
        avgDailySessions: 'Daily Avg',
        streak: 'Streak',
        avgDailyFocusTime: 'Daily Focus',
        completedSessions: 'Completed',
        noStatsYet: 'No stats yet',
        completeFirstSession: 'Complete your first session to see stats',
        notificationSettings: 'Notification Settings',
        enableNotifications: 'Enable Notifications',
        enableNotificationsDesc: 'Get alerts when sessions complete',
        browserNotifications: 'Browser Notifications',
        browserNotificationsDesc: 'Show desktop notifications',
        enable: 'Enable',
        notificationSound: 'Notification Sound',
        notificationSoundDesc: 'Choose your preferred alert sound',
        test: 'Test',
        volume: 'Volume',
        vibration: 'Vibration',
        vibrationDesc: 'Vibrate on mobile devices',
        beep: 'Beep',
        beepDescription: 'Simple beep sound',
        chime: 'Chime',
        chimeDescription: 'Gentle musical chime',
        bell: 'Bell',
        bellDescription: 'Classic bell sound',
        ding: 'Ding',
        dingDescription: 'Short ding sound',
        none: 'None',
        noneDescription: 'No sound',
        themeSettings: 'Theme Settings',
        chooseTheme: 'Choose your preferred theme',
        currentTheme: 'Current Theme',
        // Theme names
        studyZen: 'Study Zen',
        forestFocus: 'Forest Focus',
        nightOwl: 'Night Owl',
        oceanBreeze: 'Ocean Breeze',
        goldenHour: 'Golden Hour',
        // Theme descriptions
        studyZenDesc: 'Minimal white space with soft blue accents for ultimate focus',
        forestFocusDesc: 'Calming greens inspired by nature to reduce study stress',
        nightOwlDesc: 'Dark theme perfect for late-night coding and study sessions',
        oceanBreezeDesc: 'Serene blue tones that calm the mind during intense study',
        goldenHourDesc: 'Warm, energizing colors to boost motivation and creativity',
        // Theme moods
        studyZenMood: 'Calm and focused - perfect for deep concentration',
        forestFocusMood: 'Peaceful and refreshing - like studying in a quiet forest',
        nightOwlMood: 'Intense and productive - ideal for night owls and deep work',
        oceanBreezeMood: 'Tranquil and refreshing - like studying by the ocean',
        goldenHourMood: 'Energetic and inspiring - perfect for creative study sessions',
        // New navigation translations
        customizeYourExperience: 'Customize your experience',
        pomodoroSettings: 'Pomodoro Settings',
        statsAndGoals: 'Stats & Goals',
        trackYourProgress: 'Track your progress',
        manageYourTasks: 'Manage your tasks',
        theme: 'Theme'
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
        installApp: '安裝應用',
        tasks: '任務',
        active: '進行中',
        completed: '已完成',
        addTaskPlaceholder: '你要做什麼？',
        activeTasks: '進行中的任務',
        completedTasks: '已完成的任務',
        clearCompleted: '清除已完成',
        noTasksYet: '還沒有任務',
        addFirstTask: '添加第一個任務開始工作',
        dailyGoal: '每日目標',
        pomodoros: '番茄鐘',
        goalReached: '目標達成！🎉',
        oneMorePomodoro: '還差一個番茄鐘！',
        remainingPomodoros: '還剩 {count} 個番茄鐘',
        setDailyGoal: '設定每日目標',
        goalRange: '每天 1-20 個番茄鐘',
        resetToday: '重置今日',
        goalCompleted: '目標完成！',
        remaining: '剩餘',
        sessionStats: '會話統計',
        today: '今日',
        thisWeek: '本週',
        allTime: '全部',
        sessionsCompleted: '會話數',
        focusTime: '專注時間',
        avgSession: '平均會話',
        longestSession: '最長會話',
        completionRate: '完成率',
        totalSessions: '總會話數',
        totalFocusTime: '總專注時間',
        avgDailySessions: '日均會話',
        streak: '連續天數',
        avgDailyFocusTime: '日均專注',
        completedSessions: '已完成',
        noStatsYet: '暫無統計',
        completeFirstSession: '完成第一個會話查看統計',
        notificationSettings: '通知設定',
        enableNotifications: '啟用通知',
        enableNotificationsDesc: '會話完成時收到提醒',
        browserNotifications: '瀏覽器通知',
        browserNotificationsDesc: '顯示桌面通知',
        enable: '啟用',
        notificationSound: '通知聲音',
        notificationSoundDesc: '選擇您喜歡的提醒聲音',
        test: '測試',
        volume: '音量',
        vibration: '震動',
        vibrationDesc: '在行動裝置上震動',
        beep: '嗶聲',
        beepDescription: '簡單的嗶聲',
        chime: '鈴聲',
        chimeDescription: '溫和的音樂鈴聲',
        bell: '鐘聲',
        bellDescription: '經典鐘聲',
        ding: '叮聲',
        dingDescription: '短促的叮聲',
        none: '無',
        noneDescription: '無聲音',
        themeSettings: '主題設定',
        chooseTheme: '選擇您喜歡的主題',
        currentTheme: '目前主題',
        // Theme names
        studyZen: '學習禪',
        forestFocus: '森林專注',
        nightOwl: '夜貓子',
        oceanBreeze: '海洋微風',
        goldenHour: '黃金時光',
        // Theme descriptions
        studyZenDesc: '極簡白色空間配柔和藍色點綴，專注力極致',
        forestFocusDesc: '受自然啟發的舒緩綠色，減少學習壓力',
        nightOwlDesc: '深色主題，完美適合深夜編程和學習',
        oceanBreezeDesc: '寧靜藍色調，在緊張學習中平靜心靈',
        goldenHourDesc: '溫暖激勵色彩，提升動力和創造力',
        // Theme moods
        studyZenMood: '平靜專注 - 深度專注的完美選擇',
        forestFocusMood: '寧靜清新 - 如置身安靜森林中學習',
        nightOwlMood: '強烈高效 - 夜貓子和深度工作的理想選擇',
        oceanBreezeMood: '寧靜清新 - 如在海邊學習般舒適',
        goldenHourMood: '充滿活力 - 創意學習時光的完美選擇',
        // New navigation translations
        customizeYourExperience: '自訂您的體驗',
        pomodoroSettings: '番茄工作法設定',
        statsAndGoals: '統計與目標',
        trackYourProgress: '追蹤您的進度',
        manageYourTasks: '管理您的任務',
        theme: '主題'
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

export function getTranslatedTheme(themeKey: string) {
    const themeTranslations = {
        'study-zen': {
            name: t('studyZen'),
            description: t('studyZenDesc'),
            mood: t('studyZenMood')
        },
        'forest-focus': {
            name: t('forestFocus'),
            description: t('forestFocusDesc'),
            mood: t('forestFocusMood')
        },
        'night-owl': {
            name: t('nightOwl'),
            description: t('nightOwlDesc'),
            mood: t('nightOwlMood')
        },
        'ocean-breeze': {
            name: t('oceanBreeze'),
            description: t('oceanBreezeDesc'),
            mood: t('oceanBreezeMood')
        },
        'golden-hour': {
            name: t('goldenHour'),
            description: t('goldenHourDesc'),
            mood: t('goldenHourMood')
        }
    }

    return themeTranslations[themeKey as keyof typeof themeTranslations] || {
        name: themeKey,
        description: '',
        mood: ''
    }
}
