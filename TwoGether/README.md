# TwoGether 🎓 - Gen-Z University PWA

A production-ready Progressive Web App that lets university students discover events via Tinder-style swiping, find friends by interests, arrange carpools, and rate each other post-event with Uber-style stars.

## ✨ Features

### 🎯 Core Functionality
- **Tinder-style Swipe Interface**: Swipe through events with smooth animations and haptic feedback
- **Smart Event Discovery**: AI-powered recommendations based on interests and behavior
- **Carpool System**: Find rides or offer seats with safety features and ratings
- **Real-time Chat**: Event-based group chats and direct messaging
- **Rating System**: Post-event ratings with quick tags and comments
- **Profile Management**: Complete profiles with interests, badges, and privacy controls

### 🎨 Gen-Z UX Design
- **Mobile-First**: Optimized for mobile with bottom navigation and touch gestures
- **Dark Mode Default**: Modern dark theme with glassy cards and soft shadows
- **Micro-interactions**: Haptic feedback, confetti animations, and smooth transitions
- **Accessibility**: Full keyboard navigation, screen reader support, and focus management
- **PWA Features**: Installable, offline-capable, and app-like experience

### 🔧 Technical Features
- **Analytics Instrumentation**: PostHog-style event tracking with `data-ph-event` attributes
- **Demo States**: Built-in loading, empty, and error states for demos
- **Haptic Feedback**: Mobile vibration patterns for interactions
- **Type Safety**: Full TypeScript with Zod validation schemas
- **Performance**: Optimized with Next.js 14, Framer Motion, and TanStack Query

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript, Server Actions)
- **Styling**: Tailwind CSS + shadcn/ui + Lucide React icons
- **State Management**: TanStack Query for server state
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Authentication**: Supabase Auth (Email + OAuth)
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion + React Use Gesture
- **PWA**: next-pwa with offline caching
- **Analytics**: Custom analytics system (PostHog-ready)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Supabase account (optional for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd twogether
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional)
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎭 Demo Script

Follow this sequence to experience the full TwoGether UX:

### 1. Onboarding Flow (60 seconds)
```
1. Visit /onboarding
2. Click "Next" on welcome screen
3. Select "Stanford University" campus
4. Select 3+ interests (Study Groups, Sports, Tech)
5. Check safety pledge agreement
6. Click "Find your first event"
```

### 2. Home Swipe Experience
```
1. Swipe RIGHT on "Study Group for Midterm" → See confetti + "You're in! 🎉"
2. Swipe LEFT on "Basketball Game" → Event passes
3. Swipe UP on "Pizza Night" → Opens event details
4. Swipe DOWN on "Tech Meetup" → Shares event
5. Click "Rewind" button → Undo last swipe
6. Use keyboard arrows ← → ↑ ↓ for accessibility
```

### 3. Event Details & Actions
```
1. Click "View Details" on any event
2. Click "Join Event" → Success toast + haptic feedback
3. Click "Share" → Native share dialog or clipboard copy
4. Click "Save" → Event saved to favorites
5. Click "Message Host" → Opens chat thread
```

### 4. Carpool Experience
```
1. Navigate to "Carpools" tab
2. Switch between "Find a Ride" and "Offer a Ride"
3. Set pickup radius and seats needed
4. View carpool matches with driver profiles
5. Click "Request Ride" → Send message to driver
```

### 5. Rating System
```
1. After joining an event, wait for rating prompt
2. Rate 1-5 stars with haptic feedback
3. Select quick tags (🌟 Fun Crew, 🧊 Chill, etc.)
4. Add optional comment (50 chars max)
5. Submit rating → See updated profile stats
```

### 6. Chat & Messaging
```
1. Navigate to "Inbox" tab
2. View event threads and DMs
3. Send message with emoji reactions
4. Use RSVP stickers ("On my way! 🚶‍♀️")
5. Share location pins and photos
```

### 7. Profile & Settings
```
1. Navigate to "Profile" tab
2. Edit interests and vibe line
3. Toggle privacy settings
4. View badges and rating stats
5. Access safety and notification settings
```

### 8. Demo States Testing
```
1. Add ?demo=loading to URL → See loading state
2. Add ?demo=empty to URL → See empty state
3. Add ?demo=error to URL → See error state
4. Use demo controls (dev mode) to test states
```

## 📱 Mobile Experience

### Touch Gestures
- **Swipe Left**: Pass on event
- **Swipe Right**: Join event
- **Swipe Up**: View details
- **Swipe Down**: Share event
- **Long Press**: Additional options
- **Pinch**: Zoom (on maps)

### Haptic Feedback
- **Light Tap**: Selection, navigation
- **Medium Tap**: Button presses
- **Heavy Tap**: Important actions
- **Success Pattern**: Event joined, rating submitted
- **Error Pattern**: Failed actions

