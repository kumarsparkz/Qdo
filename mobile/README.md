# Quadrant Todo Mobile App

📱 Cross-platform mobile application for Quadrant Todo - An Eisenhower Matrix task management app built with React Native and Expo.

## ✨ Features

- **Eisenhower Matrix**: Organize tasks by urgency and importance
- **Project Management**: Group tasks into projects
- **Task Status**: Track tasks through todo, in progress, blocked, and done
- **Priority Levels**: Must-have vs nice-to-have tasks
- **Deadlines**: Set and track task deadlines
- **Filtering**: Filter by project, status, priority, and deadline
- **Real-time Sync**: Powered by Supabase
- **Cross-Platform**: Single codebase for iOS and Android

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Expo Go app on your phone (iOS or Android)
- Supabase account and project

### Installation

1. **Install dependencies:**
```bash
cd mobile
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

3. **Start development server:**
```bash
npm start
```

4. **Open on your device:**
- Scan the QR code with Expo Go app (Android)
- Scan with Camera app (iOS)
- Or press 'a' for Android emulator, 'i' for iOS simulator

## 📱 Screens

- **Home**: Eisenhower Matrix with all active tasks in quadrants
- **Projects**: Create and manage projects
- **Create Task**: Add new tasks with full configuration
- **Done**: View completed tasks
- **Blocked**: Manage blocked tasks
- **Login**: Authentication with Supabase

## 🛠 Development

### Available Commands

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS (Mac only)
npm run ios

# Run on web
npm run web

# Build for production (Android)
npm run build:android

# Build for production (iOS)
npm run build:ios

# Build both platforms
npm run build:all

# Submit to stores
npm run submit:android
npm run submit:ios
npm run submit:all
```

### Project Structure

```
mobile/
├── app/                    # App screens (Expo Router)
│   ├── index.tsx          # Entry point / Auth check
│   ├── login.tsx          # Login screen
│   ├── home.tsx           # Main quadrant view
│   ├── create-task.tsx    # Task creation
│   ├── projects.tsx       # Project management
│   ├── done.tsx           # Completed tasks
│   ├── blocked.tsx        # Blocked tasks
│   └── _layout.tsx        # Root layout
├── lib/                   # Shared utilities
│   └── supabase.ts       # Supabase client
├── assets/               # App assets (icons, splash)
├── scripts/              # Deployment scripts
│   ├── deploy-android.sh
│   ├── deploy-ios.sh
│   └── deploy-all.sh
├── app.json              # Expo configuration
├── eas.json              # EAS Build configuration
├── package.json          # Dependencies
└── tsconfig.json         # TypeScript config
```

## 📦 Production Deployment

### Complete Deployment Guide

See **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** for comprehensive instructions including:

- ✅ Prerequisites and account setup
- ✅ Environment configuration
- ✅ Asset creation guide
- ✅ iOS App Store submission
- ✅ Google Play Store submission
- ✅ Automated deployment scripts
- ✅ Troubleshooting guide
- ✅ Cost breakdown

### Quick Deployment

1. **Install EAS CLI:**
```bash
npm install -g eas-cli
eas login
```

2. **Configure project:**
```bash
eas build:configure
```

3. **Build apps:**
```bash
# Build both platforms
npm run build:all

# Or individually
npm run build:android
npm run build:ios
```

4. **Submit to stores:**
```bash
# Submit both
npm run submit:all

# Or individually
npm run submit:android
npm run submit:ios
```

### Assets Required

Before production builds, create these assets:
- `assets/icon.png` - 1024×1024px
- `assets/splash.png` - 1242×2688px
- `assets/adaptive-icon.png` - 1024×1024px
- `assets/favicon.png` - 48×48px

See **[ASSETS_GUIDE.md](./ASSETS_GUIDE.md)** for detailed specifications.

## 🔧 Configuration

### App Configuration

Edit `app.json` to customize:
- App name and slug
- Bundle identifiers
- App version
- Owner/organization
- Permissions
- Splash screen and icon paths

### Build Configuration

Edit `eas.json` to configure:
- Build profiles (development, preview, production)
- Platform-specific settings
- Auto-increment version numbers
- Submission settings

### Environment Variables

Supported variables in `.env`:
- `EXPO_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## 🔐 Authentication

The app uses Supabase Authentication with:
- Email/password login
- Magic link support (configured in Supabase)
- Session persistence with AsyncStorage
- Automatic token refresh

## 🗄 Database

Shared Supabase database with the web app:

**Tables:**
- `projects` - Project organization
- `tasks` - Task management with quadrant classification

**Key Fields:**
- `is_urgent`, `is_important` - Quadrant classification
- `priority` - Must-have vs nice-to-have
- `status` - todo, in_progress, blocked, done
- `deadline` - Optional deadline date

## 📝 Development Tips

### Hot Reload

- Save any file for instant updates
- Shake device to open dev menu
- Enable "Fast Refresh" for best experience

### Debugging

```bash
# View logs in terminal
# They appear automatically when running npm start

# Or use React Native Debugger
# Install: https://github.com/jhen0409/react-native-debugger

# Chrome DevTools
# Press Ctrl+M (Android) or Cmd+D (iOS)
# Select "Debug JS Remotely"
```

### Testing on Real Devices

**iOS:**
- Install Expo Go from App Store
- Ensure on same WiFi network
- Scan QR code with Camera app

**Android:**
- Install Expo Go from Play Store
- Ensure on same WiFi network
- Scan QR code with Expo Go app

## 🐛 Troubleshooting

### Common Issues

**"Unable to resolve module"**
```bash
rm -rf node_modules
npm install
npm start -- --clear
```

**"Network response timed out"**
- Check WiFi connection
- Ensure devices on same network
- Try USB connection instead
- Restart Expo Dev Server

**"Supabase connection failed"**
- Verify `.env` file exists
- Check Supabase credentials
- Ensure Supabase project is active
- Test with web app first

**Build errors**
- Update `eas-cli`: `npm install -g eas-cli@latest`
- Check `eas.json` configuration
- Review build logs on Expo dashboard
- Clear EAS cache: `eas build --clear-cache`

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for more troubleshooting.

## 🤝 Contributing

This mobile app shares the same backend as the web application. When adding features:

1. Ensure database changes are compatible with web app
2. Test authentication flow
3. Verify real-time sync works
4. Test on both iOS and Android
5. Update this README with new features

## 📚 Resources

### Documentation
- [Expo Documentation](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [Supabase Docs](https://supabase.com/docs)
- [Expo Router](https://docs.expo.dev/router/introduction/)

### Deployment
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [EAS Submit](https://docs.expo.dev/submit/introduction/)
- [App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Play Store Guidelines](https://play.google.com/console/about/guides/releasewithconfidence/)

### Community
- [Expo Forums](https://forums.expo.dev)
- [Expo Discord](https://discord.gg/expo)
- [React Native Community](https://reactnative.dev/community/overview)

## 📄 License

Same license as the main Quadrant Todo project.

## 🎯 Roadmap

Planned features:
- [ ] Push notifications for task deadlines
- [ ] Offline support with local caching
- [ ] Drag-and-drop task reordering
- [ ] Task attachments and images
- [ ] Calendar view
- [ ] Task sharing and collaboration
- [ ] Dark mode
- [ ] Widgets (iOS and Android)
- [ ] Apple Watch / Wear OS apps

## 🙋 Support

- **Issues**: Create an issue in the main repository
- **Questions**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Expo Help**: https://expo.dev/support

---

**Built with ❤️ using Expo and React Native**

Last Updated: November 2025
