'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { ORDER_STATUS_CONFIG, OrderStatus } from '@/lib/commerce/order-status'
import { cancelOrderAction, deleteTestOrderAction } from '@/lib/actions/order-operations'
import { Search, Package, MoreHorizontal, ExternalLink, Ban, Trash2, Loader2 } from 'lucide-react'

export interface OrderItemRecord {
  id: string
  order_number: string
  customer_id: string
  status: OrderStatus
  payment_method: string
  payment_status: string
  total: number
  delivery_wilaya: string
  delivery_commune: string
  created_at: string
  customers?: { name?: string; phone?: string } | { name?: string; phone?: string }[]
}

export function OrdersTableClient({ initialOrders }: { initialOrders: OrderItemRecord[] }) {
  const router = useRouter()
  const [orders, setOrders] = useState<OrderItemRecord[]>(initialOrders)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  // Cancel & Delete Dialog state
  const [selectedOrder, setSelectedOrder] = useState<OrderItemRecord | null>(null)
  const [dialogAction, setDialogAction] = useState<'cancel' | 'delete' | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleActionConfirm = async () => {
    if (!selectedOrder || !dialogAction) return
    setIsProcessing(true)

    if (dialogAction === 'cancel') {
      const res = await cancelOrderAction(selectedOrder.id)
      setIsProcessing(false)
      if (res.success) {
        setOrders(prev =>
          prev.map(o => (o.id === selectedOrder.id ? { ...o, status: 'CANCELLED' } : o))
        )
        setDialogAction(null)
        setSelectedOrder(null)
        router.refresh()
      }
    } else if (dialogAction === 'delete') {
      const res = await deleteTestOrderAction(selectedOrder.id)
      setIsProcessing(false)
      if (res.success) {
        setOrders(prev => prev.filter(o => o.id !== selectedOrder.id))
        setDialogAction(null)
        setSelectedOrder(null)
        router.refresh()
      }
    }
  }

  const filtered = useMemo(() => {
    let result = orders

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      result = result.filter(o => {
        const cust = Array.isArray(o.customers) ? o.customers[0] : o.customers
        return (
          o.order_number.toLowerCase().includes(q) ||
          (cust?.name && cust.name.toLowerCase().includes(q)) ||
          (cust?.phone && cust.phone.toLowerCase().includes(q)) ||
          o.delivery_wilaya.toLowerCase().includes(q) ||
          o.delivery_commune.toLowerCase().includes(q)
        )
      })
    }

    if (statusFilter !== 'ALL') {
      result = result.filter(o => o.status === statusFilter)
    }

    return result
  }, [orders, searchTerm, statusFilter])

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 max-w-sm flex-1">
          <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <Input
            placeholder="Rechercher par N°, client, tél, wilaya…"
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
            Toutes ({orders.length})
          </Button>
          <Button
            variant={statusFilter === 'PENDING' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('PENDING')}
            className="text-xs h-8"
          >
            En attente
          </Button>
          <Button
            variant={statusFilter === 'CONFIRMED' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('CONFIRMED')}
            className="text-xs h-8"
          >
            Confirmées
          </Button>
          <Button
            variant={statusFilter === 'SHIPPED' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('SHIPPED')}
            className="text-xs h-8"
          >
            En cours
          </Button>
          <Button
            variant={statusFilter === 'DELIVERED' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('DELIVERED')}
            className="text-xs h-8 text-emerald-700"
          >
            Livrées
          </Button>
          <Button
            variant={statusFilter === 'CANCELLED' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('CANCELLED')}
            className="text-xs h-8 text-gray-500"
          >
            Annulées
          </Button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/80">
            <TableRow>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">N° Commande</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Client</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Destination</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Statut Opérationnel</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Paiement</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider text-right">Total (COD)</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100">
            {filtered.length > 0 ? (
              filtered.map(order => {
                const cust = Array.isArray(order.customers) ? order.customers[0] : order.customers
                const statusCfg = ORDER_STATUS_CONFIG[order.status] || {
                  label: order.status,
                  badgeClass: 'bg-gray-100 text-gray-500 border-gray-200'
                }

                return (
                  <TableRow key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell className="font-mono font-bold text-xs text-gray-900">
                      <Link href={`/admin/orders/${order.id}`} className="hover:underline">
                        #{order.order_number || order.id.substring(0, 8)}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-gray-900 text-xs">{cust?.name || 'Client Invité'}</div>
                      <div className="text-[11px] text-gray-400 font-mono">{cust?.phone || '—'}</div>
                    </TableCell>
                    <TableCell className="text-xs text-gray-600">
                      {order.delivery_commune} (Wilaya {order.delivery_wilaya})
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusCfg.badgeClass}`}
                      >
                        {statusCfg.label}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-mono ${
                          order.payment_status === 'COLLECTED'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {order.payment_status === 'COLLECTED' ? 'ENCAISSÉ' : 'À ENCAISSER'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold text-sm text-gray-900">
                      {Number(order.total).toLocaleString('fr-FR')} DA
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/orders/${order.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                            Gérer
                          </Button>
                        </Link>

                        <DropdownMenu>
                          <DropdownMenuTrigger className="h-8 w-8 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-hidden">
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel className="text-xs text-gray-500 font-normal">Actions Commande</DropdownMenuLabel>
                            <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => router.push(`/admin/orders/${order.id}`)}>
                              <ExternalLink className="h-3.5 w-3.5 mr-2 text-gray-400" />
                              Détails & Traitement
                            </DropdownMenuItem>

                            {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                              <DropdownMenuItem
                                className="text-xs cursor-pointer text-amber-700 focus:text-amber-800 focus:bg-amber-50"
                                onClick={() => {
                                  setSelectedOrder(order)
                                  setDialogAction('cancel')
                                }}
                              >
                                <Ban className="h-3.5 w-3.5 mr-2" />
                                Annuler la commande
                              </DropdownMenuItem>
                            )}

                            {order.status !== 'DELIVERED' && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-xs cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
                                  onClick={() => {
                                    setSelectedOrder(order)
                                    setDialogAction('delete')
                                  }}
                                >
                                  <Trash2 className="h-3.5 w-3.5 mr-2" />
                                  Supprimer (Test/Brouillon)
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-gray-400">
                  <Package className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p>Aucune commande trouvée.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Confirmation Dialog for Cancel or Delete */}
      <AlertDialog open={!!dialogAction} onOpenChange={(open: boolean) => !open && setDialogAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className={dialogAction === 'delete' ? 'text-red-600' : 'text-gray-900'}>
              {dialogAction === 'delete'
                ? `Supprimer la commande #${selectedOrder?.order_number} ?`
                : `Annuler la commande #${selectedOrder?.order_number} ?`}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-gray-500 leading-relaxed">
              {dialogAction === 'delete'
                ? 'Cette action supprimera définitivement cette commande test de la base de données. Ne peut être annulé.'
                : 'La commande passera au statut Annulée. L\'historique opérationnel sera conservé.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing} className="text-xs">
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleActionConfirm}
              disabled={isProcessing}
              className={`text-xs font-semibold ${
                dialogAction === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700'
              } text-white`}
            >
              {isProcessing ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : null}
              {dialogAction === 'delete' ? 'Supprimer' : 'Confirmer l\'annulation'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
