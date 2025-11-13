import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { Task, Project } from '../types'
import { TaskCard } from './TaskCard'

interface QuadrantViewProps {
  title: string
  emoji: string
  subtitle: string
  tasks: Task[]
  projects: Project[]
  color: string
}

export function QuadrantView({ title, emoji, subtitle, tasks, projects, color }: QuadrantViewProps) {
  // Group tasks by priority
  const mustHaveTasks = tasks.filter((t) => t.priority === 'must_have')
  const niceToHaveTasks = tasks.filter((t) => t.priority === 'nice_to_have')
  const sortedTasks = [...mustHaveTasks, ...niceToHaveTasks]

  return (
    <View style={[styles.quadrant, { borderColor: color }]}>
      <View style={[styles.header, { backgroundColor: color + '15' }]}>
        <Text style={styles.emoji}>{emoji}</Text>
        <View style={styles.headerText}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: color }]}>
          <Text style={styles.badgeText}>{tasks.length}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {sortedTasks.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No tasks</Text>
          </View>
        ) : (
          sortedTasks.map((task) => {
            const project = projects.find((p) => p.id === task.project_id)
            return <TaskCard key={task.id} task={task} project={project} />
          })
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  quadrant: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  emoji: {
    fontSize: 24,
    marginRight: 8,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    padding: 12,
  },
  empty: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
})
