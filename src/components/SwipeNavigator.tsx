
import { useEffect } from 'react'
import { useSwipeNavigation, Page } from '../hooks/useSwipeNavigation'
import WelcomePage from './pages/WelcomePage'
import TimerPage from './pages/TimerPage'
import SettingsPage from './pages/SettingsPage'
import StatsPage from './pages/StatsPage'
import TasksPage from './pages/TasksPage'
import ForumPage from './pages/ForumPage'

interface SwipeNavigatorProps {
    onVideoStart?: () => void
    onPageChange?: (page: string) => void
}

export default function SwipeNavigator({ onVideoStart, onPageChange }: SwipeNavigatorProps) {
    const {
        currentPage,
        hasStarted,
        navigateToPage,
        navigateNext,
        navigatePrevious,
        startApp
    } = useSwipeNavigation()

    const pageOrder: Page[] = ['welcome', 'timer', 'settings', 'stats', 'tasks', 'forum']
    const currentIndex = pageOrder.indexOf(currentPage)

    console.log('SwipeNavigator: currentPage:', currentPage, 'currentIndex:', currentIndex)

    // Notify parent component when page changes
    useEffect(() => {
        console.log('SwipeNavigator: Page changed to:', currentPage)
        if (onPageChange) {
            console.log('SwipeNavigator: Notifying parent of page change')
            onPageChange(currentPage)
        }
    }, [currentPage, onPageChange])

    const getPageComponent = (page: Page) => {
        switch (page) {
            case 'welcome':
                return <WelcomePage onStart={startApp} hasStarted={hasStarted} onVideoStart={onVideoStart} />
            case 'timer':
                return <TimerPage />
            case 'settings':
                return <SettingsPage />
            case 'stats':
                return <StatsPage />
            case 'tasks':
                return <TasksPage />
            case 'forum':
                return <ForumPage />
            default:
                return <WelcomePage onStart={startApp} hasStarted={hasStarted} onVideoStart={onVideoStart} />
        }
    }

    const getPageIndex = (page: Page) => {
        return pageOrder.indexOf(page)
    }

    const getTransformStyle = () => {
        const pageIndex = getPageIndex(currentPage)
        const transform = `translateX(-${pageIndex * 100}vw)`
        console.log('SwipeNavigator: getTransformStyle - currentPage:', currentPage, 'pageIndex:', pageIndex, 'transform:', transform)
        return transform
    }

    return (
        <div className={`relative w-full overflow-x-hidden overflow-y-auto ${currentPage === 'welcome' ? 'h-screen' : 'min-h-screen pb-48 md:pb-0'}`}>
            {/* Main pages container */}
            <div
                className="flex transition-transform duration-300 ease-in-out flex-row"
                style={{
                    transform: getTransformStyle(),
                    width: '600vw', // 6 pages * 100vw each
                    minHeight: currentPage === 'welcome' ? '100vh' : '100vh'
                }}
            >
                {/* Welcome Page */}
                <div className={`w-screen flex-shrink-0 ${currentPage === 'welcome' ? 'h-screen' : 'min-h-screen'}`}>
                    {getPageComponent('welcome')}
                </div>

                {/* Timer Page */}
                <div className="w-screen min-h-screen flex-shrink-0">
                    {getPageComponent('timer')}
                </div>

                {/* Settings Page */}
                <div className="w-screen min-h-screen flex-shrink-0">
                    {getPageComponent('settings')}
                </div>

                {/* Stats Page */}
                <div className="w-screen min-h-screen flex-shrink-0">
                    {getPageComponent('stats')}
                </div>

                {/* Tasks Page */}
                <div className="w-screen min-h-screen flex-shrink-0">
                    {getPageComponent('tasks')}
                </div>

                {/* Forum Page */}
                <div className="w-screen min-h-screen flex-shrink-0">
                    {getPageComponent('forum')}
                </div>
            </div>

            {/* Navigation Controls - Desktop/Mac */}
            {hasStarted && (
                <div className="hidden md:block">
                    {/* Top navigation bar */}
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                        {pageOrder.filter(page => page !== 'welcome').map((page) => (
                            <button
                                key={page}
                                onClick={() => navigateToPage(page)}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${currentPage === page
                                    ? 'bg-white text-black'
                                    : 'text-white/70 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {page === 'timer' ? 'Timer' :
                                    page === 'settings' ? 'Settings' :
                                        page === 'stats' ? 'Stats' :
                                            page === 'tasks' ? 'Tasks' : 'Forum'}
                            </button>
                        ))}
                    </div>

                    {/* Arrow navigation */}
                    <div className="absolute top-1/2 left-4 transform -translate-y-1/2 flex flex-col gap-2">
                        <button
                            onClick={navigatePrevious}
                            disabled={currentIndex === 0}
                            className="p-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            ←
                        </button>
                    </div>

                    <div className="absolute top-1/2 right-4 transform -translate-y-1/2 flex flex-col gap-2">
                        <button
                            onClick={navigateNext}
                            disabled={currentIndex === pageOrder.length - 1}
                            className="p-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            →
                        </button>
                    </div>


                </div>
            )}

            {/* Mobile Navigation Bar */}
            {hasStarted && (
                <div className="block md:hidden">
                    {/* Bottom navigation bar - Mobile */}
                    <div
                        className="mobile-nav-bar"
                        data-timestamp={Date.now()}
                        style={{
                            position: 'fixed',
                            bottom: '20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px',
                            backgroundColor: 'rgba(0, 0, 0, 0.9)',
                            backdropFilter: 'blur(12px)',
                            borderRadius: '9999px',
                            padding: '8px 12px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            maxWidth: 'calc(100vw - 32px)',
                            width: '320px',
                            zIndex: 9999,
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
                        }}>
                        {pageOrder.filter(page => page !== 'welcome').map((page) => (
                            <button
                                key={page}
                                onClick={() => navigateToPage(page)}
                                className={`px-2 py-2 rounded-full text-xs font-medium transition-colors duration-200 flex-1 touch-manipulation ${currentPage === page
                                    ? 'bg-white text-black'
                                    : 'text-white/70 hover:text-white hover:bg-white/10 active:bg-white/20'
                                    }`}
                            >
                                {page === 'timer' ? 'Timer' :
                                    page === 'settings' ? 'Settings' :
                                        page === 'stats' ? 'Stats' :
                                            page === 'tasks' ? 'Tasks' : 'Forum'}
                            </button>
                        ))}
                    </div>

                </div>
            )}

            {/* Keyboard shortcuts hint - Desktop/Mac */}
            {hasStarted && (
                <div className="hidden md:block absolute bottom-4 left-4 text-xs text-white/40">
                    <div>← → Navigate</div>
                    <div>1-5 Quick jump</div>
                </div>
            )}
        </div>
    )
}