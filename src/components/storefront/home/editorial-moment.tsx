'use client'

import Image from "next/image"
import { Container } from "@/components/storefront/layout/container"
import { BACKGROUND_ASSETS } from "@/lib/catalog"
import { useI18n } from "@/lib/i18n/context"

export function EditorialMoment() {
  const bg = BACKGROUND_ASSETS['KJ-BG-04']
  const { t, dir } = useI18n()

  return (
    <section className="relative py-28 md:py-36 bg-[#1A1A1A] text-white overflow-hidden" dir={dir}>
      {/* Background with Dark Subtle Gradient */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bg.path}
          alt={bg.name}
          fill
          sizes="100vw"
          className="object-cover object-center opacity-40 scale-100"
        />
        <div className="absolute inset-0 bg-[#1A1A1A]/60 backdrop-blur-[2px]" />
      </div>

      <Container className="relative z-10 text-center max-w-3xl mx-auto space-y-6">
        <span className="text-xs uppercase tracking-[0.35em] text-white/70 font-sans block">
          {t.editorial?.badge || 'بيان الدار'}
        </span>
        <blockquote className="font-serif text-2xl sm:text-4xl md:text-5xl font-light tracking-tight leading-snug text-white">
          {t.editorial?.quote || '«المجوهرات هي الهندسة الصامتة للهوية — خطوط دقيقة تلتقط الضوء في لحظات لا تُنسى.»'}
        </blockquote>
        <div className="pt-4 flex items-center justify-center gap-4 text-xs font-sans tracking-[0.2em] text-white/60 uppercase">
          <span>{t.editorial?.f1 || 'هندسة معمارية'}</span>
          <span>•</span>
          <span>{t.editorial?.f2 || 'بريق يدوم'}</span>
          <span>•</span>
          <span>{t.editorial?.f3 || 'فخامة هادئة'}</span>
        </div>
      </Container>
    </section>
  )
}
