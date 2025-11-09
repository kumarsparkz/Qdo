'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { LogOut, Home, CheckCircle2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface NavbarProps {
  userEmail?: string
}

export default function Navbar({ userEmail }: NavbarProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold text-primary">Quadrant Todo</h1>
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Button>
              </Link>
              <Link href="/done">
                <Button variant="ghost" size="sm">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Done
                </Button>
              </Link>
              <Link href="/blocked">
                <Button variant="ghost" size="sm">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Blocked
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {userEmail}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
