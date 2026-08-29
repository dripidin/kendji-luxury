import { createClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/admin/product-form'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { PRODUCTS } from '@/lib/catalog'

export default async function NewProductPage() {
  const supabase = await createClient()

  // Fetch active categories & collections
  const [categoriesRes, collectionsRes] = await Promise.all([
    supabase.from('categories').select('id, name').eq('active', true).order('name'),
    supabase.from('collections').select('id, name').eq('active', true).order('name')
  ])

  // Extract list of approved store media paths
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
          <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
          <p className="text-muted-foreground mt-1">
            Create a new fine jewelry piece in the KenDji Luxury catalog.
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
