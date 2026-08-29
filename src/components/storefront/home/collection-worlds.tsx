'use client'

import Link from "next/link"
import Image from "next/image"
import { Container, Section } from "@/components/storefront/layout/container"
import { Button } from "@/components/ui/button"
import { getCollectionBySlug, getProductsByCollection } from "@/lib/catalog"
import { useI18n } from "@/lib/i18n/context"

export function CollectionWorlds() {
  const { t, locale } = useI18n()

  const signature = getCollectionBySlug('signature-motifs')
  const romantic = getCollectionBySlug('romantic-nature')
  const urban = getCollectionBySlug('urban-iconic')

  const signatureProduct = getProductsByCollection('signature-motifs')[0]
  const romanticProduct = getProductsByCollection('romantic-nature')[0]
  const urbanProduct = getProductsByCollection('urban-iconic')[0]

  return (
    <Section className="bg-[#FFFFFF] text-[#1A1A1A] border-t border-[#1A1A1A]/5">
      <Container>
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#1A1A1A]/60 font-sans block">
            {t.home.worldsBadge}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            {t.home.worldsTitle}
          </h2>
          <p className="text-sm text-[#1A1A1A]/70 font-sans leading-relaxed font-light">
            {t.home.worldsSubtitle}
          </p>
        </div>

        {/* Asymmetrical Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Showcase (Signature Motifs) - 7 cols */}
          {signature && (
            <div className="lg:col-span-7 bg-[#F9F9F7] p-8 md:p-12 border border-[#1A1A1A]/10 flex flex-col justify-between group">
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#1A1A1A]/60 font-sans">
                  {locale === 'ar' ? 'المجموعة الرئيسية' : 'Spotlight World'}
                </span>
                <h3 className="font-serif text-3xl md:text-4xl font-bold tracking-tight">
                  {locale === 'ar' ? 'مجموعة الزخارف المميزة' : signature.name}
                </h3>
                <p className="text-sm text-[#1A1A1A]/80 font-sans max-w-md leading-relaxed font-light">
                  {locale === 'ar' 
                    ? 'تصاميم كلوفر وأشكال زهرية أيقونية تعكس الفخامة والأناقة الخالدة.'
                    : signature.description}
                </p>
              </div>

              <div className="my-8 aspect-[16/10] relative overflow-hidden bg-white/50 border border-[#1A1A1A]/5">
                {signatureProduct && (
                  <Image
                    src={signatureProduct.coverImage}
                    alt={signature.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                )}
              </div>

              <div className="pt-2">
                <Link href={`/collections/${signature.slug}`}>
                  <Button 
                    className="bg-[#1A1A1A] text-white hover:bg-[#1A1A1A]/90 px-8 py-5 text-xs uppercase tracking-[0.2em] font-medium"
                  >
                    {locale === 'ar' ? 'استكشف المجموعة' : 'View Signature Collection'}
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Secondary Stack (Romantic + Urban) - 5 cols */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            
            {/* Romantic Nature Card */}
            {romantic && (
              <div className="flex-1 bg-[#F9F9F7] p-6 md:p-8 border border-[#1A1A1A]/10 flex flex-col justify-between group">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#1A1A1A]/60 font-sans">
                      {locale === 'ar' ? 'تشكيلة رومانسية' : 'Aesthetic World'}
                    </span>
                    <h4 className="font-serif text-2xl font-bold tracking-tight mt-1">
                      {locale === 'ar' ? 'سحر الطبيعة والورود' : romantic.name}
                    </h4>
                  </div>
                  <Link 
                    href={`/collections/${romantic.slug}`} 
                    className="text-xs uppercase tracking-widest font-semibold hover:opacity-70 transition-opacity"
                  >
                    {locale === 'ar' ? 'تصفح ←' : 'Explore →'}
                  </Link>
                </div>
                <div className="aspect-[16/9] relative overflow-hidden bg-white/50 border border-[#1A1A1A]/5 my-3">
                  {romanticProduct && (
                    <Image
                      src={romanticProduct.coverImage}
                      alt={romantic.name}
                      fill
                      sizes="400px"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                </div>
                <p className="text-xs text-[#1A1A1A]/70 font-sans line-clamp-2 font-light">
                  {locale === 'ar' ? 'مستوحاة من رقة بتلات الأزهار ونقاء أوراق النباتات المرصعة.' : romantic.description}
                </p>
              </div>
            )}

            {/* Urban & Iconic Card */}
            {urban && (
              <div className="flex-1 bg-[#F9F9F7] p-6 md:p-8 border border-[#1A1A1A]/10 flex flex-col justify-between group">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#1A1A1A]/60 font-sans">
                      {locale === 'ar' ? 'تشكيلة عصرية' : 'Aesthetic World'}
                    </span>
                    <h4 className="font-serif text-2xl font-bold tracking-tight mt-1">
                      {locale === 'ar' ? 'الأناقة الحضرية المعاصرة' : urban.name}
                    </h4>
                  </div>
                  <Link 
                    href={`/collections/${urban.slug}`} 
                    className="text-xs uppercase tracking-widest font-semibold hover:opacity-70 transition-opacity"
                  >
                    {locale === 'ar' ? 'تصفح ←' : 'Explore →'}
                  </Link>
                </div>
                <div className="aspect-[16/9] relative overflow-hidden bg-white/50 border border-[#1A1A1A]/5 my-3">
                  {urbanProduct && (
                    <Image
                      src={urbanProduct.coverImage}
                      alt={urban.name}
                      fill
                      sizes="400px"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                </div>
                <p className="text-xs text-[#1A1A1A]/70 font-sans line-clamp-2 font-light">
                  {locale === 'ar' ? 'سلاسل جريئة وحلقات مشبكية عصرية تناسب كل إطلالة.' : urban.description}
                </p>
              </div>
            )}

          </div>

        </div>
      </Container>
    </Section>
  )
}
