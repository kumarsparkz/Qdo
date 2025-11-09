import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { supabase } from '../lib/supabase'

export default function Index() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()

    if (session) {
      // User is authenticated, navigate to home
      // For now, just show a message
      setLoading(false)
    } else {
      router.replace('/login')
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.text}>Loading...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quadrant Todo</Text>
      <Text style={styles.subtitle}>Mobile app coming soon!</Text>
      <Text style={styles.text}>
        For now, please use the web version at your Vercel URL
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f9ff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1e40af',
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 20,
    color: '#475569',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: '#64748b',
    marginTop: 10,
  },
})
