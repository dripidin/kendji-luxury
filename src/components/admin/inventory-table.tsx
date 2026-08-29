"use client"

import { useState } from "react"
import { InventoryItemState, StockStatus } from "@/lib/commerce/inventory"
import { updateInventoryAction } from "@/lib/actions/order-operations"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Loader2, Check, AlertTriangle, PackageX, Layers } from "lucide-react"

interface InventoryTableProps {
  initialItems: InventoryItemState[];
}

export function InventoryTable({ initialItems }: InventoryTableProps) {
  const [items, setItems] = useState<InventoryItemState[]>(initialItems)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editQty, setEditQty] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.variantLabel && item.variantLabel.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.sku && item.sku.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "IN_STOCK" && item.stockStatus === "IN_STOCK") ||
      (statusFilter === "OUT_OF_STOCK" && item.stockStatus === "OUT_OF_STOCK") ||
      (statusFilter === "LOW_STOCK" && item.stockQuantity <= item.lowStockThreshold && item.stockStatus === "IN_STOCK")

    return matchesSearch && matchesStatus
  })

  const startEdit = (item: InventoryItemState) => {
    const key = item.variantId ? `${item.productId}__${item.variantId}` : `${item.productId}__base`
    setEditingKey(key)
    setEditQty(item.stockQuantity)
  }

  const saveEdit = async (item: InventoryItemState) => {
    setIsLoading(true)
    setFeedback(null)

    try {
      const newStatus: StockStatus = editQty === 0 ? "OUT_OF_STOCK" : "IN_STOCK"
      const res = await updateInventoryAction(item.productId, item.variantId, editQty, newStatus)

      if (res.success) {
        setItems(prev => prev.map(i => {
          const match = i.productId === item.productId && i.variantId === item.variantId
          if (match) {
            return {
              ...i,
              stockQuantity: editQty,
              stockStatus: newStatus,
              lastUpdated: new Date().toISOString()
            }
          }
          return i
        }))
        setFeedback(res.message || "Stock mis à jour.")
        setEditingKey(null)
      }
    } catch {
      setFeedback("Erreur de mise à jour.")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleStockStatus = async (item: InventoryItemState) => {
    setIsLoading(true)
    const nextStatus: StockStatus = item.stockStatus === "IN_STOCK" ? "OUT_OF_STOCK" : "IN_STOCK"
    const nextQty = nextStatus === "OUT_OF_STOCK" ? 0 : (item.stockQuantity || 10)

    try {
      const res = await updateInventoryAction(item.productId, item.variantId, nextQty, nextStatus)
      if (res.success) {
        setItems(prev => prev.map(i => {
          if (i.productId === item.productId && i.variantId === item.variantId) {
            return { ...i, stockQuantity: nextQty, stockStatus: nextStatus }
          }
          return i
        }))
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Rechercher par bijou, variante ou SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          {["ALL", "IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"].map((st) => (
            <Button
              key={st}
              variant={statusFilter === st ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(st)}
              className="text-xs h-8"
            >
              {st === "ALL" && "Tous"}
              {st === "IN_STOCK" && "En Stock"}
              {st === "LOW_STOCK" && "Stock Faible (≤3)"}
              {st === "OUT_OF_STOCK" && "Rupture"}
            </Button>
          ))}
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-xs">
          {feedback}
        </div>
      )}

      {/* Inventory Table */}
      <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/80">
            <TableRow>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Bijou & Modèle</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Variante</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Statut Stock</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider text-center">Quantité</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const key = item.variantId ? `${item.productId}__${item.variantId}` : `${item.productId}__base`
                const isEditing = editingKey === key
                const isLowStock = item.stockQuantity <= item.lowStockThreshold && item.stockStatus === "IN_STOCK"

                return (
                  <TableRow key={key} className="hover:bg-gray-50/50">
                    <TableCell className="font-medium text-xs text-gray-900">
                      <div>{item.productName}</div>
                      {item.sku && <span className="font-mono text-[10px] text-gray-400">{item.sku}</span>}
                    </TableCell>

                    <TableCell className="text-xs text-gray-600">
                      {item.variantLabel ? (
                        <span className="inline-flex items-center gap-1">
                          <Layers size={12} className="text-gray-400" />
                          <span>{item.variantLabel}</span>
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">Unique</span>
                      )}
                    </TableCell>

                    <TableCell>
                      {item.stockStatus === "OUT_OF_STOCK" ? (
                        <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 text-[11px] gap-1">
                          <PackageX size={12} />
                          <span>Rupture</span>
                        </Badge>
                      ) : isLowStock ? (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[11px] gap-1">
                          <AlertTriangle size={12} />
                          <span>Stock Faible</span>
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px]">
                          En Stock
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="text-center font-mono">
                      {isEditing ? (
                        <div className="inline-flex items-center gap-1.5">
                          <Input
                            type="number"
                            min="0"
                            value={editQty}
                            onChange={(e) => setEditQty(Number(e.target.value))}
                            className="w-16 h-7 text-center font-mono text-xs"
                          />
                          <Button
                            size="sm"
                            onClick={() => saveEdit(item)}
                            disabled={isLoading}
                            className="h-7 w-7 p-0 bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            {isLoading ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                          </Button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEdit(item)}
                          className="hover:underline font-bold text-gray-900 px-2 py-1 rounded hover:bg-gray-100"
                        >
                          {item.stockQuantity}
                        </button>
                      )}
                    </TableCell>

                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEdit(item)}
                        className="text-xs h-7"
                      >
                        Ajuster
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStockStatus(item)}
                        className="text-xs h-7"
                      >
                        {item.stockStatus === "IN_STOCK" ? "Passer en Rupture" : "Réapprovisionner"}
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-gray-400 text-xs">
                  Aucun article ne correspond à votre recherche.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

    </div>
  )
}
