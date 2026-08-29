/**
 * KenDji Luxury — Mock Courier Adapter (Local Sandbox & Development)
 */

import {
  CourierProvider,
  ShipmentCreationRequest,
  ShipmentCreationResult,
  NormalizedShipmentStatusResult
} from "../types";
import { DeliveryStatus } from "@/lib/commerce/order-status";

interface MockShipmentRecord {
  trackingNumber: string;
  orderNumber: string;
  codAmount: number;
  status: DeliveryStatus;
  createdAt: string;
  updatedAt: string;
}

const mockShipmentsDb = new Map<string, MockShipmentRecord>();

export class MockCourierAdapter implements CourierProvider {
  readonly name = "KenDji Express Sandbox (Mock Courier)";
  readonly code = "MOCK_EXPRESS";
  readonly isSandbox = true;

  async createShipment(request: ShipmentCreationRequest): Promise<ShipmentCreationResult> {
    // Basic validation
    if (!request.customer.phone || !request.customer.wilaya) {
      return {
        success: false,
        provider: this.code,
        deliveryStatus: "FAILED",
        error: "Coordonnées client ou wilaya manquantes."
      };
    }

    // Check if shipment for this order already exists (idempotency)
    for (const record of mockShipmentsDb.values()) {
      if (record.orderNumber === request.orderNumber) {
        return {
          success: true,
          provider: this.code,
          trackingNumber: record.trackingNumber,
          trackingUrl: this.getTrackingUrl(record.trackingNumber) || undefined,
          deliveryStatus: record.status,
          rawResponse: { note: "Existing shipment retrieved (Idempotent)" }
        };
      }
    }

    // Generate unique tracking number: KJ-TRK-XXXX
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    const trackingNumber = `KJ-TRK-${request.customer.wilaya}-${randomCode}`;

    const record: MockShipmentRecord = {
      trackingNumber,
      orderNumber: request.orderNumber,
      codAmount: request.codAmountToCollect,
      status: "CREATED",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockShipmentsDb.set(trackingNumber, record);

    return {
      success: true,
      provider: this.code,
      trackingNumber,
      trackingUrl: this.getTrackingUrl(trackingNumber) || undefined,
      deliveryStatus: "CREATED",
      rawResponse: {
        providerMessage: "Bordereau créé avec succès sur le banc d'essai.",
        simulatedHub: "Centre de Tri Alger",
        estimatedDays: request.customer.wilaya === "16" ? 1 : 2
      }
    };
  }

  async getShipmentStatus(trackingNumber: string): Promise<NormalizedShipmentStatusResult> {
    const record = mockShipmentsDb.get(trackingNumber);

    if (!record) {
      return {
        success: false,
        provider: this.code,
        trackingNumber,
        normalizedStatus: "FAILED",
        lastUpdated: new Date().toISOString(),
        error: `Numéro de suivi '${trackingNumber}' introuvable.`
      };
    }

    return {
      success: true,
      provider: this.code,
      trackingNumber,
      normalizedStatus: record.status,
      rawStatus: record.status,
      statusDescription: "Colis enregistré dans le simulateur de livraison KenDji.",
      location: "Alger Centre Hub",
      lastUpdated: record.updatedAt,
      codCollected: record.status === "DELIVERED",
      codAmountCollected: record.status === "DELIVERED" ? record.codAmount : 0
    };
  }

  async cancelShipment(trackingNumber: string, reason?: string): Promise<{ success: boolean; error?: string }> {
    const record = mockShipmentsDb.get(trackingNumber);
    if (!record) {
      return { success: false, error: `Colis introuvable pour annulation (${reason || 'aucun motif'}).` };
    }

    if (record.status === "DELIVERED") {
      return { success: false, error: "Impossible d'annuler un colis déjà livré." };
    }

    record.status = "CANCELLED";
    record.updatedAt = new Date().toISOString();
    return { success: true };
  }

  getTrackingUrl(trackingNumber: string): string | null {
    return `https://tracking.kendji-luxury.dz/mock/${trackingNumber}`;
  }
}
