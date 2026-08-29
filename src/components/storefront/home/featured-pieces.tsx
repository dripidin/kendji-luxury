'use client'

import Link from "next/link"
import { Container, Section } from "@/components/storefront/layout/container"
import { ProductCard } from "@/components/storefront/product/product-card"
import { Button } from "@/components/ui/button"
import { Product, getFeaturedProducts, getProductBySlug } from "@/lib/catalog"
import { useI18n } from "@/lib/i18n/context"

interface FeaturedPiecesProps {
  products?: Product[]
  productSlugs?: string[]
}

export function FeaturedPieces({ products: initialProducts, productSlugs }: FeaturedPiecesProps) {
  const { t } = useI18n()

  let products = (initialProducts && initialProducts.length > 0)
    ? initialProducts
    : (productSlugs && productSlugs.length > 0)
    ? productSlugs.map(slug => getProductBySlug(slug)).filter(Boolean) as Product[]
    : getFeaturedProducts().slice(0, 4)

  if (products.length === 0) {
    products = getFeaturedProducts().slice(0, 4)
  }

  return (
    <Section className="bg-[#FFFFFF] text-[#1A1A1A] border-y border-[#1A1A1A]/5">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#1A1A1A]/60 font-sans block mb-2">
              {t.home.featuredBadge}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              {t.home.featuredTitle}
            </h2>
            <p className="text-sm text-[#1A1A1A]/60 mt-1 font-light">
              {t.home.featuredSubtitle}
            </p>
          </div>
          
          <Link href="/shop" className="hidden sm:inline-block">
            <Button 
              variant="outline" 
              className="border-[#1A1A1A]/20 text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white px-8 py-5 text-xs uppercase tracking-[0.2em] transition-all duration-300 font-medium"
            >
              {t.common.viewAll}
            </Button>
          </Link>
        </div>

        {/* 4-Column Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 lg:gap-8">
          {products.map((product, idx) => (
            <ProductCard 
              key={product!.id} 
              product={product!} 
              priority={idx < 2}
            />
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-12 text-center sm:hidden">
          <Link href="/shop">
            <Button 
              variant="outline" 
              className="w-full border-[#1A1A1A]/20 text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white py-6 text-xs uppercase tracking-[0.2em]"
            >
              {t.common.viewAll}
            </Button>
          </Link>
        </div>
      </Container>
    </Section>
  )
}
