import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Switch,
} from 'react-native'
import { useState, useEffect } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useData } from '../contexts/DataContext'
import { Button, Input, Card, LoadingSpinner } from '../components/ui'

export default function EditTask() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const { projects, tasks, updateTask } = useData()
  const taskId = params.taskId as string

  const [task, setTask] = useState(tasks.find((t) => t.id === taskId))
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedProjectId, setSelectedProjectId] = useState('')
  const [isUrgent, setIsUrgent] = useState(false)
  const [isImportant, setIsImportant] = useState(false)
  const [priority, setPriority] = useState<'must_have' | 'nice_to_have'>('must_have')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const foundTask = tasks.find((t) => t.id === taskId)
    if (foundTask) {
      setTask(foundTask)
      setTitle(foundTask.title)
      setDescription(foundTask.description || '')
      setSelectedProjectId(foundTask.project_id)
      setIsUrgent(foundTask.is_urgent)
      setIsImportant(foundTask.is_important)
      setPriority(foundTask.priority)
    }
  }, [taskId, tasks])

  const handleUpdate = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title')
      return
    }

    if (!selectedProjectId) {
      Alert.alert('Error', 'Please select a project')
      return
    }

    setLoading(true)
    try {
      await updateTask(taskId, {
        title: title.trim(),
        description: description.trim() || null,
        project_id: selectedProjectId,
        is_urgent: isUrgent,
        is_important: isImportant,
        priority,
      })

      Alert.alert('Success', 'Task updated successfully', [
        { text: 'OK', onPress: () => router.back() },
      ])
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update task')
    } finally {
      setLoading(false)
    }
  }

  if (!task) {
    return <LoadingSpinner message="Loading task..." />
  }

  if (projects.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No projects available</Text>
        <Button onPress={() => router.replace('/create-project')}>Create Project</Button>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.label}>Task Title *</Text>
          <Input
            placeholder="What needs to be done?"
            value={title}
            onChangeText={setTitle}
            autoFocus
          />

          <Text style={styles.label}>Description (Optional)</Text>
          <Input
            placeholder="Add more details (supports Markdown)"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />

          <Text style={styles.label}>Project *</Text>
          <View style={styles.projectList}>
            {projects.map((project) => (
              <TouchableOpacity
                key={project.id}
                onPress={() => setSelectedProjectId(project.id)}
                activeOpacity={0.7}
              >
                <Card
                  style={[
                    styles.projectCard,
                    selectedProjectId === project.id && styles.projectCardSelected,
                  ]}
                  variant={selectedProjectId === project.id ? 'elevated' : 'outlined'}
                >
                  <Text
                    style={[
                      styles.projectName,
                      selectedProjectId === project.id && styles.projectNameSelected,
                    ]}
                  >
                    {project.name}
                  </Text>
                  {project.description && (
                    <Text style={styles.projectDescription} numberOfLines={1}>
                      {project.description}
                    </Text>
                  )}
                </Card>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Classification</Text>
          <Card padding="md">
            <View style={styles.switchRow}>
              <View style={styles.switchLabel}>
                <Text style={styles.switchTitle}>🔥 Urgent</Text>
                <Text style={styles.switchSubtitle}>Needs immediate attention</Text>
              </View>
              <Switch
                value={isUrgent}
                onValueChange={setIsUrgent}
                trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                thumbColor={isUrgent ? '#3B82F6' : '#F3F4F6'}
              />
            </View>

            <View style={[styles.switchRow, styles.switchRowLast]}>
              <View style={styles.switchLabel}>
                <Text style={styles.switchTitle}>⭐ Important</Text>
                <Text style={styles.switchSubtitle}>Has significant impact</Text>
              </View>
              <Switch
                value={isImportant}
                onValueChange={setIsImportant}
                trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                thumbColor={isImportant ? '#3B82F6' : '#F3F4F6'}
              />
            </View>
          </Card>

          <Text style={styles.sectionTitle}>Priority</Text>
          <View style={styles.priorityButtons}>
            <TouchableOpacity
              style={[
                styles.priorityButton,
                priority === 'must_have' && styles.priorityButtonActive,
              ]}
              onPress={() => setPriority('must_have')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.priorityButtonText,
                  priority === 'must_have' && styles.priorityButtonTextActive,
                ]}
              >
                ⭐ Must Have
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.priorityButton,
                priority === 'nice_to_have' && styles.priorityButtonActive,
              ]}
              onPress={() => setPriority('nice_to_have')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.priorityButtonText,
                  priority === 'nice_to_have' && styles.priorityButtonTextActive,
                ]}
              >
                💡 Nice to Have
              </Text>
            </TouchableOpacity>
          </View>

          <Button onPress={handleUpdate} loading={loading} fullWidth>
            Update Task
          </Button>

          <View style={styles.spacer} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  projectList: {
    gap: 12,
  },
  projectCard: {
    marginBottom: 0,
  },
  projectCardSelected: {
    borderColor: '#3B82F6',
    borderWidth: 2,
  },
  projectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  projectNameSelected: {
    color: '#3B82F6',
  },
  projectDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 24,
    marginBottom: 12,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  switchRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
    marginTop: 16,
  },
  switchLabel: {
    flex: 1,
  },
  switchTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  switchSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  priorityButtonActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  priorityButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  priorityButtonTextActive: {
    color: '#3B82F6',
  },
  spacer: {
    height: 32,
  },
})
