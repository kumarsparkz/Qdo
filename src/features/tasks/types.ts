/**
 * Task Feature Types
 */

export type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'done';
export type TaskPriority = 'must_have' | 'nice_to_have';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  project_id: string;
  user_id: string;
  is_urgent: boolean;
  is_important: boolean;
  priority: TaskPriority | null;
  status: TaskStatus;
  deadline: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  project_id: string;
  is_urgent: boolean;
  is_important: boolean;
  priority?: TaskPriority;
  status?: TaskStatus;
  deadline?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  project_id?: string;
  is_urgent?: boolean;
  is_important?: boolean;
  priority?: TaskPriority;
  status?: TaskStatus;
  deadline?: string;
}

export interface TaskFilters {
  search?: string;
  project_id?: string;
  status?: TaskStatus;
  is_urgent?: boolean;
  is_important?: boolean;
  priority?: TaskPriority;
  has_deadline?: boolean;
}

/**
 * Quadrant classification based on urgency and importance
 */
export type QuadrantType =
  | 'urgent-important'
  | 'urgent-not-important'
  | 'not-urgent-important'
  | 'not-urgent-not-important';

export interface TasksByQuadrant {
  'urgent-important': Task[];
  'urgent-not-important': Task[];
  'not-urgent-important': Task[];
  'not-urgent-not-important': Task[];
}

/**
 * Get quadrant type for a task
 */
export function getTaskQuadrant(task: Task): QuadrantType {
  if (task.is_urgent && task.is_important) return 'urgent-important';
  if (task.is_urgent && !task.is_important) return 'urgent-not-important';
  if (!task.is_urgent && task.is_important) return 'not-urgent-important';
  return 'not-urgent-not-important';
}

/**
 * Group tasks by quadrant
 */
export function groupTasksByQuadrant(tasks: Task[]): TasksByQuadrant {
  return tasks.reduce(
    (acc, task) => {
      const quadrant = getTaskQuadrant(task);
      acc[quadrant].push(task);
      return acc;
    },
    {
      'urgent-important': [],
      'urgent-not-important': [],
      'not-urgent-important': [],
      'not-urgent-not-important': [],
    } as TasksByQuadrant
  );
}
