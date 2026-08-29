'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { HomepageContent } from '@/lib/cms'

function safeRevalidate(path: string) {
  try {
    revalidatePath(path)
  } catch {
    // Gracefully handle invocation outside HTTP request context (e.g. tests)
  }
}

export async function saveHomepageContentAction(content: HomepageContent) {
  try {
    const supabase = createAdminClient()

    // Check if row 1 exists
    const { data: existing } = await supabase.from('site_settings').select('id').eq('id', 1).maybeSingle()

    if (existing) {
      const { error } = await supabase
        .from('site_settings')
        .update({
          homepage_content: content,
          updated_at: new Date().toISOString()
        })
        .eq('id', 1)

      if (error) {
        return { success: false, error: error.message }
      }
    } else {
      const { error } = await supabase
        .from('site_settings')
        .insert({
          id: 1,
          brand_name: 'KenDji Luxury',
          homepage_content: content,
          updated_at: new Date().toISOString()
        })

      if (error) {
        return { success: false, error: error.message }
      }
    }

    safeRevalidate('/')
    safeRevalidate('/admin/content')
    return { success: true }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Une erreur inattendue est survenue'
    return { success: false, error: msg }
  }
}

export async function updateMediaItemAction(
  mediaId: string,
  updates: { role?: string; alt_text?: string; is_archived?: boolean }
) {
  try {
    const supabase = createAdminClient()

    const { error } = await supabase
      .from('product_media')
      .update({
        ...updates
      })
      .eq('id', mediaId)

    if (error) {
      return { success: false, error: error.message }
    }

    safeRevalidate('/admin/media')
    safeRevalidate('/shop')
    safeRevalidate('/')
    return { success: true }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Erreur lors de la mise à jour du média'
    return { success: false, error: msg }
  }
}

export async function deleteMediaItemAction(mediaId: string) {
  try {
    const supabase = createAdminClient()

    const { error } = await supabase
      .from('product_media')
      .delete()
      .eq('id', mediaId)

    if (error) {
      return { success: false, error: error.message }
    }

    safeRevalidate('/admin/media')
    safeRevalidate('/shop')
    safeRevalidate('/')
    return { success: true }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Erreur lors de la suppression du média'
    return { success: false, error: msg }
  }
}

export async function registerMediaItemAction(media: {
  url: string
  role: string
  alt_text?: string
  product_id?: string
}) {
  try {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('product_media')
      .insert({
        url: media.url,
        role: media.role,
        alt_text: media.alt_text || null,
        product_id: media.product_id || null,
        display_order: 0
      })
      .select('id')
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    safeRevalidate('/admin/media')
    return { success: true, id: data.id }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erreur lors de l'enregistrement du média"
    return { success: false, error: msg }
  }
}