### PWA Features
- **Install**: Add to home screen
- **Offline**: Cached content and API responses
- **Push Notifications**: Event reminders and matches
- **App-like**: Standalone mode with custom splash

## 🎨 Design System

### Colors
- **Primary**: Indigo (#6366f1) - Main brand color
- **Secondary**: Gray (#6b7280) - Supporting elements
- **Success**: Green (#10b981) - Positive actions
- **Warning**: Yellow (#f59e0b) - Caution states
- **Error**: Red (#ef4444) - Error states

### Typography
- **Font**: Inter (primary), Plus Jakarta Sans (headings)
- **Scale**: 12px, 14px, 16px, 18px, 20px, 24px, 32px
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Spacing
- **Base**: 4px grid system
- **Touch Targets**: Minimum 44px
- **Padding**: 16px (mobile), 24px (desktop)
- **Gaps**: 8px, 12px, 16px, 24px, 32px

### Motion
- **Duration**: 180-240ms for interactions
- **Easing**: Spring animations with stiffness 360, damping 28
- **Transitions**: Smooth, purposeful, and delightful

## 🔍 Analytics Events

All primary actions are instrumented with analytics:

```typescript
// Onboarding
'onboard_start', 'onboard_campus_select', 'onboard_interests_select', 'onboard_safety_pledge', 'onboard_complete'

// Swipe Actions
'swipe_left', 'swipe_right', 'swipe_up', 'swipe_down', 'swipe_undo'

// Event Actions
'open_event_details', 'join_event', 'save_event', 'share_event', 'dm_host', 'add_to_calendar'

// Discovery
'open_filters', 'apply_filters', 'clear_filters', 'search_events'

// Carpool Actions
'open_carpools', 'create_carpool_offer', 'request_ride', 'accept_carpool_match', 'decline_carpool_match'

// Messaging
'open_inbox', 'send_message', 'add_reaction', 'use_rsvp_sticker'

// Ratings
'open_rating_modal', 'rate_user', 'submit_rating', 'report_user'

// Profile
'open_profile', 'edit_profile', 'update_interests', 'toggle_privacy', 'open_settings'
```

## 🧪 Testing & Demo States

### Demo State URLs
- `?demo=loading` - Show loading state
- `?demo=empty` - Show empty state  
- `?demo=error` - Show error state
- `?demo=normal` - Show normal state

### Development Controls
In development mode, you'll see demo state controls in the bottom-right corner to test different states without URL parameters.

### Accessibility Testing
- **Keyboard Navigation**: Tab through all interactive elements
- **Screen Reader**: Test with VoiceOver (iOS) or TalkBack (Android)
- **Focus Management**: Ensure focus rings are visible
- **Color Contrast**: Test with color blindness simulators

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy - Vercel will automatically build and deploy

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔧 Development

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   ├── swipe/            # Swipe interface
│   ├── events/           # Event components
│   ├── carpools/         # Carpool components
│   ├── chat/             # Chat components
│   └── profile/          # Profile components
├── lib/                   # Utilities and configurations
├── hooks/                 # Custom React hooks
└── stores/               # State management
```

### Key Components
- **SwipeDeck**: Main swipe interface with gestures and animations
- **EventCard**: Event display with actions and metadata
- **BottomNav**: Mobile navigation with haptic feedback
- **ConfettiBurst**: Celebration animations
- **RatingStars**: Interactive star rating system
- **Analytics**: Event tracking and instrumentation

### Custom Hooks
- **useAnalytics**: Track events and user behavior
- **useHaptics**: Trigger haptic feedback patterns
- **useDemoState**: Manage demo states for testing
- **useSwipeGestures**: Handle swipe interactions

## 🎯 Next Sprint Priorities

### Phase 1: Core Polish
1. **Enhanced Animations**: Add more micro-interactions and transitions
2. **Improved Accessibility**: Better screen reader support and keyboard navigation
3. **Performance Optimization**: Image optimization and code splitting
4. **Error Handling**: Better error boundaries and user feedback

### Phase 2: Advanced Features
1. **Real-time Updates**: WebSocket integration for live chat and notifications
2. **Advanced Filters**: More sophisticated event discovery algorithms
3. **Campus Integration**: University-specific features and partnerships
4. **Social Features**: Friend connections and social proof

### Phase 3: Scale & Growth
1. **Multi-campus Support**: Expand to multiple universities
2. **AI Recommendations**: Machine learning for better event matching
3. **Monetization**: Premium features and partnerships
4. **Analytics Dashboard**: Admin tools for campus management

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For questions, feedback, or support:
- **Email**: support@twogether.app
- **Discord**: [TwoGether Community](https://discord.gg/twogether)
- **Twitter**: [@TwoGetherApp](https://twitter.com/twogetherapp)

---

**Built with ❤️ for the university community**