# Flow Focus — Pomodoro PWA

A modern, offline-first Pomodoro app you can install and use anywhere, with optional cloud sync via Supabase.

## Features

- ✅ **PWA capabilities** (offline, installable, notifications)
- ✅ **Local-first data** with IndexedDB support
- ✅ **Cloud sync** with Supabase (optional)
- ✅ **User authentication** (Google OAuth + Email/Password)
- ✅ **Session tracking** and productivity stats
- ✅ **Beautiful dark theme** with smooth animations
- ✅ **Responsive design** that works on all devices

## Quickstart

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open `http://localhost:5173`.

## Supabase Setup (Optional)

Your Supabase credentials are already configured! To enable cloud sync:

### 1. Set up the database schema

Go to your [Supabase Dashboard](https://supabase.com/dashboard) → SQL Editor and run:

```sql
-- Enable Row Level Security and basic tables
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz default now()
);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  started_at timestamptz not null,
  ended_at timestamptz,
  phase text check (phase in ('focus','short_break','long_break')) not null,
  minutes integer not null default 0
);

alter table profiles enable row level security;
alter table sessions enable row level security;

create policy "own profile" on profiles for all using (auth.uid() = id);
create policy "own sessions" on sessions for all using (auth.uid() = user_id);
```

### 2. Enable Authentication

In your Supabase Dashboard → Authentication → Providers:

- **Enable Google OAuth** (recommended)
- **Enable Email/Password** authentication

### 3. Configure Google OAuth (optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add your domain to authorized origins
6. Copy Client ID and Secret to Supabase Auth settings

## Build & Deploy

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Deploy to Vercel

1. Import your repo to Vercel
2. Set project type to "Vite"
3. Add environment variables from `.env`
4. Deploy!

### Deploy to Netlify

1. Connect your repo to Netlify
2. Set build command: `pnpm build`
3. Set publish directory: `dist`
4. Add environment variables
5. Deploy!

## Usage

### Local Mode (No Sign-in)
- Works completely offline
- Data stored locally in browser
- Perfect for privacy-focused users

### Cloud Sync Mode (With Sign-in)
- Sign in with Google or email/password
- Sessions sync across devices
- View detailed productivity analytics
- Data persists even if you clear browser data

### Keyboard Shortcuts
- **Space** → Start/Pause timer
- **R** → Reset current phase
- **1/2/3** → Switch to Focus/Short Break/Long Break

## PWA Features

- **Installable**: Add to home screen on mobile/desktop
- **Offline**: Works without internet connection
- **Notifications**: Get notified when phases complete
- **Auto-updates**: App updates automatically in background

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** for fast development and building
- **Tailwind CSS** + **Framer Motion** for UI
- **Supabase** for authentication and cloud sync
- **IndexedDB** for local data storage
- **Workbox** for PWA features

## License

MIT
