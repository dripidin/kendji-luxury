import { createAdminClient } from '@/lib/supabase/admin'
import { ProductForm } from '@/components/admin/product-form'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { PRODUCTS } from '@/lib/catalog'

export const dynamic = 'force-dynamic'

export default async function NewProductPage() {
  const supabase = createAdminClient()

  const [categoriesRes, collectionsRes] = await Promise.all([
    supabase.from('categories').select('id, name').order('name'),
    supabase.from('collections').select('id, name').order('name')
  ])

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
          <h1 className="text-3xl font-bold tracking-tight">Create Product</h1>
          <p className="text-muted-foreground mt-1">
            Add a new high-jewelry piece to the KenDji catalog.
          </p>
        </div>
      </div>

      <ProductForm
        categories={categoriesRes.data || []}
        collections={collectionsRes.data || []}
        approvedMediaLibrary={approvedMediaLibrary}
      />
    </div>
  )
}
