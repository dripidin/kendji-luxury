import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminCollections() {
  const supabase = await createClient()
  
  let collections: { id: string, name: string, slug: string, is_active: boolean }[] | null = null
  let error = null
  try {
    const res = await supabase.from('collections').select('id, name, slug, is_active').order('name')
    collections = res.data
    error = res.error
  } catch (err) {
    error = err
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
          <p className="text-gray-500 mt-2">Manage curated product groupings (e.g. Signature Motifs).</p>
        </div>
        <Link href="/admin/collections/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Collection
          </Button>
        </Link>
      </div>

      {error ? (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-4">
          <p className="font-semibold">Database Connection Unavailable</p>
          <p className="text-sm mt-1">Cannot load collections at this time.</p>
        </div>
      ) : (
        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {collections && collections.length > 0 ? (
                collections.map((col: { id: string, name: string, slug: string, is_active: boolean }) => (
                  <TableRow key={col.id}>
                    <TableCell className="font-medium">{col.name}</TableCell>
                    <TableCell className="text-muted-foreground">{col.slug}</TableCell>
                    <TableCell>{col.is_active ? 'Active' : 'Inactive'}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/collections/${col.id}`}>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    No collections found.
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
