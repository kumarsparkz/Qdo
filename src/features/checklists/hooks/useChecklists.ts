/**
 * Checklists Query Hooks
 *
 * React Query hooks for checklist data fetching and caching.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { checklistsApi } from '../api';
import type { CreateChecklistItemInput, UpdateChecklistItemInput } from '../types';

/**
 * Query key factory for checklists
 */
export const checklistKeys = {
  all: ['checklists'] as const,
  lists: () => [...checklistKeys.all, 'list'] as const,
  listByTask: (taskId: string) => [...checklistKeys.lists(), taskId] as const,
  details: () => [...checklistKeys.all, 'detail'] as const,
  detail: (id: string) => [...checklistKeys.details(), id] as const,
};

/**
 * Fetch all checklist items for a task
 */
export function useChecklistItems(taskId: string) {
  return useQuery({
    queryKey: checklistKeys.listByTask(taskId),
    queryFn: () => checklistsApi.getAllByTaskId(taskId),
    enabled: !!taskId,
  });
}

/**
 * Fetch a single checklist item by ID
 */
export function useChecklistItem(id: string) {
  return useQuery({
    queryKey: checklistKeys.detail(id),
    queryFn: () => checklistsApi.getById(id),
    enabled: !!id,
  });
}

/**
 * Create a new checklist item
 */
export function useCreateChecklistItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateChecklistItemInput) => checklistsApi.create(input),
    onSuccess: (data) => {
      // Invalidate checklist for the task
      queryClient.invalidateQueries({ queryKey: checklistKeys.listByTask(data.task_id) });
    },
  });
}

/**
 * Create multiple checklist items at once
 */
export function useBulkCreateChecklistItems() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items: CreateChecklistItemInput[]) => checklistsApi.bulkCreate(items),
    onSuccess: (data) => {
      if (data.length > 0) {
        // Invalidate checklist for the task
        queryClient.invalidateQueries({ queryKey: checklistKeys.listByTask(data[0].task_id) });
      }
    },
  });
}

/**
 * Update an existing checklist item
 */
export function useUpdateChecklistItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateChecklistItemInput }) =>
      checklistsApi.update(id, input),
    onSuccess: (data) => {
      // Invalidate checklist for the task and specific item
      queryClient.invalidateQueries({ queryKey: checklistKeys.listByTask(data.task_id) });
      queryClient.invalidateQueries({ queryKey: checklistKeys.detail(data.id) });
    },
  });
}

/**
 * Delete a checklist item
 */
export function useDeleteChecklistItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, taskId }: { id: string; taskId: string }) => checklistsApi.delete(id),
    onSuccess: (_, variables) => {
      // Invalidate checklist for the task
      queryClient.invalidateQueries({ queryKey: checklistKeys.listByTask(variables.taskId) });
    },
  });
}

/**
 * Toggle checklist item completion status
 */
export function useToggleChecklistItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isCompleted }: { id: string; isCompleted: boolean }) =>
      checklistsApi.toggleCompletion(id, isCompleted),
    onSuccess: (data) => {
      // Invalidate checklist for the task
      queryClient.invalidateQueries({ queryKey: checklistKeys.listByTask(data.task_id) });
    },
  });
}

/**
 * Reorder checklist items
 */
export function useReorderChecklistItems() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ items, taskId }: { items: { id: string; position: number }[]; taskId: string }) =>
      checklistsApi.reorder(items),
    onSuccess: (_, variables) => {
      // Invalidate checklist for the task
      queryClient.invalidateQueries({ queryKey: checklistKeys.listByTask(variables.taskId) });
    },
  });
}
