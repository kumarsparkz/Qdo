/**
 * Project Form Validation Schemas
 *
 * Zod schemas for project forms with React Hook Form integration.
 */

import { z } from 'zod';

/**
 * Create Project Form Schema
 */
export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Project name is required')
    .max(100, 'Project name must be 100 characters or less'),
  description: z
    .string()
    .max(500, 'Description must be 500 characters or less')
    .optional()
    .or(z.literal('')),
});

export type CreateProjectFormData = z.infer<typeof createProjectSchema>;

/**
 * Update Project Form Schema
 */
export const updateProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Project name is required')
    .max(100, 'Project name must be 100 characters or less')
    .optional(),
  description: z
    .string()
    .max(500, 'Description must be 500 characters or less')
    .optional()
    .or(z.literal('')),
});

export type UpdateProjectFormData = z.infer<typeof updateProjectSchema>;
