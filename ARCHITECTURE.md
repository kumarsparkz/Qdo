# Architecture Documentation

## Overview

This document describes the architecture and design patterns used in the Priority Task Manager application, following the **UX Architect Skill** principles for building production-quality client applications.

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [Folder Structure](#folder-structure)
3. [Design Patterns](#design-patterns)
4. [State Management](#state-management)
5. [Data Fetching](#data-fetching)
6. [Form Handling](#form-handling)
7. [Error Handling](#error-handling)
8. [Testing Strategy](#testing-strategy)
9. [Design System](#design-system)
10. [Best Practices](#best-practices)

---

## Technology Stack

### Web Application

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 14 (App Router) | Full-stack React framework with SSR/SSG |
| **Language** | TypeScript 5 (strict mode) | Type-safe development |
| **Styling** | Tailwind CSS 3.4 | Utility-first CSS with design tokens |
| **State Management** | TanStack Query (React Query) | Server state management and caching |
| **Forms** | React Hook Form + Zod | Type-safe form validation |
| **Database** | Supabase (PostgreSQL) | Backend as a Service |
| **Auth** | Supabase Auth | OAuth + Email/Password authentication |
| **UI Components** | Radix UI | Accessible component primitives |
| **Testing** | Jest + React Testing Library | Unit and integration testing |

### Mobile Application

- **Framework**: React Native + Expo
- **Navigation**: Expo Router
- **State**: React Context + TanStack Query (future)
- **Storage**: AsyncStorage + expo-secure-store

---

## Folder Structure

### Feature-Based Organization

Following the **feature-based architecture** pattern (NOT type-based):

```
/home/user/todo-list/
├── app/                          # Next.js App Router (pages)
│   ├── layout.tsx               # Root layout with QueryProvider
│   ├── page.tsx                 # Home page (4-quadrant view)
│   ├── login/
│   ├── done/
│   └── blocked/
│
├── src/
│   ├── features/                # Feature modules (new architecture)
│   │   ├── tasks/
│   │   │   ├── api.ts          # All task API calls
│   │   │   ├── types.ts        # Task types and utilities
│   │   │   ├── schemas.ts      # Zod validation schemas
│   │   │   ├── hooks/
│   │   │   │   └── useTasks.ts # React Query hooks
│   │   │   ├── components/     # Task-specific components
│   │   │   └── __tests__/      # Feature tests
│   │   │
│   │   ├── projects/
│   │   │   ├── api.ts
│   │   │   ├── types.ts
│   │   │   ├── schemas.ts
│   │   │   └── hooks/
│   │   │       └── useProjects.ts
│   │   │
│   │   └── auth/
│   │
│   ├── shared/                  # Shared/reusable code
│   │   ├── components/
│   │   │   ├── LoadingState.tsx
│   │   │   ├── ErrorState.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── __tests__/
│   │   ├── hooks/              # Shared custom hooks
│   │   ├── utils/              # Helper functions
│   │   └── theme/
│   │       └── tokens.ts       # Design system tokens
│   │
│   └── lib/                     # Library configurations
│       ├── query/
│       │   ├── queryClient.ts  # TanStack Query config
│       │   └── QueryProvider.tsx
│       ├── supabase/
│       │   ├── client.ts       # Browser Supabase client
│       │   └── server.ts       # Server Supabase client
│       └── utils.ts
│
├── components/                   # Legacy components (to be migrated)
│   └── ui/                      # UI primitives (Button, Card, etc.)
│
├── PRODUCT_BRIEF.md             # Product vision and requirements
├── ARCHITECTURE.md              # This file
├── jest.config.js               # Jest configuration
└── jest.setup.js                # Jest setup file
```

---

## Design Patterns

### 1. Feature-Based Architecture

Each feature is self-contained with all related code in one directory:

```typescript
features/
  tasks/
    ├── api.ts           // All API calls for tasks
    ├── types.ts         // TypeScript types and utilities
    ├── schemas.ts       // Zod validation schemas
    ├── hooks/           // React Query hooks
    ├── components/      // Task-specific UI components
    └── __tests__/       // Tests for this feature
```

**Benefits**:
- Easy to locate all code related to a feature
- Better scalability as features grow
- Clear boundaries between features
- Easier to refactor or remove features

### 2. API Isolation Pattern

All API calls are isolated in feature-specific `api.ts` files:

```typescript
// src/features/tasks/api.ts
export const tasksApi = {
  getAll: async (filters?: TaskFilters): Promise<Task[]> => { ... },
  getById: async (id: string): Promise<Task> => { ... },
  create: async (input: CreateTaskInput): Promise<Task> => { ... },
  update: async (id: string, input: UpdateTaskInput): Promise<Task> => { ... },
  delete: async (id: string): Promise<void> => { ... },
};
```

**Benefits**:
- Single source of truth for API calls
- Easy to mock for testing
- Consistent error handling
- Type-safe API contracts

### 3. Query Key Factory Pattern

Centralized query key management for cache invalidation:

```typescript
// src/features/tasks/hooks/useTasks.ts
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters?: TaskFilters) => [...taskKeys.lists(), filters] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
};
```

**Benefits**:
- Consistent query key structure
- Type-safe query keys
- Easy cache invalidation
- Prevents typos and key collisions

### 4. Three States Pattern

Every data-fetching component handles three critical states:

```typescript
function TaskList() {
  const { data, isLoading, isError, error, refetch } = useTasks();

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState error={error} onRetry={refetch} />;
  if (!data || data.length === 0) return <EmptyState />;

  return <TaskGrid tasks={data} />;
}
```

**States**:
1. **Loading**: Skeleton screens or spinners
2. **Error**: User-friendly message + retry option
3. **Empty**: Helpful message + call-to-action

---

## State Management

### Server State (TanStack Query)

For data from APIs (tasks, projects, users):

```typescript
// Fetching data
const { data, isLoading, isError } = useTasks();

// Creating data
const { mutate: createTask } = useCreateTask();

// Automatic cache invalidation
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
}
```

**Configuration** (`src/lib/query/queryClient.ts`):
- `staleTime`: 5 minutes (data considered fresh)
- `gcTime`: 10 minutes (cache garbage collection)
- `refetchOnWindowFocus`: false (prevent unnecessary refetches)
- `retry`: 1 (retry failed requests once)

### Local State (React Hooks)

For UI-only state (modals, filters, form inputs):

```typescript
const [isOpen, setIsOpen] = useState(false);
const [searchQuery, setSearchQuery] = useState('');
```

---

## Data Fetching

### Query Pattern

```typescript
// 1. Define API function
export const tasksApi = {
  getAll: async (filters?: TaskFilters): Promise<Task[]> => { ... },
};

// 2. Create custom hook
export function useTasks(filters?: TaskFilters) {
  return useQuery({
    queryKey: taskKeys.list(filters),
    queryFn: () => tasksApi.getAll(filters),
  });
}

// 3. Use in component
function TaskList() {
  const { data: tasks } = useTasks({ status: 'todo' });
  // ...
}
```

### Mutation Pattern

```typescript
// 1. Define API function
export const tasksApi = {
  create: async (input: CreateTaskInput): Promise<Task> => { ... },
};

// 2. Create mutation hook
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTaskInput) => tasksApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}

// 3. Use in component
function CreateTaskForm() {
  const { mutate: createTask, isPending } = useCreateTask();

  const handleSubmit = (data: CreateTaskInput) => {
    createTask(data);
  };
}
```

---

## Form Handling

### React Hook Form + Zod Pattern

```typescript
// 1. Define schema
const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(5000).optional(),
  project_id: z.string().uuid('Please select a project'),
});

type CreateTaskFormData = z.infer<typeof createTaskSchema>;

// 2. Use in component
function TaskForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
  });

  const { mutate: createTask } = useCreateTask();

  const onSubmit = (data: CreateTaskFormData) => {
    createTask(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register('title')}
        error={errors.title?.message}
      />
      <Button type="submit">Create</Button>
    </form>
  );
}
```

**Benefits**:
- Type-safe form validation
- Automatic type inference
- User-friendly error messages
- Schema reuse across forms

---

## Error Handling

### Error Normalization

```typescript
// src/shared/components/ErrorState.tsx
export function normalizeError(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes('Failed to fetch')) {
      return 'Network error. Please check your internet connection.';
    }
    if (error.message.includes('401')) {
      return 'Authentication required. Please log in again.';
    }
    // ... more patterns
  }
  return 'An unexpected error occurred. Please try again.';
}
```

### Error Boundary Pattern

```typescript
function DataComponent() {
  const { data, error, refetch } = useTasks();

  if (error) {
    return (
      <ErrorState
        title="Failed to load tasks"
        message={normalizeError(error)}
        onRetry={refetch}
      />
    );
  }

  return <TaskList tasks={data} />;
}
```

---

## Testing Strategy

### Unit Tests

Test business logic and utilities:

```typescript
// src/features/tasks/__tests__/types.test.ts
describe('getTaskQuadrant', () => {
  it('should return urgent-important for urgent and important task', () => {
    const quadrant = getTaskQuadrant({
      is_urgent: true,
      is_important: true,
    });
    expect(quadrant).toBe('urgent-important');
  });
});
```

### Component Tests

Test user interactions:

```typescript
// src/shared/components/__tests__/EmptyState.test.tsx
it('should call onAction when action button is clicked', async () => {
  const onAction = jest.fn();
  render(<EmptyState actionLabel="Create" onAction={onAction} />);

  await userEvent.click(screen.getByRole('button', { name: 'Create' }));

  expect(onAction).toHaveBeenCalledTimes(1);
});
```

### Test Commands

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

---

## Design System

### Token Structure

Centralized design tokens in `src/shared/theme/tokens.ts`:

```typescript
export const tokens = {
  colors: {
    primary: { main: '...', light: '...', dark: '...', foreground: '...' },
    // ... semantic colors
  },
  typography: {
    headingXL: { size: '2rem', weight: '700', lineHeight: '2.5rem' },
    // ... type scale
  },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 },
  borderRadius: { sm: 4, md: 8, lg: 12, xl: 16, pill: 9999 },
  // ... more tokens
};
```

### Usage

```typescript
// Use tokens, not magic numbers
<div style={{ padding: tokens.spacing.lg }}>
```

---

## Best Practices

### ✅ Do

- **Use feature-based organization** for scalability
- **Isolate all API calls** in `api.ts` files
- **Handle all three states** (loading, error, empty)
- **Use design tokens** instead of hard-coded values
- **Type everything properly** (no `any` types)
- **Write tests** for critical paths
- **Normalize errors** to user-friendly messages
- **Use React Query** for server state
- **Validate forms** with React Hook Form + Zod
- **Keep components focused** (single responsibility)

### ❌ Don't

- Don't call APIs directly from components
- Don't use inline styles or magic numbers
- Don't skip loading/error/empty states
- Don't use `any` type in TypeScript
- Don't create deep folder nesting (max 3-4 levels)
- Don't mix server state and UI state
- Don't forget to invalidate cache after mutations
- Don't show raw error messages to users

---

## Migration Guide

### Migrating Existing Components

1. **Move API calls** to `src/features/{feature}/api.ts`
2. **Create React Query hooks** in `src/features/{feature}/hooks/`
3. **Add Zod schemas** for forms in `src/features/{feature}/schemas.ts`
4. **Update components** to use new hooks
5. **Add proper state handling** (loading, error, empty)
6. **Write tests** for the feature

### Example Migration

**Before** (inline API call):
```typescript
// app/page.tsx
const [tasks, setTasks] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchTasks = async () => {
    const { data } = await supabase.from('tasks').select('*');
    setTasks(data);
    setLoading(false);
  };
  fetchTasks();
}, []);
```

**After** (using React Query):
```typescript
// app/page.tsx
import { useTasks } from '@/src/features/tasks/hooks/useTasks';

const { data: tasks, isLoading, isError, error, refetch } = useTasks();

if (isLoading) return <LoadingState />;
if (isError) return <ErrorState error={error} onRetry={refetch} />;
if (!tasks?.length) return <EmptyState />;
```

---

## Performance Optimizations

### Implemented

- ✅ TanStack Query caching (5min stale time)
- ✅ Component-level code splitting with Next.js
- ✅ Image optimization with Next.js `<Image>`
- ✅ CSS optimization with Tailwind CSS

### Planned

- ⏳ List virtualization for large task lists
- ⏳ Memoization for expensive computations
- ⏳ Lazy loading for modal components
- ⏳ Bundle size monitoring

---

## Further Reading

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Radix UI Documentation](https://www.radix-ui.com/)

---

**Last Updated**: 2025-11-16
**Version**: 1.0
**Maintainer**: UX Architect Team
