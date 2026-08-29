"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Container } from "@/components/storefront/layout/container"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Package, PhoneCall, ShieldCheck, ArrowRight } from "lucide-react"
import { OrderConfirmationResult } from "@/lib/actions/order"

export default function OrderConfirmationPage() {
  const params = useParams()
  const orderNumber = typeof params?.orderNumber === 'string' ? params.orderNumber : ''

  const [orderData] = useState<OrderConfirmationResult | null>(() => {
    if (orderNumber && typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem(`order_conf_${orderNumber}`)
        if (stored) return JSON.parse(stored)
      } catch {
        // Ignore error
      }
    }
    return null
  })

  return (
    <div className="pt-32 pb-24 bg-[#F9F9F7] text-[#1A1A1A] min-h-[85vh]">
      <Container className="max-w-3xl mx-auto">
        
        <div className="bg-white border border-[#1A1A1A]/10 p-8 md:p-12 space-y-8 text-center shadow-sm">
          
          {/* Success Icon & Heading */}
          <div className="space-y-4">
            <div className="h-16 w-16 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} />
            </div>
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#1A1A1A]/60 font-sans block">
              Commande Enregistrée avec Succès
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
              Merci pour votre Confiance
            </h1>
            <p className="text-sm text-[#1A1A1A]/75 font-sans font-light max-w-lg mx-auto leading-relaxed">
              Votre commande <strong>#{orderNumber}</strong> a bien été prise en compte par notre atelier.
            </p>
          </div>

          {/* COD Notice Box */}
          <div className="p-5 bg-[#F9F9F7] border border-[#1A1A1A]/10 text-left flex items-start gap-4">
            <ShieldCheck size={24} className="text-[#1A1A1A] shrink-0 mt-0.5" />
            <div className="text-xs font-sans space-y-1.5">
              <span className="font-semibold text-[#1A1A1A] uppercase tracking-wider text-[11px] block">
                Rappel Paiement à la Livraison (COD)
              </span>
              <p className="text-[#1A1A1A]/80 leading-relaxed">
                Notre service client vous contactera par téléphone pour confirmer l&apos;expédition. Le montant total sera à régler en espèces directement auprès du livreur lors de la réception.
              </p>
            </div>
          </div>

          {/* Order Summary Details (if present in session) */}
          {orderData && (
            <div className="border border-[#1A1A1A]/10 text-left text-xs font-sans divide-y divide-[#1A1A1A]/10">
              <div className="p-4 bg-[#F9F9F7] font-semibold uppercase tracking-wider text-[#1A1A1A]">
                Récapitulatif de votre commande
              </div>

              {orderData.items && orderData.items.length > 0 && (
                <div className="p-4 space-y-2">
                  {orderData.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span>
                        {item.quantity}× {item.productNameSnapshot} {item.variantLabelSnapshot ? `(${item.variantLabelSnapshot})` : ''}
                      </span>
                      <span className="font-semibold">{item.lineTotal.toLocaleString('fr-FR')} DA</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="p-4 space-y-1.5 bg-white">
                <div className="flex justify-between text-[#1A1A1A]/70">
                  <span>Sous-total</span>
                  <span>{orderData.subtotal?.toLocaleString('fr-FR')} DA</span>
                </div>
                <div className="flex justify-between text-[#1A1A1A]/70">
                  <span>Frais de livraison</span>
                  <span>{orderData.deliveryFee?.toLocaleString('fr-FR')} DA</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#1A1A1A] pt-2 border-t border-[#1A1A1A]/10">
                  <span>Total à payer</span>
                  <span>{orderData.total?.toLocaleString('fr-FR')} DA</span>
                </div>
              </div>

              {orderData.delivery && (
                <div className="p-4 space-y-1 bg-[#F9F9F7] text-[#1A1A1A]/80">
                  <span className="font-semibold block text-[#1A1A1A]">Destination de livraison:</span>
                  <p>{orderData.customer?.fullName} • {orderData.customer?.phone}</p>
                  <p>{orderData.delivery.address}, {orderData.delivery.commune} ({orderData.delivery.wilaya})</p>
                  <p className="text-[11px] text-[#1A1A1A]/60 italic mt-1">{orderData.delivery.deliveryMethod}</p>
                </div>
              )}
            </div>
          )}

          {/* Customer Care Contact */}
          <div className="p-4 border border-[#1A1A1A]/10 text-xs font-sans text-[#1A1A1A]/70 flex items-center justify-center gap-3">
            <PhoneCall size={16} className="text-[#1A1A1A]" />
            <span>Une question sur votre livraison ? Notre service client est à votre écoute au <strong>+213 (0) 550 00 00 00</strong></span>
          </div>

          {/* Action Back to Shop */}
          <div className="pt-2">
            <Link href="/shop">
              <Button
                size="lg"
                className="bg-[#1A1A1A] text-white hover:bg-[#1A1A1A]/90 px-8 py-5 text-xs uppercase tracking-[0.25em] inline-flex items-center gap-2"
              >
                <Package size={16} />
                <span>Continuer la Visite</span>
                <ArrowRight size={14} />
              </Button>
            </Link>
          </div>

        </div>

      </Container>
    </div>
  )
}
