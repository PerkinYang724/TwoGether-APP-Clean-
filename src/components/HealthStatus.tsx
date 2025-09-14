import { useState, useEffect } from 'react'
import { appInitializer, type AppHealth } from '../lib/initialization'
import { errorHandler } from '../lib/errorHandler'
import { env } from '../lib/env'

interface HealthStatusProps {
    className?: string
    showDetails?: boolean
}

export function HealthStatus({ className = '', showDetails = false }: HealthStatusProps) {
    const [health, setHealth] = useState<AppHealth | null>(null)
    const [isChecking, setIsChecking] = useState(false)
    const [lastCheck, setLastCheck] = useState<Date | null>(null)

    const checkHealth = async () => {
        setIsChecking(true)
        try {
            const healthStatus = await appInitializer.checkHealth()
            setHealth(healthStatus)
            setLastCheck(new Date())
        } catch (error) {
            console.error('Health check failed:', error)
            setHealth({
                isHealthy: false,
                issues: ['Health check failed'],
                warnings: []
            })
        } finally {
            setIsChecking(false)
        }
    }

    useEffect(() => {
        checkHealth()

        // Check health every 30 seconds
        const interval = setInterval(checkHealth, 30000)
        return () => clearInterval(interval)
    }, [])

    if (!health) {
        return (
            <div className={`text-xs text-gray-400 ${className}`}>
                Checking status...
            </div>
        )
    }

    const getStatusColor = () => {
        if (health.isHealthy) return 'text-green-400'
        if (health.issues.length > 0) return 'text-red-400'
        return 'text-yellow-400'
    }

    const getStatusText = () => {
        if (health.isHealthy) return '✓ Healthy'
        if (health.issues.length > 0) return '✗ Issues'
        return '⚠ Warnings'
    }

    return (
        <div className={`text-xs ${className}`}>
            <div className={`flex items-center gap-1 ${getStatusColor()}`}>
                <span>{getStatusText()}</span>
                {isChecking && (
                    <div className="animate-spin rounded-full h-3 w-3 border-b border-current"></div>
                )}
            </div>

            {showDetails && (
                <div className="mt-1 text-xs text-gray-500">
                    {health.issues.length > 0 && (
                        <div className="text-red-400">
                            Issues: {health.issues.length}
                        </div>
                    )}
                    {health.warnings.length > 0 && (
                        <div className="text-yellow-400">
                            Warnings: {health.warnings.length}
                        </div>
                    )}
                    {lastCheck && (
                        <div className="text-gray-500">
                            Last check: {lastCheck.toLocaleTimeString()}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

// Debug panel component for development
export function HealthDebugPanel() {
    const [isOpen, setIsOpen] = useState(false)
    const [health, setHealth] = useState<AppHealth | null>(null)
    const [errors, setErrors] = useState<any[]>([])

    useEffect(() => {
        const checkHealth = async () => {
            const healthStatus = await appInitializer.checkHealth()
            setHealth(healthStatus)
        }

        checkHealth()

        // Get recent errors
        setErrors(errorHandler.getErrors().slice(-10))
    }, [])

    if (!env.isDevelopment) {
        return null
    }

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-gray-800 text-white px-3 py-2 rounded-lg text-xs hover:bg-gray-700 transition-colors"
            >
                Debug Panel
            </button>

            {isOpen && (
                <div className="absolute bottom-12 right-0 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-sm max-h-96 overflow-auto text-xs">
                    <div className="mb-4">
                        <h3 className="font-bold mb-2">App Health</h3>
                        {health ? (
                            <div>
                                <div className={`mb-2 ${health.isHealthy ? 'text-green-400' : 'text-red-400'}`}>
                                    Status: {health.isHealthy ? 'Healthy' : 'Unhealthy'}
                                </div>
                                {health.issues.length > 0 && (
                                    <div className="mb-2">
                                        <div className="text-red-400 font-semibold">Issues:</div>
                                        <ul className="list-disc list-inside text-red-300">
                                            {health.issues.map((issue, i) => (
                                                <li key={i}>{issue}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {health.warnings.length > 0 && (
                                    <div className="mb-2">
                                        <div className="text-yellow-400 font-semibold">Warnings:</div>
                                        <ul className="list-disc list-inside text-yellow-300">
                                            {health.warnings.map((warning, i) => (
                                                <li key={i}>{warning}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div>Loading...</div>
                        )}
                    </div>

                    <div className="mb-4">
                        <h3 className="font-bold mb-2">Recent Errors</h3>
                        {errors.length > 0 ? (
                            <div className="space-y-1">
                                {errors.map((error, i) => (
                                    <div key={i} className="text-red-300 text-xs">
                                        <div className="font-semibold">{error.code}</div>
                                        <div>{error.message}</div>
                                        <div className="text-gray-400">{error.context}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-green-400">No recent errors</div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                errorHandler.clearErrors()
                                setErrors([])
                            }}
                            className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
                        >
                            Clear Errors
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
                        >
                            Reload
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
