import { useSwipeNavigation, Page } from '../hooks/useSwipeNavigation'
import TimerPage from './pages/TimerPage'
import SettingsPage from './pages/SettingsPage'
import StatsPage from './pages/StatsPage'
import TasksPage from './pages/TasksPage'

export default function SwipeNavigator() {
    const {
        currentPage,
        isTransitioning,
        navigateToPage,
        navigateNext,
        navigatePrevious,
        navigateToTasks,
        navigateToTimer
    } = useSwipeNavigation()

    const pageOrder: Page[] = ['timer', 'settings', 'stats']
    const currentIndex = pageOrder.indexOf(currentPage)

    const getPageComponent = (page: Page) => {
        switch (page) {
            case 'timer':
                return <TimerPage />
            case 'settings':
                return <SettingsPage />
            case 'stats':
                return <StatsPage />
            case 'tasks':
                return <TasksPage />
            default:
                return <TimerPage />
        }
    }

    const getPageIndex = (page: Page) => {
        return pageOrder.indexOf(page)
    }

    const getTransformStyle = () => {
        if (currentPage === 'tasks') {
            return 'translateY(100vh)'
        }

        const pageIndex = getPageIndex(currentPage)
        return `translateX(-${pageIndex * 100}vw)`
    }

    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* Main pages container */}
            <div
                className={`flex transition-transform duration-300 ease-in-out ${currentPage === 'tasks' ? 'flex-col' : 'flex-row'
                    }`}
                style={{
                    transform: getTransformStyle(),
                    width: currentPage === 'tasks' ? '100vw' : '300vw',
                    height: currentPage === 'tasks' ? '200vh' : '100vh'
                }}
            >
                {/* Timer Page */}
                <div className="w-screen h-screen flex-shrink-0">
                    {getPageComponent('timer')}
                </div>

                {/* Settings Page */}
                <div className="w-screen h-screen flex-shrink-0">
                    {getPageComponent('settings')}
                </div>

                {/* Stats Page */}
                <div className="w-screen h-screen flex-shrink-0">
                    {getPageComponent('stats')}
                </div>
            </div>

            {/* Tasks Page - positioned absolutely */}
            <div
                className={`absolute top-0 left-0 w-full h-full transition-transform duration-300 ease-in-out ${currentPage === 'tasks' ? 'translate-y-0' : 'translate-y-full'
                    }`}
            >
                {getPageComponent('tasks')}
            </div>

            {/* Navigation Controls - Desktop/Mac */}
            <div className="hidden md:block">
                {/* Top navigation bar */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                    {['timer', 'settings', 'stats'].map((page, index) => (
                        <button
                            key={page}
                            onClick={() => navigateToPage(page as Page)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${currentPage === page
                                    ? 'bg-white text-black'
                                    : 'text-white/70 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            {page === 'timer' ? 'Timer' : page === 'settings' ? 'Settings' : 'Stats'}
                        </button>
                    ))}
                    <button
                        onClick={() => navigateToPage('tasks')}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${currentPage === 'tasks'
                                ? 'bg-white text-black'
                                : 'text-white/70 hover:text-white hover:bg-white/10'
                            }`}
                    >
                        Tasks
                    </button>
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

                {/* Tasks navigation */}
                {currentPage !== 'tasks' && (
                    <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
                        <button
                            onClick={navigateToTasks}
                            className="p-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-200"
                        >
                            ↓ Tasks
                        </button>
                    </div>
                )}

                {currentPage === 'tasks' && (
                    <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
                        <button
                            onClick={navigateToTimer}
                            className="p-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-200"
                        >
                            ↑ Timer
                        </button>
                    </div>
                )}
            </div>

            {/* Page indicator dots - Mobile */}
            <div className="md:hidden absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
                {['timer', 'settings', 'stats'].map((page, index) => (
                    <div
                        key={page}
                        className={`w-2 h-2 rounded-full transition-colors duration-200 ${currentPage === page ? 'bg-white' : 'bg-white/30'
                            }`}
                    />
                ))}
            </div>

            {/* Keyboard shortcuts hint - Desktop/Mac */}
            <div className="hidden md:block absolute bottom-4 left-4 text-xs text-white/40">
                <div>← → Navigate</div>
                <div>↑ ↓ Tasks</div>
                <div>1-4 Quick jump</div>
            </div>
        </div>
    )
}
