import { CollectionForm } from '@/components/admin/collection-form'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewCollectionPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/collections" className="text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Collection</h1>
          <p className="text-gray-500 mt-2">Create a new curated collection of products.</p>
        </div>
      </div>

      <CollectionForm />
    </div>
  )
}
