import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { Project } from '../types'
import * as Haptics from 'expo-haptics'

interface ProjectSelectorProps {
  projects: Project[]
  selectedProjectId: string | null
  onSelectProject: (projectId: string | null) => void
}

export function ProjectSelector({ projects, selectedProjectId, onSelectProject }: ProjectSelectorProps) {
  const handleSelect = async (projectId: string | null) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onSelectProject(projectId)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Projects</Text>
        <Text style={styles.count}>{projects.length} total</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity
          style={[
            styles.chip,
            selectedProjectId === null && styles.chipSelected,
          ]}
          onPress={() => handleSelect(null)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.chipText,
              selectedProjectId === null && styles.chipTextSelected,
            ]}
          >
            All Projects
          </Text>
        </TouchableOpacity>

        {projects.map((project) => (
          <TouchableOpacity
            key={project.id}
            style={[
              styles.chip,
              selectedProjectId === project.id && styles.chipSelected,
            ]}
            onPress={() => handleSelect(project.id)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.chipText,
                selectedProjectId === project.id && styles.chipTextSelected,
              ]}
              numberOfLines={1}
            >
              {project.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  count: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  scrollContent: {
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
    maxWidth: 120,
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
})
