import { useEffect } from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { useRouter, usePathname, useGlobalSearchParams } from 'expo-router'
import { supabase } from '../lib/supabase'
import * as Linking from 'expo-linking'

export default function NotFoundScreen() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useGlobalSearchParams()

  useEffect(() => {
    const handleUnmatchedRoute = async () => {
      try {
        // Check if this is an auth callback
        if (pathname.includes('auth') || pathname.includes('callback')) {
          let accessToken: string | null = null
          let refreshToken: string | null = null

          // Check params from expo-router
          if (params.access_token) {
            accessToken = params.access_token as string
          }
          if (params.refresh_token) {
            refreshToken = params.refresh_token as string
          }

          // Try getting from initial URL
          if (!accessToken || !refreshToken) {
            const url = await Linking.getInitialURL()
            if (url) {
              const parsedUrl = new URL(url)

              // Check hash fragment
              if (parsedUrl.hash && parsedUrl.hash.length > 1) {
                const hashParams = new URLSearchParams(parsedUrl.hash.slice(1))
                accessToken = accessToken || hashParams.get('access_token')
                refreshToken = refreshToken || hashParams.get('refresh_token')
              }

              // Check query string
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
        }

        // Check if already signed in
        const { data: sessionData } = await supabase.auth.getSession()
        if (sessionData?.session) {
          router.replace('/home')
        } else {
          router.replace('/login')
        }
      } catch (error) {
        console.error('Not found handler error:', error)
        router.replace('/login')
      }
    }

    handleUnmatchedRoute()
  }, [pathname])

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
