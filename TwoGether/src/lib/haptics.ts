// Haptic feedback system for TwoGether
// Provides tactile feedback for mobile interactions

export type HapticType =
    | 'light'      // Light tap
    | 'medium'     // Medium tap  
    | 'heavy'      // Heavy tap
    | 'success'    // Success pattern
    | 'warning'    // Warning pattern
    | 'error'      // Error pattern
    | 'selection'  // Selection feedback
    | 'impact';    // Impact feedback

export interface HapticOptions {
    intensity?: number; // 0.0 to 1.0
    duration?: number;  // Duration in milliseconds
    pattern?: number[]; // Custom pattern (on/off intervals)
}

class HapticManager {
    private isSupported = false;
    private isEnabled = true;

    constructor() {
        // Check if haptic feedback is supported
        if (typeof window !== 'undefined') {
            this.isSupported =
                'vibrate' in navigator ||
                'vibrate' in window ||
                // @ts-ignore - iOS specific
                'webkitVibrate' in navigator;
        }
    }

    // Enable/disable haptic feedback
    setEnabled(enabled: boolean) {
        this.isEnabled = enabled;
    }

    // Check if haptic feedback is available
    isAvailable(): boolean {
        return this.isSupported && this.isEnabled;
    }

    // Trigger haptic feedback
    trigger(type: HapticType, options: HapticOptions = {}): void {
        if (!this.isAvailable()) {
            console.log(`Haptic feedback: ${type} (not supported)`);
            return;
        }

        const patterns = this.getPatterns(type, options);

        try {
            // Standard vibrate API
            if (navigator.vibrate) {
                navigator.vibrate(patterns);
            }
            // iOS webkit vibrate
            // @ts-ignore
            else if (navigator.webkitVibrate) {
                // @ts-ignore
                navigator.webkitVibrate(patterns);
            }

            console.log(`Haptic feedback: ${type}`, patterns);
        } catch (error) {
            console.warn('Haptic feedback failed:', error);
        }
    }

    // Get vibration patterns for different haptic types
    private getPatterns(type: HapticType, options: HapticOptions): number[] {
        const intensity = options.intensity || 1.0;
        const duration = options.duration || 100;

        switch (type) {
            case 'light':
                return [duration * intensity];

            case 'medium':
                return [duration * intensity * 1.5];

            case 'heavy':
                return [duration * intensity * 2];

            case 'success':
                return [100, 50, 100]; // Success pattern

            case 'warning':
                return [200, 100, 200]; // Warning pattern

            case 'error':
                return [300, 100, 300, 100, 300]; // Error pattern

            case 'selection':
                return [50]; // Quick selection feedback

            case 'impact':
                return [duration * intensity * 1.2];

            default:
                return [duration * intensity];
        }
    }

    // Custom pattern
    custom(pattern: number[]): void {
        if (!this.isAvailable()) return;

        try {
            navigator.vibrate(pattern);
            console.log('Custom haptic pattern:', pattern);
        } catch (error) {
            console.warn('Custom haptic pattern failed:', error);
        }
    }
}

export const haptics = new HapticManager();

// React hook for haptic feedback
export function useHaptics() {
    const trigger = (type: HapticType, options?: HapticOptions) => {
        haptics.trigger(type, options);
    };

    const light = () => trigger('light');
    const medium = () => trigger('medium');
    const heavy = () => trigger('heavy');
    const success = () => trigger('success');
    const warning = () => trigger('warning');
    const error = () => trigger('error');
    const selection = () => trigger('selection');
    const impact = () => trigger('impact');

    return {
        trigger,
        light,
        medium,
        heavy,
        success,
        warning,
        error,
        selection,
        impact,
        isSupported: haptics.isAvailable()
    };
}

// Common haptic patterns for TwoGether
export const HapticPatterns = {
    // Swipe actions
    swipeLeft: () => haptics.trigger('light'),
    swipeRight: () => haptics.trigger('success'),
    swipeUp: () => haptics.trigger('selection'),
    swipeDown: () => haptics.trigger('medium'),

    // Button interactions
    buttonPress: () => haptics.trigger('selection'),
    buttonSuccess: () => haptics.trigger('success'),
    buttonError: () => haptics.trigger('error'),

    // Form interactions
    formSubmit: () => haptics.trigger('success'),
    formError: () => haptics.trigger('error'),

    // Navigation
    tabSwitch: () => haptics.trigger('light'),
    modalOpen: () => haptics.trigger('medium'),
    modalClose: () => haptics.trigger('light'),

    // Special events
    eventJoin: () => haptics.trigger('success'),
    carpoolMatch: () => haptics.trigger('success'),
    messageSent: () => haptics.trigger('light'),
    ratingSubmitted: () => haptics.trigger('success'),

    // Gestures
    longPress: () => haptics.trigger('heavy'),
    doubleTap: () => haptics.trigger('medium'),
    pinch: () => haptics.trigger('impact')
};

// Demo mode for testing haptics
export function enableHapticDemo() {
    haptics.setEnabled(true);
    console.log('Haptic demo mode enabled');
}

export function disableHapticDemo() {
    haptics.setEnabled(false);
    console.log('Haptic demo mode disabled');
}

// Utility to add haptic feedback to any element
export function addHapticFeedback(
    element: React.ReactElement,
    hapticType: HapticType,
    options?: HapticOptions
): React.ReactElement {
    return React.cloneElement(element, {
        onClick: (e: React.MouseEvent) => {
            haptics.trigger(hapticType, options);
            if (element.props.onClick) {
                element.props.onClick(e);
            }
        },
        onTouchStart: (e: React.TouchEvent) => {
            haptics.trigger(hapticType, options);
            if (element.props.onTouchStart) {
                element.props.onTouchStart(e);
            }
        }
    });
}