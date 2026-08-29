import { createAdminClient } from '@/lib/supabase/admin'

export interface HeroSectionContent {
  headline: string
  subheadline: string
  primary_cta_label: string
  primary_cta_url: string
  background_media: string
  featured_product_slug?: string
}

export interface FeaturedCollectionContent {
  collection_slug: string
  title_override?: string
  description_override?: string
}

export interface FeaturedProductsContent {
  product_slugs: string[]
}

export interface StorySectionContent {
  title: string
  body: string
  media_url: string
}

export interface EditorialSectionContent {
  title: string
  body: string
  media_url: string
}

export interface TrustItem {
  title: string
  description: string
  icon?: string
}

export interface TrustSectionContent {
  title: string
  items: TrustItem[]
}

export interface FinalCtaSectionContent {
  title: string
  description: string
  cta_label: string
  cta_url: string
  background_media: string
}

export interface HomepageContent {
  hero: HeroSectionContent
  featured_collection: FeaturedCollectionContent
  featured_products: FeaturedProductsContent
  brand_story: StorySectionContent
  editorial_moment: EditorialSectionContent
  trust_section: TrustSectionContent
  final_cta: FinalCtaSectionContent
}

export const DEFAULT_HOMEPAGE_CONTENT: HomepageContent = {
  hero: {
    headline: "L'Éclat Intemporel de la Haute Joaillerie",
    subheadline: "Découvrez notre collection exclusive de parures et créations d'exception en Algérie. Une alliance parfaite entre tradition joaillière et modernité monochrome.",
    primary_cta_label: "Explorer la Collection",
    primary_cta_url: "/shop",
    background_media: "/backgrounds/kj-bg-01.jpg",
    featured_product_slug: "quatrefoil-clover-4-piece-jewelry-set"
  },
  featured_collection: {
    collection_slug: "signature-motifs",
    title_override: "Signature Motifs",
    description_override: "L'élégance géométrique et intemporelle des trèfles à quatre feuilles sertis de nacre naturelle."
  },
  featured_products: {
    product_slugs: [
      "quatrefoil-clover-4-piece-jewelry-set",
      "floral-enamel-bracelet-and-ring-set",
      "rose-pendant-necklace-with-gemstone-accents",
      "mesh-cuff-bracelet-with-pave-station"
    ]
  },
  brand_story: {
    title: "L'Héritage KenDji Luxury",
    body: "KenDji incarne l'excellence de la joaillerie moderne à Alger. Chaque création est pensée comme une œuvre d'art portable, façonnée dans des métaux nobles et ornée de pierres éclatantes pour sublimer chaque instant précieux.",
    media_url: "/backgrounds/kj-bg-02.jpg"
  },
  editorial_moment: {
    title: "Un Souffle de Raffinement",
    body: "Des lignes pures, des contrastes saisissants et une attention méticuleuse portée à chaque détail joaillier.",
    media_url: "/backgrounds/kj-bg-03.jpg"
  },
  trust_section: {
    title: "Nos Engagements d'Excellence",
    items: [
      {
        title: "Paiement à la Livraison",
        description: "Réglez votre commande en toute sérénité à la réception du colis.",
        icon: "ShieldCheck"
      },
      {
        title: "Livraison 58 Wilayas",
        description: "Expédition sécurisée et soignée dans toute l'Algérie sous 24 à 72h.",
        icon: "Truck"
      },
      {
        title: "Écrin & Certificat Luxe",
        description: "Chaque bijou est livré dans un écrin velours signature avec certificat d'authenticité.",
        icon: "Gem"
      }
    ]
  },
  final_cta: {
    title: "Sublimez Votre Allure Aujourd'hui",
    description: "Rejoignez l'univers privilégié de KenDji et recevez votre pièce signature en Algérie.",
    cta_label: "Commander Votre Parure",
    cta_url: "/shop",
    background_media: "/backgrounds/kj-bg-05.jpg"
  }
}

/**
 * Get homepage content from site_settings or fallback to default
 */
export async function getHomepageContent(): Promise<HomepageContent> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('homepage_content')
      .eq('id', 1)
      .maybeSingle()

    if (!error && data?.homepage_content && Object.keys(data.homepage_content).length > 0) {
      return {
        ...DEFAULT_HOMEPAGE_CONTENT,
        ...data.homepage_content,
        hero: { ...DEFAULT_HOMEPAGE_CONTENT.hero, ...data.homepage_content.hero },
        featured_collection: { ...DEFAULT_HOMEPAGE_CONTENT.featured_collection, ...data.homepage_content.featured_collection },
        featured_products: { ...DEFAULT_HOMEPAGE_CONTENT.featured_products, ...data.homepage_content.featured_products },
        brand_story: { ...DEFAULT_HOMEPAGE_CONTENT.brand_story, ...data.homepage_content.brand_story },
        editorial_moment: { ...DEFAULT_HOMEPAGE_CONTENT.editorial_moment, ...data.homepage_content.editorial_moment },
        trust_section: { ...DEFAULT_HOMEPAGE_CONTENT.trust_section, ...data.homepage_content.trust_section },
        final_cta: { ...DEFAULT_HOMEPAGE_CONTENT.final_cta, ...data.homepage_content.final_cta }
      }
    }
  } catch (e) {
    console.warn('Failed to load homepage content from DB, using fallback:', e)
  }

  return DEFAULT_HOMEPAGE_CONTENT
}
