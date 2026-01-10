'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/navbar'
import TaskCard from '@/components/task-card'
import EditTaskModal from '@/components/edit-task-modal'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, List, LayoutGrid } from 'lucide-react'
import { format, parseISO } from 'date-fns'

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
  created_at: string
  updated_at: string
}

interface Project {
  id: string
  name: string
}

export default function DonePage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [userEmail, setUserEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [editTaskModalOpen, setEditTaskModalOpen] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table')

  const supabase = createClient()

  useEffect(() => {
    fetchUserAndTasks()
  }, [])

  const fetchUserAndTasks = async () => {
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
      .eq('status', 'done')
      .order('updated_at', { ascending: false })

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

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task)
    setEditTaskModalOpen(true)
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
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
                <h2 className="text-3xl font-bold">Completed Tasks</h2>
              </div>
              <p className="text-muted-foreground">
                All your finished tasks ({tasks.length})
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                <List className="mr-2 h-4 w-4" />
                Table
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="mr-2 h-4 w-4" />
                Grid
              </Button>
            </div>
          </div>
        </div>

        {tasks.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <CheckCircle2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Completed Tasks</h3>
                <p className="text-muted-foreground">
                  Tasks you mark as done will appear here
                </p>
              </div>
            </CardContent>
          </Card>
        ) : viewMode === 'table' ? (
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Task Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tasks.map(task => (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{task.title}</div>
                        {task.description && (
                          <div className="text-sm text-gray-500 line-clamp-2 mt-1">
                            {task.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(parseISO(task.created_at), 'MMM d, yyyy h:mm a')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(parseISO(task.updated_at), 'MMM d, yyyy h:mm a')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditTask(task)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(task.id, 'todo')}
                          >
                            Reopen
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map(task => (
              <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} onEdit={handleEditTask} />
            ))}
          </div>
        )}
      </main>

      <EditTaskModal
        open={editTaskModalOpen}
        onOpenChange={setEditTaskModalOpen}
        projects={projects}
        task={taskToEdit}
        onTaskUpdated={fetchTasks}
      />
    </div>
  )
}
