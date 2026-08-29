"use client"

import { useState } from "react"
import { Product, ProductVariant } from "@/lib/catalog"
import { ProductGallery } from "./product-gallery"
import { ProductPurchasePanel } from "./product-purchase-panel"
import { Container } from "@/components/storefront/layout/container"

interface ProductHeroProps {
  product: Product
}

export function ProductHero({ product }: ProductHeroProps) {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(product.coverImage)

  const handleVariantChange = (variant: ProductVariant) => {
    if (variant.image) {
      setSelectedImage(variant.image)
    }
  }

  const handleGallerySelect = (img: string) => {
    setSelectedImage(img)
  }

  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-24 bg-[#F9F9F7]">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left: Interactive Media Gallery (7 cols) */}
          <div className="lg:col-span-7">
            <ProductGallery
              images={product.images}
              productName={product.name}
              selectedImage={selectedImage}
              onSelectImage={handleGallerySelect}
            />
          </div>

          {/* Right: Purchase & Variant Panel (5 cols) */}
          <div className="lg:col-span-5 sticky top-28">
            <ProductPurchasePanel
              product={product}
              onVariantChange={handleVariantChange}
            />
          </div>

        </div>
      </Container>
    </section>
  )
}
