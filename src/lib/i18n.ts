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
    cancel: string
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
    // New navigation translations
    customizeYourExperience: string
    pomodoroSettings: string
    statsAndGoals: string
    trackYourProgress: string
    manageYourTasks: string
    // Welcome page translations
    welcomeToFlowFocus: string
    welcomeDescription: string
    startFocusing: string
    feature1: string
    feature2: string
    feature3: string
    swipeToNavigate: string
    // Pomodoro settings descriptions
    timerDurations: string
    behaviorSettings: string
    focusMinutesDesc: string
    shortBreakMinutesDesc: string
    longBreakMinutesDesc: string
    sessionsUntilLongBreakDesc: string
    autoStartNextDesc: string
    soundDesc: string
    notificationsDesc: string
    // Tag feature translations
    enterSubjectTag: string
    subjectTag: string
    subjectTagPlaceholder: string
    sessionHistory: string
    recentSessions: string
    noSessionsYet: string
    startFirstSession: string
    beFirstToShare: string
}

const translations: Record<Language, Translations> = {
    en: {
        appName: 'Flow Focus',
        tagline: 'Minimal Pomodoro for deep work',
        focus: 'Focus',
        shortBreak: 'Short Break',
        longBreak: 'Long Break',
        start: 'Start',
        pause: 'Pause',
        reset: 'Reset',
        settings: 'Settings',
        close: 'Close',
        cancel: 'Cancel',
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
        // New navigation translations
        customizeYourExperience: 'Customize your experience',
        pomodoroSettings: 'Pomodoro Settings',
        statsAndGoals: 'Stats & Goals',
        trackYourProgress: 'Track your progress',
        manageYourTasks: 'Manage your tasks',
        // Welcome page translations
        welcomeToFlowFocus: 'Welcome to Flow Focus',
        welcomeDescription: 'A minimal Pomodoro timer for deep focus. Swipe to navigate.',
        startFocusing: 'Start Focusing',
        feature1: 'Swipe navigation',
        feature2: 'Task tracking',
        feature3: 'Progress stats',
        swipeToNavigate: 'Swipe to navigate',
        // Pomodoro settings descriptions
        timerDurations: 'Timer Durations',
        behaviorSettings: 'Behavior Settings',
        focusMinutesDesc: 'Duration for focus sessions',
        shortBreakMinutesDesc: 'Duration for short breaks',
        longBreakMinutesDesc: 'Duration for long breaks',
        sessionsUntilLongBreakDesc: 'Sessions before long break',
        autoStartNextDesc: 'Automatically start next session',
        soundDesc: 'Play sound notifications',
        notificationsDesc: 'Show desktop notifications',
        // Tag feature translations
        enterSubjectTag: 'Enter Subject/Task Tag',
        subjectTag: 'Subject/Task Tag',
        subjectTagPlaceholder: 'e.g., Math, Essay, Coding...',
        sessionHistory: 'Session History',
        recentSessions: 'Recent Sessions',
        noSessionsYet: 'No sessions yet',
        startFirstSession: 'Start your first session to see history',
        beFirstToShare: 'Be the first to share something!'
    },
    zh: {
        appName: '專注流',
        tagline: '簡約番茄工作法應用',
        focus: '專注',
        shortBreak: '短休息',
        longBreak: '長休息',
        start: '開始',
        pause: '暫停',
        reset: '重置',
        settings: '設定',
        close: '關閉',
        cancel: '取消',
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
        // New navigation translations
        customizeYourExperience: '自訂您的體驗',
        pomodoroSettings: '番茄工作法設定',
        statsAndGoals: '統計與目標',
        trackYourProgress: '追蹤您的進度',
        manageYourTasks: '管理您的任務',
        // Welcome page translations
        welcomeToFlowFocus: '歡迎使用專注流',
        welcomeDescription: '簡約番茄工作法計時器，專注深度學習。滑動導航。',
        startFocusing: '開始專注',
        feature1: '滑動導航',
        feature2: '任務追蹤',
        feature3: '進度統計',
        swipeToNavigate: '滑動導航',
        // Pomodoro settings descriptions
        timerDurations: '計時器時長',
        behaviorSettings: '行為設定',
        focusMinutesDesc: '專注時段的時長',
        shortBreakMinutesDesc: '短休息的時長',
        longBreakMinutesDesc: '長休息的時長',
        sessionsUntilLongBreakDesc: '長休息前的時段數',
        autoStartNextDesc: '自動開始下一個時段',
        soundDesc: '播放聲音通知',
        notificationsDesc: '顯示桌面通知',
        // Tag feature translations
        enterSubjectTag: '輸入科目/任務標籤',
        subjectTag: '科目/任務標籤',
        subjectTagPlaceholder: '例如：數學、作文、編程...',
        sessionHistory: '學習記錄',
        recentSessions: '最近學習',
        noSessionsYet: '還沒有學習記錄',
        startFirstSession: '開始第一次學習來查看記錄',
        beFirstToShare: '成為第一個分享的人！'
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

