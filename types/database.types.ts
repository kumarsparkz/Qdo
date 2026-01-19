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
      checklist_items: {
        Row: {
          id: string
          task_id: string
          title: string
          is_completed: boolean
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          task_id: string
          title: string
          is_completed?: boolean
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          title?: string
          is_completed?: boolean
          position?: number
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
