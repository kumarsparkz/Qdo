# Quick Start Guide - 5 Minutes to Your First Mobile Build! 🚀

This guide gets you from zero to a running mobile app in under 5 minutes.

---

## Step 1: Install Dependencies (1 min)

```bash
cd mobile
npm install
npm install -g eas-cli
```

## Step 2: Configure Environment (1 min)

```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your Supabase credentials
# Get these from: https://supabase.com/dashboard → Your Project → Settings → API
nano .env  # or use any text editor
```

Add:
```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 3: Test Locally (2 mins)

```bash
# Start the development server
npm start

# On your phone:
# 1. Install "Expo Go" from App Store (iOS) or Play Store (Android)
# 2. Scan the QR code that appears
# 3. App opens on your phone!
```

**✅ Success!** You now have the app running on your phone.

---

## Step 4: Production Build (15-30 mins) ⏳

### One-Time Setup

```bash
# Login to Expo
eas login

# Configure EAS
eas build:configure
```

### Build Apps

```bash
# Build for both iOS and Android
npm run build:all

# Or build individually:
npm run build:android  # For Google Play
npm run build:ios      # For App Store
```

**Note:** Builds happen on Expo's cloud servers and take 15-30 minutes.

---

## Step 5: Before Store Submission

### Required Accounts

1. **Apple Developer** ($99/year): https://developer.apple.com
2. **Google Play Developer** ($25 one-time): https://play.google.com/console

### Required Assets

Create these images and place in `mobile/assets/`:

- `icon.png` - 1024×1024px (app icon)
- `splash.png` - 1242×2688px (splash screen)
- `adaptive-icon.png` - 1024×1024px (Android adaptive icon)

**Quick Tip:** Use Canva (free) or Figma to create these assets.

### Update Configuration

Edit `mobile/app.json`:

```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug",
    "version": "1.0.0",
    "owner": "your-expo-username"
  }
}
```

Edit `mobile/eas.json` with your credentials:

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "YOUR_APP_ID",
        "appleTeamId": "YOUR_TEAM_ID"
      }
    }
  }
}
```

---

## Step 6: Submit to Stores

### Automated Submission

```bash
# After builds complete, submit to both stores:
npm run submit:all

# Or individually:
npm run submit:android
npm run submit:ios
```

### Manual Submission

**Android:**
1. Download .aab from Expo dashboard
2. Go to https://play.google.com/console
3. Create app → Production → Create Release
4. Upload .aab file
5. Submit for review

**iOS:**
1. Download .ipa from Expo dashboard
2. Use Transporter app (Mac) to upload
3. Go to https://appstoreconnect.apple.com
4. Select build → Submit for Review

---

## Troubleshooting

### "Can't connect to development server"

```bash
# Make sure you're on the same WiFi network as your computer
# Or try:
npm start -- --tunnel
```

### "Supabase connection error"

- Verify `.env` file has correct credentials
- Check Supabase project is active
- Try logging in on web app first

### "Build failed"

```bash
# Check build logs:
eas build:view

# Common fix:
npm update
npm start -- --clear
```

---

## What's Next?

### Development
- Edit code in `mobile/app/` directory
- Changes appear instantly with hot reload
- Test features thoroughly

### Testing
- Get feedback from beta testers
- Use TestFlight (iOS) for beta testing
- Use Internal Testing (Android) for beta

### Launch
- Complete store listings (descriptions, screenshots)
- Submit for review
- Monitor review status
- Respond to reviewer questions

### Post-Launch
- Monitor crash reports
- Respond to user reviews
- Release regular updates
- Add new features

---

## Full Documentation

For detailed information, see:
- **[README.md](./README.md)** - Complete project overview
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Comprehensive deployment guide
- **[ASSETS_GUIDE.md](./ASSETS_GUIDE.md)** - Asset creation guide

---

## Need Help?

- **Expo Docs**: https://docs.expo.dev
- **Expo Forums**: https://forums.expo.dev
- **Expo Discord**: https://discord.gg/expo

---

## Checklist

Before submitting to stores, ensure:

- [ ] App assets created (icon, splash, etc.)
- [ ] `.env` configured with Supabase credentials
- [ ] Tested on real iOS and Android devices
- [ ] Developer accounts created and active
- [ ] `app.json` and `eas.json` updated
- [ ] Production builds completed successfully
- [ ] Store listings prepared (description, screenshots)
- [ ] Privacy policy ready (if collecting data)
- [ ] App reviewed internally
- [ ] Beta testing completed

---

**Good luck with your launch! 🎉**

*Questions? Create an issue in the repository.*
