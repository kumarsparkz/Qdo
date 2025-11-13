# Quick Deployment Guide

Fast-track guide to deploy Quadrant Todo to iOS and Android app stores.

## Prerequisites Setup (One-time)

1. **Install EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```

2. **Create Accounts**:
   - Expo account: https://expo.dev
   - Apple Developer: https://developer.apple.com ($99/year)
   - Google Play: https://play.google.com/console ($25 one-time)

3. **Setup Mobile Project**:
   ```bash
   cd mobile
   npm install
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Login and Configure**:
   ```bash
   eas login
   eas build:configure
   ```

5. **Update Configuration**:
   - Edit `mobile/app.json` → Add your EAS project ID
   - Edit `mobile/eas.json` → Add your Apple ID and Team ID

## Deploy to iOS App Store

### Quick Method:

```bash
cd mobile
./scripts/deploy-ios.sh
```

### Manual Method:

```bash
cd mobile
eas build --platform ios --profile production
eas submit --platform ios --latest
```

## Deploy to Android Play Store

### Quick Method:

```bash
cd mobile
./scripts/deploy-android.sh
```

### Manual Method:

```bash
cd mobile
eas build --platform android --profile production-aab
eas submit --platform android --latest
```

## Deploy to Both Platforms

### Quick Method:

```bash
cd mobile
./scripts/deploy-all.sh
```

### Manual Method:

```bash
cd mobile
eas build --platform all --profile production
# After builds complete:
eas submit --platform all --latest
```

## First-Time Store Setup

### iOS App Store Connect

1. Go to https://appstoreconnect.apple.com
2. Create New App → Bundle ID: `com.quadranttodo.app`
3. Fill app information, screenshots, description
4. Submit for review

### Google Play Console

1. Go to https://play.google.com/console
2. Create New App → Package: `com.quadranttodo.app`
3. Complete store listing, screenshots, content rating
4. Create production release

## Update Existing App

1. **Update version** in `mobile/app.json`:
   ```json
   "version": "1.1.0",
   "ios": { "buildNumber": "2" },
   "android": { "versionCode": 2 }
   ```

2. **Rebuild and submit**:
   ```bash
   cd mobile
   ./scripts/deploy-all.sh
   ```

## OTA Updates (No Store Review)

For JavaScript-only changes:

```bash
cd mobile
eas update --branch production --message "Bug fixes and improvements"
```

## Common Issues

**Build fails?**
- Check: `eas build:list` for error logs
- Fix: `eas credentials` to update certificates

**Submission fails?**
- iOS: Check certificates and provisioning profiles
- Android: Verify service account JSON key

**Can't login?**
- Run: `eas logout` then `eas login`

## Status Check

```bash
# View all builds
eas build:list

# View specific build
eas build:view [BUILD_ID]

# View credentials
eas credentials
```

## Need More Help?

See detailed guide: [DEPLOYMENT.md](./DEPLOYMENT.md)

## Quick Reference

| Task | Command |
|------|---------|
| Build iOS | `eas build -p ios --profile production` |
| Build Android | `eas build -p android --profile production-aab` |
| Build Both | `eas build --platform all --profile production` |
| Submit iOS | `eas submit -p ios --latest` |
| Submit Android | `eas submit -p android --latest` |
| Submit Both | `eas submit --platform all --latest` |
| OTA Update | `eas update --branch production --message "Update"` |
| Check Status | `eas build:list` |

---

**Time Estimate**:
- First deployment: 2-4 hours (including setup)
- Subsequent deployments: 30-60 minutes
- Build time: 15-30 minutes per platform
