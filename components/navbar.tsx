'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { LogOut, Home, CheckCircle2, Ban } from 'lucide-react'
import Link from 'next/link'
import Logo from './logo'

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
    <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center gap-3">
              <Logo className="h-8 w-8" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Qdo
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-2">
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
                  <Ban className="mr-2 h-4 w-4" />
                  Blocked
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-600 hidden sm:inline truncate max-w-[200px]">
              {userEmail}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white transition-all"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
