import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native'
import { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import { supabase } from '../lib/supabase'
import { Button, Input } from '../components/ui'
import * as WebBrowser from 'expo-web-browser'
import * as AuthSession from 'expo-auth-session'
import * as AppleAuthentication from 'expo-apple-authentication'

// Required for Google Auth to work properly
WebBrowser.maybeCompleteAuthSession()

const GOOGLE_IOS_CLIENT_ID = '956005568384-okdcvqatb1rjj9allfkd2g5hbrmj26lu.apps.googleusercontent.com'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [appleLoading, setAppleLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const router = useRouter()

  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'qdo',
    path: 'auth/callback',
  })

  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password')
      return
    }

    setLoading(true)
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) throw error

        Alert.alert(
          'Success',
          'Account created! Please check your email to verify your account.',
          [{ text: 'OK', onPress: () => setIsSignUp(false) }]
        )
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        router.replace('/home')
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUri,
          skipBrowserRedirect: true,
        },
      })

      if (error) throw error

      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUri
        )

        if (result.type === 'success' && result.url) {
          // Try to extract tokens from hash fragment first (iOS), then query string (Android)
          const url = new URL(result.url)
          let accessToken: string | null = null
          let refreshToken: string | null = null

          // Check hash fragment first (format: #access_token=...&refresh_token=...)
          if (url.hash && url.hash.length > 1) {
            const hashParams = new URLSearchParams(url.hash.slice(1))
            accessToken = hashParams.get('access_token')
            refreshToken = hashParams.get('refresh_token')
          }

          // If not in hash, check query string (format: ?access_token=...&refresh_token=...)
          if (!accessToken || !refreshToken) {
            accessToken = url.searchParams.get('access_token')
            refreshToken = url.searchParams.get('refresh_token')
          }

          if (accessToken && refreshToken) {
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            })

            if (sessionError) throw sessionError

            router.replace('/home')
            return // Success - exit early
          }

          // If we got here without tokens, check if user is already signed in
          const { data: sessionData } = await supabase.auth.getSession()
          if (sessionData?.session) {
            router.replace('/home')
            return
          }
        }
      }
    } catch (error: any) {
      // Only show error if we're not already signed in
      const { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData?.session) {
        Alert.alert('Error', error.message || 'Google sign in failed')
      } else {
        // User is signed in despite the error, navigate to home
        router.replace('/home')
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleAppleSignIn = async () => {
    if (Platform.OS !== 'ios') {
      Alert.alert('Error', 'Apple Sign In is only available on iOS')
      return
    }

    setAppleLoading(true)
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      })

      if (credential.identityToken) {
        const { error } = await supabase.auth.signInWithIdToken({
          provider: 'apple',
          token: credential.identityToken,
        })

        if (error) throw error

        router.replace('/home')
      }
    } catch (error: any) {
      if (error.code !== 'ERR_REQUEST_CANCELED') {
        Alert.alert('Error', error.message || 'Apple sign in failed')
      }
    } finally {
      setAppleLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.emoji}>📊</Text>
          <Text style={styles.title}>Qdo</Text>
          <Text style={styles.subtitle}>
            Let's get into Q! & get things done 
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Button
            onPress={handleEmailAuth}
            loading={loading}
            disabled={loading}
            fullWidth
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </Button>

          <Button
            onPress={() => setIsSignUp(!isSignUp)}
            variant="ghost"
            fullWidth
          >
            {isSignUp
              ? 'Already have an account? Sign In'
              : "Don't have an account? Sign Up"}
          </Button>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <Button
            onPress={handleGoogleSignIn}
            loading={googleLoading}
            disabled={googleLoading || loading || appleLoading}
            variant="outline"
            fullWidth
          >
            Continue with Google
          </Button>

          {Platform.OS === 'ios' && (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={8}
              style={styles.appleButton}
              onPress={handleAppleSignIn}
            />
          )}
        </View>

        <Text style={styles.note}>
          Let's keep your data safe and secure. We never share your information with third parties.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1E40AF',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#64748B',
    paddingHorizontal: 20,
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D1D5DB',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#9CA3AF',
    fontSize: 14,
  },
  appleButton: {
    width: '100%',
    height: 48,
    marginTop: 12,
  },
  note: {
    marginTop: 40,
    fontSize: 14,
    textAlign: 'center',
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
})
