import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { useAuth } from '../contexts/AuthContext'

export default function Index() {
  const router = useRouter()
  const { session, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (session) {
        router.replace('/home')
      } else {
        router.replace('/login')
      }
    }
  }, [session, loading])

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#3B82F6" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
  },
})
