
import { useSwipeNavigation, Page } from '../hooks/useSwipeNavigation'
import WelcomePage from './pages/WelcomePage'
import TimerPage from './pages/TimerPage'
import SettingsPage from './pages/SettingsPage'
import StatsPage from './pages/StatsPage'
import TasksPage from './pages/TasksPage'

export default function SwipeNavigator() {
    const {
        currentPage,
        hasStarted,
        navigateToPage,
        navigateNext,
        navigatePrevious,
        startApp
    } = useSwipeNavigation()

    const pageOrder: Page[] = ['welcome', 'timer', 'settings', 'stats', 'tasks']
    const currentIndex = pageOrder.indexOf(currentPage)

    console.log('SwipeNavigator: currentPage:', currentPage, 'currentIndex:', currentIndex)

    const getPageComponent = (page: Page) => {
        console.log('SwipeNavigator: getPageComponent called for page:', page)
        switch (page) {
            case 'welcome':
                return <WelcomePage onStart={startApp} hasStarted={hasStarted} />
            case 'timer':
                return <TimerPage />
            case 'settings':
                return <SettingsPage />
            case 'stats':
                return <StatsPage />
            case 'tasks':
                return <TasksPage />
            default:
                return <WelcomePage onStart={startApp} hasStarted={hasStarted} />
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
        <div className="relative w-full min-h-screen overflow-x-hidden overflow-y-auto">
            {/* Main pages container */}
            <div
                className="flex transition-transform duration-300 ease-in-out flex-row"
                style={{
                    transform: getTransformStyle(),
                    width: '500vw', // 5 pages * 100vw each
                    minHeight: '100vh'
                }}
            >
                {/* Welcome Page */}
                <div className="w-screen min-h-screen flex-shrink-0">
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
                                        page === 'stats' ? 'Stats' : 'Tasks'}
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
                    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-1 bg-black/80 backdrop-blur-sm rounded-full px-3 py-2 border border-white/20 max-w-xs z-40">
                        {pageOrder.filter(page => page !== 'welcome').map((page) => (
                            <button
                                key={page}
                                onClick={() => navigateToPage(page)}
                                className={`px-2 py-1 rounded-full text-xs font-medium transition-colors duration-200 flex-1 ${currentPage === page
                                    ? 'bg-white text-black'
                                    : 'text-white/70 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {page === 'timer' ? 'Timer' :
                                    page === 'settings' ? 'Settings' :
                                        page === 'stats' ? 'Stats' : 'Tasks'}
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