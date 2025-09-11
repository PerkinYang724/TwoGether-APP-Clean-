import { useState, useEffect, useRef } from 'react'

export type Page = 'welcome' | 'timer' | 'settings' | 'stats' | 'tasks'

export function useSwipeNavigation() {
    const [currentPage, setCurrentPage] = useState<Page>('welcome')
    const [hasStarted, setHasStarted] = useState(false)
    const touchStartRef = useRef<{ x: number; y: number } | null>(null)
    const touchEndRef = useRef<{ x: number; y: number } | null>(null)

    const minSwipeDistance = 100

    // Linear page order - everything accessible by left/right swipes
    const pageOrder: Page[] = ['welcome', 'timer', 'settings', 'stats', 'tasks']
    const currentIndex = pageOrder.indexOf(currentPage)

    const navigateToPage = (page: Page) => {
        console.log('Navigation: navigateToPage called - attempting to navigate to page:', page, 'from:', currentPage)
        console.trace('Navigation: Call stack for navigateToPage')

        // Check if this navigation is happening during tag submission
        if (document.querySelector('[data-modal="tag-input"]')) {
            console.log('Navigation: BLOCKED - Modal is still open during navigation attempt')
            return
        }

        // Check global navigation prevention flag
        if ((window as any).__preventNavigation) {
            console.log('Navigation: BLOCKED - Global navigation prevention flag is set')
            return
        }

        console.log('Navigation: PROCEEDING with navigation to page:', page)
        setCurrentPage(page)
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
        navigateToPage('tasks')
    }

    const navigateToTimer = () => {
        navigateToPage('timer')
    }

    const startApp = () => {
        console.log('Navigation: startApp called, current page:', currentPage)
        setHasStarted(true)
        // Navigate to the timer page
        console.log('Navigation: Navigating to timer page from startApp')
        navigateToPage('timer')
    }

    const handleTouchStart = (e: TouchEvent) => {
        // Don't handle touch events if any modal is open
        if (document.querySelector('[data-modal="tag-input"]')) {
            console.log('Navigation: Ignoring touchstart - modal is open')
            return
        }

        // Check if tag submission is in progress
        if (document.querySelector('[data-submitting-tag="true"]')) {
            console.log('Navigation: Ignoring touchstart - tag submission in progress')
            return
        }

        // Check global navigation prevention flag
        if ((window as any).__preventNavigation) {
            console.log('Navigation: Ignoring touchstart - global navigation prevention flag is set')
            return
        }

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
        if (!touchStartRef.current || !touchEndRef.current) return

        // Don't handle touch events if any modal is open
        if (document.querySelector('[data-modal="tag-input"]')) {
            console.log('Navigation: Ignoring touchend - modal is open')
            touchStartRef.current = null
            touchEndRef.current = null
            return
        }

        // Check if tag submission is in progress
        if (document.querySelector('[data-submitting-tag="true"]')) {
            console.log('Navigation: Ignoring touchend - tag submission in progress')
            touchStartRef.current = null
            touchEndRef.current = null
            return
        }

        // Check global navigation prevention flag
        if ((window as any).__preventNavigation) {
            console.log('Navigation: Ignoring touchend - global navigation prevention flag is set')
            touchStartRef.current = null
            touchEndRef.current = null
            return
        }

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

        // Only horizontal swipes - left/right navigation
        // Ensure it's more horizontal than vertical (ratio > 2:1)
        if (absDeltaX > minSwipeDistance && absDeltaX > absDeltaY * 2) {
            console.log('Navigation: Swipe detected, deltaX:', deltaX, 'absDeltaX:', absDeltaX, 'absDeltaY:', absDeltaY)
            if (deltaX > 0) {
                // Swipe right - go to previous page
                if (currentIndex > 0) {
                    console.log('Navigation: Swiping right to previous page')
                    navigateToPage(pageOrder[currentIndex - 1])
                }
            } else {
                // Swipe left - go to next page
                if (currentIndex < pageOrder.length - 1) {
                    console.log('Navigation: Swiping left to next page')
                    navigateToPage(pageOrder[currentIndex + 1])
                }
            }
        }

        touchStartRef.current = null
        touchEndRef.current = null
    }

    // Keyboard navigation for Mac/desktop
    const handleKeyDown = (e: KeyboardEvent) => {

        console.log('Navigation: handleKeyDown called with key:', e.key, 'target:', e.target)

        // Don't handle navigation if user is typing in an input field
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
            console.log('Navigation: Ignoring keydown - user is typing in input field')
            return
        }

        // Don't handle navigation if any modal is open
        if (document.querySelector('[data-modal="tag-input"]')) {
            console.log('Navigation: Ignoring keydown - modal is open')
            return
        }

        // Don't handle navigation if we're in a form or modal context
        if (e.target && ((e.target as Element).closest('form') || (e.target as Element).closest('[data-modal]'))) {
            console.log('Navigation: Ignoring keydown - in form or modal context')
            return
        }

        // Additional check: if the event target is within the tag input modal
        if (e.target && (e.target as Element).closest('[data-modal="tag-input"]')) {
            console.log('Navigation: Ignoring keydown - target is within tag input modal')
            return
        }

        // Check if tag submission is in progress
        if (document.querySelector('[data-submitting-tag="true"]')) {
            console.log('Navigation: Ignoring keydown - tag submission in progress')
            return
        }

        // Check global navigation prevention flag
        if ((window as any).__preventNavigation) {
            console.log('Navigation: Ignoring keydown - global navigation prevention flag is set')
            return
        }

        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault()
                console.log('Navigation: ArrowLeft key pressed - navigating to previous page')
                navigatePrevious()
                break
            case 'ArrowRight':
                e.preventDefault()
                console.log('Navigation: ArrowRight key pressed - navigating to next page')
                navigateNext()
                break
            case '1':
                e.preventDefault()
                console.log('Navigation: Key 1 pressed')
                if (currentPage === 'welcome' && !hasStarted) {
                    startApp()
                } else {
                    navigateToPage('welcome')
                }
                break
            case '2':
                e.preventDefault()
                console.log('Navigation: Key 2 pressed - navigating to timer')
                if (hasStarted) {
                    navigateToPage('timer')
                }
                break
            case '3':
                e.preventDefault()
                console.log('Navigation: Key 3 pressed - navigating to settings')
                if (hasStarted) {
                    navigateToPage('settings')
                }
                break
            case '4':
                e.preventDefault()
                console.log('Navigation: Key 4 pressed - navigating to stats')
                if (hasStarted) {
                    navigateToPage('stats')
                }
                break
            case '5':
                e.preventDefault()
                console.log('Navigation: Key 5 pressed - navigating to tasks')
                if (hasStarted) {
                    navigateToPage('tasks')
                }
                break
            case '6':
                e.preventDefault()
                console.log('Navigation: Key 6 pressed - navigating to tasks')
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
    }, [currentPage, currentIndex])

    return {
        currentPage,
        hasStarted,
        navigateToPage,
        navigateNext,
        navigatePrevious,
        navigateToTasks,
        navigateToTimer,
        startApp
    }
}
