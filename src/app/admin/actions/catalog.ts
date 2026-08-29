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
      return { error: 'La catégorie sélectionnée n\'existe pas.' }
    }

    // 2. Validate Slug Uniqueness
    const { data: existingSlug } = await supabase
      .from('products')
      .select('id')
      .eq('slug', validated.slug)
      .maybeSingle()

    if (existingSlug) {
      return { error: `Le slug "${validated.slug}" est déjà utilisé par un autre produit.` }
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
      return { error: prodError?.message || 'Échec de la création du produit.' }
    }

    const productId = newProduct.id

    // 4. Persist Collections (if any)
    if (validated.collection_ids && validated.collection_ids.length > 0) {
      const collectionInserts = validated.collection_ids.map(colId => ({
        product_id: productId,
        collection_id: colId
      }))
      await supabase.from('product_collections').insert(collectionInserts)
    }

    // 5. Persist Product Media (if any)
    if (validated.media && validated.media.length > 0) {
      const mediaInserts = validated.media.map((m, idx) => ({
        product_id: productId,
        url: m.url,
        role: m.role || (idx === 0 ? 'COVER' : 'GALLERY'),
        display_order: m.display_order ?? idx
      }))
      await supabase.from('product_media').insert(mediaInserts)
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
      await supabase.from('variants').insert(variantInserts)
    }

    safeRevalidatePath('/admin/products')
    safeRevalidatePath('/admin/inventory')
    safeRevalidatePath('/shop')
    safeRevalidatePath(`/product/${validated.slug}`)

    return { success: true, productId }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Erreur de validation ou échec base de données.'
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
      return { error: `Le slug "${validated.slug}" est déjà utilisé par un autre bijou.` }
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
    safeRevalidatePath('/admin/inventory')
    safeRevalidatePath('/shop')
    safeRevalidatePath(`/product/${validated.slug}`)

    return { success: true, productId: id }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Erreur de validation.'
    return { error: errorMsg }
  }
}

/**
 * Safe Delete or Archive Product
 * If product is referenced in historical order items, safely archives it instead of breaking historical records.
 */
export async function deleteOrArchiveProduct(id: string, forceArchive: boolean = false) {
  try {
    const supabase = createAdminClient()

    // 1. Check if product is in order_items
    const { data: orderItems, error: oiErr } = await supabase
      .from('order_items')
      .select('id')
      .eq('product_id', id)
      .limit(1)

    const isReferencedInOrders = !oiErr && orderItems && orderItems.length > 0

    if (forceArchive || isReferencedInOrders) {
      // Safely archive the product
      const { error: archErr } = await supabase
        .from('products')
        .update({ status: 'ARCHIVED', updated_at: new Date().toISOString() })
        .eq('id', id)

      if (archErr) return { success: false, error: archErr.message }

      safeRevalidatePath('/admin/products')
      safeRevalidatePath('/admin/inventory')
      safeRevalidatePath('/shop')

      return {
        success: true,
        action: 'archived',
        message: isReferencedInOrders
          ? 'Le produit est lié à des commandes passées. Il a été archivé en toute sécurité.'
          : 'Produit archivé avec succès.'
      }
    }

    // 2. Safe to delete dependencies then product
    await supabase.from('product_collections').delete().eq('product_id', id)
    await supabase.from('product_media').delete().eq('product_id', id)
    await supabase.from('variants').delete().eq('product_id', id)

    const { error: delErr } = await supabase.from('products').delete().eq('id', id)
    if (delErr) return { success: false, error: delErr.message }

    safeRevalidatePath('/admin/products')
    safeRevalidatePath('/admin/inventory')
    safeRevalidatePath('/shop')

    return { success: true, action: 'deleted', message: 'Produit supprimé définitivement.' }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Échec de la suppression.'
    return { success: false, error: msg }
  }
}

export async function uploadMediaFile(formData: FormData) {
  try {
    const supabase = createAdminClient()
    const file = formData.get('file') as File | null

    if (!file) {
      return { error: 'Aucun fichier sélectionné.' }
    }

    // Server-side type validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
    if (!allowedTypes.includes(file.type)) {
      return { error: 'Format invalide. Formats acceptés : JPEG, PNG, WEBP, AVIF.' }
    }

    // Server-side size validation (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      return { error: 'La taille du fichier dépasse la limite maximale de 5 Mo.' }
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
    const errorMsg = err instanceof Error ? err.message : 'Échec de l\'envoi.'
    return { error: errorMsg }
  }
}

