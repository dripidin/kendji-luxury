import { StorefrontHeader } from "@/components/storefront/layout/header"
import { StorefrontFooter } from "@/components/storefront/layout/footer"
import { CartProvider } from "@/lib/cart/cart-context"
import { I18nProvider } from "@/lib/i18n/context"
import { CartDrawer } from "@/components/storefront/cart/cart-drawer"

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <CartProvider>
        <div className="flex min-h-screen flex-col font-sans bg-ivory text-charcoal">
          <StorefrontHeader />
          <main className="flex-1">
            {children}
          </main>
          <StorefrontFooter />
          <CartDrawer />
        </div>
      </CartProvider>
    </I18nProvider>
  )
}
