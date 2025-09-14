// App Watchdog - Continuous monitoring and automatic recovery

import { appInitializer, type AppHealth } from './initialization'
import { errorHandler } from './errorHandler'

export interface WatchdogConfig {
    healthCheckInterval: number // milliseconds
    maxConsecutiveFailures: number
    recoveryAttempts: number
    performanceThreshold: number // milliseconds
    memoryThreshold: number // MB
}

export interface WatchdogStatus {
    isHealthy: boolean
    lastHealthCheck: Date | null
    consecutiveFailures: number
    totalRecoveries: number
    uptime: number
    performance: {
        averageResponseTime: number
        memoryUsage: number
        isPerformanceGood: boolean
    }
}

class AppWatchdog {
    private static instance: AppWatchdog
    private config: WatchdogConfig
    private status: WatchdogStatus
    private healthCheckInterval: NodeJS.Timeout | null = null
    private isRunning = false
    private startTime = Date.now()
    private responseTimes: number[] = []
    private maxResponseTimeHistory = 50

    constructor() {
        this.config = {
            healthCheckInterval: 10000, // 10 seconds
            maxConsecutiveFailures: 3,
            recoveryAttempts: 5,
            performanceThreshold: 1000, // 1 second
            memoryThreshold: 100 // 100MB
        }

        this.status = {
            isHealthy: true,
            lastHealthCheck: null,
            consecutiveFailures: 0,
            totalRecoveries: 0,
            uptime: 0,
            performance: {
                averageResponseTime: 0,
                memoryUsage: 0,
                isPerformanceGood: true
            }
        }
    }

    static getInstance(): AppWatchdog {
        if (!AppWatchdog.instance) {
            AppWatchdog.instance = new AppWatchdog()
        }
        return AppWatchdog.instance
    }

    start(): void {
        if (this.isRunning) {
            console.log('🔄 Watchdog already running')
            return
        }

        console.log('🐕 Starting App Watchdog...')
        this.isRunning = true
        this.startTime = Date.now()

        // Start continuous health monitoring
        this.startHealthMonitoring()

        // Start performance monitoring
        this.startPerformanceMonitoring()

        // Start memory monitoring
        this.startMemoryMonitoring()

        // Start error rate monitoring
        this.startErrorRateMonitoring()

        console.log('✅ App Watchdog started successfully')
    }

    stop(): void {
        if (!this.isRunning) {
            return
        }

        console.log('🛑 Stopping App Watchdog...')
        this.isRunning = false

        if (this.healthCheckInterval) {
            clearInterval(this.healthCheckInterval)
            this.healthCheckInterval = null
        }

        console.log('✅ App Watchdog stopped')
    }

    private startHealthMonitoring(): void {
        this.healthCheckInterval = setInterval(async () => {
            await this.performHealthCheck()
        }, this.config.healthCheckInterval)
    }

