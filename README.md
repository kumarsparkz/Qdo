# Priority Task Manager 📊

> **Eisenhower Matrix-based task management for web and mobile**
>
> Enhanced with **UX Architect Skill** principles for production-quality architecture

A beautiful, full-stack task management application that uses the Eisenhower Matrix (4-quadrant system) to help you prioritize tasks based on urgency and importance. Built with Next.js, Supabase, React Native, and modern best practices.

![Quadrant Todo](https://img.shields.io/badge/version-1.0.0--enhanced-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green.svg)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-red.svg)

---

## ✨ Features

### Core Functionality

- ✅ **Dual Authentication** - Google OAuth & Email/Password login
- ✅ **Project Management** - Organize tasks into projects
- ✅ **4-Quadrant Eisenhower Matrix**
  - 🔥 **Urgent & Important** - Do these first!
  - ⚡ **Urgent & Not Important** - Delegate if possible
  - 📅 **Not Urgent & Important** - Schedule these
  - 🌱 **Not Urgent & Not Important** - Do later or eliminate
- ✅ **Smart Prioritization** - Must-have vs Nice-to-have tags
- ✅ **Task Status Management** - To Do, In Progress, Blocked, Done
- ✅ **Rich Markdown Support** - Format task descriptions beautifully (GitHub Flavored Markdown)
- ✅ **Deadline Tracking** - Visual indicators for overdue, due today, and upcoming tasks
- ✅ **Drag & Drop** - Move tasks between quadrants with visual feedback
- ✅ **Advanced Filtering** - Search by title/description, filter by status, priority, deadline
- ✅ **Separate Views** - Dedicated pages for Done and Blocked tasks
- ✅ **Cross-Platform** - Web app + Mobile apps (iOS & Android)
- ✅ **Beautiful UI** - Modern, responsive design with TailwindCSS
- ✅ **Real-time Updates** - Powered by Supabase

---

## 🏗️ Architecture Highlights

This project follows the **UX Architect Skill** best practices for production-quality applications:

### 🎨 Design Principles

✅ **Feature-Based Architecture** - Self-contained feature modules for scalability
✅ **API Isolation** - All API calls centralized per feature
✅ **Three States Pattern** - Loading, Error, and Empty states everywhere
✅ **Type Safety** - TypeScript strict mode, no `any` types
✅ **Design System** - Formalized tokens for colors, typography, spacing
✅ **Form Validation** - React Hook Form + Zod for type-safe forms
✅ **Testing** - Jest + React Testing Library with example tests
✅ **Server State Management** - TanStack Query (React Query) for caching and optimistic updates
✅ **Error Normalization** - User-friendly error messages
✅ **Performance** - Query caching, memoization, optimized rendering

### 📁 Folder Structure

```
todo-list/
├── app/                      # Next.js App Router (pages)
│   ├── layout.tsx           # Root layout with QueryProvider
│   ├── page.tsx             # Home (4-quadrant view)
│   ├── login/               # Login page
│   ├── done/                # Completed tasks
│   └── blocked/             # Blocked tasks
│
├── src/                      # New feature-based architecture
│   ├── features/            # Feature modules
│   │   ├── tasks/
│   │   │   ├── api.ts      # All task API calls
│   │   │   ├── types.ts    # Task types & utilities
│   │   │   ├── schemas.ts  # Zod validation schemas
│   │   │   ├── hooks/
│   │   │   │   └── useTasks.ts  # React Query hooks
│   │   │   └── __tests__/  # Feature tests
│   │   │
│   │   └── projects/
│   │       ├── api.ts
│   │       ├── types.ts
│   │       ├── schemas.ts
│   │       └── hooks/
│   │           └── useProjects.ts
│   │
│   ├── shared/              # Shared components & utilities
│   │   ├── components/
│   │   │   ├── LoadingState.tsx    # Reusable loading UI
│   │   │   ├── ErrorState.tsx      # Error handling UI
│   │   │   ├── EmptyState.tsx      # Empty state UI
│   │   │   └── __tests__/
│   │   ├── hooks/           # Shared custom hooks
│   │   ├── utils/           # Helper functions
│   │   └── theme/
│   │       └── tokens.ts    # Design system tokens
│   │
│   └── lib/                 # Library configurations
│       ├── query/
│       │   ├── queryClient.ts      # TanStack Query config
│       │   └── QueryProvider.tsx   # Query provider wrapper
│       └── supabase/
│           ├── client.ts    # Browser Supabase client
│           └── server.ts    # Server Supabase client
│
├── components/              # Legacy UI components
│   └── ui/                 # Radix UI primitives
│
├── PRODUCT_BRIEF.md        # Product vision & requirements
├── ARCHITECTURE.md         # Detailed architecture docs
├── jest.config.js          # Jest configuration
└── mobile/                 # React Native app
```

### 📚 Documentation

- **[PRODUCT_BRIEF.md](./PRODUCT_BRIEF.md)** - Product vision, user flows, success metrics
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Detailed architecture, patterns, best practices

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Supabase account** ([supabase.com](https://supabase.com))
- **Vercel account** for deployment ([vercel.com](https://vercel.com))
- **For mobile**: Expo CLI and iOS Simulator or Android Emulator

### Web Application Setup

#### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd todo-list
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the schema from `supabase/schema.sql`
3. Enable **Google OAuth**:
   - Go to Authentication → Providers
   - Enable Google provider
   - Add your Google OAuth credentials
   - Add authorized redirect URLs:
     - `http://localhost:3000/auth/callback` (development)
     - `https://your-domain.vercel.app/auth/callback` (production)
4. Get your Supabase credentials from **Settings → API**

#### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Mobile Application Setup

#### Quick Start

```bash
cd mobile
npm install
cp .env.example .env
# Edit .env with your Supabase credentials
npm start
```

See **[mobile/README.md](mobile/README.md)** for detailed setup instructions.

---

## 🧪 Testing

This project includes a comprehensive testing infrastructure:

```bash
# Run all tests
npm test

# Watch mode (re-run on file changes)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Coverage

- ✅ **Business Logic** - Task quadrant classification utilities
- ✅ **Component Tests** - EmptyState, ErrorState, LoadingState
- ✅ **Form Validation** - Zod schema tests
- ⏳ **API Integration Tests** (planned)
- ⏳ **E2E Tests** for critical flows (planned)

---

## 🎨 Design System

### Formalized Design Tokens

All design tokens are centralized in `src/shared/theme/tokens.ts`:

```typescript
// Color Palette
tokens.colors = {
  primary: { main, light, dark, foreground },
  secondary: { main, light, dark, foreground },
  success, warning, danger,
  gray: { 50, 100, ..., 900, 950 },
  quadrant: {
    urgentImportant: { border, background, header, text },
    // ... other quadrants
  }
}

// Typography Scale
tokens.typography = {
  headingXL: { size: '2rem', weight: '700', lineHeight: '2.5rem' },
  headingL: { size: '1.5rem', ... },
  body: { size: '1rem', ... },
  // ...
}

// Spacing Scale
tokens.spacing = {
  xs: 4,   sm: 8,   md: 12,  lg: 16,
  xl: 24,  xxl: 32, xxxl: 48
}
```

See [src/shared/theme/tokens.ts](./src/shared/theme/tokens.ts) for the complete design system.

---

## 📖 Tech Stack

### Web Application

| Purpose | Technology | Version |
|---------|-----------|---------|
| **Framework** | Next.js (App Router) | 14.2 |
| **Language** | TypeScript (strict mode) | 5.x |
| **Styling** | Tailwind CSS | 3.4 |
| **State Management** | TanStack Query | 5.x |
| **Forms** | React Hook Form | 7.x |
| **Validation** | Zod | 4.x |
| **UI Components** | Radix UI | Latest |
| **Icons** | Lucide React | Latest |
| **Database** | Supabase (PostgreSQL) | 2.x |
| **Auth** | Supabase Auth | 2.x |
| **Testing** | Jest + React Testing Library | Latest |
| **Markdown** | React Markdown + remark-gfm | Latest |
| **Drag & Drop** | dnd-kit | Latest |

### Mobile Application

| Purpose | Technology |
|---------|-----------|
| **Framework** | React Native |
| **Runtime** | Expo 51 |
| **Language** | TypeScript |
| **Navigation** | Expo Router 3.5 |
| **State** | React Context |
| **Database** | Supabase (shared with web) |

---

## 🔐 Authentication & Security

### Supported Auth Methods

- **Google OAuth** (primary)
- **Email/Password** (secondary)

### Security Features

- **Row-Level Security (RLS)** - Supabase policies ensure users only see their own data
- **Secure Session Management** - JWT-based authentication
- **Protected Routes** - Middleware enforces authentication
- **Automatic Redirects** - Unauthenticated users redirected to login

---

## 📊 Database Schema

### Projects Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary Key |
| `name` | TEXT | Project name |
| `description` | TEXT | Optional description |
| `user_id` | UUID | FK to auth.users |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

### Tasks Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary Key |
| `title` | TEXT | Task title |
| `description` | TEXT | Optional Markdown description |
| `project_id` | UUID | FK to projects |
| `user_id` | UUID | FK to auth.users |
| `is_urgent` | BOOLEAN | Urgency flag |
| `is_important` | BOOLEAN | Importance flag |
| `priority` | ENUM | 'must_have' or 'nice_to_have' |
| `status` | ENUM | 'todo', 'in_progress', 'blocked', 'done' |
| `deadline` | TIMESTAMPTZ | Optional deadline |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

---

## 📝 Usage Guide

### Creating Your First Project

1. Log in with your Google account
2. Click "Create Project First" button
3. Enter project name and description
4. Click "Create Project"

### Adding Tasks

1. Click the "+" button (bottom right) or "Add Task" button
2. Fill in task details:
   - **Title**: Brief description of the task
   - **Description**: Detailed description (supports Markdown)
   - **Project**: Select from your projects
   - **Urgency**: Urgent or Not Urgent
   - **Importance**: Important or Not Important
   - **Priority**: Must Have or Nice to Have
   - **Deadline** (optional): Set a due date
3. Click "Create Task"

### Managing Tasks

Tasks appear in one of four quadrants based on urgency and importance. Within each quadrant, "Must Have" tasks appear before "Nice to Have" tasks.

**Drag & Drop**: Drag tasks between quadrants to change their urgency/importance.

### Updating Task Status

Click on any task and use the status buttons:
- **In Progress** - Currently working on it
- **Blocked** - Stuck, needs attention
- **Done** - Completed

### Filtering & Search

Use the filter bar to:
- **Search** by task title or description
- **Filter** by project, status, priority, or deadline
- **Combine** multiple filters for precise results

---

## 🚢 Deployment

### Web (Vercel)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Configure environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (your Vercel URL)
4. Deploy!

**Alternatively, use the Vercel CLI:**

```bash
npm install -g vercel
vercel --prod
```

Don't forget to add your production URL to Supabase's authorized redirect URLs!

### Mobile (EAS Build)

```bash
cd mobile

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to app stores
eas submit --platform ios
eas submit --platform android
```

---

## 🌟 UX Architect Enhancements

This repository has been enhanced following the **UX Architect Skill** principles:

### ✅ Implemented Improvements

1. **Feature-Based Architecture** - Scalable, self-contained feature modules
2. **TanStack Query Integration** - Optimized server state management with caching
3. **Design System Tokens** - Formalized, reusable design values
4. **State Management Components** - LoadingState, ErrorState, EmptyState
5. **Form Validation** - React Hook Form + Zod for type-safe validation
6. **Testing Infrastructure** - Jest configuration with example tests
7. **Comprehensive Documentation** - Product brief + Architecture guide
8. **Type Safety** - Strict TypeScript, no `any` types
9. **Error Normalization** - User-friendly error messages
10. **Query Key Factory** - Organized cache invalidation strategy

### 📋 Key Documents

- **[PRODUCT_BRIEF.md](./PRODUCT_BRIEF.md)** - Problem, target users, user flows, success metrics
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Patterns, state management, testing strategy

---

## 🤝 Contributing

Contributions are welcome! This project follows the **UX Architect Skill** principles:

### When Contributing

1. ✅ Maintain feature-based organization
2. ✅ Isolate API calls in `api.ts` files
3. ✅ Use TanStack Query for server state
4. ✅ Add proper loading/error/empty states
5. ✅ Write tests for new features
6. ✅ Use design tokens (no magic numbers)
7. ✅ Follow TypeScript strict mode
8. ✅ Validate forms with Zod schemas

### Contribution Process

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🗺️ Roadmap

### Recently Completed

- ✅ Feature-based architecture refactor
- ✅ TanStack Query integration
- ✅ Formalized design system
- ✅ React Hook Form + Zod validation
- ✅ Testing infrastructure
- ✅ Comprehensive documentation

### Next Steps

- ⏳ List virtualization for large task lists
- ⏳ Dark mode toggle
- ⏳ Keyboard shortcuts
- ⏳ Task dependencies and subtasks
- ⏳ Task analytics and insights
- ⏳ Collaborative projects (team features)
- ⏳ Advanced reporting
- ⏳ Offline-first sync for mobile
- ⏳ Desktop app (Electron)

---

## 📬 Support

If you encounter any issues or have questions:

1. Check the [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details
2. Review [PRODUCT_BRIEF.md](./PRODUCT_BRIEF.md) for product vision
3. Check the [Issues](../../issues) page
4. Create a new issue with detailed information

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **Eisenhower Matrix** - Time management framework by Dwight D. Eisenhower
- **UX Architect Skill** - Production-quality architecture patterns
- **[Next.js](https://nextjs.org/)** - Amazing React framework
- **[TanStack Query](https://tanstack.com/query)** - Powerful data synchronization
- **[Supabase](https://supabase.com/)** - Backend as a Service
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Expo](https://expo.dev/)** - React Native toolchain
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Lucide Icons](https://lucide.dev/)** - Beautiful icon library

---

**Built with ❤️ using the UX Architect Skill principles for production-quality applications**
