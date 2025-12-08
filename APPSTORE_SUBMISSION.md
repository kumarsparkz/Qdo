# Qdo - App Store Submission Guide

Complete step-by-step guide to submit Qdo to the Apple App Store and Google Play Store.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Prepare the App](#prepare-the-app)
3. [iOS App Store Submission](#ios-app-store-submission)
4. [Android Play Store Submission](#android-play-store-submission)
5. [Post-Submission](#post-submission)

---

## Prerequisites

### Required Accounts
- **Apple Developer Account** ($99/year)
  - Sign up at: https://developer.apple.com/programs/
  - Requires: Valid payment method, D-U-N-S number (for organizations)
  
- **Google Play Console Account** ($25 one-time fee)
  - Sign up at: https://play.google.com/console
  - Requires: Google account, valid payment method

### Required Tools
- **macOS** (for iOS builds)
- **Xcode** (latest version)
- **Node.js** (v18 or higher)
- **EAS CLI**: `npm install -g eas-cli`

### Development Environment
```bash
# Install EAS CLI globally
npm install -g eas-cli

# Navigate to mobile directory
cd mobile

# Login to Expo
eas login
```

---

## Prepare the App

### 1. Update App Assets

Create high-quality app assets in the `mobile/assets/` folder:

**Required Assets:**
- `icon.png` - 1024×1024px (app icon)
- `adaptive-icon.png` - 1024×1024px (Android)
- `splash.png` - 1242×2688px (splash screen)
- `favicon.png` - 48×48px (web)

**Design Guidelines:**
- Use simple, recognizable design
- No transparency for iOS icon
- Test on both light and dark backgrounds
- Consider the "Q" letter mark or quadrant grid

### 2. Update App Configuration

Edit `mobile/app.json`:

```json
{
  "expo": {
    "name": "Qdo",
    "slug": "qdo",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.qdo.app",
      "buildNumber": "1",
      "infoPlist": {
        "NSCameraUsageDescription": "This app does not use the camera.",
        "NSPhotoLibraryUsageDescription": "This app does not access your photo library."
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.qdo.app",
      "versionCode": 1,
      "permissions": []
    }
  }
}
```

### 3. Configure EAS Build

Create `mobile/eas.json`:

```json
{
  "cli": {
    "version": ">= 5.9.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "production": {
      "distribution": "store",
      "env": {
        "EXPO_PUBLIC_SUPABASE_URL": "your-supabase-url",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "your-supabase-anon-key",
        "EXPO_PUBLIC_SITE_URL": "https://qdo.app"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABCD123456"
      },
      "android": {
        "serviceAccountKeyPath": "./google-play-service-account.json",
        "track": "internal"
      }
    }
  }
}
```

### 4. Environment Variables

Create `mobile/.env.production`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_SITE_URL=https://qdo.app
```

---

## iOS App Store Submission

### Phase 1: Create App Store Connect Record

1. **Go to App Store Connect**
   - Visit: https://appstoreconnect.apple.com
   - Sign in with your Apple Developer account

2. **Create New App**
   - Click "My Apps" → "+" → "New App"
   - **Platform**: iOS
   - **Name**: Qdo
   - **Primary Language**: English (U.S.)
   - **Bundle ID**: Select `com.qdo.app`
   - **SKU**: `qdo-ios` (unique identifier)
   - **User Access**: Full Access

3. **App Information**
   - **Name**: Qdo
   - **Subtitle**: Eisenhower Matrix Task Manager (max 30 chars)
   - **Privacy Policy URL**: https://qdo.app/privacy
   - **Category**: 
     - Primary: Productivity
     - Secondary: Business
   - **Content Rights**: Check "No, it does not contain third-party content"

### Phase 2: Prepare App Store Assets

#### Screenshots (Required for all device sizes)

**iPhone 6.7" Display (iPhone 14 Pro Max, 15 Pro Max)**
- Size: 1290 × 2796 pixels
- Minimum: 3 screenshots
- Recommended: 5-10 screenshots

**iPhone 6.5" Display (iPhone 11 Pro Max, XS Max)**
- Size: 1284 × 2778 pixels
- Minimum: 3 screenshots

**iPad Pro 12.9" Display (3rd gen)**
- Size: 2048 × 2732 pixels
- Minimum: 3 screenshots

**Screenshot Guidelines:**
1. Show login screen
2. Show main quadrant view with tasks
3. Show task creation
4. Show task details
5. Show completed tasks view

**Tips for Screenshots:**
```bash
# Use iOS Simulator to capture screenshots
# In simulator: Cmd + S to save screenshot
# Or use Xcode's screenshot tool
# Screenshots automatically go to ~/Desktop/
```

#### App Preview Video (Optional but Recommended)
- Duration: 15-30 seconds
- Size: Same as screenshot requirements
- Format: M4V, MP4, or MOV
- Shows: Key app features and interactions

#### App Icon
- Already set in `app.json`
- Must be 1024×1024px PNG
- No alpha channel, no transparency

### Phase 3: Write App Store Listing

#### App Name & Description

**Name**: Qdo

**Subtitle**: Prioritize tasks with Eisenhower Matrix

**Description** (4000 characters max):
```
Transform your productivity with Qdo, the smart task manager built on the proven Eisenhower Matrix method.

WHY QDO?
Qdo helps you focus on what truly matters by organizing tasks into four strategic quadrants:
• Urgent & Important - Do First
• Not Urgent & Important - Schedule
• Urgent & Not Important - Delegate
• Not Urgent & Not Important - Eliminate

FEATURES
✓ Smart Task Organization
  Sort tasks by urgency and importance automatically

✓ Project Management
  Group related tasks into projects for better organization

✓ Priority Marking
  Mark tasks as "Must Have" or "Nice to Have"

✓ Visual Quadrant View
  See all your tasks organized in the Eisenhower Matrix at a glance

✓ Task Details
  Add descriptions with Markdown support for rich formatting

✓ Sync Across Devices
  Access your tasks on web, iPhone, and iPad

✓ Clean Interface
  Beautiful, distraction-free design that helps you focus

✓ Offline Support
  Work on your tasks even without internet connection

THE EISENHOWER METHOD
Used by presidents, CEOs, and productivity experts, the Eisenhower Matrix helps you:
• Eliminate time-wasters
• Focus on important work
• Reduce stress and overwhelm
• Achieve more with less effort

PERFECT FOR
• Professionals managing multiple projects
• Students balancing academics and life
• Entrepreneurs building their business
• Anyone wanting to be more productive

Download Qdo today and start prioritizing what matters most!

Privacy Policy: https://qdo.app/privacy
Terms of Service: https://qdo.app/terms
Support: https://qdo.app/support
```

**Keywords** (100 characters max, comma-separated):
```
productivity,task manager,eisenhower,todo,gtd,priority,time management,organize,planner,focus
```

**Support URL**: https://qdo.app/support

**Marketing URL**: https://qdo.app

#### Promotional Text (170 characters max, can update anytime)
```
Stay organized and focused! The Eisenhower Matrix helps you prioritize what truly matters. Download now and transform your productivity!
```

### Phase 4: Build the App with EAS

1. **Configure Build**
```bash
cd mobile

# Configure EAS (first time only)
eas build:configure

# Update EAS project ID in app.json
# Get your project ID from: https://expo.dev
```

2. **Update `app.json` with EAS Project ID**
```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "your-eas-project-id-here"
      }
    }
  }
}
```

3. **Build for iOS**
```bash
# Production build for App Store
eas build --platform ios --profile production

