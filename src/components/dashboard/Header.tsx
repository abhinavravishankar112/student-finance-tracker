"use client"

import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useModalStore } from '@/store/modal-store'
import { LogOut, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Header() {
  const supabase = createClient()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const { openTransactionModal } = useModalStore()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-white/5 bg-background/80 px-4 md:px-8 backdrop-blur-md md:ml-64">
      <div className="flex-1 flex justify-end mr-4">
        <Button onClick={openTransactionModal} className="bg-primary text-black hover:bg-primary/90 font-semibold">
          <Plus className="h-4 w-4 mr-1" /> Add Transaction
        </Button>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
            <Avatar>
              <AvatarImage src={user?.user_metadata?.avatar_url} alt="User Avatar" />
              <AvatarFallback className="bg-primary/20 text-primary">
                {user?.email?.[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="glass-card border-white/5">
          <div className="p-2">
            <p className="text-sm font-medium">{user?.user_metadata?.full_name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}