"use client"

import { useState } from "react"
import { OrderStatus, ORDER_STATUS_CONFIG, getAllowedNextTransitions } from "@/lib/commerce/order-status"
import { updateOrderStatusAction, createShipmentAction, reconcileCodPaymentAction } from "@/lib/actions/order-operations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Truck, CheckCircle2, Clock, ShieldAlert, ArrowRight, Loader2, DollarSign, History } from "lucide-react"
import { OrderTimelineEvent } from "@/lib/commerce/order-timeline"
import { ShippingLabelModal } from "@/components/admin/shipping-label-modal"

interface OrderOperationsPanelProps {
  orderId: string;
  orderNumber: string;
  currentStatus: OrderStatus;
  paymentStatus: string;
  total: number;
  trackingNumber?: string;
  trackingUrl?: string;
  courierProvider?: string;
  initialTimeline?: OrderTimelineEvent[];
  recipientName?: string;
  recipientPhone?: string;
  wilaya?: string;
  commune?: string;
  address?: string;
  deliveryMethod?: string;
  items?: { name: string; quantity: number }[];
}

export function OrderOperationsPanel({
  orderId,
  orderNumber,
  currentStatus: initialStatus,
  paymentStatus: initialPaymentStatus,
  total,
  trackingNumber: initialTrackingNumber,
  trackingUrl: initialTrackingUrl,
  courierProvider: initialCourier,
  initialTimeline = [],
  recipientName = "Client KenDji",
  recipientPhone = "0550000000",
  wilaya = "16 - Alger",
  commune = "Alger Centre",
  address = "Boutique KenDji",
  deliveryMethod = "Domicile",
  items = [{ name: "Bijou KenDji Luxury", quantity: 1 }]
}: OrderOperationsPanelProps) {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(initialStatus)
  const [paymentStatus, setPaymentStatus] = useState<string>(initialPaymentStatus)
  const [trackingNumber, setTrackingNumber] = useState<string | undefined>(initialTrackingNumber)
  const [trackingUrl, setTrackingUrl] = useState<string | undefined>(initialTrackingUrl)
  const [courierProvider, setCourierProvider] = useState<string | undefined>(initialCourier)
  const [timeline, setTimeline] = useState<OrderTimelineEvent[]>(initialTimeline)

  const [isLoading, setIsLoading] = useState(false)
  const [actionMessage, setActionMessage] = useState<{ text: string; isError: boolean } | null>(null)

  // Reconciliation form state
  const [collectedAmount, setCollectedAmount] = useState<number>(total)
  const [reconciliationNote, setReconciliationNote] = useState("")

  const allowedTransitions = getAllowedNextTransitions(currentStatus)
  const currentConfig = ORDER_STATUS_CONFIG[currentStatus]

  // Handle status transition
  const handleTransition = async (nextStatus: OrderStatus) => {
    setIsLoading(true)
    setActionMessage(null)

    try {
      const res = await updateOrderStatusAction(orderId, nextStatus)
      if (res.success) {
        setCurrentStatus(nextStatus)
        setActionMessage({ text: res.message || "Statut mis à jour.", isError: false })
        // Add optimistic timeline entry
        setTimeline(prev => [
          ...prev,
          {
            id: `ev_${Date.now()}`,
            orderId,
            eventType: "ORDER_CONFIRMED",
            title: `Statut passé à ${ORDER_STATUS_CONFIG[nextStatus]?.label || nextStatus}`,
            actor: "ADMIN_OPERATOR",
            timestamp: new Date().toISOString()
          }
        ])
      } else {
        setActionMessage({ text: res.error || "Erreur lors du changement de statut.", isError: true })
      }
    } catch {
      setActionMessage({ text: "Erreur de communication avec le serveur.", isError: true })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle courier shipment dispatch
  const handleDispatchShipment = async () => {
    setIsLoading(true)
    setActionMessage(null)

    try {
      const res = await createShipmentAction(orderId)
      if (res.success && res.data) {
        setTrackingNumber(res.data.trackingNumber as string)
        setTrackingUrl(res.data.trackingUrl as string)
        setCourierProvider(res.data.provider as string)
        setCurrentStatus("READY_TO_SHIP")
        setActionMessage({ text: res.message || "Bordereau transporteur généré.", isError: false })
      } else {
        setActionMessage({ text: res.error || "Échec de création du bordereau.", isError: true })
      }
    } catch {
      setActionMessage({ text: "Erreur de connexion transporteur.", isError: true })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle cash reconciliation
  const handleReconciliation = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setActionMessage(null)

    try {
      const res = await reconcileCodPaymentAction(orderId, orderNumber, total, collectedAmount, reconciliationNote)
      if (res.success && res.data) {
        setPaymentStatus(res.data.status === "DISCREPANCY" ? "UNPAID" : "COLLECTED")
        setActionMessage({ text: res.message || "Rapprochement enregistré.", isError: false })
      } else {
        setActionMessage({ text: res.error || "Échec du rapprochement.", isError: true })
      }
    } catch {
      setActionMessage({ text: "Erreur serveur.", isError: true })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">

      {/* Notification banner */}
      {actionMessage && (
        <div className={`p-4 rounded-lg text-xs font-medium border ${
          actionMessage.isError 
            ? "bg-red-50 text-red-800 border-red-200" 
            : "bg-emerald-50 text-emerald-800 border-emerald-200"
        }`}>
          {actionMessage.text}
        </div>
      )}

      {/* 1. Status Controls & State Machine */}
      <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block">Statut Actuel</span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentConfig?.badgeClass}`}>
                {currentConfig?.label || currentStatus}
              </span>
              {currentConfig?.labelAr && (
                <span className="text-xs text-gray-500 font-sans">({currentConfig.labelAr})</span>
              )}
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block">Paiement COD</span>
            <Badge 
              variant="outline" 
              className={`mt-1 font-mono text-[10px] ${
                paymentStatus === "COLLECTED" || paymentStatus === "RECONCILED"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
            >
              {paymentStatus === "COLLECTED" ? "ENCAISSÉ" : "À ENCAISSER"}
            </Badge>
          </div>
        </div>

        {/* Transition Action Buttons */}
        <div className="space-y-2">
          <Label className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Passer au statut suivant :</Label>
          <div className="flex flex-wrap gap-2">
            {allowedTransitions.length > 0 ? (
              allowedTransitions.map((next) => {
                const nextCfg = ORDER_STATUS_CONFIG[next]
                const isDestructive = next === "CANCELLED" || next === "RETURNED"

                return (
                  <Button
                    key={next}
                    onClick={() => handleTransition(next)}
                    disabled={isLoading}
                    variant={isDestructive ? "outline" : "default"}
                    size="sm"
                    className={`text-xs gap-1.5 ${
                      !isDestructive 
                        ? "bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-white" 
                        : "text-red-700 border-red-200 hover:bg-red-50"
                    }`}
                  >
                    {isLoading ? <Loader2 size={12} className="animate-spin" /> : <ArrowRight size={12} />}
                    <span>{nextCfg?.label || next}</span>
                  </Button>
                )
              })
            ) : (
              <p className="text-xs text-gray-400 italic">Aucune action suivante autorisée (statut final).</p>
            )}
          </div>
        </div>
      </div>

      {/* 2. Courier Shipment & Printable Label */}
      <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-gray-900 flex items-center gap-2">
            <Truck size={16} className="text-gray-500" />
            <span>Expédition Transporteur (Algérie)</span>
          </h3>
          {trackingNumber ? (
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
              Expédié
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
              En attente d&apos;expédition
            </Badge>
          )}
        </div>

        {trackingNumber ? (
          <div className="p-4 bg-sky-50/50 border border-sky-100 rounded-lg space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Transporteur:</span>
              <span className="font-semibold text-gray-900">{courierProvider || "Yalidine Express"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">N° de Suivi:</span>
              <span className="font-mono font-bold text-gray-900">{trackingNumber}</span>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-sky-100">
              <ShippingLabelModal
                orderNumber={orderNumber}
                trackingNumber={trackingNumber}
                courierName={courierProvider || "Yalidine Express"}
                recipientName={recipientName}
                recipientPhone={recipientPhone}
                wilaya={wilaya}
                commune={commune}
                address={address}
                deliveryMethod={deliveryMethod}
                codAmount={total}
                items={items}
              />

              {trackingUrl && (
                <a
                  href={trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-sky-700 hover:underline inline-flex items-center gap-1"
                >
                  <span>Suivre en direct</span>
                  <ArrowRight size={12} />
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-gray-500">
              Cliquez ci-dessous pour transmettre cette commande confirmée directement à votre société de livraison (Ecotrack / Yalidine) et générer le numéro de suivi officiel.
            </p>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleDispatchShipment}
                disabled={isLoading || currentStatus === "CANCELLED"}
                size="sm"
                className="flex-1 bg-[#1A1A1A] hover:bg-black text-white text-xs gap-2 py-2.5 h-auto font-medium"
              >
                {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Truck size={14} />}
                <span>Expédition vers Transporteur</span>
              </Button>

              <ShippingLabelModal
                orderNumber={orderNumber}
                trackingNumber={`KJ-${orderNumber}`}
                courierName="Bordereau Manuel / Atelier"
                recipientName={recipientName}
                recipientPhone={recipientPhone}
                wilaya={wilaya}
                commune={commune}
                address={address}
                deliveryMethod={deliveryMethod}
                codAmount={total}
                items={items}
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. COD Cash Reconciliation */}
      <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-gray-900 flex items-center gap-2">
            <DollarSign size={16} className="text-gray-500" />
            <span>Rapprochement Financier (COD)</span>
          </h3>
          <Badge variant="outline" className="font-mono text-xs">
            {paymentStatus}
          </Badge>
        </div>

        <form onSubmit={handleReconciliation} className="space-y-3 font-sans text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-[11px] text-gray-500">Total Attendu (DZD)</Label>
              <Input
                disabled
                value={`${total.toLocaleString('fr-FR')} DA`}
                className="h-9 bg-gray-50 font-mono font-bold text-gray-900"
              />
            </div>
            <div>
              <Label className="text-[11px] text-gray-500">Montant Perçu Livreur (DZD)</Label>
              <Input
                type="number"
                value={collectedAmount}
                onChange={(e) => setCollectedAmount(Number(e.target.value))}
                className="h-9 font-mono"
              />
            </div>
          </div>

          <div>
            <Label className="text-[11px] text-gray-500">Note de Rapprochement (Optionnel)</Label>
            <Input
              placeholder="Ex: Bordereau reçu, virement bancaire du 29/08"
              value={reconciliationNote}
              onChange={(e) => setReconciliationNote(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="w-full text-xs"
          >
            {isLoading ? <Loader2 size={12} className="animate-spin mr-1" /> : null}
            <span>Valider le Rapprochement Financier</span>
          </Button>
        </form>
      </div>

      {/* 4. Order Audit Timeline */}
      <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="font-semibold text-sm text-gray-900 flex items-center gap-2">
          <History size={16} className="text-gray-500" />
          <span>Journal d&apos;Audit Opérationnel</span>
        </h3>

        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100 text-xs">
          {timeline.length > 0 ? (
            timeline.map((event) => (
              <div key={event.id} className="relative">
                <div className="absolute -left-6 top-0.5 w-2 h-2 rounded-full bg-gray-400 ring-4 ring-white" />
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">{event.title}</span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {new Date(event.timestamp).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  {event.description && (
                    <p className="text-gray-500 text-[11px]">{event.description}</p>
                  )}
                  <span className="text-[10px] text-gray-400 block font-mono">Par: {event.actor}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400 italic">Aucun événement enregistré.</p>
          )}
        </div>
      </div>

    </div>
  )
}
