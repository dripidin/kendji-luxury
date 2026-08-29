import { getHomepageContent } from '@/lib/cms'
import { ContentManager } from '@/components/admin/content-manager'
import { fetchStorefrontProducts, fetchStorefrontCollections } from '@/lib/storefront-catalog'

export const dynamic = 'force-dynamic'

export default async function AdminContentPage() {
  const [content, products, collections] = await Promise.all([
    getHomepageContent(),
    fetchStorefrontProducts(),
    fetchStorefrontCollections()
  ])

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <ContentManager
        initialContent={content}
        products={products}
        collections={collections}
      />
    </div>
  )
}
