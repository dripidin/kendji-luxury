import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, User, Phone, Mail, Calendar, Package, ShoppingBag, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export const dynamic = 'force-dynamic'

interface CustomerDetailPageProps {
  params: Promise<{ id: string }> | { id: string }
}

const STATUS_BADGES: Record<string, { label: string; classes: string }> = {
  PENDING: { label: 'En attente', classes: 'bg-amber-50 text-amber-700 border-amber-200' },
  CONFIRMED: { label: 'Confirmée', classes: 'bg-blue-50 text-blue-700 border-blue-200' },
  PREPARING: { label: 'Préparation', classes: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  READY_TO_SHIP: { label: 'Prêt à expédier', classes: 'bg-purple-50 text-purple-700 border-purple-200' },
  SHIPPED: { label: 'En cours', classes: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  DELIVERED: { label: 'Livrée', classes: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  RETURNED: { label: 'Retournée', classes: 'bg-red-50 text-red-700 border-red-200' },
  CANCELLED: { label: 'Annulée', classes: 'bg-gray-100 text-gray-500 border-gray-200' }
}

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const resolvedParams = await Promise.resolve(params)
  const id = resolvedParams.id
  const supabase = createAdminClient()

  const { data: customer, error } = await supabase
    .from('customers')
    .select(`
      id,
      name,
      phone,
      email,
      created_at,
      orders (
        id,
        order_number,
        status,
        payment_status,
        subtotal,
        delivery_fee,
        total,
        delivery_wilaya,
        delivery_commune,
        delivery_address,
        created_at,
        order_items (
          id,
          product_name_snapshot,
          variant_label_snapshot,
          quantity,
          unit_price,
          line_total
        )
      )
    `)
    .eq('id', id)
    .single()

  if (error || !customer) {
    notFound()
  }

  const rawOrders = (customer.orders || []) as any[]
  const sortedOrders = [...rawOrders].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  const validOrders = sortedOrders.filter(o => o.status !== 'CANCELLED')
  const totalSpent = validOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0)
  const totalItems = validOrders.reduce((sum, o) => {
    const items = o.order_items || []
    return sum + items.reduce((iSum: number, i: any) => iSum + (Number(i.quantity) || 1), 0)
  }, 0)
  const avgOrderValue = validOrders.length > 0 ? Math.round(totalSpent / validOrders.length) : 0

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/customers" className="text-gray-400 hover:text-gray-900 transition-colors">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">{customer.name}</h1>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Client enregistré depuis le{' '}
            {new Date(customer.created_at).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Profile & KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Contact info card */}
        <div className="bg-white border rounded-xl p-5 shadow-sm space-y-3">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Coordonnées</span>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-gray-800 font-mono">
              <Phone className="h-3.5 w-3.5 text-gray-400" />
              <span>{customer.phone}</span>
            </div>
            {customer.email && (
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="h-3.5 w-3.5 text-gray-400" />
                <span>{customer.email}</span>
              </div>
            )}
          </div>
        </div>

        {/* Total Spent */}
        <div className="bg-white border rounded-xl p-5 shadow-sm space-y-1">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Dépenses Totales</span>
          <p className="text-2xl font-bold text-gray-900 font-mono">{totalSpent.toLocaleString('fr-FR')} DA</p>
          <span className="text-[11px] text-emerald-600 font-medium">Panier moyen: {avgOrderValue.toLocaleString('fr-FR')} DA</span>
        </div>

        {/* Total Orders */}
        <div className="bg-white border rounded-xl p-5 shadow-sm space-y-1">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Commandes</span>
          <p className="text-2xl font-bold text-gray-900 font-mono">{validOrders.length}</p>
          <span className="text-[11px] text-gray-400">{sortedOrders.length} enregistrées au total</span>
        </div>

        {/* Items Purchased */}
        <div className="bg-white border rounded-xl p-5 shadow-sm space-y-1">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Bijoux Achetés</span>
          <p className="text-2xl font-bold text-gray-900 font-mono">{totalItems}</p>
          <span className="text-[11px] text-gray-400">Pièces de haute joaillerie</span>
        </div>
      </div>

      {/* Order History */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-gray-500" />
          <span>Historique des Commandes</span>
        </h2>

        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50/80">
              <TableRow>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">N° Commande</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Date</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Articles</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Destination</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Statut</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-right">Total (COD)</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100">
              {sortedOrders.length > 0 ? (
                sortedOrders.map(order => {
                  const statusCfg = STATUS_BADGES[order.status] || {
                    label: order.status,
                    classes: 'bg-gray-100 text-gray-500 border-gray-200'
                  }
                  const items = (order.order_items || []) as any[]

                  return (
                    <TableRow key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <TableCell className="font-mono font-bold text-xs text-gray-900">
                        #{order.order_number || order.id.substring(0, 8)}
                      </TableCell>
                      <TableCell className="text-xs text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </TableCell>
                      <TableCell className="text-xs text-gray-700 max-w-xs">
                        {items.length > 0 ? (
                          items.map(i => `${i.quantity}× ${i.product_name_snapshot}`).join(', ')
                        ) : (
                          <span className="italic text-gray-400">Bijou KenDji</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-gray-600">
                        {order.delivery_commune} (Wilaya {order.delivery_wilaya})
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusCfg.classes}`}
                        >
                          {statusCfg.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold text-sm text-gray-900">
                        {Number(order.total).toLocaleString('fr-FR')} DA
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/admin/orders/${order.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                            Voir <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-400 text-xs">
                    Aucune commande enregistrée pour ce client.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
