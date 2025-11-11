'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/navbar'
import TaskCard from '@/components/task-card'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

interface Task {
  id: string
  title: string
  description: string | null
  is_urgent: boolean
  is_important: boolean
  priority: 'must_have' | 'nice_to_have'
  status: 'todo' | 'in_progress' | 'blocked' | 'done'
}

export default function BlockedPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [userEmail, setUserEmail] = useState('')
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    fetchUserAndTasks()
  }, [])

  const fetchUserAndTasks = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUserEmail(user.email || '')
      await fetchTasks()
    }
    setLoading(false)
  }

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('status', 'blocked')
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching tasks:', error)
    } else {
      setTasks(data || [])
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
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="h-8 w-8 text-red-600" />
            <h2 className="text-3xl font-bold">Blocked Tasks</h2>
          </div>
          <p className="text-muted-foreground">
            Tasks that need attention to unblock ({tasks.length})
          </p>
        </div>

        {tasks.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <AlertCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Blocked Tasks</h3>
                <p className="text-muted-foreground">
                  Tasks you mark as blocked will appear here
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map(task => (
              <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
