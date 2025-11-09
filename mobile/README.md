# Quadrant Todo Mobile App

This is the React Native mobile application for Quadrant Todo, built with Expo.

## Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- For iOS: Xcode and iOS Simulator (macOS only)
- For Android: Android Studio and Android Emulator

## Setup

1. Install dependencies:
```bash
cd mobile
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Add your Supabase credentials to `.env`:
```
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Running the App

### Development
```bash
npm start
```

This will start the Expo development server. You can then:
- Press `i` to open iOS Simulator
- Press `a` to open Android Emulator
- Scan QR code with Expo Go app on your physical device

### iOS
```bash
npm run ios
```

### Android
```bash
npm run android
```

## Building for Production

### iOS
```bash
eas build --platform ios
```

### Android
```bash
eas build --platform android
```

## App Structure

- `/app` - Expo Router app directory
- `/components` - Reusable React components
- `/lib` - Utility functions and Supabase client
- `/assets` - Images, fonts, and other static assets

## Features

- ✅ Google OAuth authentication
- ✅ Project management
- ✅ Task creation with tags (urgent/important/priority)
- ✅ 4-quadrant Eisenhower Matrix view
- ✅ Task status management (To Do, In Progress, Blocked, Done)
- ✅ Markdown support for task descriptions
- ✅ Done and Blocked task views

## Tech Stack

- React Native / Expo
- TypeScript
- Supabase (Database & Auth)
- Expo Router (Navigation)
