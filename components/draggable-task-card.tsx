'use client'

import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import TaskCard from './task-card'
import { GripVertical } from 'lucide-react'

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

interface DraggableTaskCardProps {
  task: Task
  onStatusChange: (taskId: string, status: Task['status']) => void
  onEdit?: (task: Task) => void
}

export default function DraggableTaskCard({ task, onStatusChange, onEdit }: DraggableTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: {
      task
    }
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab'
  }

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div
        {...listeners}
        {...attributes}
        className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-10"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className={isDragging ? 'pointer-events-none' : ''}>
        <TaskCard task={task} onStatusChange={onStatusChange} onEdit={onEdit} />
      </div>
    </div>
  )
}
