'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Checkbox } from './ui/checkbox'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import type { ChecklistItem } from '@/src/features/checklists/types'

interface ChecklistProps {
  taskId?: string
  items: ChecklistItem[]
  onItemToggle?: (id: string, isCompleted: boolean) => void
  onItemAdd?: (title: string) => void
  onItemDelete?: (id: string) => void
  onItemUpdate?: (id: string, title: string) => void
  readOnly?: boolean
}

export function Checklist({
  items,
  onItemToggle,
  onItemAdd,
  onItemDelete,
  onItemUpdate,
  readOnly = false,
}: ChecklistProps) {
  const [newItemTitle, setNewItemTitle] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')

  const handleAddItem = () => {
    if (newItemTitle.trim() && onItemAdd) {
      onItemAdd(newItemTitle.trim())
      setNewItemTitle('')
    }
  }

  const handleStartEdit = (item: ChecklistItem) => {
    setEditingId(item.id)
    setEditingTitle(item.title)
  }

  const handleSaveEdit = (id: string) => {
    if (editingTitle.trim() && onItemUpdate) {
      onItemUpdate(id, editingTitle.trim())
    }
    setEditingId(null)
    setEditingTitle('')
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingTitle('')
  }

  const completedCount = items.filter((item) => item.is_completed).length
  const totalCount = items.length

  return (
    <div className="space-y-3">
      {/* Progress indicator */}
      {totalCount > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            {completedCount} of {totalCount} completed
          </span>
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Checklist items */}
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-2 p-2 rounded-lg border bg-card hover:bg-accent/50 transition-colors group"
          >
            {!readOnly && (
              <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
            )}

            <Checkbox
              checked={item.is_completed}
              onCheckedChange={(checked) => {
                if (onItemToggle) {
                  onItemToggle(item.id, checked as boolean)
                }
              }}
              disabled={readOnly}
            />

            {editingId === item.id ? (
              <div className="flex-1 flex items-center gap-2">
                <Input
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveEdit(item.id)
                    } else if (e.key === 'Escape') {
                      handleCancelEdit()
                    }
                  }}
                  className="h-8"
                  autoFocus
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleSaveEdit(item.id)}
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <>
                <span
                  className={`flex-1 ${
                    item.is_completed
                      ? 'line-through text-muted-foreground'
                      : ''
                  }`}
                  onDoubleClick={() => !readOnly && handleStartEdit(item)}
                >
                  {item.title}
                </span>

                {!readOnly && onItemDelete && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onItemDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Add new item */}
      {!readOnly && onItemAdd && (
        <div className="flex items-center gap-2">
          <Input
            placeholder="Add checklist item..."
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddItem()
              }
            }}
          />
          <Button
            size="sm"
            onClick={handleAddItem}
            disabled={!newItemTitle.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

interface SimpleChecklistProps {
  items: { title: string; is_completed: boolean }[]
  onChange: (items: { title: string; is_completed: boolean }[]) => void
}

export function SimpleChecklist({ items, onChange }: SimpleChecklistProps) {
  const [newItemTitle, setNewItemTitle] = useState('')

  const handleToggle = (index: number) => {
    const newItems = [...items]
    newItems[index].is_completed = !newItems[index].is_completed
    onChange(newItems)
  }

  const handleAdd = () => {
    if (newItemTitle.trim()) {
      onChange([...items, { title: newItemTitle.trim(), is_completed: false }])
      setNewItemTitle('')
    }
  }

  const handleDelete = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    onChange(newItems)
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-2 p-2 rounded-lg border bg-card group"
        >
          <Checkbox
            checked={item.is_completed}
            onCheckedChange={() => handleToggle(index)}
          />
          <span
            className={`flex-1 ${
              item.is_completed ? 'line-through text-muted-foreground' : ''
            }`}
          >
            {item.title}
          </span>
          <Button
            size="sm"
            variant="ghost"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => handleDelete(index)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}

      <div className="flex items-center gap-2">
        <Input
          placeholder="Add item..."
          value={newItemTitle}
          onChange={(e) => setNewItemTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAdd()
            }
          }}
        />
        <Button
          size="sm"
          onClick={handleAdd}
          disabled={!newItemTitle.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