export async function createCategory(data: CategoryFormValues) {
  const supabase = createAdminClient()
  const validated = categorySchema.parse(data)

  const { error } = await supabase.from('categories').insert(validated)
  if (error) return { error: error.message }
  
  safeRevalidatePath('/admin/categories')
  safeRevalidatePath('/shop')
  return { success: true }
}

export async function updateCategory(id: string, data: CategoryFormValues) {
  const supabase = createAdminClient()
  const validated = categorySchema.parse(data)

  const { error } = await supabase.from('categories').update(validated).eq('id', id)
  if (error) return { error: error.message }

  safeRevalidatePath('/admin/categories')
  safeRevalidatePath('/shop')
  return { success: true }
}

export async function deleteOrArchiveCategory(id: string, forceArchive: boolean = false) {
  try {
    const supabase = createAdminClient()

    // Check if category has products
    const { data: prods, error: prodErr } = await supabase
      .from('products')
      .select('id')
      .eq('category_id', id)
      .limit(1)

    const hasProducts = !prodErr && prods && prods.length > 0

    if (forceArchive || hasProducts) {
      // Deactivate category
      const { error: archErr } = await supabase
        .from('categories')
        .update({ active: false, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (archErr) return { success: false, error: archErr.message }

      safeRevalidatePath('/admin/categories')
      safeRevalidatePath('/shop')

      return {
        success: true,
        action: 'archived',
        message: hasProducts
          ? 'Cette catégorie contient des bijoux. Elle a été désactivée avec succès.'
          : 'Catégorie désactivée.'
      }
    }

    const { error: delErr } = await supabase.from('categories').delete().eq('id', id)
    if (delErr) return { success: false, error: delErr.message }

    safeRevalidatePath('/admin/categories')
    safeRevalidatePath('/shop')
    return { success: true, action: 'deleted', message: 'Catégorie supprimée.' }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Échec de l\'opération.'
    return { success: false, error: msg }
  }
}

export async function createCollection(data: CollectionFormValues) {
  const supabase = createAdminClient()
  const validated = collectionSchema.parse(data)

  const { error } = await supabase.from('collections').insert(validated)
  if (error) return { error: error.message }
  
  safeRevalidatePath('/admin/collections')
  safeRevalidatePath('/collections')
  return { success: true }
}

export async function updateCollection(id: string, data: CollectionFormValues) {
  const supabase = createAdminClient()
  const validated = collectionSchema.parse(data)

  const { error } = await supabase.from('collections').update(validated).eq('id', id)
  if (error) return { error: error.message }

  safeRevalidatePath('/admin/collections')
  safeRevalidatePath('/collections')
  return { success: true }
}

export async function deleteOrArchiveCollection(id: string, forceArchive: boolean = false) {
  try {
    const supabase = createAdminClient()

    if (forceArchive) {
      const { error: archErr } = await supabase
        .from('collections')
        .update({ active: false, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (archErr) return { success: false, error: archErr.message }
      safeRevalidatePath('/admin/collections')
      safeRevalidatePath('/collections')
      return { success: true, action: 'archived', message: 'Collection désactivée.' }
    }

    // Safely remove relations from product_collections then delete collection
    await supabase.from('product_collections').delete().eq('collection_id', id)
    const { error: delErr } = await supabase.from('collections').delete().eq('id', id)
    if (delErr) return { success: false, error: delErr.message }

    safeRevalidatePath('/admin/collections')
    safeRevalidatePath('/collections')
    return { success: true, action: 'deleted', message: 'Collection supprimée.' }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Échec de la suppression.'
    return { success: false, error: msg }
  }
}

/**
 * Adjust stock of a variant directly in Supabase
 */
export async function adjustVariantStockAction(
  variantId: string,
  newStock: number,
  isAvailable: boolean,
  reason?: string
) {
  try {
    if (newStock < 0) {
      return { success: false, error: 'Le stock ne peut pas être négatif.' }
    }

    const supabase = createAdminClient()
    const { error } = await supabase
      .from('variants')
      .update({
        stock: newStock,
        is_available: isAvailable && newStock > 0,
        updated_at: new Date().toISOString()
      })
      .eq('id', variantId)

    if (error) return { success: false, error: error.message }

    safeRevalidatePath('/admin/inventory')
    safeRevalidatePath('/admin/products')
    safeRevalidatePath('/shop')

    return {
      success: true,
      message: `Stock mis à jour (${newStock} unités). ${reason ? `Motif: ${reason}` : ''}`
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Échec de la mise à jour du stock.'
    return { success: false, error: msg }
  }
}
