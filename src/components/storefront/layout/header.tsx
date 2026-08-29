"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, ShoppingBag, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCart } from "@/lib/cart/cart-context"
import { useI18n } from "@/lib/i18n/context"
import { LanguageSwitcher } from "@/components/storefront/layout/language-switcher"

export function StorefrontHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { openCart, itemCount } = useCart()
  const { t } = useI18n()

  const isHome = pathname === "/"

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const [prevPathname, setPrevPathname] = useState(pathname)
  
  if (pathname !== prevPathname) {
    setPrevPathname(pathname)
    setIsMobileMenuOpen(false)
  }

  const transparentOverlay = isHome && !isScrolled && !isMobileMenuOpen

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300",
        transparentOverlay
          ? "bg-transparent text-white"
          : "bg-[#F9F9F7] text-[#1A1A1A] border-b border-[#1A1A1A]/10 shadow-sm"
      )}
    >
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 md:px-12 lg:px-20">
        
        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden p-2 -ml-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Nav Left */}
        <nav className="hidden lg:flex items-center gap-8 text-sm uppercase tracking-widest font-medium">
          <Link href="/shop" className="hover:opacity-70 transition-opacity">{t.nav.shop}</Link>
          <Link href="/category" className="hover:opacity-70 transition-opacity">{t.nav.categories}</Link>
          <Link href="/collections" className="hover:opacity-70 transition-opacity">{t.nav.collections}</Link>
        </nav>

        {/* Logo */}
        <Link 
          href="/" 
          className={cn(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-2xl md:text-3xl font-bold tracking-tight",
            transparentOverlay ? "text-white" : "text-[#1A1A1A]"
          )}
        >
          KENDJI
        </Link>

        {/* Desktop/Mobile Nav Right (Actions) */}
        <div className="flex items-center gap-3 md:gap-5">
          <LanguageSwitcher />
          <Link href="/shop" aria-label={t.nav.search} className="p-2 hover:opacity-70 transition-opacity">
            <Search size={20} strokeWidth={1.5} />
          </Link>
          <button 
            type="button"
            onClick={openCart}
            aria-label={`${t.nav.cart} (${itemCount})`} 
            className="p-2 flex items-center gap-2 hover:opacity-70 transition-opacity"
          >
            <div className="relative">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#1A1A1A] text-white text-[9px] font-sans font-bold h-4 w-4 rounded-full flex items-center justify-center border border-white">
                  {itemCount}
                </span>
              )}
            </div>
            <span className="hidden md:inline-block text-xs uppercase tracking-widest mt-0.5">
              {t.nav.cart} ({itemCount})
            </span>
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full h-[calc(100vh-5rem)] bg-[#F9F9F7] text-[#1A1A1A] p-6 flex flex-col gap-6 text-lg uppercase tracking-widest">
          <Link href="/shop" className="py-3 border-b border-[#1A1A1A]/10">{t.nav.shop}</Link>
          <Link href="/category" className="py-3 border-b border-[#1A1A1A]/10">{t.nav.categories}</Link>
          <Link href="/collections" className="py-3 border-b border-[#1A1A1A]/10">{t.nav.collections}</Link>
        </div>
      )}
    </header>
  )
}
