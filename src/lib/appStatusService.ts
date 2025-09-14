// App Status Service - Ensures app is always working

import { appWatchdog } from './appWatchdog'
import { proactivePrevention } from './proactivePrevention'
import { errorHandler } from './errorHandler'
import { appInitializer, type AppHealth } from './initialization'

export interface AppStatus {
    isWorking: boolean
    health: AppHealth | null
    uptime: number
    lastCheck: Date | null
    issues: string[]
    warnings: string[]
    performance: {
        responseTime: number
        memoryUsage: number
        isGood: boolean
    }
    prevention: {
        rulesTriggered: number
        errorsPrevented: number
        lastPrevention: Date | null
    }
    errors: {
        total: number
        recent: number
        critical: number
    }
}

class AppStatusService {
    private static instance: AppStatusService
    private status: AppStatus
    private isMonitoring = false
    private monitoringInterval: NodeJS.Timeout | null = null
    private lastWorkingTime = Date.now()
    private startTime = Date.now()

    constructor() {
        this.status = {
            isWorking: true,
            health: null,
            uptime: 0,
            lastCheck: null,
            issues: [],
            warnings: [],
            performance: {
                responseTime: 0,
                memoryUsage: 0,
                isGood: true
            },
            prevention: {
                rulesTriggered: 0,
                errorsPrevented: 0,
                lastPrevention: null
            },
            errors: {
                total: 0,
                recent: 0,
                critical: 0
            }
        }
    }

    static getInstance(): AppStatusService {
        if (!AppStatusService.instance) {
            AppStatusService.instance = new AppStatusService()
        }
        return AppStatusService.instance
    }

    startMonitoring(): void {
        if (this.isMonitoring) {
            console.log('📊 App status monitoring already running')
            return
        }

        console.log('📊 Starting app status monitoring...')
        this.isMonitoring = true
        this.startTime = Date.now()

        // Update status every 2 seconds
        this.monitoringInterval = setInterval(() => {
            this.updateStatus()
        }, 2000)

        // Initial status update
        this.updateStatus()

        console.log('✅ App status monitoring started')
    }

