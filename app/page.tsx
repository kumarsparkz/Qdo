'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/navbar'
import TaskCard from '@/components/task-card'
import CreateTaskModal from '@/components/create-task-modal'
import ProjectModal from '@/components/project-modal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, FolderPlus } from 'lucide-react'

interface Task {
  id: string
  title: string
  description: string | null
  project_id: string
  is_urgent: boolean
  is_important: boolean
  priority: 'must_have' | 'nice_to_have'
  status: 'todo' | 'in_progress' | 'blocked' | 'done'
  deadline: string | null
}

interface Project {
  id: string
  name: string
  description: string | null
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([])
  const [userEmail, setUserEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [projectModalOpen, setProjectModalOpen] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    fetchUserAndData()
  }, [])

  const fetchUserAndData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUserEmail(user.email || '')
      await Promise.all([fetchTasks(), fetchProjects()])
    }
    setLoading(false)
  }

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .not('status', 'in', '(done,blocked)')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching tasks:', error)
    } else {
      setTasks(data || [])
    }
  }

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching projects:', error)
    } else {
      setProjects(data || [])
    }
  }

  const handleStatusChange = async (taskId: string, status: Task['status']) => {
    const { error } = await supabase
      .from('tasks')
      .update({ status })
      .eq('id', taskId)

    if (error) {
      console.error('Error updating task:', error)
    } else {
      fetchTasks()
    }
  }

  const toggleProjectFilter = (projectId: string) => {
    setSelectedProjectIds(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    )
  }

  const sortTasks = (tasks: Task[]) => {
    return [...tasks].sort((a, b) => {
      // First sort by priority (must_have first)
      if (a.priority === 'must_have' && b.priority !== 'must_have') return -1
      if (a.priority !== 'must_have' && b.priority === 'must_have') return 1
      // Then by creation date
      return 0
    })
  }

  // Filter tasks by selected projects (if any are selected)
  const filteredTasks = selectedProjectIds.length > 0
    ? tasks.filter(task => selectedProjectIds.includes(task.project_id))
    : tasks

  // Categorize tasks into quadrants
  const urgentImportant = sortTasks(filteredTasks.filter(t => t.is_urgent && t.is_important))
  const urgentNotImportant = sortTasks(filteredTasks.filter(t => t.is_urgent && !t.is_important))
  const notUrgentImportant = sortTasks(filteredTasks.filter(t => !t.is_urgent && t.is_important))
  const notUrgentNotImportant = sortTasks(filteredTasks.filter(t => !t.is_urgent && !t.is_important))

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar userEmail={userEmail} />

      <main className="container mx-auto px-4 py-8">
        {/* Projects Section */}
        {projects.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FolderPlus className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">
                  Projects ({projects.length})
                  {selectedProjectIds.length > 0 && (
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      • {selectedProjectIds.length} selected
                    </span>
                  )}
                </h3>
              </div>
              {selectedProjectIds.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedProjectIds([])}
                  className="text-xs"
                >
                  Clear Filter
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {projects.map((project) => {
                const isSelected = selectedProjectIds.includes(project.id)
                return (
                  <button
                    key={project.id}
                    onClick={() => toggleProjectFilter(project.id)}
                    className={`border rounded-lg px-4 py-2 shadow-sm hover:shadow-md transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <p className="font-medium">{project.name}</p>
                    {project.description && (
                      <p className={`text-xs ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        {project.description}
                      </p>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">Eisenhower Matrix</h2>
            <p className="text-muted-foreground mt-1">
              Organize tasks by urgency and importance
            </p>
          </div>
          <div className="flex gap-2">
            {projects.length === 0 ? (
              <Button onClick={() => setProjectModalOpen(true)} variant="outline">
                <FolderPlus className="mr-2 h-4 w-4" />
                Create Project First
              </Button>
            ) : (
              <>
                <Button onClick={() => setProjectModalOpen(true)} variant="outline" size="lg">
                  <FolderPlus className="mr-2 h-5 w-5" />
                  New Project
                </Button>
                <Button
                  onClick={() => setTaskModalOpen(true)}
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Add Task
                </Button>
              </>
            )}
          </div>
        </div>

        {projects.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <FolderPlus className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Projects Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first project to start organizing your tasks
                </p>
                <Button onClick={() => setProjectModalOpen(true)}>
                  <FolderPlus className="mr-2 h-4 w-4" />
                  Create Your First Project
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quadrant 1: Urgent & Important */}
            <Card className="border-red-200 bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl shadow-md">
              <CardHeader className="bg-red-100/50 rounded-t-2xl">
                <CardTitle className="text-red-900 flex items-center justify-between">
                  <span>🔥 Urgent & Important</span>
                  <span className="text-sm font-normal">({urgentImportant.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-3 max-h-[600px] overflow-y-auto">
                {urgentImportant.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No tasks in this quadrant</p>
                ) : (
                  urgentImportant.map(task => (
                    <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} />
                  ))
                )}
              </CardContent>
            </Card>

            {/* Quadrant 2: Urgent & Not Important */}
            <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl shadow-md">
              <CardHeader className="bg-orange-100/50 rounded-t-2xl">
                <CardTitle className="text-orange-900 flex items-center justify-between">
                  <span>⚡ Urgent & Not Important</span>
                  <span className="text-sm font-normal">({urgentNotImportant.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-3 max-h-[600px] overflow-y-auto">
                {urgentNotImportant.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No tasks in this quadrant</p>
                ) : (
                  urgentNotImportant.map(task => (
                    <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} />
                  ))
                )}
              </CardContent>
            </Card>

            {/* Quadrant 3: Not Urgent & Important */}
            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-md">
              <CardHeader className="bg-blue-100/50 rounded-t-2xl">
                <CardTitle className="text-blue-900 flex items-center justify-between">
                  <span>📅 Not Urgent & Important</span>
                  <span className="text-sm font-normal">({notUrgentImportant.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-3 max-h-[600px] overflow-y-auto">
                {notUrgentImportant.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No tasks in this quadrant</p>
                ) : (
                  notUrgentImportant.map(task => (
                    <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} />
                  ))
                )}
              </CardContent>
            </Card>

            {/* Quadrant 4: Not Urgent & Not Important */}
            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-md">
              <CardHeader className="bg-green-100/50 rounded-t-2xl">
                <CardTitle className="text-green-900 flex items-center justify-between">
                  <span>🌱 Not Urgent & Not Important</span>
                  <span className="text-sm font-normal">({notUrgentNotImportant.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-3 max-h-[600px] overflow-y-auto">
                {notUrgentNotImportant.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No tasks in this quadrant</p>
                ) : (
                  notUrgentNotImportant.map(task => (
                    <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} />
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <CreateTaskModal
        open={taskModalOpen}
        onOpenChange={setTaskModalOpen}
        projects={projects}
        onTaskCreated={fetchTasks}
      />

      <ProjectModal
        open={projectModalOpen}
        onOpenChange={setProjectModalOpen}
        onProjectCreated={fetchProjects}
      />

      {/* Floating Action Button */}
      {projects.length > 0 && (
        <button
          onClick={() => setTaskModalOpen(true)}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full p-4 shadow-xl transition-all hover:scale-110 hover:shadow-2xl"
          aria-label="Add new task"
        >
          <Plus className="h-6 w-6" />
        </button>
      )}
    </div>
  )
}
