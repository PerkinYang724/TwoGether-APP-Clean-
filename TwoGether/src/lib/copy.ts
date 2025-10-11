// UX Copy & Microcopy for TwoGether
// Centralized copy management for easy iteration

export const COPY = {
    // App Branding
    APP_NAME: "TwoGether",
    TAGLINE: "Connect with Fellow Students",
    DESCRIPTION: "Find events, make friends, and carpool with university students",

    // Onboarding
    ONBOARDING: {
        WELCOME_TITLE: "Welcome to TwoGether! 🎓",
        WELCOME_SUBTITLE: "Let's get you connected with your campus community",
        CAMPUS_SELECT_TITLE: "What's your campus?",
        CAMPUS_SELECT_SUBTITLE: "We'll show you events happening around you",
        INTERESTS_TITLE: "What gets you excited?",
        INTERESTS_SUBTITLE: "Help us find events that match your vibe",
        SAFETY_TITLE: "Safety First",
        SAFETY_SUBTITLE: "We're committed to creating a safe space for everyone",
        SAFETY_PLEDGE: "I pledge to be respectful, inclusive, and kind to my fellow students",
        COMPLETE_TITLE: "You're all set! 🎉",
        COMPLETE_SUBTITLE: "Ready to find your first event?",
        COMPLETE_CTA: "Find your first event"
    },

    // Home/Swipe
    HOME: {
        HEADER_TITLE: "TwoGether",
        EMPTY_DECK_TITLE: "No more events! 😴",
        EMPTY_DECK_SUBTITLE: "Check back later for new events or adjust your filters",
        EMPTY_DECK_CTA: "Broaden Filters",
        SWIPE_HINTS: {
            LEFT: "Pass",
            RIGHT: "Join",
            UP: "Details",
            DOWN: "Share"
        },
        REWIND_BUTTON: "Rewind",
        JOIN_SUCCESS: "You're in! 🎉",
        SAVE_SUCCESS: "Event saved to your favorites! ❤️",
        SHARE_SUCCESS: "Event link copied to clipboard!"
    },

    // Event Details
    EVENT: {
        JOIN_BUTTON: "Join Event",
        SAVE_BUTTON: "Save",
        SHARE_BUTTON: "Share",
        DM_HOST_BUTTON: "Message Host",
        ADD_CALENDAR_BUTTON: "Add to Calendar",
        CARPOOL_PROMPT_TITLE: "Need a ride? 🚗",
        CARPOOL_PROMPT_SUBTITLE: "Find carpools for this event",
        CARPOOL_PROMPT_CTA: "Find Rides",
        HOST_RATING_LABEL: "Host Rating",
        ATTENDEES_LABEL: "Attendees",
        LOCATION_LABEL: "Location",
        TIME_LABEL: "Time",
        DESCRIPTION_LABEL: "About this event"
    },

    // Filters & Discover
    DISCOVER: {
        TITLE: "Discover Events",
        QUICK_FILTERS: {
            TODAY: "Today",
            WEEKEND: "Weekend",
            FREE: "Free",
            ACADEMIC: "Academic",
            SOCIAL: "Social",
            FITNESS: "Fitness",
            MUSIC: "Music",
            TECH: "Tech",
            VOLUNTEER: "Volunteer"
        },
        ADVANCED_FILTERS: {
            DISTANCE: "Distance",
            TIME_WINDOW: "Time Window",
            GROUP_SIZE: "Group Size",
            ACCESSIBILITY: "Accessibility",
            COST: "Cost"
        },
        RESULTS_COUNT: "{count} events found",
        NO_RESULTS_TITLE: "No events match your filters",
        NO_RESULTS_SUBTITLE: "Try adjusting your preferences",
        NO_RESULTS_CTA: "Reset Filters"
    },

    // Carpools
    CARPOOLS: {
        TITLE: "Carpools",
        FIND_TAB: "Find a Ride",
        OFFER_TAB: "Offer a Ride",
        FIND_TITLE: "Need a ride?",
        FIND_SUBTITLE: "Find carpools heading to your event",
        OFFER_TITLE: "Driving somewhere?",
        OFFER_SUBTITLE: "Help fellow students get to events",
        PICKUP_RADIUS: "Pickup Radius",
        SEATS_NEEDED: "Seats Needed",
        SEATS_AVAILABLE: "Seats Available",
        DEPARTURE_TIME: "Departure Time",
        ROUTE_PREVIEW: "Route Preview",
        MATCH_FOUND_TITLE: "Carpool match found! 🚗",
        MATCH_FOUND_SUBTITLE: "for '{eventTitle}'",
        DRIVER_PROFILE: "Driver Profile",
        MEETING_SPOT: "Meeting Spot",
        SAFETY_NOTES: "Safety Notes",
        REPORT_DRIVER: "Report Driver",
        VERIFIED_BADGE: "Verified Student"
    },

    // Ratings
    RATINGS: {
        TITLE: "Rate Your Experience",
        SUBTITLE: "Help the community by sharing your experience",
        STARS_LABEL: "Overall Experience",
        QUICK_TAGS: {
            FUN_CREW: "🌟 Fun Crew",
            CHILL: "🧊 Chill",
            ORGANIZED: "🧠 Organized",
            NO_SHOW: "🔇 No Show"
        },
        COMMENT_PLACEHOLDER: "Share your thoughts (optional)",
        COMMENT_LIMIT: "50 characters max",
        SUBMIT_BUTTON: "Submit Rating",
        SUCCESS_TITLE: "Thanks for rating! ⭐",
        SUCCESS_SUBTITLE: "Your feedback helps the community",
        ANTI_HARASSMENT: "Report inappropriate behavior",
        REPORT_LINK: "Report User"
    },

    // Inbox
    INBOX: {
        TITLE: "Inbox",
        THREADS_TITLE: "Conversations",
        EVENT_CHAT_PREFIX: "Event: ",
        CARPOOL_CHAT_PREFIX: "Carpool: ",
        DM_PREFIX: "DM: ",
        MESSAGE_PLACEHOLDER: "Type a message...",
        SEND_BUTTON: "Send",
        REACTIONS: {
            THUMBS_UP: "👍",
            HEART: "❤️",
            LAUGH: "😂",
            FIRE: "🔥"
        },
        RSVP_STICKERS: {
            ON_MY_WAY: "On my way! 🚶‍♀️",
            RUNNING_LATE: "Running late ⏰",
            CANT_MAKE_IT: "Can't make it 😔"
        },
        EMPTY_TITLE: "No messages yet",
        EMPTY_SUBTITLE: "Join events to start conversations",
        EMPTY_CTA: "Find Events"
    },

    // Profile
    PROFILE: {
        TITLE: "Profile",
        EDIT_BUTTON: "Edit Profile",
        SETTINGS_BUTTON: "Settings",
        STATS_TITLE: "Your Stats",
        BADGES_TITLE: "Badges",
        INTERESTS_TITLE: "Interests",
        PRIVACY_TITLE: "Privacy Settings",
        MY_EVENTS_TITLE: "My Events",
        MY_RIDES_TITLE: "My Rides",
        SAVED_EVENTS_TITLE: "Saved Events",
        BADGES: {
            NEWBIE: "Newbie",
            CONNECTOR: "Connector",
            HOST: "Host",
            LEGEND: "Legend"
        },
        PRIVACY_TOGGLES: {
            DISCOVERABLE: "Make me discoverable",
            SHOW_CLASS_YEAR: "Show class year",
            ALLOW_RIDE_REQUESTS: "Allow ride requests"
        }
    },

    // Settings
    SETTINGS: {
        TITLE: "Settings",
        NOTIFICATIONS_TITLE: "Notifications",
        PRIVACY_TITLE: "Privacy",
        SAFETY_TITLE: "Safety",
        ACCOUNT_TITLE: "Account",
        NOTIFICATION_TOGGLES: {
            NEW_EVENTS: "New events matching my interests",
            CARPOOL_MATCHES: "Carpool matches",
            MESSAGES: "New messages",
            RATINGS: "Rating reminders"
        },
        SAFETY_LINKS: {
            COMMUNITY_GUIDELINES: "Community Guidelines",
            REPORT_USER: "Report User",
            BLOCK_USER: "Block User",
            EMERGENCY_CONTACTS: "Emergency Contacts"
        }
    },

    // Notifications
    NOTIFICATIONS: {
        NEW_EVENT_MATCH: "A new event matches your vibe 🎧",
        CARPOOL_MATCH: "Carpool match found for '{eventTitle}'",
        RATING_REMINDER: "Rate your experience at '{eventTitle}'",
        NEW_MESSAGE: "New message from {senderName}",
        EVENT_REMINDER: "'{eventTitle}' starts in 1 hour",
        RIDE_CONFIRMED: "Your ride is confirmed! 🚗"
    },

    // Error States
    ERRORS: {
        GENERIC_TITLE: "Oops! Something went wrong",
        GENERIC_SUBTITLE: "Please try again in a moment",
        GENERIC_CTA: "Try Again",
        NETWORK_ERROR: "Check your connection",
        AUTH_ERROR: "Please sign in again",
        PERMISSION_ERROR: "Permission denied",
        NOT_FOUND: "Page not found",
        SERVER_ERROR: "Server error - we're fixing it!"
    },

    // Loading States
    LOADING: {
        EVENTS: "Finding events...",
        CARPOOLS: "Searching carpools...",
        MESSAGES: "Loading messages...",
        PROFILE: "Loading profile...",
        SAVING: "Saving...",
        SUBMITTING: "Submitting..."
    },

    // Accessibility
    A11Y: {
        SWIPE_LEFT: "Swipe left to pass on this event",
        SWIPE_RIGHT: "Swipe right to join this event",
        SWIPE_UP: "Swipe up for event details",
        SWIPE_DOWN: "Swipe down to share this event",
        JOIN_EVENT: "Join event button",
        SAVE_EVENT: "Save event button",
        SHARE_EVENT: "Share event button",
        CLOSE_MODAL: "Close modal",
        OPEN_FILTERS: "Open filters",
        SEND_MESSAGE: "Send message button",
        SUBMIT_RATING: "Submit rating button"
    },

    // Haptic Feedback Messages
    HAPTICS: {
        SWIPE_SUCCESS: "Swipe registered",
        JOIN_SUCCESS: "Event joined",
        SAVE_SUCCESS: "Event saved",
        MESSAGE_SENT: "Message sent",
        RATING_SUBMITTED: "Rating submitted",
        ERROR_OCCURRED: "Error occurred"
    }
} as const;

// Helper function to get copy with interpolation
export function getCopy(key: string, variables?: Record<string, string | number>): string {
    const keys = key.split('.');
    let value: any = COPY;

    for (const k of keys) {
        value = value?.[k];
    }

    if (typeof value !== 'string') {
        return key; // Fallback to key if not found
    }

    if (variables) {
        return value.replace(/\{(\w+)\}/g, (match, varName) => {
            return String(variables[varName] || match);
        });
    }

    return value;
}
