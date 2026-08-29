'use client'

import Image from "next/image"
import Link from "next/link"
import { Container } from "@/components/storefront/layout/container"
import { Button } from "@/components/ui/button"
import { BACKGROUND_ASSETS } from "@/lib/catalog"
import { FinalCtaSectionContent } from "@/lib/cms"
import { useI18n } from "@/lib/i18n/context"

interface FinalCTAProps {
  content?: FinalCtaSectionContent
}

export function FinalCTA({ content }: FinalCTAProps) {
  const { t } = useI18n()
  const bgPath = content?.background_media || BACKGROUND_ASSETS['KJ-BG-05'].path
  const title = content?.title || t.home.ctaTitle
  const description = content?.description || t.home.ctaSubtitle
  const ctaLabel = content?.cta_label || t.home.ctaButton
  const ctaUrl = content?.cta_url || "/shop"

  return (
    <section className="relative py-32 md:py-44 bg-[#1A1A1A] text-white overflow-hidden border-t border-white/10">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bgPath}
          alt="KenDji Boutique Atmosphere"
          fill
          sizes="100vw"
          className="object-cover object-center opacity-45 scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/80 via-[#1A1A1A]/50 to-[#1A1A1A]" />
      </div>

      <Container className="relative z-10 text-center max-w-2xl mx-auto space-y-8">
        <span className="text-[11px] uppercase tracking-[0.35em] text-white/70 font-sans block">
          {t.common.brandName}
        </span>

        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
          {title}
        </h2>

        <p className="text-sm md:text-base text-white/80 font-sans font-light max-w-lg mx-auto leading-relaxed">
          {description}
        </p>

        <div className="pt-4">
          <Link href={ctaUrl}>
            <Button 
              size="lg" 
              className="px-12 py-7 text-xs uppercase tracking-[0.25em] bg-white text-[#1A1A1A] hover:bg-[#F9F9F7] transition-all duration-300 shadow-xl font-bold"
            >
              {ctaLabel}
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  )
}
