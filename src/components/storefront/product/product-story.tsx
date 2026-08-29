'use client'

import { Product } from "@/lib/catalog"
import { Container } from "@/components/storefront/layout/container"
import { useI18n } from "@/lib/i18n/context"

interface ProductStoryProps {
  product: Product
}

export function ProductStory({ product }: ProductStoryProps) {
  const { t, dir } = useI18n()

  return (
    <section className="py-24 bg-[#F9F9F7] text-[#1A1A1A] border-t border-[#1A1A1A]/10" dir={dir}>
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Atelier Concept Quote */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#1A1A1A]/60 font-sans block">
              {t.productStory?.badge || 'رؤية التصميم'} • {product.collection}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#1A1A1A] leading-tight">
              {t.productStory?.title || 'صنعت بأبعاد دقيقة ومتقنة.'}
            </h2>
            <blockquote className="font-serif text-base italic text-[#1A1A1A]/80 border-l-2 border-[#1A1A1A]/20 pl-4 py-1">
              {t.productStory?.quote || '«تم تصميم كل زاوية لتوازن بين وزن المعدن وانعكاس الضوء الساحر.»'}
            </blockquote>
          </div>

          {/* Right: Narrative Description */}
          <div className="lg:col-span-7 space-y-6 text-sm text-[#1A1A1A]/80 font-sans font-light leading-relaxed">
            <p>
              تنتمي قطعة <strong>{product.name}</strong> إلى مجموعة <em>{product.collection}</em> الراقية، حيث تلتقي الخطوط المتقنة مع الأنوثة الخالدة.
            </p>
            {product.designCharacteristics && (
              <p>
                <strong>{t.productStory?.signatureLabel || 'بصمة التصميم:'}</strong> {product.designCharacteristics}
              </p>
            )}
            {product.metallicFinish && (
              <p>
                <strong>{t.productStory?.finishLabel || 'الطلاء واللمعان:'}</strong> {product.metallicFinish}
              </p>
            )}
            <p>
              {t.productStory?.notice || 'صنعت بعناية حرفية فائقة، وتصلك داخل علبة فاخرة مصممة لحفظها، مرفقة بتوصيات العناية للحفاظ على بريقها الخالد.'}
            </p>
          </div>

        </div>
      </Container>
    </section>
  )
}
