'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/navbar'
import DraggableTaskCard from '@/components/draggable-task-card'
import TaskCard from '@/components/task-card'
import CreateTaskModal from '@/components/create-task-modal'
import ProjectModal from '@/components/project-modal'
import FilterBar, { FilterOptions } from '@/components/filter-bar'
import DroppableQuadrant from '@/components/droppable-quadrant'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, FolderPlus } from 'lucide-react'
import { parseISO, isPast, isToday, isThisWeek, isThisMonth, startOfToday } from 'date-fns'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core'

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
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    status: [],
    deadline: [],
    priority: []
  })
  const [activeTask, setActiveTask] = useState<Task | null>(null)

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

  const handleDragStart = (event: DragStartEvent) => {
    const task = event.active.data.current?.task as Task
    setActiveTask(task)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const task = active.data.current?.task as Task
    const targetQuadrant = over.data.current as { isUrgent: boolean; isImportant: boolean }

    // Check if task is being moved to a different quadrant
    if (
      task.is_urgent === targetQuadrant.isUrgent &&
      task.is_important === targetQuadrant.isImportant
    ) {
      return // No change needed
    }

    // Update task urgency and importance
    const { error } = await supabase
      .from('tasks')
      .update({
        is_urgent: targetQuadrant.isUrgent,
        is_important: targetQuadrant.isImportant
      })
      .eq('id', task.id)

    if (error) {
      console.error('Error updating task:', error)
    } else {
      fetchTasks()
    }
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

  const applyFilters = (tasksToFilter: Task[]) => {
    let result = tasksToFilter

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(task =>
        task.title.toLowerCase().includes(searchLower) ||
        (task.description && task.description.toLowerCase().includes(searchLower))
      )
    }

    // Apply status filter
    if (filters.status.length > 0) {
      result = result.filter(task => filters.status.includes(task.status))
    }

    // Apply deadline filter
    if (filters.deadline.length > 0) {
      result = result.filter(task => {
        if (!task.deadline && filters.deadline.includes('no-deadline')) {
          return true
        }

        if (task.deadline) {
          const deadlineDate = parseISO(task.deadline)
          const today = startOfToday()

          if (filters.deadline.includes('overdue') && isPast(deadlineDate) && !isToday(deadlineDate)) {
            return true
          }
          if (filters.deadline.includes('today') && isToday(deadlineDate)) {
            return true
          }
          if (filters.deadline.includes('this-week') && isThisWeek(deadlineDate, { weekStartsOn: 0 })) {
            return true
          }
          if (filters.deadline.includes('this-month') && isThisMonth(deadlineDate)) {
            return true
          }
        }

        return false
      })
    }

    // Apply priority filter
    if (filters.priority.length > 0) {
      result = result.filter(task => filters.priority.includes(task.priority))
    }

    return result
  }

  // Filter tasks by selected projects (if any are selected)
  const projectFilteredTasks = selectedProjectIds.length > 0
    ? tasks.filter(task => selectedProjectIds.includes(task.project_id))
    : tasks

  // Apply all filters
  const filteredTasks = applyFilters(projectFilteredTasks)

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

        {/* Filter Bar */}
        {projects.length > 0 && (
          <div className="mb-6">
            <FilterBar filters={filters} onFilterChange={setFilters} />
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
          <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quadrant 1: Urgent & Important */}
              <DroppableQuadrant
                id="quadrant-urgent-important"
                title="Urgent & Important"
                emoji="🔥"
                count={urgentImportant.length}
                colorClasses={{
                  border: 'border-red-200',
                  gradient: 'bg-gradient-to-br from-red-50 to-rose-50',
                  header: 'bg-red-100/50',
                  text: 'text-red-900'
                }}
                isUrgent={true}
                isImportant={true}
              >
                {urgentImportant.map(task => (
                  <DraggableTaskCard key={task.id} task={task} onStatusChange={handleStatusChange} />
                ))}
              </DroppableQuadrant>

              {/* Quadrant 2: Urgent & Not Important */}
              <DroppableQuadrant
                id="quadrant-urgent-notimportant"
                title="Urgent & Not Important"
                emoji="⚡"
                count={urgentNotImportant.length}
                colorClasses={{
                  border: 'border-orange-200',
                  gradient: 'bg-gradient-to-br from-orange-50 to-amber-50',
                  header: 'bg-orange-100/50',
                  text: 'text-orange-900'
                }}
                isUrgent={true}
                isImportant={false}
              >
                {urgentNotImportant.map(task => (
                  <DraggableTaskCard key={task.id} task={task} onStatusChange={handleStatusChange} />
                ))}
              </DroppableQuadrant>

              {/* Quadrant 3: Not Urgent & Important */}
              <DroppableQuadrant
                id="quadrant-noturgent-important"
                title="Not Urgent & Important"
                emoji="📅"
                count={notUrgentImportant.length}
                colorClasses={{
                  border: 'border-blue-200',
                  gradient: 'bg-gradient-to-br from-blue-50 to-indigo-50',
                  header: 'bg-blue-100/50',
                  text: 'text-blue-900'
                }}
                isUrgent={false}
                isImportant={true}
              >
                {notUrgentImportant.map(task => (
                  <DraggableTaskCard key={task.id} task={task} onStatusChange={handleStatusChange} />
                ))}
              </DroppableQuadrant>

              {/* Quadrant 4: Not Urgent & Not Important */}
              <DroppableQuadrant
                id="quadrant-noturgent-notimportant"
                title="Not Urgent & Not Important"
                emoji="🌱"
                count={notUrgentNotImportant.length}
                colorClasses={{
                  border: 'border-green-200',
                  gradient: 'bg-gradient-to-br from-green-50 to-emerald-50',
                  header: 'bg-green-100/50',
                  text: 'text-green-900'
                }}
                isUrgent={false}
                isImportant={false}
              >
                {notUrgentNotImportant.map(task => (
                  <DraggableTaskCard key={task.id} task={task} onStatusChange={handleStatusChange} />
                ))}
              </DroppableQuadrant>
            </div>

            {/* Drag Overlay */}
            <DragOverlay>
              {activeTask ? (
                <div className="opacity-80">
                  <TaskCard task={activeTask} onStatusChange={() => {}} />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
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
