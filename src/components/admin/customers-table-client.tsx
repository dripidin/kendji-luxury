'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Download, Users, ChevronRight } from 'lucide-react'

export interface CustomerMetricsItem {
  id: string
  name: string
  phone: string
  email: string | null
  created_at: string
  order_count: number
  items_purchased: number
  total_spent: number
  last_order_date: string | null
}

export function CustomersTableClient({ initialCustomers }: { initialCustomers: CustomerMetricsItem[] }) {
  const [searchTerm, setSearchTerm] = useState('')

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return initialCustomers
    const q = searchTerm.toLowerCase()
    return initialCustomers.filter(
      c =>
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        (c.email && c.email.toLowerCase().includes(q))
    )
  }, [initialCustomers, searchTerm])

  const handleExportCsv = () => {
    if (filtered.length === 0) return

    const headers = [
      'ID Client',
      'Nom & Prénom',
      'Téléphone',
      'Email',
      'Nombre de Commandes',
      'Articles Achetés',
      'Total Dépensé (DZD)',
      'Date Première Commande / Inscription',
      'Date Dernière Commande'
    ]

    const rows = filtered.map(c => [
      `"${c.id}"`,
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.phone}"`,
      `"${c.email || ''}"`,
      c.order_count,
      c.items_purchased,
      c.total_spent,
      `"${new Date(c.created_at).toISOString().split('T')[0]}"`,
      `"${c.last_order_date ? new Date(c.last_order_date).toISOString().split('T')[0] : 'N/A'}"`
    ])

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `kendji_clients_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 max-w-sm flex-1">
          <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <Input
            placeholder="Rechercher par nom, téléphone, email…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="h-9 bg-white"
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleExportCsv}
          disabled={filtered.length === 0}
          className="text-xs h-9 bg-white hover:bg-gray-50 border-gray-200"
        >
          <Download className="h-4 w-4 mr-2 text-gray-600" />
          Exporter CSV ({filtered.length})
        </Button>
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/80">
            <TableRow>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Client</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Contact</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider text-center">Commandes</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider text-center">Pièces</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider text-right">Dépenses (DZD)</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Dernier Achat</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider text-right">Détails</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100">
            {filtered.length > 0 ? (
              filtered.map(cust => (
                <TableRow key={cust.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell>
                    <Link
                      href={`/admin/customers/${cust.id}`}
                      className="font-medium text-gray-900 text-sm hover:underline block"
                    >
                      {cust.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="font-mono text-xs text-gray-800">{cust.phone}</div>
                    {cust.email && <div className="text-[11px] text-gray-400">{cust.email}</div>}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-mono font-semibold text-xs bg-gray-100 px-2 py-0.5 rounded">
                      {cust.order_count}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-mono text-xs text-gray-600">{cust.items_purchased}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-mono font-bold text-sm text-gray-900">
                      {cust.total_spent.toLocaleString('fr-FR')} DA
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-gray-500">
                    {cust.last_order_date
                      ? new Date(cust.last_order_date).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })
                      : '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/customers/${cust.id}`}>
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-gray-500 hover:text-gray-900">
                        Profil <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-gray-400">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p>Aucun client trouvé.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
