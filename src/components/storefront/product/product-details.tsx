'use client'

import { Product } from "@/lib/catalog"
import { Container } from "@/components/storefront/layout/container"
import { useI18n } from "@/lib/i18n/context"

interface ProductDetailsProps {
  product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const { t, dir } = useI18n()

  const specs = [
    { label: t.productDetails?.ref || "رمز القطعة", value: product.id },
    { label: t.productDetails?.category || "التصنيف", value: product.category },
    { label: t.productDetails?.collection || "المجموعة", value: product.collection },
    { label: t.productDetails?.pieces || "عدد القطع", value: product.piecesIncluded },
    { label: t.productDetails?.finish || "طلاء المعدن", value: product.metallicFinish },
    { label: t.productDetails?.stones || "الأحجار والتطعيمات", value: product.stonesOrInserts },
    { label: t.productDetails?.paymentMethod || "طريقة الدفع", value: t.productDetails?.paymentMethodVal || "الدفع نقداً عند الاستلام ومعاينة الطرد" },
    { label: t.productDetails?.territory || "نطاق التوصيل", value: t.productDetails?.territoryVal || "توصيل للمنزل أو المكتب عبر 58 ولاية جزائرية" },
    { label: t.productDetails?.care || "إرشادات الحفظ", value: t.productDetails?.careVal || "يحفظ في العلبة المخملية الأصلية، ويفضل تجنب الملامسة المباشرة للعطور والمواد الكيميائية." }
  ].filter(item => Boolean(item.value))

  return (
    <section className="py-20 bg-white text-[#1A1A1A] border-t border-[#1A1A1A]/10" dir={dir}>
      <Container>
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="space-y-2 border-b border-[#1A1A1A]/10 pb-4">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#1A1A1A]/60 font-sans block">
              {t.productDetails?.badge || 'المواصفات الفنية'}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
              {t.productDetails?.title || 'تفاصيل المنتج المعتمدة'}
            </h2>
          </div>

          <div className="border border-[#1A1A1A]/10 divide-y divide-[#1A1A1A]/10 text-xs font-sans">
            {specs.map((item) => (
              <div 
                key={item.label} 
                className="grid grid-cols-1 sm:grid-cols-12 p-4 md:p-5 hover:bg-[#F9F9F7] transition-colors"
              >
                <div className="sm:col-span-4 uppercase tracking-wider font-semibold text-[#1A1A1A]/70 mb-1 sm:mb-0">
                  {item.label}
                </div>
                <div className="sm:col-span-8 text-[#1A1A1A] font-light leading-relaxed">
                  {item.value}
                </div>
              </div>
            ))}
          </div>

        </div>
      </Container>
    </section>
  )
}
