'use client'

import Link from "next/link"
import { Container } from "@/components/storefront/layout/container"
import { useI18n } from "@/lib/i18n/context"

export function StorefrontFooter() {
  const { t } = useI18n()

  return (
    <footer className="bg-[#1A1A1A] text-white pt-20 pb-10 border-t border-white/10">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          <div className="space-y-6">
            <Link href="/" className="font-serif text-3xl font-bold tracking-tight">KENDJI</Link>
            <p className="text-white/60 text-sm max-w-xs leading-relaxed font-light">
              {t.footer.brandDescription}
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm uppercase tracking-widest font-semibold">{t.footer.explore}</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li><Link href="/shop" className="hover:text-white transition-colors">{t.nav.shop}</Link></li>
              <li><Link href="/collections" className="hover:text-white transition-colors">{t.nav.collections}</Link></li>
              <li><Link href="/category" className="hover:text-white transition-colors">{t.nav.categories}</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm uppercase tracking-widest font-semibold">{t.footer.customerCare}</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li><Link href="#" className="hover:text-white transition-colors">{t.footer.contactUs}</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">{t.footer.shippingReturns}</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">{t.footer.faq}</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm uppercase tracking-widest font-semibold">{t.footer.legal}</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li><Link href="#" className="hover:text-white transition-colors">{t.footer.terms}</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">{t.footer.privacy}</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/50 uppercase tracking-widest">
          <p>&copy; {new Date().getFullYear()} {t.footer.copyright}</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Instagram</Link>
            <Link href="#" className="hover:text-white transition-colors">TikTok</Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}
