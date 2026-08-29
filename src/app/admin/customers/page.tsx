import { createAdminClient } from '@/lib/supabase/admin'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Users } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Customer {
  id: string
  name: string
  phone: string
  email: string | null
  created_at: string
}

export default async function AdminCustomers() {
  const supabase = createAdminClient()

  const { data: customers, error } = await supabase
    .from('customers')
    .select('id, name, phone, email, created_at')
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Clients</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Registre des clients ayant passé commande via la boutique.
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1 bg-white text-xs font-mono">
          {customers?.length ?? 0} Clients
        </Badge>
      </div>

      {error ? (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-4">
          <p className="font-semibold">Erreur de connexion à la base de données</p>
          <p className="text-sm mt-1 text-amber-700">{error.message}</p>
        </div>
      ) : (
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50/80">
              <TableRow>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Nom</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Téléphone</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Email</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider">Date d&apos;inscription</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100">
              {customers && customers.length > 0 ? (
                (customers as Customer[]).map((customer) => (
                  <TableRow key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell className="font-medium text-gray-900">{customer.name}</TableCell>
                    <TableCell className="font-mono text-sm text-gray-600">{customer.phone}</TableCell>
                    <TableCell className="text-sm text-gray-500">{customer.email || <span className="italic text-gray-300">—</span>}</TableCell>
                    <TableCell className="text-xs text-gray-500">
                      {new Date(customer.created_at).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-gray-400">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p>Aucun client enregistré.</p>
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
