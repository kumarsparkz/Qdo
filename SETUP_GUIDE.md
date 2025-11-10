# Quadrant Todo - Complete Setup Guide

This guide will walk you through setting up the Quadrant Todo application from scratch.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Supabase Setup](#supabase-setup)
3. [Google OAuth Setup](#google-oauth-setup)
4. [Local Development Setup](#local-development-setup)
5. [Vercel Deployment](#vercel-deployment)
6. [Mobile App Setup](#mobile-app-setup)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have:

- Node.js 18 or higher installed
- npm or yarn package manager
- A GitHub account (for version control and Vercel deployment)
- A Google account (for OAuth and user authentication)
- Basic knowledge of React and Next.js

## Supabase Setup

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub
4. Click "New Project"
5. Fill in the project details:
   - **Name**: quadrant-todo (or your preferred name)
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose the closest to your users
6. Click "Create new project"
7. Wait 2-3 minutes for the project to be ready

### Step 2: Run Database Schema

1. In your Supabase project dashboard, go to the **SQL Editor**
2. Click "New query"
3. Copy the entire contents of \`supabase/schema.sql\` from this repository
4. Paste it into the SQL editor
5. Click "Run" or press Ctrl+Enter
6. You should see "Success. No rows returned" - this is good!

### Step 3: Verify Database Tables

1. Go to **Table Editor** in the left sidebar
2. You should see two tables:
   - \`projects\`
   - \`tasks\`
3. Click on each table to verify the columns match the schema

### Step 4: Get Supabase Credentials

1. Go to **Settings** → **API**
2. Find and copy these values:
   - **Project URL** (looks like: https://xxxxx.supabase.co)
   - **anon public** key (under "Project API keys")
3. Save these - you'll need them soon!

## Google OAuth Setup

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. If prompted, configure the OAuth consent screen:
   - User Type: **External**
   - App name: **Quadrant Todo**
   - User support email: Your email
   - Developer contact: Your email
   - Click **Save and Continue**
   - Scopes: Click **Save and Continue** (no need to add scopes)
   - Test users: Add your email if in testing mode
   - Click **Save and Continue**
6. Create OAuth client ID:
   - Application type: **Web application**
   - Name: **Quadrant Todo**
   - Authorized redirect URIs:
     - \`http://localhost:3000/auth/callback\` (for local development)
     - \`https://YOUR-DOMAIN.vercel.app/auth/callback\` (add after Vercel deployment)
7. Click **Create**
8. Copy the **Client ID** and **Client Secret**

### Step 2: Configure Supabase Authentication

1. In your Supabase project, go to **Authentication** → **Providers**
2. Find **Google** and click on it
3. Enable Google provider
4. Paste your Google **Client ID** and **Client Secret**
5. Under "Authorized Client IDs", add your Client ID
6. Click **Save**

### Step 3: Configure Redirect URLs

1. Still in Authentication section, go to **URL Configuration**
2. Add your site URLs:
   - **Site URL**: \`http://localhost:3000\` (for development)
   - **Redirect URLs**:
     - \`http://localhost:3000/auth/callback\`
     - \`https://YOUR-DOMAIN.vercel.app/auth/callback\` (add after deployment)

## Email Authentication Setup

Email authentication is enabled by default in Supabase and works out of the box! No additional configuration needed.

### Email Auth Features

1. **Sign Up**: Users can create accounts with email and password
2. **Email Confirmation**: New users receive a confirmation email (configurable)
3. **Sign In**: Existing users can sign in with their credentials
4. **Password Requirements**: Minimum 6 characters (enforced)

### Optional: Configure Email Settings

1. In Supabase, go to **Authentication** → **Email Templates**
2. Customize the confirmation email template (optional)
3. Go to **Authentication** → **Settings**
4. Configure email settings:
   - **Enable email confirmations**: Toggle based on your needs
   - **Enable email change confirmations**: Recommended to keep enabled
   - **Secure email change**: Recommended to keep enabled

### For Production

1. Configure SMTP settings in **Project Settings** → **Auth** → **SMTP Settings**
2. Add your own email service (SendGrid, Mailgun, etc.) for better deliverability
3. Or keep using Supabase's built-in email service (limited to development)

## Local Development Setup

### Step 1: Clone and Install

\`\`\`bash
# Clone the repository
git clone <your-repo-url>
cd todo-list

# Install dependencies
npm install
\`\`\`

### Step 2: Configure Environment Variables

\`\`\`bash
# Copy the example env file
cp .env.example .env.local
\`\`\`

Edit \`.env.local\` with your credentials:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
\`\`\`

### Step 3: Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 4: Test Authentication

1. Click "Sign in with Google"
2. Select your Google account
3. Grant permissions
4. You should be redirected to the home page

### Step 5: Create Your First Project and Task

1. Click "Create Project First"
2. Enter a project name (e.g., "Work Tasks")
3. Create a task:
   - Title: "Test Task"
   - Select urgency, importance, and priority
   - Click "Create Task"
4. Your task should appear in the appropriate quadrant!

## Vercel Deployment

### Step 1: Push to GitHub

\`\`\`bash
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
\`\`\`

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: npm run build
   - **Output Directory**: .next

### Step 3: Add Environment Variables

In Vercel project settings, add these environment variables:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
\`\`\`

### Step 4: Deploy

1. Click "Deploy"
2. Wait for deployment to complete (1-2 minutes)
3. Click on the deployment URL to test

### Step 5: Update OAuth Redirect URLs

1. Go back to Google Cloud Console
2. Add your Vercel URL to authorized redirect URIs:
   - \`https://your-app.vercel.app/auth/callback\`
3. Go to Supabase → Authentication → URL Configuration
4. Add your Vercel URL to redirect URLs

### Step 6: Test Production

1. Visit your Vercel URL
2. Sign in with Google
3. Create projects and tasks
4. Everything should work!

## Mobile App Setup

### Step 1: Install Dependencies

\`\`\`bash
cd mobile
npm install
\`\`\`

### Step 2: Configure Environment

\`\`\`bash
cp .env.example .env
\`\`\`

Edit \`.env\`:

\`\`\`env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
\`\`\`

### Step 3: Run on Simulator

\`\`\`bash
# iOS
npm run ios

# Android
npm run android

# Or start dev server
npm start
\`\`\`

### Step 4: Build for Production

Install EAS CLI:

\`\`\`bash
npm install -g eas-cli
eas login
eas build:configure
\`\`\`

Build for iOS:

\`\`\`bash
eas build --platform ios
\`\`\`

Build for Android:

\`\`\`bash
eas build --platform android
\`\`\`

## Troubleshooting

### Issue: "Invalid login credentials"

**Solution**:
- Check that Google OAuth is properly configured in Supabase
- Verify redirect URLs match exactly
- Clear browser cache and try again

### Issue: "Failed to fetch"

**Solution**:
- Check environment variables are correct
- Verify Supabase project is running
- Check browser console for CORS errors

### Issue: Tasks not appearing

**Solution**:
- Verify database schema is correctly applied
- Check browser console for errors
- Ensure Row Level Security policies are active

### Issue: "Session not found"

**Solution**:
- Clear browser cookies
- Log out and log back in
- Check Supabase Auth settings

### Issue: Vercel deployment fails

**Solution**:
- Check build logs for errors
- Verify all environment variables are set
- Ensure Node.js version is 18+

### Issue: Mobile app won't build

**Solution**:
- Run \`npm install\` in mobile directory
- Clear Expo cache: \`expo start -c\`
- Update Expo: \`npm install expo@latest\`

## Need Help?

If you're still stuck:

1. Check the [main README](README.md) for more information
2. Look at existing [GitHub Issues](../../issues)
3. Create a new issue with:
   - What you were trying to do
   - What happened instead
   - Error messages (if any)
   - Your environment (OS, Node version, etc.)

## Security Best Practices

1. **Never commit** \`.env\` or \`.env.local\` files
2. **Rotate secrets** if accidentally exposed
3. **Use environment variables** for all sensitive data
4. **Enable MFA** on Supabase and Vercel accounts
5. **Review Row Level Security** policies regularly

## Next Steps

Once everything is working:

1. Customize the UI to your preferences
2. Add more features (see Roadmap in README)
3. Invite team members to collaborate
4. Set up analytics (optional)
5. Configure custom domain (optional)

Happy task managing! 🚀
