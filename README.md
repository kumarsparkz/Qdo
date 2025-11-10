# Quadrant Todo - Eisenhower Matrix Task Manager

A beautiful, full-stack task management application that uses the Eisenhower Matrix (4-quadrant system) to help you prioritize tasks based on urgency and importance. Built with Next.js, Supabase, and React Native.

![Quadrant Todo](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green.svg)

## Features

- ✅ **Dual Authentication** - Google OAuth & Email/Password login
- ✅ **Project Management** - Organize tasks into projects
- ✅ **4-Quadrant View** - Eisenhower Matrix visualization
  - Urgent & Important
  - Urgent & Not Important
  - Not Urgent & Important
  - Not Urgent & Not Important
- ✅ **Smart Prioritization** - Must-have vs Nice-to-have tags
- ✅ **Task Status Management** - To Do, In Progress, Blocked, Done
- ✅ **Rich Markdown Support** - Format task descriptions beautifully
- ✅ **Separate Views** - Dedicated pages for Done and Blocked tasks
- ✅ **Cross-Platform** - Web app + Mobile apps (iOS & Android)
- ✅ **Beautiful UI** - Modern, responsive design with TailwindCSS
- ✅ **Real-time Updates** - Powered by Supabase

## Tech Stack

### Web Application
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Google OAuth + Email/Password)
- **Markdown**: React Markdown + remark-gfm
- **Deployment**: Vercel

### Mobile Application
- **Framework**: React Native + Expo
- **Language**: TypeScript
- **Navigation**: Expo Router
- **Database**: Supabase (shared with web)
- **Authentication**: Supabase Auth

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account ([supabase.com](https://supabase.com))
- A Vercel account for deployment ([vercel.com](https://vercel.com))
- For mobile: Expo CLI and iOS Simulator or Android Emulator

### 1. Clone the Repository

\`\`\`bash
git clone <your-repo-url>
cd todo-list
\`\`\`

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from \`supabase/schema.sql\`
3. Enable Google OAuth:
   - Go to Authentication → Providers
   - Enable Google provider
   - Add your Google OAuth credentials
   - Add authorized redirect URLs:
     - \`http://localhost:3000/auth/callback\` (development)
     - \`https://your-domain.vercel.app/auth/callback\` (production)
4. Get your Supabase credentials from Settings → API

### 3. Configure Environment Variables

Create a \`.env.local\` file in the root directory:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit \`.env.local\` with your Supabase credentials:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
\`\`\`

### 4. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 5. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Configure environment variables:
   - \`NEXT_PUBLIC_SUPABASE_URL\`
   - \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`
   - \`NEXT_PUBLIC_SITE_URL\` (your Vercel URL)
4. Deploy!

Alternatively, use the Vercel CLI:

\`\`\`bash
npm install -g vercel
vercel
\`\`\`

Don't forget to add your production URL to Supabase's authorized redirect URLs!

## Mobile App Setup

See [mobile/README.md](mobile/README.md) for detailed mobile setup instructions.

Quick start:

\`\`\`bash
cd mobile
npm install
cp .env.example .env
# Edit .env with your Supabase credentials
npm start
\`\`\`

## Database Schema

### Projects Table
- \`id\` - UUID (Primary Key)
- \`name\` - Text
- \`description\` - Text (Optional)
- \`user_id\` - UUID (Foreign Key to auth.users)
- \`created_at\` - Timestamp
- \`updated_at\` - Timestamp

### Tasks Table
- \`id\` - UUID (Primary Key)
- \`title\` - Text
- \`description\` - Text (Optional, Markdown supported)
- \`project_id\` - UUID (Foreign Key to projects)
- \`user_id\` - UUID (Foreign Key to auth.users)
- \`is_urgent\` - Boolean
- \`is_important\` - Boolean
- \`priority\` - Enum ('must_have', 'nice_to_have')
- \`status\` - Enum ('todo', 'in_progress', 'blocked', 'done')
- \`created_at\` - Timestamp
- \`updated_at\` - Timestamp

## Usage Guide

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
3. Click "Create Task"

### Managing Tasks

Tasks appear in one of four quadrants based on urgency and importance:

1. **🔥 Urgent & Important** (Red) - Do these first!
2. **⚡ Urgent & Not Important** (Orange) - Delegate if possible
3. **📅 Not Urgent & Important** (Blue) - Schedule these
4. **🌱 Not Urgent & Not Important** (Green) - Do later or eliminate

Within each quadrant, "Must Have" tasks appear before "Nice to Have" tasks.

### Updating Task Status

Click on any task and use the status buttons:
- **In Progress** - Currently working on it
- **Blocked** - Stuck, needs attention
- **Done** - Completed

### Viewing Done and Blocked Tasks

Use the navigation bar at the top:
- **Home** - Active tasks in 4-quadrant view
- **Done** - All completed tasks
- **Blocked** - Tasks that need unblocking

## Markdown Support

Task descriptions support GitHub Flavored Markdown:

- **Bold**: \`**text**\`
- *Italic*: \`*text*\`
- [Links](url): \`[text](url)\`
- Lists: \`- item\` or \`1. item\`
- Code: \`\`\`code\`\`\`
- Blockquotes: \`> quote\`
- And more!

## Project Structure

\`\`\`
.
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page (4-quadrant view)
│   ├── login/             # Login page
│   ├── done/              # Done tasks page
│   ├── blocked/           # Blocked tasks page
│   └── auth/callback/     # OAuth callback
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── navbar.tsx        # Navigation bar
│   ├── task-card.tsx     # Task display component
│   ├── create-task-modal.tsx
│   └── project-modal.tsx
├── lib/                   # Utility functions
│   ├── supabase/         # Supabase clients
│   └── utils.ts          # Helper functions
├── types/                 # TypeScript types
│   └── database.types.ts
├── supabase/             # Database schema
│   └── schema.sql
├── mobile/               # React Native mobile app
│   ├── app/             # Expo Router pages
│   ├── components/      # Mobile components
│   └── lib/             # Mobile utilities
└── middleware.ts         # Auth middleware
\`\`\`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions:
1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

## Roadmap

- [ ] Task dependencies and subtasks
- [ ] Task due dates and reminders
- [ ] Collaborative projects (team features)
- [ ] Task tags and labels
- [ ] Advanced filtering and search
- [ ] Task analytics and insights
- [ ] Dark mode
- [ ] Offline support for mobile
- [ ] Desktop app (Electron)

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Expo](https://expo.dev/)
- [Lucide Icons](https://lucide.dev/)

---

Made with ❤️ for productivity enthusiasts
