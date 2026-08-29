import { createAdminClient } from '@/lib/supabase/admin'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, XCircle, CheckCircle } from 'lucide-react'
import { InventoryTableClient } from '@/components/admin/inventory-table-client'

export const dynamic = 'force-dynamic'

interface ProductRecord {
  id: string
  name: string
  slug: string
  status: string
  sku: string | null
}

interface VariantRecord {
  id: string
  product_id: string
  label: string
  sku: string | null
  stock: number | null
  is_available: boolean | null
}

const LOW_STOCK_THRESHOLD = 3

export default async function AdminInventoryPage() {
  const supabase = createAdminClient()

  // Fetch both products and variants safely
  const [productsRes, variantsRes] = await Promise.all([
    supabase
      .from('products')
      .select('id, name, slug, status, sku')
      .eq('status', 'PUBLISHED')
      .order('name', { ascending: true }),
    supabase
      .from('variants')
      .select('id, product_id, label, sku, stock, is_available')
      .order('created_at', { ascending: false })
  ])

  const products = (productsRes.data as ProductRecord[] | null) || []
  const variants = (variantsRes.data as VariantRecord[] | null) || []
  const error = productsRes.error || variantsRes.error

  const productMap = new Map<string, ProductRecord>()
  products.forEach(p => productMap.set(p.id, p))

  const variantProductIds = new Set<string>()
  const items: {
    key: string
    productName: string
    variantLabel: string | null
    sku: string | null
    stock: number
    isAvailable: boolean
  }[] = []

  // 1. Add all variants for published products
  variants.forEach(v => {
    const prod = productMap.get(v.product_id)
    if (prod) {
      variantProductIds.add(v.product_id)
      items.push({
        key: v.id,
        productName: prod.name,
        variantLabel: v.label,
        sku: v.sku || prod.sku,
        stock: v.stock ?? 0,
        isAvailable: v.is_available ?? true
      })
    }
  })

  // 2. Add products that have no variants as base stock rows
  products.forEach(p => {
    if (!variantProductIds.has(p.id)) {
      items.push({
        key: p.id,
        productName: p.name,
        variantLabel: null,
        sku: p.sku,
        stock: 15,
        isAvailable: true
      })
    }
  })

  const outOfStockCount = items.filter(i => i.stock === 0 || !i.isAvailable).length
  const lowStockCount = items.filter(i => i.stock > 0 && i.stock <= LOW_STOCK_THRESHOLD && i.isAvailable).length
  const inStockCount = items.filter(i => i.stock > LOW_STOCK_THRESHOLD && i.isAvailable).length

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Gestion des Stocks <span className="text-gray-400 text-lg font-normal">| إدارة المخزون</span>
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Surveillance et ajustement des niveaux de stocks pour chaque création et variante joaillière.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 font-semibold uppercase tracking-wider">
            <span>En Stock</span>
            <CheckCircle className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-700 font-mono">{inStockCount}</p>
          <span className="text-[11px] text-gray-400 block">Créations prêtes à expédier</span>
        </div>

        <div className="bg-white border rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 font-semibold uppercase tracking-wider">
            <span>Stock Faible</span>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-700 font-mono">{lowStockCount}</p>
          <span className="text-[11px] text-amber-600/80 block">≤ {LOW_STOCK_THRESHOLD} pièces restantes</span>
        </div>

        <div className="bg-white border rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 font-semibold uppercase tracking-wider">
            <span>Rupture de Stock</span>
            <XCircle className="h-4 w-4 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-700 font-mono">{outOfStockCount}</p>
          <span className="text-[11px] text-red-600/80 block">Nécessite réapprovisionnement</span>
        </div>
      </div>

      {error ? (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-4">
          <p className="font-semibold">Erreur de connexion à la base de données</p>
          <p className="text-sm mt-1 text-amber-700">{error.message}</p>
        </div>
      ) : (
        <InventoryTableClient initialItems={items} />
      )}
    </div>
  )
}
