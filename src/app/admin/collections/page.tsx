import { createAdminClient } from '@/lib/supabase/admin'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Layers } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface Collection {
  id: string
  name: string
  slug: string
  active: boolean
  description: string | null
  display_order: number
}

export default async function AdminCollections() {
  const supabase = createAdminClient()

  const { data: collections, error } = await supabase
    .from('collections')
    .select('id, name, slug, active, description, display_order')
    .order('display_order', { ascending: true })

  const activeCount = collections?.filter(c => c.active).length ?? 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Collections</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Gérez les collections thématiques affichées sur la boutique.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-1 bg-white text-xs font-mono">
            {activeCount} Actives
          </Badge>
          <Link href="/admin/collections/new">
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
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50/80">
              <TableRow>
                <TableHead className="font-semibold text-xs uppercase tracking-wider w-8">#</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Nom</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Slug</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Description</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Statut</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100">
              {collections && collections.length > 0 ? (
                (collections as Collection[]).map((col) => (
                  <TableRow key={col.id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell className="text-gray-400 text-sm">{col.display_order}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Layers className="h-3.5 w-3.5 text-gray-400" />
                        <span className="font-medium text-gray-900">{col.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-gray-500">{col.slug}</TableCell>
                    <TableCell className="text-xs text-gray-500 max-w-xs truncate">
                      {col.description || <span className="italic text-gray-300">—</span>}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        col.active
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-gray-100 text-gray-500 border-gray-200'
                      }`}>
                        {col.active ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/collections/${col.id}`}>
                        <Button variant="ghost" size="sm" className="text-xs">Modifier</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-gray-400">
                    <Layers className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p>Aucune collection trouvée.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
