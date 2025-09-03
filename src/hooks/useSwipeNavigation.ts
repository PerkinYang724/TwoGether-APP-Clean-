import { useState, useEffect, useRef } from 'react'

export type Page = 'welcome' | 'timer' | 'settings' | 'stats' | 'tasks'

export function useSwipeNavigation() {
    const [currentPage, setCurrentPage] = useState<Page>('welcome')
    const [isTransitioning, setIsTransitioning] = useState(false)
    const [hasStarted, setHasStarted] = useState(false)
    const touchStartRef = useRef<{ x: number; y: number } | null>(null)
    const touchEndRef = useRef<{ x: number; y: number } | null>(null)

    const minSwipeDistance = 50

    const pageOrder: Page[] = ['timer', 'settings', 'stats']
    const currentIndex = pageOrder.indexOf(currentPage)

    const navigateToPage = (page: Page) => {
        if (isTransitioning) return
        setIsTransitioning(true)
        setCurrentPage(page)
        setTimeout(() => setIsTransitioning(false), 300)
    }

    const navigateNext = () => {
        if (currentIndex < pageOrder.length - 1) {
            navigateToPage(pageOrder[currentIndex + 1])
        }
    }

    const navigatePrevious = () => {
        if (currentIndex > 0) {
            navigateToPage(pageOrder[currentIndex - 1])
        }
    }

    const navigateToTasks = () => {
        if (currentPage !== 'tasks') {
            navigateToPage('tasks')
        }
    }

    const navigateToTimer = () => {
        if (currentPage === 'tasks') {
            navigateToPage('timer')
        }
    }

    const startApp = () => {
        setHasStarted(true)
        // Stay on welcome page, but it will show the timer
    }

    const handleTouchStart = (e: TouchEvent) => {
        touchStartRef.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        }
    }

    const handleTouchMove = (e: TouchEvent) => {
        touchEndRef.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        }
    }

    const handleTouchEnd = () => {
        if (!touchStartRef.current || !touchEndRef.current || isTransitioning) return

        const deltaX = touchEndRef.current.x - touchStartRef.current.x
        const deltaY = touchEndRef.current.y - touchStartRef.current.y
        const absDeltaX = Math.abs(deltaX)
        const absDeltaY = Math.abs(deltaY)

        // Don't allow swiping from welcome page unless started
        if (currentPage === 'welcome' && !hasStarted) {
            touchStartRef.current = null
            touchEndRef.current = null
            return
        }

        // Determine if it's a horizontal or vertical swipe
        if (absDeltaX > absDeltaY) {
            // Horizontal swipe
            if (absDeltaX > minSwipeDistance) {
                if (deltaX > 0) {
                    // Swipe right - go to previous page
                    if (currentIndex > 0) {
                        navigateToPage(pageOrder[currentIndex - 1])
                    }
                } else {
                    // Swipe left - go to next page
                    if (currentIndex < pageOrder.length - 1) {
                        navigateToPage(pageOrder[currentIndex + 1])
                    }
                }
            }
        } else {
            // Vertical swipe
            if (absDeltaY > minSwipeDistance) {
                if (deltaY > 0) {
                    // Swipe down - go to tasks page
                    if (currentPage !== 'tasks') {
                        navigateToPage('tasks')
                    }
                } else {
                    // Swipe up - go back to timer from tasks
                    if (currentPage === 'tasks') {
                        navigateToPage('timer')
                    }
                }
            }
        }

        touchStartRef.current = null
        touchEndRef.current = null
    }

    // Keyboard navigation for Mac/desktop
    const handleKeyDown = (e: KeyboardEvent) => {
        if (isTransitioning) return

        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault()
                navigatePrevious()
                break
            case 'ArrowRight':
                e.preventDefault()
                navigateNext()
                break
            case 'ArrowDown':
                e.preventDefault()
                navigateToTasks()
                break
            case 'ArrowUp':
                e.preventDefault()
                navigateToTimer()
                break
            case '1':
                e.preventDefault()
                if (currentPage === 'welcome' && !hasStarted) {
                    startApp()
                } else if (currentPage === 'welcome' && hasStarted) {
                    // Already on timer (welcome page showing timer)
                } else {
                    navigateToPage('timer')
                }
                break
            case '2':
                e.preventDefault()
                if (hasStarted) {
                    navigateToPage('settings')
                }
                break
            case '3':
                e.preventDefault()
                if (hasStarted) {
                    navigateToPage('stats')
                }
                break
            case '4':
                e.preventDefault()
                if (hasStarted) {
                    navigateToPage('tasks')
                }
                break
        }
    }

    useEffect(() => {
        const element = document.body

        // Touch events for mobile devices
        element.addEventListener('touchstart', handleTouchStart, { passive: true })
        element.addEventListener('touchmove', handleTouchMove, { passive: true })
        element.addEventListener('touchend', handleTouchEnd, { passive: true })

        // Keyboard events for Mac/desktop
        element.addEventListener('keydown', handleKeyDown)

        return () => {
            element.removeEventListener('touchstart', handleTouchStart)
            element.removeEventListener('touchmove', handleTouchMove)
            element.removeEventListener('touchend', handleTouchEnd)
            element.removeEventListener('keydown', handleKeyDown)
        }
    }, [currentPage, currentIndex, isTransitioning])

    return {
        currentPage,
        hasStarted,
        navigateToPage,
        navigateNext,
        navigatePrevious,
        navigateToTasks,
        navigateToTimer,
        startApp,
        isTransitioning
    }
}
