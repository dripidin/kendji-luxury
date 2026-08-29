import Image from "next/image"
import Link from "next/link"
import { Container } from "@/components/storefront/layout/container"
import { Button } from "@/components/ui/button"
import { getHeroProduct, getProductBySlug, BACKGROUND_ASSETS } from "@/lib/catalog"
import { HeroSectionContent } from "@/lib/cms"

interface HeroSectionProps {
  content?: HeroSectionContent
}

export function HeroSection({ content }: HeroSectionProps) {
  const defaultProduct = getHeroProduct()
  const heroProduct = (content?.featured_product_slug ? getProductBySlug(content.featured_product_slug) : null) || defaultProduct
  const bgPath = content?.background_media || BACKGROUND_ASSETS['KJ-BG-02'].path

  const headline = content?.headline || "The Architecture of Intimacy."
  const subheadline = content?.subheadline || "Modern monochrome luxury designed with architectural precision. Elevating curated statement jewelry into timeless personal emblems."
  const primaryCtaLabel = content?.primary_cta_label || "Discover the Collection"
  const primaryCtaUrl = content?.primary_cta_url || "/shop"

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#1A1A1A]">
      {/* Atmosphere Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bgPath}
          alt="KenDji Atmosphere"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-85 scale-[1.02] transform transition-transform duration-1000"
        />
        {/* Subtle Luxury Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/90 via-[#1A1A1A]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/70 via-transparent to-[#1A1A1A]/40" />
      </div>

      <Container className="relative z-10 py-32 md:py-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-end">
          
          {/* Main Hero Text Narrative */}
          <div className="lg:col-span-8 text-white space-y-6">
            <div className="inline-flex items-center gap-3">
              <span className="h-px w-8 bg-white/60" />
              <span className="text-xs uppercase tracking-[0.3em] text-white/80 font-sans">
                KenDji Luxury &bull; High Jewelry
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[1.05]">
              {headline}
            </h1>

            <p className="text-sm md:text-base text-white/80 max-w-xl font-sans font-light leading-relaxed tracking-wide">
              {subheadline}
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link href={primaryCtaUrl}>
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto px-10 py-6 text-xs uppercase tracking-[0.25em] bg-white text-[#1A1A1A] hover:bg-[#F9F9F7] transition-all duration-300"
                >
                  {primaryCtaLabel}
                </Button>
              </Link>
              <Link href="/collections">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto px-8 py-6 text-xs uppercase tracking-[0.25em] border-white/30 text-white hover:bg-white/10 hover:border-white transition-all duration-300"
                >
                  Explore Worlds
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Accent Floating Card */}
          <div className="lg:col-span-4 lg:justify-self-end">
            <Link 
              href={`/product/${heroProduct.slug}`}
              className="group block p-4 bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-500 max-w-xs"
            >
              <div className="aspect-square relative overflow-hidden bg-white/5 mb-3">
                <Image
                  src={heroProduct.coverImage}
                  alt={heroProduct.name}
                  fill
                  sizes="300px"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="space-y-1 text-white">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">Signature Selection</p>
                <h4 className="font-serif text-sm line-clamp-1 group-hover:text-white/80 transition-colors">
                  {heroProduct.name}
                </h4>
                <p className="text-xs font-sans tracking-widest text-white/90">
                  {heroProduct.price.toLocaleString('fr-FR')} DA
                </p>
              </div>
            </Link>
          </div>

        </div>
      </Container>
    </section>
  )
}
