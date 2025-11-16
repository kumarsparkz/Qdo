/**
 * Tasks API
 *
 * All task-related API calls isolated in one file.
 */

import { createClient } from '@/lib/supabase/client';
import type { Task, CreateTaskInput, UpdateTaskInput, TaskFilters } from './types';

const supabase = createClient();

export const tasksApi = {
  /**
   * Fetch all tasks for the current user
   */
  getAll: async (filters?: TaskFilters): Promise<Task[]> => {
    let query = supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters?.project_id) {
      query = query.eq('project_id', filters.project_id);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (typeof filters?.is_urgent === 'boolean') {
      query = query.eq('is_urgent', filters.is_urgent);
    }
    if (typeof filters?.is_important === 'boolean') {
      query = query.eq('is_important', filters.is_important);
    }
    if (filters?.priority) {
      query = query.eq('priority', filters.priority);
    }
    if (filters?.has_deadline) {
      query = query.not('deadline', 'is', null);
    }

    // Apply search
    if (filters?.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
      );
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as Task[];
  },

  /**
   * Fetch a single task by ID
   */
  getById: async (id: string): Promise<Task> => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Task;
  },

  /**
   * Create a new task
   */
  create: async (input: CreateTaskInput): Promise<Task> => {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        ...input,
        status: input.status || 'todo',
      })
      .select()
      .single();

    if (error) throw error;
    return data as Task;
  },

  /**
   * Update an existing task
   */
  update: async (id: string, input: UpdateTaskInput): Promise<Task> => {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Task;
  },

  /**
   * Delete a task
   */
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * Update task status
   */
  updateStatus: async (id: string, status: Task['status']): Promise<Task> => {
    return tasksApi.update(id, { status });
  },

  /**
   * Move task to different quadrant
   */
  moveToQuadrant: async (
    id: string,
    is_urgent: boolean,
    is_important: boolean
  ): Promise<Task> => {
    return tasksApi.update(id, { is_urgent, is_important });
  },
};