    private async performHealthCheck(): Promise<void> {
        const startTime = performance.now()

        try {
            console.log('🔍 Performing health check...')

            // Check app health
            const health = await appInitializer.checkHealth()
            const responseTime = performance.now() - startTime

            // Record response time
            this.recordResponseTime(responseTime)

            // Update status
            this.status.lastHealthCheck = new Date()
            this.status.uptime = Date.now() - this.startTime

            if (health.isHealthy) {
                this.status.consecutiveFailures = 0
                this.status.isHealthy = true
                console.log('✅ Health check passed')
            } else {
                this.status.consecutiveFailures++
                this.status.isHealthy = false
                console.warn('⚠️ Health check failed:', health.issues)

                // Attempt recovery if too many consecutive failures
                if (this.status.consecutiveFailures >= this.config.maxConsecutiveFailures) {
                    await this.attemptRecovery()
                }
            }

            // Check performance
            this.checkPerformance()

        } catch (error) {
            console.error('❌ Health check error:', error)
            this.status.consecutiveFailures++
            this.status.isHealthy = false

            errorHandler.logError({
                message: `Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                code: 'WATCHDOG_HEALTH_CHECK_FAILED',
                context: 'AppWatchdog'
            })

            if (this.status.consecutiveFailures >= this.config.maxConsecutiveFailures) {
                await this.attemptRecovery()
            }
        }
    }

    private startPerformanceMonitoring(): void {
        // Monitor performance every 30 seconds
        setInterval(() => {
            this.checkPerformance()
        }, 30000)
    }

    private startMemoryMonitoring(): void {
        // Monitor memory every 60 seconds
        setInterval(() => {
            this.checkMemoryUsage()
        }, 60000)
    }

    private startErrorRateMonitoring(): void {
        // Monitor error rate every 2 minutes
        setInterval(() => {
            this.checkErrorRate()
        }, 120000)
    }

    private recordResponseTime(responseTime: number): void {
        this.responseTimes.push(responseTime)

        // Keep only recent response times
        if (this.responseTimes.length > this.maxResponseTimeHistory) {
            this.responseTimes = this.responseTimes.slice(-this.maxResponseTimeHistory)
        }

        // Calculate average
        const average = this.responseTimes.reduce((sum, time) => sum + time, 0) / this.responseTimes.length
        this.status.performance.averageResponseTime = Math.round(average)
    }

    private checkPerformance(): void {
        const avgResponseTime = this.status.performance.averageResponseTime
        const isGood = avgResponseTime < this.config.performanceThreshold

        this.status.performance.isPerformanceGood = isGood

        if (!isGood) {
            console.warn(`⚠️ Performance degraded: ${avgResponseTime}ms average response time`)

            errorHandler.logError({
                message: `Performance degraded: ${avgResponseTime}ms average response time`,
                code: 'WATCHDOG_PERFORMANCE_DEGRADED',
                context: 'AppWatchdog'
            })
        }
    }

    private checkMemoryUsage(): void {
        if ('memory' in performance) {
            const memory = (performance as any).memory
            const usedMB = memory.usedJSHeapSize / (1024 * 1024)

            this.status.performance.memoryUsage = Math.round(usedMB)

            if (usedMB > this.config.memoryThreshold) {
                console.warn(`⚠️ High memory usage: ${Math.round(usedMB)}MB`)

                errorHandler.logError({
                    message: `High memory usage: ${Math.round(usedMB)}MB`,
                    code: 'WATCHDOG_HIGH_MEMORY_USAGE',
                    context: 'AppWatchdog'
                })

                // Trigger garbage collection if possible
                if (window.gc) {
                    window.gc()
                }
            }
        }
    }

    private checkErrorRate(): void {
        const errors = errorHandler.getErrors()
        const recentErrors = errors.filter(error => {
            const errorTime = new Date(error.timestamp).getTime()
            const twoMinutesAgo = Date.now() - (2 * 60 * 1000)
            return errorTime > twoMinutesAgo
        })

        if (recentErrors.length > 10) {
            console.warn(`⚠️ High error rate: ${recentErrors.length} errors in last 2 minutes`)

            errorHandler.logError({
                message: `High error rate: ${recentErrors.length} errors in last 2 minutes`,
                code: 'WATCHDOG_HIGH_ERROR_RATE',
                context: 'AppWatchdog'
            })
        }
    }

    private async attemptRecovery(): Promise<void> {
        if (this.status.totalRecoveries >= this.config.recoveryAttempts) {
            console.error('❌ Maximum recovery attempts reached')
            return
        }

        console.log('🔄 Attempting app recovery...')
        this.status.totalRecoveries++

        try {
            // Attempt to recover the app
            const recovered = await appInitializer.recover()

            if (recovered) {
                console.log('✅ App recovery successful')
                this.status.consecutiveFailures = 0
                this.status.isHealthy = true

                // Clear old errors
                errorHandler.clearErrors()

                // Show recovery notification to user
                this.showRecoveryNotification()
            } else {
                console.error('❌ App recovery failed')
                this.status.isHealthy = false
            }
        } catch (error) {
            console.error('❌ Recovery attempt failed:', error)
            this.status.isHealthy = false
        }
    }

    private showRecoveryNotification(): void {
        // Create a temporary notification
        const notification = document.createElement('div')
        notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50'
        notification.textContent = '✅ App recovered successfully'

        document.body.appendChild(notification)

        // Remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification)
            }
        }, 3000)
    }

    getStatus(): WatchdogStatus {
        return { ...this.status }
    }

    isAppHealthy(): boolean {
        return this.status.isHealthy
    }

    // Force a health check
    async forceHealthCheck(): Promise<AppHealth> {
        return await appInitializer.checkHealth()
    }

    // Get performance metrics
    getPerformanceMetrics() {
        return {
            averageResponseTime: this.status.performance.averageResponseTime,
            memoryUsage: this.status.performance.memoryUsage,
            isPerformanceGood: this.status.performance.isPerformanceGood,
            uptime: this.status.uptime,
            consecutiveFailures: this.status.consecutiveFailures,
            totalRecoveries: this.status.totalRecoveries
        }
    }

    // Update configuration
    updateConfig(newConfig: Partial<WatchdogConfig>): void {
        this.config = { ...this.config, ...newConfig }
        console.log('🔧 Watchdog configuration updated:', this.config)
    }
}

// Export singleton instance
export const appWatchdog = AppWatchdog.getInstance()

// Auto-start watchdog when module loads
if (typeof window !== 'undefined') {
    // Start watchdog after a short delay to ensure app is initialized
    setTimeout(() => {
        appWatchdog.start()
    }, 5000)
}

