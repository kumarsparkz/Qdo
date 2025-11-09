'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { LogIn } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      console.error('Error logging in:', error.message)
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
          <Button
            onClick={handleGoogleLogin}
            className="w-full"
            size="lg"
          >
            <LogIn className="mr-2 h-5 w-5" />
            Sign in with Google
          </Button>
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
