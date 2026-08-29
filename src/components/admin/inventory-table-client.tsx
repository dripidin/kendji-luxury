'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { adjustVariantStockAction } from '@/app/admin/actions/catalog'
import { Search, Package2, AlertTriangle, CheckCircle, XCircle, SlidersHorizontal, Loader2 } from 'lucide-react'

interface InventoryItem {
  key: string
  productName: string
  variantLabel: string | null
  sku: string | null
  stock: number
  isAvailable: boolean
}

const LOW_STOCK_THRESHOLD = 3

export function InventoryTableClient({ initialItems }: { initialItems: InventoryItem[] }) {
  const router = useRouter()
  const [items, setItems] = useState<InventoryItem[]>(initialItems)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'>('ALL')

  // Stock Adjustment Modal State
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [newStockInput, setNewStockInput] = useState<number>(0)
  const [isAvailableInput, setIsAvailableInput] = useState<boolean>(true)
  const [reasonInput, setReasonInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const openAdjustDialog = (item: InventoryItem) => {
    setSelectedItem(item)
    setNewStockInput(item.stock)
    setIsAvailableInput(item.isAvailable)
    setReasonInput('')
    setFeedback(null)
  }

  const handleStockSave = async () => {
    if (!selectedItem) return
    setIsSubmitting(true)
    setFeedback(null)

    const res = await adjustVariantStockAction(
      selectedItem.key,
      newStockInput,
      isAvailableInput,
      reasonInput.trim() || undefined
    )

    setIsSubmitting(false)

    if (res.success) {
      // Update local state
      setItems(prev =>
        prev.map(i =>
          i.key === selectedItem.key
            ? { ...i, stock: newStockInput, isAvailable: isAvailableInput && newStockInput > 0 }
            : i
        )
      )
      setFeedback({ type: 'success', message: res.message || 'Stock mis à jour.' })
      setTimeout(() => {
        setSelectedItem(null)
        router.refresh()
      }, 1200)
    } else {
      setFeedback({ type: 'error', message: res.error || 'Erreur lors de la mise à jour.' })
    }
  }

  const filtered = useMemo(() => {
    let result = items
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      result = result.filter(
        i =>
          i.productName.toLowerCase().includes(q) ||
          (i.variantLabel && i.variantLabel.toLowerCase().includes(q)) ||
          (i.sku && i.sku.toLowerCase().includes(q))
      )
    }

    if (statusFilter === 'IN_STOCK') {
      result = result.filter(i => i.stock > LOW_STOCK_THRESHOLD && i.isAvailable)
    } else if (statusFilter === 'LOW_STOCK') {
      result = result.filter(i => i.stock > 0 && i.stock <= LOW_STOCK_THRESHOLD && i.isAvailable)
    } else if (statusFilter === 'OUT_OF_STOCK') {
      result = result.filter(i => i.stock === 0 || !i.isAvailable)
    }

    return result
  }, [items, searchTerm, statusFilter])

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 max-w-sm flex-1">
          <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <Input
            placeholder="Rechercher par bijou, variante, SKU…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="h-9 bg-white"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant={statusFilter === 'ALL' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('ALL')}
            className="text-xs h-8"
          >
            Tous ({items.length})
          </Button>
          <Button
            variant={statusFilter === 'IN_STOCK' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('IN_STOCK')}
            className="text-xs h-8"
          >
            En Stock
          </Button>
          <Button
            variant={statusFilter === 'LOW_STOCK' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('LOW_STOCK')}
            className="text-xs h-8 text-amber-700"
          >
            Stock Faible
          </Button>
          <Button
            variant={statusFilter === 'OUT_OF_STOCK' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('OUT_OF_STOCK')}
            className="text-xs h-8 text-red-700"
          >
            Rupture
          </Button>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/80">
            <TableRow>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Bijou & Modèle</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Variante</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">SKU</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider text-center">Quantité</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">État</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100">
            {filtered.length > 0 ? (
              filtered.map(item => {
                const isOutOfStock = item.stock === 0 || !item.isAvailable
                const isLowStock = !isOutOfStock && item.stock <= LOW_STOCK_THRESHOLD

                return (
                  <TableRow key={item.key} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell>
                      <div className="font-medium text-gray-900 text-sm">{item.productName}</div>
                    </TableCell>
                    <TableCell>
                      {item.variantLabel ? (
                        <span className="text-xs text-gray-700 bg-gray-100 px-2 py-0.5 rounded font-mono">
                          {item.variantLabel}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Pièce standard</span>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-gray-500">{item.sku || '—'}</TableCell>
                    <TableCell className="text-center">
                      <span className="font-mono font-bold text-sm text-gray-900">{item.stock}</span>
                    </TableCell>
                    <TableCell>
                      {isOutOfStock ? (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                          <XCircle className="h-3 w-3 mr-1" /> Rupture
                        </Badge>
                      ) : isLowStock ? (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" /> Stock faible (≤ {LOW_STOCK_THRESHOLD})
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" /> En stock
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openAdjustDialog(item)}
                        className="text-xs h-8 border-gray-200 hover:bg-gray-100"
                      >
                        <SlidersHorizontal className="h-3.5 w-3.5 mr-1" />
                        Ajuster
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-gray-400">
                  <Package2 className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p>Aucun article d&apos;inventaire trouvé.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Stock Adjustment Dialog */}
      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={(open: boolean) => !open && setSelectedItem(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">
                Ajuster le stock : {selectedItem.productName}
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500">
                {selectedItem.variantLabel ? `Variante: ${selectedItem.variantLabel} • ` : ''}SKU: {selectedItem.sku || 'N/A'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 py-3">
              {/* Quick adjustment buttons */}
              <div className="space-y-2">
                <Label className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Ajustement Rapide</Label>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setNewStockInput(prev => Math.max(0, prev - 5))}
                    className="text-xs h-8"
                  >
                    -5
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setNewStockInput(prev => Math.max(0, prev - 1))}
                    className="text-xs h-8"
                  >
                    -1
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setNewStockInput(prev => prev + 1)}
                    className="text-xs h-8"
                  >
                    +1
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setNewStockInput(prev => prev + 5)}
                    className="text-xs h-8"
                  >
                    +5
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setNewStockInput(prev => prev + 10)}
                    className="text-xs h-8"
                  >
                    +10
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setNewStockInput(0)
                      setIsAvailableInput(false)
                    }}
                    className="text-xs h-8 text-red-600 hover:bg-red-50"
                  >
                    Rupture (0)
                  </Button>
                </div>
              </div>

              {/* Exact Stock Input */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Quantité en stock *</Label>
                  <Input
                    type="number"
                    min={0}
                    value={newStockInput}
                    onChange={e => setNewStockInput(Math.max(0, parseInt(e.target.value) || 0))}
                    className="font-mono text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Disponibilité boutique</Label>
                  <select
                    value={isAvailableInput ? 'true' : 'false'}
                    onChange={e => setIsAvailableInput(e.target.value === 'true')}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
                  >
                    <option value="true">Actif (En vente)</option>
                    <option value="false">Désactivé (Masqué)</option>
                  </select>
                </div>
              </div>

              {/* Reason / Note */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Motif de l&apos;ajustement (Optionnel)</Label>
                <Input
                  placeholder="Ex: Arrivage atelier, Réassort, Inventaire..."
                  value={reasonInput}
                  onChange={e => setReasonInput(e.target.value)}
                  className="text-xs"
                />
              </div>

              {feedback && (
                <div
                  className={`p-3 rounded-md text-xs ${
                    feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
                  }`}
                >
                  {feedback.message}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="ghost" size="sm" onClick={() => setSelectedItem(null)} disabled={isSubmitting}>
                Annuler
              </Button>
              <Button
                size="sm"
                onClick={handleStockSave}
                disabled={isSubmitting}
                className="bg-[#1A1A1A] text-white hover:bg-[#1A1A1A]/90"
              >
                {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : null}
                Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
