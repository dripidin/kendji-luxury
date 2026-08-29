'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Container } from '@/components/storefront/layout/container'
import { Button } from '@/components/ui/button'
import { StorefrontCollection } from '@/lib/storefront-catalog'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

interface CollectionsViewProps {
  collections: StorefrontCollection[]
}

export function CollectionsView({ collections }: CollectionsViewProps) {
  const { t, locale, dir } = useI18n()

  return (
    <div className="bg-[#FAF9F6] min-h-screen" dir={dir}>
      {/* Editorial Header */}
      <section className="border-b border-[#1A1A1A]/10 bg-white py-16 md:py-24">
        <Container>
          <div className="max-w-3xl space-y-4">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#1A1A1A]/60 font-sans flex items-center gap-2">
              <Sparkles className="h-3 w-3 text-amber-600" />
              {t.home.worldsBadge}
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#1A1A1A]">
              {t.nav.collections}
            </h1>
            <p className="text-base sm:text-lg text-[#1A1A1A]/70 font-sans leading-relaxed font-light">
              {t.home.worldsSubtitle}
            </p>
          </div>
        </Container>
      </section>

      {/* Collections Grid */}
      <section className="py-16 md:py-20">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {collections.map((col, idx) => (
              <div
                key={col.slug}
                className="group bg-white border border-[#1A1A1A]/10 rounded-sm overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-500"
              >
                {/* Visual Showcase */}
                <div className="aspect-[16/10] relative overflow-hidden bg-[#F2F2EF]">
                  <Image
                    src={col.coverImage}
                    alt={col.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={idx < 2}
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  
                  {/* Badge */}
                  <div className={`absolute top-4 ${dir === 'rtl' ? 'right-4' : 'left-4'}`}>
                    <span className="bg-[#1A1A1A]/90 backdrop-blur-sm text-white text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-none font-medium">
                      {col.productCount} {t.catalog.resultsCount}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 md:p-10 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#1A1A1A]/50 font-sans block">
                      {col.tagline}
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A]">
                      {col.name}
                    </h2>
                    <p className="text-sm text-[#1A1A1A]/70 font-sans leading-relaxed line-clamp-3 font-light">
                      {col.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#1A1A1A]/5">
                    <Link href={`/collections/${col.slug}`}>
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto border-[#1A1A1A]/20 text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white px-8 py-5 text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group/btn font-medium"
                      >
                        <span>{locale === 'ar' ? 'استكشف التشكيلة' : 'Découvrir l’univers'}</span>
                        <ArrowRight className={`h-3.5 w-3.5 transition-transform ${dir === 'rtl' ? 'rotate-180 group-hover/btn:-translate-x-1' : 'group-hover/btn:translate-x-1'}`} />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  )
}
