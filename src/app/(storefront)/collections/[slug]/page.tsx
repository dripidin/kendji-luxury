import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Sparkles } from 'lucide-react'
import { Container } from '@/components/storefront/layout/container'
import { CatalogGrid } from '@/components/storefront/catalog/catalog-grid'
import {
  fetchStorefrontCollectionBySlug,
  fetchStorefrontProducts,
  fetchStorefrontCategories
} from '@/lib/storefront-catalog'
import { getCollections } from '@/lib/catalog'

export async function generateStaticParams() {
  const collections = getCollections()
  return collections.map(col => ({
    slug: col.slug
  }))
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const collection = await fetchStorefrontCollectionBySlug(slug)

  if (!collection) {
    return {
      title: 'Collection Introuvable | KenDji Luxury',
      robots: { index: false, follow: false }
    }
  }

  const title = `Collection ${collection.name} | KenDji Luxury`
  const description =
    collection.description ||
    `Explorez la collection ${collection.name} par KenDji Luxury. Pièces d’exception en or et nacre, livraison rapide 58 Wilayas en Algérie.`

  return {
    title,
    description,
    alternates: {
      canonical: `https://kendji-luxury.dz/collections/${slug}`
    },
    openGraph: {
      title,
      description,
      url: `https://kendji-luxury.dz/collections/${slug}`,
      images: [{ url: collection.coverImage, width: 1200, height: 800, alt: collection.name }]
    }
  }
}

export default async function CollectionDetailPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [collection, products, allCategories] = await Promise.all([
    fetchStorefrontCollectionBySlug(slug),
    fetchStorefrontProducts({ collectionSlug: slug }),
    fetchStorefrontCategories()
  ])

  if (!collection) {
    notFound()
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      {/* Editorial Header with Curated Visual Banner */}
      <section className="relative bg-[#1A1A1A] text-white py-16 md:py-24 overflow-hidden border-b border-[#1A1A1A]/10">
        <div className="absolute inset-0 opacity-25">
          <Image
            src={collection.coverImage}
            alt={collection.name}
            fill
            priority
            className="object-cover object-center filter blur-[2px] scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />

        <Container className="relative z-10">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center space-x-2 text-xs uppercase tracking-widest text-white/60">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <ChevronRight className="h-3 w-3 inline text-white/40" />
              </li>
              <li>
                <Link href="/collections" className="hover:text-white transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <ChevronRight className="h-3 w-3 inline text-white/40" />
              </li>
              <li className="text-white font-semibold">{collection.name}</li>
            </ol>
          </nav>

          <div className="max-w-2xl space-y-4">
            <span className="text-[11px] uppercase tracking-[0.3em] text-white/70 font-sans flex items-center gap-2">
              <Sparkles className="h-3 w-3 text-amber-400" />
              {collection.tagline}
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
              {collection.name}
            </h1>
            <p className="text-sm sm:text-base text-white/80 font-sans leading-relaxed">
              {collection.description}
            </p>
          </div>
        </Container>
      </section>

      {/* Products Grid */}
      <Container className="py-12 md:py-16">
        <CatalogGrid
          initialProducts={products}
          categories={allCategories}
          pageTitle={`Créations ${collection.name}`}
          pageSubtitle={`Découvrez les bijoux d’exception réunis au cœur de l’univers ${collection.name}.`}
          showCategoryFilters={false}
        />
      </Container>
    </div>
  )
}
