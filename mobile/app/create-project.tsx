import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import { useData } from '../contexts/DataContext'
import { Button, Input } from '../components/ui'

export default function CreateProject() {
  const router = useRouter()
  const { createProject } = useData()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a project name')
      return
    }

    setLoading(true)
    try {
      const project = await createProject(name.trim(), description.trim() || undefined)

      if (project) {
        Alert.alert('Success', 'Project created successfully', [
          { text: 'OK', onPress: () => router.back() },
        ])
      } else {
        Alert.alert('Error', 'Failed to create project')
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create project')
    } finally {
      setLoading(false)
    }
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
          <Text style={styles.label}>Project Name *</Text>
          <Input
            placeholder="e.g., Work, Personal, Side Projects"
            value={name}
            onChangeText={setName}
            autoFocus
          />

          <Text style={styles.label}>Description (Optional)</Text>
          <Input
            placeholder="Brief description of this project"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />

          <View style={styles.buttonGroup}>
            <Button onPress={handleCreate} loading={loading} disabled={loading} fullWidth>
              Create Project
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
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 8,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonGroup: {
    marginTop: 24,
    gap: 12,
  },
})
