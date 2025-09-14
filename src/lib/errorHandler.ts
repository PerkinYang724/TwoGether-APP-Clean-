// Global error handling utilities

export interface AppError {
    message: string
    code?: string
    context?: string
    timestamp: string
    userAgent?: string
    url?: string
}

export class AppErrorHandler {
    private static instance: AppErrorHandler
    private errorQueue: AppError[] = []
    private maxQueueSize = 50

    static getInstance(): AppErrorHandler {
        if (!AppErrorHandler.instance) {
            AppErrorHandler.instance = new AppErrorHandler()
        }
        return AppErrorHandler.instance
    }

    private constructor() {
        this.setupGlobalErrorHandlers()
    }

    private setupGlobalErrorHandlers() {
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason)
            this.logError({
                message: event.reason?.message || 'Unhandled promise rejection',
                code: 'UNHANDLED_REJECTION',
                context: 'Promise'
            })
        })

        // Handle JavaScript errors
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error)
            this.logError({
                message: event.error?.message || event.message || 'Unknown error',
                code: 'JAVASCRIPT_ERROR',
                context: event.filename ? `File: ${event.filename}:${event.lineno}:${event.colno}` : 'Unknown'
            })
        })
    }

    logError(error: Omit<AppError, 'timestamp' | 'userAgent' | 'url'>) {
        const fullError: AppError = {
            message: error.message,
            code: error.code,
            context: error.context,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        }

        console.error('App Error:', fullError)

        // Add to queue
        this.errorQueue.push(fullError)

        // Keep queue size manageable
        if (this.errorQueue.length > this.maxQueueSize) {
            this.errorQueue = this.errorQueue.slice(-this.maxQueueSize)
        }

        // Store in localStorage for debugging
        try {
            localStorage.setItem('app-errors', JSON.stringify(this.errorQueue))
        } catch (e) {
            console.warn('Could not store error in localStorage:', e)
        }
    }

    getErrors(): AppError[] {
        return [...this.errorQueue]
    }

    clearErrors() {
        this.errorQueue = []
        try {
            localStorage.removeItem('app-errors')
        } catch (e) {
            console.warn('Could not clear errors from localStorage:', e)
        }
    }

    // Safe wrapper for async operations
    async safeAsync<T>(
        operation: () => Promise<T>,
        context: string,
        fallback?: T
    ): Promise<T | undefined> {
        try {
            return await operation()
        } catch (error) {
            this.logError({
                message: error instanceof Error ? error.message : 'Unknown async error',
                code: 'ASYNC_ERROR',
                context
            })
            return fallback
        }
    }

    // Safe wrapper for sync operations
    safeSync<T>(
        operation: () => T,
        context: string,
        fallback?: T
    ): T | undefined {
        try {
            return operation()
        } catch (error) {
            this.logError({
                message: error instanceof Error ? error.message : 'Unknown sync error',
                code: 'SYNC_ERROR',
                context
            })
            return fallback
        }
    }
}

// Export singleton instance
export const errorHandler = AppErrorHandler.getInstance()

// Utility functions
export function safeLocalStorageGet<T>(key: string, fallback: T): T {
    return errorHandler.safeSync(() => {
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : fallback
    }, `localStorage.get(${key})`, fallback) || fallback
}

export function safeLocalStorageSet(key: string, value: any): boolean {
    return errorHandler.safeSync(() => {
        localStorage.setItem(key, JSON.stringify(value))
        return true
    }, `localStorage.set(${key})`, false) || false
}

export function safeJsonParse<T>(json: string, fallback: T): T {
    return errorHandler.safeSync(() => JSON.parse(json), `JSON.parse`, fallback) || fallback
}
