# Quadrant Todo Mobile App

A fully-featured React Native mobile application for Quadrant Todo, built with Expo. Organize your tasks using the Eisenhower Matrix method on iOS and Android devices.

## 🎯 Features

### ✅ Complete Feature Set
- **Email/Password Authentication** - Secure sign-in and sign-up
- **Project Management** - Create and organize multiple projects
- **4-Quadrant Eisenhower Matrix** - Visualize task priority
  - 🔥 Urgent & Important (Do First)
  - ⚡ Urgent & Not Important (Schedule)
  - 📅 Not Urgent & Important (Plan)
  - 🌱 Not Urgent & Not Important (Eliminate)
- **Task Management** - Full CRUD operations
- **Status Tracking** - To Do, In Progress, Blocked, Done
- **Priority Levels** - Must Have vs Nice to Have
- **Markdown Support** - Rich text formatting in descriptions
- **Done & Blocked Views** - Dedicated screens for task filtering
- **Pull-to-Refresh** - Easy data synchronization
- **Beautiful UI** - Modern, responsive design

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- For iOS: Xcode and iOS Simulator (macOS only)
- For Android: Android Studio and Android Emulator

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

Add your Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=your-supabase-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Run the App

```bash
# Start development server
npm start

# iOS
npm run ios

# Android
npm run android
```

## 📱 App Structure

```
mobile/
├── app/                  # Expo Router screens
│   ├── _layout.tsx      # Root layout with providers
│   ├── index.tsx        # Entry point
│   ├── login.tsx        # Authentication
│   ├── home.tsx         # 4-quadrant matrix
│   ├── done.tsx         # Completed tasks
│   ├── blocked.tsx      # Blocked tasks
│   ├── create-task.tsx  # Task creation
│   ├── create-project.tsx
│   └── task-detail.tsx  # Task details
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── TaskCard.tsx
│   └── QuadrantView.tsx
├── contexts/            # State management
│   ├── AuthContext.tsx
│   └── DataContext.tsx
├── types/               # TypeScript types
└── lib/                 # Utilities

```

## 🔄 Data Sync

The mobile app shares the same Supabase backend as the web app:
- Real-time synchronization
- Same account across platforms
- No data migration needed

## 🛠️ Tech Stack

- React Native / Expo 51
- TypeScript 5
- Expo Router 3.5 (Navigation)
- Supabase (Backend)
- AsyncStorage (Persistence)
- react-native-markdown-display

## 📦 Building for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure project
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## 🧪 Testing Checklist

- [ ] Sign up / Sign in
- [ ] Create project
- [ ] Create tasks in all quadrants
- [ ] Update task status
- [ ] Mark tasks as done/blocked
- [ ] View done and blocked lists
- [ ] Delete tasks
- [ ] Pull-to-refresh

## 📝 License

MIT License - Part of the Quadrant Todo project
