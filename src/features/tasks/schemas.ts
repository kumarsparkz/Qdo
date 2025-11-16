/**
 * Task Form Validation Schemas
 *
 * Zod schemas for task forms with React Hook Form integration.
 */

import { z } from 'zod';

/**
 * Create Task Form Schema
 */
export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less'),
  description: z
    .string()
    .max(5000, 'Description must be 5000 characters or less')
    .optional()
    .or(z.literal('')),
  project_id: z
    .string()
    .uuid('Please select a project'),
  is_urgent: z.boolean(),
  is_important: z.boolean(),
  priority: z.enum(['must_have', 'nice_to_have']).nullable().optional(),
  deadline: z
    .string()
    .datetime()
    .nullable()
    .optional()
    .or(z.literal('')),
});

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;

/**
 * Update Task Form Schema
 */
export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less')
    .optional(),
  description: z
    .string()
    .max(5000, 'Description must be 5000 characters or less')
    .optional()
    .or(z.literal('')),
  project_id: z
    .string()
    .uuid('Please select a valid project')
    .optional(),
  is_urgent: z.boolean().optional(),
  is_important: z.boolean().optional(),
  priority: z.enum(['must_have', 'nice_to_have']).nullable().optional(),
  status: z.enum(['todo', 'in_progress', 'blocked', 'done']).optional(),
  deadline: z
    .string()
    .datetime()
    .nullable()
    .optional()
    .or(z.literal('')),
});

export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;

/**
 * Quick Task Form Schema (simplified for quick entry)
 */
export const quickTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less'),
  project_id: z
    .string()
    .uuid('Please select a project'),
  is_urgent: z.boolean().default(false),
  is_important: z.boolean().default(false),
});

export type QuickTaskFormData = z.infer<typeof quickTaskSchema>;
