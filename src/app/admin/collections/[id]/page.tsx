import { createClient } from '@/lib/supabase/server'
import { CollectionForm } from '@/components/admin/collection-form'
import { CollectionFormValues } from '@/lib/validations/catalog'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function EditCollectionPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  
  const { data: collection, error } = await supabase.from('collections').select('*').eq('id', params.id).single()

  if (error || !collection) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/collections" className="text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Collection</h1>
          <p className="text-gray-500 mt-2">Manage settings for {collection.name}.</p>
        </div>
      </div>

      <CollectionForm initialData={collection as CollectionFormValues & { id: string }} />
    </div>
  )
}
