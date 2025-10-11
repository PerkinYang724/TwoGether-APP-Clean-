// Demo state management for TwoGether
// Allows forcing empty, loading, error states for demos

import React from 'react';

export type DemoState = 'normal' | 'loading' | 'empty' | 'error';

export interface DemoStateConfig {
    state: DemoState;
    delay?: number; // Delay in milliseconds for loading states
    errorMessage?: string;
    emptyMessage?: string;
}

class DemoStateManager {
    private currentState: DemoState = 'normal';
    private config: Partial<DemoStateConfig> = {};

    // Set demo state
    setState(state: DemoState, config?: Partial<DemoStateConfig>) {
        this.currentState = state;
        this.config = { ...this.config, ...config };
        console.log(`Demo state set to: ${state}`, config);
    }

    // Get current state
    getState(): DemoState {
        return this.currentState;
    }

    // Get current config
    getConfig(): Partial<DemoStateConfig> {
        return this.config;
    }

    // Reset to normal state
    reset() {
        this.currentState = 'normal';
        this.config = {};
        console.log('Demo state reset to normal');
    }

    // Check if we're in a specific state
    isState(state: DemoState): boolean {
        return this.currentState === state;
    }

    // Check if we're in loading state
    isLoading(): boolean {
        return this.currentState === 'loading';
    }

    // Check if we're in empty state
    isEmpty(): boolean {
        return this.currentState === 'empty';
    }

    // Check if we're in error state
    isError(): boolean {
        return this.currentState === 'error';
    }

    // Check if we're in normal state
    isNormal(): boolean {
        return this.currentState === 'normal';
    }
}

export const demoState = new DemoStateManager();

// React hook for demo states
export function useDemoState<T>(
    data: T[] | T | null | undefined,
    options?: {
        loadingDelay?: number;
        errorMessage?: string;
        emptyMessage?: string;
    }
) {
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const state = demoState.getState();
        const config = demoState.getConfig();

        switch (state) {
            case 'loading':
                setIsLoading(true);
                setError(null);

                // Simulate loading delay
                const delay = config.delay || options?.loadingDelay || 1000;
                setTimeout(() => {
                    setIsLoading(false);
                }, delay);
                break;

            case 'error':
                setIsLoading(false);
                setError(config.errorMessage || options?.errorMessage || 'Something went wrong');
                break;

            case 'empty':
                setIsLoading(false);
                setError(null);
                break;

            case 'normal':
            default:
                setIsLoading(false);
                setError(null);
                break;
        }
    }, [demoState.getState(), options]);

    const isEmpty = demoState.isEmpty() || (Array.isArray(data) && data.length === 0);
    const hasError = demoState.isError() || !!error;
    const isLoadingState = demoState.isLoading() || isLoading;

    return {
        isLoading: isLoadingState,
        isEmpty,
        hasError,
        error,
        state: demoState.getState(),
        data: demoState.isNormal() ? data : null
    };
}

// Utility to create demo state URLs
export function createDemoUrl(baseUrl: string, state: DemoState, config?: Partial<DemoStateConfig>): string {
    const params = new URLSearchParams();
    params.set('demo', state);

    if (config?.delay) {
        params.set('delay', config.delay.toString());
    }
    if (config?.errorMessage) {
        params.set('error', encodeURIComponent(config.errorMessage));
    }
    if (config?.emptyMessage) {
        params.set('empty', encodeURIComponent(config.emptyMessage));
    }

    return `${baseUrl}?${params.toString()}`;
}

// Utility to parse demo state from URL
export function parseDemoStateFromUrl(): Partial<DemoStateConfig> | null {
    if (typeof window === 'undefined') return null;

    const params = new URLSearchParams(window.location.search);
    const demo = params.get('demo');

    if (!demo) return null;

    const config: Partial<DemoStateConfig> = {
        state: demo as DemoState
    };

    const delay = params.get('delay');
    if (delay) {
        config.delay = parseInt(delay, 10);
    }

    const errorMessage = params.get('error');
    if (errorMessage) {
        config.errorMessage = decodeURIComponent(errorMessage);
    }

    const emptyMessage = params.get('empty');
    if (emptyMessage) {
        config.emptyMessage = decodeURIComponent(emptyMessage);
    }

    return config;
}

