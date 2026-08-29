import { HeroSection } from "@/components/storefront/home/hero-section"
import { CollectionIntro } from "@/components/storefront/home/collection-intro"
import { FeaturedPieces } from "@/components/storefront/home/featured-pieces"
import { BrandStory } from "@/components/storefront/home/brand-story"
import { CollectionWorlds } from "@/components/storefront/home/collection-worlds"
import { EditorialMoment } from "@/components/storefront/home/editorial-moment"
import { TrustSection } from "@/components/storefront/home/trust-section"
import { FinalCTA } from "@/components/storefront/home/final-cta"
import { getHomepageContent } from "@/lib/cms"
import { fetchFeaturedStorefrontProducts, fetchHeroStorefrontProduct } from "@/lib/storefront-catalog"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "KenDji Luxury • High Jewelry & Timeless Emblems",
  description: "Discover KenDji Luxury — Modern Monochrome High Jewelry designed with architectural precision. Premium parures, signature motifs, and delicate necklaces in Algeria."
}

export default async function HomePage() {
  const content = await getHomepageContent()

  // 1. Resolve Hero Product dynamically from CMS configuration or top published product
  const heroProductSlug = content.hero?.featured_product_slug
  const heroProduct = await fetchHeroStorefrontProduct(heroProductSlug)

  // 2. Resolve Featured Products dynamically from authoritative database (is_featured = true & status = 'PUBLISHED')
  const allFeatured = await fetchFeaturedStorefrontProducts(8)

  // Deduplication: If the hero product is also featured, exclude it from FeaturedPieces when other items exist
  const featuredProducts = (allFeatured.length > 1 && heroProduct)
    ? allFeatured.filter(p => p.slug !== heroProduct.slug && p.id !== heroProduct.id)
    : allFeatured

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero / Brand Entry */}
      <HeroSection content={content.hero} heroProduct={heroProduct} />

      {/* 2. Curated Collection Introduction */}
      <CollectionIntro />

      {/* 3. Featured Selection / Signature Pieces */}
      <FeaturedPieces products={featuredProducts} />

      {/* 4. Brand & Craftsmanship Story */}
      <BrandStory />

      {/* 5. Collection Worlds Spotlight */}
      <CollectionWorlds />

      {/* 6. Editorial Lifestyle Moment */}
      <EditorialMoment />

      {/* 7. Trust & Shopping Reassurance */}
      <TrustSection />

      {/* 8. Final Conversion CTA */}
      <FinalCTA content={content.final_cta} />
    </div>
  )
}
