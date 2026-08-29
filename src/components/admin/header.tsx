'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { LogOut, Menu, ExternalLink } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { AdminSidebar } from './sidebar'

export function AdminHeader() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <header className="flex h-14 items-center justify-between border-b bg-white px-6">
      <div className="flex items-center gap-4 lg:hidden">
        <Sheet>
          <SheetTrigger>
            <div className="p-2 -ml-2 rounded-md hover:bg-gray-100 text-gray-700 cursor-pointer">
              <Menu className="h-5 w-5" />
            </div>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <AdminSidebar />
          </SheetContent>
        </Sheet>
        <span className="font-bold tracking-wider uppercase">KenDji</span>
      </div>
      
      <div className="flex flex-1 items-center justify-end gap-3">
        <Link 
          href="/" 
          target="_blank"
          className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors"
        >
          <span>Boutique</span>
          <span className="text-[10px] text-gray-400">/ المتجر</span>
          <ExternalLink className="h-3 w-3" />
        </Link>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLogout} 
          className="text-gray-500 hover:text-rose-600 hover:bg-rose-50 text-xs gap-1.5"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Déconnexion / خروج</span>
        </Button>
      </div>
    </header>
  )
}
