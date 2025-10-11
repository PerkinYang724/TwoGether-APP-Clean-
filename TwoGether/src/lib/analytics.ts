// Analytics instrumentation for TwoGether
// PostHog-style event tracking with data-ph-event attributes

export type AnalyticsEvent =
    // Onboarding
    | 'onboard_start'
    | 'onboard_campus_select'
    | 'onboard_interests_select'
    | 'onboard_safety_pledge'
    | 'onboard_complete'

    // Swipe Actions
    | 'swipe_left'
    | 'swipe_right'
    | 'swipe_up'
    | 'swipe_down'
    | 'swipe_undo'

    // Event Actions
    | 'open_event_details'
    | 'join_event'
    | 'save_event'
    | 'share_event'
    | 'dm_host'
    | 'add_to_calendar'

    // Discovery
    | 'open_filters'
    | 'apply_filters'
    | 'clear_filters'
    | 'search_events'

    // Carpool Actions
    | 'open_carpools'
    | 'create_carpool_offer'
    | 'request_ride'
    | 'accept_carpool_match'
    | 'decline_carpool_match'
    | 'report_driver'

    // Messaging
    | 'open_inbox'
    | 'send_message'
    | 'add_reaction'
    | 'use_rsvp_sticker'

    // Ratings
    | 'open_rating_modal'
    | 'rate_user'
    | 'submit_rating'
    | 'report_user'

    // Profile
    | 'open_profile'
    | 'edit_profile'
    | 'update_interests'
    | 'toggle_privacy'
    | 'open_settings'

    // Navigation
    | 'navigate_to_discover'
    | 'navigate_to_carpools'
    | 'navigate_to_inbox'
    | 'navigate_to_profile'

    // Errors
    | 'error_occurred'
    | 'network_error'
    | 'auth_error';

export interface AnalyticsProperties {
    event_id?: string;
    user_id?: string;
    campus?: string;
    category?: string;
    distance?: number;
    time_window?: string;
    group_size?: number;
    cost?: number;
    rating?: number;
    tags?: string[];
    error_type?: string;
    error_message?: string;
    [key: string]: any;
}

// Analytics client stub - replace with actual PostHog implementation
class AnalyticsClient {
    private isEnabled = true;
    private events: Array<{ event: AnalyticsEvent; properties: AnalyticsProperties; timestamp: Date }> = [];

    identify(userId: string, properties?: Record<string, any>) {
        if (!this.isEnabled) return;
        console.log('Analytics: Identify', { userId, properties });
    }

    track(event: AnalyticsEvent, properties: AnalyticsProperties = {}) {
        if (!this.isEnabled) return;

        const eventData = {
            event,
            properties: {
                ...properties,
                timestamp: new Date().toISOString(),
                user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
                url: typeof window !== 'undefined' ? window.location.href : 'server',
            },
            timestamp: new Date()
        };

        this.events.push(eventData);
        console.log('Analytics: Track', eventData);

        // In production, send to PostHog
        // posthog.capture(event, properties);
    }

    page(pageName: string, properties?: Record<string, any>) {
        if (!this.isEnabled) return;
        console.log('Analytics: Page', { pageName, properties });
    }

    setEnabled(enabled: boolean) {
        this.isEnabled = enabled;
    }

    getEvents() {
        return this.events;
    }

    clearEvents() {
        this.events = [];
    }
}

export const analytics = new AnalyticsClient();

// Hook for easy analytics usage in components
export function useAnalytics() {
    const track = (event: AnalyticsEvent, properties?: AnalyticsProperties) => {
        analytics.track(event, properties);
    };

    const identify = (userId: string, properties?: Record<string, any>) => {
        analytics.identify(userId, properties);
    };

    const page = (pageName: string, properties?: Record<string, any>) => {
        analytics.page(pageName, properties);
    };

    return { track, identify, page };
}

// Utility function to add data-ph-event attributes to elements
export function addAnalyticsAttributes(
    element: React.ReactElement,
    event: AnalyticsEvent,
    properties?: AnalyticsProperties
): React.ReactElement {
    return React.cloneElement(element, {
        'data-ph-event': event,
        'data-ph-properties': properties ? JSON.stringify(properties) : undefined,
        ...element.props
    });
}

// Common analytics patterns
export const AnalyticsPatterns = {
    // Track button clicks
    trackButtonClick: (event: AnalyticsEvent, properties?: AnalyticsProperties) => {
        return {
            'data-ph-event': event,
            'data-ph-properties': properties ? JSON.stringify(properties) : undefined,
        };
    },

    // Track form submissions
    trackFormSubmit: (formName: string, properties?: AnalyticsProperties) => {
        return {
            'data-ph-event': 'form_submit' as AnalyticsEvent,
            'data-ph-properties': JSON.stringify({
                form_name: formName,
                ...properties
            }),
        };
    },

    // Track navigation
    trackNavigation: (destination: string, properties?: AnalyticsProperties) => {
        return {
            'data-ph-event': 'navigate' as AnalyticsEvent,
            'data-ph-properties': JSON.stringify({
                destination,
                ...properties
            }),
        };
    },

    // Track errors
    trackError: (errorType: string, errorMessage: string, properties?: AnalyticsProperties) => {
        return {
            'data-ph-event': 'error_occurred' as AnalyticsEvent,
            'data-ph-properties': JSON.stringify({
                error_type: errorType,
                error_message: errorMessage,
                ...properties
            }),
        };
    }
};

// Demo mode for testing analytics
export function enableAnalyticsDemo() {
    analytics.setEnabled(true);
    console.log('Analytics demo mode enabled');
}

export function disableAnalyticsDemo() {
    analytics.setEnabled(false);
    console.log('Analytics demo mode disabled');
}

export function getAnalyticsEvents() {
    return analytics.getEvents();
}

export function clearAnalyticsEvents() {
    analytics.clearEvents();
}