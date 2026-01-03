import { useEffect } from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { useRouter, useLocalSearchParams, useGlobalSearchParams } from 'expo-router'
import { supabase } from '../../lib/supabase'
import * as Linking from 'expo-linking'

export default function AuthCallback() {
  const router = useRouter()
  const localParams = useLocalSearchParams()
  const globalParams = useGlobalSearchParams()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        let accessToken: string | null = null
        let refreshToken: string | null = null

        // First check params from expo-router (works on Android)
        const params = { ...globalParams, ...localParams }
        if (params.access_token) {
          accessToken = params.access_token as string
        }
        if (params.refresh_token) {
          refreshToken = params.refresh_token as string
        }

        // If no tokens from params, try getting from initial URL
        if (!accessToken || !refreshToken) {
          const url = await Linking.getInitialURL()
          if (url) {
            // Parse the URL to get tokens from hash or query
            const parsedUrl = new URL(url)

            // Check hash fragment first (iOS typically uses this)
            if (parsedUrl.hash && parsedUrl.hash.length > 1) {
              const hashParams = new URLSearchParams(parsedUrl.hash.slice(1))
              accessToken = accessToken || hashParams.get('access_token')
              refreshToken = refreshToken || hashParams.get('refresh_token')
            }

            // Check query string if not in hash (Android typically uses this)
            if (!accessToken || !refreshToken) {
              accessToken = accessToken || parsedUrl.searchParams.get('access_token')
              refreshToken = refreshToken || parsedUrl.searchParams.get('refresh_token')
            }
          }
        }

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (!error) {
            router.replace('/home')
            return
          }
        }

        // Check if already signed in
        const { data: sessionData } = await supabase.auth.getSession()
        if (sessionData?.session) {
          router.replace('/home')
        } else {
          router.replace('/login')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        router.replace('/login')
      }
    }

    handleCallback()
  }, [])

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#1E40AF" />
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
