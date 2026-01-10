'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { Edit, AlertCircle, Calendar as CalendarIcon, FileText, FolderOpen, Zap, Star, Flag } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Calendar } from './ui/calendar'
import { format, parseISO } from 'date-fns'
import { cn } from '@/lib/utils'

interface Project {
  id: string
  name: string
}

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

interface EditTaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projects: Project[]
  task: Task | null
  onTaskUpdated: () => void
}

export default function EditTaskModal({
  open,
  onOpenChange,
  projects,
  task,
  onTaskUpdated
}: EditTaskModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedProject, setSelectedProject] = useState<string>('')
  const [isUrgent, setIsUrgent] = useState<boolean>(false)
  const [isImportant, setIsImportant] = useState<boolean>(false)
  const [priority, setPriority] = useState<'must_have' | 'nice_to_have'>('nice_to_have')
  const [deadline, setDeadline] = useState<Date>()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  // Populate form when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || '')
      setSelectedProject(task.project_id)
      setIsUrgent(task.is_urgent)
      setIsImportant(task.is_important)
      setPriority(task.priority)
      setDeadline(task.deadline ? parseISO(task.deadline) : undefined)
      setError('')
    }
  }, [task])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!task) return

    if (!title.trim()) {
      setError('Please enter a task title')
      return
    }

    if (!selectedProject) {
      setError('Please select a project')
      return
    }

    setLoading(true)

    try {
      const { error: updateError } = await supabase
        .from('tasks')
        .update({
          title: title.trim(),
          description: description.trim() || null,
          project_id: selectedProject,
          is_urgent: isUrgent,
          is_important: isImportant,
          priority,
          deadline: deadline ? format(deadline, 'yyyy-MM-dd') : null,
        })
        .eq('id', task.id)

      if (updateError) throw updateError

      onTaskUpdated()
      onOpenChange(false)
    } catch (err) {
      console.error('Error updating task:', err)
      setError('Failed to update task. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!task) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Edit Task
          </DialogTitle>
          <DialogDescription>
            Update task details, urgency, importance, priority, and deadline
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div>
            <label className="text-sm font-medium mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-600" />
              Task Title *
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              disabled={loading}
              className="border-slate-200 focus:border-indigo-400 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-600" />
              Description (Markdown supported)
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description... Supports **bold**, *italic*, [links](url), etc."
              rows={4}
              disabled={loading}
              className="border-slate-200 focus:border-indigo-400 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-indigo-600" />
              Project *
            </label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border-slate-200 focus:border-indigo-400"
              disabled={loading}
            >
              <option value="">Select a project...</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-indigo-600" />
              Deadline (Optional)
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-slate-200 hover:border-indigo-400",
                    !deadline && "text-muted-foreground"
                  )}
                  disabled={loading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? format(deadline, 'PPP') : <span>Pick a deadline</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={setDeadline}
                  initialFocus
                />
                {deadline && (
                  <div className="p-3 border-t">
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full text-sm"
                      onClick={() => setDeadline(undefined)}
                    >
                      Clear deadline
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 flex items-center gap-2">
              <Zap className="h-4 w-4 text-indigo-600" />
              Urgency *
            </label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={isUrgent === true ? 'default' : 'outline'}
                onClick={() => setIsUrgent(true)}
                disabled={loading}
                className={cn(
                  "flex-1",
                  isUrgent === true && "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                )}
              >
                <Zap className="mr-2 h-4 w-4" />
                Urgent
              </Button>
              <Button
                type="button"
                variant={isUrgent === false ? 'default' : 'outline'}
                onClick={() => setIsUrgent(false)}
                disabled={loading}
                className={cn(
                  "flex-1",
                  isUrgent === false && "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                )}
              >
                Not Urgent
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 flex items-center gap-2">
              <Star className="h-4 w-4 text-indigo-600" />
              Importance *
            </label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={isImportant === true ? 'default' : 'outline'}
                onClick={() => setIsImportant(true)}
                disabled={loading}
                className={cn(
                  "flex-1",
                  isImportant === true && "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                )}
              >
                <Star className="mr-2 h-4 w-4" />
                Important
              </Button>
              <Button
                type="button"
                variant={isImportant === false ? 'default' : 'outline'}
                onClick={() => setIsImportant(false)}
                disabled={loading}
                className={cn(
                  "flex-1",
                  isImportant === false && "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                )}
              >
                Not Important
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 flex items-center gap-2">
              <Flag className="h-4 w-4 text-indigo-600" />
              Priority *
            </label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={priority === 'must_have' ? 'default' : 'outline'}
                onClick={() => setPriority('must_have')}
                disabled={loading}
                className={cn(
                  "flex-1",
                  priority === 'must_have' && "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                )}
              >
                <Flag className="mr-2 h-4 w-4" />
                Must Have
              </Button>
              <Button
                type="button"
                variant={priority === 'nice_to_have' ? 'default' : 'outline'}
                onClick={() => setPriority('nice_to_have')}
                disabled={loading}
                className={cn(
                  "flex-1",
                  priority === 'nice_to_have' && "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                )}
              >
                Nice to Have
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            >
              <Edit className="mr-2 h-4 w-4" />
              {loading ? 'Updating...' : 'Update Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
