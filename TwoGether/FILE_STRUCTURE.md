# TwoGether - Complete File Structure

```
src/
├── app/                           # Next.js App Router
│   ├── (auth)/                   # Auth route group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   ├── callback/
│   │   │   └── page.tsx
│   │   └── onboarding/
│   │       ├── page.tsx
│   │       ├── interests/
│   │       │   └── page.tsx
│   │       └── safety/
│   │           └── page.tsx
│   ├── (main)/                   # Main app route group
│   │   ├── page.tsx              # Home (Swipe Deck)
│   │   ├── discover/
│   │   │   └── page.tsx
│   │   ├── carpools/
│   │   │   ├── page.tsx
│   │   │   ├── find/
│   │   │   │   └── page.tsx
│   │   │   └── offer/
│   │   │       └── page.tsx
│   │   ├── inbox/
│   │   │   ├── page.tsx
│   │   │   └── [threadId]/
│   │   │       └── page.tsx
│   │   ├── profile/
│   │   │   ├── page.tsx
│   │   │   ├── edit/
│   │   │   │   └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   ├── events/
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       ├── chat/
│   │   │       │   └── page.tsx
│   │   │       └── rate/
│   │   │           └── page.tsx
│   │   └── settings/
│   │       ├── page.tsx
│   │       ├── privacy/
│   │       │   └── page.tsx
│   │       └── notifications/
│   │           └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── providers.tsx
├── components/                    # Reusable Components
│   ├── ui/                       # Base UI Components
│   │   ├── avatar.tsx
│   │   ├── avatar-stack.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── confetti-burst.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── map-preview.tsx
│   │   ├── modal.tsx
│   │   ├── rating-stars.tsx
│   │   ├── sheet.tsx
│   │   ├── slider.tsx
│   │   ├── tag.tsx
│   │   ├── textarea.tsx
│   │   ├── toast.tsx
│   │   └── tooltip.tsx
│   ├── layout/                   # Layout Components
│   │   ├── bottom-nav.tsx
│   │   ├── header.tsx
│   │   ├── campus-pill.tsx
│   │   └── filter-chips.tsx
│   ├── swipe/                    # Swipe Interface
│   │   ├── swipe-deck.tsx
│   │   ├── event-card.tsx
│   │   ├── swipe-gestures.tsx
│   │   └── undo-button.tsx
│   ├── events/                    # Event Components
│   │   ├── event-details.tsx
│   │   ├── event-list.tsx
│   │   ├── event-filters.tsx
│   │   ├── host-profile.tsx
│   │   └── attendee-list.tsx
│   ├── carpools/                 # Carpool Components
│   │   ├── carpool-tabs.tsx
│   │   ├── find-ride.tsx
│   │   ├── offer-ride.tsx
│   │   ├── carpool-match-card.tsx
│   │   └── route-preview.tsx
│   ├── chat/                     # Chat Components
│   │   ├── chat-thread.tsx
│   │   ├── message-bubble.tsx
│   │   ├── message-input.tsx
│   │   └── reaction-picker.tsx
│   ├── profile/                  # Profile Components
│   │   ├── profile-header.tsx
│   │   ├── interest-chips.tsx
│   │   ├── rating-display.tsx
│   │   ├── badge-collection.tsx
│   │   └── privacy-toggles.tsx
│   ├── onboarding/               # Onboarding Components
│   │   ├── onboarding-stepper.tsx
│   │   ├── campus-selector.tsx
│   │   ├── interest-picker.tsx
│   │   └── safety-pledge.tsx
│   ├── forms/                    # Form Components
│   │   ├── form-field.tsx
│   │   ├── validation-helpers.tsx
│   │   └── form-submit-button.tsx
│   └── feedback/                  # Feedback Components
│       ├── empty-state.tsx
│       ├── loading-state.tsx
│       ├── error-boundary.tsx
│       └── success-toast.tsx
├── lib/                          # Utilities & Config
│   ├── analytics.ts              # Analytics instrumentation
│   ├── copy.ts                   # UX copy & microcopy
│   ├── constants.ts              # App constants
│   ├── demo-states.ts            # Demo state utilities
│   ├── haptics.ts                # Haptic feedback hooks
│   ├── schemas.ts                # Zod schemas (enhanced)
│   ├── supabase.ts               # Supabase client
│   ├── supabase-client.ts        # Client-side Supabase
│   ├── supabase-server.ts        # Server-side Supabase
│   ├── types.ts                  # TypeScript types
│   ├── utils.ts                  # Utility functions
│   └── validation.ts             # Form validation
├── hooks/                        # Custom Hooks
│   ├── use-analytics.ts
│   ├── use-demo-state.ts
│   ├── use-haptics.ts
│   ├── use-local-storage.ts
│   ├── use-swipe-gestures.ts
│   └── use-toast.ts
├── stores/                       # State Management
│   ├── auth-store.ts
│   ├── event-store.ts
│   ├── filter-store.ts
│   └── ui-store.ts
└── styles/                       # Additional Styles
    ├── animations.css
    ├── haptics.css
    └── mobile.css
```

## Key Enhancements Made:

### 1. **Enhanced File Organization**
- Route groups for better organization
- Component categorization by feature
- Dedicated hooks and stores directories
- Centralized styles and utilities

### 2. **New Core Components**
- `ConfettiBurst` - Celebration animations
- `RatingStars` - Interactive star ratings
- `MapPreview` - Stubbed map component
- `AvatarStack` - User avatar collections
- `CampusPill` - Campus selector
- `FilterChips` - Quick filter interface

### 3. **Enhanced Pages**
- Complete onboarding flow
- Dedicated carpool find/offer pages
- Enhanced profile with settings
- Thread-based inbox
- Event rating system

### 4. **New Utilities**
- Analytics instrumentation
- Haptic feedback system
- Demo state management
- Enhanced validation
- UX copy management

### 5. **Mobile-First Features**
- Safe area handling
- Touch gesture optimization
- Haptic feedback integration
- PWA enhancements
- Mobile-specific styles
