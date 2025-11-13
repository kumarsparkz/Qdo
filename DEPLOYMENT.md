# Quadrant Todo - Deployment Guide

Complete guide for deploying Quadrant Todo to iOS App Store and Android Play Store.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [App Store Configuration](#app-store-configuration)
4. [Play Store Configuration](#play-store-configuration)
5. [Building the Apps](#building-the-apps)
6. [Deploying to Stores](#deploying-to-stores)
7. [Automated Deployment](#automated-deployment)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

- **Node.js** 18 or higher
- **npm** or **yarn**
- **Expo Account** (sign up at https://expo.dev)
- **EAS CLI**: Install globally
  ```bash
  npm install -g eas-cli
  ```

### Required Accounts

1. **Apple Developer Account** ($99/year)
   - Sign up at https://developer.apple.com
   - Required for iOS App Store deployment

2. **Google Play Developer Account** ($25 one-time fee)
   - Sign up at https://play.google.com/console
   - Required for Android Play Store deployment

3. **Expo Account** (Free)
   - Sign up at https://expo.dev

## Initial Setup

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. Configure Environment Variables

Create `.env` file in the `mobile` directory:

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Login to Expo

```bash
eas login
```

### 4. Initialize EAS Project

```bash
eas build:configure
```

This will:
- Create an EAS project
- Link it to your Expo account
- Generate a project ID

Update `mobile/app.json` with your EAS project ID:

```json
"extra": {
  "eas": {
    "projectId": "your-actual-project-id"
  }
}
```

## App Store Configuration

### 1. Create App in App Store Connect

1. Go to https://appstoreconnect.apple.com
2. Click **My Apps** → **+** → **New App**
3. Fill in:
   - **Platform**: iOS
   - **Name**: Quadrant Todo
   - **Primary Language**: English
   - **Bundle ID**: `com.quadranttodo.app`
   - **SKU**: `quadrant-todo` (can be anything unique)

### 2. Prepare App Store Assets

Create the following assets in `mobile/assets/`:

- **App Icon** (`icon.png`): 1024×1024px
- **Splash Screen** (`splash.png`): 1242×2688px
- **Screenshots**: Capture from iOS Simulator
  - 6.5" Display: 1284×2778px (iPhone 14 Pro Max)
  - 5.5" Display: 1242×2208px (iPhone 8 Plus)

### 3. Configure iOS Settings in eas.json

Update `mobile/eas.json` with your Apple details:

```json
"submit": {
  "production": {
    "ios": {
      "appleId": "your-apple-id@example.com",
      "ascAppId": "1234567890",
      "appleTeamId": "ABCD123456"
    }
  }
}
```

To find these values:
- **appleId**: Your Apple ID email
- **ascAppId**: Found in App Store Connect → App Information
- **appleTeamId**: Found in Apple Developer → Membership

### 4. Create App Store Listing

In App Store Connect:

1. **App Information**
   - Name: Quadrant Todo
   - Category: Productivity
   - Privacy Policy URL: (your URL)

2. **Pricing and Availability**
   - Price: Free
   - Availability: All territories

3. **App Privacy**
   - Data Types: (based on your app's data collection)

## Play Store Configuration

### 1. Create App in Google Play Console

1. Go to https://play.google.com/console
2. Click **Create app**
3. Fill in:
   - **App name**: Quadrant Todo
   - **Default language**: English (United States)
   - **App or game**: App
   - **Free or paid**: Free

### 2. Set Up Service Account

1. Go to **Google Cloud Console** → **IAM & Admin** → **Service Accounts**
2. Create a service account with **Play Console access**
3. Download the JSON key file
4. Save it as `mobile/google-play-service-account.json`
5. **IMPORTANT**: Add to `.gitignore` (already done)

### 3. Configure Android Settings

The bundle is already configured in `mobile/app.json`:

```json
"android": {
  "package": "com.quadranttodo.app",
  "versionCode": 1
}
```

### 4. Prepare Play Store Assets

Create the following in Google Play Console:

1. **App icon**: 512×512px (uploaded in Console)
2. **Feature graphic**: 1024×500px
3. **Screenshots**: At least 2 screenshots
   - Phone: Min 320px, Max 3840px
   - 7" Tablet: Optional
   - 10" Tablet: Optional

4. **Store listing**:
   - Short description (80 chars)
   - Full description (4000 chars)
   - App category: Productivity
   - Content rating: Complete questionnaire

## Building the Apps

### iOS Build

#### Option 1: Using the Script

```bash
cd mobile
./scripts/deploy-ios.sh
```

#### Option 2: Manual Build

```bash
cd mobile
eas build --platform ios --profile production
```

This will:
1. Upload your code to EAS servers
2. Build the iOS app in the cloud
3. Provide a download link for the `.ipa` file

### Android Build

#### Option 1: Using the Script

```bash
cd mobile
./scripts/deploy-android.sh
```

#### Option 2: Manual Build

```bash
cd mobile
# For Play Store (AAB format)
eas build --platform android --profile production-aab

# For direct distribution (APK format)
eas build --platform android --profile production
```

### Build Both Platforms

```bash
cd mobile
eas build --platform all --profile production
```

## Deploying to Stores

### Deploy to App Store

#### Automatic Submission

```bash
cd mobile
eas submit --platform ios --latest
```

This will:
1. Download the latest iOS build
2. Upload it to App Store Connect
3. Submit for review (if configured)

#### Manual Submission

1. Download `.ipa` from EAS dashboard
2. Upload to App Store Connect using Transporter app
3. Fill in release notes
4. Submit for review

### Deploy to Play Store

#### Automatic Submission

```bash
cd mobile
eas submit --platform android --latest
```

This will:
1. Download the latest Android build
2. Upload it to Google Play Console
3. Submit to selected track (production/beta)

#### Manual Submission

1. Download `.aab` from EAS dashboard
2. Go to Google Play Console → Production → Create new release
3. Upload the `.aab` file
4. Fill in release notes
5. Review and roll out

## Automated Deployment

### GitHub Actions for Web App

A workflow is configured at `.github/workflows/release.yml` that:

- Triggers on every push to `main` branch
- Automatically creates release tags in format `v1.x.0`
- Increments version from 0 to 9999

### EAS Update for Mobile

For over-the-air updates (doesn't require App Store review):

```bash
cd mobile
eas update --branch production --message "Your update message"
```

This is useful for:
- Bug fixes
- Content updates
- JavaScript changes

**Note**: Native code changes still require full rebuild and store submission.

## Version Management

### Updating App Version

1. **Update version in `mobile/app.json`**:
   ```json
   {
     "expo": {
       "version": "1.1.0",
       "ios": {
         "buildNumber": "2"
       },
       "android": {
         "versionCode": 2
       }
     }
   }
   ```

2. **Rebuild and submit**:
   ```bash
   eas build --platform all --profile production
   eas submit --platform all --latest
   ```

### Version Number Guidelines

- **iOS**:
  - `version`: User-facing version (1.0.0, 1.1.0, etc.)
  - `buildNumber`: Internal build number (1, 2, 3, etc.)

- **Android**:
  - `version`: User-facing version
  - `versionCode`: Integer that must increment with each release

## Troubleshooting

### Common Issues

#### 1. Build Fails: Missing Credentials

**Problem**: EAS can't access Apple/Google credentials

**Solution**:
```bash
# For iOS
eas credentials

# Select "Set up new credentials"
# Follow prompts to upload certificates
```

#### 2. Submission Rejected: Missing Privacy Policy

**Problem**: App Store requires privacy policy URL

**Solution**: Add privacy policy URL to app.json and App Store Connect

#### 3. Android Build Fails: Keystore Issues

**Problem**: Missing or invalid Android keystore

**Solution**:
```bash
eas credentials -p android
# Select "Remove keystore" then rebuild
```

#### 4. iOS Build Fails: Provisioning Profile

**Problem**: Invalid provisioning profile

**Solution**:
```bash
eas credentials -p ios
# Update or regenerate provisioning profile
```

### Getting Help

- **Expo Documentation**: https://docs.expo.dev
- **EAS Build Docs**: https://docs.expo.dev/build/introduction/
- **EAS Submit Docs**: https://docs.expo.dev/submit/introduction/
- **Expo Forums**: https://forums.expo.dev

## Checklist Before Deployment

### iOS App Store

- [ ] Apple Developer Account active
- [ ] App created in App Store Connect
- [ ] App icon (1024×1024px) prepared
- [ ] Screenshots captured
- [ ] Privacy policy URL added
- [ ] App description written
- [ ] Bundle ID matches (`com.quadranttodo.app`)
- [ ] Certificates configured in EAS
- [ ] Test build completed successfully

### Android Play Store

- [ ] Google Play Developer Account active
- [ ] App created in Play Console
- [ ] Service account JSON key downloaded
- [ ] App icon (512×512px) prepared
- [ ] Screenshots captured
- [ ] Feature graphic created
- [ ] Store listing completed
- [ ] Content rating completed
- [ ] Test build completed successfully

### Both Platforms

- [ ] Supabase environment variables configured
- [ ] EAS project initialized
- [ ] app.json updated with EAS project ID
- [ ] eas.json configured with store credentials
- [ ] App tested on physical devices
- [ ] Terms of service and privacy policy ready

## Quick Reference Commands

```bash
# Login to EAS
eas login

# Build iOS
eas build --platform ios --profile production

# Build Android
eas build --platform android --profile production-aab

# Submit iOS
eas submit --platform ios --latest

# Submit Android
eas submit --platform android --latest

# Check build status
eas build:list

# View credentials
eas credentials

# OTA Update
eas update --branch production --message "Bug fixes"
```

## Post-Deployment

After successful deployment:

1. **Monitor crash reports** in App Store Connect / Play Console
2. **Respond to user reviews**
3. **Track analytics** to measure app performance
4. **Plan updates** based on user feedback
5. **Test on various devices** regularly

## Need Help?

If you encounter issues:

1. Check the [Expo documentation](https://docs.expo.dev)
2. Search [Expo forums](https://forums.expo.dev)
3. Review build logs in EAS dashboard
4. Contact support via Expo dashboard

---

**Last Updated**: November 2025
**Maintained by**: kumarsparkz
