import { Product } from "@/lib/catalog"
import { Container } from "@/components/storefront/layout/container"
import { Layers, Sparkles, Sliders, Shield, Crown } from "lucide-react"

interface CategoryEmphasisProps {
  product: Product
}

export function CategoryEmphasis({ product }: CategoryEmphasisProps) {
  const getCategoryHighlights = () => {
    switch (product.categorySlug) {
      case 'sets':
        return {
          badge: "Parure Harmonieuse",
          title: "Complete Look & Coordinated Silhouette",
          description: "Designed as an integrated aesthetic suite where each piece echoes the central motif, offering effortless styling whether worn together as a statement parure or individually for everyday refinement.",
          features: [
            { icon: Layers, label: "Unified Design", text: "Coordinated motifs across necklace, bracelet, earrings, and ring." },
            { icon: Sparkles, label: "Day to Evening", text: "Versatile parure styling suitable for celebrations and refined daily wear." },
            { icon: Shield, label: "Secure Finishes", text: "Matching lobster clasps, post studs, and sturdy ring bands." }
          ]
        }
      case 'necklaces':
        return {
          badge: "Port & Décolleté",
          title: "Neckline Framing & Sculptural Drape",
          description: "Engineered to sit gracefully along the collarbone with balanced chain tension that keeps the focal pendant centered and luminous from every angle.",
          features: [
            { icon: Sparkles, label: "Focal Centering", text: "Weighted bail and links designed to prevent chain twisting." },
            { icon: Sliders, label: "Adjustable Drape", text: "Extension links allowing tailored length for various necklines." },
            { icon: Shield, label: "Resilient Links", text: "Precision-soldered cable and curb link construction." }
          ]
        }
      case 'bracelets':
        return {
          badge: "Poignet & Stacking",
          title: "Wrist Ergonomics & Stacking Versatility",
          description: "Curved to follow the natural contours of the wrist with a comfortable profile that stacks seamlessly with bangles, chains, and timepieces.",
          features: [
            { icon: Layers, label: "Effortless Stacking", text: "Pair seamlessly with cuffs and fine tennis strands." },
            { icon: Shield, label: "Clasp Security", text: "Solid lobster or tension hinge mechanism for daily peace of mind." },
            { icon: Sparkles, label: "Mirror Finish", text: "High-polish outer rims reflecting subtle light on movement." }
          ]
        }
      case 'watches':
        return {
          badge: "Horlogerie & Précision",
          title: "Architectural Bezel & Two-Tone Fluidity",
          description: "Combining jewelry aesthetics with classic horological detailing. Features a fluted stone-set bezel, magnifying cyclops date lens, and a supple 5-piece Jubilee link bracelet.",
          features: [
            { icon: Crown, label: "Stone-Set Bezel", text: "Light-catching crystal setting around the fluted bezel." },
            { icon: Sliders, label: "Jubilee Bracelet", text: "Two-tone link construction with fold-over security buckle." },
            { icon: Sparkles, label: "Sunray Dial", text: "Deep black sunray finish with clear hour indices." }
          ]
        }
      case 'rings':
        return {
          badge: "Bague & Silhouette",
          title: "Band Proportions & Solitaire Presence",
          description: "Designed for comfortable finger articulation with smooth inner profiling and high-contrast stone halo settings.",
          features: [
            { icon: Crown, label: "Crown Setting", text: "Elevated halo setting allowing maximum light refraction." },
            { icon: Layers, label: "Stacking Profile", text: "Low-profile shank designed to sit flush alongside eternity bands." },
            { icon: Shield, label: "Smooth Comfort Fit", text: "Rounded interior edges ensuring all-day wearability." }
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
