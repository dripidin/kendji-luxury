import Link from "next/link"
import Image from "next/image"
import { Container, Section } from "@/components/storefront/layout/container"
import { Button } from "@/components/ui/button"
import { getCollectionBySlug, getProductsByCollection } from "@/lib/catalog"

export function CollectionWorlds() {
  const signature = getCollectionBySlug('signature-motifs')
  const romantic = getCollectionBySlug('romantic-nature')
  const urban = getCollectionBySlug('urban-iconic')

  const signatureProduct = getProductsByCollection('signature-motifs')[0]
  const romanticProduct = getProductsByCollection('romantic-nature')[0]
  const urbanProduct = getProductsByCollection('urban-iconic')[0]

  return (
    <Section className="bg-[#FFFFFF] text-[#1A1A1A] border-t border-[#1A1A1A]/5">
      <Container>
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#1A1A1A]/60 font-sans block">
            The Collections
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Curated Aesthetics
          </h2>
          <p className="text-sm text-[#1A1A1A]/70 font-sans leading-relaxed">
            Immerse yourself in defined design languages, from botanical romanticism to bold urban contours.
          </p>
        </div>

        {/* Asymmetrical Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Showcase (Signature Motifs) - 7 cols */}
          {signature && (
            <div className="lg:col-span-7 bg-[#F9F9F7] p-8 md:p-12 border border-[#1A1A1A]/10 flex flex-col justify-between group">
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#1A1A1A]/60 font-sans">
                  Spotlight World
                </span>
                <h3 className="font-serif text-3xl md:text-4xl font-bold tracking-tight">
                  {signature.name}
                </h3>
                <p className="text-sm text-[#1A1A1A]/80 font-sans max-w-md leading-relaxed">
                  {signature.description}
                </p>
              </div>

              <div className="my-8 aspect-[16/10] relative overflow-hidden bg-white/50 border border-[#1A1A1A]/5">
                {signatureProduct && (
                  <Image
                    src={signatureProduct.coverImage}
                    alt={signature.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                )}
              </div>

              <div className="pt-2">
                <Link href={`/collections/${signature.slug}`}>
                  <Button 
                    className="bg-[#1A1A1A] text-white hover:bg-[#1A1A1A]/90 px-8 py-5 text-xs uppercase tracking-[0.2em]"
                  >
                    View Signature Collection
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Secondary Stack (Romantic + Urban) - 5 cols */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            
            {/* Romantic Nature Card */}
            {romantic && (
              <div className="flex-1 bg-[#F9F9F7] p-6 md:p-8 border border-[#1A1A1A]/10 flex flex-col justify-between group">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#1A1A1A]/60 font-sans">
                      Aesthetic World
                    </span>
                    <h4 className="font-serif text-2xl font-bold tracking-tight mt-1">
                      {romantic.name}
                    </h4>
                  </div>
                  <Link 
                    href={`/collections/${romantic.slug}`} 
                    className="text-xs uppercase tracking-widest font-semibold hover:opacity-70 transition-opacity"
                  >
                    Explore &rarr;
                  </Link>
                </div>
                <div className="aspect-[16/9] relative overflow-hidden bg-white/50 border border-[#1A1A1A]/5 my-3">
                  {romanticProduct && (
                    <Image
                      src={romanticProduct.coverImage}
                      alt={romantic.name}
                      fill
                      sizes="400px"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                </div>
                <p className="text-xs text-[#1A1A1A]/70 font-sans line-clamp-2">
                  {romantic.description}
                </p>
              </div>
            )}

            {/* Urban & Iconic Card */}
            {urban && (
              <div className="flex-1 bg-[#F9F9F7] p-6 md:p-8 border border-[#1A1A1A]/10 flex flex-col justify-between group">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#1A1A1A]/60 font-sans">
                      Aesthetic World
                    </span>
                    <h4 className="font-serif text-2xl font-bold tracking-tight mt-1">
                      {urban.name}
                    </h4>
                  </div>
                  <Link 
                    href={`/collections/${urban.slug}`} 
                    className="text-xs uppercase tracking-widest font-semibold hover:opacity-70 transition-opacity"
                  >
                    Explore &rarr;
                  </Link>
                </div>
                <div className="aspect-[16/9] relative overflow-hidden bg-white/50 border border-[#1A1A1A]/5 my-3">
                  {urbanProduct && (
                    <Image
                      src={urbanProduct.coverImage}
                      alt={urban.name}
                      fill
                      sizes="400px"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                </div>
                <p className="text-xs text-[#1A1A1A]/70 font-sans line-clamp-2">
                  {urban.description}
                </p>
              </div>
            )}

          </div>

        </div>
      </Container>
    </Section>
  )
}
