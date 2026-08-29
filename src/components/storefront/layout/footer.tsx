import Link from "next/link"
import { Container } from "@/components/storefront/layout/container"

export function StorefrontFooter() {
  return (
    <footer className="bg-[#1A1A1A] text-white pt-20 pb-10 border-t border-white/10">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          <div className="space-y-6">
            <Link href="/" className="font-serif text-3xl font-bold tracking-tight">KENDJI</Link>
            <p className="text-white/60 text-sm max-w-xs">
              Modern monochrome luxury. Architectural precision and material excellence for the discerning.
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm uppercase tracking-widest font-semibold">Explore</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li><Link href="/shop" className="hover:text-white transition-colors">Shop All</Link></li>
              <li><Link href="/collections" className="hover:text-white transition-colors">Collections</Link></li>
              <li><Link href="/category" className="hover:text-white transition-colors">Categories</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm uppercase tracking-widest font-semibold">Customer Care</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm uppercase tracking-widest font-semibold">Legal</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/50 uppercase tracking-widest">
          <p>&copy; {new Date().getFullYear()} KenDji Luxury. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Instagram</Link>
            <Link href="#" className="hover:text-white transition-colors">Pinterest</Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}
