"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/lib/cart/cart-context"
import { ALGERIA_WILAYAS, getCommunesByWilayaCode, getDeliveryFee } from "@/lib/algeria-cities"
import { createCodOrder } from "@/lib/actions/order"
import { trackEvent } from "@/lib/analytics"
import { Container } from "@/components/storefront/layout/container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShieldCheck, Truck, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()

  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [additionalPhone, setAdditionalPhone] = useState("")
  const [email, setEmail] = useState("")
  const [selectedWilaya, setSelectedWilaya] = useState("16") // Default Alger
  const [selectedCommune, setSelectedCommune] = useState("Alger Centre")
  const [address, setAddress] = useState("")
  const [deliveryMethod, setDeliveryMethod] = useState<"DOMICILE" | "STOP_DESK">("DOMICILE")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [idempotencyToken] = useState(() => `order_tok_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`)

  // Track begin_checkout analytics event once
  useEffect(() => {
    trackEvent('begin_checkout', {
      value: subtotal,
      items: items.map(i => ({
        item_id: i.productId,
        item_name: i.name,
        item_variant: i.variantName,
        price: i.unitPrice,
        quantity: i.quantity
      }))
    })
  }, [subtotal, items])

  // Communes list for the selected wilaya
  const availableCommunes = getCommunesByWilayaCode(selectedWilaya)

  // Auto-reset commune when wilaya changes
  const handleWilayaChange = (wilayaCode: string) => {
    setSelectedWilaya(wilayaCode)
    const communes = getCommunesByWilayaCode(wilayaCode)
    if (communes.length > 0) {
      setSelectedCommune(communes[0])
    } else {
      setSelectedCommune("")
    }
  }

  const deliveryFee = getDeliveryFee(selectedWilaya, deliveryMethod)
  const grandTotal = subtotal + deliveryFee

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (items.length === 0) {
      setErrorMessage("Votre panier est vide. Veuillez ajouter un bijou avant de commander.")
      return
    }

    if (!fullName.trim()) {
      setErrorMessage("Veuillez saisir votre nom et prénom.")
      return
    }

    if (!phone.trim()) {
      setErrorMessage("Veuillez saisir votre numéro de téléphone.")
      return
    }

    if (!address.trim()) {
      setErrorMessage("Veuillez saisir votre adresse complète.")
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        customer: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          additionalPhone: additionalPhone.trim() || undefined,
          email: email.trim() || undefined
        },
        delivery: {
          wilaya: selectedWilaya,
          commune: selectedCommune.trim(),
          address: address.trim(),
          deliveryMethod
        },
        items: items.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity
        })),
        idempotencyToken
      }

      const result = await createCodOrder(payload)

      if (result.success && result.orderNumber) {
        trackEvent('purchase', {
          order_id: result.orderNumber,
          value: result.total,
          currency: 'DZD',
          wilaya: selectedWilaya
        })

        // Store confirmation data for thank you page
        if (typeof window !== "undefined") {
          sessionStorage.setItem(`order_conf_${result.orderNumber}`, JSON.stringify(result))
        }

        clearCart()
        router.push(`/checkout/confirmation/${result.orderNumber}`)
      } else {
        setErrorMessage(result.error || "Une erreur est survenue lors de l'enregistrement de votre commande.")
        setIsSubmitting(false)
      }
    } catch {
      setErrorMessage("Impossible de joindre le serveur. Veuillez vérifier votre connexion.")
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-24 bg-[#F9F9F7] min-h-[70vh] flex items-center">
        <Container>
          <div className="max-w-md mx-auto text-center space-y-6 bg-white border border-[#1A1A1A]/10 p-10">
            <h2 className="font-serif text-2xl font-bold">Votre panier est vide</h2>
            <p className="text-sm text-[#1A1A1A]/70 font-sans font-light">
              Veuillez sélectionner vos bijoux avant de procéder à la commande.
            </p>
            <Link href="/shop" className="block">
              <Button className="w-full bg-[#1A1A1A] text-white hover:bg-[#1A1A1A]/90 text-xs uppercase tracking-widest py-4">
                Explorer la Boutique
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className="pt-28 pb-24 bg-[#F9F9F7] text-[#1A1A1A] min-h-screen">
      <Container>
        
        {/* Navigation back */}
        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#1A1A1A]/60 hover:text-[#1A1A1A] font-sans">
            <ArrowLeft size={14} />
            <span>Retour au panier</span>
          </Link>
        </div>

        <div className="border-b border-[#1A1A1A]/10 pb-6 mb-10">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#1A1A1A]/60 font-sans block mb-2">
            Finalisation de Commande
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
            Paiement à la Livraison (Cash on Delivery)
          </h1>
        </div>

        {errorMessage && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-800 text-xs font-sans flex items-start gap-3">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">Attention:</span>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: Customer Information & Delivery Details (7 cols) */}
          <div className="lg:col-span-7 space-y-8 bg-white border border-[#1A1A1A]/10 p-6 md:p-10">
            
            {/* Section 1: Contact Information */}
            <div className="space-y-4">
              <div className="border-b border-[#1A1A1A]/10 pb-3 flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold tracking-tight">
                  1. Vos Coordonnées
                </h3>
                <span className="text-[10px] uppercase tracking-wider text-[#1A1A1A]/50 font-sans">
                  * Champs obligatoires
                </span>
              </div>

              <div className="space-y-4 font-sans text-xs">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-xs uppercase tracking-wider font-semibold text-[#1A1A1A]/80">
                    Nom et Prénom *
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    required
                    placeholder="Ex: Amina Benali"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-12 border-[#1A1A1A]/20 focus:border-[#1A1A1A] rounded-none text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs uppercase tracking-wider font-semibold text-[#1A1A1A]/80">
                      Téléphone Mobile *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      placeholder="05XX XX XX XX / 06XX..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-12 border-[#1A1A1A]/20 focus:border-[#1A1A1A] rounded-none text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="additionalPhone" className="text-xs uppercase tracking-wider font-semibold text-[#1A1A1A]/80">
                      Numéro de secours (Optionnel)
                    </Label>
                    <Input
                      id="additionalPhone"
                      type="tel"
                      placeholder="Second numéro de contact"
                      value={additionalPhone}
                      onChange={(e) => setAdditionalPhone(e.target.value)}
                      className="h-12 border-[#1A1A1A]/20 focus:border-[#1A1A1A] rounded-none text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs uppercase tracking-wider font-semibold text-[#1A1A1A]/80">
                    Adresse Email (Optionnel)
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Pour recevoir votre accusé par email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 border-[#1A1A1A]/20 focus:border-[#1A1A1A] rounded-none text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Delivery Destination */}
            <div className="space-y-4 pt-4 border-t border-[#1A1A1A]/10">
              <div className="border-b border-[#1A1A1A]/10 pb-3">
                <h3 className="font-serif text-lg font-bold tracking-tight">
                  2. Adresse de Livraison (Algérie)
                </h3>
              </div>

              <div className="space-y-4 font-sans text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Wilaya Selection */}
                  <div className="space-y-1.5">
                    <Label htmlFor="wilaya" className="text-xs uppercase tracking-wider font-semibold text-[#1A1A1A]/80">
                      Wilaya *
                    </Label>
                    <select
                      id="wilaya"
                      value={selectedWilaya}
                      onChange={(e) => handleWilayaChange(e.target.value)}
                      className="w-full h-12 px-3 border border-[#1A1A1A]/20 focus:border-[#1A1A1A] bg-white text-sm outline-none rounded-none"
                    >
                      {ALGERIA_WILAYAS.map((w) => (
                        <option key={w.code} value={w.code}>
                          {w.code} - {w.name} {w.nameAr ? `(${w.nameAr})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dependent Commune Selection */}
                  <div className="space-y-1.5">
                    <Label htmlFor="commune" className="text-xs uppercase tracking-wider font-semibold text-[#1A1A1A]/80">
                      Commune *
                    </Label>
                    <select
                      id="commune"
                      value={selectedCommune}
                      onChange={(e) => setSelectedCommune(e.target.value)}
                      className="w-full h-12 px-3 border border-[#1A1A1A]/20 focus:border-[#1A1A1A] bg-white text-sm outline-none rounded-none"
                    >
                      {availableCommunes.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="address" className="text-xs uppercase tracking-wider font-semibold text-[#1A1A1A]/80">
                    Adresse Complète & Repère *
                  </Label>
                  <Input
                    id="address"
                    type="text"
                    required
                    placeholder="Quartier, rue, numéro de bâtiment, étage..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="h-12 border-[#1A1A1A]/20 focus:border-[#1A1A1A] rounded-none text-sm"
                  />
                </div>

                {/* Delivery Mode Choice */}
                <div className="space-y-2 pt-2">
                  <Label className="text-xs uppercase tracking-wider font-semibold text-[#1A1A1A]/80 block">
                    Mode d&apos;Expédition
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod("DOMICILE")}
                      className={`p-3.5 border text-left transition-all ${
                        deliveryMethod === "DOMICILE"
                          ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                          : "border-[#1A1A1A]/20 bg-white text-[#1A1A1A] hover:border-[#1A1A1A]/50"
                      }`}
                    >
                      <span className="font-semibold block text-xs uppercase tracking-wider">
                        Livraison à Domicile
                      </span>
                      <span className={`text-[11px] block mt-0.5 ${deliveryMethod === "DOMICILE" ? "text-white/80" : "text-[#1A1A1A]/60"}`}>
                        Remise directe à votre adresse
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMethod("STOP_DESK")}
                      className={`p-3.5 border text-left transition-all ${
                        deliveryMethod === "STOP_DESK"
                          ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                          : "border-[#1A1A1A]/20 bg-white text-[#1A1A1A] hover:border-[#1A1A1A]/50"
                      }`}
                    >
                      <span className="font-semibold block text-xs uppercase tracking-wider">
                        Point Relais (Stop-Desk)
                      </span>
                      <span className={`text-[11px] block mt-0.5 ${deliveryMethod === "STOP_DESK" ? "text-white/80" : "text-[#1A1A1A]/60"}`}>
                        Réception en agence express
                      </span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Section 3: Payment Guarantee */}
            <div className="p-4 bg-[#F9F9F7] border border-[#1A1A1A]/10 flex items-start gap-3">
              <CheckCircle2 size={18} className="text-emerald-700 shrink-0 mt-0.5" />
              <div className="text-xs font-sans text-[#1A1A1A]/80 space-y-1">
                <span className="font-semibold text-[#1A1A1A] block">
                  Paiement 100% à la Livraison (Espèces)
                </span>
                <p>
                  Vous ne payez rien maintenant. Vous réglerez le montant exact auprès du livreur lors de la réception de votre colis.
                </p>
              </div>
            </div>

          </div>

          {/* Right: Order Summary & Action (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-[#1A1A1A]/10 p-6 md:p-8 space-y-6 sticky top-28">
            <h3 className="font-serif text-xl font-bold tracking-tight border-b border-[#1A1A1A]/10 pb-4">
              Détail de votre Commande
            </h3>

            {/* Items Mini List */}
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.key} className="flex gap-3 items-center justify-between text-xs font-sans border-b border-[#1A1A1A]/5 pb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-14 w-12 relative bg-[#F2F2EF] shrink-0 border border-[#1A1A1A]/10 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="60px"
                        className="object-cover object-center"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-serif font-bold truncate text-[#1A1A1A]">
                        {item.name}
                      </h4>
                      {item.variantName && (
                        <span className="text-[10px] uppercase text-[#1A1A1A]/60 block">
                          {item.variantName}
                        </span>
                      )}
                      <span className="text-[11px] text-[#1A1A1A]/60 block">
                        Qté: {item.quantity} × {item.unitPrice.toLocaleString('fr-FR')} DA
                      </span>
                    </div>
                  </div>

                  <span className="font-bold text-[#1A1A1A] shrink-0">
                    {(item.unitPrice * item.quantity).toLocaleString('fr-FR')} DA
                  </span>
                </div>
              ))}
            </div>

            {/* Breakdown */}
            <div className="space-y-2.5 pt-2 border-t border-[#1A1A1A]/10 text-xs font-sans">
              <div className="flex justify-between text-[#1A1A1A]/80">
                <span>Sous-total articles</span>
                <span className="font-semibold">{subtotal.toLocaleString('fr-FR')} DA</span>
              </div>
              <div className="flex justify-between text-[#1A1A1A]/80">
                <span>Frais de livraison ({deliveryMethod === "DOMICILE" ? "Domicile" : "Stop-Desk"})</span>
                <span className="font-semibold">{deliveryFee.toLocaleString('fr-FR')} DA</span>
              </div>
              <div className="border-t border-[#1A1A1A]/10 pt-3 flex justify-between items-baseline">
                <span className="font-serif text-base font-bold">Total à la Réception</span>
                <span className="font-sans text-2xl font-bold text-[#1A1A1A]">
                  {grandTotal.toLocaleString('fr-FR')} DA
                </span>
              </div>
            </div>

            {/* Submit Action */}
            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="w-full h-16 bg-[#1A1A1A] text-white hover:bg-[#1A1A1A]/90 text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-3 shadow-xl transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Validation en cours...</span>
                </>
              ) : (
                <span>Confirmer la Commande • COD</span>
              )}
            </Button>

            {/* Trust Reassurance */}
            <div className="space-y-2 pt-3 border-t border-[#1A1A1A]/10 text-[11px] font-sans text-[#1A1A1A]/70">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-[#1A1A1A]" />
                <span>Validation téléphonique avant expédition.</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck size={14} className="text-[#1A1A1A]" />
                <span>Colis scellé et protégé avec présentation écrin cadeau.</span>
              </div>
            </div>

          </div>

        </form>

      </Container>
    </div>
  )
}
