import { Stack } from 'expo-router'
import { AuthProvider } from '../contexts/AuthContext'
import { DataProvider } from '../contexts/DataContext'

export default function RootLayout() {
  return (
    <AuthProvider>
      <DataProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen
            name="home"
            options={{
              title: 'Qdo',
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="done"
            options={{
              title: 'Done Tasks',
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="blocked"
            options={{
              title: 'Blocked Tasks',
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="create-task"
            options={{
              title: 'Create Task',
              presentation: 'modal',
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="task-detail"
            options={{
              title: 'Task Details',
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="create-project"
            options={{
              title: 'Create Project',
              presentation: 'modal',
              headerShown: true,
            }}
          />
        </Stack>
      </DataProvider>
    </AuthProvider>
  )
}
