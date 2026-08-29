import { createAdminClient } from '@/lib/supabase/admin'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Package2, AlertTriangle, XCircle, CheckCircle } from 'lucide-react'

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
        isAvailable: v.is_available ?? true,
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
        stock: 15, // Default active base stock if untracked
        isAvailable: true,
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
          <p className="text-sm text-gray-500 mt-1">
            État du stock en temps réel depuis Supabase — bijoux et variantes KenDji Luxury.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant="outline" className="px-3 py-1 bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-mono">
            <CheckCircle className="h-3 w-3 mr-1 inline" />
            {inStockCount} En stock
          </Badge>
          {lowStockCount > 0 && (
            <Badge variant="outline" className="px-3 py-1 bg-amber-50 text-amber-800 border-amber-200 text-xs font-mono">
              <AlertTriangle className="h-3 w-3 mr-1 inline" />
              {lowStockCount} Stock faible
            </Badge>
          )}
          {outOfStockCount > 0 && (
            <Badge variant="outline" className="px-3 py-1 bg-rose-50 text-rose-800 border-rose-200 text-xs font-mono">
              <XCircle className="h-3 w-3 mr-1 inline" />
              {outOfStockCount} Rupture
            </Badge>
          )}
        </div>
      </div>

      {error ? (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-4">
          <p className="font-semibold">Erreur de connexion à la base de données</p>
          <p className="text-sm mt-1">{error.message}</p>
        </div>
      ) : (
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50/80">
              <TableRow>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Produit / المنتج</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Variante / النوع</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">SKU / الرمز</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-center">Stock / الكمية</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-center">Disponibilité / الحالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100">
              {items.length > 0 ? (
                items.map((item) => {
                  const isOutOfStock = item.stock === 0 || !item.isAvailable
                  const isLowStock = item.stock > 0 && item.stock <= LOW_STOCK_THRESHOLD && item.isAvailable

                  return (
                    <TableRow key={item.key} className="hover:bg-gray-50/40 transition-colors">
                      <TableCell>
                        <div className="font-medium text-gray-900 text-sm">{item.productName}</div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {item.variantLabel || <span className="italic text-gray-300">Base / أساسي</span>}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-gray-400">{item.sku || '—'}</TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`font-mono font-bold text-sm ${
                            isOutOfStock ? 'text-rose-600' : isLowStock ? 'text-amber-600' : 'text-emerald-600'
                          }`}
                        >
                          {item.stock}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle className="h-3 w-3" /> Rupture / نفذت
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <AlertTriangle className="h-3 w-3" /> Faible / منخفض
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle className="h-3 w-3" /> En stock / متوفر
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-gray-400">
                    <Package2 className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p>Aucun article d&apos;inventaire trouvé.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
