import Link from "next/link"
import { Product, getRelatedProducts } from "@/lib/catalog"
import { Container } from "@/components/storefront/layout/container"
import { ProductCard } from "@/components/storefront/product/product-card"
import { Button } from "@/components/ui/button"

interface RelatedProductsProps {
  currentProduct: Product
}

export function RelatedProducts({ currentProduct }: RelatedProductsProps) {
  const related = getRelatedProducts(currentProduct, 4)

  if (related.length === 0) return null

  return (
    <section className="py-24 bg-[#F9F9F7] text-[#1A1A1A] border-t border-[#1A1A1A]/10">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#1A1A1A]/60 font-sans block mb-2">
              Curated Harmonies
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
              Complete the Look
            </h2>
          </div>

          <Link href={`/collections/${currentProduct.collectionSlug}`}>
            <Button
              variant="outline"
              className="border-[#1A1A1A]/20 text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white px-6 py-4 text-xs uppercase tracking-[0.2em] transition-all duration-300"
            >
              Explore {currentProduct.collection}
            </Button>
          </Link>
        </div>

        {/* 4-Grid of Related Pieces */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {related.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </Container>
    </section>
  )
}
