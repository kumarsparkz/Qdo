export * from './database.types'

// Quadrant types for Eisenhower Matrix
export type QuadrantType =
  | 'urgent-important'      // Q1: Do First
  | 'urgent-not-important'  // Q2: Schedule
  | 'not-urgent-important'  // Q3: Delegate
  | 'not-urgent-not-important' // Q4: Eliminate

export interface Quadrant {
  id: QuadrantType
  title: string
  subtitle: string
  color: string
  emoji: string
  description: string
}

// Navigation types
export type RootStackParamList = {
  index: undefined
  login: undefined
  home: undefined
  done: undefined
  blocked: undefined
  'task-detail': { taskId: string }
  'create-task': { projectId?: string }
  'edit-task': { taskId: string }
  'create-project': undefined
  'edit-project': { projectId: string }
}

// Form types
export interface TaskFormData {
  title: string
  description: string
  project_id: string
  is_urgent: boolean
  is_important: boolean
  priority: 'must_have' | 'nice_to_have'
  deadline: Date | null
}

export interface ProjectFormData {
  name: string
  description: string
}

// Filter and sort types
export interface TaskFilters {
  search?: string
  projectId?: string
  status?: 'todo' | 'in_progress' | 'blocked' | 'done'
  priority?: 'must_have' | 'nice_to_have'
  isUrgent?: boolean
  isImportant?: boolean
}

export type SortOption = 'created_asc' | 'created_desc' | 'title_asc' | 'title_desc' | 'deadline_asc' | 'deadline_desc'
