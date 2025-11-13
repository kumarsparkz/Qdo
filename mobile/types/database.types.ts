export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          project_id: string
          user_id: string
          is_urgent: boolean
          is_important: boolean
          priority: 'must_have' | 'nice_to_have'
          status: 'todo' | 'in_progress' | 'blocked' | 'done'
          deadline: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          project_id: string
          user_id: string
          is_urgent: boolean
          is_important: boolean
          priority: 'must_have' | 'nice_to_have'
          status?: 'todo' | 'in_progress' | 'blocked' | 'done'
          deadline?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          project_id?: string
          user_id?: string
          is_urgent?: boolean
          is_important?: boolean
          priority?: 'must_have' | 'nice_to_have'
          status?: 'todo' | 'in_progress' | 'blocked' | 'done'
          deadline?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      task_priority: 'must_have' | 'nice_to_have'
      task_status: 'todo' | 'in_progress' | 'blocked' | 'done'
    }
  }
}

// Convenience types for mobile app
export type Project = Database['public']['Tables']['projects']['Row']
export type Task = Database['public']['Tables']['tasks']['Row']
export type TaskInsert = Database['public']['Tables']['tasks']['Insert']
export type TaskUpdate = Database['public']['Tables']['tasks']['Update']
export type ProjectInsert = Database['public']['Tables']['projects']['Insert']
export type ProjectUpdate = Database['public']['Tables']['projects']['Update']

export type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'done'
export type TaskPriority = 'must_have' | 'nice_to_have'

// Task with project information
export type TaskWithProject = Task & {
  projects: Project
}
