'use client'

import { Container, Section } from "@/components/storefront/layout/container"
import { ShieldCheck, Package, Headphones, Sparkles } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

export function TrustSection() {
  const { t, locale } = useI18n()

  const trustPillars = [
    {
      icon: ShieldCheck,
      title: t.trust.paymentOnDelivery,
      subtitle: locale === 'ar' ? 'الدفع نقداً 58 ولاية' : 'Cash on Delivery',
      description: t.trust.paymentOnDeliverySub
    },
    {
      icon: Package,
      title: t.trust.velvetPackaging,
      subtitle: locale === 'ar' ? 'تغليف هدايا راقٍ' : 'Signature Packaging',
      description: t.trust.velvetPackagingSub
    },
    {
      icon: Headphones,
      title: t.trust.wilayasShipping,
      subtitle: locale === 'ar' ? 'شحن سريع 24-72 ساعة' : '58 Wilayas Express',
      description: t.trust.wilayasShippingSub
    },
    {
      icon: Sparkles,
      title: locale === 'ar' ? 'جودة المواد والضمان' : locale === 'en' ? 'Quality & Certificate' : 'Matériaux & Garantie',
      subtitle: locale === 'ar' ? 'مطابقة ومصداقية' : 'Certified Excellence',
      description: locale === 'ar' 
        ? 'سبائك متينة مقاومة للصدأ مع طلاء ذهبي متألق وشهادة ضمان مرفقة.'
        : locale === 'en'
        ? 'High-grade stainless steel alloys with radiant gold finishes and authenticity certificate.'
        : 'Alliages nobles inoxydables avec finitions dorées durables et certificat de conformité.'
    }
  ]

  return (
    <Section className="bg-[#F9F9F7] text-[#1A1A1A] border-t border-[#1A1A1A]/10">
      <Container>
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#1A1A1A]/60 font-sans block">
            {locale === 'ar' ? 'الثقة والتميز' : 'Confidence & Care'}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
            {locale === 'ar' ? 'التزام دار كندجي' : locale === 'en' ? 'The KenDji Commitment' : 'L’Engagement KenDji'}
          </h2>
          <p className="text-sm text-[#1A1A1A]/70 font-sans leading-relaxed">
            {locale === 'ar' 
              ? 'تجربة تسوق فاخرة ترتكز على الشفافية، خدمة العملاء المميزة، والتوصيل الموثوق في الجزائر.'
              : 'Une expérience joaillière d’exception fondée sur la transparence, un service attentif et une livraison sécurisée.'}
          </p>
        </div>

        {/* 4 Trust Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustPillars.map((pillar) => {
            const Icon = pillar.icon
            return (
              <div 
                key={pillar.title} 
                className="bg-white p-8 border border-[#1A1A1A]/10 space-y-4 hover:border-[#1A1A1A]/30 transition-colors"
              >
                <div className="h-10 w-10 bg-[#F9F9F7] border border-[#1A1A1A]/10 flex items-center justify-center text-[#1A1A1A]">
                  <Icon size={20} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold tracking-tight text-[#1A1A1A]">
                    {pillar.title}
                  </h3>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/50 block mt-0.5 font-sans">
                    {pillar.subtitle}
                  </span>
                </div>
                <p className="text-xs text-[#1A1A1A]/70 leading-relaxed font-sans font-light">
                  {pillar.description}
                </p>
              </div>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