# This will:
# - Upload your code to EAS servers
# - Build the app in the cloud
# - Generate an .ipa file
# - Takes 15-30 minutes
```

4. **Monitor Build Progress**
- Visit: https://expo.dev/accounts/[your-account]/projects/qdo/builds
- Or check terminal output for build URL

### Phase 5: Submit to App Store

#### Option A: Automatic Submission (Recommended)

```bash
# Submit directly from CLI
eas submit --platform ios --profile production

# You'll need:
# - Apple ID
# - App-specific password
# - ASC App ID (from App Store Connect)
```

#### Option B: Manual Upload

1. **Download .ipa from EAS**
   - Go to: https://expo.dev
   - Find your build
   - Click "Download"

2. **Upload to App Store Connect**
   - Open Xcode
   - Go to Window → Organizer
   - Drag .ipa to Archives
   - Click "Distribute App"
   - Choose "App Store Connect"
   - Follow prompts to upload

3. **Or use Transporter App**
   - Download from Mac App Store
   - Drag .ipa file to Transporter
   - Click "Deliver"

### Phase 6: Complete App Store Connect Submission

1. **Return to App Store Connect**
   - Wait for build to process (10-60 minutes)
   - Refresh page until build appears

2. **Select Build**
   - Go to "App Store" tab
   - Click "+" next to "Build"
   - Select your uploaded build

3. **Version Information**
   - **What's New in This Version**:
     ```
     Welcome to Qdo 1.0!
     
     • Organize tasks with the Eisenhower Matrix
     • Create projects to group related tasks
     • Mark priority levels for each task
     • Beautiful, intuitive interface
     • Sync across all your devices
     
     Start prioritizing what matters today!
     ```

4. **App Review Information**
   - **Contact Information**:
     - First Name: [Your Name]
     - Last Name: [Your Name]
     - Phone: [Your Phone]
     - Email: [Your Email]
   
   - **Demo Account** (if login required):
     - Username: demo@qdo.app
     - Password: [create demo account]
     - Additional notes: "This is a demo account with sample tasks"

5. **Version Release**
   - Choose "Automatically release this version"
   - Or "Manually release this version" (you control when it goes live)

6. **Submit for Review**
   - Review all information
   - Click "Submit for Review"

### Phase 7: App Review Process

**Timeline**: 24-48 hours typically

**Status Flow**:
1. Waiting for Review
2. In Review (1-2 hours)
3. Processing for App Store (15-30 minutes)
4. Ready for Sale ✅

**Common Rejection Reasons & Solutions**:

1. **Missing Privacy Policy**
   - Solution: Add privacy policy at https://qdo.app/privacy
   - Include data collection practices

2. **Crash on Launch**
   - Solution: Test thoroughly before submission
   - Use TestFlight for beta testing

3. **Missing App Permissions**
   - Solution: Ensure all used permissions are declared in Info.plist

4. **Login Required**
   - Solution: Provide demo account credentials

5. **Incomplete Metadata**
   - Solution: Fill all required fields in App Store Connect

**If Rejected**:
1. Read rejection notes carefully
2. Fix issues in your app
3. Submit new build (repeat Phase 4-6)

---

## Android Play Store Submission

### Phase 1: Create Google Play Console Account

1. **Sign Up**
   - Visit: https://play.google.com/console
   - Pay $25 one-time registration fee
   - Complete account verification

2. **Create App**
   - Click "Create app"
   - **App name**: Qdo
   - **Default language**: English (United States)
   - **App or game**: App
   - **Free or paid**: Free
   - Accept declarations
   - Click "Create app"

### Phase 2: Set Up App Details

1. **App Details**
   - **App name**: Qdo
   - **Short description** (80 characters):
     ```
     Prioritize tasks with the Eisenhower Matrix. Focus on what matters most.
     ```
   
   - **Full description** (4000 characters):
     ```
     Transform your productivity with Qdo, the smart task manager built on the proven Eisenhower Matrix method.

     WHY QDO?
     Qdo helps you focus on what truly matters by organizing tasks into four strategic quadrants based on urgency and importance.

     KEY FEATURES
     ✓ Smart Task Organization - Automatic sorting by urgency and importance
     ✓ Project Management - Group related tasks together
     ✓ Priority Marking - Tag tasks as Must Have or Nice to Have
     ✓ Visual Quadrant View - See all tasks in the Eisenhower Matrix
     ✓ Rich Task Details - Add descriptions with Markdown support
     ✓ Cross-Platform Sync - Access on web, phone, and tablet
     ✓ Clean Interface - Beautiful, distraction-free design
     ✓ Offline Support - Work without internet connection

     THE EISENHOWER MATRIX
     Used by successful leaders worldwide, this method helps you:
     • Eliminate time-wasters
     • Focus on important work
     • Reduce stress and overwhelm
     • Achieve more with less effort

     PERFECT FOR
     Professionals, students, entrepreneurs, and anyone who wants to be more productive and organized.

     Download Qdo and start prioritizing what matters!
     ```

2. **App Category**
   - **Category**: Productivity
   - **Tags**: Task Manager, Productivity, Organization

3. **Contact Details**
   - **Email**: support@qdo.app
   - **Website**: https://qdo.app
   - **Phone**: [Optional]

4. **Privacy Policy**
   - URL: https://qdo.app/privacy

### Phase 3: Prepare Play Store Assets

#### App Icon
- Size: 512×512px
- Format: PNG
- 32-bit with alpha

#### Feature Graphic (Required)
- Size: 1024×500px
- Format: PNG or JPEG
- No text or logos (policy requirement)
- Use app screenshot or branded graphic

#### Screenshots (Required)

**Phone Screenshots** (Minimum 2, Maximum 8)
- Dimensions: 16:9 to 9:16 aspect ratio
- Recommended: 1080×1920px (portrait)

**7-inch Tablet Screenshots** (Optional)
- Dimensions: 16:9 to 9:16 aspect ratio
- Recommended: 1200×1920px

**10-inch Tablet Screenshots** (Optional)
- Dimensions: 16:9 to 9:16 aspect ratio
- Recommended: 1600×2560px

**Screenshot Content** (similar to iOS):
1. Login screen
2. Main quadrant view
3. Task creation
4. Task details
5. Projects view

#### Promotional Graphics (Optional but Recommended)

**Promo Graphic**
- Size: 180×120px
- Format: PNG or JPEG

**TV Banner** (if supporting Android TV)
- Size: 1280×720px
- Format: PNG or JPEG

### Phase 4: Build for Android

1. **Generate Upload Keystore**
```bash
cd mobile

