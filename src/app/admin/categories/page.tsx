import { createAdminClient } from '@/lib/supabase/admin'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { CategoriesTableClient } from '@/components/admin/categories-table-client'

export const dynamic = 'force-dynamic'

export default async function AdminCategories() {
  const supabase = createAdminClient()

  const { data: categories, error } = await supabase
    .from('categories')
    .select('id, name, slug, active, description, display_order')
    .order('display_order', { ascending: true })

  const rawCategories = (categories || []) as any[]
  const activeCount = rawCategories.filter(c => c.active).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Catégories <span className="text-gray-400 text-lg font-normal">| التصنيفات</span>
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Gérez les catégories de joaillerie visibles sur la boutique.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-1 bg-white text-xs font-mono">
            {activeCount} Actives
          </Badge>
          <Link href="/admin/categories/new">
            <Button className="bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Catégorie
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
        <CategoriesTableClient initialCategories={rawCategories} />
      )}
    </div>
  )
}
