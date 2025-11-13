import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Switch } from 'react-native'
import { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import { supabase } from '../lib/supabase'
import { StatusBar } from 'expo-status-bar'

interface Project {
  id: string
  name: string
}

export default function CreateTask() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [isUrgent, setIsUrgent] = useState(false)
  const [isImportant, setIsImportant] = useState(false)
  const [priority, setPriority] = useState<'must_have' | 'nice_to_have'>('nice_to_have')
  const [status, setStatus] = useState<'todo' | 'in_progress' | 'blocked' | 'done'>('todo')
  const [deadline, setDeadline] = useState('')
  const [creating, setCreating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('id, name')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching projects:', error)
    } else {
      setProjects(data || [])
      if (data && data.length > 0) {
        setSelectedProjectId(data[0].id)
      }
    }
  }

  const handleCreateTask = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title')
      return
    }

    if (!selectedProjectId) {
      Alert.alert('Error', 'Please select a project')
      return
    }

    setCreating(true)

    const taskData = {
      title: title.trim(),
      description: description.trim() || null,
      project_id: selectedProjectId,
      is_urgent: isUrgent,
      is_important: isImportant,
      priority,
      status,
      deadline: deadline || null,
    }

    const { error } = await supabase
      .from('tasks')
      .insert(taskData)

    if (error) {
      Alert.alert('Error', 'Failed to create task')
      console.error('Error creating task:', error)
      setCreating(false)
    } else {
      Alert.alert('Success', 'Task created successfully', [
        { text: 'OK', onPress: () => router.back() }
      ])
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>✕ Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Task</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter task title"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#94a3b8"
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter task description (supports markdown)"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={5}
            placeholderTextColor="#94a3b8"
          />
        </View>

        {/* Project */}
        <View style={styles.section}>
          <Text style={styles.label}>Project *</Text>
          {projects.length === 0 ? (
            <View style={styles.noProjectsBox}>
              <Text style={styles.noProjectsText}>No projects available</Text>
              <TouchableOpacity onPress={() => router.push('/projects')}>
                <Text style={styles.createProjectLink}>Create a project first</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {projects.map(project => (
                <TouchableOpacity
                  key={project.id}
                  style={[
                    styles.projectChip,
                    selectedProjectId === project.id && styles.projectChipSelected
                  ]}
                  onPress={() => setSelectedProjectId(project.id)}
                >
                  <Text style={[
                    styles.projectChipText,
                    selectedProjectId === project.id && styles.projectChipTextSelected
                  ]}>
                    {project.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Quadrant */}
        <View style={styles.section}>
          <Text style={styles.label}>Eisenhower Matrix Quadrant</Text>
          <View style={styles.switchContainer}>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>🔥 Urgent</Text>
              <Switch
                value={isUrgent}
                onValueChange={setIsUrgent}
                trackColor={{ false: '#cbd5e1', true: '#6366f1' }}
                thumbColor="#ffffff"
              />
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>⭐ Important</Text>
              <Switch
                value={isImportant}
                onValueChange={setIsImportant}
                trackColor={{ false: '#cbd5e1', true: '#6366f1' }}
                thumbColor="#ffffff"
              />
            </View>
          </View>
          <View style={styles.quadrantPreview}>
            <Text style={styles.quadrantPreviewText}>
              {isUrgent && isImportant && '🔥 Urgent & Important'}
              {isUrgent && !isImportant && '⚡ Urgent & Not Important'}
              {!isUrgent && isImportant && '📅 Not Urgent & Important'}
              {!isUrgent && !isImportant && '🌱 Not Urgent & Not Important'}
            </Text>
          </View>
        </View>

        {/* Priority */}
        <View style={styles.section}>
          <Text style={styles.label}>Priority</Text>
          <View style={styles.segmentedControl}>
            <TouchableOpacity
              style={[
                styles.segmentedButton,
                styles.segmentedButtonLeft,
                priority === 'must_have' && styles.segmentedButtonActive
              ]}
              onPress={() => setPriority('must_have')}
            >
              <Text style={[
                styles.segmentedButtonText,
                priority === 'must_have' && styles.segmentedButtonTextActive
              ]}>
                Must Have
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.segmentedButton,
                styles.segmentedButtonRight,
                priority === 'nice_to_have' && styles.segmentedButtonActive
              ]}
              onPress={() => setPriority('nice_to_have')}
            >
              <Text style={[
                styles.segmentedButtonText,
                priority === 'nice_to_have' && styles.segmentedButtonTextActive
              ]}>
                Nice to Have
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Status */}
        <View style={styles.section}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.statusButtons}>
            {(['todo', 'in_progress', 'blocked', 'done'] as const).map(s => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.statusButton,
                  status === s && styles.statusButtonActive
                ]}
                onPress={() => setStatus(s)}
              >
                <Text style={[
                  styles.statusButtonText,
                  status === s && styles.statusButtonTextActive
                ]}>
                  {s === 'todo' && '📋'}
                  {s === 'in_progress' && '⚙️'}
                  {s === 'blocked' && '🚫'}
                  {s === 'done' && '✅'}
                  {' '}
                  {s.replace('_', ' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Deadline */}
        <View style={styles.section}>
          <Text style={styles.label}>Deadline (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input}
            placeholder="2025-12-31"
            value={deadline}
            onChangeText={setDeadline}
            placeholderTextColor="#94a3b8"
          />
        </View>

        {/* Create Button */}
        <TouchableOpacity
          style={[styles.createButton, (creating || !title || !selectedProjectId) && styles.createButtonDisabled]}
          onPress={handleCreateTask}
          disabled={creating || !title || !selectedProjectId}
        >
          <Text style={styles.createButtonText}>
            {creating ? 'Creating...' : 'Create Task'}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1e293b',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  noProjectsBox: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  noProjectsText: {
    color: '#dc2626',
    fontSize: 14,
    marginBottom: 8,
  },
  createProjectLink: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '600',
  },
  projectChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    marginRight: 8,
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
  switchContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  quadrantPreview: {
    backgroundColor: '#eef2ff',
    borderWidth: 1,
    borderColor: '#c7d2fe',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  quadrantPreviewText: {
    fontSize: 14,
    color: '#4338ca',
    fontWeight: '600',
    textAlign: 'center',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  segmentedButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  segmentedButtonLeft: {
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
  },
  segmentedButtonRight: {},
  segmentedButtonActive: {
    backgroundColor: '#6366f1',
  },
  segmentedButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  segmentedButtonTextActive: {
    color: '#ffffff',
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 8,
  },
  statusButtonActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    textTransform: 'capitalize',
  },
  statusButtonTextActive: {
    color: '#ffffff',
  },
  createButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
})
