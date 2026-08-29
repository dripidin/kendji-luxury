'use client'

import Image from "next/image"
import { Container, Section } from "@/components/storefront/layout/container"
import { BACKGROUND_ASSETS } from "@/lib/catalog"
import { useI18n } from "@/lib/i18n/context"

export function BrandStory() {
  const { t, locale } = useI18n()
  const bg = BACKGROUND_ASSETS['KJ-BG-06']

  return (
    <Section className="bg-[#F9F9F7] text-[#1A1A1A] overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Visual Side */}
          <div className="lg:col-span-6 relative">
            <div className="aspect-[4/5] relative bg-[#ECECE8] overflow-hidden border border-[#1A1A1A]/10">
              <Image
                src={bg.path}
                alt="KenDji Craftsmanship Atmosphere"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-[#1A1A1A]/10" />
            </div>
            {/* Minimalist Floating Caption Box */}
            <div className="absolute -bottom-6 -right-6 hidden sm:block bg-white p-6 border border-[#1A1A1A]/10 shadow-sm max-w-xs">
              <p className="font-serif text-sm italic text-[#1A1A1A]">
                {locale === 'ar' ? '«البساطة الراقية هي أسمى درجات الفخامة.»' : '« La simplicité raffinée est la forme suprême du luxe. »'}
              </p>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/60 block mt-2 font-sans">
                {locale === 'ar' ? 'فلسفة دار كندجي' : 'Philosophie Maison KenDji'}
              </span>
            </div>
          </div>

          {/* Editorial Content Side */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-3">
              <span className="text-[11px] uppercase tracking-[0.3em] text-[#1A1A1A]/60 font-sans block">
                {t.home.storyBadge}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1A1A1A] leading-tight">
                {t.home.storyTitle}
              </h2>
            </div>

            <div className="space-y-6 text-sm text-[#1A1A1A]/80 font-sans leading-relaxed font-light">
              <p>{t.home.storyP1}</p>
              <p>{t.home.storyP2}</p>
              <p>
                {locale === 'ar'
                  ? 'من أطقم الكلوفر الأيقونية إلى الأساور المرصعة والقلادات الشاعرية، تضمن لك دار كندجي تجربة اقتناء راقية مع الدفع نقداً عند استلام مجوهراتك.'
                  : 'Des parures signatures aux bracelets sculpturaux, chaque création célèbre votre féminité avec une livraison soignée et sécurisée partout en Algérie.'}
              </p>
            </div>

            <div className="pt-4 grid grid-cols-2 gap-6 border-t border-[#1A1A1A]/10 text-xs font-sans">
              <div>
                <h4 className="font-semibold text-sm uppercase tracking-wider text-[#1A1A1A] mb-1">
                  {locale === 'ar' ? 'جودة وتألق دائم' : 'Matériaux Nobles'}
                </h4>
                <p className="text-[#1A1A1A]/70 leading-normal">
                  {locale === 'ar' ? 'ستانلس ستيل وطلاء ذهبي مقاوم للتغير.' : 'Acier inoxydable de haute qualité et finitions dorées durables.'}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-sm uppercase tracking-wider text-[#1A1A1A] mb-1">
                  {locale === 'ar' ? 'تغليف هدايا فاخر' : 'Écrin Signature'}
                </h4>
                <p className="text-[#1A1A1A]/70 leading-normal">
                  {locale === 'ar' ? 'علبة مخملية راقية جاهزة للإهداء ومرفقة ببطاقة ضمان.' : 'Chaque bijou est livré prêt à offrir dans son écrin de velours.'}
                </p>
              </div>
            </div>
          </div>

        </div>
      </Container>
    </Section>
  )
}
