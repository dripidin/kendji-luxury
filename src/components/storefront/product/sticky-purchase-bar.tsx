"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Product } from "@/lib/catalog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface StickyPurchaseBarProps {
  product: Product
}

export function StickyPurchaseBar({ product }: ProductStickyProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down past ~550px
      if (window.scrollY > 550) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const formattedPrice = `${product.price.toLocaleString('fr-FR')} DA`

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#1A1A1A]/10 py-3.5 px-4 md:px-12 transition-transform duration-300 shadow-lg",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Thumbnail & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-12 w-10 relative bg-[#F2F2EF] border border-[#1A1A1A]/10 shrink-0 overflow-hidden hidden sm:block">
            <Image
              src={product.coverImage}
              alt={product.name}
              fill
              sizes="50px"
              className="object-cover object-center"
            />
          </div>
          <div className="min-w-0">
            <h4 className="font-serif text-sm font-bold text-[#1A1A1A] truncate max-w-[200px] sm:max-w-xs md:max-w-md">
              {product.name}
            </h4>
            <span className="font-sans text-xs font-semibold text-[#1A1A1A] tracking-wider block">
              {formattedPrice} • <span className="text-[#1A1A1A]/60 font-normal">Paiement à la livraison</span>
            </span>
          </div>
        </div>

        {/* Right: Quick Order CTA */}
        <div>
          <Button
            size="sm"
            className="bg-[#1A1A1A] text-white hover:bg-[#1A1A1A]/90 px-6 py-5 text-[11px] uppercase tracking-[0.2em] shadow-md whitespace-nowrap"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            Commander Maintenant
          </Button>
        </div>

      </div>
    </div>
  )
}

type ProductStickyProps = StickyPurchaseBarProps
