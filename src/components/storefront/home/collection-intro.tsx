import Link from "next/link"
import Image from "next/image"
import { Container, Section } from "@/components/storefront/layout/container"
import { getCollections } from "@/lib/catalog"

export function CollectionIntro() {
  const collections = getCollections()

  return (
    <Section className="bg-[#F9F9F7] text-[#1A1A1A]">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-[#1A1A1A]/10 gap-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#1A1A1A]/60 font-sans block mb-2">
              Curated Worlds
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Aesthetic Universes
            </h2>
          </div>
          <p className="text-sm text-[#1A1A1A]/70 max-w-md font-sans leading-relaxed">
            Each collection explores a unique balance of form, sentiment, and craftsmanship—designed to be worn in quiet distinction.
          </p>
        </div>

        {/* 4-Grid Collection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {collections.map((col, idx) => (
            <Link
              key={col.slug}
              href={`/collections/${col.slug}`}
              className="group block space-y-4"
            >
              <div className="aspect-[3/4] relative overflow-hidden bg-[#ECECE8] border border-[#1A1A1A]/10">
                <Image
                  src={col.coverImage}
                  alt={col.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[9px] uppercase tracking-[0.25em] text-white/70 block mb-1">
                    0{idx + 1} / Collection
                  </span>
                  <h3 className="font-serif text-xl tracking-tight leading-snug">
                    {col.name}
                  </h3>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-[#1A1A1A]/70 line-clamp-2 leading-relaxed font-sans">
                  {col.description}
                </p>
                <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-medium text-[#1A1A1A] group-hover:translate-x-1 transition-transform">
                  <span>Explore Universe</span>
                  <span>&rarr;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  )
}
