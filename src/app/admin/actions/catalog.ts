'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import {
  productSchema,
  categorySchema,
  collectionSchema,
  ProductFormValues,
  CategoryFormValues,
  CollectionFormValues
} from '@/lib/validations/catalog'

function safeRevalidatePath(path: string) {
  try {
    revalidatePath(path)
  } catch {
    // Graceful fallback when run outside Next.js request context (e.g. CLI tests)
  }
}

export async function createProduct(data: ProductFormValues) {
  try {
    const supabase = createAdminClient()
    const validated = productSchema.parse(data)

    // 1. Validate Category Exists
    const { data: category, error: catError } = await supabase
      .from('categories')
      .select('id')
      .eq('id', validated.category_id)
      .maybeSingle()

    if (catError || !category) {
      return { error: 'Selected category does not exist.' }
    }

    // 2. Validate Slug Uniqueness
    const { data: existingSlug } = await supabase
      .from('products')
      .select('id')
      .eq('slug', validated.slug)
      .maybeSingle()

    if (existingSlug) {
      return { error: `The slug "${validated.slug}" is already in use by another product.` }
    }

    // 3. Insert Product
    const { data: newProduct, error: prodError } = await supabase
      .from('products')
      .insert({
        name: validated.name,
        slug: validated.slug,
        sku: validated.sku || null,
        short_description: validated.short_description || null,
        description: validated.description || null,
        story: validated.story || null,
        base_price: validated.base_price,
        currency: validated.currency || 'DZD',
        status: validated.status,
        category_id: validated.category_id,
        is_featured: validated.is_featured,
        metadata: validated.metadata || {}
      })
      .select('id')
      .single()

    if (prodError || !newProduct) {
      return { error: prodError?.message || 'Failed to create product record.' }
    }

    const productId = newProduct.id

    // 4. Persist Collections (if any)
    if (validated.collection_ids && validated.collection_ids.length > 0) {
      const collectionInserts = validated.collection_ids.map(colId => ({
        product_id: productId,
        collection_id: colId
      }))
      const { error: colErr } = await supabase.from('product_collections').insert(collectionInserts)
      if (colErr) {
        console.error('Warning inserting product collections:', colErr.message)
      }
    }

    // 5. Persist Product Media (if any)
    if (validated.media && validated.media.length > 0) {
      const mediaInserts = validated.media.map((m, idx) => ({
        product_id: productId,
        url: m.url,
        role: m.role || (idx === 0 ? 'COVER' : 'GALLERY'),
        display_order: m.display_order ?? idx
      }))
      const { error: mediaErr } = await supabase.from('product_media').insert(mediaInserts)
      if (mediaErr) {
        console.error('Warning inserting product media:', mediaErr.message)
      }
    }

    // 6. Persist Variants (if any)
    if (validated.variants && validated.variants.length > 0) {
      const variantInserts = validated.variants.map((v, idx) => ({
        product_id: productId,
        label: v.label,
        sku: v.sku || `${validated.sku || validated.slug}-V${idx + 1}`,
        price_override: v.price_override ?? null,
        stock: v.stock ?? 10,
        is_available: v.is_available ?? true
      }))
      const { error: varErr } = await supabase.from('variants').insert(variantInserts)
      if (varErr) {
        console.error('Warning inserting product variants:', varErr.message)
      }
    }

    safeRevalidatePath('/admin/products')
    safeRevalidatePath('/shop')
    safeRevalidatePath(`/product/${validated.slug}`)

    return { success: true, productId }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Validation error or database failure'
    return { error: errorMsg }
  }
}

