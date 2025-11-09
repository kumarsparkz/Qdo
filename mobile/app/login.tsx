import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      })

      if (error) {
        Alert.alert('Error', error.message)
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quadrant Todo</Text>
      <Text style={styles.subtitle}>
        Organize your tasks with the Eisenhower Matrix
      </Text>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleGoogleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.note}>
        Note: For the best experience, use the web version.
        Mobile app is under development.
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
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1e40af',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
    color: '#475569',
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    maxWidth: 300,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  note: {
    marginTop: 30,
    fontSize: 14,
    textAlign: 'center',
    color: '#64748b',
  },
})
