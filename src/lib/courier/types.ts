/**
 * KenDji Luxury — Provider-Neutral Courier Abstraction
 */

import { DeliveryStatus } from "@/lib/commerce/order-status";

export interface ShipmentAddress {
  fullName: string;
  phone: string;
  additionalPhone?: string;
  wilaya: string; // e.g. "16"
  commune: string; // e.g. "Hydra"
  address: string;
}

export interface ShipmentItem {
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface ShipmentCreationRequest {
  orderId: string;
  orderNumber: string;
  customer: ShipmentAddress;
  items: ShipmentItem[];
  codAmountToCollect: number; // authoritative total in DZD
  deliveryMethod: "DOMICILE" | "STOP_DESK";
  declaredValue?: number;
  fragile?: boolean;
  notes?: string;
}

export interface ShipmentCreationResult {
  success: boolean;
  provider: string;
  trackingNumber?: string;
  trackingUrl?: string;
  deliveryStatus: DeliveryStatus;
  rawResponse?: Record<string, unknown>;
  error?: string;
}

export interface NormalizedShipmentStatusResult {
  success: boolean;
  provider: string;
  trackingNumber: string;
  normalizedStatus: DeliveryStatus;
  rawStatus?: string;
  statusDescription?: string;
  location?: string;
  lastUpdated: string;
  deliveredAt?: string;
  codCollected?: boolean;
  codAmountCollected?: number;
  failureReason?: string;
  error?: string;
}

export interface CourierProvider {
  readonly name: string;
  readonly code: string;
  readonly isSandbox: boolean;

  createShipment(request: ShipmentCreationRequest): Promise<ShipmentCreationResult>;
  getShipmentStatus(trackingNumber: string): Promise<NormalizedShipmentStatusResult>;
  cancelShipment(trackingNumber: string, reason?: string): Promise<{ success: boolean; error?: string }>;
  getTrackingUrl(trackingNumber: string): string | null;
}
