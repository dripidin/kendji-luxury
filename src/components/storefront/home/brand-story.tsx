import Image from "next/image"
import { Container, Section } from "@/components/storefront/layout/container"
import { BACKGROUND_ASSETS } from "@/lib/catalog"

export function BrandStory() {
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
                &ldquo;Restraint is the highest form of luxury.&rdquo;
              </p>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/60 block mt-2 font-sans">
                KenDji Atelier Philosophy
              </span>
            </div>
          </div>

          {/* Editorial Content Side */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-3">
              <span className="text-[11px] uppercase tracking-[0.3em] text-[#1A1A1A]/60 font-sans block">
                Atelier & Craftsmanship
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1A1A1A] leading-tight">
                Designed for Presence, <br />
                <span className="font-normal italic">Refined by Restraint.</span>
              </h2>
            </div>

            <div className="space-y-6 text-sm text-[#1A1A1A]/80 font-sans leading-relaxed font-light">
              <p>
                At KenDji Luxury, we believe that true elegance does not compete for attention—it commands it through balance and architectural clarity. Every piece in our boutique is selected to act as an intimate extension of your personal style.
              </p>
              <p>
                Our collections emphasize enduring finishes and deliberate weight, selecting resilient stainless steel alloys (<em>Acier Inoxydable</em>), high-polish gold plating, and luminous pavé settings tailored for everyday grace and celebratory moments alike.
              </p>
              <p>
                From delicate signature clover parures to sculptural nail bangles and calligraphy medals, our curation represents transparency, authentic design, and attentive presentation.
              </p>
            </div>

            <div className="pt-4 grid grid-cols-2 gap-6 border-t border-[#1A1A1A]/10 text-xs font-sans">
              <div>
                <h4 className="font-semibold text-sm uppercase tracking-wider text-[#1A1A1A] mb-1">
                  Material Transparency
                </h4>
                <p className="text-[#1A1A1A]/70 leading-normal">
                  Carefully verified finishes and stainless steel selections documented per creation.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-sm uppercase tracking-wider text-[#1A1A1A] mb-1">
                  Artisanal Presentation
                </h4>
                <p className="text-[#1A1A1A]/70 leading-normal">
                  Delivered in signature protective packaging ready for gifting and preservation.
                </p>
              </div>
            </div>
          </div>

        </div>
      </Container>
    </Section>
  )
}
