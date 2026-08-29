import { HeroSection } from "@/components/storefront/home/hero-section"
import { CollectionIntro } from "@/components/storefront/home/collection-intro"
import { FeaturedPieces } from "@/components/storefront/home/featured-pieces"
import { BrandStory } from "@/components/storefront/home/brand-story"
import { CollectionWorlds } from "@/components/storefront/home/collection-worlds"
import { EditorialMoment } from "@/components/storefront/home/editorial-moment"
import { TrustSection } from "@/components/storefront/home/trust-section"
import { FinalCTA } from "@/components/storefront/home/final-cta"
import { getHomepageContent } from "@/lib/cms"
import { fetchFeaturedStorefrontProducts, fetchStorefrontProductBySlug } from "@/lib/storefront-catalog"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "KenDji Luxury • High Jewelry & Timeless Emblems",
  description: "Discover KenDji Luxury — Modern Monochrome High Jewelry designed with architectural precision. Premium parures, signature motifs, and delicate necklaces in Algeria."
}

export default async function HomePage() {
  const content = await getHomepageContent()

  // Fetch featured products dynamically from Supabase
  let featuredProducts: any[] = []
  if (content.featured_products?.product_slugs && content.featured_products.product_slugs.length > 0) {
    const fetched = await Promise.all(
      content.featured_products.product_slugs.map(slug => fetchStorefrontProductBySlug(slug))
    )
    featuredProducts = fetched.filter(Boolean)
  }

  if (featuredProducts.length === 0) {
    featuredProducts = await fetchFeaturedStorefrontProducts(8)
  }

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero / Brand Entry */}
      <HeroSection content={content.hero} />

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
