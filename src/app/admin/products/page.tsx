import { createAdminClient } from '@/lib/supabase/admin'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Search, Package } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface Product {
  id: string
  name: string
  slug: string
  sku: string | null
  base_price: number
  status: string
  is_featured: boolean
  created_at: string
  categories: { name: string; slug: string } | null
}

const STATUS_LABELS: Record<string, { label: string; classes: string }> = {
  PUBLISHED:  { label: 'Publié',   classes: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  DRAFT:      { label: 'Brouillon', classes: 'bg-amber-50 text-amber-700 border-amber-200' },
  ARCHIVED:   { label: 'Archivé', classes: 'bg-gray-100 text-gray-500 border-gray-200' },
}

export default async function AdminProducts() {
  const supabase = createAdminClient()

  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, slug, sku, base_price, status, is_featured, created_at, categories(name, slug)')
    .order('created_at', { ascending: false })
    .limit(100)

  const publishedCount = products?.filter(p => p.status === 'PUBLISHED').length ?? 0
  const draftCount = products?.filter(p => p.status === 'DRAFT').length ?? 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Produits</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Gérez votre catalogue de bijoux KenDji Luxury.
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
          <Link href="/admin/products/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter
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
        <div className="space-y-4">
          <div className="flex items-center gap-2 max-w-sm">
            <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <Input placeholder="Rechercher un produit…" className="h-9 bg-white" />
          </div>

          <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50/80">
                <TableRow>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider">Produit</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider">Catégorie</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider">SKU</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider">Prix (DZD)</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider">Statut</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider">Mis en avant</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100">
                {products && products.length > 0 ? (
                  (products as unknown as Product[]).map((product) => {
                    const statusCfg = STATUS_LABELS[product.status] || { label: product.status, classes: 'bg-gray-100 text-gray-500 border-gray-200' }
                    return (
                      <TableRow key={product.id} className="hover:bg-gray-50/50 transition-colors">
                        <TableCell>
                          <div className="font-medium text-gray-900 text-sm max-w-xs truncate">{product.name}</div>
                          <div className="text-[11px] text-gray-400 font-mono">{product.slug}</div>
                        </TableCell>
                        <TableCell className="text-xs text-gray-600">
                          {(product.categories as { name: string } | null)?.name || <span className="italic text-gray-300">—</span>}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-gray-500">{product.sku || '—'}</TableCell>
                        <TableCell className="font-mono font-bold text-sm text-gray-900">
                          {Number(product.base_price).toLocaleString('fr-FR')} DA
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusCfg.classes}`}>
                            {statusCfg.label}
                          </span>
                        </TableCell>
                        <TableCell>
                          {product.is_featured ? (
                            <span className="text-amber-500 text-sm font-bold">★</span>
                          ) : (
                            <span className="text-gray-300 text-sm">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/admin/products/${product.id}`}>
                            <Button variant="ghost" size="sm" className="text-xs">Modifier</Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-gray-400">
                      <Package className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      <p>Aucun produit trouvé.</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}
