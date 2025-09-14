// Proactive Error Prevention System

import { errorHandler } from './errorHandler'

export interface PreventionRule {
    id: string
    name: string
    condition: () => boolean
    action: () => void
    severity: 'low' | 'medium' | 'high' | 'critical'
    cooldown: number // milliseconds
    lastTriggered?: number
}

export interface PreventionMetrics {
    rulesTriggered: number
    errorsPrevented: number
    lastPrevention: Date | null
    activeRules: number
}

class ProactivePreventionSystem {
    private static instance: ProactivePreventionSystem
    private rules: PreventionRule[] = []
    private metrics: PreventionMetrics = {
        rulesTriggered: 0,
        errorsPrevented: 0,
        lastPrevention: null,
        activeRules: 0
    }
    private isRunning = false
    private checkInterval: NodeJS.Timeout | null = null

    constructor() {
        this.initializeDefaultRules()
    }

    static getInstance(): ProactivePreventionSystem {
        if (!ProactivePreventionSystem.instance) {
            ProactivePreventionSystem.instance = new ProactivePreventionSystem()
        }
        return ProactivePreventionSystem.instance
    }

    start(): void {
        if (this.isRunning) {
            console.log('🛡️ Prevention system already running')
            return
        }

        console.log('🛡️ Starting proactive prevention system...')
        this.isRunning = true

        // Check rules every 5 seconds
        this.checkInterval = setInterval(() => {
            this.checkRules()
        }, 5000)

        // Monitor for potential issues
        this.setupEventListeners()

        console.log('✅ Proactive prevention system started')
    }

    stop(): void {
        if (!this.isRunning) {
            return
        }

        console.log('🛑 Stopping proactive prevention system...')
        this.isRunning = false

        if (this.checkInterval) {
            clearInterval(this.checkInterval)
            this.checkInterval = null
        }

        console.log('✅ Proactive prevention system stopped')
    }

    private initializeDefaultRules(): void {
        // Rule 1: Prevent localStorage corruption
        this.addRule({
            id: 'localStorage-corruption',
            name: 'Prevent localStorage corruption',
            condition: () => {
                try {
                    const testKey = '__prevention_test__'
                    localStorage.setItem(testKey, 'test')
                    localStorage.removeItem(testKey)
                    return false
                } catch (error) {
                    return true
                }
            },
            action: () => {
                console.warn('🛡️ localStorage corruption detected, clearing...')
                try {
                    localStorage.clear()
                    this.metrics.errorsPrevented++
                    this.metrics.lastPrevention = new Date()
                } catch (error) {
                    console.error('Failed to clear localStorage:', error)
                }
            },
            severity: 'high',
            cooldown: 30000 // 30 seconds
        })

        // Rule 2: Prevent memory leaks
        this.addRule({
            id: 'memory-leak-prevention',
            name: 'Prevent memory leaks',
            condition: () => {
                if ('memory' in performance) {
                    const memory = (performance as any).memory
                    const usedMB = memory.usedJSHeapSize / (1024 * 1024)
                    return usedMB > 150 // 150MB threshold
                }
                return false
            },
            action: () => {
                console.warn('🛡️ High memory usage detected, triggering cleanup...')
                // Trigger garbage collection if available
                if (window.gc) {
                    window.gc()
                }
                // Clear any cached data
                this.clearCachedData()
                this.metrics.errorsPrevented++
                this.metrics.lastPrevention = new Date()
            },
            severity: 'medium',
            cooldown: 60000 // 1 minute
        })

        // Rule 3: Prevent infinite loops
        this.addRule({
            id: 'infinite-loop-prevention',
            name: 'Prevent infinite loops',
            condition: () => {
                // Check if there are too many rapid errors
                const errors = errorHandler.getErrors()
                const recentErrors = errors.filter(error => {
                    const errorTime = new Date(error.timestamp).getTime()
                    const oneMinuteAgo = Date.now() - 60000
                    return errorTime > oneMinuteAgo
                })
                return recentErrors.length > 20
            },
            action: () => {
                console.warn('🛡️ Potential infinite loop detected, clearing errors...')
                errorHandler.clearErrors()
                this.metrics.errorsPrevented++
                this.metrics.lastPrevention = new Date()
            },
            severity: 'critical',
            cooldown: 30000 // 30 seconds
        })

        // Rule 4: Prevent DOM pollution
        this.addRule({
            id: 'dom-pollution-prevention',
            name: 'Prevent DOM pollution',
            condition: () => {
                // Check for excessive DOM nodes
                const nodeCount = document.querySelectorAll('*').length
                return nodeCount > 10000
            },
            action: () => {
                console.warn('🛡️ Excessive DOM nodes detected, cleaning up...')
                this.cleanupDOM()
                this.metrics.errorsPrevented++
                this.metrics.lastPrevention = new Date()
            },
            severity: 'medium',
            cooldown: 120000 // 2 minutes
        })

        // Rule 5: Prevent network timeouts
        this.addRule({
            id: 'network-timeout-prevention',
            name: 'Prevent network timeouts',
            condition: () => {
                // Check if we're offline for too long
                return !navigator.onLine && Date.now() - this.getLastOnlineTime() > 300000 // 5 minutes
            },
            action: () => {
                console.warn('🛡️ Extended offline period detected, switching to offline mode...')
                this.enableOfflineMode()
                this.metrics.errorsPrevented++
                this.metrics.lastPrevention = new Date()
            },
            severity: 'low',
            cooldown: 300000 // 5 minutes
        })

        // Rule 6: Prevent video loading issues
        this.addRule({
            id: 'video-loading-prevention',
            name: 'Prevent video loading issues',
            condition: () => {
                const videos = document.querySelectorAll('video')
                let failedVideos = 0
                videos.forEach(video => {
                    if (video.error && video.error.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
                        failedVideos++
                    }
                })
                return failedVideos > 2
            },
            action: () => {
                console.warn('🛡️ Multiple video loading failures detected, switching to fallback...')
                this.switchToVideoFallback()
                this.metrics.errorsPrevented++
                this.metrics.lastPrevention = new Date()
            },
            severity: 'medium',
            cooldown: 60000 // 1 minute
        })

        this.metrics.activeRules = this.rules.length
    }

