'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { TableRowActions } from '@/components/admin/table-row-actions'
import { deleteOrArchiveProduct, updateProduct } from '@/app/admin/actions/catalog'
import { Search, Package } from 'lucide-react'

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
  const [searchTerm, setSearchTerm] = useState('')

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return initialProducts
    const q = searchTerm.toLowerCase()
    return initialProducts.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.categories && p.categories.name.toLowerCase().includes(q))
    )
  }, [initialProducts, searchTerm])

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
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Mis en avant</TableHead>
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
                    <TableCell>
                      {product.is_featured ? (
                        <span className="text-amber-500 text-sm font-bold">★</span>
                      ) : (
                        <span className="text-gray-300 text-sm">—</span>
                      )}
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
