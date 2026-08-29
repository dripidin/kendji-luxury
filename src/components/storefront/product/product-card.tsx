'use client'

import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Product } from "@/lib/catalog"
import { useI18n } from "@/lib/i18n/context"

interface ProductCardProps {
  product: Product | {
    id: string
    slug: string
    name: string
    price: number
    image?: string
    coverImage?: string
    category?: string
    collection?: string
  }
  className?: string
  priority?: boolean
}

export function ProductCard({ product, className, priority = false }: ProductCardProps) {
  const { t } = useI18n()

  const imageSrc = ('coverImage' in product && product.coverImage) 
    ? product.coverImage 
    : ('image' in product && product.image) 
      ? product.image 
      : null

  // Format price in Algerian Dinar
  const formattedPrice = `${product.price.toLocaleString('fr-FR')} ${t.common.currencySymbol}`

  return (
    <Link 
      href={`/product/${product.slug}`}
      className={cn("group block text-left", className)}
    >
      {/* Image Frame */}
      <div className="aspect-[4/5] relative bg-[#F2F2EF] overflow-hidden border border-[#1A1A1A]/5 transition-colors group-hover:border-[#1A1A1A]/20">
        {imageSrc ? (
          <Image 
            src={imageSrc}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            priority={priority}
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-charcoal/20 uppercase tracking-widest text-xs font-sans">
            {t.common.brandName}
          </div>
        )}
        
        {/* Subtle Luxury Corner Tag / Accent */}
        <div className="absolute bottom-3 left-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="bg-[#1A1A1A]/90 text-white text-[10px] uppercase tracking-widest px-2.5 py-1 backdrop-blur-sm">
            {t.catalog.viewDetails}
          </span>
        </div>
      </div>
      
      {/* Product Details */}
      <div className="mt-4 flex flex-col gap-1">
        {product.category && (
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/60 font-sans">
            {product.category}
          </span>
        )}
        <h3 className="font-serif text-base md:text-lg tracking-tight text-[#1A1A1A] line-clamp-1 group-hover:text-[#1A1A1A]/80 transition-colors">
          {product.name}
        </h3>
        <p className="text-sm font-sans font-medium text-[#1A1A1A] tracking-wider mt-0.5">
          {formattedPrice}
        </p>
      </div>
    </Link>
  )
}
