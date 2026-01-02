import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { useData } from '../contexts/DataContext'
import { Task, Project, TaskStatus } from '../types'
import { LoadingSpinner, Card, Badge, Button } from '../components/ui'
import Markdown from 'react-native-markdown-display'

export default function TaskDetail() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const { tasks, projects, updateTask, deleteTask } = useData()
  const [task, setTask] = useState<Task | null>(null)
  const [project, setProject] = useState<Project | null>(null)

  const taskId = params.taskId as string

  useEffect(() => {
    const foundTask = tasks.find((t) => t.id === taskId)
    if (foundTask) {
      setTask(foundTask)
      const foundProject = projects.find((p) => p.id === foundTask.project_id)
      setProject(foundProject || null)
    }
  }, [taskId, tasks, projects])

  const handleStatusChange = async (status: TaskStatus) => {
    if (!task) return

    try {
      await updateTask(task.id, { status })
      Alert.alert('Success', 'Task status updated')
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update task')
    }
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!task) return
            try {
              await deleteTask(task.id)
              Alert.alert('Success', 'Task deleted', [
                { text: 'OK', onPress: () => router.back() },
              ])
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete task')
            }
          },
        },
      ]
    )
  }

  if (!task) {
    return <LoadingSpinner message="Loading task..." />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'success'
      case 'in_progress':
        return 'info'
      case 'blocked':
        return 'danger'
      default:
        return 'default'
    }
  }

  const getQuadrantInfo = () => {
    if (task.is_urgent && task.is_important) {
      return { emoji: '🔥', name: 'Urgent & Important', color: '#EF4444' }
    } else if (task.is_urgent && !task.is_important) {
      return { emoji: '⚡', name: 'Urgent & Not Important', color: '#F59E0B' }
    } else if (!task.is_urgent && task.is_important) {
      return { emoji: '📅', name: 'Not Urgent & Important', color: '#3B82F6' }
    } else {
      return { emoji: '🌱', name: 'Not Urgent & Not Important', color: '#10B981' }
    }
  }

  const quadrant = getQuadrantInfo()

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Title */}
        <Card>
          <Text style={styles.title}>{task.title}</Text>
          <View style={styles.badges}>
            <Badge variant={getStatusColor(task.status)}>
              {task.status.replace('_', ' ').toUpperCase()}
            </Badge>
            {task.priority === 'must_have' && (
              <Badge variant="warning">⭐ Must Have</Badge>
            )}
          </View>
        </Card>

        {/* Classification */}
        <Card>
          <Text style={styles.sectionTitle}>Classification</Text>
          <View style={[styles.quadrantBadge, { backgroundColor: quadrant.color + '20' }]}>
            <Text style={styles.quadrantEmoji}>{quadrant.emoji}</Text>
            <Text style={[styles.quadrantName, { color: quadrant.color }]}>
              {quadrant.name}
            </Text>
          </View>
        </Card>

        {/* Project */}
        {project && (
          <Card>
            <Text style={styles.sectionTitle}>Project</Text>
            <Text style={styles.projectName}>{project.name}</Text>
            {project.description && (
              <Text style={styles.projectDescription}>{project.description}</Text>
            )}
          </Card>
        )}

        {/* Description */}
        {task.description && (
          <Card>
            <Text style={styles.sectionTitle}>Description</Text>
            <Markdown style={markdownStyles}>{task.description}</Markdown>
          </Card>
        )}

        {/* Status Actions */}
        <Card>
          <Text style={styles.sectionTitle}>Update Status</Text>
          <View style={styles.statusButtons}>
            <TouchableOpacity
              style={[
                styles.statusButton,
                task.status === 'todo' && styles.statusButtonActive,
              ]}
              onPress={() => handleStatusChange('todo')}
            >
              <Text
                style={[
                  styles.statusButtonText,
                  task.status === 'todo' && styles.statusButtonTextActive,
                ]}
              >
                To Do
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.statusButton,
                task.status === 'in_progress' && styles.statusButtonActive,
              ]}
              onPress={() => handleStatusChange('in_progress')}
            >
              <Text
                style={[
                  styles.statusButtonText,
                  task.status === 'in_progress' && styles.statusButtonTextActive,
                ]}
              >
                In Progress
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.statusButton,
                task.status === 'blocked' && styles.statusButtonActive,
              ]}
              onPress={() => handleStatusChange('blocked')}
            >
              <Text
                style={[
                  styles.statusButtonText,
                  task.status === 'blocked' && styles.statusButtonTextActive,
                ]}
              >
                Blocked
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.statusButton,
                task.status === 'done' && styles.statusButtonActive,
              ]}
              onPress={() => handleStatusChange('done')}
            >
              <Text
                style={[
                  styles.statusButtonText,
                  task.status === 'done' && styles.statusButtonTextActive,
                ]}
              >
                Done
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Delete Button */}
        <Button onPress={handleDelete} variant="danger" fullWidth>
          Delete Task
        </Button>

        <View style={styles.spacer} />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
  },
  quadrantBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  quadrantEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  quadrantName: {
    fontSize: 16,
    fontWeight: '600',
  },
  projectName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  projectDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  statusButtonActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  statusButtonTextActive: {
    color: '#3B82F6',
  },
  spacer: {
    height: 32,
  },
})

const markdownStyles = {
  body: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  heading1: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  heading2: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 6,
  },
  code_inline: {
    backgroundColor: '#F3F4F6',
    color: '#EF4444',
    paddingHorizontal: 4,
    borderRadius: 4,
    fontFamily: 'monospace',
  },
  code_block: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    fontFamily: 'monospace',
  },
  link: {
    color: '#3B82F6',
    textDecorationLine: 'underline' as const,
  },
}
