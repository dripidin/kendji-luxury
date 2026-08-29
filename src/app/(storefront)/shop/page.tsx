import { Metadata } from 'next'
import { Container } from '@/components/storefront/layout/container'
import { CatalogGrid } from '@/components/storefront/catalog/catalog-grid'
import { fetchStorefrontProducts, fetchStorefrontCategories } from '@/lib/storefront-catalog'

export const metadata: Metadata = {
  title: 'Boutique & Toutes les Créations | KenDji Luxury',
  description:
    'Explorez l’ensemble des créations joaillières d’exception KenDji Luxury : parures raffinées, colliers sertis, bracelets et bagues. Paiement à la livraison 58 Wilayas.',
  alternates: {
    canonical: 'https://kendji-luxury.dz/shop'
  },
  openGraph: {
    title: 'Toutes les Créations | KenDji Luxury Alger',
    description:
      'Haute joaillerie intemporelle en Algérie. Découvrez nos 25 créations signatures livrées à domicile.',
    url: 'https://kendji-luxury.dz/shop',
    images: [{ url: '/products/product-1/1.jpg', width: 800, height: 1000, alt: 'KenDji Luxury Shop' }]
  }
}

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    fetchStorefrontProducts(),
    fetchStorefrontCategories()
  ])

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      <Container className="py-12 md:py-16">
        <CatalogGrid
          initialProducts={products}
          categories={categories}
          pageTitle="Toutes les Créations"
          pageSubtitle="L’expression ultime du raffinement : explorez notre collection joaillière complète, forgée dans l’élégance et l’éclat."
          showCategoryFilters={true}
        />
      </Container>
    </div>
  )
}
