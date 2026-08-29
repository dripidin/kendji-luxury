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
  Store,
  type LucideIcon
} from 'lucide-react'

type NavItem = {
  nameFr: string;
  nameAr: string;
  href: string;
  icon: LucideIcon;
}

type NavGroup = {
  nameFr: string;
  nameAr: string;
  items: NavItem[];
}

const mainNav: NavItem = { 
  nameFr: 'Tableau de bord', 
  nameAr: 'لوحة التحكم', 
  href: '/admin', 
  icon: LayoutDashboard 
}

const navigation: NavGroup[] = [
  {
    nameFr: 'CATALOGUE',
    nameAr: 'الكتالوج',
    items: [
      { nameFr: 'Produits', nameAr: 'المنتجات', href: '/admin/products', icon: Package },
      { nameFr: 'Catégories', nameAr: 'التصنيفات', href: '/admin/categories', icon: Tags },
      { nameFr: 'Collections', nameAr: 'المجموعات', href: '/admin/collections', icon: Layers },
    ],
  },
  {
    nameFr: 'COMMERCE',
    nameAr: 'الطلبات والمبيعات',
    items: [
      { nameFr: 'Commandes (COD)', nameAr: 'الطلبات (COD)', href: '/admin/orders', icon: ShoppingCart },
      { nameFr: 'Inventaire & Stock', nameAr: 'المخزون', href: '/admin/inventory', icon: Package },
      { nameFr: 'Clients', nameAr: 'الزبائن', href: '/admin/customers', icon: Users },
    ],
  },
  {
    nameFr: 'CONTENU',
    nameAr: 'المحتوى والوسائط',
    items: [
      { nameFr: 'Médiathèque', nameAr: 'مكتبة الصور', href: '/admin/media', icon: ImageIcon },
      { nameFr: 'Page d\'accueil', nameAr: 'الصفحة الرئيسية', href: '/admin/content', icon: LayoutTemplate },
    ],
  },
  {
    nameFr: 'SYSTÈME',
    nameAr: 'الإعدادات',
    items: [
      { nameFr: 'Paramètres', nameAr: 'إعدادات المتجر', href: '/admin/settings', icon: Settings },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const MainIcon = mainNav.icon

  return (
    <div className="flex h-full w-64 flex-col border-r bg-white">
      <div className="flex h-14 items-center justify-between border-b px-6">
        <Link href="/admin" className="font-bold tracking-wider text-lg uppercase flex items-center gap-2">
          <span>KenDji</span>
          <span className="text-[10px] font-normal px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">ADMIN</span>
        </Link>
      </div>

      <div className="flex-1 overflow-auto py-4">
        <nav className="space-y-6 px-3">
          {/* Main Dashboard Link */}
          <div>
            <Link
              href={mainNav.href}
              className={cn(
                "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === mainNav.href 
                  ? "bg-gray-900 text-white shadow-sm" 
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <div className="flex items-center gap-3">
                <MainIcon className="h-4 w-4" />
                <span>{mainNav.nameFr}</span>
              </div>
              <span className="text-[11px] opacity-75 font-sans">{mainNav.nameAr}</span>
            </Link>
          </div>

          {/* Grouped Links */}
          {navigation.map((group) => (
            <div key={group.nameFr} className="space-y-1">
              <div className="flex items-center justify-between px-3 mb-2">
                <h4 className="text-[11px] font-bold uppercase text-gray-400 tracking-wider">
                  {group.nameFr}
                </h4>
                <span className="text-[10px] text-gray-400 font-sans">{group.nameAr}</span>
              </div>

              {group.items.map((item) => {
                const isActive = pathname.startsWith(item.href) && (item.href !== '/admin' || pathname === '/admin')
                const ItemIcon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-gray-900 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <ItemIcon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.nameFr}</span>
                    </div>
                    <span className={cn(
                      "text-[11px] shrink-0 font-sans ml-2",
                      isActive ? "text-gray-300" : "text-gray-400"
                    )}>
                      {item.nameAr}
                    </span>
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Storefront Link */}
      <div className="p-3 border-t bg-gray-50/50">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Store className="h-4 w-4 text-gray-500" />
            <span>Voir la boutique</span>
          </div>
          <span className="text-[10px] text-gray-400">معاينة المتجر ↗</span>
        </Link>
      </div>
    </div>
  )
}
