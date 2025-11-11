'use client'

import { Input } from './ui/input'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Search, X, Calendar, Flag, ListChecks } from 'lucide-react'
import { useState } from 'react'

export interface FilterOptions {
  search: string
  status: ('todo' | 'in_progress' | 'blocked' | 'done')[]
  deadline: ('overdue' | 'today' | 'this-week' | 'this-month' | 'no-deadline')[]
  priority: ('must_have' | 'nice_to_have')[]
}

interface FilterBarProps {
  filters: FilterOptions
  onFilterChange: (filters: FilterOptions) => void
}

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const [searchInput, setSearchInput] = useState(filters.search)

  const handleSearchChange = (value: string) => {
    setSearchInput(value)
    onFilterChange({ ...filters, search: value })
  }

  const toggleStatus = (status: 'todo' | 'in_progress' | 'blocked' | 'done') => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status]
    onFilterChange({ ...filters, status: newStatus })
  }

  const toggleDeadline = (deadline: 'overdue' | 'today' | 'this-week' | 'this-month' | 'no-deadline') => {
    const newDeadline = filters.deadline.includes(deadline)
      ? filters.deadline.filter(d => d !== deadline)
      : [...filters.deadline, deadline]
    onFilterChange({ ...filters, deadline: newDeadline })
  }

  const togglePriority = (priority: 'must_have' | 'nice_to_have') => {
    const newPriority = filters.priority.includes(priority)
      ? filters.priority.filter(p => p !== priority)
      : [...filters.priority, priority]
    onFilterChange({ ...filters, priority: newPriority })
  }

  const clearAllFilters = () => {
    setSearchInput('')
    onFilterChange({
      search: '',
      status: [],
      deadline: [],
      priority: []
    })
  }

  const hasActiveFilters = searchInput || filters.status.length > 0 || filters.deadline.length > 0 || filters.priority.length > 0

  return (
    <div className="bg-white rounded-lg border shadow-sm p-4 space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 border-slate-200 focus:border-indigo-400 focus:ring-indigo-400"
          />
        </div>
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={clearAllFilters}
            className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
          >
            <X className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {/* Filter Options */}
      <div className="space-y-3">
        {/* Status Filter */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ListChecks className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-medium">Status</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={filters.status.includes('todo') ? 'default' : 'outline'}
              className={`cursor-pointer transition-colors ${
                filters.status.includes('todo')
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                  : 'hover:bg-slate-100'
              }`}
              onClick={() => toggleStatus('todo')}
            >
              To Do
            </Badge>
            <Badge
              variant={filters.status.includes('in_progress') ? 'default' : 'outline'}
              className={`cursor-pointer transition-colors ${
                filters.status.includes('in_progress')
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                  : 'hover:bg-slate-100'
              }`}
              onClick={() => toggleStatus('in_progress')}
            >
              In Progress
            </Badge>
            <Badge
              variant={filters.status.includes('blocked') ? 'default' : 'outline'}
              className={`cursor-pointer transition-colors ${
                filters.status.includes('blocked')
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                  : 'hover:bg-slate-100'
              }`}
              onClick={() => toggleStatus('blocked')}
            >
              Blocked
            </Badge>
            <Badge
              variant={filters.status.includes('done') ? 'default' : 'outline'}
              className={`cursor-pointer transition-colors ${
                filters.status.includes('done')
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                  : 'hover:bg-slate-100'
              }`}
              onClick={() => toggleStatus('done')}
            >
              Done
            </Badge>
          </div>
        </div>

        {/* Deadline Filter */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-medium">Deadline</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={filters.deadline.includes('overdue') ? 'default' : 'outline'}
              className={`cursor-pointer transition-colors ${
                filters.deadline.includes('overdue')
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                  : 'hover:bg-slate-100'
              }`}
              onClick={() => toggleDeadline('overdue')}
            >
              Overdue
            </Badge>
            <Badge
              variant={filters.deadline.includes('today') ? 'default' : 'outline'}
              className={`cursor-pointer transition-colors ${
                filters.deadline.includes('today')
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                  : 'hover:bg-slate-100'
              }`}
              onClick={() => toggleDeadline('today')}
            >
              Today
            </Badge>
            <Badge
              variant={filters.deadline.includes('this-week') ? 'default' : 'outline'}
              className={`cursor-pointer transition-colors ${
                filters.deadline.includes('this-week')
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                  : 'hover:bg-slate-100'
              }`}
              onClick={() => toggleDeadline('this-week')}
            >
              This Week
            </Badge>
            <Badge
              variant={filters.deadline.includes('this-month') ? 'default' : 'outline'}
              className={`cursor-pointer transition-colors ${
                filters.deadline.includes('this-month')
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                  : 'hover:bg-slate-100'
              }`}
              onClick={() => toggleDeadline('this-month')}
            >
              This Month
            </Badge>
            <Badge
              variant={filters.deadline.includes('no-deadline') ? 'default' : 'outline'}
              className={`cursor-pointer transition-colors ${
                filters.deadline.includes('no-deadline')
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                  : 'hover:bg-slate-100'
              }`}
              onClick={() => toggleDeadline('no-deadline')}
            >
              No Deadline
            </Badge>
          </div>
        </div>

        {/* Priority Filter */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Flag className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-medium">Priority</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={filters.priority.includes('must_have') ? 'default' : 'outline'}
              className={`cursor-pointer transition-colors ${
                filters.priority.includes('must_have')
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                  : 'hover:bg-slate-100'
              }`}
              onClick={() => togglePriority('must_have')}
            >
              Must Have
            </Badge>
            <Badge
              variant={filters.priority.includes('nice_to_have') ? 'default' : 'outline'}
              className={`cursor-pointer transition-colors ${
                filters.priority.includes('nice_to_have')
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                  : 'hover:bg-slate-100'
              }`}
              onClick={() => togglePriority('nice_to_have')}
            >
              Nice to Have
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
