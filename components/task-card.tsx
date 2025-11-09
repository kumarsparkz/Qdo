'use client'

import { Card, CardContent, CardHeader } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Clock, AlertTriangle, Star, Circle } from 'lucide-react'
import { useState } from 'react'

interface Task {
  id: string
  title: string
  description: string | null
  is_urgent: boolean
  is_important: boolean
  priority: 'must_have' | 'nice_to_have'
  status: 'todo' | 'in_progress' | 'blocked' | 'done'
}

interface TaskCardProps {
  task: Task
  onStatusChange: (taskId: string, status: Task['status']) => void
}

export default function TaskCard({ task, onStatusChange }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false)

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
            </div>
          </div>
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
            onClick={() => onStatusChange(task.id, 'in_progress')}
            className={task.status === 'in_progress' ? getStatusColor('in_progress') : ''}
          >
            In Progress
          </Button>
          <Button
            size="sm"
            variant={task.status === 'blocked' ? 'default' : 'outline'}
            onClick={() => onStatusChange(task.id, 'blocked')}
            className={task.status === 'blocked' ? getStatusColor('blocked') : ''}
          >
            Blocked
          </Button>
          <Button
            size="sm"
            variant={task.status === 'done' ? 'default' : 'outline'}
            onClick={() => onStatusChange(task.id, 'done')}
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
