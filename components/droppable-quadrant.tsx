'use client'

import { useDroppable } from '@dnd-kit/core'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { ReactNode } from 'react'

interface DroppableQuadrantProps {
  id: string
  title: string
  emoji: string
  count: number
  colorClasses: {
    border: string
    gradient: string
    header: string
    text: string
  }
  children: ReactNode
  isUrgent: boolean
  isImportant: boolean
}

export default function DroppableQuadrant({
  id,
  title,
  emoji,
  count,
  colorClasses,
  children,
  isUrgent,
  isImportant
}: DroppableQuadrantProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      isUrgent,
      isImportant
    }
  })

  return (
    <Card
      ref={setNodeRef}
      className={`${colorClasses.border} ${colorClasses.gradient} rounded-2xl shadow-md transition-all ${
        isOver ? 'ring-4 ring-indigo-400 scale-[1.02]' : ''
      }`}
    >
      <CardHeader className={`${colorClasses.header} rounded-t-2xl`}>
        <CardTitle className={`${colorClasses.text} flex items-center justify-between`}>
          <span>
            {emoji} {title}
          </span>
          <span className="text-sm font-normal">({count})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-3 max-h-[600px] overflow-y-auto">
        {count === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No tasks in this quadrant</p>
            {isOver && (
              <p className="text-sm text-indigo-600 mt-2 font-medium">Drop here to move task</p>
            )}
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  )
}
