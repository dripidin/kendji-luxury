import { getAllInventory } from "@/lib/commerce/inventory"
import { InventoryTable } from "@/components/admin/inventory-table"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"

export default async function AdminInventoryPage() {
  const inventoryItems = getAllInventory()
  const outOfStockCount = inventoryItems.filter(i => i.stockStatus === "OUT_OF_STOCK").length
  const lowStockCount = inventoryItems.filter(i => i.stockQuantity <= i.lowStockThreshold && i.stockStatus === "IN_STOCK").length

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Gestion des Stocks & Disponibilités</h1>
          <p className="text-sm text-gray-500 mt-1">
            Contrôle simplifié de l&apos;inventaire pour les 25 bijoux et leurs variantes KenDji Luxury.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-1 bg-white text-xs font-mono">
            {inventoryItems.length} Références
          </Badge>
          {lowStockCount > 0 && (
            <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 text-xs font-mono">
              {lowStockCount} Stock Faible
            </Badge>
          )}
          {outOfStockCount > 0 && (
            <Badge variant="outline" className="bg-rose-50 text-rose-800 border-rose-200 text-xs font-mono">
              {outOfStockCount} Rupture
            </Badge>
          )}
        </div>
      </div>

      <InventoryTable initialItems={inventoryItems} />

    </div>
  )
}
