'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { AlertCircle } from 'lucide-react'

interface ProjectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProjectCreated: () => void
}

export default function ProjectModal({
  open,
  onOpenChange,
  onProjectCreated
}: ProjectModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Please enter a project name')
      return
    }

    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setError('You must be logged in to create projects')
        return
      }

      const { error: insertError } = await supabase
        .from('projects')
        .insert({
          name: name.trim(),
          description: description.trim() || null,
          user_id: user.id,
        })

      if (insertError) throw insertError

      // Reset form
      setName('')
      setDescription('')

      onProjectCreated()
      onOpenChange(false)
    } catch (err) {
      console.error('Error creating project:', err)
      setError('Failed to create project. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Create a project to organize your tasks
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
            <label className="text-sm font-medium mb-2 block">Project Name *</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name..."
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter project description..."
              rows={3}
              disabled={loading}
            />
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
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
