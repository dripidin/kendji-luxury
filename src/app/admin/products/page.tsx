import { createAdminClient } from '@/lib/supabase/admin'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { ProductsTableClient } from '@/components/admin/products-table-client'

export const dynamic = 'force-dynamic'

export default async function AdminProducts() {
  const supabase = createAdminClient()

  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, slug, sku, base_price, status, is_featured, created_at, categories(name, slug)')
    .order('created_at', { ascending: false })
    .limit(100)

  const rawProducts = (products || []) as any[]
  const publishedCount = rawProducts.filter(p => p.status === 'PUBLISHED').length
  const draftCount = rawProducts.filter(p => p.status === 'DRAFT').length
  const archivedCount = rawProducts.filter(p => p.status === 'ARCHIVED').length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Catalogue Produits <span className="text-gray-400 text-lg font-normal">| المنتجات</span>
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Gestion complète des créations de haute joaillerie KenDji Luxury.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant="outline" className="px-3 py-1 bg-white text-xs font-mono">
            {publishedCount} Publiés
          </Badge>
          {draftCount > 0 && (
            <Badge variant="outline" className="px-3 py-1 bg-amber-50 text-amber-700 border-amber-200 text-xs font-mono">
              {draftCount} Brouillons
            </Badge>
          )}
          {archivedCount > 0 && (
            <Badge variant="outline" className="px-3 py-1 bg-gray-100 text-gray-600 border-gray-200 text-xs font-mono">
              {archivedCount} Archivés
            </Badge>
          )}
          <Link href="/admin/products/new">
            <Button className="bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Produit
            </Button>
          </Link>
        </div>
      </div>

      {error ? (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-4">
          <p className="font-semibold">Erreur de connexion à la base de données</p>
          <p className="text-sm mt-1 text-amber-700">{error.message}</p>
        </div>
      ) : (
        <ProductsTableClient initialProducts={rawProducts} />
      )}
    </div>
  )
}
