import { createAdminClient } from "@/lib/supabase/admin"
import { Badge } from "@/components/ui/badge"
import { OrdersTableClient, OrderItemRecord } from "@/components/admin/orders-table-client"

export const dynamic = "force-dynamic"

const STATIC_DEMO_ORDERS: OrderItemRecord[] = [
  {
    id: "demo-ord-01",
    order_number: "KJ-2026-8812",
    customer_id: "c-1",
    status: "CONFIRMED",
    payment_method: "COD",
    payment_status: "UNPAID",
    total: 3500,
    delivery_wilaya: "16",
    delivery_commune: "Hydra",
    created_at: "2026-08-28T22:00:00.000Z",
    customers: { name: "Yasmine Mansouri", phone: "0550123456" }
  },
  {
    id: "demo-ord-02",
    order_number: "KJ-2026-7491",
    customer_id: "c-2",
    status: "PENDING",
    payment_method: "COD",
    payment_status: "UNPAID",
    total: 1900,
    delivery_wilaya: "31",
    delivery_commune: "Bir El Djir",
    created_at: "2026-08-28T21:00:00.000Z",
    customers: { name: "Karim Haddad", phone: "0661234567" }
  }
]

export default async function AdminOrdersPage() {
  const supabase = createAdminClient()

  let orders: OrderItemRecord[] = []
  let error: string | null = null

  try {
    const res = await supabase
      .from("orders")
      .select("*, customers(name, phone)")
      .order("created_at", { ascending: false })
      .limit(100)

    if (res.data && res.data.length > 0) {
      orders = res.data as OrderItemRecord[]
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    error = msg
  }

  // Fallback demo orders for testing when offline
  if (orders.length === 0 && !error) {
    orders = STATIC_DEMO_ORDERS
  }

  const pendingCount = orders.filter(o => o.status === 'PENDING').length
  const confirmedCount = orders.filter(o => o.status === 'CONFIRMED' || o.status === 'PREPARING').length
  const totalRevenue = orders
    .filter(o => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + (Number(o.total) || 0), 0)

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Gestion des Commandes (COD) <span className="text-gray-400 text-lg font-normal">| الطلبات</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Validation des commandes Cash on Delivery, bordereaux de livraison et encaissements.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant="outline" className="px-3 py-1 bg-white font-mono text-xs">
            {orders.length} Commandes
          </Badge>
          {pendingCount > 0 && (
            <Badge variant="outline" className="px-3 py-1 bg-amber-50 text-amber-800 border-amber-200 font-mono text-xs font-semibold">
              {pendingCount} À Traiter
            </Badge>
          )}
          <Badge variant="outline" className="px-3 py-1 bg-emerald-50 text-emerald-800 border-emerald-200 font-mono text-xs font-bold">
            Total: {totalRevenue.toLocaleString('fr-FR')} DA
          </Badge>
        </div>
      </div>

      {error ? (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-4">
          <p className="font-semibold">Erreur de chargement des commandes</p>
          <p className="text-sm mt-1 text-amber-700">{error}</p>
        </div>
      ) : (
        <OrdersTableClient initialOrders={orders} />
      )}
    </div>
  )
}
