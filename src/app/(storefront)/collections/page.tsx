import { Metadata } from 'next'
import { fetchStorefrontCollections } from '@/lib/storefront-catalog'
import { CollectionsView } from '@/components/storefront/catalog/collections-view'

export const metadata: Metadata = {
  title: 'Les Mondes & Collections | KenDji Luxury',
  description:
    'Explorez les univers joailliers KenDji Luxury : Signature Motifs, Romantic Nature, Urban & Iconic, et Personalized & Cultural. Haute joaillerie en Algérie.',
  alternates: {
    canonical: 'https://kendji-luxury.dz/collections'
  },
  openGraph: {
    title: 'Les Collections Joaillières | KenDji Luxury Alger',
    description:
      'Immergez-vous dans nos mondes esthétiques exclusifs, forgés dans la délicatesse et l’éclat intemporel.',
    url: 'https://kendji-luxury.dz/collections',
    images: [{ url: '/backgrounds/kj-bg-02.jpg', width: 1200, height: 800, alt: 'KenDji Collections' }]
  }
}

export default async function CollectionsPage() {
  const collections = await fetchStorefrontCollections()

  return <CollectionsView collections={collections} />
}
