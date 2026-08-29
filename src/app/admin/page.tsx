import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, ShoppingCart, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Attempt to fetch metrics safely
  const [{ count: productsCount, error: productsError }, { count: ordersCount, error: ordersError }, { count: customersCount, error: customersError }] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('customers').select('*', { count: 'exact', head: true })
  ])

  const dbUnavailable = !!productsError || !!ordersError || !!customersError

  const metrics = [
    { title: 'Total Products', value: dbUnavailable ? 'Unavailable' : (productsCount || 0), icon: Package },
    { title: 'Total Orders', value: dbUnavailable ? 'Unavailable' : (ordersCount || 0), icon: ShoppingCart },
    { title: 'Customers', value: dbUnavailable ? 'Unavailable' : (customersCount || 0), icon: Users },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-500 mt-2">Overview of your store performance and metrics.</p>
      </div>

      {dbUnavailable && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-4">
          <p className="font-semibold">Database Connection Unavailable</p>
          <p className="text-sm mt-1">Unable to connect to the Supabase instance. Metrics and data cannot be displayed.</p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