export async function updateProduct(id: string, data: ProductFormValues) {
  try {
    const supabase = createAdminClient()
    const validated = productSchema.parse(data)

    // Check slug collision with other products
    const { data: existingSlug } = await supabase
      .from('products')
      .select('id')
      .eq('slug', validated.slug)
      .neq('id', id)
      .maybeSingle()

    if (existingSlug) {
      return { error: `The slug "${validated.slug}" is already in use by another product.` }
    }

    // Update main product record
    const { error: prodError } = await supabase
      .from('products')
      .update({
        name: validated.name,
        slug: validated.slug,
        sku: validated.sku || null,
        short_description: validated.short_description || null,
        description: validated.description || null,
        story: validated.story || null,
        base_price: validated.base_price,
        currency: validated.currency || 'DZD',
        status: validated.status,
        category_id: validated.category_id,
        is_featured: validated.is_featured,
        metadata: validated.metadata || {},
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (prodError) {
      return { error: prodError.message }
    }

    // Update Collections
    await supabase.from('product_collections').delete().eq('product_id', id)
    if (validated.collection_ids && validated.collection_ids.length > 0) {
      const collectionInserts = validated.collection_ids.map(colId => ({
        product_id: id,
        collection_id: colId
      }))
      await supabase.from('product_collections').insert(collectionInserts)
    }

    // Update Media
    if (validated.media) {
      await supabase.from('product_media').delete().eq('product_id', id)
      if (validated.media.length > 0) {
        const mediaInserts = validated.media.map((m, idx) => ({
          product_id: id,
          url: m.url,
          role: m.role || (idx === 0 ? 'COVER' : 'GALLERY'),
          display_order: m.display_order ?? idx
        }))
        await supabase.from('product_media').insert(mediaInserts)
      }
    }

    // Update Variants
    if (validated.variants) {
      await supabase.from('variants').delete().eq('product_id', id)
      if (validated.variants.length > 0) {
        const variantInserts = validated.variants.map((v, idx) => ({
          product_id: id,
          label: v.label,
          sku: v.sku || `${validated.sku || validated.slug}-V${idx + 1}`,
          price_override: v.price_override ?? null,
          stock: v.stock ?? 10,
          is_available: v.is_available ?? true
        }))
        await supabase.from('variants').insert(variantInserts)
      }
    }

    safeRevalidatePath('/admin/products')
    safeRevalidatePath(`/admin/products/${id}`)
    safeRevalidatePath('/shop')
    safeRevalidatePath(`/product/${validated.slug}`)

    return { success: true, productId: id }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Validation error'
    return { error: errorMsg }
  }
}

export async function uploadMediaFile(formData: FormData) {
  try {
    const supabase = createAdminClient()
    const file = formData.get('file') as File | null

    if (!file) {
      return { error: 'No file provided' }
    }

    // Server-side type validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
    if (!allowedTypes.includes(file.type)) {
      return { error: 'Invalid file type. Allowed formats: JPEG, PNG, WEBP, AVIF.' }
    }

    // Server-side size validation (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      return { error: 'File size exceeds maximum limit of 5MB.' }
    }

    const fileExt = file.name.split('.').pop() || 'jpg'
    const fileName = `uploads/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: uploadErr } = await supabase.storage
      .from('kendji-media')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (uploadErr) {
      return { error: uploadErr.message }
    }

    const { data: publicUrlData } = supabase.storage
      .from('kendji-media')
      .getPublicUrl(fileName)

    return { success: true, url: publicUrlData.publicUrl }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Upload failed'
    return { error: errorMsg }
  }
}

export async function createCategory(data: CategoryFormValues) {
  const supabase = createAdminClient()
  const validated = categorySchema.parse(data)

  const { error } = await supabase.from('categories').insert(validated)
  if (error) return { error: error.message }
  
  safeRevalidatePath('/admin/categories')
  return { success: true }
}

export async function updateCategory(id: string, data: CategoryFormValues) {
  const supabase = createAdminClient()
  const validated = categorySchema.parse(data)

  const { error } = await supabase.from('categories').update(validated).eq('id', id)
  if (error) return { error: error.message }

  safeRevalidatePath('/admin/categories')
  return { success: true }
}

export async function createCollection(data: CollectionFormValues) {
  const supabase = createAdminClient()
  const validated = collectionSchema.parse(data)

  const { error } = await supabase.from('collections').insert(validated)
  if (error) return { error: error.message }
  
  safeRevalidatePath('/admin/collections')
  return { success: true }
}

export async function updateCollection(id: string, data: CollectionFormValues) {
  const supabase = createAdminClient()
  const validated = collectionSchema.parse(data)

  const { error } = await supabase.from('collections').update(validated).eq('id', id)
  if (error) return { error: error.message }

  safeRevalidatePath('/admin/collections')
  return { success: true }
}
