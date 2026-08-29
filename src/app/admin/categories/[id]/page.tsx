import { createClient } from '@/lib/supabase/server'
import { CategoryForm } from '@/components/admin/category-form'
import { CategoryFormValues } from '@/lib/validations/catalog'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  
  const { data: category, error } = await supabase.from('categories').select('*').eq('id', params.id).single()

  if (error || !category) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/categories" className="text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Category</h1>
          <p className="text-gray-500 mt-2">Manage settings for {category.name}.</p>
        </div>
      </div>

      <CategoryForm initialData={category as CategoryFormValues & { id: string }} />
    </div>
  )
}
