// App Monitor - Real-time monitoring dashboard

import { useState, useEffect } from 'react'
import { appWatchdog } from '../lib/appWatchdog'
import { errorHandler } from '../lib/errorHandler'
import { env } from '../lib/env'

interface AppMonitorProps {
    className?: string
    showDetails?: boolean
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

export function AppMonitor({
    className = '',
    showDetails: _showDetails = false,
    position = 'bottom-right'
}: AppMonitorProps) {
    const [status, setStatus] = useState(appWatchdog.getStatus())
    const [isExpanded, setIsExpanded] = useState(false)
    const [errors, setErrors] = useState(errorHandler.getErrors())

    useEffect(() => {
        // Update status every 5 seconds
        const interval = setInterval(() => {
            setStatus(appWatchdog.getStatus())
            setErrors(errorHandler.getErrors())
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    const getStatusColor = () => {
        if (status.isHealthy && status.performance.isPerformanceGood) return 'text-green-400'
        if (!status.isHealthy) return 'text-red-400'
        if (!status.performance.isPerformanceGood) return 'text-yellow-400'
        return 'text-gray-400'
    }

    const getStatusIcon = () => {
        if (status.isHealthy && status.performance.isPerformanceGood) return '🟢'
        if (!status.isHealthy) return '🔴'
        if (!status.performance.isPerformanceGood) return '🟡'
        return '⚪'
    }

    const formatUptime = (ms: number) => {
        const seconds = Math.floor(ms / 1000)
        const minutes = Math.floor(seconds / 60)
        const hours = Math.floor(minutes / 60)

        if (hours > 0) return `${hours}h ${minutes % 60}m`
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`
        return `${seconds}s`
    }

    const positionClasses = {
        'top-left': 'top-4 left-4',
        'top-right': 'top-4 right-4',
        'bottom-left': 'bottom-4 left-4',
        'bottom-right': 'bottom-4 right-4'
    }

    return (
        <div className={`fixed ${positionClasses[position]} z-50 ${className}`}>
            <div className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-white text-xs">
                {/* Status Header */}
                <div
                    className="flex items-center gap-2 cursor-pointer hover:bg-white/10 rounded px-2 py-1 -mx-2 -my-1"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <span className="text-lg">{getStatusIcon()}</span>
                    <div>
                        <div className={`font-semibold ${getStatusColor()}`}>
                            {status.isHealthy ? 'Healthy' : 'Issues'}
                        </div>
                        <div className="text-gray-400">
                            Uptime: {formatUptime(status.uptime)}
                        </div>
                    </div>
                    <div className="ml-auto">
                        <span className="text-gray-400">
                            {isExpanded ? '▼' : '▶'}
                        </span>
                    </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                    <div className="mt-3 space-y-2 border-t border-white/20 pt-3">
                        {/* Performance Metrics */}
                        <div>
                            <div className="font-semibold text-gray-300 mb-1">Performance</div>
                            <div className="space-y-1 text-gray-400">
                                <div>Response: {status.performance.averageResponseTime}ms</div>
                                <div>Memory: {status.performance.memoryUsage}MB</div>
                                <div className={status.performance.isPerformanceGood ? 'text-green-400' : 'text-yellow-400'}>
                                    {status.performance.isPerformanceGood ? '✓ Good' : '⚠ Slow'}
                                </div>
                            </div>
                        </div>

                        {/* Health Status */}
                        <div>
                            <div className="font-semibold text-gray-300 mb-1">Health</div>
                            <div className="space-y-1 text-gray-400">
                                <div>Failures: {status.consecutiveFailures}</div>
                                <div>Recoveries: {status.totalRecoveries}</div>
                                <div>Last Check: {status.lastHealthCheck?.toLocaleTimeString() || 'Never'}</div>
                            </div>
                        </div>

                        {/* Recent Errors */}
                        {errors.length > 0 && (
                            <div>
                                <div className="font-semibold text-gray-300 mb-1">Recent Errors</div>
                                <div className="text-red-400 text-xs max-h-20 overflow-y-auto">
                                    {errors.slice(-3).map((error, i) => (
                                        <div key={i} className="truncate">
                                            {error.code}: {error.message}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 pt-2 border-t border-white/20">
                            <button
                                onClick={() => {
                                    appWatchdog.forceHealthCheck()
                                    setStatus(appWatchdog.getStatus())
                                }}
                                className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
                            >
                                Check
                            </button>
                            <button
                                onClick={() => {
                                    errorHandler.clearErrors()
                                    setErrors([])
                                }}
                                className="bg-gray-600 hover:bg-gray-700 px-2 py-1 rounded text-xs"
                            >
                                Clear
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs"
                            >
                                Reload
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

// Full monitoring dashboard for development
export function MonitoringDashboard() {
    const [status, setStatus] = useState(appWatchdog.getStatus())
    const [errors, setErrors] = useState(errorHandler.getErrors())
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => {
            setStatus(appWatchdog.getStatus())
            setErrors(errorHandler.getErrors())
        }, 2000)

        return () => clearInterval(interval)
    }, [])

    if (!env.isDevelopment) {
        return null
    }

    return (
        <div className="fixed bottom-4 left-4 z-50">
            <button
                onClick={() => setIsVisible(!isVisible)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-xs font-semibold shadow-lg"
            >
                {isVisible ? 'Hide' : 'Show'} Monitor
            </button>

            {isVisible && (
                <div className="absolute bottom-12 left-0 bg-gray-900 text-white p-4 rounded-lg shadow-xl max-w-md max-h-96 overflow-auto text-xs">
                    <h3 className="font-bold text-lg mb-4 text-center">App Monitor</h3>

                    {/* Status Overview */}
                    <div className="mb-4 p-3 bg-gray-800 rounded">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <div className="text-gray-400">Status</div>
                                <div className={status.isHealthy ? 'text-green-400' : 'text-red-400'}>
                                    {status.isHealthy ? 'Healthy' : 'Unhealthy'}
                                </div>
                            </div>
                            <div>
                                <div className="text-gray-400">Uptime</div>
                                <div>{Math.floor(status.uptime / 1000)}s</div>
                            </div>
                            <div>
                                <div className="text-gray-400">Failures</div>
                                <div className={status.consecutiveFailures > 0 ? 'text-red-400' : 'text-green-400'}>
                                    {status.consecutiveFailures}
                                </div>
                            </div>
                            <div>
                                <div className="text-gray-400">Recoveries</div>
                                <div className="text-blue-400">{status.totalRecoveries}</div>
                            </div>
                        </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="mb-4 p-3 bg-gray-800 rounded">
                        <div className="font-semibold mb-2">Performance</div>
                        <div className="space-y-1">
                            <div className="flex justify-between">
                                <span>Response Time:</span>
                                <span className={status.performance.averageResponseTime < 1000 ? 'text-green-400' : 'text-yellow-400'}>
                                    {status.performance.averageResponseTime}ms
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Memory Usage:</span>
                                <span className={status.performance.memoryUsage < 100 ? 'text-green-400' : 'text-yellow-400'}>
                                    {status.performance.memoryUsage}MB
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Performance:</span>
                                <span className={status.performance.isPerformanceGood ? 'text-green-400' : 'text-yellow-400'}>
                                    {status.performance.isPerformanceGood ? 'Good' : 'Degraded'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Recent Errors */}
                    <div className="mb-4">
                        <div className="font-semibold mb-2">Recent Errors ({errors.length})</div>
                        <div className="max-h-32 overflow-y-auto space-y-1">
                            {errors.slice(-5).map((error, i) => (
                                <div key={i} className="p-2 bg-red-900/50 rounded text-xs">
                                    <div className="font-semibold text-red-400">{error.code}</div>
                                    <div className="text-red-300">{error.message}</div>
                                    <div className="text-gray-400 text-xs">{error.context}</div>
                                    <div className="text-gray-500 text-xs">{error.timestamp}</div>
                                </div>
                            ))}
                            {errors.length === 0 && (
                                <div className="text-green-400 text-center py-2">No recent errors</div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => {
                                appWatchdog.forceHealthCheck()
                                setStatus(appWatchdog.getStatus())
                            }}
                            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs"
                        >
                            Force Check
                        </button>
                        <button
                            onClick={() => {
                                errorHandler.clearErrors()
                                setErrors([])
                            }}
                            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs"
                        >
                            Clear Errors
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-xs"
                        >
                            Reload App
                        </button>
                        <button
                            onClick={() => {
                                localStorage.clear()
                                window.location.reload()
                            }}
                            className="bg-orange-600 hover:bg-orange-700 px-3 py-1 rounded text-xs"
                        >
                            Reset Data
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
