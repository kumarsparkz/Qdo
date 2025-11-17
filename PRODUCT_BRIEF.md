# Product Brief: Priority Task Manager

## Problem

Professionals and busy individuals struggle to prioritize their tasks effectively. Most todo apps treat all tasks equally, leading to important but not urgent tasks being neglected while unimportant urgent tasks consume valuable time. This results in poor time management, missed strategic opportunities, and constant reactive firefighting.

## Target User

- **Primary**: Knowledge workers, entrepreneurs, and project managers who manage 20+ tasks simultaneously
- **Secondary**: Students and professionals learning time management principles
- **User Characteristics**:
  - Tech-savvy (comfortable with web and mobile apps)
  - Values productivity and strategic thinking
  - Juggles multiple projects and priorities
  - Needs both desktop (work) and mobile (on-the-go) access

## Core Value

**"See what truly matters at a glance, and focus your time on what moves you forward."**

We deliver clarity through the proven Eisenhower Matrix framework, helping users distinguish between urgent vs. important tasks. Our cross-platform solution ensures your priorities are always accessible, whether you're at your desk or on the move.

## Primary User Flows

### Flow 1: New User Onboarding
1. User arrives at login page → sees clear value proposition
2. Signs in with Google OAuth (one click)
3. Lands on empty quadrant view with guided empty state
4. Creates first project
5. Creates first task with guided priority selection
6. Sees task appear in appropriate quadrant

### Flow 2: Daily Task Management
1. User logs in and sees 4-quadrant dashboard
2. Quickly scans each quadrant to understand priorities
3. Filters by project or deadline to focus
4. Drags task from one quadrant to another as priorities shift
5. Marks task as "In Progress" → "Done"
6. Reviews completed tasks in "Done" view

### Flow 3: Task Creation & Organization
1. User clicks "Create Task" button
2. Enters task title and rich Markdown description
3. Selects project (or creates new one)
4. Chooses urgency (Yes/No) and importance (Yes/No)
5. Sets priority level (Must Have / Nice to Have)
6. Optionally adds deadline
7. Submits → Task appears in correct quadrant

### Flow 4: Mobile Quick Capture
1. User opens mobile app on phone
2. Taps "+" button for quick task creation
3. Enters essential details (title, project, urgency/importance)
4. Saves task
5. Returns to quadrant view to see updated priorities

### Flow 5: Blocked Task Management
1. User encounters task blocker
2. Changes task status to "Blocked"
3. Task moves to "Blocked" view
4. User navigates to dedicated "Blocked" screen
5. Reviews all blocked tasks, unblocks when ready
6. Task returns to appropriate quadrant

## Non-Goals

**What we explicitly won't do in this version:**

- ❌ Team collaboration features (comments, assignments, sharing)
- ❌ Time tracking or pomodoro timer
- ❌ Recurring tasks or advanced scheduling
- ❌ File attachments or media uploads
- ❌ Integrations with third-party tools (Slack, email, etc.)
- ❌ Advanced reporting or analytics dashboards
- ❌ Subtasks or nested task hierarchies
- ❌ Calendar view or timeline visualization
- ❌ Notifications or reminders (push/email)
- ❌ Offline-first sync (requires network connectivity)

**Why these are non-goals:**
- Keep the app focused on core prioritization value
- Avoid feature bloat that distracts from the Eisenhower Matrix
- Maintain simplicity for individual users
- Future versions can add these based on user feedback

## Success Metrics

**Primary Metric**: **Task Completion Rate**
- Target: Users complete 70%+ of tasks in "Urgent & Important" quadrant within 7 days

**Secondary Metrics**:
- **Activation**: 80% of new users create their first task within 5 minutes
- **Retention**: 60% of users return to app within 3 days of signup
- **Engagement**: Average user manages 15+ active tasks
- **Platform Balance**: 40/60 split between web and mobile usage

**UX Quality Indicators**:
- Task creation completes in < 30 seconds
- Zero state → first task in < 2 minutes
- Page load time < 2 seconds
- Mobile app startup < 3 seconds

## Technical Architecture Principles

### Platforms
- **Web**: Next.js 14 (App Router) with TypeScript + Tailwind CSS
- **Mobile**: React Native + Expo with TypeScript
- **Backend**: Supabase (PostgreSQL + Auth)

### State Management
- **Server State**: TanStack Query (React Query) for data fetching, caching, and synchronization
- **Local State**: React hooks for UI state
- **Mobile State**: React Context for cross-screen state

### Design System
- Formalized theme with semantic color tokens
- Consistent spacing, typography, and interaction patterns
- Reusable component library (Button, Card, Input, Badge, etc.)
- Radix UI primitives for accessibility

### Quality Standards
- TypeScript strict mode (no `any` types)
- Feature-based folder structure (not type-based)
- Comprehensive error, loading, and empty states
- Form validation with React Hook Form + Zod
- Unit and integration tests for critical flows
- ESLint + Prettier for code consistency

## Feature Prioritization (Current Version)

### ✅ Implemented
- [x] 4-Quadrant Eisenhower Matrix view
- [x] Task CRUD with rich Markdown descriptions
- [x] Project management and filtering
- [x] Deadline tracking with visual indicators
- [x] Task status workflow (Todo → In Progress → Blocked → Done)
- [x] Google OAuth authentication
- [x] Drag-and-drop task repositioning
- [x] Multi-platform support (Web + iOS + Android)
- [x] Search and advanced filtering
- [x] Dedicated views for Done and Blocked tasks

### 🚧 In Progress (UX Architect Enhancements)
- [ ] Feature-based architecture refactor
- [ ] TanStack Query integration
- [ ] Formalized design system documentation
- [ ] Consistent state management (loading/error/empty)
- [ ] Form validation with React Hook Form + Zod
- [ ] Testing infrastructure
- [ ] Performance optimizations

### 🔮 Future Considerations
- Dark mode toggle
- Task templates
- Bulk task operations
- Export/import functionality
- Keyboard shortcuts
- Custom quadrant colors/names

## Design Principles

1. **Clarity Over Complexity**: Every screen should communicate its purpose within 3 seconds
2. **Progressive Disclosure**: Show essential info first, details on demand
3. **Immediate Feedback**: All actions provide instant visual response
4. **Consistent Patterns**: Same interactions work the same way everywhere
5. **Mobile-First Thinking**: Design for constraints (small screens, touch), then enhance for desktop
6. **Accessible by Default**: Proper contrast, keyboard navigation, screen reader support

## Visual Language

### Quadrant Color System
- **Urgent & Important**: 🔥 Red (demands immediate action)
- **Urgent & Not Important**: ⚡ Orange (delegate or schedule quickly)
- **Not Urgent & Important**: 📅 Blue (strategic planning and growth)
- **Not Urgent & Not Important**: 🌱 Green (reconsider necessity)

### Interaction Patterns
- **Primary Action**: One clear CTA per screen (create task, save, submit)
- **Destructive Actions**: Always require confirmation (delete, clear filters)
- **Drag Feedback**: Visual indication of drop zones and valid targets
- **Transitions**: Smooth, purposeful animations (200-300ms)

---

**Version**: 1.0
**Last Updated**: 2025-11-16
**Status**: Active Development
