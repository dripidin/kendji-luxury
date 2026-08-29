import { Product } from "@/lib/catalog"
import { Container } from "@/components/storefront/layout/container"

interface ProductStoryProps {
  product: Product
}

export function ProductStory({ product }: ProductStoryProps) {
  return (
    <section className="py-24 bg-[#F9F9F7] text-[#1A1A1A] border-t border-[#1A1A1A]/10">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Atelier Concept Quote */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#1A1A1A]/60 font-sans block">
              Design Insight • {product.collection}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#1A1A1A] leading-tight">
              Crafted with Deliberate Proportion.
            </h2>
            <blockquote className="font-serif text-base italic text-[#1A1A1A]/80 border-l-2 border-[#1A1A1A]/20 pl-4 py-1">
              &ldquo;Every angle is shaped to balance metallic weight with delicate light reflection.&rdquo;
            </blockquote>
          </div>

          {/* Right: Narrative Description */}
          <div className="lg:col-span-7 space-y-6 text-sm text-[#1A1A1A]/80 font-sans font-light leading-relaxed">
            <p>
              The <strong>{product.name}</strong> belongs to our <em>{product.collection}</em> collection, where structural lines meet timeless feminine adornment.
            </p>
            {product.designCharacteristics && (
              <p>
                <strong>Design Signature:</strong> {product.designCharacteristics}
              </p>
            )}
            {product.metallicFinish && (
              <p>
                <strong>Finishing & Texture:</strong> {product.metallicFinish} Designed for subtle luster that preserves its gleam through repeated wear.
              </p>
            )}
            <p>
              Handled with artisanal care, this creation is delivered in protective custom gift packaging, accompanied by verified care recommendations to maintain its pristine luster.
            </p>
          </div>

        </div>
      </Container>
    </section>
  )
}
