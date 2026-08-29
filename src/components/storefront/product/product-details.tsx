import { Product } from "@/lib/catalog"
import { Container } from "@/components/storefront/layout/container"

interface ProductDetailsProps {
  product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const specs = [
    { label: "Product Reference", value: product.id },
    { label: "Category", value: product.category },
    { label: "Collection Universe", value: product.collection },
    { label: "Pieces Included", value: product.piecesIncluded },
    { label: "Metallic Finish", value: product.metallicFinish },
    { label: "Stones & Inlays", value: product.stonesOrInserts },
    { label: "Payment Method", value: "Paiement en espèces à la livraison (Cash on Delivery)" },
    { label: "Delivery Territory", value: "Livraison à domicile ou point relais partout en Algérie" },
    { label: "Care Recommendations", value: "Conserver dans son écrin d'origine. Éviter le contact prolongé avec parfums et produits chimiques." }
  ].filter(item => Boolean(item.value))

  return (
    <section className="py-20 bg-white text-[#1A1A1A] border-t border-[#1A1A1A]/10">
      <Container>
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="space-y-2 border-b border-[#1A1A1A]/10 pb-4">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#1A1A1A]/60 font-sans block">
              Specifications
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
              Verified Product Details
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
