import { createAdminClient } from '@/lib/supabase/admin'
import {
  Product,
  Category,
  Collection,
  getAllProducts,
  getCategories,
  getCategoryBySlug,
  getCollections,
  getProductsByCollection
} from '@/lib/catalog'

export interface StorefrontProduct extends Product {
  dbId?: string
}

export interface StorefrontCollection extends Collection {
  productCount: number
}

export type ProductSortOption = 'default' | 'price_asc' | 'price_desc'

/**
 * Fetch all published storefront products, optionally filtered by category/collection and sorted.
 */
export async function fetchStorefrontProducts(options?: {
  categorySlug?: string
  collectionSlug?: string
  sort?: ProductSortOption
}): Promise<StorefrontProduct[]> {
  const { categorySlug, collectionSlug, sort = 'default' } = options || {}

  try {
    const supabase = createAdminClient()

    let query = supabase
      .from('products')
      .select('*, categories!inner(id, name, slug), product_media(*), variants(*), product_collections(collections(id, name, slug))')
      .eq('status', 'PUBLISHED')

    if (categorySlug) {
      query = query.eq('categories.slug', categorySlug)
    }

    const { data, error } = await query

    if (!error && data && data.length > 0) {
      let mapped: StorefrontProduct[] = data.map(item => {
        const sortedMedia = (item.product_media || []).sort(
          (a: { display_order: number; role: string }, b: { display_order: number; role: string }) => {
            if (a.role === 'COVER') return -1
            if (b.role === 'COVER') return 1
            return (a.display_order || 0) - (b.display_order || 0)
          }
        )

        const coverImage =
          sortedMedia.find((m: { role: string }) => m.role === 'COVER')?.url ||
          sortedMedia[0]?.url ||
          '/products/product-1/1.jpg'

        const images = sortedMedia.map((m: { url: string }) => m.url)

        const linkedCollections = (item.product_collections || [])
          .map((pc: { collections?: { name: string; slug: string } }) => pc.collections)
          .filter(Boolean)

        const collectionName = linkedCollections[0]?.name || item.metadata?.collection || 'Signature Motifs'
        const itemCollectionSlug = linkedCollections[0]?.slug || item.metadata?.collectionSlug || 'signature-motifs'

        return {
          id: item.sku || item.id,
          dbId: item.id,
          slug: item.slug,
          folderSlug: item.slug,
          name: item.name,
          category: item.categories?.name || 'Joaillerie',
          categorySlug: item.categories?.slug || 'sets',
          collection: collectionName,
          collectionSlug: itemCollectionSlug,
          price: Number(item.base_price),
          currency: item.currency || 'DZD',
          images: images.length > 0 ? images : [coverImage],
          coverImage,
          description: item.description || item.short_description || '',
          metallicFinish: item.metadata?.metallicFinish,
          stonesOrInserts: item.metadata?.stonesOrInserts,
          designCharacteristics: item.metadata?.designCharacteristics,
          piecesIncluded: item.metadata?.piecesIncluded,
          isFeatured: item.is_featured || false,
          variants: (item.variants || []).map((v: { id: string; label: string }) => ({
            id: v.id,
            name: v.label
          }))
        }
      })

      if (collectionSlug) {
        mapped = mapped.filter(p => p.collectionSlug === collectionSlug)
      }

      return applySorting(mapped, sort)
    }
  } catch (e) {
    console.warn('Supabase storefront query fallback to static catalog:', e)
  }

  // Fallback to static catalog projection
  let products = getAllProducts()

  if (categorySlug) {
    products = products.filter(p => p.categorySlug === categorySlug)
  }

  if (collectionSlug) {
    products = products.filter(p => p.collectionSlug === collectionSlug)
  }

  return applySorting(products, sort)
}

/**
 * Fetch all active categories from Supabase (or fallback to static categories).
 */
export async function fetchStorefrontCategories(): Promise<Category[]> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('categories')
      .select('name, slug, description')
      .eq('active', true)
      .order('display_order', { ascending: true })

    if (!error && data && data.length > 0) {
      return data.map(c => ({
        name: c.name,
        slug: c.slug,
        description: c.description || ''
      }))
    }
  } catch (e) {
    console.warn('Supabase category query fallback to static:', e)
  }

  return getCategories()
}

/**
 * Fetch category by slug with full metadata.
 */
export async function fetchStorefrontCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('categories')
      .select('name, slug, description')
      .eq('slug', slug)
      .eq('active', true)
      .maybeSingle()

    if (!error && data) {
      return {
        name: data.name,
        slug: data.slug,
        description: data.description || ''
      }
    }
  } catch (e) {
    console.warn('Supabase category slug fallback to static:', e)
  }

  const fallback = getCategoryBySlug(slug)
  return fallback || null
}

/**
 * Fetch all active collections with live product counts.
 */
export async function fetchStorefrontCollections(): Promise<StorefrontCollection[]> {
  const staticCollections = getCollections()
  const allProducts = await fetchStorefrontProducts()

  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('collections')
      .select('name, slug, description')
      .eq('active', true)
      .order('display_order', { ascending: true })

    if (!error && data && data.length > 0) {
      return data.map(col => {
        const staticMatch = staticCollections.find(sc => sc.slug === col.slug)
        const productCount = allProducts.filter(p => p.collectionSlug === col.slug).length
        const fallbackAccent = allProducts.find(p => p.collectionSlug === col.slug)?.coverImage || '/products/product-1/1.jpg'

        return {
          slug: col.slug,
          name: col.name,
          tagline: staticMatch?.tagline || 'L’élégance réinventée',
          description: col.description || staticMatch?.description || '',
          coverImage: staticMatch?.coverImage || fallbackAccent,
          accentProductSlug: staticMatch?.accentProductSlug || '',
          productCount
        }
      })
    }
  } catch (e) {
    console.warn('Supabase collection query fallback to static:', e)
  }

  return staticCollections.map(col => ({
    ...col,
    productCount: getProductsByCollection(col.slug).length
  }))
}

/**
 * Fetch a single collection by slug with live product count.
 */
export async function fetchStorefrontCollectionBySlug(slug: string): Promise<StorefrontCollection | null> {
  const collections = await fetchStorefrontCollections()
  const found = collections.find(c => c.slug === slug)
  return found || null
}

function applySorting(products: StorefrontProduct[], sort: ProductSortOption): StorefrontProduct[] {
  const list = [...products]
  if (sort === 'price_asc') {
    return list.sort((a, b) => a.price - b.price)
  }
  if (sort === 'price_desc') {
    return list.sort((a, b) => b.price - a.price)
  }
  return list
}
