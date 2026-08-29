import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package, ShoppingCart, Users, TrendingUp, AlertCircle, Clock, CheckCircle, Layers } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const supabase = createAdminClient()

  const [
    { count: productsCount,   error: err1 },
    { count: ordersCount,     error: err2 },
    { count: customersCount,  error: err3 },
    { data: recentOrders,     error: err4 },
    { count: pendingCount,    error: err5 },
    { count: publishedCount,  error: err6 },
    { count: collectionsCount, error: err7 },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('customers').select('*', { count: 'exact', head: true }),
    supabase.from('orders')
      .select('id, order_number, status, total, delivery_wilaya, created_at, customers(name, phone)')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'PENDING'),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'PUBLISHED'),
    supabase.from('collections').select('*', { count: 'exact', head: true }),
  ])

  const dbUnavailable = !!(err1 || err2 || err3)

  const metrics = [
    {
      title: 'Produits Publiés',
      value: dbUnavailable ? '—' : (publishedCount ?? 0),
      total: dbUnavailable ? undefined : (productsCount ?? 0),
      icon: Package,
      href: '/admin/products',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      title: 'Commandes Totales',
      value: dbUnavailable ? '—' : (ordersCount ?? 0),
      icon: ShoppingCart,
      href: '/admin/orders',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      alert: pendingCount && pendingCount > 0 ? `${pendingCount} en attente` : undefined
    },
    {
      title: 'Clients',
      value: dbUnavailable ? '—' : (customersCount ?? 0),
      icon: Users,
      href: '/admin/customers',
      color: 'text-violet-600',
      bg: 'bg-violet-50'
    },
    {
      title: 'Collections',
      value: dbUnavailable ? '—' : (collectionsCount ?? 0),
      icon: Layers,
      href: '/admin/collections',
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    },
  ]

  const STATUS_FR: Record<string, { label: string; icon: React.ElementType; classes: string }> = {
    PENDING:    { label: 'En attente',   icon: Clock,        classes: 'bg-amber-50 text-amber-700 border-amber-200' },
    CONFIRMED:  { label: 'Confirmé',     icon: CheckCircle,  classes: 'bg-blue-50 text-blue-700 border-blue-200' },
    SHIPPED:    { label: 'Expédié',      icon: TrendingUp,   classes: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    DELIVERED:  { label: 'Livré',        icon: CheckCircle,  classes: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    CANCELLED:  { label: 'Annulé',       icon: AlertCircle,  classes: 'bg-red-50 text-red-700 border-red-200' },
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Tableau de Bord</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Vue d&apos;ensemble des performances de la boutique KenDji Luxury.
        </p>
      </div>

      {/* DB error banner */}
      {dbUnavailable && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">Connexion base de données indisponible</p>
            <p className="text-xs mt-1 text-amber-700">
              Impossible de récupérer les métriques. Vérifiez la configuration Supabase.
            </p>
          </div>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Link key={metric.title} href={metric.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-gray-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{metric.title}</CardTitle>
                <div className={`p-2 rounded-lg ${metric.bg}`}>
                  <metric.icon className={`h-4 w-4 ${metric.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{metric.value}</div>
                {metric.total !== undefined && metric.total !== metric.value && (
                  <p className="text-xs text-gray-400 mt-0.5">sur {metric.total} au total</p>
                )}
                {metric.alert && (
                  <Badge variant="outline" className="mt-2 text-[10px] bg-amber-50 text-amber-700 border-amber-200">
                    ⚡ {metric.alert}
                  </Badge>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50/60">
          <h2 className="text-sm font-semibold text-gray-900">Commandes Récentes</h2>
          <Link href="/admin/orders" className="text-xs text-blue-600 hover:underline font-medium">
            Voir tout →
          </Link>
        </div>

        {err4 || !recentOrders || recentOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">{err4 ? 'Erreur de chargement' : 'Aucune commande pour l\'instant.'}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentOrders.map((order: {
              id: string;
              order_number: string;
              status: string;
              total: number;
              delivery_wilaya: string;
              created_at: string;
              customers: { name?: string; phone?: string } | { name?: string; phone?: string }[] | null;
            }) => {
              const cust = Array.isArray(order.customers) ? order.customers[0] : order.customers
              const statusCfg = STATUS_FR[order.status] || { label: order.status, icon: Clock, classes: 'bg-gray-100 text-gray-600 border-gray-200' }
              return (
                <Link key={order.id} href={`/admin/orders/${order.id}`} className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50/50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="font-mono font-bold text-sm text-gray-800 w-32">{order.order_number}</div>
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{cust?.name || 'Client Invité'}</div>
                      <div className="text-[11px] text-gray-400">W.{order.delivery_wilaya}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusCfg.classes}`}>
                      {statusCfg.label}
                    </span>
                    <div className="font-mono font-bold text-sm text-gray-900 w-24 text-right">
                      {Number(order.total).toLocaleString('fr-FR')} DA
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { href: '/admin/products/new', label: '+ Nouveau Produit', classes: 'bg-gray-900 text-white hover:bg-gray-800' },
          { href: '/admin/orders', label: 'Gérer les Commandes', classes: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50' },
          { href: '/admin/media', label: 'Médiathèque', classes: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50' },
          { href: '/admin/settings', label: 'Paramètres', classes: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50' },
        ].map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-lg px-4 py-3 text-sm font-medium text-center transition-colors ${link.classes}`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
