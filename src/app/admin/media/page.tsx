import { createAdminClient } from '@/lib/supabase/admin'
import { MediaLibraryManager, MediaItemRecord } from '@/components/admin/media-library-manager'
import { BACKGROUND_ASSETS } from '@/lib/catalog'

export const dynamic = 'force-dynamic'

export default async function MediaPage() {
  const supabase = createAdminClient()

  const { data: dbMedia, error } = await supabase
    .from('product_media')
    .select('*, products(id, name, slug)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error loading media library:', error)
  }

  const mediaList: MediaItemRecord[] = dbMedia || []

  // Ensure 6 background assets are represented in the list if DB is freshly seeded
  const existingUrls = new Set(mediaList.map(m => m.url))
  for (const bg of Object.values(BACKGROUND_ASSETS)) {
    if (!existingUrls.has(bg.path)) {
      mediaList.push({
        id: `bg-${bg.code}`,
        url: bg.path,
        role: 'BACKGROUND',
        alt_text: bg.name,
        display_order: 0,
        is_archived: false,
        products: null
      })
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <MediaLibraryManager initialMedia={mediaList} />
    </div>
  )
}
