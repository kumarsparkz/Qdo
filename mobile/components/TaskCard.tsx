import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Task, Project } from '../types'
import { Card, Badge } from './ui'

interface TaskCardProps {
  task: Task
  project?: Project
}

export function TaskCard({ task, project }: TaskCardProps) {
  const router = useRouter()

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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'todo':
        return 'To Do'
      case 'in_progress':
        return 'In Progress'
      case 'blocked':
        return 'Blocked'
      case 'done':
        return 'Done'
      default:
        return status
    }
  }

  return (
    <TouchableOpacity
      onPress={() => router.push(`/task-detail?taskId=${task.id}`)}
      activeOpacity={0.7}
    >
      <Card style={styles.card}>
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

        <View style={styles.footer}>
          <Badge variant={getStatusColor(task.status)} size="sm">
            {getStatusLabel(task.status)}
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
}

const styles = StyleSheet.create({
  card: {
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