    stopMonitoring(): void {
        if (!this.isMonitoring) {
            return
        }

        console.log('🛑 Stopping app status monitoring...')
        this.isMonitoring = false

        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval)
            this.monitoringInterval = null
        }

        console.log('✅ App status monitoring stopped')
    }

    private async updateStatus(): Promise<void> {
        try {
            // Update basic info
            this.status.uptime = Date.now() - this.startTime
            this.status.lastCheck = new Date()

            // Get health status
            const health = await appInitializer.checkHealth()
            this.status.health = health
            this.status.issues = health.issues
            this.status.warnings = health.warnings

            // Get watchdog status
            const watchdogStatus = appWatchdog.getStatus()
            this.status.performance = {
                responseTime: watchdogStatus.performance.averageResponseTime,
                memoryUsage: watchdogStatus.performance.memoryUsage,
                isGood: watchdogStatus.performance.isPerformanceGood
            }

            // Get prevention metrics
            const preventionMetrics = proactivePrevention.getMetrics()
            this.status.prevention = {
                rulesTriggered: preventionMetrics.rulesTriggered,
                errorsPrevented: preventionMetrics.errorsPrevented,
                lastPrevention: preventionMetrics.lastPrevention
            }

            // Get error statistics
            const allErrors = errorHandler.getErrors()
            const recentErrors = allErrors.filter(error => {
                const errorTime = new Date(error.timestamp).getTime()
                const fiveMinutesAgo = Date.now() - (5 * 60 * 1000)
                return errorTime > fiveMinutesAgo
            })
            const criticalErrors = allErrors.filter(error =>
                error.code?.includes('CRITICAL') || error.code?.includes('FATAL')
            )

            this.status.errors = {
                total: allErrors.length,
                recent: recentErrors.length,
                critical: criticalErrors.length
            }

            // Determine if app is working
            this.status.isWorking = this.determineIfWorking()

            // Update last working time
            if (this.status.isWorking) {
                this.lastWorkingTime = Date.now()
            }

        } catch (error) {
            console.error('Error updating app status:', error)
            this.status.isWorking = false
        }
    }

    private determineIfWorking(): boolean {
        // App is considered working if:
        // 1. Health check passes
        // 2. No critical errors
        // 3. Performance is acceptable
        // 4. Not too many recent errors

        const hasHealthIssues = this.status.health && !this.status.health.isHealthy
        const hasCriticalErrors = this.status.errors.critical > 0
        const hasPerformanceIssues = !this.status.performance.isGood
        const hasTooManyRecentErrors = this.status.errors.recent > 10

        return !hasHealthIssues && !hasCriticalErrors && !hasPerformanceIssues && !hasTooManyRecentErrors
    }

    getStatus(): AppStatus {
        return { ...this.status }
    }

    isAppWorking(): boolean {
        return this.status.isWorking
    }

    getUptime(): number {
        return this.status.uptime
    }

    getLastWorkingTime(): number {
        return this.lastWorkingTime
    }

    getTimeSinceLastWorking(): number {
        return Date.now() - this.lastWorkingTime
    }

    // Force a complete health check
    async forceHealthCheck(): Promise<AppHealth> {
        const health = await appInitializer.checkHealth()
        this.updateStatus()
        return health
    }

    // Get performance metrics
    getPerformanceMetrics() {
        return {
            uptime: this.status.uptime,
            responseTime: this.status.performance.responseTime,
            memoryUsage: this.status.performance.memoryUsage,
            isPerformanceGood: this.status.performance.isGood,
            errorsPrevented: this.status.prevention.errorsPrevented,
            rulesTriggered: this.status.prevention.rulesTriggered
        }
    }

    // Get error summary
    getErrorSummary() {
        return {
            total: this.status.errors.total,
            recent: this.status.errors.recent,
            critical: this.status.errors.critical,
            lastCheck: this.status.lastCheck
        }
    }

    // Check if app needs attention
    needsAttention(): boolean {
        return !this.status.isWorking ||
            this.status.errors.critical > 0 ||
            this.status.errors.recent > 5 ||
            !this.status.performance.isGood
    }

    // Get status summary for display
    getStatusSummary(): string {
        if (!this.status.isWorking) {
            return '❌ Not Working'
        }
        if (this.status.errors.critical > 0) {
            return '🔴 Critical Issues'
        }
        if (this.status.errors.recent > 5) {
            return '🟡 Multiple Issues'
        }
        if (!this.status.performance.isGood) {
            return '🟡 Performance Issues'
        }
        if (this.status.warnings.length > 0) {
            return '🟡 Warnings'
        }
        return '✅ Working Well'
    }

    // Get detailed status for debugging
    getDetailedStatus() {
        return {
            ...this.status,
            needsAttention: this.needsAttention(),
            statusSummary: this.getStatusSummary(),
            timeSinceLastWorking: this.getTimeSinceLastWorking(),
            monitoringActive: this.isMonitoring
        }
    }

    // Emergency recovery
    async emergencyRecovery(): Promise<boolean> {
        console.log('🚨 Emergency recovery initiated...')

        try {
            // Clear all errors
            errorHandler.clearErrors()

            // Force health check
            await this.forceHealthCheck()

            // Clear potentially corrupted data
            const keysToCheck = ['settings', 'music', 'pomodoro-sessions']
            keysToCheck.forEach(key => {
                try {
                    const value = localStorage.getItem(key)
                    if (value) {
                        JSON.parse(value) // Test if valid JSON
                    }
                } catch (error) {
                    console.warn(`Clearing corrupted data: ${key}`)
                    localStorage.removeItem(key)
                }
            })

            // Reload the page
            window.location.reload()

            return true
        } catch (error) {
            console.error('Emergency recovery failed:', error)
            return false
        }
    }
}

// Export singleton instance
export const appStatusService = AppStatusService.getInstance()

// Auto-start monitoring
if (typeof window !== 'undefined') {
    setTimeout(() => {
        appStatusService.startMonitoring()
    }, 3000) // Start after 3 seconds
}

