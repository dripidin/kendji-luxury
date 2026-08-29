"use client"

import Image from "next/image"
import Link from "next/link"
import { Product, BACKGROUND_ASSETS } from "@/lib/catalog"
import { Container } from "@/components/storefront/layout/container"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n/context"

interface ProductFinalCTAProps {
  product: Product
}

export function ProductFinalCTA({ product }: ProductFinalCTAProps) {
  const bg = BACKGROUND_ASSETS['KJ-BG-05']
  const { t, dir } = useI18n()

  const scrollToHero = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <section className="relative py-28 md:py-36 bg-[#1A1A1A] text-white overflow-hidden border-t border-white/10" dir={dir}>
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bg.path}
          alt={bg.name}
          fill
          sizes="100vw"
          className="object-cover object-center opacity-40 scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/90 via-[#1A1A1A]/50 to-[#1A1A1A]/90" />
      </div>

      <Container className="relative z-10 text-center max-w-2xl mx-auto space-y-6">
        <span className="text-[11px] uppercase tracking-[0.35em] text-white/70 font-sans block">
          {t.productFinalCta?.badge || 'متجر دار كندجي'} • {product.collection}
        </span>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
          {t.productFinalCta?.titleLine1 || 'تألقي بأنوثة'} <br />
          <span className="font-normal italic">{t.productFinalCta?.titleLine2 || 'وجاذبية خالدة.'}</span>
        </h2>

        <p className="text-sm text-white/80 font-sans font-light max-w-lg mx-auto leading-relaxed">
          {t.productFinalCta?.desc || `اطلبي ${product.name} اليوم وتصلي بعلبة مخملية فاخرة مع ميزة الدفع عند الاستلام في الجزائر.`}
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            className="w-full sm:w-auto px-10 py-6 text-xs uppercase tracking-[0.25em] bg-white text-[#1A1A1A] hover:bg-[#F9F9F7] transition-all duration-300 shadow-xl font-bold"
            onClick={scrollToHero}
          >
            {t.productFinalCta?.orderNow || 'اطلبي الآن'}
          </Button>

          <Link href={`/collections/${product.collectionSlug}`}>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto px-8 py-6 text-xs uppercase tracking-[0.25em] border-white/30 text-white hover:bg-white/10 hover:border-white transition-all duration-300"
            >
              {t.productFinalCta?.viewCollection || 'عرض المجموعة'}
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  )
}
