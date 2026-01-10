import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { Task, Project } from '../types'
import * as Haptics from 'expo-haptics'

interface DailyFocusProps {
  tasks: Task[]
  projects: Project[]
}

export function DailyFocus({ tasks, projects }: DailyFocusProps) {
  const router = useRouter()

  // Get the most important task (urgent + important, must_have priority)
  const focusTask = tasks
    .filter((t) => t.is_urgent && t.is_important && t.status !== 'done')
    .sort((a, b) => {
      if (a.priority === 'must_have' && b.priority !== 'must_have') return -1
      if (a.priority !== 'must_have' && b.priority === 'must_have') return 1
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    })[0]

  if (!focusTask) {
    return (
      <View style={styles.container}>
        <View style={styles.celebration}>
          <Text style={styles.celebrationEmoji}>🎯</Text>
          <Text style={styles.celebrationTitle}>You're all caught up!</Text>
          <Text style={styles.celebrationText}>
            No urgent & important tasks. Great job staying on top of things!
          </Text>
        </View>
      </View>
    )
  }

  const project = projects.find((p) => p.id === focusTask.project_id)

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    router.push(`/task-detail?taskId=${focusTask.id}`)
  }

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.8}>
      <View style={styles.header}>
        <Text style={styles.focusLabel}>🎯 TODAY'S FOCUS</Text>
        <View style={styles.priorityBadge}>
          <Text style={styles.priorityText}>DO FIRST</Text>
        </View>
      </View>
      <Text style={styles.taskTitle} numberOfLines={2}>
        {focusTask.title}
      </Text>
      {focusTask.description && (
        <Text style={styles.taskDescription} numberOfLines={1}>
          {focusTask.description}
        </Text>
      )}
      {project && (
        <View style={styles.projectBadge}>
          <Text style={styles.projectText}>{project.name}</Text>
        </View>
      )}
      <Text style={styles.tapHint}>Tap to view details →</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  focusLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
    letterSpacing: 1,
  },
  priorityBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#78350F',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: '#92400E',
    marginBottom: 8,
  },
  projectBadge: {
    backgroundColor: '#FDE68A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  projectText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
  },
  tapHint: {
    fontSize: 12,
    color: '#B45309',
    textAlign: 'right',
    fontStyle: 'italic',
  },
  celebration: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  celebrationEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  celebrationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#78350F',
    marginBottom: 4,
  },
  celebrationText: {
    fontSize: 13,
    color: '#92400E',
    textAlign: 'center',
  },
})
