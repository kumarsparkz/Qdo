/**
 * Projects API
 *
 * All project-related API calls isolated in one file.
 */

import { createClient } from '@/lib/supabase/client';
import type { Project, CreateProjectInput, UpdateProjectInput } from './types';

const supabase = createClient();

export const projectsApi = {
  /**
   * Fetch all projects for the current user
   */
  getAll: async (): Promise<Project[]> => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Project[];
  },

  /**
   * Fetch a single project by ID
   */
  getById: async (id: string): Promise<Project> => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Project;
  },

  /**
   * Create a new project
   */
  create: async (input: CreateProjectInput): Promise<Project> => {
    const { data, error } = await supabase
      .from('projects')
      .insert(input)
      .select()
      .single();

    if (error) throw error;
    return data as Project;
  },

  /**
   * Update an existing project
   */
  update: async (id: string, input: UpdateProjectInput): Promise<Project> => {
    const { data, error } = await supabase
      .from('projects')
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Project;
  },

  /**
   * Delete a project
   */
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
