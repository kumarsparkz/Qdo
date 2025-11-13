import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { Project, Task, TaskWithProject } from '../types'
import { useAuth } from './AuthContext'

interface DataContextType {
  projects: Project[]
  tasks: Task[]
  tasksWithProjects: TaskWithProject[]
  selectedProjectId: string | null
  setSelectedProjectId: (id: string | null) => void
  loading: boolean
  refreshProjects: () => Promise<void>
  refreshTasks: () => Promise<void>
  createProject: (name: string, description?: string) => Promise<Project | null>
  updateProject: (id: string, name: string, description?: string) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  createTask: (task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<Task | null>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [tasksWithProjects, setTasksWithProjects] = useState<TaskWithProject[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      refreshProjects()
      refreshTasks()
    } else {
      setProjects([])
      setTasks([])
      setTasksWithProjects([])
      setLoading(false)
    }
  }, [user])

  const refreshProjects = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }

  const refreshTasks = async () => {
    if (!user) return

    try {
      setLoading(true)

      // Fetch tasks with project information
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          projects (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setTasks(data || [])
      setTasksWithProjects(data || [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const createProject = async (name: string, description?: string): Promise<Project | null> => {
    if (!user) return null

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name,
          description: description || null,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) throw error

      await refreshProjects()
      return data
    } catch (error) {
      console.error('Error creating project:', error)
      return null
    }
  }

  const updateProject = async (id: string, name: string, description?: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          name,
          description: description || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw error
      await refreshProjects()
    } catch (error) {
      console.error('Error updating project:', error)
      throw error
    }
  }

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id)
      if (error) throw error
      await refreshProjects()
      await refreshTasks()
    } catch (error) {
      console.error('Error deleting project:', error)
      throw error
    }
  }

  const createTask = async (
    task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ): Promise<Task | null> => {
    if (!user) return null

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          ...task,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) throw error

      await refreshTasks()
      return data
    } catch (error) {
      console.error('Error creating task:', error)
      return null
    }
  }

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw error
      await refreshTasks()
    } catch (error) {
      console.error('Error updating task:', error)
      throw error
    }
  }

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', id)
      if (error) throw error
      await refreshTasks()
    } catch (error) {
      console.error('Error deleting task:', error)
      throw error
    }
  }

  return (
    <DataContext.Provider
      value={{
        projects,
        tasks,
        tasksWithProjects,
        selectedProjectId,
        setSelectedProjectId,
        loading,
        refreshProjects,
        refreshTasks,
        createProject,
        updateProject,
        deleteProject,
        createTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