    private addRule(rule: PreventionRule): void {
        this.rules.push(rule)
    }

    private checkRules(): void {
        if (!this.isRunning) return

        this.rules.forEach(rule => {
            try {
                // Check cooldown
                if (rule.lastTriggered && Date.now() - rule.lastTriggered < rule.cooldown) {
                    return
                }

                // Check condition
                if (rule.condition()) {
                    console.log(`🛡️ Prevention rule triggered: ${rule.name}`)
                    rule.action()
                    rule.lastTriggered = Date.now()
                    this.metrics.rulesTriggered++
                }
            } catch (error) {
                console.error(`Error in prevention rule ${rule.id}:`, error)
            }
        })
    }

    private setupEventListeners(): void {
        // Monitor for unhandled errors
        window.addEventListener('error', (event) => {
            this.handleError(event.error, 'JavaScript Error')
        })

        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason, 'Unhandled Promise Rejection')
        })

        // Monitor for online/offline status
        window.addEventListener('online', () => {
            this.setLastOnlineTime(Date.now())
        })

        window.addEventListener('offline', () => {
            this.setLastOnlineTime(Date.now())
        })

        // Monitor for visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseNonEssentialOperations()
            } else {
                this.resumeOperations()
            }
        })
    }

    private handleError(error: any, type: string): void {
        // Check if this is a recurring error
        const errors = errorHandler.getErrors()
        const recentSimilarErrors = errors.filter(e =>
            e.message.includes(error?.message || 'Unknown error') &&
            Date.now() - new Date(e.timestamp).getTime() < 60000 // Last minute
        )

        if (recentSimilarErrors.length > 5) {
            console.warn(`🛡️ Recurring error detected: ${type}`)
            this.handleRecurringError(error, type)
        }
    }

    private handleRecurringError(_error: any, type: string): void {
        // Implement specific handling for recurring errors
        if (type.includes('video')) {
            this.switchToVideoFallback()
        } else if (type.includes('network')) {
            this.enableOfflineMode()
        } else if (type.includes('memory')) {
            this.clearCachedData()
        }
    }

    private clearCachedData(): void {
        try {
            // Clear any cached data that might be causing issues
            const keysToCheck = ['cached-videos', 'temp-data', 'debug-info']
            keysToCheck.forEach(key => {
                if (localStorage.getItem(key)) {
                    localStorage.removeItem(key)
                }
            })
        } catch (error) {
            console.error('Failed to clear cached data:', error)
        }
    }

    private cleanupDOM(): void {
        try {
            // Remove any orphaned elements
            const orphanedElements = document.querySelectorAll('[data-orphaned="true"]')
            orphanedElements.forEach(el => el.remove())
        } catch (error) {
            console.error('Failed to cleanup DOM:', error)
        }
    }

    private switchToVideoFallback(): void {
        // Switch all videos to fallback mode
        const videos = document.querySelectorAll('video')
        videos.forEach(video => {
            if (video.error) {
                video.style.display = 'none'
                const fallback = video.parentElement?.querySelector('.video-fallback')
                if (fallback) {
                    (fallback as HTMLElement).style.display = 'block'
                }
            }
        })
    }

    private enableOfflineMode(): void {
        // Set offline mode flag
        localStorage.setItem('offline-mode', 'true')
        // Disable network-dependent features
        document.body.classList.add('offline-mode')
    }

    private pauseNonEssentialOperations(): void {
        // Pause non-essential operations when tab is hidden
        document.body.classList.add('paused-mode')
    }

    private resumeOperations(): void {
        // Resume operations when tab becomes visible
        document.body.classList.remove('paused-mode')
    }

    private getLastOnlineTime(): number {
        return parseInt(localStorage.getItem('last-online-time') || '0')
    }

    private setLastOnlineTime(timestamp: number): void {
        localStorage.setItem('last-online-time', timestamp.toString())
    }

    getMetrics(): PreventionMetrics {
        return { ...this.metrics }
    }

    getActiveRules(): PreventionRule[] {
        return this.rules.filter(rule => !rule.lastTriggered ||
            Date.now() - rule.lastTriggered > rule.cooldown)
    }

    addCustomRule(rule: PreventionRule): void {
        this.rules.push(rule)
        this.metrics.activeRules = this.rules.length
    }

    removeRule(ruleId: string): void {
        this.rules = this.rules.filter(rule => rule.id !== ruleId)
        this.metrics.activeRules = this.rules.length
    }
}

// Export singleton instance
export const proactivePrevention = ProactivePreventionSystem.getInstance()

// Auto-start prevention system
if (typeof window !== 'undefined') {
    setTimeout(() => {
        proactivePrevention.start()
    }, 10000) // Start after 10 seconds
}
