"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/lib/cart/cart-context"
import { useI18n } from "@/lib/i18n/context"
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
  const { t, locale, dir } = useI18n()

  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [additionalPhone, setAdditionalPhone] = useState("")
  const [email, setEmail] = useState("")
  const [selectedWilaya, setSelectedWilaya] = useState("16") // Default Alger
  const [selectedCommune, setSelectedCommune] = useState("Alger Centre")
  const [address, setAddress] = useState("")
  
  // Delivery method must NOT be selected by default
  const [deliveryMethod, setDeliveryMethod] = useState<"DOMICILE" | "STOP_DESK" | null>(null)

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

  const deliveryFee = deliveryMethod ? getDeliveryFee(selectedWilaya, deliveryMethod) : 0
  const grandTotal = subtotal + deliveryFee

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (items.length === 0) {
      setErrorMessage(locale === 'ar' ? "سلة المشتريات فارغة." : "Votre panier est vide. Veuillez ajouter un bijou avant de commander.")
      return
    }

    if (!fullName.trim()) {
      setErrorMessage(locale === 'ar' ? "يرجى كتابة الاسم واللقب." : "Veuillez saisir votre nom et prénom.")
      return
    }

    if (!phone.trim()) {
      setErrorMessage(locale === 'ar' ? "يرجى كتابة رقم الهاتف." : "Veuillez saisir votre numéro de téléphone.")
      return
    }

    if (!address.trim()) {
      setErrorMessage(locale === 'ar' ? "يرجى كتابة العنوان بالتفصيل." : "Veuillez saisir votre adresse complète.")
      return
    }

    if (!deliveryMethod) {
      setErrorMessage(locale === 'ar' ? "يرجى اختيار طريقة التوصيل (توصيل للمنزل أو استلام من المكتب)." : "Veuillez choisir un mode d'expédition (Livraison à Domicile ou Point Relais).")
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
          commune: selectedCommune,
          address: address.trim(),
          deliveryMethod
        },
        items: items.map(i => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity,
          unitPrice: i.unitPrice
        })),
        idempotencyToken
      }

      const res = await createCodOrder(payload)

      if (!res.success) {
        throw new Error(res.error || (locale === 'ar' ? "حدث خطأ أثناء معالجة الطلب." : "Échec de l'enregistrement de la commande."))
      }

      // Track purchase event
      trackEvent('purchase', {
        transaction_id: res.orderNumber || 'ORDER',
        value: grandTotal,
        currency: 'DZD',
        items: items.map(i => ({
          item_id: i.productId,
          item_name: i.name,
          item_variant: i.variantName,
          price: i.unitPrice,
          quantity: i.quantity
        }))
      })

      // Store order confirmation snapshot for confirmation page display
      if (res.orderNumber && typeof window !== "undefined") {
        try {
          sessionStorage.setItem(`order_conf_${res.orderNumber}`, JSON.stringify(res))
        } catch {
          // Ignore session storage error
        }
      }

      // Clear the cart
      clearCart()

      // Redirect to confirmation page
      router.push(`/checkout/confirmation/${encodeURIComponent(res.orderNumber || '')}`)

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      setErrorMessage(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-24 bg-[#F9F9F7] text-[#1A1A1A] min-h-[70vh] flex items-center" dir={dir}>
        <Container className="text-center max-w-md mx-auto space-y-6 bg-white p-8 border border-[#1A1A1A]/10">
          <CheckCircle2 size={48} className="mx-auto text-[#1A1A1A]/40" />
          <h2 className="font-serif text-2xl font-bold tracking-tight">{t.cart.empty}</h2>
          <p className="text-sm text-[#1A1A1A]/60 font-sans">
            {t.cart.emptySub}
          </p>
          <div className="pt-2">
            <Link href="/shop">
              <Button className="w-full bg-[#1A1A1A] text-white hover:bg-[#1A1A1A]/90 text-xs uppercase tracking-widest py-4">
                {t.common.shopNow}
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className="pt-28 pb-24 bg-[#F9F9F7] text-[#1A1A1A] min-h-screen" dir={dir}>
      <Container>
        
        {/* Navigation back */}
        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#1A1A1A]/60 hover:text-[#1A1A1A] font-sans">
            <ArrowLeft size={14} className={dir === 'rtl' ? 'rotate-180' : ''} />
            <span>{t.common.back}</span>
          </Link>
        </div>

        <div className="border-b border-[#1A1A1A]/10 pb-6 mb-10">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#1A1A1A]/60 font-sans block mb-2">
            {t.checkout.title}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
            {t.checkout.subtitle}
          </h1>
        </div>

        {errorMessage && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-800 text-xs font-sans flex items-start gap-3">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">{locale === 'ar' ? 'تنبيه:' : 'Attention:'}</span>
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
                  {locale === 'ar' ? '1. المعلومات الشخصية' : '1. Vos Coordonnées'}
                </h3>
                <span className="text-[10px] uppercase tracking-wider text-[#1A1A1A]/50 font-sans">
                  {locale === 'ar' ? '* حقول إجبارية' : '* Champs obligatoires'}
                </span>
              </div>

              <div className="space-y-4 font-sans text-xs">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-xs uppercase tracking-wider font-semibold text-[#1A1A1A]/80">
                    {t.checkout.fullName} *
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    required
                    placeholder={locale === 'ar' ? "مثال: أمينة بن علي" : "Ex: Amina Benali"}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-12 border-[#1A1A1A]/20 focus:border-[#1A1A1A] rounded-none text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs uppercase tracking-wider font-semibold text-[#1A1A1A]/80">
                      {t.checkout.phone} *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      placeholder="05XX XX XX XX / 06XX..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-12 border-[#1A1A1A]/20 focus:border-[#1A1A1A] rounded-none text-sm font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="additionalPhone" className="text-xs uppercase tracking-wider font-semibold text-[#1A1A1A]/80">
                      {locale === 'ar' ? 'رقم هاتف إضافي (اختياري)' : 'Numéro de secours (Optionnel)'}
                    </Label>
                    <Input
                      id="additionalPhone"
                      type="tel"
                      placeholder={locale === 'ar' ? "رقم ثانٍ للتواصل" : "Second numéro de contact"}
                      value={additionalPhone}
                      onChange={(e) => setAdditionalPhone(e.target.value)}
                      className="h-12 border-[#1A1A1A]/20 focus:border-[#1A1A1A] rounded-none text-sm font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs uppercase tracking-wider font-semibold text-[#1A1A1A]/80">
                    {locale === 'ar' ? 'البريد الإلكتروني (اختياري)' : 'Adresse Email (Optionnel)'}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={locale === 'ar' ? "لتلقي نسخة من تفاصيل الطلب" : "Pour recevoir votre accusé par email"}
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
                  {locale === 'ar' ? '2. عنوان التوصيل (الجزائر 58 ولاية)' : '2. Adresse de Livraison (Algérie)'}
                </h3>
              </div>

              <div className="space-y-4 font-sans text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Wilaya Selection */}
                  <div className="space-y-1.5">
                    <Label htmlFor="wilaya" className="text-xs uppercase tracking-wider font-semibold text-[#1A1A1A]/80">
                      {t.checkout.wilaya} *
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
                      {t.checkout.commune} *
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
                    {t.checkout.address} *
                  </Label>
                  <Input
                    id="address"
                    type="text"
                    required
                    placeholder={locale === 'ar' ? "الحي، الشارع، رقم العمارة، الطابق..." : "Quartier, rue, numéro de bâtiment, étage..."}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="h-12 border-[#1A1A1A]/20 focus:border-[#1A1A1A] rounded-none text-sm"
                  />
                </div>

                {/* Delivery Mode Choice - MUST BE CHOSEN BY USER */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs uppercase tracking-wider font-semibold text-[#1A1A1A]/80 block">
                      {t.checkout.deliveryMethod} *
                    </Label>
                    {!deliveryMethod && (
                      <span className="text-[11px] text-amber-700 font-medium font-sans">
                        {locale === 'ar' ? '← يرجى اختيار أحد الخيارين' : '← Veuillez faire un choix'}
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod("DOMICILE")}
                      className={`p-4 border text-left transition-all rounded-sm relative ${
                        deliveryMethod === "DOMICILE"
                          ? "border-[#1A1A1A] bg-[#1A1A1A] text-white ring-2 ring-[#1A1A1A]/20 shadow-sm"
                          : "border-[#1A1A1A]/20 bg-white text-[#1A1A1A] hover:border-[#1A1A1A]/50"
                      }`}
                    >
                      <span className="font-semibold block text-xs uppercase tracking-wider">
                        {t.checkout.domicile}
                      </span>
                      <span className={`text-[11px] block mt-1 ${deliveryMethod === "DOMICILE" ? "text-white/80" : "text-[#1A1A1A]/60"}`}>
                        {locale === 'ar' ? 'توصيل مباشر إلى باب منزلك' : 'Remise directe à votre adresse'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMethod("STOP_DESK")}
                      className={`p-4 border text-left transition-all rounded-sm relative ${
                        deliveryMethod === "STOP_DESK"
                          ? "border-[#1A1A1A] bg-[#1A1A1A] text-white ring-2 ring-[#1A1A1A]/20 shadow-sm"
                          : "border-[#1A1A1A]/20 bg-white text-[#1A1A1A] hover:border-[#1A1A1A]/50"
                      }`}
                    >
                      <span className="font-semibold block text-xs uppercase tracking-wider">
                        {t.checkout.stopDesk}
                      </span>
                      <span className={`text-[11px] block mt-1 ${deliveryMethod === "STOP_DESK" ? "text-white/80" : "text-[#1A1A1A]/60"}`}>
                        {locale === 'ar' ? 'استلام من مكتب شركة الشحن' : 'Réception en agence express'}
                      </span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Section 3: Payment Guarantee */}
            <div className="p-4 bg-[#F9F9F7] border border-[#1A1A1A]/10 flex items-start gap-3">
              <ShieldCheck size={20} className="text-[#1A1A1A] shrink-0 mt-0.5" />
              <div className="text-xs font-sans space-y-1">
                <span className="font-bold text-[#1A1A1A] block uppercase tracking-wider">
                  {t.trust.paymentOnDelivery} (Cash on Delivery)
                </span>
                <p className="text-[#1A1A1A]/70 leading-relaxed font-light">
                  {t.checkout.paymentNotice}
                </p>
              </div>
            </div>

          </div>

          {/* Right: Order Summary & Confirmation CTA (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-[#1A1A1A]/10 p-6 md:p-8 space-y-6 sticky top-28">
            <h3 className="font-serif text-xl font-bold tracking-tight border-b border-[#1A1A1A]/10 pb-4">
              {t.checkout.orderSummary}
            </h3>

            {/* Items Mini List */}
            <div className="divide-y divide-[#1A1A1A]/5 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.key} className="py-3 flex items-center justify-between gap-3 text-xs font-sans">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-12 w-10 relative bg-[#F2F2EF] shrink-0 border border-[#1A1A1A]/5 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="50px"
                        className="object-cover object-center"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="font-medium text-[#1A1A1A] block truncate">{item.name}</span>
                      <span className="text-[#1A1A1A]/50 text-[10px] block">
                        Qté: {item.quantity} {item.variantName ? `• ${item.variantName}` : ''}
                      </span>
                    </div>
                  </div>
                  <span className="font-semibold text-[#1A1A1A] shrink-0 font-mono">
                    {(item.unitPrice * item.quantity).toLocaleString('fr-FR')} {t.common.currencySymbol}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="border-t border-[#1A1A1A]/10 pt-4 space-y-2 text-xs font-sans">
              <div className="flex justify-between text-[#1A1A1A]/70">
                <span>{t.cart.subtotal}</span>
                <span className="font-medium font-mono">{subtotal.toLocaleString('fr-FR')} {t.common.currencySymbol}</span>
              </div>
              <div className="flex justify-between text-[#1A1A1A]/70">
                <span>{t.cart.shipping}</span>
                <span className="font-medium font-mono">
                  {deliveryMethod ? (
                    `${deliveryFee.toLocaleString('fr-FR')} ${t.common.currencySymbol}`
                  ) : (
                    <span className="text-amber-700 italic font-sans text-[11px]">
                      {locale === 'ar' ? 'يرجى اختيار طريقة التوصيل' : 'Sélectionnez un mode'}
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* Grand Total */}
            <div className="border-t border-[#1A1A1A]/10 pt-4 flex justify-between items-baseline">
              <div>
                <span className="font-serif text-lg font-bold block">{t.cart.total}</span>
                <span className="text-[10px] uppercase tracking-wider text-[#1A1A1A]/50 font-sans block">
                  {t.common.codBadge}
                </span>
              </div>
              <span className="font-sans text-2xl sm:text-3xl font-bold text-[#1A1A1A] font-mono">
                {grandTotal.toLocaleString('fr-FR')} {t.common.currencySymbol}
              </span>
            </div>

            {/* Confirmation CTA */}
            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="w-full h-14 bg-[#1A1A1A] text-white hover:bg-[#1A1A1A]/90 text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-2 shadow-lg font-bold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>{t.common.loading}</span>
                </>
              ) : (
                <span>{t.checkout.placeOrder}</span>
              )}
            </Button>

            {/* Reassurance */}
            <div className="space-y-2 pt-2 border-t border-[#1A1A1A]/5 text-[11px] font-sans text-[#1A1A1A]/60">
              <div className="flex items-center gap-2">
                <Truck size={14} className="text-[#1A1A1A]" />
                <span>{t.trust.wilayasShippingSub}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-[#1A1A1A]" />
                <span>{t.trust.paymentOnDeliverySub}</span>
              </div>
            </div>

          </div>

        </form>

      </Container>
    </div>
  )
}
