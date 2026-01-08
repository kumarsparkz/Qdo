import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import { useData } from '../contexts/DataContext'
import { LoadingSpinner, EmptyState, Card, Badge } from '../components/ui'

export default function Done() {
  const router = useRouter()
  const { tasks, projects, loading, refreshTasks } = useData()
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)
    await refreshTasks()
    setRefreshing(false)
  }

  const doneTasks = tasks.filter((task) => task.status === 'done')

  // Sort by updated_at descending (most recently completed first)
  const sortedTasks = [...doneTasks].sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  if (loading) {
    return <LoadingSpinner message="Loading done tasks..." />
  }

  if (sortedTasks.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          emoji="✅"
          title="No Completed Tasks"
          description="Tasks you mark as done will appear here"
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {sortedTasks.map((task) => {
          const project = projects.find((p) => p.id === task.project_id)
          return (
            <TouchableOpacity
              key={task.id}
              onPress={() => router.push(`/task-detail?taskId=${task.id}`)}
              activeOpacity={0.7}
            >
              <Card style={styles.taskCard}>
                <View style={styles.header}>
                  <Text style={styles.title} numberOfLines={2}>
                    {task.title}
                  </Text>
                  {task.priority === 'must_have' && (
                    <Text style={styles.mustHave}>⭐</Text>
                  )}
                </View>

                {task.description && (
                  <Text style={styles.description} numberOfLines={2}>
                    {task.description}
                  </Text>
                )}

                <View style={styles.timestampContainer}>
                  <View style={styles.timestampRow}>
                    <Text style={styles.timestampLabel}>Created:</Text>
                    <Text style={styles.timestampValue}>{formatDate(task.created_at)}</Text>
                  </View>
                  <View style={styles.timestampRow}>
                    <Text style={styles.timestampLabel}>Completed:</Text>
                    <Text style={styles.timestampValue}>{formatDate(task.updated_at)}</Text>
                  </View>
                </View>

                <View style={styles.footer}>
                  <Badge variant="success" size="sm">
                    Done
                  </Badge>
                  {project && (
                    <Text style={styles.projectName} numberOfLines={1}>
                      {project.name}
                    </Text>
                  )}
                </View>
              </Card>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  taskCard: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  mustHave: {
    fontSize: 16,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  timestampContainer: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  timestampRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  timestampLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  timestampValue: {
    fontSize: 12,
    color: '#374151',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  projectName: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
    marginLeft: 8,
  },
})