# Generate keystore for signing
eas credentials

# Follow prompts to generate Android keystore
# EAS will manage this for you
```

2. **Build Production APK/AAB**
```bash
# Build for Play Store (AAB format)
eas build --platform android --profile production

# This generates an .aab file
# Takes 15-30 minutes
```

3. **Download Build**
- Visit: https://expo.dev
- Download the .aab file when ready

### Phase 5: Create Release

1. **Production Track**
   - Go to "Production" in Play Console
   - Click "Create new release"

2. **Upload Build**
   - Upload your .aab file
   - Or click "App bundles" and upload

3. **Release Name**
   - Enter: `1.0.0` or `1 (1.0.0)`

4. **Release Notes**
```
Welcome to Qdo 1.0!

• Organize tasks using the Eisenhower Matrix
• Create projects to group related tasks
• Set priority levels for each task
• Beautiful, intuitive interface
• Sync across all your devices

Start prioritizing what matters today!
```

5. **Save & Review Release**

### Phase 6: Content Rating

1. **Start Questionnaire**
   - Navigate to "Content rating"
   - Click "Start questionnaire"

2. **Answer Questions**
   - **Email**: support@qdo.app
   - **Category**: Productivity/Calendar/To-do/Organizational
   
   - Key questions:
     - Violence: No
     - Sexuality: No
     - Drugs: No
     - Gambling: No
     - User-generated content: No
     - User communication: No
     - Personal info sharing: Yes (for cloud sync)
     - Location sharing: No

3. **Submit**
   - Review ratings
   - Apply ratings

### Phase 7: App Access

1. **Select Access Type**
   - If all features are available: "All or some functionality is restricted"
   - Select "App is available to all users"

2. **If Login Required**
   - Provide demo credentials:
     - Email: demo@qdo.app
     - Password: [demo password]
   - Add instructions if needed

### Phase 8: Ads & Data Safety

1. **Ads Declaration**
   - Does your app contain ads? **No**

2. **Data Safety Section**
   - Click "Start"
   - **Data collection and security**:
     - Do you collect user data? **Yes**
     - Is all data encrypted in transit? **Yes**
     - Can users request data deletion? **Yes**
   
   - **Data types collected**:
     - Email address (required for account)
     - User-generated content (tasks, projects)
   
   - **Data usage**:
     - App functionality
     - Account management
   
   - **Data sharing**: No third-party sharing

### Phase 9: Submit for Review

1. **Complete All Sections**
   - ✓ App details
   - ✓ Store listing
   - ✓ Content rating
   - ✓ App access
   - ✓ Ads
   - ✓ Data safety
   - ✓ Target audience
   - ✓ News apps (if applicable)

2. **Roll Out Release**
   - Go back to "Production" track
   - Click "Review release"
   - Review all information
   - Click "Start rollout to Production"

3. **Confirm Rollout**
   - Enter "Production" to confirm
   - Click "Rollout"

### Phase 10: Review Process

**Timeline**: 3-7 days typically (can be longer)

**Status Flow**:
1. In Review
2. Approved / Rejected
3. Published (if approved)

**Common Rejection Reasons**:
1. Privacy Policy issues
2. Misleading metadata
3. Crashes on launch
4. Missing content rating
5. Incomplete data safety

**If Rejected**:
1. Read rejection email carefully
2. Fix all issues
3. Submit new build
4. Update store listing if needed

---

## Post-Submission

### Set Up App Store Optimization (ASO)

1. **Monitor Rankings**
   - Track keyword rankings
   - Monitor competitor apps
   - Adjust keywords based on performance

2. **Collect Reviews**
   - Ask satisfied users for reviews
   - Respond to all reviews (positive and negative)
   - Address issues mentioned in reviews

3. **A/B Test (When Available)**
   - Test different screenshots
   - Test different descriptions
   - Test different icons (Google Play Custom Store Listings)

### Analytics Setup

1. **App Store Connect Analytics** (iOS)
   - Monitor downloads
   - Track retention
   - View crash reports

2. **Google Play Console Analytics** (Android)
   - Monitor installs
   - Track user retention
   - View ANR and crash reports

3. **In-App Analytics**
   - Set up Firebase Analytics (optional)
   - Track user engagement
   - Monitor feature usage

### Support & Maintenance

1. **Create Support Resources**
   - FAQ page: https://qdo.app/faq
   - User guide: https://qdo.app/guide
   - Contact form: https://qdo.app/contact

2. **Monitor Crash Reports**
   - Check Xcode Organizer (iOS)
   - Check Play Console (Android)
   - Fix critical bugs immediately

3. **Update Schedule**
   - Bug fixes: Release within 1-2 weeks
   - Minor features: Monthly updates
   - Major versions: Quarterly

### Marketing Launch

1. **Prepare Launch Materials**
   - Press release
   - Social media graphics
   - Product Hunt submission
   - Blog post announcement

2. **Launch Channels**
   - Website: https://qdo.app
   - Social media (Twitter, LinkedIn, etc.)
   - Product Hunt
   - Hacker News
   - Reddit (r/productivity, r/apps)
   - Email list (if available)

3. **Promotional Strategy**
   - First week: Free
   - Encourage reviews and ratings
   - Share user testimonials
   - Run limited-time promotion

---

## Checklist Summary

### Pre-Submission
- [ ] Apple Developer Account active
- [ ] Google Play Console account created
- [ ] High-quality app assets created (icon, screenshots, etc.)
- [ ] Privacy policy published at https://qdo.app/privacy
- [ ] Terms of service published at https://qdo.app/terms
- [ ] Support page created at https://qdo.app/support
- [ ] Demo account created and tested
- [ ] App thoroughly tested on real devices
- [ ] All features working correctly
- [ ] No crashes or major bugs

### iOS Submission
- [ ] App Store Connect record created
- [ ] App metadata completed
- [ ] Screenshots uploaded (all sizes)
- [ ] Keywords optimized
- [ ] Build uploaded via EAS
- [ ] Build selected in App Store Connect
- [ ] Review information completed
- [ ] Demo account provided
- [ ] Submitted for review

### Android Submission
- [ ] Google Play Console app created
- [ ] Store listing completed
- [ ] Screenshots uploaded
- [ ] Feature graphic uploaded
- [ ] Content rating completed
- [ ] Data safety completed
- [ ] Build uploaded via EAS
- [ ] Release created
- [ ] Rolled out to production

### Post-Launch
- [ ] Monitor reviews daily
- [ ] Respond to user feedback
- [ ] Track analytics
- [ ] Fix critical bugs immediately
- [ ] Plan next update
- [ ] Marketing activities initiated

---

## Important Notes

1. **Environment Variables**: Never commit production API keys to git
2. **Testing**: Test on real devices before submission
3. **Privacy Compliance**: Ensure GDPR and data privacy compliance
4. **Accessibility**: Test with VoiceOver (iOS) and TalkBack (Android)
5. **Internationalization**: Consider adding more languages later
6. **Updates**: Plan regular updates to maintain visibility

## Resources

- **Apple Developer**: https://developer.apple.com
- **App Store Connect**: https://appstoreconnect.apple.com
- **Google Play Console**: https://play.google.com/console
- **EAS Documentation**: https://docs.expo.dev/build/introduction/
- **App Store Review Guidelines**: https://developer.apple.com/app-store/review/guidelines/
- **Google Play Policy**: https://play.google.com/about/developer-content-policy/

## Support

For questions or issues during submission:
- Email: support@qdo.app
- Documentation: https://qdo.app/docs
- GitHub Issues: https://github.com/kumarsparkz/todo-list/issues

---

**Good luck with your app submission! 🚀**
