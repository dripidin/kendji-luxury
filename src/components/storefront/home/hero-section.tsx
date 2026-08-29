'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Container } from "@/components/storefront/layout/container"
import { Button } from "@/components/ui/button"
import { Product, BACKGROUND_ASSETS } from "@/lib/catalog"
import { HeroSectionContent } from "@/lib/cms"
import { StorefrontProduct } from "@/lib/storefront-catalog"
import { useI18n } from "@/lib/i18n/context"

interface HeroSectionProps {
  content?: HeroSectionContent
  heroProduct?: Product | StorefrontProduct | null
  heroProducts?: (Product | StorefrontProduct)[]
}

export function HeroSection({ content, heroProduct, heroProducts: initialHeroProducts }: HeroSectionProps) {
  const { t } = useI18n()
  
  // Combine heroProducts list or single heroProduct
  const productsList = (initialHeroProducts && initialHeroProducts.length > 0)
    ? initialHeroProducts
    : heroProduct
    ? [heroProduct]
    : []

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Auto-swipe every 3.5 seconds
  useEffect(() => {
    if (productsList.length <= 1 || isHovered) return

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % productsList.length)
    }, 3500)

    return () => clearInterval(interval)
  }, [productsList.length, isHovered])

  const currentProduct = productsList[currentIndex] || productsList[0]

  const bgPath = content?.background_media || BACKGROUND_ASSETS['KJ-BG-02'].path
  const headline = content?.headline || t.hero.headline
  const subheadline = content?.subheadline || t.hero.subheadline
  const primaryCtaLabel = content?.primary_cta_label || t.hero.ctaPrimary
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

      <Container className="relative z-10 py-24 sm:py-32 md:py-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-8 items-end">
          
          {/* Main Hero Text Narrative */}
          <div className="lg:col-span-8 text-white space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-3">
              <span className="h-px w-6 sm:w-8 bg-white/60" />
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-white/80 font-sans">
                {t.hero.badge}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-white leading-[1.08] sm:leading-[1.05]">
              {headline}
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-white/80 max-w-xl font-sans font-light leading-relaxed tracking-wide">
              {subheadline}
            </p>

            <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <Link href={primaryCtaUrl} className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto px-8 sm:px-10 py-5 sm:py-6 text-xs uppercase tracking-[0.25em] bg-white text-[#1A1A1A] hover:bg-[#F9F9F7] active:scale-[0.99] transition-all duration-300 font-bold"
                >
                  {primaryCtaLabel}
                </Button>
              </Link>
              <Link href="/collections" className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-xs uppercase tracking-[0.25em] border-white/30 text-white hover:bg-white/10 hover:border-white transition-all duration-300"
                >
                  {t.hero.ctaSecondary}
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Accent Floating Card with 3.5s Auto-Swipe */}
          {currentProduct && (
            <div 
              className="lg:col-span-4 lg:justify-self-end w-full max-w-xs sm:max-w-sm mx-auto lg:mx-0"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Link 
                href={`/product/${currentProduct.slug}`}
                className="group block p-3.5 sm:p-4 bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-500 rounded-sm shadow-xl overflow-hidden relative"
              >
                {/* Image Container with key for smooth fade on swipe */}
                <div className="aspect-square relative overflow-hidden bg-white/5 mb-3 rounded-xs">
                  <Image
                    key={currentProduct.id + currentProduct.coverImage}
                    src={currentProduct.coverImage}
                    alt={currentProduct.name}
                    fill
                    sizes="(max-width: 640px) 280px, 320px"
                    className="object-cover object-center group-hover:scale-105 transition-all duration-700 animate-in fade-in"
                  />
                  {/* Subtle Top Right Counter Badge */}
                  {productsList.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-[9px] uppercase tracking-widest text-white/90 px-2 py-0.5 rounded-full font-mono">
                      0{currentIndex + 1} / 0{productsList.length}
                    </div>
                  )}
                </div>

                <div className="space-y-1 text-white">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-white/60 font-sans">
                      {t.hero.signatureSelection}
                    </p>
                    {/* Auto-swipe indicator dots */}
                    {productsList.length > 1 && (
                      <div className="flex items-center gap-1.5" onClick={e => e.preventDefault()}>
                        {productsList.map((_, dotIdx) => (
                          <button
                            key={dotIdx}
                            type="button"
                            onClick={e => {
                              e.preventDefault()
                              setCurrentIndex(dotIdx)
                            }}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              dotIdx === currentIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/60'
                            }`}
                            aria-label={`Slide ${dotIdx + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <h4 className="font-serif text-sm sm:text-base line-clamp-1 group-hover:text-white/80 transition-colors font-medium">
                    {currentProduct.name}
                  </h4>
                  <p className="text-xs sm:text-sm font-sans tracking-widest text-white/90 font-semibold">
                    {Number(currentProduct.price).toLocaleString('fr-FR')} {t.common.currencySymbol}
                  </p>
                </div>
              </Link>
            </div>
          )}

        </div>
      </Container>
    </section>
  )
}
