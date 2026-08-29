import { createAdminClient } from '@/lib/supabase/admin'
import { Badge } from '@/components/ui/badge'
import { CustomersTableClient, CustomerMetricsItem } from '@/components/admin/customers-table-client'

export const dynamic = 'force-dynamic'

export default async function AdminCustomers() {
  const supabase = createAdminClient()

  // Fetch customers with their orders and items
  const { data: customers, error } = await supabase
    .from('customers')
    .select(`
      id,
      name,
      phone,
      email,
      created_at,
      orders (
        id,
        status,
        total,
        created_at,
        order_items (
          quantity
        )
      )
    `)
    .order('created_at', { ascending: false })

  const rawCustomers = (customers || []) as any[]

  const customerMetrics: CustomerMetricsItem[] = rawCustomers.map(c => {
    const validOrders = (c.orders || []).filter((o: any) => o.status !== 'CANCELLED')
    const totalSpent = validOrders.reduce((sum: number, o: any) => sum + (Number(o.total) || 0), 0)
    const itemsPurchased = validOrders.reduce((sum: number, o: any) => {
      const orderItems = o.order_items || []
      return sum + orderItems.reduce((iSum: number, item: any) => iSum + (Number(item.quantity) || 1), 0)
    }, 0)

    const sortedOrderDates = (c.orders || [])
      .map((o: any) => o.created_at)
      .filter(Boolean)
      .sort((a: string, b: string) => new Date(b).getTime() - new Date(a).getTime())

    const lastOrderDate = sortedOrderDates[0] || null

    return {
      id: c.id,
      name: c.name,
      phone: c.phone,
      email: c.email,
      created_at: c.created_at,
      order_count: validOrders.length,
      items_purchased: itemsPurchased,
      total_spent: totalSpent,
      last_order_date: lastOrderDate
    }
  })

  const totalClients = customerMetrics.length
  const totalRevenue = customerMetrics.reduce((sum, c) => sum + c.total_spent, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Intelligence Clients <span className="text-gray-400 text-lg font-normal">| الزبائن</span>
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Répertoire opérationnel des acheteurs, historique d&apos;achat et métriques de fidélité.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant="outline" className="px-3 py-1 bg-white text-xs font-mono">
            {totalClients} Clients Enregistrés
          </Badge>
          <Badge variant="outline" className="px-3 py-1 bg-emerald-50 text-emerald-800 border-emerald-200 text-xs font-mono font-bold">
            Total Encaissé: {totalRevenue.toLocaleString('fr-FR')} DA
          </Badge>
        </div>
      </div>

      {error ? (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-4">
          <p className="font-semibold">Erreur de connexion à la base de données</p>
          <p className="text-sm mt-1 text-amber-700">{error.message}</p>
        </div>
      ) : (
        <CustomersTableClient initialCustomers={customerMetrics} />
      )}
    </div>
  )
}
