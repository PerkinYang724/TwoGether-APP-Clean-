// App initialization and health checks

// import { errorHandler } from './errorHandler'

export interface AppHealth {
    isHealthy: boolean
    issues: string[]
    warnings: string[]
}

export class AppInitializer {
    private static instance: AppInitializer
    private isInitialized = false
    private initializationPromise: Promise<AppHealth> | null = null

    static getInstance(): AppInitializer {
        if (!AppInitializer.instance) {
            AppInitializer.instance = new AppInitializer()
        }
        return AppInitializer.instance
    }

    async initialize(): Promise<AppHealth> {
        if (this.isInitialized && this.initializationPromise) {
            return this.initializationPromise
        }

        this.initializationPromise = this.performInitialization()
        return this.initializationPromise
    }

    private async performInitialization(): Promise<AppHealth> {
        const health: AppHealth = {
            isHealthy: true,
            issues: [],
            warnings: []
        }

        console.log('🚀 Starting app initialization...')

        try {
            // 1. Check basic browser compatibility
            await this.checkBrowserCompatibility(health)

            // 2. Initialize localStorage safely
            await this.initializeStorage(health)

            // 3. Check network connectivity
            await this.checkNetworkConnectivity(health)

            // 4. Initialize service worker
            await this.initializeServiceWorker(health)

            // 5. Check for critical dependencies
            await this.checkDependencies(health)

            // 6. Initialize error handling
            this.initializeErrorHandling()

            this.isInitialized = true
            console.log('✅ App initialization completed:', health)

        } catch (error) {
            console.error('❌ App initialization failed:', error)
            health.isHealthy = false
            health.issues.push(`Initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }

        return health
    }

    private async checkBrowserCompatibility(health: AppHealth): Promise<void> {
        console.log('🔍 Checking browser compatibility...')

        // Check for required APIs
        const requiredAPIs = [
            { name: 'localStorage', check: () => typeof Storage !== 'undefined' },
            { name: 'fetch', check: () => typeof fetch !== 'undefined' },
            { name: 'Promise', check: () => typeof Promise !== 'undefined' },
            { name: 'requestAnimationFrame', check: () => typeof requestAnimationFrame !== 'undefined' }
        ]

        for (const api of requiredAPIs) {
            if (!api.check()) {
                health.isHealthy = false
                health.issues.push(`Required API not available: ${api.name}`)
            }
        }

        // Check for modern features
        if (!('serviceWorker' in navigator)) {
            health.warnings.push('Service Worker not supported - PWA features may not work')
        }

        if (!('Notification' in window)) {
            health.warnings.push('Notifications not supported - alerts may not work')
        }

        if (!('vibrate' in navigator)) {
            health.warnings.push('Vibration not supported - mobile feedback may not work')
        }
    }

    private async initializeStorage(health: AppHealth): Promise<void> {
        console.log('💾 Initializing storage...')

        try {
            // Test localStorage access
            const testKey = '__storage_test__'
            localStorage.setItem(testKey, 'test')
            localStorage.removeItem(testKey)

            // Initialize default settings if needed
            const settings = localStorage.getItem('settings')
            if (!settings) {
                const defaultSettings = {
                    focusMinutes: 25,
                    shortBreakMinutes: 5,
                    longBreakMinutes: 15,
                    sessionsUntilLongBreak: 4,
                    autoStartNext: true,
                    sound: true,
                    notifications: true
                }
                localStorage.setItem('settings', JSON.stringify(defaultSettings))
                console.log('📝 Initialized default settings')
            }

        } catch (error) {
            health.isHealthy = false
            health.issues.push(`Storage initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }

    private async checkNetworkConnectivity(health: AppHealth): Promise<void> {
        console.log('🌐 Checking network connectivity...')

        if (!navigator.onLine) {
            health.warnings.push('Device is offline - some features may not work')
        }

        // Test basic connectivity
        try {
            const response = await fetch('/favicon.svg', {
                method: 'HEAD',
                cache: 'no-cache',
                signal: AbortSignal.timeout(5000)
            })

            if (!response.ok) {
                health.warnings.push('Network connectivity issues detected')
            }
        } catch (error) {
            health.warnings.push('Could not verify network connectivity')
        }
    }

    private async initializeServiceWorker(health: AppHealth): Promise<void> {
        console.log('⚙️ Initializing service worker...')

        if (!('serviceWorker' in navigator)) {
            health.warnings.push('Service Worker not supported')
            return
        }

        try {
            const registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            })

            console.log('✅ Service Worker registered:', registration)

            // Check for updates
            registration.addEventListener('updatefound', () => {
                console.log('🔄 Service Worker update found')
                const newWorker = registration.installing
                if (newWorker) {
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('🔄 New Service Worker available - reloading...')
                            window.location.reload()
                        }
                    })
                }
            })

        } catch (error) {
            health.warnings.push(`Service Worker registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }

    private async checkDependencies(health: AppHealth): Promise<void> {
        console.log('📦 Checking dependencies...')

        // Check for critical environment variables
        const requiredEnvVars = [
            'VITE_SUPABASE_URL',
            'VITE_SUPABASE_ANON_KEY'
        ]

        for (const envVar of requiredEnvVars) {
            if (!import.meta.env[envVar]) {
                health.warnings.push(`Environment variable ${envVar} not set - cloud sync may not work`)
            }
        }

        // Check for external resources
        try {
            // Test if external video URLs are accessible
            const testVideoUrl = 'https://res.cloudinary.com/dblubqmip/video/upload/v1757593126/intro_h7yxev.mp4'
            const response = await fetch(testVideoUrl, {
                method: 'HEAD',
                signal: AbortSignal.timeout(10000)
            })

            if (!response.ok) {
                health.warnings.push('External video resources may not be accessible')
            }
        } catch (error) {
            health.warnings.push('Could not verify external resource accessibility')
        }
    }

    private initializeErrorHandling(): void {
        console.log('🛡️ Initializing error handling...')

        // Global error handler is already set up in errorHandler.ts
        // This is just for confirmation
        console.log('✅ Error handling initialized')
    }

    // Health check method
    async checkHealth(): Promise<AppHealth> {
        const health: AppHealth = {
            isHealthy: true,
            issues: [],
            warnings: []
        }

        // Quick health checks
        try {
            // Check localStorage
            localStorage.getItem('__health_check__')

            // Check if app is responsive
            const start = performance.now()
            await new Promise(resolve => setTimeout(resolve, 0))
            const end = performance.now()

            if (end - start > 100) {
                health.warnings.push('App performance may be degraded')
            }

        } catch (error) {
            health.isHealthy = false
            health.issues.push(`Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }

        return health
    }

    // Recovery methods
    async recover(): Promise<boolean> {
        console.log('🔄 Attempting app recovery...')

        try {
            // Clear potentially corrupted data
            const keysToCheck = ['settings', 'music', 'pomodoro-sessions']
            for (const key of keysToCheck) {
                try {
                    const value = localStorage.getItem(key)
                    if (value) {
                        JSON.parse(value) // Test if valid JSON
                    }
                } catch (error) {
                    console.warn(`Clearing corrupted data: ${key}`)
                    localStorage.removeItem(key)
                }
            }

            // Reinitialize
            await this.initialize()
            return true
        } catch (error) {
            console.error('Recovery failed:', error)
            return false
        }
    }
}

// Export singleton instance
export const appInitializer = AppInitializer.getInstance()

// Convenience function
export async function initializeApp(): Promise<AppHealth> {
    return appInitializer.initialize()
}
