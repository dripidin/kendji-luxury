'use client'

import { Product } from "@/lib/catalog"
import { Container } from "@/components/storefront/layout/container"
import { useI18n } from "@/lib/i18n/context"
import { Layers, Sparkles, Sliders, Shield, Crown } from "lucide-react"

interface CategoryEmphasisProps {
  product: Product
}

export function CategoryEmphasis({ product }: CategoryEmphasisProps) {
  const { t } = useI18n()

  const getCategoryHighlights = () => {
    switch (product.categorySlug) {
      case 'sets':
        return {
          badge: t.categoryEmphasis?.setsBadge || "Parure Harmonieuse",
          title: t.categoryEmphasis?.setsTitle || "Complete Look & Coordinated Silhouette",
          description: t.categoryEmphasis?.setsDesc || "Designed as an integrated aesthetic suite where each piece echoes the central motif.",
          features: [
            { icon: Layers, label: "تصميم متناسق", text: "نقوش منسجمة تجمع القلادة والسوار والأقراط والخاتم." },
            { icon: Sparkles, label: "تألق دائم", text: "طقم مرن يناسب المناسبات والإطلالات اليومية الراقية." },
            { icon: Shield, label: "إغلاق محكم", text: "مأمن إغلاق متين وحلقات مريحة للاستخدام المضمون." }
          ]
        }
      case 'necklaces':
        return {
          badge: t.categoryEmphasis?.necklacesBadge || "Port & Décolleté",
          title: t.categoryEmphasis?.necklacesTitle || "Neckline Framing & Sculptural Drape",
          description: t.categoryEmphasis?.necklacesDesc || "Engineered to sit gracefully along the collarbone with balanced chain tension.",
          features: [
            { icon: Sparkles, label: "استقرار قلادة العنق", text: "تصميم مدروس يمنع التواء السلسلة ويحافظ على ثبات القلادة." },
            { icon: Sliders, label: "قياس قابل للتعديل", text: "حلقات تمديد تتيح تعديل الطول حسب رغبتك." },
            { icon: Shield, label: "سلسلة متينة", text: "حلقات متصلة بدقة للحفاظ على جودة السلسلة." }
          ]
        }
      case 'bracelets':
        return {
          badge: t.categoryEmphasis?.braceletsBadge || "Poignet & Stacking",
          title: t.categoryEmphasis?.braceletsTitle || "Wrist Ergonomics & Stacking Versatility",
          description: t.categoryEmphasis?.braceletsDesc || "Curved to follow the natural contours of the wrist.",
          features: [
            { icon: Layers, label: "تناغم مع الأساور", text: "يمكن ارتداؤه مفرداً أو دمجه بسلاسة مع أساور وساعات أخرى." },
            { icon: Shield, label: "قفل أمان", text: "قفل متين ومريح يضمن راحة البال طوال اليوم." },
            { icon: Sparkles, label: "لمعان مرآتي", text: "حواف مصقولة تعكس الضوء ببريق جذاب." }
          ]
        }
      case 'watches':
        return {
          badge: t.categoryEmphasis?.watchesBadge || "Horlogerie & Précision",
          title: t.categoryEmphasis?.watchesTitle || "Architectural Bezel & Two-Tone Fluidity",
          description: t.categoryEmphasis?.watchesDesc || "Combining jewelry aesthetics with classic horological detailing.",
          features: [
            { icon: Crown, label: "إطار مرصع", text: "ترصيع بدقة حول الإطار لالتقاط الضوء." },
            { icon: Sliders, label: "سوار مريح", text: "سوار متين بدرجتين لونيتين وقفل أمان." },
            { icon: Sparkles, label: "واجهة براقة", text: "لمسات نهائية فاخرة ومؤشرات ساعات واضحة." }
          ]
        }
      case 'rings':
        return {
          badge: t.categoryEmphasis?.ringsBadge || "Bague & Silhouette",
          title: t.categoryEmphasis?.ringsTitle || "Band Proportions & Solitaire Presence",
          description: t.categoryEmphasis?.ringsDesc || "Designed for comfortable finger articulation.",
          features: [
            { icon: Crown, label: "تاج مرتفع", text: "تصميم يبرز بريق الأحجار بانعكاس ممتاز للضوء." },
            { icon: Layers, label: "سهولة الارتداء", text: "مقاس متناسق يتيح ارتدائه بجانب الخواتم الأخرى." },
            { icon: Shield, label: "ملمس ناعم", text: "حواف داخلية مصقولة توفر راحة تامة أثناء الارتداء." }
          ]
        }
      default:
        return null
    }
  }

  const highlight = getCategoryHighlights()
  if (!highlight) return null

  return (
    <section className="py-20 bg-white text-[#1A1A1A] border-t border-[#1A1A1A]/10">
      <Container>
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Section Header */}
          <div className="text-center space-y-3">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#1A1A1A]/60 font-sans block">
              {highlight.badge}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              {highlight.title}
            </h2>
            <p className="text-sm text-[#1A1A1A]/75 font-sans font-light max-w-2xl mx-auto leading-relaxed">
              {highlight.description}
            </p>
          </div>

          {/* 3 Pillar Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {highlight.features.map((feat) => {
              const Icon = feat.icon
              return (
                <div key={feat.label} className="p-6 bg-[#F9F9F7] border border-[#1A1A1A]/10 space-y-3">
                  <div className="h-8 w-8 bg-white border border-[#1A1A1A]/10 flex items-center justify-center text-[#1A1A1A]">
                    <Icon size={16} strokeWidth={1.5} />
                  </div>
                  <h4 className="font-serif text-base font-bold tracking-tight text-[#1A1A1A]">
                    {feat.label}
                  </h4>
                  <p className="text-xs text-[#1A1A1A]/70 font-sans leading-relaxed font-light">
                    {feat.text}
                  </p>
                </div>
              )
            })}
          </div>

        </div>
      </Container>
    </section>
  )
}
