import { createClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/admin/product-form'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PRODUCTS } from '@/lib/catalog'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [categoriesRes, collectionsRes, productRes] = await Promise.all([
    supabase.from('categories').select('id, name').order('name'),
    supabase.from('collections').select('id, name').order('name'),
    supabase
      .from('products')
      .select('*, product_media(*), variants(*), product_collections(collection_id)')
      .eq('id', id)
      .single()
  ])

  if (productRes.error || !productRes.data) {
    notFound()
  }

  const pData = productRes.data

  // Format initialData for form
  const initialData = {
    id: pData.id,
    name: pData.name,
    slug: pData.slug,
    sku: pData.sku || '',
    base_price: Number(pData.base_price),
    currency: pData.currency || 'DZD',
    status: pData.status,
    category_id: pData.category_id,
    collection_ids: (pData.product_collections || []).map((pc: { collection_id: string }) => pc.collection_id),
    short_description: pData.short_description || '',
    description: pData.description || '',
    story: pData.story || '',
    is_featured: pData.is_featured || false,
    media: (pData.product_media || []).map((m: { url: string; role: string; display_order: number }) => ({
      url: m.url,
      role: (m.role as 'COVER' | 'GALLERY' | 'DETAIL' | 'VARIANT' | 'LIFESTYLE') || 'GALLERY',
      display_order: m.display_order
    })),
    variants: (pData.variants || []).map((v: { label: string; sku: string; price_override: number; stock: number; is_available: boolean }) => ({
      label: v.label,
      sku: v.sku || '',
      price_override: v.price_override ? Number(v.price_override) : undefined,
      stock: v.stock || 10,
      is_available: v.is_available ?? true
    })),
    metadata: pData.metadata || {}
  }

  const approvedMediaLibrary = Array.from(
    new Set(PRODUCTS.flatMap(p => [p.coverImage, ...p.images]).filter(Boolean))
  )

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-muted"
        >
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
          <p className="text-muted-foreground mt-1">
            Manage settings, imagery, and variants for {pData.name}.
          </p>
        </div>
      </div>

      <ProductForm
        categories={categoriesRes.data || []}
        collections={collectionsRes.data || []}
        initialData={initialData}
        approvedMediaLibrary={approvedMediaLibrary}
      />
    </div>
  )
}
