import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Container } from '@/components/storefront/layout/container'
import { CatalogGrid } from '@/components/storefront/catalog/catalog-grid'
import {
  fetchStorefrontProducts,
  fetchStorefrontCategoryBySlug,
  fetchStorefrontCategories
} from '@/lib/storefront-catalog'
import { getCategories } from '@/lib/catalog'

export async function generateStaticParams() {
  const categories = getCategories()
  return categories.map(cat => ({
    slug: cat.slug
  }))
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const category = await fetchStorefrontCategoryBySlug(slug)

  if (!category) {
    return {
      title: 'Catégorie Introuvable | KenDji Luxury',
      robots: { index: false, follow: false }
    }
  }

  const categoryNamesFr: Record<string, string> = {
    sets: 'Parures & Ensembles de Joaillerie',
    necklaces: 'Colliers & Pendentifs',
    bracelets: 'Bracelets & Joncs',
    rings: 'Bagues & Solitaires',
    watches: 'Montres Joaillières'
  }

  const title = `${categoryNamesFr[slug] || category.name} | KenDji Luxury`
  const description =
    category.description ||
    `Découvrez notre sélection exclusive de ${category.name.toLowerCase()} KenDji Luxury. Finition or et nacre, livraison rapide 58 Wilayas en Algérie.`

  return {
    title,
    description,
    alternates: {
      canonical: `https://kendji-luxury.dz/category/${slug}`
    },
    openGraph: {
      title,
      description,
      url: `https://kendji-luxury.dz/category/${slug}`
    }
  }
}

export default async function CategoryDetailPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [category, products, allCategories] = await Promise.all([
    fetchStorefrontCategoryBySlug(slug),
    fetchStorefrontProducts({ categorySlug: slug }),
    fetchStorefrontCategories()
  ])

  if (!category) {
    notFound()
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      <Container className="py-8 md:py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center space-x-2 text-xs uppercase tracking-widest text-[#1A1A1A]/50">
            <li>
              <Link href="/" className="hover:text-[#1A1A1A] transition-colors">
                Accueil
              </Link>
            </li>
            <li>
              <ChevronRight className="h-3 w-3 inline text-[#1A1A1A]/30" />
            </li>
            <li>
              <Link href="/shop" className="hover:text-[#1A1A1A] transition-colors">
                Boutique
              </Link>
            </li>
            <li>
              <ChevronRight className="h-3 w-3 inline text-[#1A1A1A]/30" />
            </li>
            <li className="text-[#1A1A1A] font-semibold">{category.name}</li>
          </ol>
        </nav>

        <CatalogGrid
          initialProducts={products}
          categories={allCategories}
          activeCategorySlug={slug}
          pageTitle={category.name}
          pageSubtitle={category.description}
          showCategoryFilters={false}
        />
      </Container>
    </div>
  )
}
