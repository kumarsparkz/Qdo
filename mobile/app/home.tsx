import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import { QuadrantView } from '../components/QuadrantView'
import { DailyFocus } from '../components/DailyFocus'
import { TaskStats } from '../components/TaskStats'
import { MotivationalTip } from '../components/MotivationalTip'
import { LoadingSpinner, EmptyState, Button } from '../components/ui'
import * as Haptics from 'expo-haptics'

export default function Home() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const { projects, tasks, loading, refreshProjects, refreshTasks, selectedProjectId } = useData()
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (!user) {
      router.replace('/login')
    }
  }, [user])

  const onRefresh = async () => {
    setRefreshing(true)
    await Promise.all([refreshProjects(), refreshTasks()])
    setRefreshing(false)
  }

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut()
          router.replace('/login')
        },
      },
    ])
  }

  // Filter active tasks (not done)
  const activeTasks = tasks.filter((task) => task.status !== 'done')

  // Filter by selected project if any
  const filteredTasks = selectedProjectId
    ? activeTasks.filter((task) => task.project_id === selectedProjectId)
    : activeTasks

  // Categorize tasks by quadrant
  const urgentImportant = filteredTasks.filter((t) => t.is_urgent && t.is_important)
  const urgentNotImportant = filteredTasks.filter((t) => t.is_urgent && !t.is_important)
  const notUrgentImportant = filteredTasks.filter((t) => !t.is_urgent && t.is_important)
  const notUrgentNotImportant = filteredTasks.filter((t) => !t.is_urgent && !t.is_important)

  if (loading) {
    return <LoadingSpinner message="Loading tasks..." />
  }

  if (projects.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          emoji="📂"
          title="No Projects Yet"
          description="Create your first project to start organizing tasks"
          action={
            <Button onPress={() => router.push('/create-project')}>Create Project</Button>
          }
        />
        <View style={styles.signOutContainer}>
          <Button onPress={handleSignOut} variant="ghost" size="sm">
            Sign Out
          </Button>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header with navigation */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => router.push('/done')}
          >
            <Text style={styles.navButtonText}>✅ Done</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => router.push('/blocked')}
          >
            <Text style={styles.navButtonText}>🚫 Blocked</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Daily Motivational Tip */}
        <MotivationalTip />

        {/* Daily Focus - Most important task */}
        <DailyFocus tasks={tasks} projects={projects} />

        {/* Task Statistics */}
        <TaskStats tasks={tasks} />

        {/* Top Row */}
        <View style={styles.row}>
          <QuadrantView
            title="Urgent & Important"
            emoji="🔥"
            subtitle="Do First"
            tasks={urgentImportant}
            projects={projects}
            color="#EF4444"
          />
          <View style={styles.spacer} />
          <QuadrantView
            title="Urgent & Not Important"
            emoji="⚡"
            subtitle="Schedule"
            tasks={urgentNotImportant}
            projects={projects}
            color="#F59E0B"
          />
        </View>

        <View style={styles.rowSpacer} />

        {/* Bottom Row */}
        <View style={styles.row}>
          <QuadrantView
            title="Not Urgent & Important"
            emoji="📅"
            subtitle="Plan"
            tasks={notUrgentImportant}
            projects={projects}
            color="#3B82F6"
          />
          <View style={styles.spacer} />
          <QuadrantView
            title="Not Urgent & Not Important"
            emoji="🌱"
            subtitle="Eliminate"
            tasks={notUrgentNotImportant}
            projects={projects}
            color="#10B981"
          />
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
          router.push('/create-task')
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flexDirection: 'row',
    gap: 8,
  },
  navButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  signOutButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  signOutText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
  },
  signOutContainer: {
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    height: 400,
  },
  spacer: {
    width: 16,
  },
  rowSpacer: {
    height: 16,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  fabText: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '300',
  },
})
