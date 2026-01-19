'use client'

import { Card, CardContent, CardHeader } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Clock, AlertTriangle, Star, Circle, Calendar, Edit, CheckSquare } from 'lucide-react'
import { useState } from 'react'
import { format, isPast, isToday, isTomorrow, parseISO } from 'date-fns'
import { useChecklistItems } from '@/src/features/checklists/hooks/useChecklists'

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

interface TaskCardProps {
  task: Task
  onStatusChange: (taskId: string, status: Task['status']) => void
  onEdit?: (task: Task) => void
}

export default function TaskCard({ task, onStatusChange, onEdit }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false)

  // Fetch checklist items for this task
  const { data: checklistItems = [] } = useChecklistItems(task.id)

  // Calculate checklist progress
  const checklistTotal = checklistItems.length
  const checklistCompleted = checklistItems.filter(item => item.is_completed).length
  const hasChecklist = checklistTotal > 0

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'done':
        return 'bg-green-500 hover:bg-green-600'
      case 'in_progress':
        return 'bg-blue-500 hover:bg-blue-600'
      case 'blocked':
        return 'bg-red-500 hover:bg-red-600'
      default:
        return 'bg-gray-500 hover:bg-gray-600'
    }
  }

  const getStatusLabel = (status: Task['status']) => {
    switch (status) {
      case 'in_progress':
        return 'In Progress'
      case 'blocked':
        return 'Blocked'
      case 'done':
        return 'Done'
      default:
        return 'To Do'
    }
  }

  const getDeadlineInfo = () => {
    if (!task.deadline) return null

    const deadlineDate = parseISO(task.deadline)
    const isOverdue = isPast(deadlineDate) && !isToday(deadlineDate)

    let label = ''
    let color = ''

    if (isOverdue) {
      label = `Overdue: ${format(deadlineDate, 'MMM d, yyyy')}`
      color = 'bg-red-100 text-red-700 border-red-300'
    } else if (isToday(deadlineDate)) {
      label = 'Due Today'
      color = 'bg-orange-100 text-orange-700 border-orange-300'
    } else if (isTomorrow(deadlineDate)) {
      label = 'Due Tomorrow'
      color = 'bg-yellow-100 text-yellow-700 border-yellow-300'
    } else {
      label = `Due: ${format(deadlineDate, 'MMM d, yyyy')}`
      color = 'bg-blue-100 text-blue-700 border-blue-300'
    }

    return { label, color }
  }

  const deadlineInfo = getDeadlineInfo()

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">{task.title}</h3>
            <div className="flex flex-wrap gap-2">
              {task.priority === 'must_have' && (
                <Badge variant="destructive" className="text-xs">
                  <Star className="mr-1 h-3 w-3" />
                  Must Have
                </Badge>
              )}
              {task.priority === 'nice_to_have' && (
                <Badge variant="secondary" className="text-xs">
                  <Circle className="mr-1 h-3 w-3" />
                  Nice to Have
                </Badge>
              )}
              {deadlineInfo && (
                <Badge className={`text-xs border ${deadlineInfo.color}`}>
                  <Calendar className="mr-1 h-3 w-3" />
                  {deadlineInfo.label}
                </Badge>
              )}
              {hasChecklist && (
                <Badge className={`text-xs border ${
                  checklistCompleted === checklistTotal
                    ? 'bg-green-100 text-green-700 border-green-300'
                    : 'bg-slate-100 text-slate-700 border-slate-300'
                }`}>
                  <CheckSquare className="mr-1 h-3 w-3" />
                  {checklistCompleted}/{checklistTotal}
                </Badge>
              )}
            </div>
          </div>
          {onEdit && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(task)}
              className="ml-2"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {task.description && (
          <div
            className={`markdown-content text-sm ${!expanded && 'line-clamp-2'} cursor-pointer`}
            onClick={() => setExpanded(!expanded)}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {task.description}
            </ReactMarkdown>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={task.status === 'in_progress' ? 'default' : 'outline'}
            onClick={() => onStatusChange(task.id, task.status === 'in_progress' ? 'todo' : 'in_progress')}
            className={task.status === 'in_progress' ? getStatusColor('in_progress') : ''}
          >
            In Progress
          </Button>
          <Button
            size="sm"
            variant={task.status === 'blocked' ? 'default' : 'outline'}
            onClick={() => onStatusChange(task.id, task.status === 'blocked' ? 'todo' : 'blocked')}
            className={task.status === 'blocked' ? getStatusColor('blocked') : ''}
          >
            Blocked
          </Button>
          <Button
            size="sm"
            variant={task.status === 'done' ? 'default' : 'outline'}
            onClick={() => onStatusChange(task.id, task.status === 'done' ? 'todo' : 'done')}
            className={task.status === 'done' ? getStatusColor('done') : ''}
          >
            Done
          </Button>
        </div>
        {task.status !== 'todo' && (
          <div className="mt-2">
            <Badge className={getStatusColor(task.status)}>
              {getStatusLabel(task.status)}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
