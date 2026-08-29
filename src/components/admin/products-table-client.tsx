'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { TableRowActions } from '@/components/admin/table-row-actions'
import { deleteOrArchiveProduct, toggleProductFeaturedAction } from '@/app/admin/actions/catalog'
import { Search, Package, Star, Loader2 } from 'lucide-react'

interface ProductItem {
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
  PUBLISHED: { label: 'Publié', classes: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  DRAFT: { label: 'Brouillon', classes: 'bg-amber-50 text-amber-700 border-amber-200' },
  ARCHIVED: { label: 'Archivé', classes: 'bg-gray-100 text-gray-500 border-gray-200' }
}

export function ProductsTableClient({ initialProducts }: { initialProducts: ProductItem[] }) {
  const router = useRouter()
  const [featuredOverrides, setFeaturedOverrides] = useState<Record<string, boolean>>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const handleToggleFeatured = async (product: ProductItem) => {
    const isCurrentlyFeatured = product.id in featuredOverrides ? featuredOverrides[product.id] : product.is_featured
    const nextVal = !isCurrentlyFeatured
    setTogglingId(product.id)

    // Optimistic update
    setFeaturedOverrides(prev => ({ ...prev, [product.id]: nextVal }))

    const res = await toggleProductFeaturedAction(product.id, nextVal)
    setTogglingId(null)

    if (!res.success) {
      // Rollback
      setFeaturedOverrides(prev => ({ ...prev, [product.id]: isCurrentlyFeatured }))
    } else {
      router.refresh()
    }
  }

  const productsList = useMemo(() => {
    return initialProducts.map(p => ({
      ...p,
      is_featured: p.id in featuredOverrides ? featuredOverrides[p.id] : p.is_featured
    }))
  }, [initialProducts, featuredOverrides])

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return productsList
    const q = searchTerm.toLowerCase()
    return productsList.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.categories && p.categories.name.toLowerCase().includes(q))
    )
  }, [productsList, searchTerm])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 max-w-sm">
        <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
        <Input
          placeholder="Rechercher par nom, SKU, catégorie…"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="h-9 bg-white"
        />
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
              <TableHead className="font-semibold text-xs uppercase tracking-wider text-center">Accueil Vedette</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100">
            {filtered.length > 0 ? (
              filtered.map(product => {
                const statusCfg = STATUS_LABELS[product.status] || {
                  label: product.status,
                  classes: 'bg-gray-100 text-gray-500 border-gray-200'
                }
                const isArchived = product.status === 'ARCHIVED'
                const isToggling = togglingId === product.id

                return (
                  <TableRow key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell>
                      <div className="font-medium text-gray-900 text-sm max-w-xs truncate">{product.name}</div>
                      <div className="text-[11px] text-gray-400 font-mono">{product.slug}</div>
                    </TableCell>
                    <TableCell className="text-xs text-gray-600">
                      {product.categories?.name || <span className="italic text-gray-300">—</span>}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-gray-500">{product.sku || '—'}</TableCell>
                    <TableCell className="font-mono font-bold text-sm text-gray-900">
                      {Number(product.base_price).toLocaleString('fr-FR')} DA
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusCfg.classes}`}
                      >
                        {statusCfg.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(product)}
                        disabled={isToggling || isArchived}
                        title={product.is_featured ? "Retirer de la page d'accueil" : "Mettre en avant sur la page d'accueil"}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                          product.is_featured
                            ? 'bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 shadow-xs'
                            : 'bg-gray-50 text-gray-400 border border-gray-200 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {isToggling ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Star
                            className={`h-3.5 w-3.5 ${
                              product.is_featured ? 'fill-amber-400 text-amber-500' : 'text-gray-300'
                            }`}
                          />
                        )}
                        <span>{product.is_featured ? 'Vedette' : 'Non'}</span>
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <TableRowActions
                        resourceName="Produit"
                        itemName={product.name}
                        editUrl={`/admin/products/${product.id}`}
                        viewUrl={`/product/${product.slug}`}
                        isArchived={isArchived}
                        onArchive={async () => {
                          return deleteOrArchiveProduct(product.id, !isArchived)
                        }}
                        onDelete={async () => {
                          return deleteOrArchiveProduct(product.id, false)
                        }}
                      />
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-gray-400">
                  <Package className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p>Aucun bijou trouvé.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
