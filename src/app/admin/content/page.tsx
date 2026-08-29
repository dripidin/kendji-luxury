import { getHomepageContent } from '@/lib/cms'
import { getAllProducts, getCollections } from '@/lib/catalog'
import { ContentManager } from '@/components/admin/content-manager'

export const dynamic = 'force-dynamic'

export default async function AdminContentPage() {
  const [content, products, collections] = await Promise.all([
    getHomepageContent(),
    Promise.resolve(getAllProducts()),
    Promise.resolve(getCollections())
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
