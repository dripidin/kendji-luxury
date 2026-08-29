'use client'

import { useState, useMemo } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { TableRowActions } from '@/components/admin/table-row-actions'
import { deleteOrArchiveCategory } from '@/app/admin/actions/catalog'
import { Search, Tag } from 'lucide-react'

interface CategoryItem {
  id: string
  name: string
  slug: string
  active: boolean
  description: string | null
  display_order: number
}

export function CategoriesTableClient({ initialCategories }: { initialCategories: CategoryItem[] }) {
  const [searchTerm, setSearchTerm] = useState('')

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return initialCategories
    const q = searchTerm.toLowerCase()
    return initialCategories.filter(
      c => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
    )
  }, [initialCategories, searchTerm])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 max-w-sm">
        <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
        <Input
          placeholder="Rechercher une catégorie…"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="h-9 bg-white"
        />
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/80">
            <TableRow>
              <TableHead className="font-semibold text-xs uppercase tracking-wider w-12">#</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Nom</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Slug</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Description</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Statut</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100">
            {filtered.length > 0 ? (
              filtered.map(cat => (
                <TableRow key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell className="text-gray-400 text-sm font-mono">{cat.display_order}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Tag className="h-3.5 w-3.5 text-gray-400" />
                      <span className="font-medium text-gray-900">{cat.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-gray-500">{cat.slug}</TableCell>
                  <TableCell className="text-xs text-gray-500 max-w-xs truncate">
                    {cat.description || <span className="italic text-gray-300">—</span>}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        cat.active
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-gray-100 text-gray-500 border-gray-200'
                      }`}
                    >
                      {cat.active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <TableRowActions
                      resourceName="Catégorie"
                      itemName={cat.name}
                      editUrl={`/admin/categories/${cat.id}`}
                      viewUrl={`/category/${cat.slug}`}
                      isArchived={!cat.active}
                      onArchive={async () => {
                        return deleteOrArchiveCategory(cat.id, cat.active)
                      }}
                      onDelete={async () => {
                        return deleteOrArchiveCategory(cat.id, false)
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-gray-400">
                  <Tag className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p>Aucune catégorie trouvée.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
