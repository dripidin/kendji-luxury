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
  initialTimeline = []
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
      setActionMessage({ text: "Erreur de communication transporteur.", isError: true })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle COD cash reconciliation
  const handleReconciliation = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setActionMessage(null)

    try {
      const res = await reconcileCodPaymentAction(orderId, orderNumber, total, Number(collectedAmount), reconciliationNote)
      if (res.success) {
        setPaymentStatus(res.data?.status === "DISCREPANCY" ? "UNPAID (Écart)" : "COLLECTED (Rapproché)")
        setActionMessage({ text: res.message || "Rapprochement enregistré.", isError: false })
      } else {
        setActionMessage({ text: res.error || "Erreur de rapprochement.", isError: true })
      }
    } catch {
      setActionMessage({ text: "Erreur lors du rapprochement.", isError: true })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Feedback banner */}
      {actionMessage && (
        <div className={`p-4 rounded-lg text-xs flex items-center gap-3 ${
          actionMessage.isError ? "bg-red-50 text-red-800 border border-red-200" : "bg-emerald-50 text-emerald-800 border border-emerald-200"
        }`}>
          {actionMessage.isError ? <ShieldAlert size={16} /> : <CheckCircle2 size={16} />}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* 1. Operational State Transitions */}
      <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-gray-900 flex items-center gap-2">
            <Clock size={16} className="text-gray-500" />
            <span>Workflow & Statut Opérationnel</span>
          </h3>
          <Badge className={`border ${currentConfig.badgeClass}`}>
            {currentConfig.label}
          </Badge>
        </div>

        <p className="text-xs text-gray-500">
          {currentConfig.description}
        </p>

        {allowedTransitions.length > 0 ? (
          <div className="pt-2">
            <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block mb-2">
              Changer le statut vers :
            </span>
            <div className="flex flex-wrap gap-2">
              {allowedTransitions.map((statusKey) => (
                <Button
                  key={statusKey}
                  onClick={() => handleTransition(statusKey)}
                  disabled={isLoading}
                  size="sm"
                  variant={statusKey === "CANCELLED" ? "destructive" : "default"}
                  className="text-xs gap-1.5"
                >
                  {isLoading && <Loader2 size={12} className="animate-spin" />}
                  <span>Passer à : {ORDER_STATUS_CONFIG[statusKey]?.label || statusKey}</span>
                  <ArrowRight size={12} />
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-3 bg-gray-50 border rounded text-xs text-gray-500 italic">
            Cette commande a atteint son état terminal ({currentConfig.label}).
          </div>
        )}
      </div>

      {/* 2. Courier Shipping Dispatch */}
      <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-gray-900 flex items-center gap-2">
            <Truck size={16} className="text-gray-500" />
            <span>Expédition & Transporteur</span>
          </h3>
          {trackingNumber ? (
            <Badge variant="outline" className="bg-sky-50 text-sky-800 border-sky-200">
              Colis Enregistré
            </Badge>
          ) : (
            <Badge variant="outline" className="text-gray-500">
              En attente d&apos;expédition
            </Badge>
          )}
        </div>

        {trackingNumber ? (
          <div className="p-4 bg-sky-50/50 border border-sky-100 rounded-lg space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Transporteur:</span>
              <span className="font-semibold text-gray-900">{courierProvider || "Transport Express"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">N° de Suivi:</span>
              <span className="font-mono font-bold text-gray-900">{trackingNumber}</span>
            </div>
            {trackingUrl && (
              <div className="pt-2">
                <a
                  href={trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-sky-700 hover:underline inline-flex items-center gap-1"
                >
                  <span>Suivre sur le portail transporteur</span>
                  <ArrowRight size={12} />
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-gray-500">
              Générez le bordereau d&apos;expédition et transmettez les coordonnées de livraison au transporteur actif (Yalidine, ZR Express ou Sandbox).
            </p>
            <Button
              onClick={handleDispatchShipment}
              disabled={isLoading || currentStatus === "CANCELLED"}
              size="sm"
              className="w-full bg-[#1A1A1A] hover:bg-black text-white text-xs gap-2"
            >
              {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Truck size={14} />}
              <span>Créer l&apos;Expédition Transporteur</span>
            </Button>
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

      {/* 4. Timeline / Audit Trail */}
      <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="font-semibold text-sm text-gray-900 flex items-center gap-2">
          <History size={16} className="text-gray-500" />
          <span>Journal d&apos;Audit & Chronologie</span>
        </h3>

        {timeline.length > 0 ? (
          <div className="space-y-3 divide-y divide-gray-100 max-h-60 overflow-y-auto pr-1">
            {timeline.map((ev) => (
              <div key={ev.id} className="pt-3 first:pt-0 text-xs">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-gray-900">{ev.title}</span>
                  <span className="text-[10px] text-gray-400 font-mono">
                    {new Date(ev.timestamp).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                {ev.description && <p className="text-gray-600 text-[11px] mt-0.5">{ev.description}</p>}
                <span className="text-[10px] text-gray-400 block mt-0.5 font-mono">Acteur: {ev.actor}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic">Aucun événement enregistré.</p>
        )}
      </div>

    </div>
  )
}
