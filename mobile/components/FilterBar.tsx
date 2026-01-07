import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import { useState } from 'react'
import * as Haptics from 'expo-haptics'

export type StatusFilter = 'all' | 'todo' | 'in_progress' | 'blocked' | 'done'

interface FilterBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  statusFilter: StatusFilter
  onStatusChange: (status: StatusFilter) => void
  taskCounts: {
    all: number
    todo: number
    in_progress: number
    blocked: number
    done: number
  }
}

const STATUS_OPTIONS: { value: StatusFilter; label: string; color: string; bgColor: string }[] = [
  { value: 'all', label: 'All', color: '#6B7280', bgColor: '#F3F4F6' },
  { value: 'todo', label: 'To Do', color: '#3B82F6', bgColor: '#DBEAFE' },
  { value: 'in_progress', label: 'In Progress', color: '#F59E0B', bgColor: '#FEF3C7' },
  { value: 'blocked', label: 'Blocked', color: '#EF4444', bgColor: '#FEE2E2' },
  { value: 'done', label: 'Done', color: '#10B981', bgColor: '#D1FAE5' },
]

export function FilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  taskCounts,
}: FilterBarProps) {
  const handleStatusSelect = async (status: StatusFilter) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onStatusChange(status)
  }

  const clearFilters = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onSearchChange('')
    onStatusChange('all')
  }

  const hasActiveFilters = searchQuery.length > 0 || statusFilter !== 'all'

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search tasks..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={onSearchChange}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => onSearchChange('')} style={styles.clearButton}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Status Filters */}
      <View style={styles.filtersRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statusFilters}
        >
          {STATUS_OPTIONS.map((option) => {
            const isSelected = statusFilter === option.value
            const count = taskCounts[option.value]

            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.statusChip,
                  { backgroundColor: isSelected ? option.bgColor : '#F9FAFB' },
                  isSelected && { borderColor: option.color },
                ]}
                onPress={() => handleStatusSelect(option.value)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: isSelected ? option.color : '#6B7280' },
                  ]}
                >
                  {option.label}
                </Text>
                <View
                  style={[
                    styles.countBadge,
                    { backgroundColor: isSelected ? option.color : '#D1D5DB' },
                  ]}
                >
                  <Text style={styles.countText}>{count}</Text>
                </View>
              </TouchableOpacity>
            )
          })}
        </ScrollView>

        {hasActiveFilters && (
          <TouchableOpacity style={styles.clearAllButton} onPress={clearFilters}>
            <Text style={styles.clearAllText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1F2937',
  },
  clearButton: {
    padding: 4,
  },
  clearIcon: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusFilters: {
    gap: 8,
    paddingRight: 8,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  countBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  countText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  clearAllButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  clearAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
  },
})
