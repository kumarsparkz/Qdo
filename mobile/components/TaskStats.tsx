import { View, Text, StyleSheet } from 'react-native'
import { Task } from '../types'

interface TaskStatsProps {
  tasks: Task[]
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const completedToday = tasks.filter((t) => {
    if (t.status !== 'done') return false
    const today = new Date()
    const taskDate = new Date(t.updated_at)
    return (
      taskDate.getDate() === today.getDate() &&
      taskDate.getMonth() === today.getMonth() &&
      taskDate.getFullYear() === today.getFullYear()
    )
  }).length

  const totalActive = tasks.filter((t) => t.status !== 'done').length
  const totalCompleted = tasks.filter((t) => t.status === 'done').length
  const completionRate = tasks.length > 0 ? Math.round((totalCompleted / tasks.length) * 100) : 0

  // Calculate urgency distribution
  const urgentCount = tasks.filter((t) => t.is_urgent && t.status !== 'done').length
  const importantCount = tasks.filter((t) => t.is_important && t.status !== 'done').length

  return (
    <View style={styles.container}>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{completedToday}</Text>
          <Text style={styles.statLabel}>Done Today</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalActive}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, styles.percentValue]}>{completionRate}%</Text>
          <Text style={styles.statLabel}>Complete</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${completionRate}%` }]} />
        </View>
      </View>

      {/* Urgency indicators */}
      <View style={styles.urgencyRow}>
        <View style={styles.urgencyItem}>
          <View style={[styles.urgencyDot, { backgroundColor: '#EF4444' }]} />
          <Text style={styles.urgencyText}>{urgentCount} urgent</Text>
        </View>
        <View style={styles.urgencyItem}>
          <View style={[styles.urgencyDot, { backgroundColor: '#3B82F6' }]} />
          <Text style={styles.urgencyText}>{importantCount} important</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
  },
  percentValue: {
    color: '#10B981',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '500',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
  },
  progressContainer: {
    marginTop: 16,
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
  },
  urgencyRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  urgencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  urgencyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  urgencyText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
})
