'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Package,
  Tags,
  Layers,
  ShoppingCart,
  Users,
  Image as ImageIcon,
  LayoutTemplate,
  Settings,
  type LucideIcon
} from 'lucide-react'

type NavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
}

type NavGroup = {
  name: string;
  items: NavItem[];
}

const mainNav: NavItem = { name: 'Dashboard', href: '/admin', icon: LayoutDashboard }

const navigation: NavGroup[] = [
  {
    name: 'CATALOG',
    items: [
      { name: 'Products', href: '/admin/products', icon: Package },
      { name: 'Categories', href: '/admin/categories', icon: Tags },
      { name: 'Collections', href: '/admin/collections', icon: Layers },
    ],
  },
  {
    name: 'COMMERCE',
    items: [
      { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
      { name: 'Inventory', href: '/admin/inventory', icon: Package },
      { name: 'Customers', href: '/admin/customers', icon: Users },
    ],
  },
  {
    name: 'CONTENT',
    items: [
      { name: 'Media', href: '/admin/media', icon: ImageIcon },
      { name: 'Homepage', href: '/admin/content', icon: LayoutTemplate },
    ],
  },
  {
    name: 'SYSTEM',
    items: [
      { name: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const MainIcon = mainNav.icon

  return (
    <div className="flex h-full w-64 flex-col border-r bg-white">
      <div className="flex h-14 items-center border-b px-6">
        <Link href="/admin" className="font-bold tracking-wider text-xl uppercase">
          KenDji
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="space-y-6 px-4">
          {/* Main Dashboard Link */}
          <div>
            <Link
              href={mainNav.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === mainNav.href 
                  ? "bg-black text-white" 
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <MainIcon className="h-4 w-4" />
              {mainNav.name}
            </Link>
          </div>

          {/* Grouped Links */}
          {navigation.map((group) => (
            <div key={group.name} className="space-y-1">
              <h4 className="px-3 text-xs font-semibold uppercase text-gray-400 tracking-wider mb-2">
                {group.name}
              </h4>
              {group.items.map((item) => {
                const isActive = pathname.startsWith(item.href) && (item.href !== '/admin' || pathname === '/admin')
                const ItemIcon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-black text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    <ItemIcon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}
