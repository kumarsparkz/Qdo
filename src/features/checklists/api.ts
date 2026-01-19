/**
 * Checklists API
 *
 * All checklist-related API calls isolated in one file.
 */

import { createClient } from '@/lib/supabase/client';
import type { ChecklistItem, CreateChecklistItemInput, UpdateChecklistItemInput } from './types';

const supabase = createClient();

export const checklistsApi = {
  /**
   * Fetch all checklist items for a task
   */
  getAllByTaskId: async (taskId: string): Promise<ChecklistItem[]> => {
    const { data, error } = await supabase
      .from('checklist_items')
      .select('*')
      .eq('task_id', taskId)
      .order('position', { ascending: true });

    if (error) throw error;
    return data as ChecklistItem[];
  },

  /**
   * Fetch a single checklist item by ID
   */
  getById: async (id: string): Promise<ChecklistItem> => {
    const { data, error } = await supabase
      .from('checklist_items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as ChecklistItem;
  },

  /**
   * Create a new checklist item
   */
  create: async (input: CreateChecklistItemInput): Promise<ChecklistItem> => {
    const { data, error } = await supabase
      .from('checklist_items')
      .insert({
        ...input,
        is_completed: input.is_completed || false,
        position: input.position || 0,
      })
      .select()
      .single();

    if (error) throw error;
    return data as ChecklistItem;
  },

  /**
   * Create multiple checklist items at once
   */
  bulkCreate: async (items: CreateChecklistItemInput[]): Promise<ChecklistItem[]> => {
    const { data, error } = await supabase
      .from('checklist_items')
      .insert(
        items.map((item, index) => ({
          ...item,
          is_completed: item.is_completed || false,
          position: item.position !== undefined ? item.position : index,
        }))
      )
      .select();

    if (error) throw error;
    return data as ChecklistItem[];
  },

  /**
   * Update an existing checklist item
   */
  update: async (id: string, input: UpdateChecklistItemInput): Promise<ChecklistItem> => {
    const { data, error } = await supabase
      .from('checklist_items')
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as ChecklistItem;
  },

  /**
   * Delete a checklist item
   */
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('checklist_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * Toggle checklist item completion status
   */
  toggleCompletion: async (id: string, isCompleted: boolean): Promise<ChecklistItem> => {
    return checklistsApi.update(id, { is_completed: isCompleted });
  },

  /**
   * Reorder checklist items
   */
  reorder: async (items: { id: string; position: number }[]): Promise<void> => {
    const promises = items.map(({ id, position }) =>
      checklistsApi.update(id, { position })
    );

    await Promise.all(promises);
  },

  /**
   * Delete all checklist items for a task
   */
  deleteAllByTaskId: async (taskId: string): Promise<void> => {
    const { error } = await supabase
      .from('checklist_items')
      .delete()
      .eq('task_id', taskId);

    if (error) throw error;
  },
};
