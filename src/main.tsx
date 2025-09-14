import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { MusicProvider } from './context/MusicContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import { errorHandler } from './lib/errorHandler'
import { appWatchdog } from './lib/appWatchdog'
import { proactivePrevention } from './lib/proactivePrevention'
import { appStatusService } from './lib/appStatusService'
import './styles.css'

// Initialize error handling
errorHandler.logError({
    message: 'App starting up',
    code: 'APP_START',
    context: 'main.tsx'
})

// Initialize monitoring systems
console.log('🚀 Initializing monitoring systems...')

// Start app watchdog
appWatchdog.start()

// Start proactive prevention
proactivePrevention.start()

// Start status monitoring
appStatusService.startMonitoring()

console.log('✅ All monitoring systems initialized')

// Create root with error boundary
const root = ReactDOM.createRoot(document.getElementById('root')!)

root.render(
    <ErrorBoundary>
        <React.StrictMode>
            <MusicProvider>
                <App />
            </MusicProvider>
        </React.StrictMode>
    </ErrorBoundary>
)
// Force rebuild Thu Sep 11 19:40:47 CST 2025
// Fresh deployment Thu Sep 11 19:46:47 CST 2025