// Initialize demo state from URL on page load
export function initializeDemoStateFromUrl() {
    const config = parseDemoStateFromUrl();
    if (config) {
        demoState.setState(config.state!, config);
    }
}

// Demo state components
export const DemoStateComponents = {
    // Loading state component
    LoadingState: ({ message = "Loading..." }: { message?: string }) =>
        React.createElement('div', { className: "flex flex-col items-center justify-center p-8 space-y-4" },
            React.createElement('div', { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary" }),
            React.createElement('p', { className: "text-muted-foreground text-sm" }, message)
        ),

    // Empty state component
    EmptyState: ({
        title = "Nothing here yet",
        subtitle = "Check back later or try adjusting your filters",
        cta = "Find Events",
        onCtaClick
    }: {
        title?: string;
        subtitle?: string;
        cta?: string;
        onCtaClick?: () => void;
    }) =>
        React.createElement('div', { className: "flex flex-col items-center justify-center p-8 space-y-4 text-center" },
            React.createElement('div', { className: "w-16 h-16 rounded-full bg-muted flex items-center justify-center" },
                React.createElement('span', { className: "text-2xl" }, "😴")
            ),
            React.createElement('div', { className: "space-y-2" },
                React.createElement('h3', { className: "text-lg font-semibold" }, title),
                React.createElement('p', { className: "text-muted-foreground text-sm" }, subtitle)
            ),
            onCtaClick && React.createElement('button', {
                onClick: onCtaClick,
                className: "px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
            }, cta)
        ),

    // Error state component
    ErrorState: ({
        title = "Oops! Something went wrong",
        subtitle = "Please try again in a moment",
        cta = "Try Again",
        onCtaClick
    }: {
        title?: string;
        subtitle?: string;
        cta?: string;
        onCtaClick?: () => void;
    }) =>
        React.createElement('div', { className: "flex flex-col items-center justify-center p-8 space-y-4 text-center" },
            React.createElement('div', { className: "w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center" },
                React.createElement('span', { className: "text-2xl" }, "😅")
            ),
            React.createElement('div', { className: "space-y-2" },
                React.createElement('h3', { className: "text-lg font-semibold" }, title),
                React.createElement('p', { className: "text-muted-foreground text-sm" }, subtitle)
            ),
            onCtaClick && React.createElement('button', {
                onClick: onCtaClick,
                className: "px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
            }, cta)
        )
};

// Demo state controls (for development)
export const DemoStateControls = () => {
    const [currentState, setCurrentState] = React.useState(demoState.getState());

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentState(demoState.getState());
        }, 100);

        return () => clearInterval(interval);
    }, []);

    const handleStateChange = (state: DemoState) => {
        demoState.setState(state);
        setCurrentState(state);
    };

    if (process.env.NODE_ENV !== 'development') {
        return null;
    }

    return React.createElement('div', { className: "fixed bottom-20 right-4 z-50 bg-background border rounded-lg p-4 shadow-lg" },
        React.createElement('h4', { className: "font-semibold text-sm mb-2" }, "Demo States"),
        React.createElement('div', { className: "space-y-2" },
            (['normal', 'loading', 'empty', 'error'] as DemoState[]).map((state) =>
                React.createElement('button', {
                    key: state,
                    onClick: () => handleStateChange(state),
                    className: `w-full px-3 py-1 rounded text-xs font-medium ${currentState === state
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`
                }, state)
            ),
            React.createElement('button', {
                onClick: () => demoState.reset(),
                className: "w-full px-3 py-1 rounded text-xs font-medium bg-destructive text-destructive-foreground hover:bg-destructive/80"
            }, "Reset")
        )
    );
};