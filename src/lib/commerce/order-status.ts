/**
 * KenDji Luxury — Order Status State Machine & Operational Enums
 */

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY_TO_SHIP"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED";

export type PaymentStatus =
  | "UNPAID"
  | "COLLECTED"
  | "RECONCILED"
  | "REFUNDED";

export type DeliveryStatus =
  | "PENDING"
  | "CREATED"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "FAILED"
  | "RETURNED"
  | "CANCELLED";

export interface OrderStatusConfig {
  label: string;
  labelAr?: string;
  description: string;
  badgeClass: string;
}

export const ORDER_STATUS_CONFIG: Record<OrderStatus, OrderStatusConfig> = {
  PENDING: {
    label: "Nouvelle Commande",
    labelAr: "طلب جديد",
    description: "Commande enregistrée sur le site, en attente de confirmation téléphonique.",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-300"
  },
  CONFIRMED: {
    label: "Confirmée",
    labelAr: "مؤكد",
    description: "Client contacté par téléphone, adresse et disponibilité validées.",
    badgeClass: "bg-blue-100 text-blue-800 border-blue-300"
  },
  PREPARING: {
    label: "En Préparation",
    labelAr: "قيد التحضير",
    description: "Pièces vérifiées, polies et emballées dans l'écrin luxe KenDji.",
    badgeClass: "bg-purple-100 text-purple-800 border-purple-300"
  },
  READY_TO_SHIP: {
    label: "Prête à Expédier",
    labelAr: "جاهز للشحن",
    description: "Colis scellé avec bordereau de transport édité, en attente du coursier.",
    badgeClass: "bg-indigo-100 text-indigo-800 border-indigo-300"
  },
  SHIPPED: {
    label: "Expédiée (En Transit)",
    labelAr: "تم الشحن",
    description: "Colis confié au transporteur express avec numéro de suivi actif.",
    badgeClass: "bg-sky-100 text-sky-800 border-sky-300"
  },
  DELIVERED: {
    label: "Livrée au Client",
    labelAr: "تم التوصيل",
    description: "Colis remis au destinataire contre paiement en espèces.",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300"
  },
  CANCELLED: {
    label: "Annulée",
    labelAr: "ملغى",
    description: "Commande annulée par le client ou suite à indisponibilité.",
    badgeClass: "bg-rose-100 text-rose-800 border-rose-300"
  },
  RETURNED: {
    label: "Retournée (Refus)",
    labelAr: "مرتجع",
    description: "Colis non réclamé ou refusé à la livraison, en retour vers l'atelier.",
    badgeClass: "bg-stone-100 text-stone-800 border-stone-300"
  }
};

/**
 * State Transition Rules Matrix
 * Defines strict valid operational progressions.
 */
const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY_TO_SHIP", "CANCELLED"],
  READY_TO_SHIP: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED", "RETURNED", "CANCELLED"],
  DELIVERED: ["RETURNED"], // In case of subsequent return/RMA
  CANCELLED: [], // Terminal state
  RETURNED: [] // Terminal state
};

/**
 * Validates whether transitioning from current to next status is permitted
 */
export function isValidOrderStatusTransition(current: OrderStatus, next: OrderStatus): boolean {
  if (current === next) return true; // Idempotent no-op
  const allowed = VALID_TRANSITIONS[current] || [];
  return allowed.includes(next);
}

/**
 * Retrieves the list of valid next operational states for a given status
 */
export function getAllowedNextTransitions(current: OrderStatus): OrderStatus[] {
  return VALID_TRANSITIONS[current] || [];
}
