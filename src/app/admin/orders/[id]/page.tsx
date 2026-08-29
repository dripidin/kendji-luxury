import { createAdminClient } from "@/lib/supabase/admin"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, User, MapPin, Package, Phone } from "lucide-react"
import { OrderStatus } from "@/lib/commerce/order-status"
import { OrderOperationsPanel } from "@/components/admin/order-operations-panel"
import { getOrderTimelineEvents } from "@/lib/commerce/order-timeline"

export const dynamic = "force-dynamic"

interface OrderDetailPageProps {
  params: Promise<{ id: string }> | { id: string }
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const resolvedParams = await Promise.resolve(params)
  const id = resolvedParams.id
  const supabase = createAdminClient()

  let orderData: {
    id: string;
    order_number: string;
    customer_id: string;
    status: OrderStatus;
    payment_method: string;
    payment_status: string;
    subtotal: number;
    delivery_fee: number;
    total: number;
    delivery_wilaya: string;
    delivery_commune: string;
    delivery_address: string;
    created_at: string;
    customers?: { name?: string; phone?: string; email?: string } | { name?: string; phone?: string; email?: string }[];
    order_items?: {
      id: string;
      product_name_snapshot: string;
      variant_label_snapshot?: string;
      unit_price: number;
      quantity: number;
      line_total: number;
    }[];
    deliveries?: {
      provider?: string;
      tracking_number?: string;
      status?: string;
    } | {
      provider?: string;
      tracking_number?: string;
      status?: string;
    }[];
  } | null = null

  try {
    const res = await supabase
      .from("orders")
      .select("*, customers(*), order_items(*), deliveries(*)")
      .eq("id", id)
      .single()

    if (res.data) {
      orderData = res.data
    }
  } catch {
    // Database query failed
  }

  // Fallback demo order when DB is offline or item is demo
  if (!orderData) {
    if (id.startsWith("demo-") || id === "1") {
      orderData = {
        id: id,
        order_number: "KJ-2026-8812",
        customer_id: "c-1",
        status: "CONFIRMED",
        payment_method: "COD",
        payment_status: "UNPAID",
        subtotal: 3000,
        delivery_fee: 500,
        total: 3500,
        delivery_wilaya: "16",
        delivery_commune: "Hydra",
        delivery_address: "12 Rue des Oliviers, Hydra, Alger",
        created_at: new Date().toISOString(),
        customers: { name: "Yasmine Mansouri", phone: "0550123456", email: "yasmine@example.com" },
        order_items: [
          {
            id: "oi-1",
            product_name_snapshot: "Parure Trèfle Quatrefeuilles 4 Pièces",
            variant_label_snapshot: "Or Jaune / Noir",
            unit_price: 1500,
            quantity: 2,
            line_total: 3000
          }
        ]
      }
    } else {
      notFound()
    }
  }

  const cust = Array.isArray(orderData.customers) ? orderData.customers[0] : orderData.customers
  const delivery = Array.isArray(orderData.deliveries) ? orderData.deliveries[0] : orderData.deliveries
  const timeline = getOrderTimelineEvents(orderData.id)

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      
      {/* Back Link & Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/orders" className="text-gray-400 hover:text-gray-900 transition-colors">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Commande #{orderData.order_number || orderData.id.substring(0, 8)}
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Créée le {new Date(orderData.created_at).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Order Content & Customer Details (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Customer & Destination Card */}
          <div className="bg-white border rounded-xl p-6 shadow-sm space-y-6">
            <h2 className="font-semibold text-sm text-gray-900 flex items-center gap-2 border-b pb-3">
              <User size={16} className="text-gray-500" />
              <span>Coordonnées Client & Livraison</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="space-y-1.5">
                <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block">
                  Destinataire
                </span>
                <p className="font-semibold text-sm text-gray-900">{cust?.name || "Client Invité"}</p>
                <div className="flex items-center gap-1.5 text-gray-600 font-mono">
                  <Phone size={12} />
                  <span>{cust?.phone || "Non renseigné"}</span>
                </div>
                {cust?.email && <p className="text-gray-500">{cust.email}</p>}
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block">
                  Adresse de Livraison
                </span>
                <div className="flex items-start gap-1.5 text-gray-800">
                  <MapPin size={14} className="shrink-0 mt-0.5 text-gray-400" />
                  <p className="leading-relaxed">
                    {orderData.delivery_address}<br />
                    <strong>{orderData.delivery_commune}</strong> (Wilaya {orderData.delivery_wilaya})
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Items Breakdown Card */}
          <div className="bg-white border rounded-xl p-6 shadow-sm space-y-6">
            <h2 className="font-semibold text-sm text-gray-900 flex items-center gap-2 border-b pb-3">
              <Package size={16} className="text-gray-500" />
              <span>Articles Commandés</span>
            </h2>

            <div className="divide-y divide-gray-100 text-xs">
              {orderData.order_items && orderData.order_items.length > 0 ? (
                orderData.order_items.map((item) => (
                  <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.product_name_snapshot}</h4>
                      {item.variant_label_snapshot && (
                        <span className="text-[11px] text-gray-500 block">{item.variant_label_snapshot}</span>
                      )}
                      <span className="text-[11px] text-gray-400 font-mono">
                        Qté: {item.quantity} × {Number(item.unit_price).toLocaleString("fr-FR")} DA
                      </span>
                    </div>
                    <span className="font-mono font-bold text-gray-900">
                      {Number(item.line_total).toLocaleString("fr-FR")} DA
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500 italic py-2">Détail des articles non disponible.</p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="border-t pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Sous-total articles</span>
                <span className="font-mono">{Number(orderData.subtotal).toLocaleString("fr-FR")} DA</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Frais de livraison</span>
                <span className="font-mono">{Number(orderData.delivery_fee).toLocaleString("fr-FR")} DA</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-gray-900 pt-2 border-t">
                <span>Total à encaisser (COD)</span>
                <span className="font-mono text-base">{Number(orderData.total).toLocaleString("fr-FR")} DA</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Operations Panel (5 cols) */}
        <div className="lg:col-span-5">
          <OrderOperationsPanel
            orderId={orderData.id}
            orderNumber={orderData.order_number || orderData.id.substring(0, 8)}
            currentStatus={orderData.status}
            paymentStatus={orderData.payment_status}
            total={Number(orderData.total)}
            trackingNumber={delivery?.tracking_number}
            courierProvider={delivery?.provider}
            initialTimeline={timeline}
          />
        </div>

      </div>

    </div>
  )
}
