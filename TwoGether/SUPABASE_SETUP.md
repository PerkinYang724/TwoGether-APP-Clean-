# Supabase Setup Instructions

## Current Status
Your app is currently running in **demo mode** because Supabase credentials are not configured.

## To Enable Real Supabase Authentication:

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be set up (usually takes 1-2 minutes)

### 2. Get Your Credentials
1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

### 3. Create Environment File
Create a file called `.env.local` in your project root with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Set Up Database Schema
1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql` from your project
3. Paste and run the SQL script to create all tables

### 5. Configure Authentication
1. Go to **Authentication** > **Settings** in Supabase
2. Enable **Email** authentication
3. Set **Site URL** to `http://localhost:3000`
4. Add `http://localhost:3000` to **Redirect URLs**

### 6. Restart Your App
```bash
npm run dev
```

## What This Enables:
- ✅ Real user authentication with Supabase
- ✅ User data stored in Supabase database
- ✅ Persistent sessions across browser refreshes
- ✅ Real-time data synchronization
- ✅ Secure user profiles and event management

## Current Demo Mode Features:
- 🔄 Mock authentication (any email/password works)
- 🔄 Data stored in browser localStorage only
- 🔄 No real database persistence
- 🔄 Limited to single browser session

## Need Help?
Check the browser console for detailed setup instructions and configuration status.
