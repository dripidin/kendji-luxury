"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingBag, Menu, X } from "lucide-react"
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
          : "bg-[#F9F9F7]/95 backdrop-blur-md text-[#1A1A1A] border-b border-[#1A1A1A]/10 shadow-xs"
      )}
    >
      <div className="mx-auto flex h-16 md:h-20 max-w-[1440px] items-center justify-between px-4 sm:px-6 md:px-12 lg:px-20">
        
        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden p-2 -ml-1.5 rounded-md hover:bg-black/5 active:bg-black/10 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Desktop Nav Left */}
        <nav className="hidden lg:flex items-center gap-8 text-xs uppercase tracking-[0.2em] font-medium">
          <Link href="/shop" className="hover:opacity-60 transition-opacity">{t.nav.shop}</Link>
          <Link href="/category" className="hover:opacity-60 transition-opacity">{t.nav.categories}</Link>
          <Link href="/collections" className="hover:opacity-60 transition-opacity">{t.nav.collections}</Link>
        </nav>

        {/* Logo */}
        <Link 
          href="/" 
          className={cn(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-xl sm:text-2xl md:text-3xl font-bold tracking-tight select-none",
            transparentOverlay ? "text-white" : "text-[#1A1A1A]"
          )}
        >
          KENDJI
        </Link>

        {/* Desktop/Mobile Nav Right (Actions) */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-5">
          <LanguageSwitcher />
          
          <button 
            type="button"
            onClick={openCart}
            aria-label={`${t.nav.cart} (${itemCount})`} 
            className="p-2 -mr-1 flex items-center gap-2 hover:opacity-70 transition-opacity rounded-md hover:bg-black/5"
          >
            <div className="relative">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#1A1A1A] text-white text-[9px] font-sans font-bold h-4 w-4 rounded-full flex items-center justify-center border border-white">
                  {itemCount}
                </span>
              )}
            </div>
            <span className="hidden md:inline-block text-xs uppercase tracking-widest mt-0.5 font-medium">
              {t.nav.cart} ({itemCount})
            </span>
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full h-[calc(100vh-4rem)] bg-[#F9F9F7] text-[#1A1A1A] px-6 py-8 flex flex-col justify-between overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-2 text-base uppercase tracking-[0.2em] font-serif">
            <Link 
              href="/shop" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-4 border-b border-[#1A1A1A]/10 flex items-center justify-between hover:text-[#1A1A1A]/70"
            >
              <span>{t.nav.shop}</span>
              <span className="text-xs font-sans text-[#1A1A1A]/40">&rarr;</span>
            </Link>
            <Link 
              href="/category" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-4 border-b border-[#1A1A1A]/10 flex items-center justify-between hover:text-[#1A1A1A]/70"
            >
              <span>{t.nav.categories}</span>
              <span className="text-xs font-sans text-[#1A1A1A]/40">&rarr;</span>
            </Link>
            <Link 
              href="/collections" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-4 border-b border-[#1A1A1A]/10 flex items-center justify-between hover:text-[#1A1A1A]/70"
            >
              <span>{t.nav.collections}</span>
              <span className="text-xs font-sans text-[#1A1A1A]/40">&rarr;</span>
            </Link>
          </div>

          <div className="pt-6 border-t border-[#1A1A1A]/10 space-y-3">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#1A1A1A]/50 font-sans">
              Haute Joaillerie &bull; Alger
            </p>
            <p className="text-xs text-[#1A1A1A]/70 font-sans">
              Livraison sécurisée 58 Wilayas &bull; Paiement à la réception
            </p>
          </div>
        </div>
      )}
    </header>
  )
}
