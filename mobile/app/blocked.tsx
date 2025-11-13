import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native'
import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { supabase } from '../lib/supabase'
import { StatusBar } from 'expo-status-bar'

interface Task {
  id: string
  title: string
  description: string | null
  project_id: string
  is_urgent: boolean
  is_important: boolean
  priority: 'must_have' | 'nice_to_have'
  status: string
  deadline: string | null
  updated_at: string
}

interface Project {
  id: string
  name: string
}

export default function Blocked() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    await Promise.all([fetchTasks(), fetchProjects()])
    setLoading(false)
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchData()
    setRefreshing(false)
  }

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('status', 'blocked')
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching blocked tasks:', error)
    } else {
      setTasks(data || [])
    }
  }

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('id, name')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching projects:', error)
    } else {
      setProjects(data || [])
    }
  }

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId)
    return project?.name || 'Unknown'
  }

  const handleUnblock = async (taskId: string) => {
    const { error } = await supabase
      .from('tasks')
      .update({ status: 'todo' })
      .eq('id', taskId)

    if (error) {
      console.error('Error updating task:', error)
    } else {
      fetchTasks()
    }
  }

  const renderTaskCard = (task: Task) => (
    <View key={task.id} style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <Text style={styles.taskTitle}>{task.title}</Text>
        <Text style={styles.blockedIcon}>🚫</Text>
      </View>
      {task.description && (
        <Text style={styles.taskDescription} numberOfLines={3}>
          {task.description}
        </Text>
      )}
      <View style={styles.taskMeta}>
        <Text style={styles.projectName}>📁 {getProjectName(task.project_id)}</Text>
        <View style={styles.quadrantBadge}>
          <Text style={styles.quadrantText}>
            {task.is_urgent && task.is_important && '🔥'}
            {task.is_urgent && !task.is_important && '⚡'}
            {!task.is_urgent && task.is_important && '📅'}
            {!task.is_urgent && !task.is_important && '🌱'}
          </Text>
        </View>
      </View>
      {task.priority === 'must_have' && (
        <View style={styles.mustHaveBadge}>
          <Text style={styles.mustHaveText}>⚠️ MUST HAVE</Text>
        </View>
      )}
      <TouchableOpacity
        style={styles.unblockButton}
        onPress={() => handleUnblock(task.id)}
      >
        <Text style={styles.unblockButtonText}>✓ Unblock Task</Text>
      </TouchableOpacity>
    </View>
  )

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerEmoji}>🚫</Text>
          <Text style={styles.headerTitle}>Blocked Tasks</Text>
        </View>
        <View style={{ width: 60 }} />
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} blocked
        </Text>
        {tasks.length > 0 && (
          <Text style={styles.statsSubtext}>
            Review and unblock to continue progress
          </Text>
        )}
      </View>

      {/* Tasks List */}
      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {tasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🎉</Text>
            <Text style={styles.emptyTitle}>No Blocked Tasks</Text>
            <Text style={styles.emptyText}>
              Great! You don't have any blocked tasks at the moment
            </Text>
          </View>
        ) : (
          tasks.map(renderTaskCard)
        )}
        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 16,
    color: '#64748b',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    paddingVertical: 8,
  },
  backText: {
    color: '#6366f1',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  statsContainer: {
    backgroundColor: '#fef2f2',
    borderBottomWidth: 1,
    borderBottomColor: '#fecaca',
    padding: 16,
  },
  statsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#991b1b',
    textAlign: 'center',
  },
  statsSubtext: {
    fontSize: 14,
    color: '#dc2626',
    textAlign: 'center',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  taskCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
    marginRight: 8,
  },
  blockedIcon: {
    fontSize: 24,
  },
  taskDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  taskMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  projectName: {
    fontSize: 14,
    color: '#64748b',
    flex: 1,
  },
  quadrantBadge: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quadrantText: {
    fontSize: 16,
  },
  mustHaveBadge: {
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
  },
  mustHaveText: {
    color: '#991b1b',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  unblockButton: {
    backgroundColor: '#10b981',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
  },
  unblockButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
})
