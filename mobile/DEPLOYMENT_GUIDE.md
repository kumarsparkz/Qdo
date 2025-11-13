# Mobile App Production Deployment Guide

Complete guide to deploying Quadrant Todo mobile apps to iOS App Store and Google Play Store.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Environment Configuration](#environment-configuration)
4. [App Assets](#app-assets)
5. [Local Development](#local-development)
6. [Production Builds](#production-builds)
7. [Store Submission](#store-submission)
8. [Post-Deployment](#post-deployment)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts

1. **Expo Account** (Free)
   - Sign up at: https://expo.dev
   - Install EAS CLI: `npm install -g eas-cli`
   - Login: `eas login`

2. **Apple Developer Account** ($99/year)
   - Required for iOS App Store
   - Sign up at: https://developer.apple.com
   - Complete payment and agreements

3. **Google Play Developer Account** ($25 one-time)
   - Required for Google Play Store
   - Sign up at: https://play.google.com/console
   - Complete payment and verification

4. **Supabase Project**
   - Already configured in your web app
   - Get URL and anon key from: https://supabase.com/dashboard

### Required Software

- **Node.js** 18+ and npm
- **Git**
- **EAS CLI**: `npm install -g eas-cli`
- **Expo Go** app (for testing)
  - iOS: Download from App Store
  - Android: Download from Play Store

### Optional (for local builds)

- **Xcode** 14+ (Mac only, for iOS)
- **Android Studio** (for Android)

---

## Initial Setup

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. Configure EAS Project

```bash
# Login to Expo
eas login

# Configure EAS Build
eas build:configure
```

When prompted:
- Select your Expo account
- Choose "All" for platforms
- Confirm configuration

### 3. Get EAS Project ID

After configuration, `app.json` will be updated with your project ID:

```json
{
  "extra": {
    "eas": {
      "projectId": "your-actual-project-id"
    }
  }
}
```

---

## Environment Configuration

### 1. Create Environment File

```bash
cp .env.example .env
```

### 2. Fill in Supabase Credentials

Edit `.env`:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Where to find these values:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Settings → API
4. Copy "Project URL" and "anon public" key

### 3. Verify Configuration

```bash
# Test the app locally
npm start

# Scan QR code with Expo Go app
# Try logging in to verify Supabase connection
```

---

## App Assets

### Required Assets

You must create these assets before production builds:

1. **`assets/icon.png`** - 1024×1024px
2. **`assets/splash.png`** - 1242×2688px
3. **`assets/adaptive-icon.png`** - 1024×1024px (Android)
4. **`assets/favicon.png`** - 48×48px (Web)

### Quick Asset Creation

**Option 1: Use Figma Template**
1. Go to https://figma.com
2. Create 1024×1024 canvas
3. Design a 4-quadrant icon representing the app
4. Export as PNG

**Option 2: Use Canva**
1. Go to https://canva.com
2. Search "App Icon" template
3. Customize with your brand colors
4. Download all required sizes

**Option 3: Hire on Fiverr**
- Budget: $10-50
- Search: "mobile app icon design"
- Provide brand guidelines

### Design Guidelines

- **Icon**: Simple, recognizable, works at small sizes
- **Colors**: Use brand colors (#6366f1 primary)
- **Splash**: Clean, minimal, centered logo/icon
- **Safe Zone**: Keep important content in center 66%

See `ASSETS_GUIDE.md` for detailed specifications.

---

## Local Development

### Start Development Server

```bash
npm start
```

This opens Expo DevTools. Options:

1. **Scan QR code** with Expo Go app (easiest)
2. **Press 'a'** for Android emulator
3. **Press 'i'** for iOS simulator (Mac only)
4. **Press 'w'** for web browser

### Development Workflow

```bash
# Run on Android device/emulator
npm run android

# Run on iOS simulator (Mac only)
npm run ios

# Run in web browser
npm run web
```

### Hot Reload

- Save any file to see changes instantly
- Shake device to open developer menu
- Enable "Fast Refresh" for instant updates

---

## Production Builds

### 1. Android Production Build

```bash
# Build APK for testing
npm run build:android

# Or use script directly
cd scripts
./deploy-android.sh
```

**What happens:**
- EAS CLI connects to Expo servers
- Cloud builds Android App Bundle (.aab)
- Takes 10-20 minutes
- Download from Expo dashboard

**Build profiles** (from `eas.json`):
- `production`: App Bundle for Play Store
- `production-aab`: Same as production
- `preview`: APK for testing (not for store)

### 2. iOS Production Build

```bash
# Build for App Store
npm run build:ios

# Or use script directly
cd scripts
./deploy-ios.sh
```

**What happens:**
- EAS CLI connects to Expo servers
- Cloud builds iOS app (.ipa)
- Takes 15-30 minutes
- Download from Expo dashboard

**Requirements:**
- Apple Developer account
- Will prompt for Apple ID credentials
- Creates distribution certificates automatically

### 3. Build Both Platforms

```bash
# Build iOS and Android simultaneously
npm run build:all

# Or use script directly
cd scripts
./deploy-all.sh
```

### Monitoring Builds

```bash
# Check build status
eas build:list

# View specific build
eas build:view [build-id]

# View on dashboard
# https://expo.dev/accounts/[your-account]/projects/quadrant-todo/builds
```

---

## Store Submission

### Android (Google Play Store)

#### Initial Setup (One-time)

1. **Create Google Play Developer Account**
   - Go to https://play.google.com/console
   - Pay $25 registration fee
   - Complete verification

2. **Create App in Console**
   - Click "Create app"
   - Fill in app details:
     - Name: "Quadrant Todo"
     - Language: English (or primary)
     - App/Game: App
     - Free/Paid: Free
   - Accept declarations

3. **Set up Store Listing**
   - Short description (80 chars)
   - Full description (4000 chars)
   - Upload app icon (512×512)
   - Upload screenshots (2-8)
   - Upload feature graphic (1024×500)
   - Add category, contact info

4. **Create Service Account (for automated submission)**

   ```bash
   # Follow guide:
   # https://github.com/expo/fyi/blob/main/creating-google-service-account.md
   ```

   - Save JSON key as `google-play-service-account.json`
   - **NEVER commit this file to git!**
   - Add to `.gitignore`

#### Submit to Play Store

**Option 1: Automated (Recommended)**

```bash
# Submit latest build
npm run submit:android

# Or manually
eas submit --platform android --latest
```

**Option 2: Manual**

1. Download .aab from Expo dashboard
2. Go to Play Console → Production
3. Create new release
4. Upload .aab file
5. Fill release notes
6. Submit for review

#### Release Tracks

- **Internal**: Testing (up to 100 testers)
- **Closed**: Beta testing (invite-only)
- **Open**: Public beta
- **Production**: Public release

**First submission:**
Start with Internal → Closed → Production

#### Review Process

- Initial review: 7-14 days
- Updates: 1-3 days
- Check status in Play Console
- Respond to reviewer questions promptly

### iOS (App Store)

#### Initial Setup (One-time)

1. **Create App Store Connect Account**
   - Sign in at: https://appstoreconnect.apple.com
   - Use Apple Developer account

2. **Create App**
   - Click "+" → "New App"
   - Platform: iOS
   - Name: "Quadrant Todo"
   - Primary Language: English
   - Bundle ID: `com.quadranttodo.app`
   - SKU: `quadrant-todo-001`

3. **Configure App Information**
   - Category: Productivity
   - Subcategory: Task Management
   - Age rating: 4+
   - Privacy policy URL (if you have one)

4. **Prepare Store Listing**
   - App description (4000 chars)
   - Keywords (100 chars, comma-separated)
   - Support URL
   - Marketing URL (optional)
   - Screenshots (see ASSETS_GUIDE.md)
   - App icon (automatically from build)

5. **Get Apple Credentials**

   Update `eas.json` with your details:
   ```json
   {
     "submit": {
       "production": {
         "ios": {
           "appleId": "your-apple-id@example.com",
           "ascAppId": "YOUR_APP_STORE_CONNECT_APP_ID",
           "appleTeamId": "YOUR_APPLE_TEAM_ID"
         }
       }
     }
   }
   ```

   **Where to find:**
   - Apple ID: Your login email
   - ASC App ID: App Store Connect → App → App Information
   - Team ID: Developer Account → Membership

#### Submit to App Store

**Option 1: Automated (Recommended)**

```bash
# Submit latest build
npm run submit:ios

# Or manually
eas submit --platform ios --latest
```

When prompted:
- Enter Apple ID password
- Handle 2FA if enabled
- Confirm submission

**Option 2: Manual**

1. Download .ipa from Expo dashboard
2. Use Transporter app (Mac)
3. Drag .ipa to Transporter
4. Wait for upload
5. Go to App Store Connect
6. Select build for release
7. Submit for review

#### TestFlight (Optional)

Before production, test with TestFlight:

1. Build automatically goes to TestFlight
2. Add internal testers (up to 100)
3. Add external testers (up to 10,000)
4. Get feedback before store release

#### Review Process

- Initial review: 24-48 hours
- Updates: Similar timeframe
- Rejection rate: ~20-30% first time
- Common reasons:
  - Missing features
  - Privacy issues
  - UI bugs
  - Metadata errors

**Tips for approval:**
- Test thoroughly before submission
- Provide demo account if needed
- Write clear app description
- Respond to reviewers quickly

---

## Post-Deployment

### Monitor Your App

1. **App Store Connect** (iOS)
   - Sales and trends
   - Crash reports
   - User reviews
   - Analytics

2. **Google Play Console** (Android)
   - Statistics
   - Crash reports
   - ANR (App Not Responding)
   - User reviews

3. **Expo Dashboard**
   - Build history
   - Update deployments
   - Error tracking

### Responding to Reviews

- Reply within 24-48 hours
- Be professional and helpful
- Thank users for feedback
- Explain fixes in updates

### Pushing Updates

```bash
# Make code changes
# Update version in app.json:
# "version": "1.0.1"
# "ios.buildNumber": "2"
# "android.versionCode": 2

# Build new versions
npm run build:all

# Submit updates
npm run submit:all
```

**Update frequency:**
- Critical bugs: Immediately
- Regular updates: Every 2-4 weeks
- Major features: Monthly/quarterly

### Over-The-Air (OTA) Updates

For JavaScript changes (not native code):

```bash
# Install expo-updates
npm install expo-updates

# Publish OTA update
eas update --branch production --message "Bug fixes"
```

**Benefits:**
- No store review needed
- Instant deployment
- Rollback capability

**Limitations:**
- JS/asset changes only
- No native code changes
- Users need internet

---

## Troubleshooting

### Common Build Errors

#### "Invalid credentials"

```bash
# Re-login to Expo
eas logout
eas login

# Clear credentials
eas credentials
# Select platform → Remove credentials → Try again
```

#### "Build failed on EAS servers"

```bash
# View detailed logs
eas build:view [build-id]

# Common fixes:
# 1. Update dependencies
npm update

# 2. Clear cache
npm run start -- --clear

# 3. Verify eas.json configuration
```

#### "Bundle identifier mismatch" (iOS)

Update `app.json`:
```json
{
  "ios": {
    "bundleIdentifier": "com.quadranttodo.app"
  }
}
```

Must match App Store Connect Bundle ID.

#### "Gradle build failed" (Android)

Update `app.json`:
```json
{
  "android": {
    "package": "com.quadranttodo.app"
  }
}
```

### Common Submission Errors

#### iOS: "Missing Privacy Manifest"

Add to `app.json`:
```json
{
  "ios": {
    "infoPlist": {
      "NSUserTrackingUsageDescription": "This app does not track you.",
      "NSCameraUsageDescription": "This app does not use camera.",
      "NSPhotoLibraryUsageDescription": "This app does not access photos."
    }
  }
}
```

#### Android: "Missing required permissions"

Verify `app.json`:
```json
{
  "android": {
    "permissions": ["INTERNET"]
  }
}
```

#### "App crashes on launch"

1. Test on physical device
2. Check Expo logs
3. Verify environment variables
4. Test Supabase connection
5. Check for missing dependencies

### Getting Help

1. **Expo Docs**: https://docs.expo.dev
2. **Expo Forums**: https://forums.expo.dev
3. **Discord**: https://discord.gg/expo
4. **Stack Overflow**: Tag `expo` or `react-native`
5. **GitHub Issues**: https://github.com/expo/expo/issues

### Useful Commands

```bash
# Check EAS project status
eas whoami
eas project:info

# View builds
eas build:list
eas build:view [build-id]

# View submissions
eas submission:list

# Manage credentials
eas credentials

# Device logs
npx react-native log-android
npx react-native log-ios

# Clear caches
rm -rf node_modules
npm install
rm -rf .expo
npm start -- --clear
```

---

## Cost Summary

### One-Time Costs

- **Apple Developer**: $99/year
- **Google Play Developer**: $25 (one-time)
- **App Assets** (if outsourced): $10-100

### Ongoing Costs

- **Expo EAS** (optional):
  - Free: Unlimited builds (with queue)
  - Production: $29/month (faster builds, priority)
- **Supabase**:
  - Free tier: Up to 50,000 users
  - Pro: $25/month (more resources)
- **Apple Developer**: $99/year (renewal)

### Free Tier Limits

- **Expo**: Unlimited builds (may wait in queue)
- **Supabase**: 500MB database, 1GB storage, 2GB bandwidth
- **Assets**: Use free tools (Figma, Canva, GIMP)

**Total minimum cost to start:** $124 (one-time)
**Annual cost:** $99 (Apple renewal only)

---

## Checklist: Ready for Production

### Before First Build

- [ ] All dependencies installed
- [ ] `.env` file configured with Supabase credentials
- [ ] All app assets created (icon, splash, etc.)
- [ ] `app.json` configured correctly
- [ ] Bundle IDs match developer accounts
- [ ] Tested locally on both iOS and Android
- [ ] EAS CLI installed and logged in

### Before Store Submission

#### iOS
- [ ] Apple Developer account active
- [ ] App created in App Store Connect
- [ ] Store listing completed (screenshots, description)
- [ ] Privacy policy prepared (if applicable)
- [ ] App reviewed internally
- [ ] TestFlight testing completed

#### Android
- [ ] Google Play Developer account active
- [ ] App created in Play Console
- [ ] Store listing completed
- [ ] Feature graphic created
- [ ] App reviewed internally
- [ ] Internal testing completed

### After Submission

- [ ] Monitor review status daily
- [ ] Respond to reviewers within 24 hours
- [ ] Test production build after approval
- [ ] Set up crash monitoring
- [ ] Plan update schedule
- [ ] Prepare marketing materials

---

## Next Steps

1. **Create Assets** (1-2 hours)
   - Design app icon
   - Create splash screen
   - Generate all required sizes

2. **Test Thoroughly** (1-2 days)
   - Test all features
   - Try on real devices
   - Get beta tester feedback

3. **Build for Production** (20-30 mins + cloud time)
   - Run build scripts
   - Download builds
   - Verify everything works

4. **Submit to Stores** (2-4 hours setup)
   - Complete store listings
   - Upload builds
   - Submit for review

5. **Wait for Approval** (1-14 days)
   - iOS: Usually 24-48 hours
   - Android: Usually 7-14 days first time

6. **Go Live!** 🎉
   - Announce launch
   - Share with users
   - Monitor feedback
   - Plan updates

---

## Support

For issues specific to this deployment guide, create an issue in the repository.

For Expo-specific issues, visit: https://expo.dev/support

For store-specific issues:
- iOS: https://developer.apple.com/support/
- Android: https://support.google.com/googleplay/android-developer

---

**Last Updated**: November 2025
**Guide Version**: 1.0.0
**Compatible with**: Expo SDK 51, EAS CLI 5.9+
