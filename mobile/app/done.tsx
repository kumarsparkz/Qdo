import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native'
import { useState } from 'react'
import { useData } from '../contexts/DataContext'
import { TaskCard } from '../components/TaskCard'
import { LoadingSpinner, EmptyState } from '../components/ui'

export default function Done() {
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
          return <TaskCard key={task.id} task={task} project={project} />
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
})
