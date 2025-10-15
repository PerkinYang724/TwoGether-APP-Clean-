# TwoGether - Backend Setup & Deployment Guide

## Overview
This guide will help you set up the Supabase backend and deploy to Vercel with seed data.

## Prerequisites
- Supabase account and project
- Vercel account
- Node.js 18+ installed

## Step 1: Supabase Setup

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and anon key from Settings > API

### 1.2 Set up Database Schema
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Run the SQL script to create all tables, indexes, and RLS policies

### 1.3 Configure Authentication
1. Go to Authentication > Settings
2. Enable Email authentication
3. Configure your site URL (use `http://localhost:3000` for development)

## Step 2: Environment Variables

### 2.1 Local Development
Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 2.2 Production (Vercel)
Add these environment variables in your Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL` (your Vercel domain)

## Step 3: Seed Data

### 3.1 Run Seed Script
```bash
npm run seed:new
```

This will create:
- 50 user profiles across different campuses
- 100 events across all categories
- Event attendees and relationships
- Carpool data and requests
- Ratings and reviews

### 3.2 Verify Data
Check your Supabase dashboard to ensure data was created successfully.

## Step 4: Deploy to Vercel

### 4.1 Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Vercel will auto-detect Next.js settings

### 4.2 Configure Environment Variables
Add all environment variables from Step 2.2 in the Vercel dashboard.

### 4.3 Deploy
1. Click "Deploy" in Vercel
2. Wait for deployment to complete
3. Update your Supabase site URL to your Vercel domain

## Step 5: Post-Deployment

### 5.1 Update Supabase Settings
1. Go to Authentication > Settings in Supabase
2. Update Site URL to your Vercel domain
3. Add your Vercel domain to allowed origins

### 5.2 Test Deployment
1. Visit your Vercel URL
2. Test authentication (sign up/sign in)
3. Test event browsing and joining
4. Verify all functionality works

## File Structure

```
src/
├── lib/
│   ├── env.ts              # Environment validation
│   ├── supabase.ts         # Supabase client setup
│   ├── schemas.ts           # Zod schemas for validation
│   ├── auth.tsx            # Authentication context
│   └── hooks.ts            # React Query hooks
├── app/
│   ├── api/                # API routes
│   │   ├── profile/        # Profile CRUD
│   │   └── events/         # Event CRUD
│   ├── page-new.tsx        # New homepage with real data
│   └── providers.tsx       # Updated with AuthProvider
├── components/
│   └── AuthForm.tsx        # Authentication form
scripts/
├── seed-new.ts             # Comprehensive seed script
supabase-schema.sql         # Database schema
vercel.json                 # Vercel configuration
```

## Key Features Implemented

### Authentication
- Email/password authentication
- User profile creation
- Session management
- Protected routes

### Events
- Event creation and management
- Event browsing with filters
- Join/leave events
- Real-time attendee counts

### Database
- Row Level Security (RLS)
- Optimized indexes
- Automatic triggers
- Data validation

### API
- RESTful API endpoints
- Error handling
- Data validation with Zod
- Type safety

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Check `.env.local` file exists
   - Restart development server
   - Verify variable names match exactly

2. **Database Connection Issues**
   - Verify Supabase URL and keys
   - Check RLS policies
   - Ensure tables exist

3. **Authentication Not Working**
   - Check Supabase auth settings
   - Verify site URL configuration
   - Check browser console for errors

4. **Deployment Issues**
   - Verify all environment variables in Vercel
   - Check build logs for errors
   - Ensure database schema is deployed

### Getting Help
- Check Supabase documentation
- Review Vercel deployment logs
- Check browser console for client-side errors
- Verify API endpoints with network tab

## Next Steps

After successful deployment:
1. Test all functionality thoroughly
2. Set up monitoring and analytics
3. Configure custom domain (optional)
4. Set up automated backups
5. Plan for scaling and optimization
