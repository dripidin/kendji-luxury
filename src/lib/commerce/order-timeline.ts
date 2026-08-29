/**
 * KenDji Luxury — Order Audit Timeline & Event Log
 */

export type OrderTimelineEventType =
  | "ORDER_CREATED"
  | "ORDER_CONFIRMED"
  | "ORDER_PREPARING"
  | "SHIPMENT_CREATED"
  | "SHIPMENT_IN_TRANSIT"
  | "SHIPMENT_DELIVERED"
  | "SHIPMENT_RETURNED"
  | "ORDER_CANCELLED"
  | "COD_COLLECTED"
  | "COD_RECONCILED";

export interface OrderTimelineEvent {
  id: string;
  orderId: string;
  eventType: OrderTimelineEventType;
  title: string;
  description?: string;
  actor: string; // e.g. 'CLIENT_CHECKOUT', 'ADMIN_OPERATOR', 'COURIER_SYNC'
  trackingNumber?: string;
  timestamp: string; // ISO 8601
  metadata?: Record<string, unknown>;
}

export const TIMELINE_EVENT_TITLES: Record<OrderTimelineEventType, string> = {
  ORDER_CREATED: "Commande Reçue",
  ORDER_CONFIRMED: "Confirmation Client Effectuée",
  ORDER_PREPARING: "Mise en Préparation Atelier",
  SHIPMENT_CREATED: "Bordereau Transport Généré",
  SHIPMENT_IN_TRANSIT: "Colis en Acheminement Transporteur",
  SHIPMENT_DELIVERED: "Colis Livré avec Succès",
  SHIPMENT_RETURNED: "Colis Retourné / Échec Livraison",
  ORDER_CANCELLED: "Commande Annulée",
  COD_COLLECTED: "Espèces Perçues par le Livreur",
  COD_RECONCILED: "Rapprochement Financier Effectué"
};

// Lightweight in-memory fallback audit store for local sandbox / non-connected db
const inMemoryAuditStore: Map<string, OrderTimelineEvent[]> = new Map();

/**
 * Appends an audit event to an order's timeline
 */
export function recordTimelineEvent(
  orderId: string,
  eventType: OrderTimelineEventType,
  actor: string = "ADMIN_OPERATOR",
  options?: {
    description?: string;
    trackingNumber?: string;
    metadata?: Record<string, unknown>;
  }
): OrderTimelineEvent {
  const event: OrderTimelineEvent = {
    id: `ev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    orderId,
    eventType,
    title: TIMELINE_EVENT_TITLES[eventType] || eventType,
    description: options?.description,
    actor,
    trackingNumber: options?.trackingNumber,
    timestamp: new Date().toISOString(),
    metadata: options?.metadata
  };

  const existing = inMemoryAuditStore.get(orderId) || [];
  existing.push(event);
  inMemoryAuditStore.set(orderId, existing);

  return event;
}

/**
 * Retrieves the complete chronological audit timeline for an order
 */
export function getOrderTimelineEvents(orderId: string): OrderTimelineEvent[] {
  return inMemoryAuditStore.get(orderId) || [];
}
