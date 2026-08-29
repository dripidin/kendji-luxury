"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/lib/cart/cart-context"
import { X, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal, itemCount } = useCart()

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeCart()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, closeCart])

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  if (!isOpen) return null

  const formattedSubtotal = `${subtotal.toLocaleString('fr-FR')} DA`

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Slide-over Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside 
          aria-label="Shopping Cart Drawer"
          className="w-screen max-w-md bg-[#F9F9F7] text-[#1A1A1A] border-l border-[#1A1A1A]/10 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300"
        >
          
          {/* Header */}
          <div className="p-6 border-b border-[#1A1A1A]/10 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <ShoppingBag size={20} strokeWidth={1.5} />
              <h2 className="font-serif text-lg font-bold tracking-tight">
                Votre Panier ({itemCount})
              </h2>
            </div>
            <button
              type="button"
              onClick={closeCart}
              aria-label="Fermer le panier"
              className="p-2 -mr-2 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <ShoppingBag size={40} strokeWidth={1} className="mx-auto text-[#1A1A1A]/30" />
                <p className="font-serif text-lg font-medium text-[#1A1A1A]">Votre panier est vide</p>
                <p className="text-xs text-[#1A1A1A]/60 font-sans max-w-xs mx-auto">
                  Découvrez nos créations exclusives et ajoutez vos bijoux favoris.
                </p>
                <div className="pt-2">
                  <Button
                    onClick={closeCart}
                    variant="outline"
                    className="border-[#1A1A1A]/20 text-xs uppercase tracking-widest px-6"
                  >
                    Explorer la Boutique
                  </Button>
                </div>
              </div>
            ) : (
              items.map((item) => {
                const lineTotal = `${(item.unitPrice * item.quantity).toLocaleString('fr-FR')} DA`
                return (
                  <div key={item.key} className="flex gap-4 p-3 bg-white border border-[#1A1A1A]/10">
                    
                    {/* Thumbnail */}
                    <div className="h-20 w-16 relative bg-[#F2F2EF] shrink-0 border border-[#1A1A1A]/5 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover object-center"
                      />
                    </div>

                    {/* Content & Controls */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-serif text-sm font-semibold text-[#1A1A1A] truncate">
                            {item.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeItem(item.key)}
                            aria-label={`Supprimer ${item.name}`}
                            className="text-[#1A1A1A]/40 hover:text-red-600 transition-colors p-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        {item.variantName && (
                          <span className="text-[10px] uppercase tracking-wider text-[#1A1A1A]/60 font-sans block mt-0.5">
                            Finition: {item.variantName}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#1A1A1A]/5 mt-2">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-[#1A1A1A]/20 bg-[#F9F9F7] h-8">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.key, item.quantity - 1)}
                            className="px-2.5 text-xs text-[#1A1A1A] hover:bg-white"
                          >
                            -
                          </button>
                          <span className="px-2.5 text-xs font-medium font-sans min-w-[1.5rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.key, item.quantity + 1)}
                            className="px-2.5 text-xs text-[#1A1A1A] hover:bg-white"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-sans text-xs font-semibold text-[#1A1A1A]">
                          {lineTotal}
                        </span>
                      </div>

                    </div>

                  </div>
                )
              })
            )}
          </div>

          {/* Footer / Summary */}
          {items.length > 0 && (
            <div className="p-6 bg-white border-t border-[#1A1A1A]/10 space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs uppercase tracking-widest text-[#1A1A1A]/60 font-sans">
                    Sous-total
                  </span>
                  <span className="font-sans text-xl font-bold text-[#1A1A1A]">
                    {formattedSubtotal}
                  </span>
                </div>
                <p className="text-[11px] text-[#1A1A1A]/60 font-sans">
                  Frais de livraison calculés à l&apos;étape de validation • Paiement à la réception (COD).
                </p>
              </div>

              <div className="space-y-2">
                <Link href="/checkout" onClick={closeCart} className="block w-full">
                  <Button
                    size="lg"
                    className="w-full h-14 bg-[#1A1A1A] text-white hover:bg-[#1A1A1A]/90 text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-3 shadow-md"
                  >
                    <span>Commander (COD)</span>
                    <ArrowRight size={16} />
                  </Button>
                </Link>

                <Link href="/cart" onClick={closeCart} className="block w-full text-center">
                  <span className="text-xs uppercase tracking-widest text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors inline-block py-1 font-sans">
                    Voir le panier complet
                  </span>
                </Link>
              </div>
            </div>
          )}

        </aside>
      </div>
    </div>
  )
}
