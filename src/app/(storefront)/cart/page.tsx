"use client"

import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/lib/cart/cart-context"
import { Container } from "@/components/storefront/layout/container"
import { Button } from "@/components/ui/button"
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck, ArrowLeft } from "lucide-react"

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, subtotal, itemCount } = useCart()

  const formattedSubtotal = `${subtotal.toLocaleString('fr-FR')} DA`

  return (
    <div className="pt-28 pb-24 bg-[#F9F9F7] text-[#1A1A1A] min-h-[80vh]">
      <Container>
        
        {/* Page Header */}
        <div className="border-b border-[#1A1A1A]/10 pb-6 mb-10 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#1A1A1A]/60 font-sans block mb-2">
              Panier & Sélection
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
              Votre Panier d&apos;Achat ({itemCount})
            </h1>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="text-xs uppercase tracking-widest text-[#1A1A1A]/50 hover:text-red-600 transition-colors font-sans"
            >
              Vider le panier
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="py-24 text-center space-y-6 bg-white border border-[#1A1A1A]/10 p-12">
            <ShoppingBag size={48} strokeWidth={1} className="mx-auto text-[#1A1A1A]/30" />
            <h2 className="font-serif text-2xl font-semibold">Votre panier est actuellement vide</h2>
            <p className="text-sm text-[#1A1A1A]/70 font-sans font-light max-w-md mx-auto">
              Parcourez nos collections de haute joaillerie et composez votre parure d&apos;exception.
            </p>
            <div className="pt-4">
              <Link href="/shop">
                <Button className="bg-[#1A1A1A] text-white hover:bg-[#1A1A1A]/90 px-8 py-5 text-xs uppercase tracking-[0.25em]">
                  Découvrir les Bijoux
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: Cart Items List (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {items.map((item) => {
                const lineTotal = `${(item.unitPrice * item.quantity).toLocaleString('fr-FR')} DA`
                return (
                  <div key={item.key} className="p-6 bg-white border border-[#1A1A1A]/10 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                    
                    <div className="flex gap-4 items-center min-w-0">
                      <div className="h-24 w-20 relative bg-[#F2F2EF] shrink-0 border border-[#1A1A1A]/5 overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="100px"
                          className="object-cover object-center"
                        />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <Link href={`/product/${item.slug}`} className="hover:opacity-75 transition-opacity">
                          <h3 className="font-serif text-lg font-bold text-[#1A1A1A] truncate">
                            {item.name}
                          </h3>
                        </Link>
                        {item.variantName && (
                          <span className="text-xs uppercase tracking-wider text-[#1A1A1A]/60 font-sans block">
                            Finition: {item.variantName}
                          </span>
                        )}
                        <span className="font-sans text-xs text-[#1A1A1A]/70 block">
                          Prix unitaire: {item.unitPrice.toLocaleString('fr-FR')} DA
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-8 pt-4 sm:pt-0 border-t sm:border-t-0 border-[#1A1A1A]/10">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-[#1A1A1A]/20 bg-[#F9F9F7] h-10">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.key, item.quantity - 1)}
                          className="px-3 text-sm text-[#1A1A1A] hover:bg-white transition-colors"
                        >
                          -
                        </button>
                        <span className="px-3 text-xs font-medium font-sans min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.key, item.quantity + 1)}
                          className="px-3 text-sm text-[#1A1A1A] hover:bg-white transition-colors"
                        >
                          +
                        </button>
                      </div>

                      {/* Line Total */}
                      <div className="font-sans text-base font-bold text-[#1A1A1A] min-w-[100px] text-right">
                        {lineTotal}
                      </div>

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() => removeItem(item.key)}
                        aria-label={`Supprimer ${item.name}`}
                        className="text-[#1A1A1A]/40 hover:text-red-600 transition-colors p-2"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                  </div>
                )
              })}

              <div className="pt-4">
                <Link href="/shop" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#1A1A1A]/70 hover:text-[#1A1A1A] font-sans">
                  <ArrowLeft size={14} />
                  <span>Continuer vos achats</span>
                </Link>
              </div>
            </div>

            {/* Right: Order Summary Box (4 cols) */}
            <div className="lg:col-span-4 bg-white border border-[#1A1A1A]/10 p-6 md:p-8 space-y-6 sticky top-28">
              <h3 className="font-serif text-xl font-bold tracking-tight border-b border-[#1A1A1A]/10 pb-4">
                Récapitulatif
              </h3>

              <div className="space-y-3 text-xs font-sans">
                <div className="flex justify-between text-[#1A1A1A]/80">
                  <span>Sous-total articles</span>
                  <span className="font-semibold">{formattedSubtotal}</span>
                </div>
                <div className="flex justify-between text-[#1A1A1A]/80">
                  <span>Livraison (Algérie)</span>
                  <span className="text-[#1A1A1A]/60 italic">Calculée à l&apos;adresse</span>
                </div>
                <div className="flex justify-between text-[#1A1A1A]/80">
                  <span>Mode de règlement</span>
                  <span className="font-semibold text-emerald-800">Paiement à la livraison (COD)</span>
                </div>
              </div>

              <div className="border-t border-[#1A1A1A]/10 pt-4 flex justify-between items-baseline">
                <span className="font-serif text-base font-bold">Total estimé</span>
                <span className="font-sans text-2xl font-bold text-[#1A1A1A]">{formattedSubtotal}</span>
              </div>

              <Link href="/checkout" className="block w-full">
                <Button
                  size="lg"
                  className="w-full h-14 bg-[#1A1A1A] text-white hover:bg-[#1A1A1A]/90 text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-3 shadow-md"
                >
                  <span>Valider la Commande</span>
                  <ArrowRight size={16} />
                </Button>
              </Link>

              <div className="pt-2 space-y-2 text-[11px] font-sans text-[#1A1A1A]/70 border-t border-[#1A1A1A]/5">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-[#1A1A1A]" />
                  <span>Aucun paiement préalable requis par carte bancaire.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={14} className="text-[#1A1A1A]" />
                  <span>Livraison express sécurisée dans les 58 wilayas.</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </Container>
    </div>
  )
}
