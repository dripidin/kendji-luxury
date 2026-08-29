import { createAdminClient } from '@/lib/supabase/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Search } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminProducts() {
  const supabase = createAdminClient()
  
  let products: { id: string, name: string, base_price: number, status: string, created_at: string }[] | null = null
  let error = null
  try {
    const res = await supabase.from('products').select('id, name, base_price, status, created_at').order('created_at', { ascending: false }).limit(10)
    products = res.data
    error = res.error
  } catch (err) {
    error = err
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-gray-500 mt-2">Manage your catalog, variants, and pricing.</p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {error ? (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-4">
          <p className="font-semibold">Database Connection Unavailable</p>
          <p className="text-sm mt-1">Cannot load products at this time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 max-w-sm">
            <Search className="h-4 w-4 text-gray-500" />
            <Input placeholder="Search products..." className="h-9" />
          </div>
          
          <div className="rounded-md border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price (DZD)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products && products.length > 0 ? (
                  products.map((product: { id: string, name: string, base_price: number, status: string, created_at: string }) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.status}</TableCell>
                      <TableCell>{product.base_price}</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/admin/products/${product.id}`}>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                      No products found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}
