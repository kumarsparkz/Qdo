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
import { useState } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useData } from '../contexts/DataContext'
import { Button, Input, Card } from '../components/ui'

export default function CreateTask() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const { projects, createTask } = useData()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedProjectId, setSelectedProjectId] = useState(
    (params.projectId as string) || projects[0]?.id || ''
  )
  const [isUrgent, setIsUrgent] = useState(false)
  const [isImportant, setIsImportant] = useState(false)
  const [priority, setPriority] = useState<'must_have' | 'nice_to_have'>('must_have')
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
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
      const task = await createTask({
        title: title.trim(),
        description: description.trim() || null,
        project_id: selectedProjectId,
        is_urgent: isUrgent,
        is_important: isImportant,
        priority,
        status: 'todo',
        deadline: null,
      })

      if (task) {
        Alert.alert('Success', 'Task created successfully', [
          { text: 'OK', onPress: () => router.back() },
        ])
      } else {
        Alert.alert('Error', 'Failed to create task')
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  if (projects.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Please create a project first</Text>
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

            <View style={styles.divider} />

            <View style={styles.switchRow}>
              <View style={styles.switchLabel}>
                <Text style={styles.switchTitle}>⭐ Important</Text>
                <Text style={styles.switchSubtitle}>Contributes to long-term goals</Text>
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
          <View style={styles.priorityGroup}>
            <TouchableOpacity
              style={[
                styles.priorityButton,
                priority === 'must_have' && styles.priorityButtonSelected,
              ]}
              onPress={() => setPriority('must_have')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.priorityText,
                  priority === 'must_have' && styles.priorityTextSelected,
                ]}
              >
                Must Have
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.priorityButton,
                priority === 'nice_to_have' && styles.priorityButtonSelected,
              ]}
              onPress={() => setPriority('nice_to_have')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.priorityText,
                  priority === 'nice_to_have' && styles.priorityTextSelected,
                ]}
              >
                Nice to Have
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonGroup}>
            <Button onPress={handleCreate} loading={loading} disabled={loading} fullWidth>
              Create Task
            </Button>
            <Button onPress={() => router.back()} variant="outline" fullWidth>
              Cancel
            </Button>
          </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  content: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 24,
    marginBottom: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  projectList: {
    gap: 8,
  },
  projectCard: {
    marginBottom: 8,
  },
  projectCardSelected: {
    borderColor: '#3B82F6',
    borderWidth: 2,
  },
  projectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  projectNameSelected: {
    color: '#3B82F6',
  },
  projectDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchLabel: {
    flex: 1,
  },
  switchTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  switchSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  priorityGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  priorityButtonSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  priorityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  priorityTextSelected: {
    color: '#3B82F6',
  },
  buttonGroup: {
    marginTop: 32,
    gap: 12,
  },
})
