import { Container, Section } from "@/components/storefront/layout/container"
import { ShieldCheck, Package, Headphones, Sparkles } from "lucide-react"

export function TrustSection() {
  const trustPillars = [
    {
      icon: ShieldCheck,
      title: "Paiement à la Livraison",
      subtitle: "Cash on Delivery",
      description: "Pay conveniently upon receipt of your order across all 58 wilayas with total confidence."
    },
    {
      icon: Package,
      title: "Écrin & Présentation",
      subtitle: "Signature Packaging",
      description: "Each creation is securely packaged in an elegant gift box, prepared with artisanal care."
    },
    {
      icon: Headphones,
      title: "Service Client Attentif",
      subtitle: "Dedicated Support",
      description: "Direct, personal communication for sizing advice, order tracking, and product questions."
    },
    {
      icon: Sparkles,
      title: "Matériaux Sélectionnés",
      subtitle: "Material Clarity",
      description: "Verified stainless steel alloys and high-polish gold finishes detailed transparently."
    }
  ]

  return (
    <Section className="bg-[#F9F9F7] text-[#1A1A1A] border-t border-[#1A1A1A]/10">
      <Container>
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#1A1A1A]/60 font-sans block">
            Confidence & Care
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
            The KenDji Commitment
          </h2>
          <p className="text-sm text-[#1A1A1A]/70 font-sans leading-relaxed">
            A refined purchasing experience founded on transparency, dedicated service, and reliable delivery.
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
