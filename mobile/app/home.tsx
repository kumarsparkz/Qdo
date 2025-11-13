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
  status: 'todo' | 'in_progress' | 'blocked' | 'done'
  deadline: string | null
}

interface Project {
  id: string
  name: string
  description: string | null
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [userEmail, setUserEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchUserAndData()
  }, [])

  const fetchUserAndData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUserEmail(user.email || '')
      await Promise.all([fetchTasks(), fetchProjects()])
    }
    setLoading(false)
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await Promise.all([fetchTasks(), fetchProjects()])
    setRefreshing(false)
  }

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .not('status', 'in', '(done,blocked)')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching tasks:', error)
    } else {
      setTasks(data || [])
    }
  }

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching projects:', error)
    } else {
      setProjects(data || [])
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId)
    return project?.name || 'Unknown'
  }

  const sortTasks = (tasks: Task[]) => {
    return [...tasks].sort((a, b) => {
      if (a.priority === 'must_have' && b.priority !== 'must_have') return -1
      if (a.priority !== 'must_have' && b.priority === 'must_have') return 1
      return 0
    })
  }

  // Filter tasks by selected project if any
  const filteredTasks = selectedProjectId
    ? tasks.filter(task => task.project_id === selectedProjectId)
    : tasks

  // Categorize tasks into quadrants
  const urgentImportant = sortTasks(filteredTasks.filter(t => t.is_urgent && t.is_important))
  const urgentNotImportant = sortTasks(filteredTasks.filter(t => t.is_urgent && !t.is_important))
  const notUrgentImportant = sortTasks(filteredTasks.filter(t => !t.is_urgent && t.is_important))
  const notUrgentNotImportant = sortTasks(filteredTasks.filter(t => !t.is_urgent && !t.is_important))

  const renderTaskCard = (task: Task) => (
    <TouchableOpacity
      key={task.id}
      style={styles.taskCard}
      onPress={() => router.push(`/task-detail?id=${task.id}`)}
    >
      <View style={styles.taskHeader}>
        <Text style={styles.taskTitle} numberOfLines={2}>{task.title}</Text>
        {task.priority === 'must_have' && (
          <View style={styles.mustHaveBadge}>
            <Text style={styles.badgeText}>MUST</Text>
          </View>
        )}
      </View>
      {task.description && (
        <Text style={styles.taskDescription} numberOfLines={2}>
          {task.description}
        </Text>
      )}
      <View style={styles.taskFooter}>
        <Text style={styles.projectName} numberOfLines={1}>
          📁 {getProjectName(task.project_id)}
        </Text>
        <View style={[styles.statusBadge, getStatusColor(task.status)]}>
          <Text style={styles.statusText}>{task.status.replace('_', ' ')}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  const renderQuadrant = (
    title: string,
    emoji: string,
    tasks: Task[],
    colors: { bg: string; border: string; header: string }
  ) => (
    <View style={[styles.quadrant, { backgroundColor: colors.bg, borderColor: colors.border }]}>
      <View style={[styles.quadrantHeader, { backgroundColor: colors.header }]}>
        <Text style={styles.quadrantEmoji}>{emoji}</Text>
        <Text style={styles.quadrantTitle}>{title}</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{tasks.length}</Text>
        </View>
      </View>
      <ScrollView style={styles.quadrantContent} nestedScrollEnabled>
        {tasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No tasks</Text>
          </View>
        ) : (
          tasks.map(renderTaskCard)
        )}
      </ScrollView>
    </View>
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return styles.statusTodo
      case 'in_progress': return styles.statusInProgress
      case 'blocked': return styles.statusBlocked
      case 'done': return styles.statusDone
      default: return styles.statusTodo
    }
  }

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
        <View>
          <Text style={styles.appTitle}>Quadrant Todo</Text>
          <Text style={styles.subtitle}>Eisenhower Matrix</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Projects Section */}
      {projects.length > 0 && (
        <View style={styles.projectsSection}>
          <Text style={styles.projectsTitle}>Projects ({projects.length})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.projectsList}>
            <TouchableOpacity
              style={[styles.projectChip, !selectedProjectId && styles.projectChipSelected]}
              onPress={() => setSelectedProjectId(null)}
            >
              <Text style={[styles.projectChipText, !selectedProjectId && styles.projectChipTextSelected]}>
                All Projects
              </Text>
            </TouchableOpacity>
            {projects.map(project => (
              <TouchableOpacity
                key={project.id}
                style={[styles.projectChip, selectedProjectId === project.id && styles.projectChipSelected]}
                onPress={() => setSelectedProjectId(project.id)}
              >
                <Text style={[styles.projectChipText, selectedProjectId === project.id && styles.projectChipTextSelected]}>
                  {project.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Quadrants Grid */}
      <ScrollView
        style={styles.mainContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.quadrantsGrid}>
          {renderQuadrant(
            'Urgent & Important',
            '🔥',
            urgentImportant,
            { bg: '#fef2f2', border: '#fecaca', header: '#fee2e2' }
          )}
          {renderQuadrant(
            'Urgent & Not Important',
            '⚡',
            urgentNotImportant,
            { bg: '#fff7ed', border: '#fed7aa', header: '#ffedd5' }
          )}
          {renderQuadrant(
            'Not Urgent & Important',
            '📅',
            notUrgentImportant,
            { bg: '#eff6ff', border: '#bfdbfe', header: '#dbeafe' }
          )}
          {renderQuadrant(
            'Not Urgent & Not Important',
            '🌱',
            notUrgentNotImportant,
            { bg: '#f0fdf4', border: '#bbf7d0', header: '#dcfce7' }
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/create-task')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => {}}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/done')}>
          <Text style={styles.navIcon}>✅</Text>
          <Text style={styles.navLabel}>Done</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/blocked')}>
          <Text style={styles.navIcon}>🚫</Text>
          <Text style={styles.navLabel}>Blocked</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/projects')}>
          <Text style={styles.navIcon}>📁</Text>
          <Text style={styles.navLabel}>Projects</Text>
        </TouchableOpacity>
      </View>
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
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  logoutText: {
    color: '#475569',
    fontWeight: '600',
  },
  projectsSection: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  projectsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  projectsList: {
    paddingHorizontal: 20,
  },
  projectChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  projectChipSelected: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  projectChipText: {
    color: '#475569',
    fontWeight: '600',
    fontSize: 14,
  },
  projectChipTextSelected: {
    color: '#ffffff',
  },
  mainContent: {
    flex: 1,
  },
  quadrantsGrid: {
    padding: 12,
  },
  quadrant: {
    borderWidth: 2,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    minHeight: 200,
  },
  quadrantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  quadrantEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  quadrantTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
  },
  countBadge: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#475569',
  },
  quadrantContent: {
    padding: 8,
    maxHeight: 300,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  taskCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
    marginRight: 8,
  },
  mustHaveBadge: {
    backgroundColor: '#dc2626',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  taskDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectName: {
    fontSize: 12,
    color: '#64748b',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  statusTodo: {
    backgroundColor: '#64748b',
  },
  statusInProgress: {
    backgroundColor: '#3b82f6',
  },
  statusBlocked: {
    backgroundColor: '#ef4444',
  },
  statusDone: {
    backgroundColor: '#10b981',
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  fabText: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '300',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingBottom: 20,
    paddingTop: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
})
