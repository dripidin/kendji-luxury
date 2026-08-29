import { notFound } from "next/navigation"
import { Metadata } from "next"
import { getAllProducts } from "@/lib/catalog"
import { fetchStorefrontProductBySlug } from "@/lib/storefront-catalog"
import { ProductHero } from "@/components/storefront/product/product-hero"
import { CategoryEmphasis } from "@/components/storefront/product/category-emphasis"
import { ProductStory } from "@/components/storefront/product/product-story"
import { ProductDetails } from "@/components/storefront/product/product-details"
import { RelatedProducts } from "@/components/storefront/product/related-products"
import { ProductFinalCTA } from "@/components/storefront/product/product-final-cta"
import { StickyPurchaseBar } from "@/components/storefront/product/sticky-purchase-bar"

export const dynamic = "force-dynamic"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const products = getAllProducts()
  return products.map((product) => ({
    slug: product.slug,
  }))
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await fetchStorefrontProductBySlug(slug)

  if (!product) {
    return {
      title: "Product Not Found • KenDji Luxury",
      description: "The requested creation could not be found."
    }
  }

  return {
    title: `${product.name} • KenDji Luxury`,
    description: `${product.description} Prix: ${product.price.toLocaleString('fr-FR')} DA. Paiement à la livraison partout en Algérie.`,
    openGraph: {
      title: `${product.name} • KenDji Luxury`,
      description: product.description,
      images: product.coverImage ? [{ url: product.coverImage }] : [],
    }
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await fetchStorefrontProductBySlug(slug)

  if (!product) {
    notFound()
  }

  // Schema.org Structured Data for Google Rich Results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": product.description,
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": "KenDji Luxury"
    },
    "category": product.category,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "DZD",
      "price": product.price,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock",
      "priceValidUntil": "2027-12-31",
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow"
      }
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="flex flex-col w-full">
        {/* 1. Hero Stage: Media Gallery + Purchase Panel */}
        <ProductHero product={product} />

        {/* 2. Category-Specific Design Insight */}
        <CategoryEmphasis product={product} />

        {/* 3. Product Story & Atelier Insight */}
        <ProductStory product={product} />

        {/* 4. Verified Structured Specifications */}
        <ProductDetails product={product} />

        {/* 5. Complete the Look / Related Creations */}
        <RelatedProducts currentProduct={product} />

        {/* 6. Closing Brand Statement */}
        <ProductFinalCTA product={product} />

        {/* 7. Subtle Sticky Action Bar */}
        <StickyPurchaseBar product={product} />
      </article>
    </>
  )
}
