/**
 * Checklist Form Validation Schemas
 *
 * Zod schemas for checklist forms with React Hook Form integration.
 */

import { z } from 'zod';

/**
 * Create Checklist Item Schema
 */
export const createChecklistItemSchema = z.object({
  task_id: z.string().uuid('Invalid task ID'),
  title: z
    .string()
    .min(1, 'Item title is required')
    .max(200, 'Item title must be 200 characters or less'),
  is_completed: z.boolean().default(false),
  position: z.number().int().min(0).default(0),
});

export type CreateChecklistItemFormData = z.infer<typeof createChecklistItemSchema>;

/**
 * Update Checklist Item Schema
 */
export const updateChecklistItemSchema = z.object({
  title: z
    .string()
    .min(1, 'Item title is required')
    .max(200, 'Item title must be 200 characters or less')
    .optional(),
  is_completed: z.boolean().optional(),
  position: z.number().int().min(0).optional(),
});

export type UpdateChecklistItemFormData = z.infer<typeof updateChecklistItemSchema>;

/**
 * Bulk Create Checklist Items Schema (for quick checklist creation)
 */
export const bulkCreateChecklistItemsSchema = z.object({
  task_id: z.string().uuid('Invalid task ID'),
  items: z.array(
    z.object({
      title: z
        .string()
        .min(1, 'Item title is required')
        .max(200, 'Item title must be 200 characters or less'),
      is_completed: z.boolean().default(false),
    })
  ).min(1, 'At least one item is required'),
});

export type BulkCreateChecklistItemsFormData = z.infer<typeof bulkCreateChecklistItemsSchema>;
