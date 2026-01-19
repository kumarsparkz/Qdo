/**
 * Checklist Feature Types
 */

export interface ChecklistItem {
  id: string;
  task_id: string;
  title: string;
  is_completed: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface CreateChecklistItemInput {
  task_id: string;
  title: string;
  is_completed?: boolean;
  position?: number;
}

export interface UpdateChecklistItemInput {
  title?: string;
  is_completed?: boolean;
  position?: number;
}

/**
 * Extended task with checklist items
 */
export interface TaskWithChecklist {
  id: string;
  title: string;
  description: string | null;
  project_id: string;
  user_id: string;
  is_urgent: boolean;
  is_important: boolean;
  priority: 'must_have' | 'nice_to_have' | null;
  status: 'todo' | 'in_progress' | 'blocked' | 'done';
  deadline: string | null;
  created_at: string;
  updated_at: string;
  checklist_items: ChecklistItem[];
}
