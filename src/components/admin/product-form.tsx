'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  productSchema,
  ProductFormValues,
  ProductMediaItem
} from '@/lib/validations/catalog'
import { createProduct, updateProduct, uploadMediaFile } from '@/app/admin/actions/catalog'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Star,
  Sparkles,
  Layers,
  Sparkle
} from 'lucide-react'
import Image from 'next/image'

interface CategoryOption {
  id: string
  name: string
}

interface CollectionOption {
  id: string
  name: string
}

interface ProductFormProps {
  initialData?: Partial<ProductFormValues> & { id: string }
  categories: CategoryOption[]
  collections: CollectionOption[]
  approvedMediaLibrary?: string[]
}

export function ProductForm({
  initialData,
  categories,
  collections,
  approvedMediaLibrary = []
}: ProductFormProps) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [showMediaPicker, setShowMediaPicker] = useState(false)
  const [activeTab, setActiveTab] = useState<'general' | 'media' | 'variants' | 'specifications' | 'seo'>('general')

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || '',
      slug: initialData?.slug || '',
      sku: initialData?.sku || '',
      base_price: initialData?.base_price ?? 0,
      currency: initialData?.currency || 'DZD',
      status: initialData?.status || 'DRAFT',
      category_id: initialData?.category_id || (categories.length > 0 ? categories[0].id : ''),
      collection_ids: initialData?.collection_ids || [],
      short_description: initialData?.short_description || '',
      description: initialData?.description || '',
      story: initialData?.story || '',
      is_featured: initialData?.is_featured || false,
      media: initialData?.media || [],
      variants: initialData?.variants || [],
      metadata: {
        metallicFinish: initialData?.metadata?.metallicFinish || '',
        stonesOrInserts: initialData?.metadata?.stonesOrInserts || '',
        color: initialData?.metadata?.color || '',
        piecesIncluded: initialData?.metadata?.piecesIncluded || '1 Pièce',
        dimensions: initialData?.metadata?.dimensions || '',
        size: initialData?.metadata?.size || '',
        chainLength: initialData?.metadata?.chainLength || '',
        care: initialData?.metadata?.care || 'Éviter le contact avec les parfums et l’eau pour préserver l’éclat.',
        benefits: initialData?.metadata?.benefits || 'Finition haute joaillerie, éclat durable, packaging signature KenDji inclus.',
        seo_title: initialData?.metadata?.seo_title || '',
        seo_description: initialData?.metadata?.seo_description || ''
      }
    }
  })

  // Dynamic Media Array
  const {
    fields: mediaFields,
    append: appendMedia,
    remove: removeMedia
  } = useFieldArray({
    control,
    name: 'media'
  })

  // Dynamic Variant Array
  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant
  } = useFieldArray({
    control,
    name: 'variants'
  })

  const watchedMedia = useWatch({ control, name: 'media' }) || []
  const watchedCollectionIds = useWatch({ control, name: 'collection_ids' }) || []

  // Auto-generate slug from name
  const handleNameBlur = () => {
    const nameValue = getValues('name')
    const currentSlug = getValues('slug')
    if (!currentSlug && nameValue) {
      const generated = nameValue
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
      setValue('slug', generated)
    }
  }

  // Handle Direct Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    const res = await uploadMediaFile(formData)
    setIsUploading(false)

    if (res.error) {
      setError(res.error)
    } else if (res.url) {
      const isFirst = mediaFields.length === 0
      appendMedia({
        url: res.url,
        role: isFirst ? 'COVER' : 'GALLERY',
        display_order: mediaFields.length
      })
    }
    // reset input
    e.target.value = ''
  }

  // Handle setting cover role
  const setCoverImage = (index: number) => {
    const currentMedia = getValues('media') || []
    const updated = currentMedia.map((m, idx) => ({
      ...m,
      role: (idx === index ? 'COVER' : m.role === 'COVER' ? 'GALLERY' : m.role) as ProductMediaItem['role']
    }))
    setValue('media', updated)
  }

  // Handle toggle collection
  const toggleCollection = (colId: string) => {
    const current = getValues('collection_ids') || []
    if (current.includes(colId)) {
      setValue('collection_ids', current.filter(id => id !== colId))
    } else {
      setValue('collection_ids', [...current, colId])
    }
  }

  const onSubmit = async (data: ProductFormValues) => {
    setIsPending(true)
    setError(null)
    setSuccess(null)

    try {
      let res
      if (initialData?.id) {
        res = await updateProduct(initialData.id, data)
      } else {
        res = await createProduct(data)
      }

      setIsPending(false)

      if (res?.error) {
        setError(res.error)
      } else if (res?.success) {
        setSuccess(initialData?.id ? 'Modifications enregistrées avec succès !' : 'Produit créé et publié avec succès !')
        router.refresh()
        if (!initialData?.id && res.productId) {
          setTimeout(() => {
            router.push(`/admin/products/${res.productId}`)
          }, 800)
        }
      }
    } catch (err: unknown) {
      setIsPending(false)
      const msg = err instanceof Error ? err.message : 'Une erreur inattendue est survenue lors de l\'enregistrement.'
      setError(msg)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Notifications */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm font-medium">{success}</p>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex border-b border-border space-x-2 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'general'
              ? 'bg-foreground text-background font-semibold'
              : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          1. General & Identity
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('media')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
            activeTab === 'media'
              ? 'bg-foreground text-background font-semibold'
              : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          2. Media & Gallery
          {watchedMedia.length > 0 && (
            <span className="bg-primary/20 text-xs px-1.5 py-0.5 rounded-full">
              {watchedMedia.length}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('variants')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
            activeTab === 'variants'
              ? 'bg-foreground text-background font-semibold'
              : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          3. Variants
          {variantFields.length > 0 && (
            <span className="bg-primary/20 text-xs px-1.5 py-0.5 rounded-full">
              {variantFields.length}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('specifications')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'specifications'
              ? 'bg-foreground text-background font-semibold'
              : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          4. Luxury Specifications
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('seo')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'seo'
              ? 'bg-foreground text-background font-semibold'
              : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          5. SEO & Copy
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: GENERAL & IDENTITY */}
      {/* ========================================================================= */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Identification</CardTitle>
                <CardDescription>Essential product title and URL slug identifiers.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Parure Collier & Bracelet Floral"
                    {...register('name')}
                    onBlur={handleNameBlur}
                  />
                  {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug *</Label>
                    <Input
                      id="slug"
                      placeholder="parure-collier-bracelet-floral"
                      {...register('slug')}
                    />
                    {errors.slug && <p className="text-red-500 text-xs">{errors.slug.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU Reference</Label>
                    <Input
                      id="sku"
                      placeholder="KDL-FLW-SET-01"
                      {...register('sku')}
                    />
                    {errors.sku && <p className="text-red-500 text-xs">{errors.sku.message}</p>}
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <Label htmlFor="short_description">Short Summary</Label>
                  <Input
                    id="short_description"
                    placeholder="Brève description d'accroche pour la carte produit"
                    {...register('short_description')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Editorial Description</Label>
                  <textarea
                    id="description"
                    rows={4}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    placeholder="Description détaillée de la pièce joaillière..."
                    {...register('description')}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Commerce & Pricing</CardTitle>
                <CardDescription>Base price in Algerian Dinars (DZD).</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="base_price">Base Price (DZD) *</Label>
                    <Input
                      id="base_price"
                      type="number"
                      placeholder="1200"
                      {...register('base_price', { valueAsNumber: true })}
                    />
                    {errors.base_price && <p className="text-red-500 text-xs">{errors.base_price.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Input id="currency" disabled value="DZD (Dinar Algérien)" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Catalog Placement</CardTitle>
                <CardDescription>Assign primary category and curated collections.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Publication Status *</Label>
                  <select
                    id="status"
                    {...register('status')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="DRAFT">DRAFT (Brouillon)</option>
                    <option value="PUBLISHED">PUBLISHED (En ligne)</option>
                    <option value="ARCHIVED">ARCHIVED (Archivé)</option>
                  </select>
                  {errors.status && <p className="text-red-500 text-xs">{errors.status.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category_id">Category *</Label>
                  <select
                    id="category_id"
                    {...register('category_id')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Sélectionner une catégorie...</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && (
                    <p className="text-red-500 text-xs">{errors.category_id.message}</p>
                  )}
                </div>

                <div className="space-y-2 pt-2">
                  <Label className="flex items-center gap-2">
                    <Layers className="h-4 w-4" /> Collections
                  </Label>
                  <div className="space-y-2 pt-1 border rounded-md p-3 bg-muted/20">
                    {collections.map(col => (
                      <label key={col.id} className="flex items-center space-x-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={watchedCollectionIds.includes(col.id)}
                          onChange={() => toggleCollection(col.id)}
                          className="rounded border-gray-300 text-black focus:ring-black"
                        />
                        <span>{col.name}</span>
                      </label>
                    ))}
                    {collections.length === 0 && (
                      <p className="text-xs text-muted-foreground">Aucune collection disponible.</p>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center space-x-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('is_featured')}
                      className="rounded border-gray-300 text-black focus:ring-black"
                    />
                    <span className="flex items-center gap-1 font-medium">
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Featured on Homepage
                    </span>
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MEDIA & GALLERY */}
      {/* ========================================================================= */}
      {activeTab === 'media' && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Product Photography</CardTitle>
                <CardDescription>
                  Manage high-resolution studio shots, cover imagery, and gallery order.
                </CardDescription>
              </div>
              <div className="flex gap-2">
                {approvedMediaLibrary.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowMediaPicker(!showMediaPicker)}
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    {showMediaPicker ? 'Hide Library' : 'Choose from Store Media'}
                  </Button>
                )}
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <span className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-black text-white hover:bg-neutral-800 h-9 px-3">
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                  </span>
                </label>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Media Library Quick Picker */}
              {showMediaPicker && approvedMediaLibrary.length > 0 && (
                <div className="border rounded-lg p-4 bg-muted/20 space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Available Approved Store Media
                  </p>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 max-h-60 overflow-y-auto p-1">
                    {approvedMediaLibrary.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          const isFirst = mediaFields.length === 0
                          appendMedia({
                            url,
                            role: isFirst ? 'COVER' : 'GALLERY',
                            display_order: mediaFields.length
                          })
                        }}
                        className="relative aspect-square border rounded hover:border-black transition-all overflow-hidden group"
                      >
                        <Image src={url} alt={`Media ${idx}`} fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                          <Plus className="h-5 w-5" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Direct URL Input */}
              <div className="flex gap-2">
                <Input
                  id="direct-media-url"
                  placeholder="Ou entrez une URL d'image (/products/product-1/1.jpg ou https://...)"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      const input = e.currentTarget
                      if (input.value.trim()) {
                        const isFirst = mediaFields.length === 0
                        appendMedia({
                          url: input.value.trim(),
                          role: isFirst ? 'COVER' : 'GALLERY',
                          display_order: mediaFields.length
                        })
                        input.value = ''
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const input = document.getElementById('direct-media-url') as HTMLInputElement
                    if (input && input.value.trim()) {
                      const isFirst = mediaFields.length === 0
                      appendMedia({
                        url: input.value.trim(),
                        role: isFirst ? 'COVER' : 'GALLERY',
                        display_order: mediaFields.length
                      })
                      input.value = ''
                    }
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add URL
                </Button>
              </div>

              {/* Attached Media Grid */}
              {mediaFields.length === 0 ? (
                <div className="border-2 border-dashed rounded-lg p-12 text-center text-muted-foreground">
                  <ImageIcon className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  <p className="font-medium">No media attached yet</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload images or select from the approved media library above.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {mediaFields.map((item, index) => {
                    const currentItem = watchedMedia[index] || item
                    const isCover = currentItem.role === 'COVER'

                    return (
                      <div
                        key={item.id}
                        className={`border rounded-lg overflow-hidden bg-card flex flex-col relative transition-all ${
                          isCover ? 'ring-2 ring-black shadow-md' : ''
                        }`}
                      >
                        {/* Cover Badge */}
                        {isCover && (
                          <div className="absolute top-2 left-2 z-10 bg-black text-white text-xs px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                            <Star className="h-3 w-3 fill-current" /> COVER
                          </div>
                        )}

                        <div className="relative aspect-square bg-muted">
                          <Image
                            src={currentItem.url}
                            alt={`Product media ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                          <div className="space-y-1">
                            <Label className="text-xs">Role</Label>
                            <select
                              {...register(`media.${index}.role` as const)}
                              className="w-full text-xs h-8 rounded border border-input bg-background px-2"
                            >
                              <option value="COVER">COVER (Principale)</option>
                              <option value="GALLERY">GALLERY (Galerie)</option>
                              <option value="DETAIL">DETAIL (Détail)</option>
                              <option value="VARIANT">VARIANT (Variante)</option>
                              <option value="LIFESTYLE">LIFESTYLE</option>
                            </select>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t text-xs">
                            {!isCover ? (
                              <button
                                type="button"
                                onClick={() => setCoverImage(index)}
                                className="text-muted-foreground hover:text-black font-medium"
                              >
                                Set as Cover
                              </button>
                            ) : (
                              <span className="text-emerald-600 font-medium">Main Image</span>
                            )}
                            <button
                              type="button"
                              onClick={() => removeMedia(index)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: VARIANTS */}
      {/* ========================================================================= */}
      {activeTab === 'variants' && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Product Variants</CardTitle>
                <CardDescription>
                  Colorways, finishes, or metal alloy variations (e.g. Or Rose, Argent, Blanc).
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  appendVariant({
                    label: '',
                    sku: '',
                    stock: 10,
                    is_available: true
                  })
                }
              >
                <Plus className="h-4 w-4 mr-2" /> Add Variant
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {variantFields.length === 0 ? (
                <div className="border-2 border-dashed rounded-lg p-10 text-center text-muted-foreground">
                  <Sparkle className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p className="font-medium">No variants defined</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    This product will be sold as a single standard unit. Click &quot;Add Variant&quot; to offer options.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {variantFields.map((item, index) => (
                    <div
                      key={item.id}
                      className="border rounded-lg p-4 bg-card grid grid-cols-1 sm:grid-cols-5 gap-3 items-end"
                    >
                      <div className="space-y-1 sm:col-span-2">
                        <Label className="text-xs">Variant Label *</Label>
                        <Input
                          placeholder="e.g. Blanc (White Enamel)"
                          {...register(`variants.${index}.label` as const)}
                        />
                        {errors.variants?.[index]?.label && (
                          <p className="text-red-500 text-xs">
                            {errors.variants[index]?.label?.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">SKU</Label>
                        <Input
                          placeholder="KDL-FLW-01-WHT"
                          {...register(`variants.${index}.sku` as const)}
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Stock Level</Label>
                        <Input
                          type="number"
                          placeholder="10"
                          {...register(`variants.${index}.stock` as const, { valueAsNumber: true })}
                        />
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 pb-2">
                        <label className="flex items-center space-x-1.5 text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            {...register(`variants.${index}.is_available` as const)}
                            className="rounded border-gray-300 text-black"
                          />
                          <span>Active</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: LUXURY SPECIFICATIONS */}
      {/* ========================================================================= */}
      {activeTab === 'specifications' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Craftsmanship & Jewelry Specifications</CardTitle>
              <CardDescription>
                Detailed metal finishing, stones, and included pieces for the luxury PDP.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="metallicFinish">Metallic Finish</Label>
                  <Input
                    id="metallicFinish"
                    placeholder="e.g. Finition dorée polie brillante / Plaqué Or"
                    {...register('metadata.metallicFinish')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stonesOrInserts">Stones / Inserts</Label>
                  <Input
                    id="stonesOrInserts"
                    placeholder="e.g. Émail haute brillance, Oxydes de Zirconium pavés"
                    {...register('metadata.stonesOrInserts')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="piecesIncluded">Pieces Included</Label>
                  <Input
                    id="piecesIncluded"
                    placeholder="e.g. Parure 2 pièces (Collier + Bague)"
                    {...register('metadata.piecesIncluded')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dimensions">Dimensions</Label>
                  <Input
                    id="dimensions"
                    placeholder="e.g. Pendentif 18mm / Tour 42cm"
                    {...register('metadata.dimensions')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Size / Adjustability</Label>
                  <Input
                    id="size"
                    placeholder="e.g. Taille ajustable universelle"
                    {...register('metadata.size')}
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Label htmlFor="care">Care & Maintenance</Label>
                <textarea
                  id="care"
                  rows={2}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Conseils d'entretien..."
                  {...register('metadata.care')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="benefits">Luxury Highlights & Packaging</Label>
                <Input
                  id="benefits"
                  placeholder="e.g. Écrin KenDji Signature inclus, Certificat d'authenticité"
                  {...register('metadata.benefits')}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: SEO & COPY */}
      {/* ========================================================================= */}
      {activeTab === 'seo' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Search Engine Optimization & Brand Story</CardTitle>
              <CardDescription>
                Customize Google search snippet and the dedicated brand storytelling section.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="story">Brand Narrative / Piece Story</Label>
                <textarea
                  id="story"
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="L'histoire et l'inspiration derrière cette création joaillière..."
                  {...register('story')}
                />
              </div>

              <div className="space-y-2 pt-2">
                <Label htmlFor="seo_title">Custom SEO Title</Label>
                <Input
                  id="seo_title"
                  placeholder="KenDji | Parure Florale Dorée — Joaillerie d'Exception Alger"
                  {...register('metadata.seo_title')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seo_description">SEO Meta Description</Label>
                <textarea
                  id="seo_description"
                  rows={2}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Découvrez notre parure florale haute joaillerie. Livraison 58 Wilayas en Algérie avec paiement à la livraison."
                  {...register('metadata.seo_description')}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBMIT / ACTIONS FOOTER */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button
          variant="outline"
          type="button"
          onClick={() => router.push('/admin/products')}
          disabled={isPending}
        >
          Cancel
        </Button>

        <div className="flex gap-3">
          <Button type="submit" disabled={isPending || isUploading} className="bg-black text-white hover:bg-neutral-800">
            {isPending
              ? 'Saving...'
              : initialData?.id
              ? 'Save Product Changes'
              : 'Create & Publish Product'}
          </Button>
        </div>
      </div>
    </form>
  )
}
