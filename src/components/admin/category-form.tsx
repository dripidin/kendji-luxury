'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { categorySchema, CategoryFormValues } from '@/lib/validations/catalog'
import { createCategory, updateCategory } from '@/app/admin/actions/catalog'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface CategoryFormProps {
  initialData?: CategoryFormValues & { id: string }
}

export function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors }, getValues, setValue } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || '',
      slug: initialData?.slug || '',
      description: initialData?.description || '',
      is_active: initialData?.is_active ?? true,
      display_order: initialData?.display_order ?? 0
    }
  })

  // Auto-generate slug from name if empty
  const handleNameBlur = () => {
    const nameValue = getValues('name')
    const currentSlug = getValues('slug')
    if (!currentSlug && nameValue) {
      setValue('slug', nameValue.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))
    }
  }

  const onSubmit = async (data: CategoryFormValues) => {
    setIsPending(true)
    setError(null)
    
    let res
    if (initialData?.id) {
      res = await updateCategory(initialData.id, data)
    } else {
      res = await createCategory(data)
    }

    if (res?.error) {
      setError(res.error)
      setIsPending(false)
    } else {
      router.push('/admin/categories')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          {error}
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-w-2xl">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register('name')} onBlur={handleNameBlur} />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" {...register('slug')} />
            {errors.slug && <p className="text-red-500 text-sm">{errors.slug.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input id="description" {...register('description')} />
          </div>
          <div className="flex items-center space-x-2 pt-4">
            <input type="checkbox" id="is_active" {...register('is_active')} className="h-4 w-4 rounded border-gray-300" />
            <Label htmlFor="is_active">Active Category</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex space-x-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : (initialData ? 'Save Changes' : 'Create Category')}
        </Button>
        <Button variant="outline" type="button" onClick={() => router.push('/admin/categories')} disabled={isPending}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
