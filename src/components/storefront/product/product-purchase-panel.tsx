"use client"

import { useState } from "react"
import Link from "next/link"
import { Product, ProductVariant } from "@/lib/catalog"
import { useCart } from "@/lib/cart/cart-context"
import { useI18n } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Package, Truck, Check, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductPurchasePanelProps {
  product: Product
  onVariantChange?: (variant: ProductVariant) => void
}

export function ProductPurchasePanel({ product, onVariantChange }: ProductPurchasePanelProps) {
  const { addItem } = useCart()
  const { t, locale, dir } = useI18n()
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  )
  const [quantity, setQuantity] = useState(1)

  const handleVariantSelect = (v: ProductVariant) => {
    setSelectedVariant(v)
    if (onVariantChange) {
      onVariantChange(v)
    }
  }

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id,
      name: product.name,
      variantName: selectedVariant?.name,
      image: selectedVariant?.image || product.coverImage,
      unitPrice: product.price,
      quantity: quantity,
      slug: product.slug
    })
  }

  const formattedPrice = `${product.price.toLocaleString('fr-FR')} ${t.common.currencySymbol}`

  return (
    <div className="space-y-8 text-[#1A1A1A]" dir={dir}>
      {/* Category & Collection Path */}
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-[#1A1A1A]/60 font-sans">
        <Link href={`/category/${product.categorySlug}`} className="hover:text-[#1A1A1A] transition-colors">
          {product.category}
        </Link>
        <span>/</span>
        <Link href={`/collections/${product.collectionSlug}`} className="hover:text-[#1A1A1A] transition-colors">
          {product.collection}
        </Link>
      </div>

      {/* Product Title & Price */}
      <div className="space-y-3 border-b border-[#1A1A1A]/10 pb-6">
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1A1A1A] leading-tight">
          {product.name}
        </h1>
        
        <div className="flex items-baseline gap-4 pt-1">
          <span className="font-sans text-2xl sm:text-3xl font-medium tracking-wide text-[#1A1A1A]">
            {formattedPrice}
          </span>
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A]/60 bg-[#F2F2EF] px-2.5 py-1 border border-[#1A1A1A]/10">
            {t.common.codBadge}
          </span>
        </div>
      </div>

      {/* Brief Story / Description */}
      <p className="text-sm text-[#1A1A1A]/80 font-sans font-light leading-relaxed">
        {product.description}
      </p>

      {/* Variant Selector (if product has variants) */}
      {product.variants && product.variants.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center text-xs uppercase tracking-wider font-sans">
            <span className="text-[#1A1A1A]/60">{t.product.selectVariant}:</span>
            <span className="font-semibold text-[#1A1A1A]">{selectedVariant?.name}</span>
          </div>

          <div className="flex flex-wrap gap-3">
            {product.variants.map((v) => {
              const isSelected = selectedVariant?.id === v.id
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => handleVariantSelect(v)}
                  className={cn(
                    "px-4 py-2.5 text-xs uppercase tracking-widest font-sans border transition-all duration-200 flex items-center gap-2",
                    isSelected
                      ? "border-[#1A1A1A] bg-[#1A1A1A] text-white shadow-sm"
                      : "border-[#1A1A1A]/20 bg-white text-[#1A1A1A] hover:border-[#1A1A1A]/60"
                  )}
                >
                  {v.colorHex && (
                    <span 
                      className="h-3 w-3 rounded-full border border-black/20 shrink-0 inline-block"
                      style={{ backgroundColor: v.colorHex }}
                    />
                  )}
                  <span>{v.name}</span>
                  {isSelected && <Check size={12} className="ml-1" />}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Quantity & Primary Action CTA */}
      <div className="space-y-4 pt-4 border-t border-[#1A1A1A]/10">
        <div className="flex items-center gap-4">
          {/* Quantity Controls */}
          <div className="flex items-center border border-[#1A1A1A]/20 bg-white h-14">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              aria-label="Decrease quantity"
              className="px-4 text-lg text-[#1A1A1A] hover:bg-[#F9F9F7] transition-colors"
            >
              -
            </button>
            <span className="px-4 text-sm font-sans font-medium text-[#1A1A1A] min-w-[2.5rem] text-center">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              aria-label="Increase quantity"
              className="px-4 text-lg text-[#1A1A1A] hover:bg-[#F9F9F7] transition-colors"
            >
              +
            </button>
          </div>

          {/* Primary Purchase CTA */}
          <div className="flex-1">
            <Button
              size="lg"
              className="w-full h-14 bg-[#1A1A1A] text-white hover:bg-[#1A1A1A]/90 text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-3 transition-all duration-300 shadow-md font-bold"
              onClick={handleAddToCart}
            >
              <ShoppingBag size={18} />
              <span>{t.common.orderNow}</span>
            </Button>
          </div>
        </div>

        <p className="text-[11px] text-[#1A1A1A]/60 font-sans text-center tracking-wide">
          {locale === 'ar' 
            ? 'تأكيد فوري عبر الهاتف • لا يتطلب أي دفع بالبطاقة البنكية' 
            : 'Confirmation immédiate par téléphone • Aucun prépaiement par carte requis'}
        </p>
      </div>

      {/* Shopping Reassurance Accordion / Pillars */}
      <div className="grid grid-cols-1 gap-3 pt-4 border-t border-[#1A1A1A]/10 text-xs font-sans">
        <div className="flex items-start gap-3 p-3 bg-white border border-[#1A1A1A]/5">
          <Truck size={18} className="text-[#1A1A1A] shrink-0 mt-0.5" strokeWidth={1.5} />
          <div>
            <span className="font-semibold block text-[#1A1A1A] uppercase tracking-wider text-[10px]">
              {t.trust.wilayasShipping}
            </span>
            <span className="text-[#1A1A1A]/70 text-[11px]">
              {t.trust.wilayasShippingSub}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-white border border-[#1A1A1A]/5">
          <ShieldCheck size={18} className="text-[#1A1A1A] shrink-0 mt-0.5" strokeWidth={1.5} />
          <div>
            <span className="font-semibold block text-[#1A1A1A] uppercase tracking-wider text-[10px]">
              {t.trust.paymentOnDelivery}
            </span>
            <span className="text-[#1A1A1A]/70 text-[11px]">
              {t.trust.paymentOnDeliverySub}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-white border border-[#1A1A1A]/5">
          <Package size={18} className="text-[#1A1A1A] shrink-0 mt-0.5" strokeWidth={1.5} />
          <div>
            <span className="font-semibold block text-[#1A1A1A] uppercase tracking-wider text-[10px]">
              {t.trust.velvetPackaging}
            </span>
            <span className="text-[#1A1A1A]/70 text-[11px]">
              {t.trust.velvetPackagingSub}
            </span>
          </div>
        </div>
      </div>

    </div>
  )
}
