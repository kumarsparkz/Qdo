'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { LogIn, Mail, AlertCircle } from 'lucide-react'
import { useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
    }
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          setError('Passwords do not match')
          setLoading(false)
          return
        }

        if (password.length < 6) {
          setError('Password must be at least 6 characters')
          setLoading(false)
          return
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })

        if (error) throw error

        if (data?.user?.identities?.length === 0) {
          setError('This email is already registered. Please sign in instead.')
        } else {
          setMessage('Check your email for the confirmation link!')
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        router.push('/')
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred during authentication')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Quadrant Todo</CardTitle>
          <CardDescription className="text-lg">
            Organize your tasks with the Eisenhower Matrix
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground">
              Prioritize what matters most with our 4-quadrant task management system
            </p>
          </div>

          {/* Google OAuth */}
          <Button
            onClick={handleGoogleLogin}
            className="w-full"
            size="lg"
            variant="outline"
          >
            <LogIn className="mr-2 h-5 w-5" />
            Sign in with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Email Auth Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {message && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded flex items-start">
                <Mail className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{message}</span>
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              <Mail className="mr-2 h-5 w-5" />
              {loading
                ? mode === 'signup'
                  ? 'Creating account...'
                  : 'Signing in...'
                : mode === 'signup'
                ? 'Sign up with Email'
                : 'Sign in with Email'}
            </Button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin')
                setError('')
                setMessage('')
              }}
              className="text-sm text-primary hover:underline"
            >
              {mode === 'signin'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
